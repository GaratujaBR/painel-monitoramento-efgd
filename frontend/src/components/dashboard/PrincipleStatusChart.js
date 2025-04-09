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
import { useNavigate } from 'react-router-dom';
import './Charts.css';

/**
 * Componente de gráfico de performance por princípio usando Recharts
 * Exibe a distribuição de performance (No Cronograma vs Em Atraso) para cada princípio em um gráfico de barras empilhadas
 */
const PrincipleStatusChart = ({ initiatives, principles = [] }) => {
  const navigate = useNavigate();

  // Define status colors using CSS variables for consistency
  const performanceColors = {
    'No Cronograma': 'var(--color-blue)', // Use CSS variable for blue
    'Atrasada': 'var(--color-red)',     // Use CSS variable for red
  };

  const baseFontSize = 17;

  // Mapeamento manual dos IDs numéricos para os nomes completos de princípios
  const principleNameMapping = {
    1: "I - Governo Centrado no Cidadão e Inclusivo",
    2: "II - Governo Integrado e Colaborativo",
    3: "III - Governo Digital e Eficiente",
    4: "IV - Governo Confiável e Seguro", // Garante que ID 4 seja mapeado corretamente
    5: "V - Governo Transparente e Aberto",
    6: "VI - Governo Orientado por Dados"
  };

  // Normalizar o principleId para garantir consistência
  const normalizeInitiatives = (initiatives || []).map(initiative => {
    const newInitiative = {...initiative};
    
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

  // Processar dados para o gráfico de performance
  let processedData = Object.values(initiativesByPrinciple).map(principle => {
    // Inicializar contagens de performance
    let noCronogramaCount = 0;
    let atrasadaCount = 0;
    
    // Contar iniciativas por status de performance (ignorando concluídas)
    principle.initiatives.forEach(initiative => {
      // Contar por status (usando os identificadores internos)
      if (initiative.status === 'NO_CRONOGRAMA') {
        noCronogramaCount++;
      } else if (initiative.status === 'ATRASADA') {
        atrasadaCount++;
      } 
      // Iniciativas com status 'CONCLUIDA' ou outro são ignoradas aqui
    });

    // Retornar os dados formatados para o gráfico, usando as chaves esperadas pelas Barras
    return {
      principleId: principle.id,
      principle: principle.name,
      'No Cronograma': noCronogramaCount, // Chave corresponde ao dataKey da Barra
      'Atrasada': atrasadaCount,         // Chave corresponde ao dataKey da Barra
    };
  });
  
  // Ordenar por principleId
  processedData.sort((a, b) => {
    const aNum = parseInt(a.principleId);
    const bNum = parseInt(b.principleId);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    return (a.principle || '').localeCompare(b.principle || '');
  });

  // Manipulador de clique para as barras
  const handleBarClick = (data, statusKey) => {
    if (!data || !data.payload || !data.payload.principleId) {
      console.error("PrincipleChart: Dados inválidos recebidos no clique", data);
      return;
    }

    const principleId = data.payload.principleId;
    let statusFilterValue;

    if (statusKey === 'No Cronograma') {
      statusFilterValue = 'NO_CRONOGRAMA';
    } else if (statusKey === 'Atrasada') {
      statusFilterValue = 'ATRASADA';
    } else {
      console.error(`PrincipleChart: Status inválido recebido: ${statusKey}`);
      return;
    }

    if (principleId && statusFilterValue) {
      navigate('/initiatives', { 
        state: { 
          filters: { 
            principleId: principleId, 
            status: statusFilterValue 
          } 
        } 
      });
    }
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = noCronograma + atrasada;
      
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
            margin: '0 0 0 0',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
          }}>{label}</p>
          
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
            paddingBottom: '5px', 
            borderTop: '1px solid #eee',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Total:</span>
            <span>{total} iniciativas em execução</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" 
            tick={{ 
              fontSize: baseFontSize,
              fill: '#222'
            }}
          />
          <YAxis 
            type="category" 
            dataKey="principle" 
            tick={{ 
              fontSize: 14, 
              fontWeight: 600,
              fill: '#222'
            }}
            width={230}
          />
          <Tooltip content={<CustomTooltip />} /> 
          <Bar 
            barSize={20} 
            dataKey="No Cronograma" 
            name="No Cronograma" 
            fill={performanceColors['No Cronograma']} 
            stackId="a"
            radius={[0, 5, 5, 0]}
            onClick={(data, index, event) => handleBarClick(data, "No Cronograma")}
            cursor="pointer"
          />
          <Bar 
            barSize={20} 
            dataKey="Atrasada" 
            name="Atrasada" 
            fill={performanceColors['Atrasada']} 
            stackId="a"
            radius={[0, 5, 5, 0]}
            onClick={(data, index, event) => handleBarClick(data, "Atrasada")}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Legenda externa personalizada */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '10px',
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
    </>
  );
};

export default PrincipleStatusChart;
