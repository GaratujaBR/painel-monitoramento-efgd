/**
 * PONTO CRÍTICO: Listagem de Iniciativas
 * 
 * Este componente é responsável por exibir as iniciativas e implementar
 * funcionalidades como ordenação, filtragem e atualização de dados.
 * 
 * Pontos sensíveis:
 * 1. O componente StatusBadge que exibe os status normalizados
 * 2. As funções auxiliares para exibir nomes de princípios, objetivos e áreas
 * 3. A lógica de ordenação e filtragem que depende da estrutura de dados
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useInitiatives } from '../../context/InitiativesContext';
import { FaSort, FaSortUp, FaSortDown, FaSync } from 'react-icons/fa';
import InitiativeFilters from './InitiativeFilters';
import './Initiatives.css';
import './InitiativeList.cards.css'; // Importar CSS de cards responsivos
import { Tooltip } from 'react-tooltip'; // Importar Tooltip
import 'react-tooltip/dist/react-tooltip.css'; // Importar CSS da tooltip
import LoadingIcon from '../../assets/icons/data.png'; // Importar o ícone de loading
import todoListIcon from '../../images/to-do-list.png'; // Importar o ícone de lista de tarefas
import desktopIcon from '../../images/desktop.png';
import cursorOverIcon from '../../images/cursor_over.png';
import mobileClickIcon from '../../images/mobile_click.png';
import { getApiUrl } from '../../utils/apiUrl';

// Hook para detectar se é mobile/tela pequena
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Componente de listagem de iniciativas
 * Implementa a visualização padronizada das iniciativas seguindo diretrizes EFGD
 */
const InitiativeList = () => {
  // Detecta se é mobile (hook deve ser chamado antes de qualquer return!)
  const isMobile = useIsMobile();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    principles,
    objectives,
    areas,
    loading,
    error,
    fetchInitiatives,
    getFilteredInitiatives,
    updateFilters,
    resetFilters // Importa função de reset
    // Removido: compareValues: compareValuesFromContext 
  } = useInitiatives();

  // Estado para controle de ordenação
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Estado para controle de atualização
  const [refreshing, setRefreshing] = useState(false);

  // Estado para cards expandidos (mobile)
  const [expandedIds, setExpandedIds] = useState([]);
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // Utilitário para truncar texto
  const truncate = (text, len = 60) =>
    text && text.length > len ? text.slice(0, len) + '...' : text;

  // Utilitário para obter a URL da API considerando ambiente
  // const getApiUrl = () =>
  //   process.env.REACT_APP_API_URL ||
  //   (process.env.NODE_ENV === 'production'
  //     ? 'https://painel-monitoramento-efgd.onrender.com'
  //     : '');

  // Função auxiliar para mapear status vindo do location.state ou URL
  // Deve ser definida antes do useEffect que a utiliza como dependência
  const mapStateStatusToInternal = useCallback((stateStatus) => {
    if (!stateStatus) return '';
    const upperStatus = String(stateStatus).toUpperCase();
    // Mapear variações comuns de status para os valores internos esperados
    switch (upperStatus) {
      case 'ATRASADA':
      case 'DELAYED': // comum em parâmetros de URL
        return 'ATRASADA';
      case 'CONCLUIDA':
      case 'CONCLUÍDA':
      case 'COMPLETED':
        return 'CONCLUIDA';
      case 'EM_EXECUCAO':
      case 'EM EXECUÇÃO':
      case 'INEXECUTION':
        return 'EM_EXECUCAO';
      case 'NO_CRONOGRAMA':
      case 'NO CRONOGRAMA':
      case 'ONTIME':
        return 'NO_CRONOGRAMA';
      default:
        console.warn(`[InitiativeList] Status não mapeado em mapStateStatusToInternal: ${stateStatus}`);
        return ''; // Retorna vazio para status não reconhecidos
    }
  }, []); // useCallback para evitar recriações desnecessárias se não depender de props/state do componente

  // Efeito para buscar dados e aplicar filtros iniciais da navegação/URL
  useEffect(() => {
    resetFilters(); // Limpa todos os filtros antes de aplicar os novos

    const areaIdFromUrl = searchParams.get('areaId');
    const statusFromUrl = searchParams.get('status');

    console.log('[InitiativeList] Montado. areaId da URL:', areaIdFromUrl, 'Status da URL:', statusFromUrl, 'Location.state:', location.state);

    // Começa com filtros padrão, que podem ser complementados pelo location.state
    let filtersToApply = {
      principleId: '',
      objectiveId: '',
      areaId: '',
      status: '',
      searchTerm: '',
      ...(location.state && location.state.initialFilters ? location.state.initialFilters : {}),
    };
    console.log('[InitiativeList] Filtros base (padrão + location.state):', JSON.stringify(filtersToApply));

    // Filtros da URL (areaId e status) têm prioridade
    if (areaIdFromUrl) {
      filtersToApply.areaId = areaIdFromUrl; 
      console.log('[InitiativeList] areaId da URL aplicado:', areaIdFromUrl);
    }

    if (statusFromUrl) {
      filtersToApply.status = mapStateStatusToInternal(statusFromUrl);
      console.log('[InitiativeList] Status da URL aplicado (mapeado):', filtersToApply.status);
    }
    // O bloco de código else if (location.state?.filters) abaixo já lida com filtros do state.
    // Se areaIdFromUrl ou statusFromUrl não vierem, os valores de location.state.initialFilters (se existirem)
    // ou os padrões vazios já estarão em filtersToApply.
    // Se vierem da URL, eles sobrescrevem os de location.state ou os padrões.

    // Se não vieram filtros da URL, mas vieram do location.state, eles já foram aplicados 
    // na inicialização de filtersToApply. Se vieram da URL, eles já sobrescreveram.
    // A lógica original de `else if (location.state?.filters)` para aplicar filtros do state
    // se tornou redundante aqui porque `filtersToApply` já considera `location.state.initialFilters`
    // e os parâmetros da URL têm prioridade.
    // A limpeza do state da navegação ainda pode ser útil se `location.state.initialFilters` foi usado.
    if (location.state && location.state.initialFilters) {
        console.log('[InitiativeList] Filtros do location.state foram considerados. Limpando location.state.');
        window.history.replaceState({}, document.title);
    }
    
    console.log('[InitiativeList] Filtros finais a serem aplicados:', JSON.stringify(filtersToApply));
    updateFilters(filtersToApply);
    fetchInitiatives(); // Adicionado para buscar iniciativas após aplicar filtros

  }, [location.state, searchParams, fetchInitiatives, updateFilters, resetFilters, mapStateStatusToInternal]);

  // Função para atualizar os dados
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/initiatives/refresh`, {
        method: 'POST',
      });
      await fetchInitiatives();
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Obter as iniciativas filtradas do contexto
  const filteredInitiatives = getFilteredInitiatives();

  // Funções auxiliares para nomes com useCallback
  const getPrincipleName = useCallback((principleId) => {
    const principle = principles.find(p => p.id == principleId);
    return principle ? principle.name : 'Não definido';
  }, [principles]);

  const getObjectiveName = useCallback((objectiveId) => {
    const objective = objectives.find(o => o.id == objectiveId);
    return objective ? objective.name : 'Não definido';
  }, [objectives]);

  const getAreaName = useCallback((areaId) => {
    const area = areas.find(area => area.id == areaId);
    return area ? area.name : 'Não definida';
  }, [areas]);

  // Renderiza o badge de status com as cores padrão do governo
  const StatusBadge = ({ status }) => {
    let className = 'status-badge';
    let displayText = status; // Texto padrão
    let statusKey = ''; // Chave para estilização CSS

    switch (String(status).toUpperCase()) {
      case 'EM EXECUÇÃO':
      case 'EM_EXECUCAO': // Adicionado case para valor interno
      case 'EM_EXECUCAO':
      case 'INEXECUTION':
        statusKey = 'EM_EXECUCAO';
        displayText = 'EM EXECUÇÃO';
        break;
      case 'CONCLUÍDA':
      case 'CONCLUIDA':
      case 'COMPLETED':
        statusKey = 'CONCLUIDA';
        displayText = 'Concluída';
        break;
      default:
        statusKey = status?.toUpperCase()?.replace(' ', '_') || 'UNKNOWN';
        break;
    }

    return (
      <span 
        className={className}
        data-status={statusKey}
        aria-label={`Status: ${displayText}`}
      >
        {displayText}
      </span>
    );
  };

  // Renderiza o badge de performance
  const PerformanceBadge = ({ performance, initiative }) => {
    if (!performance) return <span className="performance-badge">-</span>;
    
    // Usando os novos campos de 2025 Q1 com fallback para os antigos
    const metaValue = initiative?.meta2025Q1 || initiative?.meta2024 || 'N/D';
    const executadoValue = initiative?.executado2025Q1 || initiative?.executado2024 || 'N/D';

    // Construir o tooltip com todas as informações
    let tooltipContent = `META 1° QUAD 2025: ${metaValue}<br />Executado 1° QUAD 2025: ${executadoValue}`;
    if (initiative?.performanceObs) {
      tooltipContent += `<br /><br />Observação: ${initiative.performanceObs}`;
    }
    
    let className = 'performance-badge';
    let displayText = performance; // Texto padrão é o valor recebido

    // Normalizar o status para exibição e estilo
    switch (String(performance).toUpperCase()) {
      case 'NO CRONOGRAMA':
      case 'ONTIME': // Valor usado no filtro da URL
        className += ' performance-on-time'; // Classe para verde
        displayText = 'No Cronograma';
        break;
      case 'EM ATRASO':
      case 'DELAYED': // Valor usado no filtro da URL
      case 'ATRASADA': // Valor original que estava sendo usado
        className += ' performance-delayed'; // Classe para vermelho
        displayText = 'Atrasada'; // Manter o texto original
        break;
      case 'ATENÇÃO':
      case 'ATENCAO': // Variação sem acento
        className += ' performance-attention'; // Classe para amarelo
        displayText = 'Atenção';
        break;
      default:
        className += ' performance-unknown'; // Classe neutra para casos não mapeados
        break;
    }

    // Adiciona log de clique para debug
    const handleClick = (e) => {
      console.log('PerformanceBadge clicado!', e);
    };

    return (
      <span 
        className={className}
        data-performance={performance}
        aria-label={`Performance: ${displayText}`}
        data-tooltip-id="performance-tooltip"
        data-tooltip-html={tooltipContent}
        onClick={handleClick}
      >
        {displayText}
      </span>
    );
  };

  // Renderiza a barra de progresso
  const ProgressBar = ({ value }) => (
    <div className="progress-container" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
      <div className="progress-bar" style={{ width: `${value}%` }}>
        <span className="progress-label">{value}%</span>
      </div>
    </div>
  );

  // Função de ordenação
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Função para renderizar o ícone de ordenação
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? 
           <FaSortUp className="sort-icon active" /> : 
           <FaSortDown className="sort-icon active" />;
  };

  // Função para comparar valores na ordenação (RESTAURADA LOCALMENTE)
  const compareValues = useCallback((valueA, valueB, type = 'string') => {
    // Tratamento para nulos ou indefinidos para garantir que fiquem no fim (ou início, dependendo da ordem)
    // Aqui, nulos/undefined são considerados "maiores" para irem para o fim na ordem ascendente.
    if (valueA === null || valueA === undefined) return 1; 
    if (valueB === null || valueB === undefined) return -1;

    switch (type) {
      case 'number':
        return Number(valueA) - Number(valueB);
      case 'date': // Se houver datas futuras
        // return new Date(valueA) - new Date(valueB); // Descomentar se usar datas
        return String(valueA).localeCompare(String(valueB)); // Comparar como string por enquanto
      default:
        return String(valueA).localeCompare(String(valueB));
    }
  }, []); // useCallback sem dependências, pois a lógica é aut contida

  // Aplica a ordenação
  const sortedInitiatives = useMemo(() => {
    const sorted = [...filteredInitiatives]; // Usar cópia das iniciativas filtradas
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      let valueType = 'string';

      // Tratamento especial para campos com referências ou tipos específicos
      if (sortConfig.key === 'id') {
        valueType = 'number'; // Tratar ID como número
      } else if (sortConfig.key === 'principleId') {
        aValue = getPrincipleName(a.principleId);
        bValue = getPrincipleName(b.principleId);
      } else if (sortConfig.key === 'objectiveId') {
        aValue = getObjectiveName(a.objectiveId);
        bValue = getObjectiveName(b.objectiveId);
      } else if (sortConfig.key === 'areaId') {
        aValue = getAreaName(a.areaId);
        bValue = getAreaName(b.areaId);
      } else if (sortConfig.key === 'completionYear') {
        valueType = 'number';
      } else if (sortConfig.key === 'performance') {
        // Definir ordem customizada para performance
        const perfOrder = { 'NO CRONOGRAMA': 1, 'ATENÇÃO': 2, 'EM ATRASO': 3, 'ONTIME': 1, 'DELAYED': 3, 'ATENCAO': 2 }; // Adicionar mapeamento URL
        aValue = perfOrder[String(a.performance).toUpperCase()] || 4; // Desconhecido/N/A por último
        bValue = perfOrder[String(b.performance).toUpperCase()] || 4;
        valueType = 'number';
      } else if (sortConfig.key === 'status') {
         // Usar os valores normalizados pelo StatusBadge pode ser mais consistente
         // Ou definir uma ordem aqui também
        const statusOrder = { 'EM EXECUÇÃO': 1, 'CONCLUÍDA': 2, 'INEXECUTION': 1, 'COMPLETED': 2, 'EM EXECUCAO': 1, 'CONCLUIDA': 2 }; // Adicionar mapeamento URL
        aValue = statusOrder[String(a.status).toUpperCase()] || 3; // Outros por último
        bValue = statusOrder[String(b.status).toUpperCase()] || 3;
        valueType = 'number';
      } else if (sortConfig.key === 'observations') {
        aValue = a.observations || '';
        bValue = b.observations || '';
      }

      // Usar a função compareValues LOCAL
      const comparison = compareValues(aValue, bValue, valueType); 
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredInitiatives, sortConfig, getPrincipleName, getObjectiveName, getAreaName, compareValues]); // Usar compareValues local na dependência

  if (loading) return (
    <div className="loading">
      <div className="loading-content">
        <img src={LoadingIcon} alt="Carregando" className="loading-icon" />
        <span>Carregando dados...</span>
      </div>
    </div>
  );
  if (error) return <div className="error">Erro ao carregar iniciativas: {error}</div>;

  // Responsividade: cards para mobile, tabela para desktop

  return (
    <div className="initiatives-container">
      <div className="initiatives-intro">
        <img src={todoListIcon} alt="Iniciativas" className="initiatives-img-icon" />
        <div className="initiatives-header-text-content">
          <h1 className="initiatives-header-title">Iniciativas</h1>
        </div>
      </div>
      <InitiativeFilters />

      {/* Displaying the count of initiatives */}
      <div className="initiative-count-container" style={{ textAlign: 'right', margin: '10px 0', paddingRight: '20px' }}>
        <p style={{ fontSize: '0.9em', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <img src={todoListIcon} alt="Ícone de lista" style={{ width: '18px', height: '18px', marginRight: '6px', opacity: 0.7 }} />
          Exibindo: <strong style={{ marginLeft: '4px', marginRight: '4px' }}>{sortedInitiatives.length}</strong> iniciativa(s)
        </p>
      </div>

      <div className="initiative-filters-row">
        {/* ...filtros existentes... */}
        <div className="performance-hint-desktop">
          <img src={desktopIcon} alt="Desktop" className="performance-hint-icon" />
          <img src={cursorOverIcon} alt="Cursor" className="performance-hint-icon" />
          <span className="performance-hint-text">
            Posicione o cursor acima das <span className="performance-hint-tag">tags</span> de <span className="performance-hint-performance">PERFORMANCE</span> para informações sobre as metas
          </span>
        </div>
        <div className="performance-hint-mobile">
          <img src={mobileClickIcon} alt="Clique" className="performance-hint-icon" />
          <span className="performance-hint-text">
            Clique nas <span className="performance-hint-tag">tags</span> de <span className="performance-hint-performance">PERFORMANCE</span> para informações sobre as metas
          </span>
        </div>
      </div>
      <div className="table-container">
        <div className="refresh-button-container">
          <button 
            className="refresh-button" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            {refreshing ? <FaSync className="refresh-icon spinning" /> : <FaSync className="refresh-icon" />}
            Atualizar
          </button>
        </div>
        {isMobile ? (
          <div className="initiative-cards-list">
            {sortedInitiatives.map((item) => {
              const expanded = expandedIds.includes(item.id);
              return (
                <div key={item.id} className={`initiative-card${expanded ? ' expanded' : ''}`}>
                  <div className="initiative-title">
                    <strong>Iniciativa:</strong>{' '}
                    {expanded ? item.name : truncate(item.name, 60)}
                  </div>
                  <div className="initiative-observacao">
                    <strong>Observação:</strong>{' '}
                    {expanded ? (item.observations || '-') : truncate(item.observations || '-', 40)}
                  </div>
                  <div style={{marginTop: '0.5em'}}>
                    <strong>Área:</strong> {getAreaName(item.areaId)}<br/>
                    <strong>Ano:</strong> {item.completionYear || '-'}<br/>
                    <strong>Status:</strong> <StatusBadge status={item.status} /><br/>
                    <strong>Performance:</strong> <PerformanceBadge performance={item.performance} initiative={item} />
                  </div>
                  <button className="expand-btn" onClick={() => toggleExpand(item.id)}>
                    {expanded ? 'Ver menos' : 'Ver mais'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="initiatives-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} className="sortable-header">
                  Iniciativa {getSortIcon('name')}
                </th>
                {/* Coluna Princípio Removida */}
                {/* Coluna Objetivo Removida */}
                <th onClick={() => requestSort('areaId')} className="sortable-header">
                  Área {getSortIcon('areaId')}
                </th>
                <th onClick={() => requestSort('completionYear')} className="sortable-header">
                  Ano Prazo para Conclusão {getSortIcon('completionYear')}
                </th>
                <th onClick={() => requestSort('status')} className="sortable-header">
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('performance')} className="sortable-header">
                  Performance {getSortIcon('performance')}
                </th>
                <th onClick={() => requestSort('observations')} className="sortable-header">
                  Observação {getSortIcon('observations')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInitiatives.map(initiative => (
                <tr key={initiative.id}>
                  <td className="text-left">{initiative.name}</td>
                  {/* Célula Princípio Removida */}
                  {/* Célula Objetivo Removida */}
                  <td className="text-left">{getAreaName(initiative.areaId)}</td>
                  <td className="text-center">{initiative.completionYear}</td>
                  <td className="text-center">
                    <StatusBadge status={initiative.status} />
                  </td>
                  <td className="text-center">
                    {/* Passar a initiative completa para o PerformanceBadge */}
                    <PerformanceBadge performance={initiative.performance} initiative={initiative} />
                  </td>
                  <td className="text-left">
                    {initiative.observations || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Adicionar o componente Tooltip aqui */}
      <Tooltip id="performance-tooltip" place="top" effect="solid" trigger={isMobile ? 'click' : 'hover'} />
    </div>
  );
};

export default InitiativeList;
