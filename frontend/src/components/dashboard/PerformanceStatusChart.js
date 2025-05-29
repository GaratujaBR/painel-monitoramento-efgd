import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Charts.css'; // Importa os estilos dos gráficos

const PerformanceStatusChart = ({ onSchedule, delayed }) => {
  const navigate = useNavigate();
  const performanceColors = {
    'No Cronograma': 'var(--color-blue)', // Azul para 'No Cronograma'
    'Em Atraso': 'var(--color-red)',    // Vermelho para 'Em Atraso'
  };

  const data = [
    { 
      name: 'No Cronograma', 
      value: onSchedule, 
      color: performanceColors['No Cronograma'],
      link: '/initiatives?status=no%20cronograma'
    },
    { 
      name: 'Em Atraso', 
      value: delayed, 
      color: performanceColors['Em Atraso'],
      link: '/initiatives?status=delayed'
    },
  ];

  // Filtra dados com valor 0 para não renderizar fatias vazias ou legendas desnecessárias
  const filteredData = data.filter(entry => entry.value > 0);

  // Custom tooltip para o gráfico de pizza
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentData = payload[0].payload;
      const totalInitiatives = onSchedule + delayed;
      const percentage = totalInitiatives > 0 ? ((currentData.value / totalInitiatives) * 100).toFixed(1) : 0;
      return (
        <div className="recharts-custom-tooltip">
          <p className="tooltip-label">{currentData.name}</p>
          <p className="tooltip-value">{currentData.value} iniciativas ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  // Se não houver dados filtrados, exibe uma mensagem
  if (filteredData.length === 0) {
    return (
      <div className="performance-status-chart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>Não há dados de performance para exibir.</div>
      </div>
    );
  }

  return (
    <div className="performance-status-chart"> {/* Adiciona o wrapper div */}
      <div 
        className="recharts-container" 
        style={{
          width: '100%', 
          height: '400px',
          minHeight: '400px',
          position: 'relative',
          border: 'none',
          overflow: 'visible'
        }}
      >
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={70} // Adiciona innerRadius para efeito de donut
            outerRadius={120}
            fill="#8884d8" // Cor de preenchimento padrão, substituída por Cell
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {filteredData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                onClick={() => navigate(entry.link)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            align="center" 
            verticalAlign="bottom" 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square" // Adiciona ícones quadrados
            formatter={(value) => <span style={{ color: 'black' }}>{value}</span>} // Texto da legenda em preto
          />
        </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceStatusChart;
