import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the login function from AuthContext
      await login('admin@example.com', 'password');
      // Navigate to the real dashboard
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Painel de Monitoramento</h2>
        <p>Faça login com sua conta institucional</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          className="login-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            'Entrar com Google'
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
