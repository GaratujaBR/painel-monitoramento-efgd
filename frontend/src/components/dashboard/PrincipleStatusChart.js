import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Charts.css';

/**
 * Componente de gráfico de status por princípio usando Recharts
 * Exibe a distribuição de status para cada princípio em um gráfico de barras empilhadas
 */
const PrincipleStatusChart = ({ initiatives, principles = [] }) => {
  console.log('=== PRINCIPLE STATUS CHART - DADOS ===');
  console.log('Iniciativas:', initiatives?.length || 0);
  console.log('Princípios:', principles?.length || 0);

  // Define status colors according to government guidelines
  const performanceColors = {
    'No Cronograma': '#203ce2', // Blue
    'Atrasada': '#920a0a', // Red
    'Concluída': '#00b505', // Green
  };

  // Map status to readable names
  const performanceNames = {
    'No Cronograma': 'No Cronograma',
    'Atrasada': 'Atrasada',
    'Concluída': 'Concluída',
  };

  // Mapeamento manual dos IDs numéricos para os nomes completos de princípios
  const principleNameMapping = {
    1: "I - Governo Centrado no Cidadão e Inclusivo",
    2: "II - Governo Integrado e Colaborativo",
    3: "III - Governo Digital e Eficiente",
    4: "IV - Governo Confiável e Seguro", // Garante que ID 4 seja mapeado corretamente
    5: "V - Governo Transparente e Aberto",
    6: "VI - Governo Orientado por Dados"
  };
  
  console.log('Mapeamento manual de princípios:', principleNameMapping);

  // Normalizar o principleId para garantir consistência
  const normalizeInitiatives = (initiatives || []).map(initiative => {
    const newInitiative = {...initiative};
    
    // Se o principleId for "IV", converter para 4
    if (newInitiative.principleId === "IV") {
      newInitiative.principleId = 4;
      console.log("Convertido principleId 'IV' para 4");
    }
    
    // Garantir que temos a performance correta
    if (!newInitiative.performance) {
      // Se não tiver performance, tentar usar o status
      console.log(`Iniciativa sem performance definida: ${newInitiative.id}`);
    }
    
    return newInitiative;
  });
  
  // Agrupar por princípio
  const initiativesByPrinciple = {};
  
  // Primeiro agrupar todas as iniciativas por principleId
  normalizeInitiatives.forEach(initiative => {
    // Se não tiver principleId, pular
    if (!initiative.principleId) {
      console.log(`Iniciativa sem principleId: ${initiative.id}`);
      return;
    }
    
    // Normalizar para string para evitar problemas de tipo
    const principleId = String(initiative.principleId);
    
    if (!initiativesByPrinciple[principleId]) {
      initiativesByPrinciple[principleId] = {
        id: principleId,
        name: principleNameMapping[initiative.principleId] || `Princípio ${principleId}`,
        initiatives: []
      };
    }
    
    initiativesByPrinciple[principleId].initiatives.push(initiative);
  });
  
  console.log('Princípios encontrados:', Object.keys(initiativesByPrinciple));
  Object.entries(initiativesByPrinciple).forEach(([key, value]) => {
    console.log(`Princípio ${key} (${value.name}): ${value.initiatives.length} iniciativas`);
  });

  // Processar dados para o gráfico
  let processedData = Object.values(initiativesByPrinciple).map(principle => {
    // Inicializar contagens
    let noCronogramaCount = 0;
    let atrasadaCount = 0;
    let concluidaCount = 0;
    
    // Contar iniciativas por status e performance
    principle.initiatives.forEach(initiative => {
      // Contar concluídas com base no status
      if (initiative.status === 'CONCLUIDA') {
        concluidaCount++;
      }
      
      // Contar por performance
      if (initiative.performance === 'No Cronograma') {
        noCronogramaCount++;
      } else if (initiative.performance === 'Atrasada') {
        atrasadaCount++;
      } else {
        console.log(`Iniciativa com performance não reconhecida: ${initiative.id}, performance: ${initiative.performance}`);
      }
    });
    
    // Ajustar o valor de "No Cronograma" para evitar contagem dupla com "Concluída"
    // Uma iniciativa concluída sempre estará "No Cronograma" na coluna PERFORMANCE
    const noCronogramaAjustado = Math.max(0, noCronogramaCount - concluidaCount);
    
    // Log para depuração
    console.log(`Contagem para ${principle.name}:`, {
      'No Cronograma (original)': noCronogramaCount,
      'Concluída': concluidaCount,
      'No Cronograma (ajustado)': noCronogramaAjustado,
      'Atrasada': atrasadaCount
    });

    return {
      principle: principle.name,
      principleId: principle.id,
      total: principle.initiatives.length,
      'Concluída': concluidaCount,
      'No Cronograma': noCronogramaAjustado,
      'Atrasada': atrasadaCount
    };
  });

  // Ordenar por ID do princípio
  processedData = processedData.sort((a, b) => {
    const aNum = parseInt(a.principleId);
    const bNum = parseInt(b.principleId);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    return (a.principle || '').localeCompare(b.principle || '');
  });
  
  console.log('Dados processados para o gráfico:', processedData);

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const concluida = payload.find(p => p.dataKey === 'Concluída')?.value || 0;
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = concluida + noCronograma + atrasada;
      
      const concluidaPct = total > 0 ? Math.round((concluida / total) * 100) : 0;
      const noCronogramaPct = total > 0 ? Math.round((noCronograma / total) * 100) : 0;
      const atrasadaPct = total > 0 ? Math.round((atrasada / total) * 100) : 0;
      
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
          }}>{label}</p>
          
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

  return (
    <div className="principle-status-chart">
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="principle" 
            tick={{ fontSize: 14, fontWeight: 600 }}
            width={230}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            barSize={20} 
            dataKey="Concluída" 
            name="Concluída" 
            fill={performanceColors['Concluída']} 
            stackId="a"
          />
          <Bar 
            barSize={20} 
            dataKey="No Cronograma" 
            name="No Cronograma" 
            fill={performanceColors['No Cronograma']} 
            stackId="a"
          />
          <Bar 
            barSize={20} 
            dataKey="Atrasada" 
            name="Atrasada" 
            fill={performanceColors['Atrasada']} 
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrincipleStatusChart;
