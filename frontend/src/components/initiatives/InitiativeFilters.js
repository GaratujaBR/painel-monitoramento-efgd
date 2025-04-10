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

  const years = getUniqueYears();

  // Effect to read URL parameters on mount/update
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromUrl = params.get('status');
    console.log('[InitiativeFilters] Status from URL:', statusFromUrl); // Log for debugging

    if (statusFromUrl) {
      const decodedStatus = decodeURIComponent(statusFromUrl);
      console.log('[InitiativeFilters] Decoded Status:', decodedStatus);

      // Map URL value to internal filter value
      let internalStatusValue = '';
      if (decodedStatus === 'no cronograma') {
        internalStatusValue = 'NO_CRONOGRAMA';
      } else if (decodedStatus === 'delayed') { // Assuming 'delayed' for 'Em Atraso'
        internalStatusValue = 'ATRASADA';
      } else if (decodedStatus === 'completed') { // Assuming 'completed' for 'Concluída'
        internalStatusValue = 'CONCLUIDA';
      } else if (decodedStatus === 'inExecution') { // Added for 'Em Execução'
        internalStatusValue = 'EM_EXECUCAO';
      }
      // Add more mappings if needed for other statuses like 'inExecution'

      console.log('[InitiativeFilters] Mapped Internal Status:', internalStatusValue);

      if (internalStatusValue && filters.status !== internalStatusValue) {
        console.log('[InitiativeFilters] Updating context filter status to:', internalStatusValue);
        updateFilters({ status: internalStatusValue });
      }
    }
  }, [location.search, updateFilters, filters.status]); // <-- Add dependencies

  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value });
  };

  return (
    <div className="filters-container">
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
              {principle.name}
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
          <option value="EM_EXECUCAO">Em Execução</option> {/* Added Option */}
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
