import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="titulo-container">
          <h1 className="titulo-bloco">
            <span className="linha-1">ESTRATÉGIA <span className="federal">FEDERAL</span> de</span>
            <span className="linha-2">GOVERNO DIGITAL</span>
          </h1>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-date">
          <span className="header-date-label"><b>Última atualização:</b></span> {formatDate()}
        </div>
      </div>
    </header>
  );
};

export default Header;
