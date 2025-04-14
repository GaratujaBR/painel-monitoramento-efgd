import React from 'react';
import { Link } from 'react-router-dom';
import monitorImage from '../../images/monitor6.png';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img 
          src={monitorImage} 
          alt="Monitoramento" 
          className="sidebar-logo"
        />
        <h3 className="sidebar-title">Monitoramento<br/>EFGD</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/painel-geral">Painel Geral</Link>
          </li>
          <li>
            <Link to="/initiatives">Iniciativas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
