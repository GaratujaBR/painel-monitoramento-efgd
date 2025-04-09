import React, { useState, useEffect } from 'react';
import { useInitiatives } from '../../context/InitiativesContext';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import computerIcon from '../../images/computer.png';
import StatusCard from './StatusCard';
import PrincipleStatusChart from './PrincipleStatusChart';
import ObjectiveStatusChart from './ObjectiveStatusChart';

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
  const { initiatives: contextInitiatives, loading: contextLoading, usingMockData } = useInitiatives();
  const { currentUser } = useAuth();
  const [, updateLastUpdateTime] = useOutletContext();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Formatar data e hora conforme padrão brasileiro
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
        // Importa dinamicamente os dados mockados
        try {
          const mockDataModule = await import('../../data/mockData'); 
          setDashboardData(mockDataModule.mockDashboardData);
          const updateDate = mockDataModule.mockLastUpdate || new Date();
          updateLastUpdateTime(updateDate); // Atualiza o contexto com a data
          setLoading(false);
        } catch (err) {
          console.error("Erro ao carregar dados mockados:", err);
          setError('Falha ao carregar dados de simulação.');
          setLoading(false);
        }
        return; // Sai da função se estiver usando mock data
      }

      // Se não estiver usando mock data, busca da API
      if (!currentUser) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
        const updateDate = data.lastUpdate || new Date();
        updateLastUpdateTime(updateDate); // Atualiza o contexto com a data
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message || 'Erro ao buscar dados do dashboard.');
        setLoading(false);
      }
    };

    setLoading(true); // Inicia carregando
    fetchDashboardData();
  }, [currentUser, usingMockData]); // Remove updateLastUpdateTime from dependencies to prevent infinite loop

  // Use initiatives from context if dashboard data is not available
  const initiatives = dashboardData?.initiatives || contextInitiatives;
  const principles = dashboardData?.principles || [];
  const objectives = dashboardData?.objectives || [];

  if (loading || contextLoading) {
    return <div className="dashboard-loading">Carregando dados...</div>;
  }
  
  if (error && !usingMockData) {
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
      {usingMockData && (
        <div className="mock-data-notification">
          <div className="mock-data-notification-content">
            <span className="mock-data-icon">⚠️</span>
            <span className="mock-data-text">
              Utilizando dados mockados. Os dados exibidos são simulados e não refletem o estado atual da API.
            </span>
          </div>
        </div>
      )}
      
      <div className="dashboard-header">
        {/* <<< Este div será o frame azul >>> */}
        <div className="dashboard-intro">
          <img src={computerIcon} alt="Monitoramento" className="header-icon" />
          <div className="header-text-content">
            {/* Usando H1 para semântica, mas estilo controlará a aparência */}
            <h1 className="header-title">Monitoramento Interno</h1>
          </div>
        </div>
        {/* Removido o div com a data de última atualização */}
      </div>
      
      <div className="dashboard-content">
        {/* Status Cards Section */}
        <div className="status-cards-container">
          {/* Add the new info frame here */}
          <div className="info-frame">
            {/* Placeholder for future text */}
            <span>Conteúdo futuro aqui...</span>
          </div>

          <StatusCard 
            title="Total de Iniciativas"
            value={totalInitiatives}
            type="total"
            onClick={() => navigate('/initiatives')}
          />
          {/* Removed "Em Execução" and "Concluídas" cards from here */}
        </div>

        {/* Card de Performance */}
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
            {/* Replace .info-container content with StatusCards */}
            <div className="info-container performance-status-cards">
              <StatusCard 
                title="No Cronograma"
                value={onScheduleInitiatives}
                type="on-schedule" 
                onClick={() => navigate('/initiatives', { 
                  state: { 
                    filterField: 'Por Status/Performance',
                    filterValue: 'NO_CRONOGRAMA' // Pass the internal status value
                  }
                })}
              />
              <StatusCard 
                title="Em Atraso"
                value={delayedInitiatives}
                type="delayed"
                onClick={() => navigate('/initiatives', { 
                  state: { 
                    filterField: 'Por Status/Performance',
                    filterValue: 'ATRASADA' // Pass the internal status value
                  }
                })}
              />
            </div>
          </div>
        </div>
        
        {/* Card de Status da Execução */}
        <div className="dashboard-card">
          <h2 className="card-title">Status da Execução</h2>
          <div className="card-content execution-content">
            {/* Replace .info-container content with StatusCards */}
            <div className="info-container execution-status-cards">
              <StatusCard
                title="Concluídas"
                value={completedInitiatives}
                type="completed"
                onClick={() => navigate('/initiatives', { 
                  state: { 
                    filterField: 'Por Status/Performance',
                    filterValue: 'CONCLUIDA' // Pass the internal status value
                  }
                })}
              />
              <StatusCard
                title="Em Execução"
                value={inExecutionInitiatives}
                type="in-execution"
                onClick={() => navigate('/initiatives', { 
                  state: { 
                    filterField: 'Por Status/Performance',
                    filterValue: 'NOT_CONCLUIDA' // Valor especial para mostrar todas exceto as concluídas
                  }
                })}
              />
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
        
        {/* Outras seções do dashboard podem ser adicionadas aqui */}
        <div className="status-by-principle"> 
          <h2>Performance por Princípio</h2>
          <div className="principle-chart">
            <PrincipleStatusChart initiatives={initiatives} principles={principles} />
          </div>
        </div>
        
        <div className="status-by-objective">
          <h2>Performance por Objetivos</h2>
          <div className="objective-chart">
            <ObjectiveStatusChart initiatives={initiatives} objectives={objectives} />
          </div>
        </div>
        
        <div className="timeline-section">
          <h2>Linha do Tempo de Entregas</h2>
          <div className="timeline-chart">
            {/* Componente para o gráfico de linha do tempo */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
