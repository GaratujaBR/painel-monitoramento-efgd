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
import { useInitiatives } from '../../context/InitiativesContext';
import { FaSort, FaSortUp, FaSortDown, FaSync } from 'react-icons/fa';
import InitiativeFilters from './InitiativeFilters';
import './Initiatives.css';

/**
 * Componente de listagem de iniciativas
 * Implementa a visualização padronizada das iniciativas seguindo diretrizes EFGD
 */
const InitiativeList = () => {
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
    fetchInitiatives();
  }, [fetchInitiatives]);

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
    const statusConfig = {
      NAO_INICIADA: { label: 'Não Iniciada' },
      NO_CRONOGRAMA: { label: 'No Cronograma' },
      ATRASADA: { label: 'Atrasada' },
      CONCLUIDA: { label: 'Concluída' },
      EM_EXECUCAO: { label: 'Em Execução' }
    };

    // Log para debug
    console.log('Status recebido:', status);

    const config = statusConfig[status] || { label: status };

    return (
      <span 
        className="status-badge"
        data-status={status}
        aria-label={`Status: ${config.label}`}
      >
        {config.label}
      </span>
    );
  };

  // Renderiza o badge de performance
  const PerformanceBadge = ({ performance }) => {
    if (!performance) return <span className="performance-badge">-</span>;
    
    return (
      <span 
        className="performance-badge"
        data-performance={performance}
        aria-label={`Performance: ${performance}`}
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
                  <PerformanceBadge performance={initiative.performance} />
                </td>
                <td className="text-left">
                  {initiative.observations || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InitiativeList;
