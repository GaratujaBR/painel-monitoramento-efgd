import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import DashboardLayout from './layout/DashboardLayout';
import InitiativeStatusChart from './dashboard/InitiativeStatusChart';
import './DashboardSimulator.css';
import './dashboard/Dashboard.css';
import tituloMonitora from '../images/titulo-monitora.png';

/**
 * Componente para simular um usuário autenticado e renderizar o dashboard
 */
const DashboardSimulator = () => {
  const navigate = useNavigate();

  // Dados simulados para o dashboard
  const mockInitiatives = [
    {
      id: 1,
      name: 'Implementação do Portal de Serviços Digitais',
      progress: 75,
      status: 'on-track',
      milestones: [
        { id: 1, name: 'Análise de requisitos', status: 'completed', date: '2024-01-15' },
        { id: 2, name: 'Desenvolvimento do frontend', status: 'completed', date: '2024-02-28' },
        { id: 3, name: 'Desenvolvimento do backend', status: 'in-progress', date: '2024-03-30' },
        { id: 4, name: 'Testes de integração', status: 'not-started', date: '2024-04-15' },
        { id: 5, name: 'Lançamento', status: 'not-started', date: '2024-05-01' }
      ]
    },
    {
      id: 2,
      name: 'Modernização do Sistema de Gestão de Documentos',
      progress: 40,
      status: 'at-risk',
      milestones: [
        { id: 6, name: 'Levantamento de processos', status: 'completed', date: '2024-01-20' },
        { id: 7, name: 'Migração de dados', status: 'delayed', date: '2024-02-15' },
        { id: 8, name: 'Implementação de novas funcionalidades', status: 'in-progress', date: '2024-03-25' },
        { id: 9, name: 'Treinamento de usuários', status: 'not-started', date: '2024-04-10' }
      ]
    },
    {
      id: 3,
      name: 'Plataforma de Capacitação em Governo Digital',
      progress: 90,
      status: 'on-track',
      milestones: [
        { id: 10, name: 'Definição de conteúdos', status: 'completed', date: '2024-01-10' },
        { id: 11, name: 'Desenvolvimento da plataforma', status: 'completed', date: '2024-02-20' },
        { id: 12, name: 'Produção de materiais', status: 'completed', date: '2024-03-15' },
        { id: 13, name: 'Testes com usuários', status: 'in-progress', date: '2024-03-30' },
        { id: 14, name: 'Lançamento oficial', status: 'not-started', date: '2024-04-20' }
      ]
    },
    {
      id: 4,
      name: 'Implementação de Autenticação Gov.br',
      progress: 60,
      status: 'on-track',
      milestones: [
        { id: 15, name: 'Integração com API Gov.br', status: 'completed', date: '2024-02-05' },
        { id: 16, name: 'Desenvolvimento de fluxos de autenticação', status: 'in-progress', date: '2024-03-10' },
        { id: 17, name: 'Testes de segurança', status: 'not-started', date: '2024-04-05' }
      ]
    },
    {
      id: 5,
      name: 'Programa de Transformação Digital de Municípios',
      progress: 25,
      status: 'at-risk',
      milestones: [
        { id: 18, name: 'Seleção de municípios piloto', status: 'completed', date: '2024-01-25' },
        { id: 19, name: 'Diagnóstico de maturidade digital', status: 'in-progress', date: '2024-03-01' },
        { id: 20, name: 'Elaboração de planos de transformação', status: 'delayed', date: '2024-03-20' },
        { id: 21, name: 'Implementação de soluções', status: 'not-started', date: '2024-05-15' }
      ]
    }
  ];

  // Use the real Dashboard component with the InitiativesProvider context
  const SimulatedDashboard = () => {
    // Convert mock initiatives to the format expected by the Dashboard component
    const formattedInitiatives = mockInitiatives.map(initiative => ({
      id: initiative.id.toString(),
      name: initiative.name,
      principleId: 'I - Governo Centrado no Cidadão e Inclusivo', // Default principle
      objectiveId: 'O1 - Prover serviços públicos digitais', // Default objective
      areaId: 'A1', // Default area
      completionYear: '2024',
      status: initiative.status === 'on-track' ? 'NO_CRONOGRAMA' : 
              initiative.status === 'at-risk' ? 'ATRASADA' : 
              initiative.progress === 100 ? 'CONCLUIDA' : 'NAO_INICIADA',
      progress: initiative.progress
    }));

    // Import the actual InitiativesContext
    const { InitiativesProvider } = require('../context/InitiativesContext');
    
    // Create a simplified version of the Dashboard that uses the mock data
    const SimplifiedDashboard = () => {
      // Create a mock version of the initiatives data
      const mockContextData = {
        initiatives: formattedInitiatives,
        principles: [
          { id: 'I - Governo Centrado no Cidadão e Inclusivo', name: 'I - Governo Centrado no Cidadão e Inclusivo' },
          { id: 'II - Governo Integrado e Colaborativo', name: 'II - Governo Integrado e Colaborativo' },
          { id: 'III - Governo Inteligente e Inovador', name: 'III - Governo Inteligente e Inovador' },
          { id: 'IV - Governo Confiável e Seguro', name: 'IV - Governo Confiável e Seguro' },
          { id: 'V - Governo Transparente, Aberto e Participativo', name: 'V - Governo Transparente, Aberto e Participativo' },
          { id: 'VI - Governo Eficiente e Sustentável', name: 'VI - Governo Eficiente e Sustentável' }
        ],
        objectives: [
          { id: 'O1 - Prover serviços públicos digitais', name: 'O1 - Prover serviços públicos digitais' }
        ],
        areas: [
          { id: 'A1', name: 'SGD' }
        ]
      };
      
      // Create a simplified dashboard that doesn't rely on the context
      return (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-intro">
              <h1>Painel de Monitoramento EFGD</h1>
              <p className="dashboard-description">
                Estas são as estatísticas gerais da Estratégia Federal de Governo Digital. 
                Para conhecer em detalhes o andamento de cada um dos Princípios, Objetivos e 
                Iniciativas da EFGD, clique no ícone do Princípio e navegue pelos gráficos.
              </p>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="dashboard-section principles-section">
              <h2>Princípios</h2>
              <div className="principles-grid">
                <div className="principle-item">
                  <h3>I - GOVERNO CENTRADO NO CIDADÃO E INCLUSIVO</h3>
                </div>
                <div className="principle-item">
                  <h3>II - GOVERNO INTEGRADO E COLABORATIVO</h3>
                </div>
                <div className="principle-item">
                  <h3>III - GOVERNO INTELIGENTE E INOVADOR</h3>
                </div>
                <div className="principle-item">
                  <h3>IV - GOVERNO CONFIÁVEL E SEGURO</h3>
                </div>
                <div className="principle-item">
                  <h3>V - GOVERNO TRANSPARENTE, ABERTO E PARTICIPATIVO</h3>
                </div>
                <div className="principle-item">
                  <h3>VI - GOVERNO EFICIENTE E SUSTENTÁVEL</h3>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section status-section">
              <div className="status-overview">
                <div className="status-chart-container">
                  <h2>Status EFGD</h2>
                  <InitiativeStatusChart initiatives={formattedInitiatives} />
                </div>
                
                <div className="completed-initiatives">
                  <h2>Iniciativas Concluídas</h2>
                  <div className="completed-count">
                    {formattedInitiatives.filter(i => i.status === 'CONCLUIDA').length}
                  </div>
                </div>
              </div>
              
              <div className="status-by-principle">
                <h2>Status por Princípio</h2>
                <div className="principle-chart">
                  <p>Gráfico de barras empilhadas mostrando status por princípio</p>
                </div>
              </div>
              
              <div className="status-by-objective">
                <h2>Status por Objetivos</h2>
                <div className="objective-chart">
                  <p>Gráfico de barras horizontais mostrando status por objetivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    return <SimplifiedDashboard />;
  };

  const navigateToInitiativesSimulator = () => {
    navigate('/initiatives-simulator');
  };

  const navigateToNotificationsSimulator = () => {
    navigate('/notifications-simulator');
  };

  const navigateToReportsSimulator = () => {
    navigate('/reports-simulator');
  };

  const navigateToUserManagementSimulator = () => {
    navigate('/user-management-simulator');
  };

  return (
    <div className="dashboard-simulator">
      <div className="dashboard-layout-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo">EFGD</div>
          </div>
          <div className="sidebar-menu">
            <div className="sidebar-menu-item active">Dashboard</div>
            <div className="sidebar-menu-item" onClick={navigateToInitiativesSimulator}>Iniciativas</div>
            <div className="sidebar-menu-item" onClick={navigateToNotificationsSimulator}>Notificações</div>
            <div className="sidebar-menu-item" onClick={navigateToReportsSimulator}>Relatórios</div>
            <div className="sidebar-menu-item" onClick={navigateToUserManagementSimulator}>Usuários</div>
          </div>
        </div>
        <div className="dashboard-main">
          <div className="dashboard-header">
            <div className="header-title">
              <img src={tituloMonitora} alt="Estratégia Federal de Governo Digital" className="header-logo" />
            </div>
            <div className="header-user">
              <div className="user-info">
                <div className="user-name">Usuário Simulado</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className="user-avatar">US</div>
            </div>
          </div>
          <div className="dashboard-content">
            <SimulatedDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSimulator;
