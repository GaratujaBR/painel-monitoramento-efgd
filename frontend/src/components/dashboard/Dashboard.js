import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiUrl';
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
import PriorityPerformanceChart from './PriorityPerformanceChart';
import ExecutionStatusChart from './ExecutionStatusChart'; // Added import
import PerformanceStatusChart from './PerformanceStatusChart'; // Importa o novo gráfico de performance

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
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/api/dashboard`);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do dashboard.');
        }
        const data = await response.json(); 
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
  
  // Use metrics from dashboard data if available for some items, but always calculate counts from safeInitiatives
  const metrics = dashboardData?.metrics || {}; 
  const totalInitiatives = metrics.totalInitiatives !== undefined ? metrics.totalInitiatives : safeInitiatives.length;
  
  // Always calculate statusCounts from safeInitiatives
  const statusCounts = safeInitiatives.reduce((counts, initiative) => {
    const status = initiative.status || 'NAO_INICIADA';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  // Always calculate performanceCounts from safeInitiatives
  const performanceCounts = safeInitiatives.reduce((counts, initiative) => {
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


  // Status counts for Status de Execução chart cards
  const completedInitiatives = statusCounts['CONCLUIDA'] || 0;
  const inProgressInitiatives = totalInitiatives - completedInitiatives; // This is used for the card
  const inExecutionInitiatives = inProgressInitiatives; // Consistent name for the card
  
  // Performance counts for Performance EFGD chart (donut) and cards
  const onScheduleInitiatives = performanceCounts['NO_CRONOGRAMA'] || 0;
  const delayedInitiatives = performanceCounts['ATRASADA'] || 0;

  
  // Calculate percentages for cards
  const completedPercentage = totalInitiatives > 0 ? Math.round((completedInitiatives / totalInitiatives) * 100) : 0;
  // eslint-disable-next-line no-unused-vars
  const inProgressPercentage = 100 - completedPercentage;
  
  // Get initiatives by year - can still use metrics if available
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
          <h1 className="header-title">Painel Geral</h1>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Restore the top container for Total Initiatives and Info Frame */}
        <div className="status-cards-container flex-container">
          {/* Info Frame (will expand) */}
          <div className="info-frame flex-item">
            <span>Este painel de monitoramento interno permite que os gestores acompanhem de perto a execução das iniciativas da <b>Estratégia Federal de Governo Digital (EFGD)</b>. Visualize facilmente o andamento das ações sob sua responsabilidade, identifique rapidamente iniciativas em dia ou atrasadas e avalie o status geral de execução.

Utilize estas informações para prever problemas, realocar recursos e tomar decisões ágeis e bem informadas, garantindo eficiência na implementação das políticas públicas.</span>
          </div>
          {/* Total Initiatives Card (styled as square button) */}
          <div 
            className="status-card total flex-item" 
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
                  <PerformanceStatusChart onSchedule={onScheduleInitiatives} delayed={delayedInitiatives} />
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
              <div className="chart-section"> {/* Kept for layout consistency */}
                <div className="chart-container"> {/* Kept for layout consistency */}
                  <ExecutionStatusChart initiatives={safeInitiatives} />
                </div>
                {/* Legend is now handled by ExecutionStatusChart itself, manual legend removed */}
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
        
        {/* Performance das Prioritárias ao lado do gráfico de datas */}
        <div className="dashboard-charts-row">
          <div className="dashboard-card date-chart-card">
            <h2 className="chart-title">Performance por Ano/Prazo</h2>
            <DateChart initiatives={safeInitiatives} />
          </div>
          <div className="dashboard-card priority-performance-card">
            <PriorityPerformanceChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
