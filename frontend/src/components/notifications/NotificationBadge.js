import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationsContext';
import './Notifications.css';

const NotificationBadge = () => {
  const { unreadCount } = useNotifications();

  return (
    <Link to="/notifications" className="notification-badge">
      <FaBell />
      {unreadCount > 0 && (
        <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </Link>
  );
};

export default NotificationBadge;
