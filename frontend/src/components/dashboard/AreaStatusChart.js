import React, { useContext, useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import InitiativesContext from '../../context/InitiativesContext';
import './DashboardCharts.css'; // Assuming common styles for dashboard charts

const AreaStatusChart = () => {
  const navigate = useNavigate();
  const { initiatives } = useContext(InitiativesContext);

  const [yAxisTickFontSize, setYAxisTickFontSize] = useState(window.innerWidth <= 500 ? 13 : 16);

  useEffect(() => {
    const handleResize = () => {
      setYAxisTickFontSize(window.innerWidth <= 500 ? 13 : 16);
    };

    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  const chartData = useMemo(() => {
    if (!initiatives || initiatives.length === 0) {
      return [];
    }

    const initiativesByArea = initiatives.reduce((acc, initiative) => {
      const areaId = initiative.areaId || 'N/A'; // Handle initiatives without an areaId
      
      if (!acc[areaId]) {
        acc[areaId] = {
          name: areaId, // Using areaId as the name for display, can be mapped to a full name if available
          total: 0,
          Atrasada: 0,
          NoCronograma: 0,
        };
      }
      acc[areaId].total++;
      // ESTA É A PARTE CRÍTICA - AGORA USANDO initiative.performance
      if (initiative.performance === 'Atrasada') {
        acc[areaId].Atrasada++;
      } else if (initiative.performance === 'No Cronograma') {
        acc[areaId].NoCronograma++;
      }
      return acc;
    }, {});

    const processedData = Object.values(initiativesByArea).map(area => ({
      ...area,
      proportionDelayed: area.total > 0 ? area.Atrasada / area.total : 0,
    }));

    // Sort by proportion of delayed initiatives (descending)
    processedData.sort((a, b) => b.proportionDelayed - a.proportionDelayed);

    return processedData;
  }, [initiatives]);

  // Modificado para aceitar o payload da área e o nome do status diretamente
  const handleBarClick = (areaPayload, statusName) => {
    console.log('[AreaStatusChart] handleBarClick chamado com:', areaPayload, statusName);
    if (areaPayload && statusName) {
      const areaIdForFilter = areaPayload.name; // 'name' em areaPayload é o areaId

      // Verifica se areaIdForFilter é válido e não 'N/A'
      if (areaIdForFilter && areaIdForFilter !== 'N/A') {
        console.log(`[AreaStatusChart] Navegando para: /initiatives?areaId=${areaIdForFilter}&status=${statusName}`);
        navigate(`/initiatives?areaId=${encodeURIComponent(areaIdForFilter)}&status=${encodeURIComponent(statusName)}`);
      } else {
        console.log('[AreaStatusChart] Condição para navegação não atendida. areaIdForFilter:', areaIdForFilter, 'statusName:', statusName);
      }
    }
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="dashboard-chart-container area-status-chart">
        <h3 className="chart-title">Performance por Área</h3>
        <p>Não há dados suficientes para exibir o gráfico.</p>
      </div>
    );
  }

  // Dynamically adjust height based on the number of areas
  const chartHeight = Math.max(300, 50 + chartData.length * 40);

  return (
    <div className="dashboard-chart-container area-status-chart">
      
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20, right: 30, left: 60, bottom: 20, // Reduced left margin
          }}
          // onClick={handleBarClick} // Removido daqui
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} // Adjust width for YAxis labels (area names)
            interval={0} // Show all labels
            tick={{ fontSize: yAxisTickFontSize }} // Dynamically set font size for Y-axis ticks
          />
          <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.total > 0 ? ((value / props.payload.total) * 100).toFixed(1) : '0.0'}%)`, name]} />
          {/* <Legend wrapperStyle={{ color: '#000000' }} iconSize={15} /> */}
          <Bar 
            dataKey="Atrasada" 
            stackId="a" 
            fill="#ff0000" 
            name="Atrasada" 
            barSize={24} 
            radius={[4, 4, 0, 0]} 
            style={{ cursor: 'pointer' }} // Adicionado cursor pointer
            onClick={(data) => {
              console.log('[AreaStatusChart] Bar Atrasada clicada, data:', data);
              handleBarClick(data.payload, 'Atrasada');
            }} 
          />
          <Bar 
            dataKey="NoCronograma" 
            stackId="a" 
            fill="#183EFF" 
            name="No Cronograma" 
            barSize={24} 
            radius={[4, 4, 0, 0]} 
            style={{ cursor: 'pointer' }} // Adicionado cursor pointer
            onClick={(data) => {
              console.log('[AreaStatusChart] Bar NoCronograma clicada, data:', data);
              handleBarClick(data.payload, 'No Cronograma');
            }} 
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Custom HTML Legend */}
      <div className="chart-legend" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '15px',
              height: '15px',
              backgroundColor: '#ff0000', // Red for Atrasada
              marginRight: '8px',
              borderRadius: '2px'
            }}
          />
          <span style={{ color: '#000000', fontSize: '18px' }}>Atrasada</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '15px',
              height: '15px',
              backgroundColor: '#183EFF', // Blue for No Cronograma
              marginRight: '8px',
              borderRadius: '2px'
            }}
          />
          <span style={{ color: '#000000', fontSize: '18px' }}>No Cronograma</span>
        </div>
      </div>
    </div>
  );
};

export default AreaStatusChart;
