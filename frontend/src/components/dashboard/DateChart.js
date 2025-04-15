// DateChart.js (novo nome)
// Componente de gráfico de barras agrupadas por prazo/ano

import React, { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Charts.css';

// Cores padrão do painel
const performanceColors = {
  'No Cronograma': 'var(--color-blue, #2458E8)',
  'Atrasada': 'var(--color-red, #FF2222)',
};

const years = [2024, 2025, 2026, 2027];

// Função para processar os dados
const processData = (initiatives = []) => {
  // Log 1: Mostrar o array completo de iniciativas (limitado a 3)
  console.log('[DateChart] Iniciativas recebidas (primeiras 3):', 
    initiatives.slice(0, 3).map(i => ({...i})));

  // Log 2: Mostrar todas as chaves disponíveis em todas as iniciativas
  if (initiatives.length > 0) {
    const allKeys = new Set();
    initiatives.forEach(i => Object.keys(i).forEach(k => allKeys.add(k)));
    console.log('[DateChart] Todas as chaves encontradas nas iniciativas:', [...allKeys]);
  }

  // Log 3: Contar quantas iniciativas têm os campos que procuramos
  const countsWithFields = {
    withPRAZO: initiatives.filter(i => i.PRAZO).length,
    withPrazo: initiatives.filter(i => i.Prazo).length,
    withprazo: initiatives.filter(i => i.prazo).length,
    withPERFORMANCE: initiatives.filter(i => i.PERFORMANCE).length,
    withPerformance: initiatives.filter(i => i.Performance).length,
    withperformance: initiatives.filter(i => i.performance).length,
    withcompletionYear: initiatives.filter(i => i.completionYear).length,
    withperformance: initiatives.filter(i => i.performance).length,
    total: initiatives.length
  };
  console.log('[DateChart] Contagem de campos nas iniciativas:', countsWithFields);

  // Inicializa estrutura por ano
  const data = years.map((year) => ({
    year: String(year),
    'No Cronograma': 0,
    'Atrasada': 0,
  }));

  // Log 4: Detalhes de processamento para cada iniciativa
  let counter = { included: 0, excluded: 0, reasons: { noYear: 0, yearOutOfRange: 0, noPerf: 0, unknownPerf: 0 } };
  
  initiatives.forEach((initiative, idx) => {
    const year = initiative.completionYear || initiative.PRAZO;
    const perf = initiative.performance || initiative.PERFORMANCE;
    
    if (!year) {
      counter.excluded++;
      counter.reasons.noYear++;
      if (idx < 5) console.log(`[DateChart] Iniciativa ${idx} excluída: sem ano`);
    } 
    else if (!years.includes(Number(year))) {
      counter.excluded++;
      counter.reasons.yearOutOfRange++;
      if (idx < 5) console.log(`[DateChart] Iniciativa ${idx} excluída: ano ${year} fora do intervalo ${years}`);
    }
    else if (!perf) {
      counter.excluded++;
      counter.reasons.noPerf++;
      if (idx < 5) console.log(`[DateChart] Iniciativa ${idx} excluída: sem performance`);
    }
    else if (perf.toUpperCase() !== 'NO CRONOGRAMA' && 
             perf.toUpperCase() !== 'NO_CRONOGRAMA' && 
             perf.toUpperCase() !== 'ON_SCHEDULE' &&
             perf.toUpperCase() !== 'ATRASADA' && 
             perf.toUpperCase() !== 'DELAYED') {
      counter.excluded++;
      counter.reasons.unknownPerf++;
      if (idx < 5) console.log(`[DateChart] Iniciativa ${idx} excluída: performance '${perf}' não reconhecida`);
    }
    else {
      counter.included++;
      if (idx < 5) console.log(`[DateChart] Iniciativa ${idx} incluída: ano ${year}, performance ${perf}`);
      
      // Processamento normal
      if (perf.toUpperCase() === 'NO CRONOGRAMA' || 
          perf.toUpperCase() === 'NO_CRONOGRAMA' || 
          perf.toUpperCase() === 'ON_SCHEDULE') {
        data.find((d) => d.year === String(year))['No Cronograma']++;
      } 
      else if (perf.toUpperCase() === 'ATRASADA' || 
               perf.toUpperCase() === 'DELAYED') {
        data.find((d) => d.year === String(year))['Atrasada']++;
      }
    }
  });
  
  console.log('[DateChart] Resumo do processamento:', counter);
  console.log('[DateChart] Dados finais do gráfico:', data);

  return data;
};

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const noCronograma = payload.find((p) => p.dataKey === 'No Cronograma')?.value || 0;
    const atrasada = payload.find((p) => p.dataKey === 'Atrasada')?.value || 0;
    const total = noCronograma + atrasada;

    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-title">Ano: {label}</div>
        <div className="tooltip-item">
          <span style={{ color: performanceColors['No Cronograma'] }}>No Cronograma:</span>
          <span className="tooltip-value">{noCronograma}</span>
        </div>
        <div className="tooltip-item">
          <span style={{ color: performanceColors['Atrasada'] }}>Atrasada:</span>
          <span className="tooltip-value">{atrasada}</span>
        </div>
        <div className="tooltip-total">
          Total: {total} iniciativa{total === 1 ? '' : 's'}
        </div>
      </div>
    );
  }
  return null;
};

const DateChart = ({ initiatives = [] }) => {
  const chartData = processData(initiatives);
  const chartContainerRef = useRef(null);
  const hasData = chartData.some((d) => d['No Cronograma'] > 0 || d['Atrasada'] > 0);

  return (
    <div ref={chartContainerRef} className="chart-container" style={{ width: '100%', minHeight: 400, background: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 24 }}>
      <h2 className="chart-title">Performance por Ano/Prazo</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Ano', position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="No Cronograma" fill={performanceColors['No Cronograma']} radius={[6, 6, 0, 0]} />
          <Bar dataKey="Atrasada" fill={performanceColors['Atrasada']} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, gap: 24, fontSize: 16, fontWeight: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 20, height: 20, backgroundColor: performanceColors['No Cronograma'], marginRight: 8, borderRadius: 3 }}></div>
          <span>No Cronograma</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 20, height: 20, backgroundColor: performanceColors['Atrasada'], marginRight: 8, borderRadius: 3 }}></div>
          <span>Atrasada</span>
        </div>
      </div>
      {!hasData && (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 30, fontSize: 18 }}>
          Nenhum dado disponível para o período selecionado.
        </div>
      )}
    </div>
  );
};

export default DateChart;
