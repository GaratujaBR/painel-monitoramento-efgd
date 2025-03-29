import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaFilter, FaSearch, FaPlus, FaChartBar, FaTable, FaCalendarAlt, FaChartPie, FaChartLine } from 'react-icons/fa';
import './Reports.css';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    department: ''
  });

  // Simular carregamento de relatórios
  useEffect(() => {
    // Em um cenário real, isso seria uma chamada de API
    const mockReports = [
      {
        id: '1',
        title: 'Relatório de Desempenho de Iniciativas',
        description: 'Visão geral do desempenho de todas as iniciativas, incluindo progresso, status e marcos.',
        type: 'performance',
        icon: 'chart-line',
        createdAt: '2025-03-01',
        department: 'Todos'
      },
      {
        id: '2',
        title: 'Relatório de Status por Departamento',
        description: 'Análise detalhada do status das iniciativas agrupadas por departamento.',
        type: 'status',
        icon: 'chart-pie',
        createdAt: '2025-03-05',
        department: 'Todos'
      },
      {
        id: '3',
        title: 'Relatório Detalhado de Iniciativas',
        description: 'Informações detalhadas sobre cada iniciativa, incluindo responsáveis, equipes e atualizações.',
        type: 'detailed',
        icon: 'table',
        createdAt: '2025-03-10',
        department: 'TI'
      },
      {
        id: '4',
        title: 'Resumo Executivo Mensal',
        description: 'Resumo executivo das principais métricas e realizações do mês.',
        type: 'summary',
        icon: 'chart-bar',
        createdAt: '2025-03-12',
        department: 'Diretoria'
      },
      {
        id: '5',
        title: 'Relatório de Marcos Concluídos',
        description: 'Lista de todos os marcos concluídos no período selecionado.',
        type: 'detailed',
        icon: 'table',
        createdAt: '2025-03-14',
        department: 'Todos'
      },
      {
        id: '6',
        title: 'Análise de Tendências',
        description: 'Análise de tendências de progresso e desempenho ao longo do tempo.',
        type: 'performance',
        icon: 'chart-line',
        createdAt: '2025-03-15',
        department: 'Análise de Dados'
      }
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  // Aplicar filtros aos relatórios
  const applyFilters = () => {
    let result = [...reports];

    // Filtrar por termo de busca
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(report => 
        report.title.toLowerCase().includes(searchTerm) || 
        report.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por tipo
    if (filters.type) {
      result = result.filter(report => report.type === filters.type);
    }

    // Filtrar por departamento
    if (filters.department) {
      result = result.filter(report => 
        report.department === filters.department || 
        report.department === 'Todos'
      );
    }

    // Filtrar por data
    if (filters.dateFrom) {
      result = result.filter(report => new Date(report.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      result = result.filter(report => new Date(report.createdAt) <= new Date(filters.dateTo));
    }

    setFilteredReports(result);
  };

  // Atualizar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      department: ''
    });
    setFilteredReports(reports);
  };

  // Obter ícone com base no tipo de relatório
  const getReportIcon = (iconType) => {
    switch(iconType) {
      case 'chart-line':
        return <FaChartLine />;
      case 'chart-pie':
        return <FaChartPie />;
      case 'table':
        return <FaTable />;
      case 'chart-bar':
        return <FaChartBar />;
      default:
        return <FaFileAlt />;
    }
  };

  // Obter classe de badge com base no tipo de relatório
  const getReportTypeBadgeClass = (type) => {
    switch(type) {
      case 'performance':
        return 'report-type-badge report-type-performance';
      case 'summary':
        return 'report-type-badge report-type-summary';
      case 'detailed':
        return 'report-type-badge report-type-detailed';
      case 'status':
        return 'report-type-badge report-type-status';
      default:
        return 'report-type-badge';
    }
  };

  // Obter label do tipo de relatório
  const getReportTypeLabel = (type) => {
    switch(type) {
      case 'performance':
        return 'Desempenho';
      case 'summary':
        return 'Resumo';
      case 'detailed':
        return 'Detalhado';
      case 'status':
        return 'Status';
      default:
        return 'Outro';
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Relatórios</h1>
        <div className="reports-actions">
          <button 
            className="btn-create-report"
            onClick={() => {}}
          >
            <FaPlus /> Novo Relatório
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="reports-filters">
        <div className="filters-header">
          <h3>Filtros</h3>
          <button 
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {showFilters && (
          <>
            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label" htmlFor="searchTerm">Buscar</label>
                <div className="search-input-container">
                  <input
                    type="text"
                    id="searchTerm"
                    name="searchTerm"
                    className="filter-input"
                    placeholder="Buscar relatórios..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                  />
                  <FaSearch className="search-icon" />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="type">Tipo</label>
                <select
                  id="type"
                  name="type"
                  className="filter-select"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os tipos</option>
                  <option value="performance">Desempenho</option>
                  <option value="summary">Resumo</option>
                  <option value="detailed">Detalhado</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="department">Departamento</label>
                <select
                  id="department"
                  name="department"
                  className="filter-select"
                  value={filters.department}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os departamentos</option>
                  <option value="TI">TI</option>
                  <option value="Diretoria">Diretoria</option>
                  <option value="Análise de Dados">Análise de Dados</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="dateFrom">Data Inicial</label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  className="filter-input"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="dateTo">Data Final</label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  className="filter-input"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button 
                className="btn-clear-filters"
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
              <button 
                className="btn-apply-filters"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </button>
            </div>
          </>
        )}
      </div>

      {/* Lista de Relatórios */}
      <div className="report-list">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <Link 
              to={`/reports/${report.id}`} 
              key={report.id}
              className="report-card"
            >
              <div className="report-card-header">
                <h3 className="report-title">{report.title}</h3>
                <div className="report-icon">
                  {getReportIcon(report.icon)}
                </div>
              </div>
              <p className="report-description">{report.description}</p>
              <div className="report-meta">
                <div className="report-date">
                  <FaCalendarAlt />
                  {formatDate(report.createdAt)}
                </div>
                <div className="report-type">
                  <span className={getReportTypeBadgeClass(report.type)}>
                    {getReportTypeLabel(report.type)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-reports">
            <p>Nenhum relatório encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;
