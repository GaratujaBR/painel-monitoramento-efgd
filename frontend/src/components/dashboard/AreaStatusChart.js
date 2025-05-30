import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import InitiativesContext from '../../context/InitiativesContext';
import './DashboardCharts.css'; // Assuming common styles for dashboard charts

const AreaStatusChart = () => {
  const navigate = useNavigate();
  const { initiatives } = useContext(InitiativesContext);

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

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload;
      const barNameKey = data.activePayload[0].dataKey; // 'Atrasada' or 'NoCronograma'

      const areaIdForFilter = payload.name; // 'name' holds the areaId
      let statusFilter = '';

      if (barNameKey === 'Atrasada') {
        statusFilter = 'Atrasada';
      } else if (barNameKey === 'NoCronograma') {
        statusFilter = 'No Cronograma';
      }

      if (areaIdForFilter && areaIdForFilter !== 'N/A' && statusFilter) {
        navigate('/initiatives', {
          state: {
            initialFilters: {
              areaId: areaIdForFilter,
              status: statusFilter,
            },
          },
        });
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
            top: 20, right: 30, left: 120, bottom: 20, // Increased left margin for area names
          }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} // Adjust width for YAxis labels (area names)
            interval={0} // Show all labels
          />
          <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.total > 0 ? ((value / props.payload.total) * 100).toFixed(1) : '0.0'}%)`, name]} />
          <Legend wrapperStyle={{ color: '#000000' }} iconSize={15} />
          <Bar dataKey="Atrasada" stackId="a" fill="#ff0000" name="Atrasada" barSize={24} radius={[4, 4, 0, 0]} onClick={(data) => handleBarClick(data, 'Atrasada')} />
          <Bar dataKey="NoCronograma" stackId="a" fill="#183EFF" name="No Cronograma" barSize={24} radius={[4, 4, 0, 0]} onClick={(data) => handleBarClick(data, 'No Cronograma')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaStatusChart;
