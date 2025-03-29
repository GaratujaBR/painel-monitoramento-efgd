import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

const ObjectiveStatusChart = ({ initiatives, objectives = [] }) => {
  console.log('=== OBJECTIVE STATUS CHART - DIAGNÓSTICO ===');
  console.log('Iniciativas recebidas:', initiatives?.length);
  console.log('Objetivos recebidos:', objectives?.length);

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
  
  console.log('Mapeamento de objetivos:', objectiveNameMapping);
  console.log('Amostra de objetivos:', objectives.slice(0, 3));
  
  // Amostra de iniciativas para depuração
  if (initiatives && initiatives.length > 0) {
    console.log('Amostra de iniciativas:', initiatives.slice(0, 3));
    console.log('Propriedades de uma iniciativa:', Object.keys(initiatives[0]));
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
      console.log('Campo de performance detectado:', performanceFieldName);
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
        } else if (performance && performance !== 'No Cronograma' && performance !== 'Atrasada') {
          console.log(`Valor de performance não reconhecido: ${performance} para iniciativa ${initiative.id}`);
        }
      }
    });
    
    // Ajustar o valor de "No Cronograma" para evitar contagem dupla com "Concluída"
    Object.keys(data).forEach(objectiveId => {
      const noCronogramaOriginal = data[objectiveId]['No Cronograma'];
      const concluida = data[objectiveId]['Concluída'];
      
      // Uma iniciativa concluída sempre estará "No Cronograma" na coluna PERFORMANCE
      data[objectiveId]['No Cronograma'] = Math.max(0, noCronogramaOriginal - concluida);
      
      console.log(`Ajuste para Objetivo ${objectiveId}:`, {
        'No Cronograma (original)': noCronogramaOriginal,
        'Concluída': concluida,
        'No Cronograma (ajustado)': data[objectiveId]['No Cronograma']
      });
    });

    console.log('Dados processados por objetivo:', data);
    
    // Ordenar por ID do objetivo e converter para array
    return Object.entries(data)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([_, value]) => value);
  };

  const chartData = processData();
  console.log('Dados finais para o gráfico:', chartData);

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

  // Verificar qual é a situação do mapeamento de objetivos para o gráfico
  const areObjectivesNamesMapped = chartData.some(item => item.name && item.name.includes(' - '));
  console.log('Nomes de objetivos estão sendo mapeados corretamente?', areObjectivesNamesMapped);
  
  if (!areObjectivesNamesMapped) {
    console.log('Aviso: Os nomes completos dos objetivos podem não estar sendo exibidos.');
  }

  return (
    <div className="chart-container">
      <h3>Status por Objetivos</h3>
      <ResponsiveContainer width="100%" height={1000}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={330} 
            tick={{ fontSize: 14, fontWeight: 600 }}
            tickFormatter={(value) => {
              // Se o valor não for completo (sem " - "), tenta usar o mapeamento padrão
              if (value && !value.includes(" - ") && value.match(/^\d+$/)) {
                const defaultTexts = {
                  "1": "01 - Prover serviços públicos digitais personalizados, simples, de centrados no cidadão",
                  "2": "02 - Ofertar serviços digitais inclusivos",
                  "3": "03 - Aperfeiçoar a governança de dados e a interoperabilidade",
                  "4": "04 - Estimular o uso e a integração de plataformas e serviços de governo digital no governo federal",
                  "5": "05 - Estimular o uso e a integração de plataformas e serviços de governo digital com os entes e poderes da federação",
                  "6": "06 - Fomentar o uso inteligente de dados pelos órgãos do governo",
                  "7": "07 - Fomentar o ecossistema de inovação aberta",
                  "8": "08 - Desenvolver habilidades digitais dos servidores",
                  "9": "09 - Simplificar e integrar as jornadas dos cidadãos na utilização dos serviços",
                  "10": "10 - Implementar tecnologias e processos que apoiem a tomada de decisão",
                  "11": "11 - Fomentar a participação na criação e melhoria dos serviços digitais",
                  "12": "12 - Gerar capacidades para o governo digital",
                  "13": "13 - Fomentar a formação de equipes de transformação digital",
                  "14": "14 - Promover a adoção de metodologias ágeis na transformação digital",
                  "15": "15 - Promover a colaboração entre instituições",
                  "16": "16 - Adotar modelos inovadores de contratação de tecnologia"
                };
                return defaultTexts[value] || value;
              }
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            barSize={20} 
            dataKey="Concluída" 
            name="Concluída" 
            fill="#00b505" 
            stackId="a"
          />
          <Bar 
            barSize={20} 
            dataKey="No Cronograma" 
            name="No Cronograma" 
            fill="#203ce2" 
            stackId="a"
          />
          <Bar 
            barSize={20} 
            dataKey="Atrasada" 
            name="Atrasada" 
            fill="#920a0a" 
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ObjectiveStatusChart;
