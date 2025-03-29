import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import NotificationBadge from '../notifications/NotificationBadge';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Format current date according to Brazilian format
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date().toLocaleDateString('pt-BR', options);
  };
  
  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Botão de toggle da barra lateral - temporariamente desativado
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        */}
        <div className="titulo-container">
          <h1>
            <span className="linha-1">ESTRATÉGIA <span className="federal">FEDERAL</span> de</span>
            <span className="linha-2">GOVERNO DIGITAL</span>
          </h1>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-date">
          {formatDate()}
        </div>
        
        <div className="header-actions">
          <NotificationBadge />
          
          <div className="user-dropdown">
            <button className="user-button">
              <div className="user-avatar">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{currentUser?.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
