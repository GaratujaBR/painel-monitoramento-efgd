import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaFileAlt, FaChartBar, FaTable, FaChartPie, FaChartLine, FaFilePdf, FaFileExcel, FaFileCsv, FaEye, FaArrowLeft } from 'react-icons/fa';
import './Reports.css';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [parameters, setParameters] = useState({
    title: '',
    description: '',
    dateFrom: '',
    dateTo: '',
    department: '',
    status: '',
    includeDetails: true,
    includeCharts: true
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showPreview, setShowPreview] = useState(false);

  // Templates de relatórios disponíveis
  const reportTemplates = [
    {
      id: 'performance',
      name: 'Relatório de Desempenho',
      description: 'Visão geral do desempenho de todas as iniciativas, incluindo progresso, status e marcos.',
      icon: 'chart-line'
    },
    {
      id: 'status',
      name: 'Relatório de Status',
      description: 'Análise detalhada do status das iniciativas agrupadas por departamento.',
      icon: 'chart-pie'
    },
    {
      id: 'detailed',
      name: 'Relatório Detalhado',
      description: 'Informações detalhadas sobre cada iniciativa, incluindo responsáveis, equipes e atualizações.',
      icon: 'table'
    },
    {
      id: 'summary',
      name: 'Resumo Executivo',
      description: 'Resumo executivo das principais métricas e realizações do período selecionado.',
      icon: 'chart-bar'
    }
  ];

  // Inicializar datas padrão
  useState(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    setParameters({
      ...parameters,
      dateFrom: sixMonthsAgo.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    });
  }, []);

  // Atualizar parâmetros
  const handleParameterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Selecionar template
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    
    // Pré-preencher título e descrição com base no template selecionado
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setParameters(prev => ({
        ...prev,
        title: template.name,
        description: template.description
      }));
    }
  };

  // Gerar relatório
  const generateReport = () => {
    // Em um cenário real, isso enviaria os parâmetros para o backend
    // e receberia o relatório gerado ou redirecionaria para a página de detalhes
    setShowPreview(true);
  };

  // Exportar relatório
  const exportReport = () => {
    // Em um cenário real, isso faria o download do relatório no formato selecionado
    alert(`Relatório exportado em formato ${exportFormat.toUpperCase()}`);
    navigate('/reports');
  };

  // Obter ícone com base no tipo de relatório
  const getTemplateIcon = (iconType) => {
    switch(iconType) {
      case 'chart-line':
        return <FaChartLine className="template-icon" />;
      case 'chart-pie':
        return <FaChartPie className="template-icon" />;
      case 'table':
        return <FaTable className="template-icon" />;
      case 'chart-bar':
        return <FaChartBar className="template-icon" />;
      default:
        return <FaFileAlt className="template-icon" />;
    }
  };

  return (
    <div className="report-detail-container">
      <div className="report-detail-header">
        <div className="header-title">
          <Link to="/reports" className="btn-back">
            <FaArrowLeft /> Voltar
          </Link>
          <h1>Gerar Novo Relatório</h1>
        </div>
      </div>
      
      <div className="report-generator">
        <div className="generator-header">
          <h2>Selecione um Modelo de Relatório</h2>
          <p className="generator-description">
            Escolha um dos modelos abaixo para gerar seu relatório. Cada modelo contém diferentes tipos de visualizações e dados.
          </p>
        </div>
        
        <div className="template-selector">
          {reportTemplates.map(template => (
            <div 
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {getTemplateIcon(template.icon)}
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
            </div>
          ))}
        </div>
        
        {selectedTemplate && (
          <>
            <div className="report-parameters">
              <div className="parameters-header">
                <h3>Configurar Relatório</h3>
              </div>
              
              <div className="parameters-content">
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="title">Título do Relatório</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="parameter-input"
                    value={parameters.title}
                    onChange={handleParameterChange}
                    placeholder="Digite um título para o relatório"
                  />
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    className="parameter-input"
                    value={parameters.description}
                    onChange={handleParameterChange}
                    placeholder="Digite uma descrição para o relatório"
                    rows={3}
                  />
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="dateFrom">Data Inicial</label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    className="parameter-input"
                    value={parameters.dateFrom}
                    onChange={handleParameterChange}
                  />
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="dateTo">Data Final</label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    className="parameter-input"
                    value={parameters.dateTo}
                    onChange={handleParameterChange}
                  />
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="department">Departamento</label>
                  <select
                    id="department"
                    name="department"
                    className="parameter-select"
                    value={parameters.department}
                    onChange={handleParameterChange}
                  >
                    <option value="">Todos os departamentos</option>
                    <option value="TI">TI</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Análise de Dados">Análise de Dados</option>
                    <option value="Comunicação">Comunicação</option>
                    <option value="Operações">Operações</option>
                  </select>
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label" htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="parameter-select"
                    value={parameters.status}
                    onChange={handleParameterChange}
                  >
                    <option value="">Todos os status</option>
                    <option value="completed">Concluídas</option>
                    <option value="in-progress">Em Andamento</option>
                    <option value="at-risk">Em Risco</option>
                    <option value="delayed">Atrasadas</option>
                    <option value="not-started">Não Iniciadas</option>
                  </select>
                </div>
                
                <div className="parameter-group">
                  <label className="parameter-label">Opções de Conteúdo</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="includeDetails"
                      name="includeDetails"
                      checked={parameters.includeDetails}
                      onChange={handleParameterChange}
                    />
                    <label htmlFor="includeDetails">Incluir tabelas detalhadas</label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      name="includeCharts"
                      checked={parameters.includeCharts}
                      onChange={handleParameterChange}
                    />
                    <label htmlFor="includeCharts">Incluir gráficos</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="export-options">
              <h3>Formato de Exportação</h3>
              <div className="format-options">
                <div className="format-option">
                  <input
                    type="radio"
                    id="formatPdf"
                    name="exportFormat"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <label htmlFor="formatPdf"><FaFilePdf /> PDF</label>
                </div>
                <div className="format-option">
                  <input
                    type="radio"
                    id="formatExcel"
                    name="exportFormat"
                    value="excel"
                    checked={exportFormat === 'excel'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <label htmlFor="formatExcel"><FaFileExcel /> Excel</label>
                </div>
                <div className="format-option">
                  <input
                    type="radio"
                    id="formatCsv"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <label htmlFor="formatCsv"><FaFileCsv /> CSV</label>
                </div>
              </div>
            </div>
            
            <div className="generator-actions">
              <button 
                className="btn-cancel"
                onClick={() => navigate('/reports')}
              >
                Cancelar
              </button>
              <button 
                className="btn-preview"
                onClick={() => setShowPreview(true)}
              >
                <FaEye /> Visualizar
              </button>
              <button 
                className="btn-generate"
                onClick={generateReport}
              >
                Gerar Relatório
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Modal de visualização prévia */}
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h2 className="preview-title">Visualização do Relatório</h2>
              <button 
                className="preview-close"
                onClick={() => setShowPreview(false)}
              >
                &times;
              </button>
            </div>
            <div className="preview-body">
              <h1>{parameters.title}</h1>
              <p>{parameters.description}</p>
              <p className="preview-params">
                Período: {new Date(parameters.dateFrom).toLocaleDateString('pt-BR')} a {new Date(parameters.dateTo).toLocaleDateString('pt-BR')}
                {parameters.department && ` | Departamento: ${parameters.department}`}
                {parameters.status && ` | Status: ${parameters.status}`}
              </p>
              
              {/* Conteúdo simulado do relatório */}
              <div className="report-section">
                <h2>Resumo Executivo</h2>
                <div className="report-summary">
                  <p className="summary-content">
                    Este relatório apresenta uma visão geral do desempenho das iniciativas da Estratégia Federal de Governo Digital (EFGD).
                    No período analisado, observamos um progresso médio de 68% nas iniciativas, com 12 iniciativas concluídas, 28 em andamento e 5 atrasadas.
                  </p>
                </div>
              </div>
              
              {parameters.includeCharts && (
                <>
                  <div className="report-section">
                    <h2>Progresso por Departamento</h2>
                    <div className="report-chart">
                      <div className="chart-placeholder">
                        <FaChartBar size={50} color="#183EFF" />
                        <p>Gráfico de barras com dados de progresso por departamento</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="report-section">
                    <h2>Status das Iniciativas</h2>
                    <div className="report-chart">
                      <div className="chart-placeholder">
                        <FaChartPie size={50} color="#183EFF" />
                        <p>Gráfico de pizza com distribuição de status</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {parameters.includeDetails && (
                <>
                  <div className="report-section">
                    <h2>Iniciativas com Melhor Desempenho</h2>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Departamento</th>
                          <th>Progresso</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Implementação do Portal de Serviços</td>
                          <td>TI</td>
                          <td>95%</td>
                          <td>Em Andamento</td>
                        </tr>
                        <tr>
                          <td>Modernização da Infraestrutura</td>
                          <td>Operações</td>
                          <td>100%</td>
                          <td>Concluída</td>
                        </tr>
                        <tr>
                          <td>Desenvolvimento de APIs</td>
                          <td>TI</td>
                          <td>85%</td>
                          <td>Em Andamento</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="preview-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowPreview(false)}
              >
                Fechar
              </button>
              <button 
                className="btn-export"
                onClick={exportReport}
              >
                Exportar {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
