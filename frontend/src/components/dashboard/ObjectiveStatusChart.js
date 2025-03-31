import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

const ObjectiveStatusChart = ({ initiatives, objectives = [] }) => {
  // Mapear os objetivos por ID para exibição correta
  const objectiveNameMapping = {};
  
  if (objectives && objectives.length > 0) {
    objectives.forEach(objective => {
      // Verificar diferentes possíveis nomes de propriedade para o nome do objetivo
      // Usar o texto completo do objetivo como mostrado na planilha
      const objectiveName = objective.objetivo || objective.name || objective.OBJETIVO || objective.description;
      if (objective.id) {
        objectiveNameMapping[objective.id] = objectiveName;
      }
    });
  }
  
  // Caso não tenhamos mapeamentos suficientes, adicionar os IDs dos objetivos com textos padrão
  // baseados na sua planilha
  if (Object.keys(objectiveNameMapping).length < 3) {
    const defaultObjectiveTexts = {
      1: "01 - Prover serviços públicos digitais personalizados, simples, de centrados no cidadão",
      2: "02 - Ofertar serviços digitais inclusivos",
      3: "03 - Aperfeiçoar a governança de dados e a interoperabilidade"
    };
    
    // Adicionar mapeamentos padrão se não existirem
    for (const [id, text] of Object.entries(defaultObjectiveTexts)) {
      if (!objectiveNameMapping[id]) {
        objectiveNameMapping[id] = text;
      }
    }
  }

  // Define status colors according to government guidelines
  const performanceColors = {
    'No Cronograma': '#203ce2', // Blue
    'Atrasada': '#920a0a', // Red
    'Concluída': '#00b505', // Green
  };

  // Processar dados para o gráfico
  const processData = () => {
    const data = {};
    let performanceFieldName = null;
    
    // Determinar o nome correto do campo de performance verificando a primeira iniciativa
    if (initiatives && initiatives.length > 0) {
      const firstInitiative = initiatives[0];
      if (firstInitiative.performance) {
        performanceFieldName = 'performance';
      } else if (firstInitiative.PERFORMANCE) {
        performanceFieldName = 'PERFORMANCE';
      }
    }
    
    // Se não conseguirmos detectar o campo, usar 'performance' como padrão
    if (!performanceFieldName) {
      performanceFieldName = 'performance';
    }
    
    initiatives?.forEach(initiative => {
      const objectiveId = initiative.objectiveId;
      const performance = initiative[performanceFieldName];
      
      if (objectiveId) {
        if (!data[objectiveId]) {
          // Buscar o nome do objetivo mapeado ou usar o ID como fallback
          const objectiveName = objectiveNameMapping[objectiveId] || `Objetivo ${objectiveId}`;
          
          data[objectiveId] = {
            id: objectiveId,
            name: objectiveName,
            'Concluída': 0,
            'No Cronograma': 0,
            'Atrasada': 0
          };
        }
        
        // Contar iniciativas concluídas com base no status
        if (initiative.status === 'CONCLUIDA') {
          data[objectiveId]['Concluída']++;
        }
        
        // Usar exatamente os valores da coluna PERFORMANCE
        if (performance === 'No Cronograma') {
          data[objectiveId]['No Cronograma']++;
        } else if (performance === 'Atrasada') {
          data[objectiveId]['Atrasada']++;
        }
      }
    });
    
    // Ajustar o valor de "No Cronograma" para evitar contagem dupla com "Concluída"
    Object.keys(data).forEach(objectiveId => {
      const noCronogramaOriginal = data[objectiveId]['No Cronograma'];
      const concluida = data[objectiveId]['Concluída'];
      
      // Uma iniciativa concluída sempre estará "No Cronograma" na coluna PERFORMANCE
      data[objectiveId]['No Cronograma'] = Math.max(0, noCronogramaOriginal - concluida);
    });
    
    // Ordenar por ID do objetivo e converter para array
    return Object.entries(data)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([_, value]) => value);
  };

  const chartData = processData();

  // Custom tooltip para mostrar detalhes
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const concluida = payload.find(p => p.dataKey === 'Concluída')?.value || 0;
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = concluida + noCronograma + atrasada;
      
      const concluidaPct = total > 0 ? Math.round((concluida / total) * 100) : 0;
      const noCronogramaPct = total > 0 ? Math.round((noCronograma / total) * 100) : 0;
      const atrasadaPct = total > 0 ? Math.round((atrasada / total) * 100) : 0;

      // Formatar o label para mostrar "Objetivo X" se for apenas número
      const formattedLabel = label && label.match(/^\d+$/) ? `Objetivo ${label}` : label;
      
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
          }}>{formattedLabel}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#00b505' }}>Concluída:</span>
            <span style={{ fontWeight: '500' }}>{concluida} ({concluidaPct}%)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#203ce2' }}>No Cronograma:</span>
            <span style={{ fontWeight: '500' }}>{noCronograma} ({noCronogramaPct}%)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            <span style={{ color: '#920a0a' }}>Atrasada:</span>
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

  // Verificar se temos nomes completos para os objetivos
  const hasFullObjectiveNames = chartData.some(item => item.name && item.name.includes(' - '));

  return (
    <div className="chart-container objective-status-chart">
      <h3>Status por Objetivo</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 120
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Concluída" stackId="a" fill={performanceColors['Concluída']} />
          <Bar dataKey="No Cronograma" stackId="a" fill={performanceColors['No Cronograma']} />
          <Bar dataKey="Atrasada" stackId="a" fill={performanceColors['Atrasada']} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ObjectiveStatusChart;
