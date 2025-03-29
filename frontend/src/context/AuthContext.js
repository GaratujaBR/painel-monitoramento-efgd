import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    // In a real implementation, this would check with Azure AD
    // For now, we'll check localStorage for a saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a successful login
      const user = {
        id: '1',
        name: 'Test User',
        email,
        role: email.includes('manager') ? 'manager' : 'data-inputter',
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
