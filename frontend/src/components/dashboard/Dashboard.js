import React, { useState, useEffect } from 'react';
import { useInitiatives } from '../../context/InitiativesContext';
import { useAuth } from '../../context/AuthContext';
import InitiativeStatusChart from './InitiativeStatusChart';
import ExecutionStatusChart from './ExecutionStatusChart';
import PrincipleStatusChart from './PrincipleStatusChart';
import ObjectiveStatusChart from './ObjectiveStatusChart';
import TimelineChart from './TimelineChart';
import './Dashboard.css';

const Dashboard = () => {
  const { initiatives: contextInitiatives, loading: contextLoading } = useInitiatives();
  const { currentUser } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Formatar data e hora conforme padrão brasileiro
  const formatDateTime = (date) => {
    const options = { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
  };
  
  // Fetch dashboard data from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return; // Não busca dados se não houver usuário logado

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
        setLastUpdate(new Date()); // Atualiza a hora da última busca
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setError(`Falha ao carregar dados do dashboard: ${error.message}. Verifique a conexão e a URL da API.`);
        console.error("Erro detalhado ao buscar dados do dashboard:", { 
          message: error.message, 
          name: error.name, 
          stack: error.stack, 
          type: error.constructor.name 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Opcional: Atualizar a cada X minutos (ex: 5 minutos)
    // const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000); 
    // return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar

  }, [currentUser]); // Dependência do currentUser para refazer o fetch se o usuário mudar

  // Use initiatives from context if dashboard data is not available
  const initiatives = dashboardData?.initiatives || contextInitiatives;
  const principles = dashboardData?.principles || [];
  const objectives = dashboardData?.objectives || [];

  if (loading || contextLoading) {
    return <div className="dashboard-loading">Carregando dados...</div>;
  }
  
  if (error) {
    return <div className="dashboard-error">Erro: {error}</div>;
  }
  
  // Use metrics from dashboard data if available, otherwise calculate them
  const metrics = dashboardData?.metrics || {};
  const totalInitiatives = metrics.totalInitiatives || initiatives.length;
  const statusCounts = metrics.statusCounts || initiatives.reduce((counts, initiative) => {
    const status = initiative.status || 'NAO_INICIADA';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  // Get performance counts from metrics or calculate them
  const performanceCounts = metrics.performanceCounts || initiatives.reduce((counts, initiative) => {
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
  const inProgressPercentage = 100 - completedPercentage;
  
  // Get initiatives by year
  const initiativesByYear = metrics.initiativesByYear || initiatives.reduce((byYear, initiative) => {
    const year = initiative.completionYear || 'Não definido';
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(initiative);
    return byYear;
  }, {});
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-intro">
          <h1>Monitoramento Interno EFGD</h1>
          <p className="dashboard-description">
            Estas são as estatísticas gerais da Estratégia Federal de Governo Digital. 
            Para conhecer em detalhes o andamento de cada um dos Princípios, Objetivos e 
            Iniciativas da EFGD, utilize o menu lateral.
          </p>
        </div>
        <div className="dashboard-last-update">
          Última atualização: {formatDateTime(lastUpdate)}
        </div>
      </div>
      
      <div className="dashboard-content">
        
        <div className="dashboard-section status-section">
          <div className="performance-container">
            <div className="performance-left">
              <h2>Performance EFGD</h2>
              <div className="status-chart-container">
                <InitiativeStatusChart initiatives={initiatives} />
              </div>
            </div>
            
            <div className="performance-right">
              <div className="metric-box on-schedule-initiatives">
                <h2>Iniciativas No Cronograma</h2>
                <div className="metric-value">{onScheduleInitiatives}</div>
              </div>
              
              <div className="metric-box delayed-initiatives">
                <h2>Iniciativas Em Atraso</h2>
                <div className="metric-value">{delayedInitiatives}</div>
              </div>
            </div>
          </div>

          <div className="execution-container">
            <div className="execution-left">
              <div className="metric-box in-execution-initiatives">
                <h2>Iniciativas Em Execução</h2>
                <div className="metric-value">{inExecutionInitiatives}</div>
              </div>
              
              <div className="metric-box completed-initiatives">
                <h2>Iniciativas Concluídas</h2>
                <div className="metric-value">{completedInitiatives}</div>
              </div>
            </div>
            
            <div className="execution-right">
              <h2>Status de Execução</h2>
              <div className="status-chart-container">
                <ExecutionStatusChart initiatives={initiatives} />
              </div>
            </div>
          </div>
          
          <div className="status-by-principle">
            <h2>Status por Princípio</h2>
            <div className="principle-chart">
              <PrincipleStatusChart initiatives={initiatives} principles={principles} />
            </div>
          </div>
          
          <div className="status-by-objective">
            <h2>Status por Objetivos</h2>
            <div className="objective-chart">
              <ObjectiveStatusChart initiatives={initiatives} objectives={objectives} />
            </div>
          </div>
          
          <div className="initiatives-by-year">
            <div className="year-chart">
              <TimelineChart initiatives={initiatives} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
