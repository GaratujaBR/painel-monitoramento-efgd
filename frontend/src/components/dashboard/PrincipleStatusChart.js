import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import './PrincipleStatusChart.css';

const PrincipleStatusChart = ({ initiatives = [], principles = [] }) => {
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
      const principleId = initiative.principleId;
      const performance = initiative.performance;

      if (principleId) {
        // Encontra o princípio correspondente no array 'principles'
        // Certifique-se de que a propriedade correta (ex: 'name' ou 'PRINCIPIO') está sendo usada
        const principleInfo = principles.find(p => p.id === principleId);
        const principleName = principleInfo?.name || `Princípio ${principleId}`; // Ajuste 'name' se necessário

        if (!data[principleId]) {
          data[principleId] = {
            id: principleId,
            // Usar o nome encontrado para 'name' e 'fullName'
            name: principleName, // Usado internamente ou para labels curtos se necessário
            fullName: principleName, // Usado para o eixo Y e tooltips
            'No Cronograma': 0,
            'Atrasada': 0
          };
        }

        if (performance === 'No Cronograma') {
          data[principleId]['No Cronograma']++;
        } else if (performance === 'Atrasada') {
          data[principleId]['Atrasada']++;
        }
      }
    });

    // Retorna os dados ordenados pelo ID (ou pode ordenar por nome, se preferir)
    return Object.values(data).sort((a, b) => a.id - b.id);
  };

  // Manipulador de clique para as barras
  const handleBarClick = (entry, statusKey) => {
    if (!entry || !entry.payload || !entry.payload.id) {
      console.error("PrincipleChart: Dados inválidos recebidos no clique", entry);
      return;
    }

    const principleId = entry.payload.id;
    let statusFilterValue;

    if (statusKey === 'No Cronograma') {
      statusFilterValue = 'No Cronograma';
    } else if (statusKey === 'Atrasada') {
      statusFilterValue = 'Atrasada';
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
      
      // Obtém o nome completo do princípio
      const fullPrincipleName = payload[0]?.payload?.fullName || label;

      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-title">{fullPrincipleName}</p>
          
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
  
  // Verificar se há dados para exibir
  if (!chartData || chartData.length === 0) {
    return <div className="chart-placeholder">Sem dados de princípios para exibir.</div>;
  }

  // Definir o tamanho da fonte base
  const baseFontSize = 11; // Reduzir um pouco para caber mais texto
  // Calcular altura dinâmica - base + altura por barra
  const dynamicHeight = 100 + chartData.length * 60;

  return (
    <div className="principle-chart-container">
      {/* Ajuste dinâmico da altura */}
      <ResponsiveContainer width="100%" height={dynamicHeight}>
        <BarChart
          layout="vertical" // Define layout horizontal (barras crescem da esquerda para direita)
          data={chartData}
          margin={{
            top: 20,
            right: 50, // Aumentar margem direita para valores/labels das barras
            left: 50, // Aumentar margem esquerda para nomes longos dos princípios
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* Eixo X agora é numérico */}
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ 
              fontSize: baseFontSize, 
              fill: '#222' 
            }} 
          />
          {/* Eixo Y agora são as categorias (nomes dos princípios) */}
          <YAxis 
            type="category" 
            dataKey="fullName" // Usar o nome completo como label do eixo Y
            width={50} // Largura do eixo Y para caber nomes
            interval={0} // Mostrar todos os labels
            tick={{ 
              fontSize: baseFontSize, 
              fill: '#222',
              // Optional: Add text wrapping if names are too long
              // width: 150, 
              // textAnchor: 'end',
              // dx: -5 // Adjust position slightly
            }} 
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          {/* Barras agora são verticais em relação ao eixo Y */}
          <Bar 
            barSize={15} // Ajustar tamanho da barra
            dataKey="No Cronograma" 
            stackId="a" 
            fill={performanceColors['No Cronograma']}
            radius={[0, 5, 5, 0]} // Ajustar raio para horizontal
            onClick={(data) => handleBarClick(data, "No Cronograma")}
            cursor="pointer"
          >
            {/* Opcional: Adicionar labels nas barras - descomente se desejar
            <LabelList 
              dataKey="No Cronograma" 
              position="right" 
              formatter={(value) => value > 0 ? value : ''} 
              style={{ fill: '#FFF', fontSize: '10px' }} 
            /> 
            */}
          </Bar>
          <Bar 
            barSize={15} 
            dataKey="Atrasada" 
            stackId="a" 
            fill={performanceColors['Atrasada']}
            radius={[0, 5, 5, 0]} // Ajustar raio para horizontal
            onClick={(data) => handleBarClick(data, "Atrasada")}
            cursor="pointer"
          >
            {/* Opcional: Adicionar labels nas barras
            <LabelList 
              dataKey="Atrasada" 
              position="right" 
              formatter={(value) => value > 0 ? value : ''} 
              style={{ fill: '#FFF', fontSize: '10px' }} 
            />
            */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legenda externa personalizada */}
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

export default PrincipleStatusChart;
