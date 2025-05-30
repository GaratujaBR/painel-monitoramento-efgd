import React, { useState, useEffect, memo } from 'react';
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

// Função para converter número para numeral romano
const toRoman = (num) => {
  if (typeof num !== 'number' || !Number.isInteger(num) || num < 1) {
    return num; // Retorna o valor original se não for um inteiro positivo
  }
  const romanMap = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let roman = '';
  for (let key in romanMap) {
    while (num >= romanMap[key]) {
      roman += key;
      num -= romanMap[key];
    }
  }
  return roman;
};

// Static map for principle names
const principleNameMapGlobal = {
  '1': 'I - Governo Centrado no Cidadão e Inclusivo',
  '2': 'II - Governo Integrado e Colaborativo',
  '3': 'III - Governo Inteligente e Inovador',
  '4': 'IV - Governo Confiável e Seguro',
  '5': 'V - Governo Transparente, Aberto e Participativo',
  '6': 'VI - Governo Eficiente e Sustentável',
};

// Custom Y-Axis Tick Component
const CustomYAxisTick = (props) => {
  const { x, y, payload, fontSize } = props; // Added fontSize to props
  const value = payload.value; // Full principle name

  let line1 = value;
  let line2 = '';

  const parts = value.split(' - ');
  if (parts.length > 1) {
    const prefix = parts[0] + ' - ';
    const restOfText = parts.slice(1).join(' - ');
    const wordsInRest = restOfText.split(' ');
    
    // Aim for prefix + 2 words on line 1, rest on line 2
    if (wordsInRest.length > 2) { 
      line1 = prefix + wordsInRest.slice(0, 2).join(' ');
      line2 = wordsInRest.slice(2).join(' ');
    } else {
      // If 2 or fewer words after prefix, keep them with prefix on line 1
      line1 = prefix + restOfText; 
    }
  } else {
    // If no ' - ' found, or if it's just the prefix, value remains on one line
    // Potentially add more sophisticated splitting for values without ' - '
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Adjust dy for vertical centering: if two lines, shift up slightly; if one, center it. */}
      <text x={0} y={0} dy={line2 ? -2 : 4} textAnchor="end" fill="#666" fontSize={fontSize}>
        <tspan x={0} dy="0em">{line1}</tspan>
        {line2 && <tspan x={0} dy="1.2em">{line2}</tspan>}
      </text>
    </g>
  );
};

const PrincipleStatusChart = ({ initiatives = [], principles = [] }) => {
  const navigate = useNavigate();

  // State for responsive Y-axis tick font size
  const [dynamicTickFontSize, setDynamicTickFontSize] = useState(
    window.innerWidth <= 500 ? 12 : 14
  );
  const [dynamicLeftMargin, setDynamicLeftMargin] = useState(
    window.innerWidth <= 500 ? 45 : 75
  );

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setDynamicTickFontSize(screenWidth <= 500 ? 12 : 14);
      setDynamicLeftMargin(screenWidth <= 500 ? 45 : 75);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount to set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cores para o gráfico
  const performanceColors = {
    'No Cronograma': 'var(--color-blue)',
    'Atrasada': 'var(--color-red)',
  };



  // Função para processar os dados
  const processData = () => {
    const data = {};

    initiatives.forEach(initiative => {
      const principleId = String(initiative.principleId); // Ensure string for map lookup
      const performance = initiative.performance;

      if (principleId) {
        const numericPrincipleId = parseInt(principleId, 10);
        if (isNaN(numericPrincipleId)) {
            console.warn(`PrincipleStatusChart: Invalid principleId found: ${principleId}`);
            return;
        }

        // Use the global map for consistent and full names
        const displayName = principleNameMapGlobal[principleId] || `Princípio ${principleId}`;

        if (!data[principleId]) {
          data[principleId] = {
            id: numericPrincipleId,
            displayName: displayName, // Use this for Y-axis
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
          initialFilters: { 
            principleId: principleId, 
            status: statusFilterValue 
          } 
        } 
      });
    }
  };

  // Componente para o tooltip customizado
  const CustomTooltip = memo(({ active, payload, label }) => {
    // Adiciona detecção de tela pequena
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Define o estilo condicional APENAS para maxWidth
    const style = isSmallScreen ? { maxWidth: '40vw' } : {};

    if (active && payload && payload.length) {
      // Acessa o nome completo diretamente do payload
      const fullName = payload[0]?.payload?.displayName || `Princípio ${label}`;
      const noCronograma = payload.find(p => p.dataKey === 'No Cronograma')?.value || 0;
      const atrasada = payload.find(p => p.dataKey === 'Atrasada')?.value || 0;
      const total = noCronograma + atrasada;

      const noCronogramaPct = total > 0 ? Math.round((noCronograma / total) * 100) : 0;
      const atrasadaPct = total > 0 ? Math.round((atrasada / total) * 100) : 0;

      return (
        <div 
          className="custom-chart-tooltip" // Usa a classe CSS existente
          style={style} // Aplica o maxWidth condicional
        >
          <div className="tooltip-title">
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
  });

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
            right: 30, // Reduced right margin
            left: dynamicLeftMargin,  // Dynamically set left margin
            bottom: 0
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
          {/* Eixo Y agora são as categorias (IDs dos princípios formatados como romanos) */}
          <YAxis 
            type="category" 
            dataKey="displayName" // Changed to displayName
            width={120} // Reduced YAxis width
            interval={0} // Mostrar todos os labels
            tick={<CustomYAxisTick fontSize={dynamicTickFontSize} />} // Use custom tick component with dynamic font size
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
