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
import { useNavigate } from 'react-router-dom'; 
import { getApiUrl } from '../utils/apiUrl';

// Log da URL da API para diagnóstico
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Variáveis de ambiente disponíveis:', process.env.REACT_APP_API_URL || 'Não definida');

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
    priority: '',
    principleId: '',
    objectiveId: '',
    areaId: '',
    status: '',
    completionYear: ''
  });

  // Hook de navegação
  const navigate = useNavigate();

  // Função para buscar iniciativas da API
  const fetchInitiatives = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = `${getApiUrl()}/api/initiatives`;
      console.log('Iniciando fetch de iniciativas em:', apiUrl);
      console.log('User Agent:', navigator.userAgent);
      console.log('Plataforma:', navigator.platform);
      console.log('Largura da tela:', window.innerWidth);
      
      const response = await fetch(apiUrl);
      
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data.length, 'iniciativas');
      
      // Os dados já vêm no formato esperado pelo frontend
      setInitiatives(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar iniciativas - Detalhes completos:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        type: err.constructor.name
      });
      
      // Verificar se é um erro de CORS
      if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        console.error('Possível erro de CORS ou conexão de rede');
      }
      
      setError(`Erro ao carregar iniciativas: ${err.message}`);
      setLoading(false);
    }
  }, []);

  // Função para buscar princípios da API
  const fetchPrinciples = useCallback(async () => {
    try {
      const apiUrl = `${getApiUrl()}/api/initiatives/principles`;
      console.log('Iniciando fetch de princípios em:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar princípios: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Princípios recebidos:', data.length);
      setPrinciples(data);
    } catch (err) {
      console.error('Erro ao buscar princípios - Detalhes:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      // Não definimos erro global para não bloquear a interface
    }
  }, []);

  // Função para buscar objetivos da API
  const fetchObjectives = useCallback(async () => {
    try {
      const apiUrl = `${getApiUrl()}/api/initiatives/objectives`;
      console.log('Iniciando fetch de objetivos em:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar objetivos: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Objetivos recebidos:', data.length);
      // DEBUG: Show sample objective to confirm property name
      console.log('Sample objective:', data[0]);
      setObjectives(data.map(obj => ({
        id: obj.id,
        name: obj.name // Use the correct property for the full objective text
      })));
    } catch (err) {
      console.error('Erro ao buscar objetivos - Detalhes:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    }
  }, []);

  // Função para buscar áreas da API
  const fetchAreas = useCallback(async () => {
    try {
      const apiUrl = `${getApiUrl()}/api/initiatives/areas`;
      console.log('Iniciando fetch de áreas em:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar áreas: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Áreas recebidas:', data.length);
      setAreas(data);
    } catch (err) {
      console.error('Erro ao buscar áreas - Detalhes:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    }
  }, []);

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    fetchInitiatives();
    fetchPrinciples();
    fetchObjectives();
    fetchAreas();
  }, [fetchInitiatives, fetchPrinciples, fetchObjectives, fetchAreas]);

  // Função utilitária para normalizar status/performance
  function normalizeStatus(str) {
    return (str || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos corretamente
      .replace(/[^A-Z]/gi, '') // Remove tudo que não for letra
      .toUpperCase();
  }

  // Função utilitária para normalizar performance/status
  function normalizePerformance(val) {
    if (!val) return '';
    let v = val.normalize('NFD').replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').toUpperCase();
    if (v === 'NO_CRONOGRAMA' || v === 'ON_SCHEDULE') return 'NO_CRONOGRAMA';
    if (v === 'ATRASADA' || v === 'DELAYED') return 'ATRASADA';
    if (v === 'EM_EXECUCAO' || v === 'IN_EXECUTION') return 'EM_EXECUCAO';
    if (v === 'CONCLUIDA' || v === 'COMPLETED') return 'CONCLUIDA';
    return v;
  }

  // Função para filtrar iniciativas
  const getFilteredInitiatives = useCallback(() => {
    console.log('[InitiativesContext] Filtering initiatives with filters:', filters);
    if (!initiatives || initiatives.length === 0) {
      console.log('[InitiativesContext] No initiatives to filter.');
      return [];
    }

    return initiatives.filter((initiative, index) => {
      // Log para a primeira iniciativa para ver os dados brutos
      if (index === 0) {
          console.log('[InitiativesContext] First initiative data sample:', initiative);
          console.log('[InitiativesContext] Priority value from data:', initiative.priorityExternal);
      }

      // Filtra por prioridade usando a chave priorityExternal
      const priorityValue = initiative.priorityExternal;
      const matchesPriority = !filters.priority || (priorityValue && priorityValue.trim().toUpperCase() === filters.priority.toUpperCase());
      
      // Comparação de princípio, objetivo e área sempre como string
      const matchesPrinciple = !filters.principleId || String(initiative.principleId) === String(filters.principleId);
      const matchesObjective = !filters.objectiveId || String(initiative.objectiveId) === String(filters.objectiveId);
      const matchesArea = !filters.areaId || String(initiative.areaId) === String(filters.areaId);
      
      // Normalização robusta para status/performance
      const normalizedFilterStatus = normalizeStatus(filters.status);
      const normalizedIniStatus = normalizeStatus(initiative.status);
      const normalizedIniPerf = normalizeStatus(initiative.performance);

      // Log detalhado ANTES da comparação final, APENAS se houver filtro de status e o objectiveId bater
      if (filters.status && (!filters.objectiveId || String(initiative.objectiveId) === String(filters.objectiveId))) {
        console.log(`[DEBUG] Filtering Initiative ID ${initiative.id || index} for Objective ${filters.objectiveId}:`);
        console.log(`  Filter Status (raw): '${filters.status}'`);
        console.log(`  Filter Status (norm): '${normalizedFilterStatus}'`);
        console.log(`  Initiative Status (raw): '${initiative.status}'`);
        console.log(`  Initiative Status (norm): '${normalizedIniStatus}'`);
        console.log(`  Initiative Performance (raw): '${initiative.performance}'`);
        console.log(`  Initiative Performance (norm): '${normalizedIniPerf}'`);
        console.log(`  Status Match? ${normalizedIniStatus === normalizedFilterStatus}`);
        console.log(`  Performance Match? ${normalizedIniPerf === normalizedFilterStatus}`);
        console.log(`  Overall Match? ${normalizedIniStatus === normalizedFilterStatus || normalizedIniPerf === normalizedFilterStatus}`);
      }

      const matchesStatus = !filters.status ||
        normalizedIniStatus === normalizedFilterStatus ||
        normalizedIniPerf === normalizedFilterStatus;
      
      // Usando igualdade estrita (===) para o ano
      // Convertendo ambos para string para garantir a comparação correta, caso um seja número e outro string
      const matchesYear = !filters.completionYear || String(initiative.completionYear) === String(filters.completionYear);

      const finalMatch = matchesPriority && matchesPrinciple && matchesObjective && matchesArea && matchesStatus && matchesYear;

      // Log do resultado final para as primeiras 5 iniciativas
      if (index < 5) {
        console.log(`[InitiativesContext] Initiative ${initiative.id || index}: Final Match=${finalMatch}`);
      }

      return finalMatch;
    });
  }, [initiatives, filters]);

  // Filtros padrão para reset
  const defaultFilters = {
    priority: '',
    principleId: '',
    objectiveId: '',
    areaId: '',
    status: '',
    completionYear: ''
  };

  // Função para resetar todos os filtros
  const resetFilters = useCallback(() => {
    setFilters({ ...defaultFilters });
  }, []);

  // Função para obter anos únicos das iniciativas
  const getUniqueYears = useCallback(() => {
    const years = initiatives.map(i => i.completionYear);
    return [...new Set(years)].sort((a, b) => a - b);
  }, [initiatives]);

  // Função para atualizar os filtros
  const updateFilters = useCallback((newFilters) => {
    console.log('[InitiativesContext] updateFilters called with:', newFilters);
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters };
      console.log('[InitiativesContext] Filters updated from:', prev, 'to:', updatedFilters);
      return updatedFilters;
    });
  }, []);

  // Função para aplicar filtros e navegar
  const applyFiltersAndNavigate = useCallback((newFilters) => {
    console.log('[InitiativesContext] applyFiltersAndNavigate called with:', newFilters);
    // Mapeia as chaves recebidas dos gráficos para as chaves internas do filtro
    const mappedFilters = {};
    if (newFilters.PRAZO !== undefined) mappedFilters.completionYear = newFilters.PRAZO;
    if (newFilters.PERFORMANCE !== undefined) mappedFilters.status = normalizePerformance(newFilters.PERFORMANCE);
    // Inclui outros filtros que possam ter sido passados (ex: principleId, objectiveId)
    Object.keys(newFilters).forEach(key => {
      if (key !== 'PRAZO' && key !== 'PERFORMANCE') {
        mappedFilters[key] = newFilters[key];
      }
    });

    updateFilters(mappedFilters); // Atualiza o estado dos filtros
    // Navega para a página de iniciativas, passando os filtros no estado
    navigate('/initiatives', { state: { initialFilters: mappedFilters } });
  }, [navigate, updateFilters]); // Adiciona dependências

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
    getUniqueYears,
    applyFiltersAndNavigate,
    resetFilters // Exporta a função de reset
  };

  return (
    <InitiativesContext.Provider value={value}>
      {children}
    </InitiativesContext.Provider>
  );
};

export default InitiativesContext;
