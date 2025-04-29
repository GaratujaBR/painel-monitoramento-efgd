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
      const rect = chartWrapperRef.current.getBoundingClientRect();
    }
  }, []); // Only run on mount

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

  const innerRadius = 60;
  const outerRadius = 90;

  const COLORS = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
    'Não Definido': 'var(--color-blue)',
    'Concluída': 'var(--color-blue)'
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

  const total = performanceData.reduce((sum, item) => sum + item.value, 0);

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
              innerRadius={innerRadius}
              outerRadius={outerRadius}
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
            <Tooltip />
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
