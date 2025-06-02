import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getApiUrl } from '../../utils/apiUrl';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useInitiatives } from '../../context/InitiativesContext'; // Import useInitiatives
import './PriorityPerformanceChart.css';

const PriorityPerformanceChart = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartWrapperRef = useRef(null);

  const navigate = useNavigate(); // Get navigate function
  const { applyFiltersAndNavigate } = useInitiatives(); // Get applyFiltersAndNavigate from context

  useEffect(() => {
    if (chartWrapperRef.current) {
      // eslint-disable-next-line no-unused-vars
      const rect = chartWrapperRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/api/initiatives/priority-performance`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados de performance');
        }
        const rawData = await response.json();
        // Transformar os dados para o formato esperado pelo gráfico
        const chartData = Object.entries(rawData).map(([name, value]) => ({
          name,
          value,
          priorityValue: name // Store the original priority value
        }));
        setPerformanceData(chartData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados de performance:', err); 
        setError('Erro ao carregar dados de performance das iniciativas prioritárias');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
    'Não Definido': 'var(--color-medium-gray)', // Changed for better distinction
    'Concluída': 'var(--color-green)' // Standardized color
  };

  // Calculate total for percentages, memoized for performance
  const total = useMemo(() => {
    if (!performanceData) return 0;
    return performanceData.reduce((sum, item) => sum + item.value, 0);
  }, [performanceData]);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const style = isSmallScreen ? { maxWidth: '45vw', fontSize: '11px' } : { fontSize: '12px' }; // Adjusted for pie chart context

    if (active && payload && payload.length) {
      const data = payload[0].payload; // Data for the hovered slice
      const statusName = data.name;
      const statusValue = data.value;
      const percentage = total > 0 ? Math.round((statusValue / total) * 100) : 0;

      return (
        <div className="custom-chart-tooltip" style={style}>
          <div className="tooltip-title">
            <span style={{ color: COLORS[statusName] || '#666' }}>{statusName}</span>
          </div>
          <div className="tooltip-item">
            <span>Iniciativas:</span>
            <span className="tooltip-value">{statusValue} ({percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleSliceClick = (data) => {
    if (data && data.payload && data.payload.name) {
      const statusValue = data.payload.name;
      console.log(`Filtrando por Prioridade Externa: SIM e Status: ${statusValue}`);
      // Corrigido: usar a chave 'priority' conforme definido no context
      applyFiltersAndNavigate({ priority: 'SIM', status: statusValue }); 
    } else {
      console.warn('PriorityPerformanceChart: Clicked slice data missing name', data);
    }
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Performance das Iniciativas Prioritárias</h2>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Performance das Iniciativas Prioritárias</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Performance das Prioritárias</h2>
        <p>Não há dados de iniciativas prioritárias para exibir.</p>
      </div>
    );
  }



  return (
    <div className="chart-container">
      <h2 className="chart-title">Performance das Prioritárias</h2>
      <div
        className="chart-wrapper"
        ref={chartWrapperRef}
      >
        <ResponsiveContainer width="100%" height={700} minWidth={400}>
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Adiciona innerRadius para efeito de donut
              outerRadius={100}
              paddingAngle={1}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${Math.round((value / total) * 100)}%`}
              onClick={handleSliceClick}
              style={{ cursor: 'pointer' }}
            >
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || '#999999'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {performanceData.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: COLORS[entry.name] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityPerformanceChart;
