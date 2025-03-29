import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from './dashboard/Dashboard';
import NotificationList from './notifications/NotificationList';
import ReportList from './reports/ReportList';
import UserManagement from './user-management/UserManagement';
import tituloMonitora from '../images/titulo-monitora.png';
import './DashboardSimulator.css';

/**
 * Componente para visualizar o dashboard principal sem precisar fazer login
 */
const DashboardPreview = () => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Simular login automaticamente
  useEffect(() => {
    const autoLogin = async () => {
      if (!currentUser) {
        try {
          // Login automático com credenciais de teste
          await login('admin@gov.br', 'password123');
        } catch (error) {
          console.error('Erro ao fazer login automático:', error);
        }
      }
    };

    autoLogin();
  }, [currentUser, login, navigate]);

  // Função para renderizar o conteúdo com base na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationList />;
      case 'reports':
        return <ReportList />;
      case 'users':
        return <UserManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const navigateToInitiativesSimulator = () => {
    navigate('/initiatives-simulator');
  };

  // Renderizar o layout do dashboard com o conteúdo principal
  return (
    <div className="dashboard-simulator">
      <div className="dashboard-layout-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo">EFGD</div>
          </div>
          <div className="sidebar-menu">
            <div 
              className={`sidebar-menu-item ${activeSection === 'dashboard' ? 'active' : ''}`} 
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </div>
            <div 
              className="sidebar-menu-item" 
              onClick={navigateToInitiativesSimulator}
            >
              Iniciativas
            </div>
            <div 
              className={`sidebar-menu-item ${activeSection === 'notifications' ? 'active' : ''}`} 
              onClick={() => setActiveSection('notifications')}
            >
              Notificações
            </div>
            <div 
              className={`sidebar-menu-item ${activeSection === 'reports' ? 'active' : ''}`} 
              onClick={() => setActiveSection('reports')}
            >
              Relatórios
            </div>
            <div 
              className={`sidebar-menu-item ${activeSection === 'users' ? 'active' : ''}`} 
              onClick={() => setActiveSection('users')}
            >
              Usuários
            </div>
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
            {currentUser ? renderContent() : <div className="loading-screen">Carregando dashboard...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
