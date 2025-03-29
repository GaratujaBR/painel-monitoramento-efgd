import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Charts.css'; // Make sure this file doesn't contain conflicting styles

/**
 * Componente de gráfico de status de iniciativas usando Recharts
 * Exibe a distribuição de iniciativas por status em um gráfico de pizza/donut
 */
const InitiativeStatusChart = ({ initiatives }) => {
  console.log("InitiativeStatusChart - Montando componente"); // Added log
  console.log("InitiativeStatusChart - initiatives recebidas:", initiatives); // Added log
  console.log("InitiativeStatusChart - initiatives vazias?", !initiatives || initiatives.length === 0); // Added log

  // Refs para o container do gráfico
  const chartContainerRef = useRef(null);
  // Estado para armazenar as dimensões do container
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Count initiatives by performance (not status)
  const performanceCounts = initiatives.reduce((counts, initiative) => {
    // Normalize performance value
    let performance = 'DESCONHECIDO';
    if (initiative.performance) {
      const perfLower = initiative.performance.toString().toLowerCase();
      if (perfLower.includes('atrasada')) {
        performance = 'ATRASADA';
      } else if (perfLower.includes('cronograma')) {
        performance = 'NO_CRONOGRAMA';
      }
    }
    counts[performance] = (counts[performance] || 0) + 1;
    return counts;
  }, {});

  console.log("InitiativeStatusChart - performanceCounts:", performanceCounts);
  console.log("InitiativeStatusChart - Alguma performance com contagem > 0?", Object.values(performanceCounts).some(count => count > 0));

  // Define status colors according to government guidelines
  const statusColors = {
    'CONCLUIDA': '#00b505', // Green
    'NO_CRONOGRAMA': '#1d36b6', // Blue (Adjusted based on image) - Original was '#0060ff'
    'NAO_INICIADA': '#999999', // Gray
    'ATRASADA': '#920a0a', // Red (Adjusted based on image) - Original was '#ff0000'
    'unknown': '#999999' // Gray
  };

  // Map status to readable names
  const statusNames = {
    'NAO_INICIADA': 'Não Iniciada',
    'NO_CRONOGRAMA': 'No Cronograma',
    'ATRASADA': 'Em Atraso',
    'CONCLUIDA': 'Concluída',
    'unknown': 'Desconhecido'
  };

  // Calculate total for percentages
  const total = Object.values(performanceCounts).reduce((sum, count) => sum + count, 0);

  // Add debugging log
  console.log("InitiativeStatusChart - rendering with total:", total);
  console.log("InitiativeStatusChart - performance counts:", performanceCounts);
  console.log("InitiativeStatusChart - container dimensions:", containerDimensions);

  // Prepare data for Recharts - filter out any performance with zero count
  const chartData = Object.entries(performanceCounts)
    .filter(([performance, count]) => count > 0 && (performance === 'NO_CRONOGRAMA' || performance === 'ATRASADA'))
    .map(([performance, count]) => ({
      name: statusNames[performance] || performance,
      value: count,
      status: performance, // We use 'status' for color mapping
      // Keep percentage calculation for the tooltip
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

  // Add after chart data preparation
  console.log("InitiativeStatusChart - chartData:", chartData); // Renamed log
  console.log("InitiativeStatusChart - chartData vazio?", chartData.length === 0); // Added log

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="recharts-custom-tooltip" style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
          <p className="tooltip-label" style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p className="tooltip-value" style={{ margin: '5px 0 0 0' }}>{data.value} iniciativas ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  // useEffect para depuração e ajuste
  useEffect(() => {
    const logDimensions = () => {
      if (chartContainerRef.current) {
        const containerRect = chartContainerRef.current.getBoundingClientRect();
        console.log('Chart Container Dimensions:', {
          width: containerRect.width,
          height: containerRect.height,
          top: containerRect.top,
          left: containerRect.left,
          right: containerRect.right,
          bottom: containerRect.bottom
        });
        
        // Store dimensions in state
        setContainerDimensions({
          width: containerRect.width,
          height: containerRect.height
        });
        
        // Log parent element dimensions
        const parentRect = chartContainerRef.current.parentElement.getBoundingClientRect();
        console.log('Parent Container Dimensions:', {
          width: parentRect.width,
          height: parentRect.height,
          top: parentRect.top,
          left: parentRect.left
        });
        
        // Check computed styles
        const computedStyle = window.getComputedStyle(chartContainerRef.current);
        console.log('Container Computed Style:', {
          position: computedStyle.position,
          display: computedStyle.display,
          overflow: computedStyle.overflow,
          zIndex: computedStyle.zIndex
        });
      } else {
        console.warn('Chart container ref not available yet');
      }
    };
    
    logDimensions();
    // Verificar após um tempo para garantir que tudo está carregado
    const timer = setTimeout(logDimensions, 500);
    
    console.log("InitiativeStatusChart - containerDimensions atualizadas:", containerDimensions); // Added log

    // Adicionar listener para redimensionamento da janela
    const handleResize = () => {
      console.log('Window resized, rechecking dimensions');
      logDimensions();
    };
    
    window.addEventListener('resize', handleResize);

    // Log computed styles
    const chartElement = document.querySelector('.initiative-status-chart');
    if (chartElement) {
      const computedStyle = window.getComputedStyle(chartElement);
      console.log("InitiativeStatusChart - Estilos computados:", {
        display: computedStyle.display,
        position: computedStyle.position,
        width: computedStyle.width,
        height: computedStyle.height,
        visibility: computedStyle.visibility
      });
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="initiative-status-chart">
      <div 
        ref={chartContainerRef} 
        className="recharts-container" 
        style={{ 
          width: '100%', 
          height: '300px', // Altura fixa para garantir que o gráfico seja visível
          minHeight: '300px', // Altura mínima para evitar compressão excessiva
          position: 'relative', // Importante para o posicionamento absoluto interno
          border: '1px solid rgba(0,0,0,0.1)', // Borda para debug visual
          overflow: 'visible' // Alterado de 'hidden' para 'visible' para garantir que o gráfico seja exibido
        }}
      >
        {/* Log rendering attempt */}
        {console.log('Attempting to render chart in container with dimensions:', containerDimensions)}
        {console.log("InitiativeStatusChart - Condição de renderização:", containerDimensions.width > 0 && containerDimensions.height > 0)} {/* Added log */}
        
        {/* Renderizar o gráfico independentemente das dimensões do container */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.status] || '#999999'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Aguardando dimensionamento do container...
            {console.log('Container not properly sized yet')}
          </div>
        )}
      </div>
    </div>
  );
};

export default InitiativeStatusChart;
