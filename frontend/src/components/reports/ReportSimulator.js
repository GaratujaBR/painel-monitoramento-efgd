import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaFileAlt, FaDownload, FaEye, FaEllipsisV, FaCalendarAlt } from 'react-icons/fa';
import './Reports.css';
import tituloMonitora from '../../images/titulo-monitora.png';

/**
 * Componente para simular a página de relatórios
 */
const ReportSimulator = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // Dados fictícios de relatórios
  const mockReports = [
    {
      id: 1,
      title: 'Relatório de Desempenho das Iniciativas',
      description: 'Visão geral do desempenho de todas as iniciativas, incluindo progresso, status e prazos.',
      type: 'performance',
      createdAt: '2025-03-10T14:30:00',
      createdBy: 'Ana Silva',
      downloadCount: 24,
      format: 'PDF'
    },
    {
      id: 2,
      title: 'Relatório de Status das Iniciativas',
      description: 'Detalhamento do status atual de todas as iniciativas, com foco em iniciativas em risco.',
      type: 'status',
      createdAt: '2025-03-08T10:15:00',
      createdBy: 'Carlos Mendes',
      downloadCount: 18,
      format: 'Excel'
    },
    {
      id: 3,
      title: 'Relatório de Progresso Mensal',
      description: 'Análise mensal do progresso das iniciativas, com comparativo em relação ao mês anterior.',
      type: 'progress',
      createdAt: '2025-03-05T16:45:00',
      createdBy: 'Mariana Costa',
      downloadCount: 32,
      format: 'PDF'
    },
    {
      id: 4,
      title: 'Relatório de Prazos e Marcos',
      description: 'Visão detalhada dos prazos e marcos das iniciativas, com foco em marcos próximos.',
      type: 'deadline',
      createdAt: '2025-03-01T09:20:00',
      createdBy: 'Paulo Rodrigues',
      downloadCount: 15,
      format: 'PDF'
    },
    {
      id: 5,
      title: 'Relatório de Alocação de Recursos',
      description: 'Análise da alocação de recursos humanos e financeiros nas iniciativas.',
      type: 'resource',
      createdAt: '2025-02-28T11:30:00',
      createdBy: 'Fernanda Lima',
      downloadCount: 21,
      format: 'Excel'
    },
    {
      id: 6,
      title: 'Relatório de Riscos',
      description: 'Identificação e análise dos principais riscos associados às iniciativas.',
      type: 'risk',
      createdAt: '2025-02-25T14:15:00',
      createdBy: 'Roberto Alves',
      downloadCount: 27,
      format: 'PDF'
    },
    {
      id: 7,
      title: 'Relatório Executivo',
      description: 'Resumo executivo do status geral da Estratégia Federal de Governo Digital.',
      type: 'executive',
      createdAt: '2025-02-20T10:00:00',
      createdBy: 'Juliana Santos',
      downloadCount: 45,
      format: 'PDF'
    },
    {
      id: 8,
      title: 'Relatório de Indicadores de Desempenho',
      description: 'Análise detalhada dos indicadores de desempenho das iniciativas.',
      type: 'kpi',
      createdAt: '2025-02-15T15:30:00',
      createdBy: 'Lucas Oliveira',
      downloadCount: 19,
      format: 'Excel'
    }
  ];

  // Função para filtrar relatórios com base no termo de busca e filtros
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    let matchesPeriod = true;
    const reportDate = new Date(report.createdAt);
    const now = new Date();
    
    if (periodFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = reportDate >= oneWeekAgo;
    } else if (periodFilter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = reportDate >= oneMonthAgo;
    } else if (periodFilter === 'quarter') {
      const oneQuarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesPeriod = reportDate >= oneQuarterAgo;
    }
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para obter o ícone do tipo de relatório
  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'performance':
        return <span className="report-icon performance">📊</span>;
      case 'status':
        return <span className="report-icon status">📋</span>;
      case 'progress':
        return <span className="report-icon progress">📈</span>;
      case 'deadline':
        return <span className="report-icon deadline">⏰</span>;
      case 'resource':
        return <span className="report-icon resource">💼</span>;
      case 'risk':
        return <span className="report-icon risk">⚠️</span>;
      case 'executive':
        return <span className="report-icon executive">📑</span>;
      case 'kpi':
        return <span className="report-icon kpi">🎯</span>;
      default:
        return <span className="report-icon">📄</span>;
    }
  };

  // Função para obter o texto do tipo de relatório
  const getReportTypeText = (type) => {
    switch (type) {
      case 'performance':
        return 'Desempenho';
      case 'status':
        return 'Status';
      case 'progress':
        return 'Progresso';
      case 'deadline':
        return 'Prazos';
      case 'resource':
        return 'Recursos';
      case 'risk':
        return 'Riscos';
      case 'executive':
        return 'Executivo';
      case 'kpi':
        return 'Indicadores';
      default:
        return type;
    }
  };

  // Navegação para outras páginas
  const navigateToDashboardSimulator = () => {
    navigate('/simulator');
  };

  const navigateToInitiativesSimulator = () => {
    navigate('/initiatives-simulator');
  };

  const navigateToNotificationsSimulator = () => {
    navigate('/notifications-simulator');
  };

  const navigateToUserManagementSimulator = () => {
    navigate('/user-management-simulator');
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
            <div className="sidebar-menu-item" onClick={navigateToInitiativesSimulator}>Iniciativas</div>
            <div className="sidebar-menu-item" onClick={navigateToNotificationsSimulator}>Notificações</div>
            <div className="sidebar-menu-item active">Relatórios</div>
            <div className="sidebar-menu-item" onClick={navigateToUserManagementSimulator}>Usuários</div>
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
            <div className="reports-container">
              <div className="reports-header">
                <h1>Relatórios</h1>
                <button className="new-report-button">
                  <FaFileAlt /> Novo Relatório
                </button>
              </div>

              <div className="reports-filters">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="search-icon" />
                </div>

                <div className="filter-box">
                  <FaFilter className="filter-icon" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="performance">Desempenho</option>
                    <option value="status">Status</option>
                    <option value="progress">Progresso</option>
                    <option value="deadline">Prazos</option>
                    <option value="resource">Recursos</option>
                    <option value="risk">Riscos</option>
                    <option value="executive">Executivo</option>
                    <option value="kpi">Indicadores</option>
                  </select>
                </div>

                <div className="filter-box">
                  <FaCalendarAlt className="filter-icon" />
                  <select
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                  >
                    <option value="all">Todos os Períodos</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                    <option value="quarter">Último Trimestre</option>
                  </select>
                </div>
              </div>

              <div className="reports-grid">
                {filteredReports.length === 0 ? (
                  <div className="no-reports">
                    <FaFileAlt className="no-reports-icon" />
                    <p>Nenhum relatório encontrado</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div key={report.id} className="report-card">
                      <div className="report-header">
                        {getReportTypeIcon(report.type)}
                        <div className="report-format">{report.format}</div>
                        <div className="report-actions">
                          <button className="action-button">
                            <FaEllipsisV />
                          </button>
                        </div>
                      </div>
                      <h3 className="report-title">{report.title}</h3>
                      <p className="report-description">{report.description}</p>
                      <div className="report-meta">
                        <div className="report-type">
                          <span className={`report-type-badge type-${report.type}`}>
                            {getReportTypeText(report.type)}
                          </span>
                        </div>
                        <div className="report-date">
                          <span className="date-label">Criado em:</span>
                          <span className="date-value">{formatDate(report.createdAt)}</span>
                        </div>
                        <div className="report-author">
                          <span className="author-label">Por:</span>
                          <span className="author-value">{report.createdBy}</span>
                        </div>
                      </div>
                      <div className="report-stats">
                        <div className="download-count">
                          <FaDownload /> {report.downloadCount} downloads
                        </div>
                      </div>
                      <div className="report-actions-footer">
                        <button className="view-report-button">
                          <FaEye /> Visualizar
                        </button>
                        <button className="download-report-button">
                          <FaDownload /> Baixar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="reports-pagination">
                <span className="pagination-info">Mostrando {filteredReports.length} de {mockReports.length} relatórios</span>
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
  );
};

export default ReportSimulator;
