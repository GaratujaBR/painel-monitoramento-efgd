import React, { useState, useEffect, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './ObjectiveStatusChart.css';

const ObjectiveStatusChart = ({ initiatives = [], objectives = [] }) => {
  // DEBUG: Print the first initiative object for inspection
  console.log('First initiative:', initiatives && initiatives[0]);
  // DEBUG: Print the objectives array for inspection
  console.log('OBJECTIVES ARRAY:', objectives);

  const navigate = useNavigate();

  // Cores para o gráfico
  const performanceColors = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
  };

  // Mapeia o id do objetivo para o texto completo do objetivo
  const objectiveNameMap = {};
  objectives.forEach(obj => {
    if (obj.id && obj.name) {
      objectiveNameMap[obj.id] = obj.name;
    }
  });
  console.log('Objective Name Map:', objectiveNameMap); // DEBUG: Check the map

  // Função para processar os dados
  const processData = () => {
    const data = {};
    
    initiatives.forEach(initiative => {
      const objectiveId = initiative.objectiveId;
      const performance = initiative.performance;
      
      if (objectiveId) {
        const objectiveFullName = objectiveNameMap[objectiveId];
        // DEBUG: Log if fullName is missing for an ID
        if (!objectiveFullName) {
          console.warn(`Objective name not found in map for ID: ${objectiveId}`);
        }
        
        if (!data[objectiveId]) {
          data[objectiveId] = {
            id: objectiveId,
            name: objectiveId,
            fullName: objectiveFullName || `Objetivo ${objectiveId}`,
            'No Cronograma': 0,
            'Atrasada': 0
          };
        }
        
        if (performance === 'No Cronograma') {
          data[objectiveId]['No Cronograma']++;
        } else if (performance === 'Atrasada') {
          data[objectiveId]['Atrasada']++;
        }
      }
    });
    
    // Return sorted by ID (numeric conversion needed if IDs are strings)
    return Object.values(data).sort((a, b) => Number(a.id) - Number(b.id));
  };

  // Handler de clique para as barras
  const handleBarClick = (data, statusKey) => {
    if (!data || !data.payload || !data.payload.id) {
      console.error("ObjectiveChart: Dados inválidos recebidos no clique", data);
      return;
    }

    const objectiveId = data.payload.id;
    let statusFilterValue;

    if (statusKey === 'No Cronograma') {
      statusFilterValue = 'NO_CRONOGRAMA';
    } else if (statusKey === 'Atrasada') {
      statusFilterValue = 'ATRASADA';
    } else {
      console.error(`ObjectiveChart: Status inválido recebido: ${statusKey}`);
      return;
    }

    if (objectiveId && statusFilterValue) {
      navigate('/initiatives', { 
        state: { 
          initialFilters: { 
            objectiveId: objectiveId, 
            status: statusFilterValue 
          } 
        } 
      });
    }
  };

  // Componente para o tooltip customizado
  const CustomTooltip = memo(({ active, payload, label, objectivesMap }) => { 
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const style = isSmallScreen ? { maxWidth: '40vw' } : {};

    if (!active || !payload || !payload.length) {
      return null;
    }

    const objectiveId = label;
    const objectiveFullName = objectivesMap[objectiveId] || `Objetivo ${objectiveId}`;
    const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
    const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
    const total = noCronograma + atrasada;
    const noCronogramaPct = total > 0 ? ((noCronograma / total) * 100).toFixed(1) : 0;
    const atrasadaPct = total > 0 ? ((atrasada / total) * 100).toFixed(1) : 0;

    return (
      <div 
        className="custom-chart-tooltip" 
        style={style} 
      >
        <div className="tooltip-title">{objectiveFullName}</div>
        <div className="tooltip-item">
          <span style={{ color: performanceColors['No Cronograma'] }}>No Cronograma:</span>
          <span className="tooltip-value">{noCronograma} ({noCronogramaPct}%)</span>
        </div>
        <div className="tooltip-item">
          <span style={{ color: performanceColors['Atrasada'] }}>Atrasada:</span>
          <span className="tooltip-value">{atrasada} ({atrasadaPct}%)</span>
        </div>
        <div className="tooltip-total">
          <span>Total:</span>
          <span>{total} iniciativas</span>
        </div>
      </div>
    );
  });

  const chartData = processData();

  // Definir o tamanho da fonte base
  const baseFontSize = 17;

  return (
    <div 
      className="objective-chart-scroll-container"
      style={{
        minWidth: '0',
        width: '100%'
      }}>
      <ResponsiveContainer width="100%" height={500} minWidth={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 30, // Diminuir margem superior
            right: 10,
            left: 10,
            bottom: 20 // Diminuir margem inferior
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ 
              fontSize: 11,
              fill: '#222'
            }}
          />
          <YAxis 
            tick={{ 
              fontSize: baseFontSize,
              fill: '#222' 
            }}
          />
          <Tooltip 
            content={<CustomTooltip objectivesMap={objectiveNameMap} />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          /> 
          <Bar 
            barSize={20} 
            dataKey="No Cronograma" 
            stackId="a" 
            fill={performanceColors['No Cronograma']}
            radius={[5, 5, 0, 0]}
            onClick={(data, index, event) => handleBarClick(data, "No Cronograma")}
            cursor="pointer"
          />
          <Bar 
            barSize={20} 
            dataKey="Atrasada" 
            stackId="a" 
            fill={performanceColors['Atrasada']}
            radius={[5, 5, 0, 0]}
            onClick={(data, index, event) => handleBarClick(data, "Atrasada")}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Legenda personalizada fora do ResponsiveContainer */}
      <div className="custom-chart-legend">
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: performanceColors['No Cronograma'] }}></div>
          <span>No Cronograma</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: performanceColors['Atrasada'] }}></div>
          <span>Atrasada</span>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveStatusChart;
