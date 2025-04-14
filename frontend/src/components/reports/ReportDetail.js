import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaDownload, FaPrint, FaArrowLeft, FaChartBar, FaTable, FaChartPie, FaChartLine, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import './Reports.css';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parameters, setParameters] = useState({
    dateFrom: '',
    dateTo: '',
    department: '',
    status: '',
    includeDetails: true,
    includeCharts: true
  });
  const [showPreview, setShowPreview] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Simular carregamento do relatório
  useEffect(() => {
    // Em um cenário real, isso seria uma chamada de API
    const fetchReport = () => {
      setLoading(true);
      
      // Dados simulados
      const mockReports = {
        '1': {
          id: '1',
          title: 'Relatório de Desempenho de Iniciativas',
          description: 'Visão geral do desempenho de todas as iniciativas, incluindo progresso, status e marcos.',
          type: 'performance',
          icon: 'chart-line',
          createdAt: '2025-03-01',
          department: 'Todos',
          sections: [
            {
              title: 'Resumo Executivo',
              type: 'summary',
              content: 'Este relatório apresenta uma visão geral do desempenho das iniciativas da Estratégia Federal de Governo Digital (EFGD). No período analisado, observamos um progresso médio de 68% nas iniciativas, com 12 iniciativas concluídas, 28 em andamento e 5 atrasadas.'
            },
            {
              title: 'Progresso por Departamento',
              type: 'chart',
              chartType: 'bar',
              data: {
                labels: ['TI', 'Diretoria', 'Análise de Dados', 'Comunicação', 'Operações'],
                datasets: [
                  {
                    label: 'Progresso Médio (%)',
                    data: [75, 62, 80, 58, 65]
                  }
                ]
              }
            },
            {
              title: 'Status das Iniciativas',
              type: 'chart',
              chartType: 'pie',
              data: {
                labels: ['Concluídas', 'Em Andamento', 'Atrasadas', 'Não Iniciadas'],
                datasets: [
                  {
                    data: [12, 28, 5, 3],
                    backgroundColor: ['#00D000', '#FFD000', '#FF0000', '#CCCCCC']
                  }
                ]
              }
            },
            {
              title: 'Iniciativas com Melhor Desempenho',
              type: 'table',
              data: {
                headers: ['Nome', 'Departamento', 'Progresso', 'Status'],
                rows: [
                  ['Implementação do Portal de Serviços', 'TI', '95%', 'Em Andamento'],
                  ['Modernização da Infraestrutura', 'Operações', '100%', 'Concluída'],
                  ['Desenvolvimento de APIs', 'TI', '85%', 'Em Andamento'],
                  ['Capacitação de Servidores', 'Comunicação', '100%', 'Concluída'],
                  ['Implementação de BI', 'Análise de Dados', '90%', 'Em Andamento']
                ]
              }
            },
            {
              title: 'Iniciativas que Requerem Atenção',
              type: 'table',
              data: {
                headers: ['Nome', 'Departamento', 'Progresso', 'Status', 'Prazo'],
                rows: [
                  ['Migração de Sistemas Legados', 'TI', '45%', 'Atrasada', '2025-04-15'],
                  ['Implementação de Chatbot', 'Comunicação', '30%', 'Atrasada', '2025-03-30'],
                  ['Revisão de Processos', 'Operações', '50%', 'Em Risco', '2025-05-10']
                ]
              }
            },
            {
              title: 'Tendência de Progresso',
              type: 'chart',
              chartType: 'line',
              data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                  {
                    label: 'Progresso Médio (%)',
                    data: [35, 42, 55, 60, 65, 68]
                  }
                ]
              }
            },
            {
              title: 'Recomendações',
              type: 'text',
              content: 'Com base na análise dos dados, recomendamos:\n\n1. Focar atenção nas iniciativas atrasadas, especialmente na "Migração de Sistemas Legados" e "Implementação de Chatbot".\n\n2. Compartilhar as melhores práticas do departamento de TI e Análise de Dados com os demais departamentos.\n\n3. Revisar os prazos das iniciativas em risco para garantir que sejam realistas e alcançáveis.'
            }
          ]
        },
        '2': {
          id: '2',
          title: 'Relatório de Status por Departamento',
          description: 'Análise detalhada do status das iniciativas agrupadas por departamento.',
          type: 'status',
          icon: 'chart-pie',
          createdAt: '2025-03-05',
          department: 'Todos',
          sections: [
            {
              title: 'Resumo por Departamento',
              type: 'summary',
              content: 'Este relatório apresenta uma análise detalhada do status das iniciativas por departamento. Atualmente, o departamento de TI possui o maior número de iniciativas (15), seguido por Operações (12) e Análise de Dados (10).'
            },
            {
              title: 'Distribuição de Iniciativas por Departamento',
              type: 'chart',
              chartType: 'bar',
              data: {
                labels: ['TI', 'Diretoria', 'Análise de Dados', 'Comunicação', 'Operações'],
                datasets: [
                  {
                    label: 'Número de Iniciativas',
                    data: [15, 8, 10, 7, 12]
                  }
                ]
              }
            }
          ]
        }
      };

      setTimeout(() => {
        if (mockReports[id]) {
          setReport(mockReports[id]);
          // Inicializar os parâmetros com datas padrão
          const today = new Date();
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          
          setParameters({
            ...parameters,
            dateFrom: sixMonthsAgo.toISOString().split('T')[0],
            dateTo: today.toISOString().split('T')[0]
          });
        }
        setLoading(false);
      }, 1000);
    };

    fetchReport();
  }, [id]);

  // Atualizar parâmetros
  const handleParameterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gerar relatório
  const generateReport = () => {
    // Em um cenário real, isso enviaria os parâmetros para o backend
    // e receberia o relatório gerado
    setShowPreview(true);
  };

  // Exportar relatório
  const exportReport = () => {
    // Em um cenário real, isso faria o download do relatório no formato selecionado
    alert(`Relatório exportado em formato ${exportFormat.toUpperCase()}`);
  };

  // Obter ícone com base no tipo de relatório
  const getReportIcon = (iconType) => {
    switch(iconType) {
      case 'chart-line':
        return <FaChartLine className="report-icon" />;
      case 'chart-pie':
        return <FaChartPie className="report-icon" />;
      case 'table':
        return <FaTable className="report-icon" />;
      case 'chart-bar':
        return <FaChartBar className="report-icon" />;
      default:
        return <FaFileAlt className="report-icon" />;
    }
  };

  // Renderizar seção do relatório
  const renderReportSection = (section, index) => {
    switch(section.type) {
      case 'summary':
      case 'text':
        return (
          <div key={index} className="report-section">
            <h2>{section.title}</h2>
            <div className="report-summary">
              <p className="summary-content">{section.content}</p>
            </div>
          </div>
        );
      case 'chart':
        if (!parameters.includeCharts) return null;
        return (
          <div key={index} className="report-section">
            <h2>{section.title}</h2>
            <div className="report-chart">
              {/* Em um cenário real, aqui seria renderizado um gráfico com os dados */}
              <div className="chart-placeholder">
                {section.chartType === 'bar' && <FaChartBar size={50} color="#183EFF" />}
                {section.chartType === 'pie' && <FaChartPie size={50} color="#183EFF" />}
                {section.chartType === 'line' && <FaChartLine size={50} color="#183EFF" />}
                <p>Gráfico {section.chartType} com os dados fornecidos</p>
              </div>
            </div>
          </div>
        );
      case 'table':
        if (!parameters.includeDetails) return null;
        return (
          <div key={index} className="report-section">
            <h2>{section.title}</h2>
            <table className="report-table">
              <thead>
                <tr>
                  {section.data.headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.data.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!report) {
    return (
      <div className="report-not-found">
        <h2>Relatório não encontrado</h2>
        <p>O relatório que você está procurando não existe ou foi removido.</p>
        <Link to="/reports" className="btn-back">
          <FaArrowLeft /> Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="report-detail-container">
      <div className="report-detail-header">
        <div className="header-title">
          <Link to="/reports" className="btn-back">
            <FaArrowLeft /> Voltar
          </Link>
          <h1>{report.title}</h1>
          {getReportIcon(report.icon)}
        </div>
        
        <div className="report-detail-actions">
          <button 
            className="btn-print"
            onClick={() => window.print()}
          >
            <FaPrint /> Imprimir
          </button>
          <button 
            className="btn-export"
            onClick={exportReport}
          >
            <FaDownload /> Exportar
          </button>
        </div>
      </div>
      
      {/* Parâmetros do relatório */}
      <div className="report-parameters">
        <div className="parameters-header">
          <h3>Parâmetros do Relatório</h3>
        </div>
        
        <div className="parameters-content">
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
          
          <div className="parameter-group">
            <label className="parameter-label">Formato de Exportação</label>
            <div className="radio-group">
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
            <div className="radio-group">
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
            <div className="radio-group">
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
        
        <div className="parameter-actions">
          <button 
            className="btn-generate-report"
            onClick={generateReport}
          >
            Gerar Relatório
          </button>
        </div>
      </div>
      
      {/* Conteúdo do relatório */}
      <div className="report-content">
        {report.sections && report.sections.map((section, index) => 
          renderReportSection(section, index)
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
              <h1>{report.title}</h1>
              <p className="preview-params">
                Período: {new Date(parameters.dateFrom).toLocaleDateString('pt-BR')} a {new Date(parameters.dateTo).toLocaleDateString('pt-BR')}
                {parameters.department && ` | Departamento: ${parameters.department}`}
                {parameters.status && ` | Status: ${parameters.status}`}
              </p>
              
              {report.sections && report.sections.map((section, index) => 
                renderReportSection(section, index)
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
                <FaDownload /> Exportar {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetail;
