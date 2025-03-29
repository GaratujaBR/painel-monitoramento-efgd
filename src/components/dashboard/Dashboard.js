import React, { useState, useEffect } from 'react';
import { useInitiatives } from '../../context/InitiativesContext';
import { useAuth } from '../../context/AuthContext';
import StatusCard from './StatusCard';
import ProgressChart from './ProgressChart';
import InitiativeStatusChart from './InitiativeStatusChart';
import ExecutionStatusChart from './ExecutionStatusChart';
import PrincipleStatusChart from './PrincipleStatusChart';
import ObjectiveStatusChart from './ObjectiveStatusChart';
import TimelineChart from './TimelineChart';
import './Dashboard.css';

const API_URL = 'http://localhost:3003';

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
      console.log("Tentando conectar ao backend em:", `${API_URL}/api/dashboard`);
      try {
        const response = await fetch(`${API_URL}/api/dashboard`);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar dados do dashboard: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos do dashboard:", data);
        console.log("Princípios recebidos:", data.principles);
        console.log("Objetivos recebidos:", data.objectives);
        setDashboardData(data);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        console.error('Erro detalhado ao buscar dados do dashboard:', {
          message: err.message,
          name: err.name,
          stack: err.stack,
          type: err.constructor.name
        });
        setError(`Erro ao carregar dados do dashboard: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Use initiatives from context if dashboard data is not available
  const initiatives = dashboardData?.initiatives || contextInitiatives;
  const principles = dashboardData?.principles || [];
  const objectives = dashboardData?.objectives || [];

  // Logs detalhados para depuração
  console.log("Iniciativas disponíveis:", initiatives?.length || 0);
  console.log("Princípios disponíveis:", principles?.length || 0);
  console.log("Objetivos disponíveis:", objectives?.length || 0);

  // Verificar se as iniciativas têm os IDs de princípio e objetivo
  if (initiatives && initiatives.length > 0) {
    const withPrincipleId = initiatives.filter(i => i.principleId).length;
    const withObjectiveId = initiatives.filter(i => i.objectiveId).length;
    console.log(`Iniciativas com principleId: ${withPrincipleId}/${initiatives.length}`);
    console.log(`Iniciativas com objectiveId: ${withObjectiveId}/${initiatives.length}`);

    // Verificar uma amostra de iniciativas
    console.log("Amostra de iniciativas:", initiatives.slice(0, 3));
  }

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
  
  // Add debug logs
  console.log("Dashboard rendering with totalInitiatives:", totalInitiatives);
  console.log("Dashboard status counts:", statusCounts);
  console.log("Dashboard performance counts:", performanceCounts);

  // Status counts for Status de Execução chart
  const completedInitiatives = statusCounts['CONCLUIDA'] || 0;
  const inProgressInitiatives = totalInitiatives - completedInitiatives;
  const inExecutionInitiatives = inProgressInitiatives;
  
  // Performance counts for Performance EFGD chart
  const onScheduleInitiatives = performanceCounts['NO_CRONOGRAMA'] || 0;
  const delayedInitiatives = performanceCounts['ATRASADA'] || 0;
  const averageProgress = metrics.averageProgress || Math.round(initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length) || 0;
  
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
