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
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useInitiatives } from '../../context/InitiativesContext';
import { FaSort, FaSortUp, FaSortDown, FaSync } from 'react-icons/fa';
import InitiativeFilters from './InitiativeFilters';
import './Initiatives.css';
import { Tooltip } from 'react-tooltip'; // Importar Tooltip
import 'react-tooltip/dist/react-tooltip.css'; // Importar CSS da tooltip

/**
 * Componente de listagem de iniciativas
 * Implementa a visualização padronizada das iniciativas seguindo diretrizes EFGD
 */
const InitiativeList = () => {
  const location = useLocation();
  const { 
    principles, 
    objectives,
    areas, 
    loading, 
    error, 
    fetchInitiatives, 
    getFilteredInitiatives
  } = useInitiatives();

  // Estado para controle de ordenação - inicializado para ordenar por ID
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });
  
  // Estado para controle de atualização
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Log URL parameters on mount
    console.log('[InitiativeList] Location Search on Mount:', location.search);
    
    fetchInitiatives();
  }, [fetchInitiatives, location.search]);

  // Função para atualizar os dados
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('http://localhost:3003/api/initiatives/refresh', {
        method: 'POST',
      });
      await fetchInitiatives();
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredInitiatives = getFilteredInitiatives();

  // Funções auxiliares para nomes com useCallback
  const getPrincipleName = useCallback((principleId) => {
    // Usando loose equality (==) para lidar com possíveis diferenças de tipo (string vs number)
    const principle = principles.find(p => p.id == principleId);
    return principle ? principle.name : 'Não definido';
  }, [principles]);

  const getObjectiveName = useCallback((objectiveId) => {
    // Usando loose equality (==) para lidar com possíveis diferenças de tipo (string vs number)
    const objective = objectives.find(o => o.id == objectiveId);
    return objective ? objective.name : 'Não definido';
  }, [objectives]);

  const getAreaName = useCallback((areaId) => {
    // Usando loose equality (==) para lidar com possíveis diferenças de tipo (string vs number)
    const area = areas.find(area => area.id == areaId);
    return area ? area.name : 'Não definida';
  }, [areas]);

  // Renderiza o badge de status com as cores padrão do governo
  const StatusBadge = ({ status }) => {
    let displayLabel = 'Em Execução'; // Padrão para todos não concluídos
    let displayStatusKey = 'EM_EXECUCAO'; // Chave para estilização

    if (status === 'CONCLUIDA') {
      displayLabel = 'Concluída';
      displayStatusKey = 'CONCLUIDA';
    }

    // Log para debug
    // console.log('Status recebido:', status, '-> Status Exibido:', displayLabel);

    return (
      <span 
        className="status-badge"
        data-status={displayStatusKey} // Usar a chave para consistência de estilo
        aria-label={`Status: ${displayLabel}`}
      >
        {displayLabel}
      </span>
    );
  };

  // Renderiza o badge de performance
  const PerformanceBadge = ({ performance, initiative }) => {
    if (!performance) return <span className="performance-badge">-</span>;
    
    // Usando os nomes exatos dos campos que vêm do backend
    const metaValue = initiative?.meta2024 || 'N/D';
    const executadoValue = initiative?.executado2024 || 'N/D';

    const tooltipContent = `Meta 2024: ${metaValue}<br />Executado 2024: ${executadoValue}`;
    
    return (
      <span 
        className="performance-badge"
        data-performance={performance}
        aria-label={`Performance: ${performance}`}
        // Atributos para react-tooltip
        data-tooltip-id="performance-tooltip"
        data-tooltip-html={tooltipContent} // Usar data-tooltip-html para permitir <br />
      >
        {performance}
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

  // Função para comparar valores na ordenação
  const compareValues = useCallback((valueA, valueB, type = 'string') => {
    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    switch (type) {
      case 'number':
        return Number(valueA) - Number(valueB);
      case 'date':
        return new Date(valueA) - new Date(valueB);
      default:
        return String(valueA).localeCompare(String(valueB));
    }
  }, []);

  // Aplica a ordenação
  const sortedInitiatives = React.useMemo(() => {
    const sorted = [...filteredInitiatives];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      let valueType = 'string';

      // Tratamento especial para campos com referências
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
        // Ordenação especial para performance
        const perfOrder = { 'No Cronograma': 1, 'Atrasada': 2 };
        aValue = perfOrder[a.performance] || 0;
        bValue = perfOrder[b.performance] || 0;
        valueType = 'number';
      } else if (sortConfig.key === 'observations') {
        // Tratamento para observações (podem ser nulas)
        aValue = a.observations || '';
        bValue = b.observations || '';
      }

      const comparison = compareValues(aValue, bValue, valueType);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredInitiatives, sortConfig, getPrincipleName, getObjectiveName, getAreaName, compareValues]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro ao carregar iniciativas: {error}</div>;

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
      </div>
      {/* Adicionar o componente Tooltip aqui */}
      <Tooltip id="performance-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default InitiativeList;
