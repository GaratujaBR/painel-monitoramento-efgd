import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaSort } from 'react-icons/fa';
import './Initiatives.css';
import '../DashboardSimulator.css';
import tituloMonitora from '../../images/titulo-monitora.png';
import { useInitiatives } from '../../context/InitiativesContext';
import InitiativeFilters from './InitiativeFilters';

/**
 * Componente para simular a página de iniciativas
 */
const InitiativeSimulator = () => {
  const navigate = useNavigate();
  const { 
    getFilteredInitiatives, 
    filters, 
    updateFilters, 
    principles, 
    objectives, 
    areas 
  } = useInitiatives();

  // Obter iniciativas filtradas
  const filteredInitiatives = getFilteredInitiatives();

  // Função para alternar a ordenação
  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ 
        sortBy: field,
        sortOrder: 'asc'
      });
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'on-track':
        return 'No Prazo';
      case 'at-risk':
        return 'Em Risco';
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Andamento';
      case 'delayed':
        return 'Atrasado';
      case 'not-started':
        return 'Não Iniciado';
      default:
        return status;
    }
  };

  // Obter nome do princípio pelo ID
  const getPrincipleName = (principleId) => {
    const principle = principles.find(p => p.id === principleId);
    return principle ? principle.name : 'Desconhecido';
  };

  // Obter nome do objetivo pelo ID
  const getObjectiveName = (objectiveId) => {
    const objective = objectives.find(o => o.id === objectiveId);
    return objective ? objective.name : 'Desconhecido';
  };

  // Obter nome da área pelo ID
  const getAreaName = (areaId) => {
    const area = areas.find(a => a.id === areaId);
    return area ? area.name : 'Desconhecido';
  };

  // Navegar para o simulador de dashboard
  const navigateToDashboardSimulator = () => {
    navigate('/simulator');
  };

  return (
    <div className="dashboard-simulator">
      <div className="dashboard-layout-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo">EFGD</div>
          </div>
          <div className="sidebar-menu">
            <div className="sidebar-menu-item" onClick={navigateToDashboardSimulator}>Dashboard</div>
            <div className="sidebar-menu-item active">Iniciativas</div>
            <div className="sidebar-menu-item">Notificações</div>
            <div className="sidebar-menu-item">Relatórios</div>
            <div className="sidebar-menu-item">Usuários</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-title">
              <img src={tituloMonitora} alt="Estratégia Federal de Governo Digital" className="header-logo" />
            </div>
            <div className="header-user">
              <div className="user-info">
                <div className="user-name">João Silva</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className="user-avatar">JS</div>
            </div>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            <div className="initiatives-container">
              <div className="initiatives-header">
                <h1>Iniciativas</h1>
              </div>

              <div className="initiative-content">
                <div className="initiative-sidebar">
                  <InitiativeFilters />
                </div>
                
                <div className="initiative-main">
                  <div className="initiatives-table-container">
                    <table className="initiatives-table">
                      <thead>
                        <tr>
                          <th>Iniciativa</th>
                          <th>Princípio</th>
                          <th>Objetivo</th>
                          <th>Área</th>
                          <th>Ano Prazo para Conclusão</th>
                          <th>Status</th>
                          <th>Progresso</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInitiatives.map((initiative) => (
                          <tr key={initiative.id}>
                            <td>{initiative.name}</td>
                            <td>{getPrincipleName(initiative.principleId)}</td>
                            <td>{getObjectiveName(initiative.objectiveId)}</td>
                            <td>{getAreaName(initiative.areaId)}</td>
                            <td>{initiative.completionYear || '-'}</td>
                            <td><span className={`status-badge status-${initiative.status}`}>{getStatusText(initiative.status)}</span></td>
                            <td>
                              <div className="progress-bar-container">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${initiative.progress}%` }}
                                ></div>
                              </div>
                              <span className="progress-text">{initiative.progress}%</span>
                            </td>
                            <td>
                              <button className="action-button">
                                <FaEllipsisV />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="initiatives-pagination">
                    <span className="pagination-info">Mostrando {filteredInitiatives.length} iniciativas</span>
                    <div className="pagination-controls">
                      <button className="pagination-button active">1</button>
                      <button className="pagination-button">2</button>
                      <button className="pagination-button">3</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeSimulator;
