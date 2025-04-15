import React, { useState, useEffect } from 'react';
import { useInitiatives } from '../../context/InitiativesContext';
// eslint-disable-next-line no-unused-vars
import { useOutletContext, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './DashboardCharts.css'; // Import the new CSS file for chart layout
import './StatusCardColors.css';
import './ChartTitles.css'; // Importando o novo arquivo CSS para títulos
import './ChartTitles.css';
import computerIcon from '../../images/computer.png';
import dataIcon from '../../assets/icons/data.png';
import PrincipleStatusChart from './PrincipleStatusChart';
import ObjectiveStatusChart from './ObjectiveStatusChart';
import DateChart from './DateChart'; // IMPORTAÇÃO ATUALIZADA DO NOVO GRÁFICO

// Componente para o gráfico de donut de Performance
const PerformanceDonutChart = ({ onSchedule, delayed }) => {
  const total = onSchedule + delayed;
  const onSchedulePercentage = total > 0 ? Math.round((onSchedule / total) * 100) : 0;
  const delayedPercentage = total > 0 ? Math.round((delayed / total) * 100) : 0;
  
  return (
    <div className="donut-chart">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path 
          className="circle-bg"
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
        <path 
          className="circle performance-ontime"
          strokeDasharray={`${onSchedulePercentage}, 100`}
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
        <path 
          className="circle performance-delayed"
          strokeDasharray={`${delayedPercentage}, 100`}
          strokeDashoffset={`-${onSchedulePercentage}`}
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
      </svg>
    </div>
  );
};

// Componente para o gráfico de donut de Execução
const ExecutionDonutChart = ({ completed, inExecution }) => {
  const total = completed + inExecution;
  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inExecutionPercentage = total > 0 ? Math.round((inExecution / total) * 100) : 0;
  
  return (
    <div className="donut-chart">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path 
          className="circle-bg"
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
        <path 
          className="circle execution-completed"
          strokeDasharray={`${completedPercentage}, 100`}
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
        <path 
          className="circle execution-inprogress"
          strokeDasharray={`${inExecutionPercentage}, 100`}
          strokeDashoffset={`-${completedPercentage}`}
          d="M18 5
          a 13 13 0 0 1 0 26
          a 13 13 0 0 1 0 -26"
        />
      </svg>
    </div>
  );
};

const Dashboard = () => {
  const { 
    initiatives: contextInitiatives, 
    principles: contextPrinciples, 
    objectives: contextObjectives, 
    // eslint-disable-next-line no-unused-vars
    areas: contextAreas, 
    loading: initiativesLoading, 
    // eslint-disable-next-line no-unused-vars
    error: initiativesError,
    lastUpdateTime,
    usingMockData 
  } = useInitiatives();
  
  const [, updateLastUpdateTime] = useOutletContext() || []; 
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Formatar data e hora conforme padrão brasileiro
  // eslint-disable-next-line no-unused-vars
  const formatDateTime = (date) => {
    if (!date) return 'Data indisponível';
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    try {
      return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return 'Data inválida';
    }
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (usingMockData) {
        setDashboardData({
          totalInitiatives: 0,
          onScheduleInitiatives: 0,
          delayedInitiatives: 0,
          completedInitiatives: 0,
          notStartedInitiatives: 0,
          averageProgress: 0,
          initiatives: [],
          principles: [],
          objectives: [],
          metrics: {},
          lastUpdate: new Date().toISOString()
        });
        if (typeof updateLastUpdateTime === 'function') {
          updateLastUpdateTime(new Date().toISOString());
        }
        setLoading(false);
        return;
      }

      setError(null); 
      setLoading(true); 

      try {
        console.log('Buscando dados do dashboard da API (sem autenticação - usando URL completa)...'); 
        const response = await fetch(`http://localhost:3003/api/dashboard`); 

        if (!response.ok) {
          const errorBody = await response.text(); 
          console.error(`Erro HTTP: ${response.status}, Body: ${errorBody}`);
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados do dashboard recebidos (sem auth):', data);
        setDashboardData(data); 
        if (data.lastUpdate && typeof updateLastUpdateTime === 'function') {
           updateLastUpdateTime(data.lastUpdate); 
        }
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message || 'Erro ao buscar dados do dashboard.');
        setDashboardData({ 
          initiatives: contextInitiatives, 
          principles: contextPrinciples, 
          objectives: contextObjectives, 
          metrics: {}, 
          lastUpdate: lastUpdateTime || null 
        }); 
      } finally {
        setLoading(false); 
      }
    };

    fetchDashboardData();
  }, [usingMockData, updateLastUpdateTime, contextInitiatives, contextPrinciples, contextObjectives, lastUpdateTime]); 

  // Use the values from context when not using mock data
  const initiatives = usingMockData ? (dashboardData?.initiatives || []) : contextInitiatives;
  const principles = usingMockData ? (dashboardData?.principles || []) : contextPrinciples;
  const objectives = usingMockData ? (dashboardData?.objectives || []) : contextObjectives;

  // Ensure principles and objectives are arrays before using .length or .filter
  const safePrinciples = Array.isArray(principles) ? principles : [];
  const safeObjectives = Array.isArray(objectives) ? objectives : [];
  const safeInitiatives = Array.isArray(initiatives) ? initiatives : [];

  if (loading || initiativesLoading) {
    return (
      <div className="dashboard-loading">
        <img src={dataIcon} alt="Ícone de dados" className="loading-icon" />
        <span>Carregando dados...</span>
      </div>
    );
  }
  
  if (error && !usingMockData) {
    return <div className="dashboard-error">Erro: {error}</div>;
  }
  
  // Use metrics from dashboard data if available, otherwise calculate them
  const metrics = dashboardData?.metrics || {};
  const totalInitiatives = metrics.totalInitiatives || safeInitiatives.length;
  const statusCounts = metrics.statusCounts || safeInitiatives.reduce((counts, initiative) => {
    const status = initiative.status || 'NAO_INICIADA';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  // Get performance counts from metrics or calculate them
  const performanceCounts = metrics.performanceCounts || safeInitiatives.reduce((counts, initiative) => {
    // Simple performance normalization for client-side fallback
    let performance = 'DESCONHECIDO';
    if (initiative.performance) {
      const perfLower = initiative.performance.toString().toLowerCase();
      if (perfLower.includes('atrasada')) {
        performance = 'ATRASADA';
      } else if (perfLower.includes('cronograma')) {
        performance = 'NO_CRONOGRAMA';
      }
    }
    counts[performance] = (counts[performance] || 0) + 1;
    return counts;
  }, {});

  // Status counts for Status de Execução chart
  const completedInitiatives = statusCounts['CONCLUIDA'] || 0;
  const inProgressInitiatives = totalInitiatives - completedInitiatives;
  const inExecutionInitiatives = inProgressInitiatives;
  
  // Performance counts for Performance EFGD chart
  const onScheduleInitiatives = performanceCounts['NO_CRONOGRAMA'] || 0;
  const delayedInitiatives = performanceCounts['ATRASADA'] || 0;
  
  // Calculate percentages
  const completedPercentage = Math.round((completedInitiatives / totalInitiatives) * 100) || 0;
  // eslint-disable-next-line no-unused-vars
  const inProgressPercentage = 100 - completedPercentage;
  
  // Get initiatives by year
  // eslint-disable-next-line no-unused-vars
  const initiativesByYear = metrics.initiativesByYear || safeInitiatives.reduce((byYear, initiative) => {
    const year = initiative.completionYear || 'Não definido';
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(initiative);
    return byYear;
  }, {});
  
  return (
    <div className="dashboard-container">
      {usingMockData && (
        <div className="mock-data-notification">
          <div className="mock-data-notification-content">
            <span className="mock-data-icon">ℹ️</span>
            <span className="mock-data-text">
              Utilizando dados simulados para demonstração
            </span>
          </div>
        </div>
      )}

      <div className="dashboard-intro">
        <img src={computerIcon} alt="Dashboard Icon" className="header-icon" />
        <div className="header-text-content">
          <h1 className="header-title">Painel de Monitoramento</h1>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Restore the top container for Total Initiatives and Info Frame */}
        <div className="status-cards-container">
          {/* Info Frame (will expand) */}
          <div className="info-frame">
            <span>Este painel de monitoramento interno permite aos gestores acompanhar de perto a execução das iniciativas da <b>Estratégia Federal de Governo Digital (EFGD)</b>. Visualize facilmente o andamento das ações sob sua responsabilidade, identifique rapidamente iniciativas em dia ou atrasadas e avalie o status geral de execução.

Utilize estas informações para prever problemas, realocar recursos e tomar decisões ágeis e bem informadas, garantindo eficiência na implementação das políticas públicas.</span>
          </div>
          
          {/* Total Initiatives Card (styled as square button) */}
          <div 
            className="status-card total" 
            onClick={() => navigate('/initiatives')} 
          >
            <h3 className="status-card-title">Total de Iniciativas</h3>
            <span className="status-card-value">{totalInitiatives}</span>
          </div>
        </div>

        {/* First Responsive Row: Performance & Execution Cards */}
        <div className="dashboard-main-cards-row">
          {/* Card de Performance - Restore status cards inside */}
          <div className="dashboard-card">
            <h2 className="card-title">Performance</h2>
            <div className="card-content">
              <div className="chart-section">
                <div className="chart-container">
                  <PerformanceDonutChart 
                    onSchedule={onScheduleInitiatives} 
                    delayed={delayedInitiatives} 
                  />
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color-box" style={{ backgroundColor: 'var(--color-blue)' }}></span>
                    No Cronograma
                  </div>
                  <div className="legend-item">
                    <span className="legend-color-box" style={{ backgroundColor: 'var(--color-red)' }}></span>
                    Em Atraso
                  </div>
                </div>
              </div>
              {/* Container for the two performance status cards */}
              <div className="performance-status-cards">
                 {/* On Schedule Card */}
                 <div 
                   className="status-card on-schedule" 
                   onClick={() => navigate('/initiatives?status=no%20cronograma')}
                 >
                   <h3 className="status-card-title">No Cronograma</h3>
                   <span className="status-card-value">{onScheduleInitiatives}</span>
                 </div>
                 {/* Delayed Card */}
                 <div 
                   className="status-card delayed" 
                   onClick={() => navigate('/initiatives?status=delayed')}
                 >
                   <h3 className="status-card-title">Em Atraso</h3>
                   <span className="status-card-value">{delayedInitiatives}</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Card de Status da Execução - Restore status cards inside */}
          <div className="dashboard-card">
            <h2 className="card-title">Status da Execução</h2>
            <div className="card-content execution-content">
              {/* Container for the two execution status cards */}
              <div className="execution-status-cards">
                 {/* Completed Card */}
                 <div 
                   className="status-card completed" 
                   onClick={() => navigate('/initiatives?status=completed')}
                 >
                   <h3 className="status-card-title">Concluídas</h3>
                   <span className="status-card-value">{completedInitiatives}</span>
                 </div>
                 {/* In Execution Card */}
                 <div 
                   className="status-card in-execution" 
                   onClick={() => navigate('/initiatives?status=inExecution')}
                 >
                   <h3 className="status-card-title">Em Execução</h3>
                   <span className="status-card-value">{inExecutionInitiatives}</span>
                 </div>
              </div>
              <div className="chart-section">
                <div className="chart-container">
                  <ExecutionDonutChart 
                    completed={completedInitiatives} 
                    inExecution={inExecutionInitiatives} 
                  />
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color-box" style={{ backgroundColor: 'var(--color-green)' }}></span>
                    Concluídas
                  </div>
                  <div className="legend-item">
                    <span className="legend-color-box" style={{ backgroundColor: 'var(--color-blue-dark)' }}></span>
                    Em Execução
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Responsive Row: Principle & Objective Charts */}
        <div className="dashboard-charts-row">
          <div className="dashboard-card principle-status-card">
            <h2 className="chart-title">Performance por Princípio</h2>
            {(safeInitiatives && safeInitiatives.length > 0 && safePrinciples && safePrinciples.length > 0) ? (
              <PrincipleStatusChart initiatives={safeInitiatives} principles={safePrinciples} />
            ) : (
              <p>Carregando dados dos princípios e iniciativas...</p>
            )}
          </div>
          
          <div className="dashboard-card objective-status-card">
            <h2 className="chart-title">Performance por Objetivos</h2>
            {(safeInitiatives && safeInitiatives.length > 0 && safeObjectives && safeObjectives.length > 0) ? (
              <ObjectiveStatusChart initiatives={safeInitiatives} objectives={safeObjectives} />
            ) : (
              <p>Carregando dados dos objetivos e iniciativas...</p>
            )}
          </div>
        </div>
        
        <div className="prazo-section">
          <div className="timeline-chart">
            <DateChart initiatives={safeInitiatives} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
