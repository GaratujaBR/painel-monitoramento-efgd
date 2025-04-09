import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './ObjectiveStatusChart.css';

const ObjectiveStatusChart = ({ initiatives, objectives }) => {
  const navigate = useNavigate();

  // Cores para o gráfico
  const performanceColors = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
  };

  // Função para processar os dados
  const processData = () => {
    const data = {};
    
    initiatives.forEach(initiative => {
      const objectiveId = initiative.objectiveId;
      const performance = initiative.performance;
      
      if (objectiveId) {
        // Aqui vamos usar apenas o ID do objetivo para o nome no gráfico
        // Mantendo apenas o número do objetivo para o eixo X
        
        if (!data[objectiveId]) {
          data[objectiveId] = {
            id: objectiveId,
            name: objectiveId, // Usando apenas o ID como nome para o eixo X
            fullName: objectives.find(obj => obj.id === objectiveId)?.name || objectiveId, // Guardando o nome completo
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
    
    return Object.entries(data).map(([_, value]) => value);
  };

  // Manipulador de clique para as barras
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
          filters: { 
            objectiveId: objectiveId, 
            status: statusFilterValue 
          } 
        } 
      });
    }
  };

  // Componente para o tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Encontra os valores para cada status no payload
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = noCronograma + atrasada;
      
      // Calcula as porcentagens
      const noCronogramaPct = total > 0 ? Math.round((noCronograma / total) * 100) : 0;
      const atrasadaPct = total > 0 ? Math.round((atrasada / total) * 100) : 0;
      
      // Obtém o nome completo do objetivo
      const fullObjectiveName = payload[0]?.payload?.fullName || label;
      // Formata o título como "ID - Nome completo"
      const tooltipTitle = `${label} - ${fullObjectiveName}`;

      return (
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '14px',
          minWidth: '200px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
          }}>{tooltipTitle}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: 'var(--color-blue)' }}>No Cronograma:</span>
            <span style={{ fontWeight: '500' }}>{noCronograma} ({noCronogramaPct}%)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: 'var(--color-red)' }}>Atrasada:</span>
            <span style={{ fontWeight: '500' }}>{atrasada} ({atrasadaPct}%)</span>
          </div>
          
          <div style={{
            marginTop: '10px', 
            paddingTop: '5px', 
            borderTop: '1px solid #eee',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
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
            radius={[0, 0, 5, 5]}
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
