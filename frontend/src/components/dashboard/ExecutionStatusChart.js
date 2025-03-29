import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Charts.css';

/**
 * Componente de gráfico de status de execução usando Recharts
 * Exibe a distribuição de iniciativas por status de execução (Em Execução vs Concluídas)
 */
const ExecutionStatusChart = ({ initiatives }) => {
  console.log("ExecutionStatusChart - Montando componente");
  console.log("ExecutionStatusChart - initiatives recebidas:", initiatives);

  // Refs para o container do gráfico
  const chartContainerRef = useRef(null);
  // Estado para armazenar as dimensões do container
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Agrupar iniciativas por status de execução
  const executionCounts = {
    'EM_EXECUCAO': 0,
    'CONCLUIDA': 0
  };

  // Log all initiative statuses for debugging
  console.log("ExecutionStatusChart - Todos os status de iniciativas:", initiatives.map(i => i.status));
  
  // Count of each status type
  const statusDistribution = initiatives.reduce((counts, initiative) => {
    const status = initiative.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  console.log("ExecutionStatusChart - Distribuição de status:", statusDistribution);
  
  // Contar iniciativas por status de execução
  initiatives.forEach(initiative => {
    const status = initiative.status || 'NAO_INICIADA';
    if (status === 'CONCLUIDA') {
      executionCounts['CONCLUIDA']++;
    } else {
      // Qualquer outro status (EM_EXECUCAO, ATRASADA, NAO_INICIADA, NO_CRONOGRAMA)
      executionCounts['EM_EXECUCAO']++;
    }
  });

  console.log("ExecutionStatusChart - executionCounts após processamento:", executionCounts);

  // Define status colors
  const executionColors = {
    'EM_EXECUCAO': '#1d36b6', // Blue
    'CONCLUIDA': '#00b505', // Green
  };

  // Map status to readable names
  const executionNames = {
    'EM_EXECUCAO': 'Em Execução',
    'CONCLUIDA': 'Concluídas',
  };

  // Calculate total for percentages
  const total = Object.values(executionCounts).reduce((sum, count) => sum + count, 0);

  // Add debugging log
  console.log("ExecutionStatusChart - rendering with total:", total);

  // Prepare data for Recharts - filter out any status with zero count
  const chartData = Object.entries(executionCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: executionNames[status] || status,
      value: count,
      status: status,
      // Keep percentage calculation for the tooltip
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

  console.log("ExecutionStatusChart - chartData:", chartData);
  console.log("ExecutionStatusChart - chartData vazio?", chartData.length === 0);

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
      } else {
        console.warn('Chart container ref not available yet');
      }
    };
    
    logDimensions();
    // Verificar após um tempo para garantir que tudo está carregado
    const timer = setTimeout(logDimensions, 500);
    
    console.log("ExecutionStatusChart - containerDimensions atualizadas:", containerDimensions);

    // Adicionar listener para redimensionamento da janela
    const handleResize = () => {
      console.log('Window resized, rechecking dimensions');
      logDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="execution-status-chart">
      <div 
        ref={chartContainerRef} 
        className="recharts-container" 
        style={{ 
          width: '100%', 
          height: '300px',
          minHeight: '300px',
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.1)',
          overflow: 'visible'
        }}
      >
        {console.log('Attempting to render chart in container with dimensions:', containerDimensions)}
        
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
                    fill={executionColors[entry.status] || '#999999'}
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
            Aguardando dados de execução...
            {console.log('No execution data available yet')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionStatusChart;
