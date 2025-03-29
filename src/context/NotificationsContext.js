import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // For now, we'll use mock data
      const mockNotifications = [
        {
          id: '1',
          title: 'Upcoming Deadline',
          message: 'Digital Identity Implementation milestone "User testing" is due in 5 days',
          type: 'deadline',
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          initiativeId: '1'
        },
        {
          id: '2',
          title: 'Status Change',
          message: 'Open Data Portal Enhancement status changed to "At Risk"',
          type: 'status',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
          initiativeId: '2'
        },
        {
          id: '3',
          title: 'New Comment',
          message: 'Manager added a comment to Digital Inclusion Program',
          type: 'comment',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          initiativeId: '3'
        }
      ];
      
      setNotifications(mockNotifications);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll update the local state
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      
      setNotifications(updatedNotifications);
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll update the local state
      const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
      setNotifications(updatedNotifications);
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        read: false,
        ...notification
      },
      ...prev
    ]);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
