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
import { useInitiatives } from '../../context/InitiativesContext';
import './Charts.css';

// Cores padrão do painel
const performanceColors = {
  'No Cronograma': 'var(--color-blue, #2458E8)',
  'Atrasada': 'var(--color-red, #FF2222)',
};

const years = [2024, 2025, 2026, 2027];

// Função para processar os dados
const processData = (initiatives = []) => {
  // Inicializa estrutura por ano
  const data = years.map((year) => ({
    year: String(year),
    'No Cronograma': 0,
    'Atrasada': 0,
  }));

  initiatives.forEach((initiative, idx) => {
    const year = initiative.completionYear || initiative.PRAZO;
    const perf = initiative.performance || initiative.PERFORMANCE;
    
    if (!year) {
    } 
    else if (!years.includes(Number(year))) {
    }
    else if (!perf) {
    }
    else if (perf.toUpperCase() !== 'NO CRONOGRAMA' && 
             perf.toUpperCase() !== 'NO_CRONOGRAMA' && 
             perf.toUpperCase() !== 'ON_SCHEDULE' &&
             perf.toUpperCase() !== 'ATRASADA' && 
             perf.toUpperCase() !== 'DELAYED') {
    }
    else {
      
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
  const hasData = chartData.some((d) => d['No Cronograma'] > 0 || d['Atrasada'] > 0);

  const { applyFiltersAndNavigate } = useInitiatives();

  // Handler de clique para as barras
  const handleBarClick = (data, index) => {
    // Obtém dados de forma segura
    const year = data?.payload?.year;
    const status = data?.tooltipPayload?.[0]?.dataKey; // Pega o status ('No Cronograma' ou 'Atrasada') do tooltipPayload
    const value = data?.value; // Pega o valor numérico da barra clicada

    // Verifica se a barra clicada tem valor > 0 e os dados necessários estão presentes
    if (value > 0 && year && status) {
      console.log(`[DateChart] Clicked bar: Year=${year}, Status=${status}, Value=${value}`);
      // Aplica filtros e navega
      applyFiltersAndNavigate({ PRAZO: Number(year), PERFORMANCE: status });
    } else {
       console.log(`[DateChart] Clicked bar with zero value or missing data: Year=${year}, Status=${status}, Value=${value}`);
    }
  };

  return (
    <div className="chart-container" style={{
      width: '100%',
      minHeight: 400,
      minWidth: 600,
      background: 'white',
      padding: 24,
    }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Ano', position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="No Cronograma" fill={performanceColors['No Cronograma']} radius={[6, 6, 0, 0]} onClick={handleBarClick} cursor="pointer" />
          <Bar dataKey="Atrasada" fill={performanceColors['Atrasada']} radius={[6, 6, 0, 0]} onClick={handleBarClick} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, gap: 24, fontSize: 18, fontWeight: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 15, height: 15, backgroundColor: performanceColors['No Cronograma'], marginRight: 8, borderRadius: 3 }}></div>
          <span>No Cronograma</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 15, height: 15, backgroundColor: performanceColors['Atrasada'], marginRight: 8, borderRadius: 3 }}></div>
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
