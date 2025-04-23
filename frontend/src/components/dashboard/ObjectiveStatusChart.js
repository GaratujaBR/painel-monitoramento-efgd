import React, { useState, useEffect } from 'react';
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
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = noCronograma + atrasada;

      const noCronogramaPct = total > 0 ? Math.round((noCronograma / total) * 100) : 0;
      const atrasadaPct = total > 0 ? Math.round((atrasada / total) * 100) : 0;

      // Exibe apenas o texto completo do objetivo (fullName) vindo do payload
      const fullName = payload[0]?.payload?.fullName;
      // DEBUG: Log the fullName being used in the tooltip
      // console.log('Tooltip - FullName:', fullName);

      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-title">
            {/* Display ONLY the full name. No fallbacks here. */}
            <span>{fullName}</span> 
          </div>
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
    }
    return null;
  };

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
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{
            top: 60, // Diminuir margem superior
            right: 60,
            left: 60,
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
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            wrapperStyle={{ 
              maxWidth: 350,
              whiteSpace: 'normal',
              zIndex: 10000,
              pointerEvents: 'auto'
            }}
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
        
        {/* Legenda externa personalizada */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '10px', // Diminuir espaço entre gráfico e legenda
          gap: '15px',
          fontSize: baseFontSize + 1,
          fontWeight: '500'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: performanceColors['No Cronograma'],
              marginRight: '10px',
              borderRadius: '3px'
            }}></div>
            <span>No Cronograma</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: performanceColors['Atrasada'],
              marginRight: '10px',
              borderRadius: '3px'
            }}></div>
            <span>Atrasada</span>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default ObjectiveStatusChart;
