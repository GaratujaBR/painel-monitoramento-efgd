/**
 * PONTO CRÍTICO: Filtros de Iniciativas
 * 
 * Este componente implementa os filtros para as iniciativas.
 * Os valores de status devem corresponder exatamente aos valores normalizados
 * retornados pelo backend (NAO_INICIADA, NO_CRONOGRAMA, ATRASADA, CONCLUIDA).
 * 
 * Qualquer alteração nos valores dos filtros deve ser coordenada com:
 * 1. O método normalizeStatus no backend (googlesheets.service.js)
 * 2. A estrutura de filtros no InitiativesContext
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInitiatives } from '../../context/InitiativesContext';
import './Initiatives.css';

/**
 * Componente de filtros para a listagem de iniciativas
 * Implementa filtros padronizados seguindo diretrizes EFGD
 */
const InitiativeFilters = () => {
  const location = useLocation();
  const { 
    principles, 
    objectives, 
    areas, 
    filters, 
    updateFilters,
    getUniqueYears
  } = useInitiatives();

  const principleNameMap = {
    '1': 'I - Governo Centrado no Cidadão e Inclusivo',
    '2': 'II - Governo Integrado e Colaborativo',
    '3': 'III - Governo Inteligente e Inovador',
    '4': 'IV - Governo Confiável e Seguro',
    '5': 'V - Governo Transparente, Aberto e Participativo',
    '6': 'VI - Governo Eficiente e Sustentável',
  };

  const years = getUniqueYears();

  // Effect to read state from navigation (for chart clicks)
  useEffect(() => {
    // Check if we have state from navigation (for chart clicks)
    if (location.state && location.state.initialFilters) {
      console.log('[InitiativeFilters] Received filters from navigation state:', location.state.initialFilters);
      
      const { principleId, objectiveId, status, priority, performance, completionYear, areaId } = location.state.initialFilters;
      const newFilters = {};
      
      // Apply priority filter if provided
      if (priority) {
        console.log('[InitiativeFilters] Setting priority filter to:', priority);
        newFilters.priority = priority;
      }

      // Apply principleId filter if provided
      if (principleId) {
        console.log('[InitiativeFilters] Setting principleId filter to:', principleId);
        newFilters.principleId = principleId;
      }
      
      // Apply objectiveId filter if provided
      if (objectiveId) {
        console.log('[InitiativeFilters] Setting objectiveId filter to:', objectiveId);
        newFilters.objectiveId = objectiveId;
      }

      // Apply areaId filter if provided
      if (areaId) {
        newFilters.areaId = areaId;
      }

      // Apply completionYear filter if provided
      if (completionYear) {
        newFilters.completionYear = completionYear;
      }

      // --- NOVO BLOCO: Normalizar performance/status vindos do gráfico ou navegação ---
      let incomingPerf = performance || status;
      if (incomingPerf) {
        let normalizedPerf = incomingPerf
          .normalize('NFD').replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '') // Remove acentos e caracteres especiais
          .replace(/\s+/g, '_') // Espaço para underscore
          .toUpperCase();
        // Mapear variações conhecidas
        if (normalizedPerf === 'NO_CRONOGRAMA' || normalizedPerf === 'ON_SCHEDULE') normalizedPerf = 'NO_CRONOGRAMA';
        if (normalizedPerf === 'ATRASADA' || normalizedPerf === 'DELAYED') normalizedPerf = 'ATRASADA';
        if (normalizedPerf === 'EM_EXECUCAO' || normalizedPerf === 'IN_EXECUTION') normalizedPerf = 'EM_EXECUCAO';
        if (normalizedPerf === 'CONCLUIDA' || normalizedPerf === 'COMPLETED') normalizedPerf = 'CONCLUIDA';
        newFilters.status = normalizedPerf;
      }
      // --- FIM NOVO BLOCO ---

      // Only update if we have new filters and they're different from current
      if (Object.keys(newFilters).length > 0) {
        // Check if any filter value is different from current
        const needsUpdate = Object.entries(newFilters).some(
          ([key, value]) => filters[key] !== value
        );
        
        if (needsUpdate) {
          console.log('[InitiativeFilters] Updating filters from navigation state');
          updateFilters(newFilters);
          // Clear the location state to prevent reapplying filters on refresh
          window.history.replaceState({}, document.title);
        }
      }
    } else {
      // Optional: Log if no navigation state filters were found
      // console.log('[InitiativeFilters] No initialFilters found in navigation state.');
    }
  }, [location.state, updateFilters, filters]); // Add dependencies

  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value });
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="priority-filter">Prioridade Externa (MGI/CC):</label>
        <select
          id="priority-filter"
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          <option value="SIM">SIM</option>
          <option value="NÃO">NÃO</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="principle-filter">Por Princípio:</label>
        <select
          id="principle-filter"
          value={filters.principleId}
          onChange={(e) => handleFilterChange('principleId', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          {principles.map(principle => (
            <option key={principle.id} value={principle.id}>
              {principleNameMap[String(principle.id)] || principle.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="objective-filter">Por Objetivo:</label>
        <select
          id="objective-filter"
          value={filters.objectiveId}
          onChange={(e) => handleFilterChange('objectiveId', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          {objectives.map(objective => (
            <option key={objective.id} value={objective.id}>
              {objective.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="area-filter">Por Área:</label>
        <select
          id="area-filter"
          value={filters.areaId}
          onChange={(e) => handleFilterChange('areaId', e.target.value)}
          className="filter-select"
        >
          <option value="">Todas</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Por Status/Performance:</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          <option value="EM_EXECUCAO">Em Execução</option>
          <option value="NO_CRONOGRAMA">No Cronograma</option>
          <option value="ATRASADA">Atrasada</option>
          <option value="CONCLUIDA">Concluída</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="year-filter">Por Ano de Conclusão:</label>
        <select
          id="year-filter"
          value={filters.completionYear}
          onChange={(e) => handleFilterChange('completionYear', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InitiativeFilters;
