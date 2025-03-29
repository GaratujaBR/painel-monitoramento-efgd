import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaBell, FaEllipsisV, FaCheck, FaTrash } from 'react-icons/fa';
import './Notifications.css';
import '../DashboardSimulator.css';
import tituloMonitora from '../../images/titulo-monitora.png';

/**
 * Componente para simular a página de notificações
 */
const NotificationSimulator = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Dados fictícios de notificações
  const mockNotifications = [
    {
      id: 1,
      title: 'Atualização de Status',
      message: 'A iniciativa "Implementação do Portal Único de Serviços Digitais" foi atualizada para status "No Prazo".',
      type: 'status',
      date: '2025-03-12T10:30:00',
      read: false,
      relatedInitiative: 'Implementação do Portal Único de Serviços Digitais'
    },
    {
      id: 2,
      title: 'Novo Comentário',
      message: 'Carlos Mendes adicionou um comentário na iniciativa "Modernização do Sistema de Autenticação Gov.br".',
      type: 'comment',
      date: '2025-03-11T16:45:00',
      read: true,
      relatedInitiative: 'Modernização do Sistema de Autenticação Gov.br'
    },
    {
      id: 3,
      title: 'Prazo Próximo',
      message: 'A iniciativa "Digitalização de Processos Administrativos" tem um prazo que vence em 3 dias.',
      type: 'deadline',
      date: '2025-03-11T09:15:00',
      read: false,
      relatedInitiative: 'Digitalização de Processos Administrativos'
    },
    {
      id: 4,
      title: 'Iniciativa Concluída',
      message: 'A iniciativa "Criação de Dashboard de Monitoramento de Serviços Digitais" foi marcada como concluída.',
      type: 'completion',
      date: '2025-03-10T14:20:00',
      read: true,
      relatedInitiative: 'Criação de Dashboard de Monitoramento de Serviços Digitais'
    },
    {
      id: 5,
      title: 'Novo Membro',
      message: 'Fernanda Lima foi adicionada como membro da iniciativa "Criação de Aplicativo Móvel para Serviços Governamentais".',
      type: 'member',
      date: '2025-03-09T11:30:00',
      read: false,
      relatedInitiative: 'Criação de Aplicativo Móvel para Serviços Governamentais'
    },
    {
      id: 6,
      title: 'Atualização de Progresso',
      message: 'O progresso da iniciativa "Implementação de Assinatura Digital para Documentos Oficiais" foi atualizado para 60%.',
      type: 'progress',
      date: '2025-03-08T15:45:00',
      read: true,
      relatedInitiative: 'Implementação de Assinatura Digital para Documentos Oficiais'
    },
    {
      id: 7,
      title: 'Iniciativa em Risco',
      message: 'A iniciativa "Criação de Aplicativo Móvel para Serviços Governamentais" foi marcada como "Em Risco".',
      type: 'risk',
      date: '2025-03-07T10:15:00',
      read: false,
      relatedInitiative: 'Criação de Aplicativo Móvel para Serviços Governamentais'
    },
    {
      id: 8,
      title: 'Novo Relatório',
      message: 'Um novo relatório de desempenho foi gerado para o mês de março.',
      type: 'report',
      date: '2025-03-06T09:30:00',
      read: true,
      relatedInitiative: null
    }
  ];

  // Função para filtrar notificações com base no termo de busca e filtro de tipo
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.relatedInitiative && notification.relatedInitiative.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Função para formatar data relativa
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minutos atrás`;
      }
      return `${diffInHours} horas atrás`;
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  // Função para obter o ícone do tipo de notificação
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status':
        return <span className="notification-icon status">📊</span>;
      case 'comment':
        return <span className="notification-icon comment">💬</span>;
      case 'deadline':
        return <span className="notification-icon deadline">⏰</span>;
      case 'completion':
        return <span className="notification-icon completion">✅</span>;
      case 'member':
        return <span className="notification-icon member">👤</span>;
      case 'progress':
        return <span className="notification-icon progress">📈</span>;
      case 'risk':
        return <span className="notification-icon risk">⚠️</span>;
      case 'report':
        return <span className="notification-icon report">📄</span>;
      default:
        return <span className="notification-icon">🔔</span>;
    }
  };

  // Função para selecionar/deselecionar uma notificação
  const toggleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notificationId => notificationId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // Função para marcar notificações selecionadas como lidas
  const markSelectedAsRead = () => {
    // Em um cenário real, aqui seria feita uma chamada à API
    alert(`${selectedNotifications.length} notificações marcadas como lidas`);
    setSelectedNotifications([]);
  };

  // Função para excluir notificações selecionadas
  const deleteSelected = () => {
    // Em um cenário real, aqui seria feita uma chamada à API
    alert(`${selectedNotifications.length} notificações excluídas`);
    setSelectedNotifications([]);
  };

  // Navegação para outras páginas
  const navigateToDashboardSimulator = () => {
    navigate('/simulator');
  };

  const navigateToInitiativesSimulator = () => {
    navigate('/initiatives-simulator');
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
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo">EFGD</div>
          </div>
          <div className="sidebar-menu">
            <div className="sidebar-menu-item" onClick={navigateToDashboardSimulator}>Dashboard</div>
            <div className="sidebar-menu-item" onClick={navigateToInitiativesSimulator}>Iniciativas</div>
            <div className="sidebar-menu-item active">Notificações</div>
            <div className="sidebar-menu-item" onClick={navigateToReportsSimulator}>Relatórios</div>
            <div className="sidebar-menu-item" onClick={navigateToUserManagementSimulator}>Usuários</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-title">
              <img src={tituloMonitora} alt="Estratégia Federal de Governo Digital" className="header-logo" />
            </div>
            <div className="header-user">
              <div className="user-info">
                <div className="user-name">João Silva</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className="user-avatar">JS</div>
            </div>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            <div className="notifications-container">
              <div className="notifications-header">
                <h1>Notificações</h1>
                <div className="notifications-actions">
                  {selectedNotifications.length > 0 && (
                    <>
                      <button className="mark-read-button" onClick={markSelectedAsRead}>
                        <FaCheck /> Marcar como lida
                      </button>
                      <button className="delete-button" onClick={deleteSelected}>
                        <FaTrash /> Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="notifications-filters">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar notificações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="search-icon" />
                </div>

                <div className="filter-box">
                  <FaFilter className="filter-icon" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="status">Status</option>
                    <option value="comment">Comentários</option>
                    <option value="deadline">Prazos</option>
                    <option value="completion">Conclusões</option>
                    <option value="member">Membros</option>
                    <option value="progress">Progresso</option>
                    <option value="risk">Riscos</option>
                    <option value="report">Relatórios</option>
                  </select>
                </div>
              </div>

              <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <div className="no-notifications">
                    <FaBell className="no-notifications-icon" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'} ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}
                      onClick={() => toggleSelectNotification(notification.id)}
                    >
                      <div className="notification-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => {}}
                        />
                      </div>
                      <div className="notification-content">
                        <div className="notification-header">
                          {getNotificationIcon(notification.type)}
                          <h3 className="notification-title">{notification.title}</h3>
                          <span className="notification-date">{formatRelativeDate(notification.date)}</span>
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        {notification.relatedInitiative && (
                          <div className="notification-related">
                            <span className="related-label">Iniciativa relacionada:</span>
                            <span className="related-initiative">{notification.relatedInitiative}</span>
                          </div>
                        )}
                      </div>
                      <div className="notification-actions">
                        <button className="action-button">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="notifications-pagination">
                <span className="pagination-info">Mostrando {filteredNotifications.length} de {mockNotifications.length} notificações</span>
                <div className="pagination-controls">
                  <button className="pagination-button active">1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSimulator;
