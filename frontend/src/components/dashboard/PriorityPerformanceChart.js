import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getApiUrl } from '../../utils/apiUrl';

const PriorityPerformanceChart = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartWrapperRef = useRef(null);

  useEffect(() => {
    if (chartWrapperRef.current) {
      const rect = chartWrapperRef.current.getBoundingClientRect();
      
    }
  });

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
          value
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
  const outerRadius = 100;

  const COLORS = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
    'Não Definido': 'var(--color-blue)',
    'Concluída': 'var(--color-blue)'
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
        style={{ height: '320px' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={1}
              dataKey="value"
              label={({ name, value }) => `${Math.round((value / total) * 100)}%`}
              onAnimationStart={() => {
                
              }}
            >
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || '#999999'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${Math.round((value / total) * 100)}%)`,
                name
              ]}
            />
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
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityPerformanceChart;
