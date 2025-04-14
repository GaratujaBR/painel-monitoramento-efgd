import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaClock, FaExclamationTriangle, FaComment, FaTrash } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationsContext';
import { useInitiatives } from '../../context/InitiativesContext';
import './Notifications.css';

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const { initiatives } = useInitiatives();
  const [notification, setNotification] = useState(null);
  const [relatedInitiative, setRelatedInitiative] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find notification by ID and mark as read
  useEffect(() => {
    const foundNotification = notifications.find(item => item.id === id);
    
    if (foundNotification) {
      setNotification(foundNotification);
      
      // Mark as read if not already read
      if (!foundNotification.read) {
        markAsRead(id);
      }
      
      // Find related initiative if there's an initiativeId
      if (foundNotification.initiativeId) {
        const initiative = initiatives.find(item => item.id === foundNotification.initiativeId);
        setRelatedInitiative(initiative);
      }
    } else {
      // Notification not found, redirect to list
      navigate('/notifications');
    }
    
    setLoading(false);
  }, [id, notifications, initiatives, markAsRead, navigate]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'on-track':
        return 'on-track';
      case 'in-progress':
        return 'in-progress';
      case 'at-risk':
        return 'at-risk';
      case 'delayed':
        return 'delayed';
      case 'not-started':
        return 'not-started';
      default:
        return '';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'on-track':
        return 'No Prazo';
      case 'in-progress':
        return 'Em Andamento';
      case 'at-risk':
        return 'Em Risco';
      case 'delayed':
        return 'Atrasado';
      case 'not-started':
        return 'Não Iniciado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="notification-detail-container">
        <div className="loading">Carregando notificação...</div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notification-detail-container">
        <div className="error-message">Notificação não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="notification-detail-container">
      <div className="notification-detail-header">
        <h1>{notification.title}</h1>
        <div className="notification-detail-actions">
          <Link to="/notifications" className="btn-back">
            <FaArrowLeft /> Voltar para Notificações
          </Link>
        </div>
      </div>

      <div className="notification-detail-content">
        <div className="notification-detail-meta">
          <div className="notification-detail-type">
            {getNotificationIcon(notification.type)}
            <span>{getTypeLabel(notification.type)}</span>
          </div>
          <div className="notification-detail-date">
            {formatDate(notification.date)}
          </div>
        </div>

        <div className="notification-detail-message">
          {notification.message}
        </div>

        {relatedInitiative && (
          <div className="notification-detail-related">
            <h2>Iniciativa Relacionada</h2>
            <Link to={`/initiatives/${relatedInitiative.id}`} className="related-initiative">
              <div className="related-initiative-info">
                <h3 className="related-initiative-name">{relatedInitiative.name}</h3>
                <div className="related-initiative-status">
                  Status: <span className={`status-badge ${getStatusBadgeClass(relatedInitiative.status)}`}>
                    {getStatusLabel(relatedInitiative.status)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetail;
