import React from 'react';
import { Link } from 'react-router-dom';
import monitorImage from '../../assets/images/monitor-novo.png';
import { FaChartBar, FaClipboardList, FaDesktop } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isOpen ? (
          <img 
            src={monitorImage} 
            alt="Monitoramento" 
            className="sidebar-logo"
          />
        ) : (
          null // Ícone removido quando a barra lateral está contraída
        )}
        <h3 className="sidebar-title">
          Monitoramento<br />
          Interno<br />
          <span className="sidebar-title-yellow">EFGD</span>
        </h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/painel-geral">
              <FaChartBar className="menu-icon" color="white" />
              <span className="menu-text">Painel Geral</span>
            </Link>
          </li>
          <li>
            <Link to="/initiatives">
              <FaClipboardList className="menu-icon" color="white" />
              <span className="menu-text">Iniciativas</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
