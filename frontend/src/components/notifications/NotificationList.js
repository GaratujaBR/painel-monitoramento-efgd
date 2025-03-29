import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaClock, FaExclamationTriangle, FaComment, FaCheck, FaTrash } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationsContext';
import './Notifications.css';

const NotificationList = () => {
  const { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Apply filters whenever notifications, searchTerm, or typeFilter changes
  useEffect(() => {
    let filtered = [...notifications];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTermLower) || 
        notification.message.toLowerCase().includes(searchTermLower)
      );
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle type filter change
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Handle mark as read for a single notification
  const handleMarkAsRead = (e, id) => {
    e.preventDefault();
    markAsRead(id);
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffMin < 1) {
      return 'Agora mesmo';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'} atrás`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hora' : 'horas'} atrás`;
    } else if (diffDay < 30) {
      return `${diffDay} ${diffDay === 1 ? 'dia' : 'dias'} atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deadline':
        return <FaClock className="notification-icon deadline" />;
      case 'status':
        return <FaExclamationTriangle className="notification-icon status" />;
      case 'comment':
        return <FaComment className="notification-icon comment" />;
      case 'update':
        return <FaBell className="notification-icon update" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  // Get type label based on notification type
  const getTypeLabel = (type) => {
    switch (type) {
      case 'deadline':
        return 'Prazo';
      case 'status':
        return 'Status';
      case 'comment':
        return 'Comentário';
      case 'update':
        return 'Atualização';
      default:
        return 'Notificação';
    }
  };

  if (loading) {
    return (
      <div className="notification-list-container">
        <div className="loading">Carregando notificações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-list-container">
        <div className="error-message">Erro ao carregar notificações: {error}</div>
      </div>
    );
  }

  return (
    <div className="notification-list-container">
      <div className="notification-list-header">
        <h1>Notificações</h1>
        <div className="notification-actions">
          <button 
            className="btn-mark-all-read"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <FaCheck /> Marcar todas como lidas
          </button>
        </div>
      </div>

      <div className="notification-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="type-filter">
          <select value={typeFilter} onChange={handleTypeFilterChange}>
            <option value="all">Todos os tipos</option>
            <option value="deadline">Prazos</option>
            <option value="status">Status</option>
            <option value="comment">Comentários</option>
            <option value="update">Atualizações</option>
          </select>
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <Link 
              to={`/notifications/${notification.id}`} 
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              {getNotificationIcon(notification.type)}
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-date">{formatDate(notification.date)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-actions-item">
                  {!notification.read && (
                    <button 
                      className="btn-mark-read"
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                    >
                      <FaCheck /> Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-notifications">
            <p>Nenhuma notificação encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
