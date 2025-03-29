/**
 * PONTO CRÍTICO: Contexto de Iniciativas
 * 
 * Este contexto gerencia o estado global das iniciativas e sua integração com a API.
 * Alterações aqui podem afetar todos os componentes que consomem este contexto.
 * 
 * Pontos sensíveis:
 * 1. A estrutura dos filtros (principleId, objectiveId, areaId, status, completionYear)
 * 2. As funções de busca de dados (fetchInitiatives, fetchPrinciples, etc.)
 * 3. A função getFilteredInitiatives que implementa a lógica de filtragem
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// API URL
const API_URL = 'http://localhost:3003';

// Criação do contexto de iniciativas
const InitiativesContext = createContext();

// Hook personalizado para usar o contexto de iniciativas
export const useInitiatives = () => {
  const context = useContext(InitiativesContext);
  if (!context) {
    throw new Error('useInitiatives must be used within an InitiativesProvider');
  }
  return context;
};

// Provedor do contexto de iniciativas
export const InitiativesProvider = ({ children }) => {
  // Estado para armazenar as iniciativas
  const [initiatives, setInitiatives] = useState([]);
  // Estado para armazenar os princípios
  const [principles, setPrinciples] = useState([]);
  // Estado para armazenar os objetivos
  const [objectives, setObjectives] = useState([]);
  // Estado para armazenar as áreas
  const [areas, setAreas] = useState([]);
  // Estado para armazenar o carregamento
  const [loading, setLoading] = useState(false);
  // Estado para armazenar erros
  const [error, setError] = useState(null);
  // Estado para armazenar os filtros
  const [filters, setFilters] = useState({
    principleId: '',
    objectiveId: '',
    areaId: '',
    status: '',
    completionYear: ''
  });

  // Função para buscar iniciativas da API
  const fetchInitiatives = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/initiatives`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Os dados já vêm no formato esperado pelo frontend
      setInitiatives(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar iniciativas:', err);
      setError(`Erro ao carregar iniciativas: ${err.message}`);
      setLoading(false);
    }
  }, []);

  // Função para buscar princípios da API
  const fetchPrinciples = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/initiatives/principles`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar princípios: ${response.status}`);
      }
      const data = await response.json();
      setPrinciples(data);
    } catch (err) {
      console.error('Erro ao buscar princípios:', err);
      // Não definimos erro global para não bloquear a interface
    }
  }, []);

  // Função para buscar objetivos da API
  const fetchObjectives = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/initiatives/objectives`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar objetivos: ${response.status}`);
      }
      const data = await response.json();
      setObjectives(data);
    } catch (err) {
      console.error('Erro ao buscar objetivos:', err);
    }
  }, []);

  // Função para buscar áreas da API
  const fetchAreas = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/initiatives/areas`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar áreas: ${response.status}`);
      }
      const data = await response.json();
      setAreas(data);
    } catch (err) {
      console.error('Erro ao buscar áreas:', err);
    }
  }, []);

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    fetchInitiatives();
    fetchPrinciples();
    fetchObjectives();
    fetchAreas();
  }, [fetchInitiatives, fetchPrinciples, fetchObjectives, fetchAreas]);

  // Função para filtrar iniciativas
  const getFilteredInitiatives = useCallback(() => {
    return initiatives.filter(initiative => {
      // Usando loose equality (==) para lidar com possíveis diferenças de tipo (string vs number)
      const matchesPrinciple = !filters.principleId || initiative.principleId == filters.principleId;
      const matchesObjective = !filters.objectiveId || initiative.objectiveId == filters.objectiveId;
      const matchesArea = !filters.areaId || initiative.areaId == filters.areaId;
      // Verifica se o valor do filtro corresponde ao status OU à performance (case-insensitive)
      const matchesStatus = !filters.status || 
                           initiative.status == filters.status || 
                           (initiative.performance && 
                            (initiative.performance.toUpperCase() == filters.status ||
                             // Mapeamento adicional para lidar com diferentes formatos
                             (filters.status === 'NO_CRONOGRAMA' && initiative.performance.toUpperCase().includes('CRONOGRAMA')) ||
                             (filters.status === 'ATRASADA' && initiative.performance.toUpperCase().includes('ATRASA'))));
      const matchesYear = !filters.completionYear || initiative.completionYear == filters.completionYear;

      return matchesPrinciple && matchesObjective && matchesArea && matchesStatus && matchesYear;
    });
  }, [initiatives, filters]);

  // Função para obter anos únicos das iniciativas
  const getUniqueYears = useCallback(() => {
    const years = initiatives.map(i => i.completionYear);
    return [...new Set(years)].sort((a, b) => a - b);
  }, [initiatives]);

  // Função para atualizar os filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const value = {
    initiatives,
    principles,
    objectives,
    areas,
    loading,
    error,
    filters,
    fetchInitiatives,
    getFilteredInitiatives,
    updateFilters,
    getUniqueYears
  };

  return (
    <InitiativesContext.Provider value={value}>
      {children}
    </InitiativesContext.Provider>
  );
};

export default InitiativesContext;
