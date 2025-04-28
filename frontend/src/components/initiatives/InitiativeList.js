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
import { getApiUrl } from '../../utils/apiUrl';

/**
 * Componente de listagem de iniciativas
 * Implementa a visualização padronizada das iniciativas seguindo diretrizes EFGD
 */
const InitiativeList = () => {
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

  // Efeito para buscar dados e aplicar filtros iniciais da navegação/URL
  useEffect(() => {
    resetFilters(); // Limpa todos os filtros antes de aplicar os novos
    // Ler o status da URL primeiro
    const statusFromUrl = searchParams.get('status');
    console.log('[InitiativeList] Montado. Status da URL:', statusFromUrl, 'Location.state:', location.state);

    // Definir filtros iniciais
    let initialFilters = location.state && location.state.initialFilters
      ? { ...location.state.initialFilters }
      : {
          principleId: '',
          objectiveId: '',
          areaId: '',
          status: '', // Começa vazio
          completionYear: ''
        };

    // Priorizar o status da URL se existir
    if (statusFromUrl) {
      let internalStatusValue = '';
      const decodedStatus = decodeURIComponent(statusFromUrl).toLowerCase();

      // Mapear valor da URL para valor interno
      switch (decodedStatus) {
        case 'delayed':
        case 'atrasada': // Adicionar variações se necessário
          internalStatusValue = 'ATRASADA';
          break;
        case 'completed':
        case 'concluida':
          internalStatusValue = 'CONCLUIDA';
          break;
        case 'inexecution':
        case 'em execucao': // Usar lowercase para comparação
        case 'em execução':
          internalStatusValue = 'EM_EXECUCAO';
          break;
        case 'ontime':
        case 'no cronograma':
          internalStatusValue = 'NO_CRONOGRAMA';
          break;
        default:
          console.warn(`[InitiativeList] Status da URL não reconhecido: ${decodedStatus}`);
          break;
      }

      if (internalStatusValue) {
        console.log(`[InitiativeList] Aplicando status da URL '${statusFromUrl}' como status interno '${internalStatusValue}'`);
        initialFilters.status = internalStatusValue;
      } else {
        console.log(`[InitiativeList] Status da URL '${statusFromUrl}' não mapeado, ignorando.`);
      }
    }
    // Aplicar filtros do location.state SE HOUVEREM e não houver status da URL
    // (ou decidir como combinar/priorizar se ambos pudessem ocorrer)
    else if (location.state?.filters) {
      console.log('[InitiativeList] Aplicando filtros da navegação (state):', location.state.filters);
      // Normalizar os valores recebidos do state
      initialFilters = {
        ...initialFilters, // Mantém o status vazio se não veio do state
        principleId: String(location.state.filters.principleId || ''),
        objectiveId: String(location.state.filters.objectiveId || ''),
        areaId: String(location.state.filters.areaId || ''),
        // Mapear também o status vindo do state, se necessário
        status: mapStateStatusToInternal(location.state.filters.status), // Usar uma função de mapeamento se necessário
        completionYear: String(location.state.filters.completionYear || '')
      };

      // Limpar o state da navegação
      window.history.replaceState({}, document.title);
    } else {
      console.log('[InitiativeList] Sem filtros na navegação ou URL, garantindo reset.');
      // Garantir que os filtros estejam limpos se nada veio da URL ou state
      // (initialFilters já está resetado neste ponto)
    }

    // Atualizar os filtros no contexto
    console.log('[InitiativeList] Atualizando filtros no contexto:', initialFilters);
    updateFilters(initialFilters);

  }, [location.state, searchParams, updateFilters, resetFilters]); // Adicionar searchParams às dependências

  // Função auxiliar para mapear status vindo do location.state (se necessário)
  // Ajuste conforme os valores que podem vir do state
  const mapStateStatusToInternal = (stateStatus) => {
    if (!stateStatus) return '';
    const upperStatus = String(stateStatus).toUpperCase();
    switch (upperStatus) {
      case 'ATRASADA': return 'ATRASADA';
      case 'CONCLUIDA': return 'CONCLUIDA';
      case 'EM_EXECUCAO': return 'EM_EXECUCAO';
      case 'NO_CRONOGRAMA': return 'NO_CRONOGRAMA';
      // Adicione outros mapeamentos se os valores do state forem diferentes
      default: return ''; 
    }
  };

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
    
    // Usando os nomes exatos dos campos que vêm do backend
    const metaValue = initiative?.meta2024 || 'N/D';
    const executadoValue = initiative?.executado2024 || 'N/D';

    // Construir o tooltip com todas as informações
    let tooltipContent = `Meta 2024: ${metaValue}<br />Executado 2024: ${executadoValue}`;
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

    return (
      <span 
        className={className}
        data-performance={performance}
        aria-label={`Performance: ${displayText}`}
        data-tooltip-id="performance-tooltip"
        data-tooltip-html={tooltipContent}
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

  return (
    <div className="initiatives-container">
      <InitiativeFilters />
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
      <Tooltip id="performance-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default InitiativeList;
