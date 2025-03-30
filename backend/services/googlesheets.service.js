const { google } = require('googleapis');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

class GoogleSheetsService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
    this.lastSync = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.initialized = false;
    this.sheetName = 'Iniciativas';
  }

  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      console.log('Attempting to initialize Google Sheets service...');
      
      // Verificar se existe uma variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('Variável de ambiente GOOGLE_APPLICATION_CREDENTIALS não encontrada');
        console.log('Recomendado: Configure esta variável no Render apontando para /etc/secrets/seu-arquivo-credenciais.json');
      } else {
        console.log(`Variável GOOGLE_APPLICATION_CREDENTIALS configurada: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
        // Verificar se o arquivo existe no caminho especificado
        try {
          fs.accessSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
          console.log(`✅ Arquivo de credenciais existe no caminho especificado.`);
        } catch (fsError) {
          console.error(`❌ Arquivo de credenciais NÃO existe ou não é acessível no caminho especificado.`);
        }
      }

      const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1lxfHZcf_C2TL05nkELhvHMXJYttRDwHLRkNESxmWbPQ';

      if (!spreadsheetId) {
        throw new Error('ID da planilha não configurado. Verifique a variável de ambiente GOOGLE_SHEETS_ID.');
      }
      
      console.log(`Usando spreadsheetId: ${spreadsheetId}`);
      
      // Use Google Application Default Credentials (ADC)
      // This will automatically look for credentials in standard locations,
      // including the path specified by the GOOGLE_APPLICATION_CREDENTIALS env var.
      console.log('Inicializando cliente de autenticação do Google...');
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      });

      console.log('Obtendo cliente de autenticação...');
      const authClient = await auth.getClient();
      console.log('Cliente de autenticação obtido com sucesso');
      
      this.sheets = google.sheets({ version: 'v4', auth: authClient });
      this.spreadsheetId = spreadsheetId;
      this.initialized = true;

      console.log('✅ Serviço Google Sheets inicializado com sucesso');
      return true;
    } catch (error) {
      console.error(`❌ Erro ao inicializar serviço: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  async withRetry(operation, attempts = this.retryAttempts) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`Tentativa ${attempt}/${attempts} falhou:`, {
          message: error.message,
          willRetry: attempt < attempts
        });
        if (attempt < attempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }
    throw lastError;
  }

  async getSpreadsheetData() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const cacheKey = 'spreadsheet_data';
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }
      const response = await this.withRetry(async () => {
        return await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `${this.sheetName}!A:Z` // Get all columns
        });
      });

      const data = this.transformSpreadsheetData(response.data.values);
      this.cache.set(cacheKey, data);
      this.lastSync = new Date();

      console.log('Dados da planilha atualizados:', {
        timestamp: this.lastSync,
        rowCount: data.length,
        cacheKey
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da planilha:', {
        message: error.message,
        timestamp: new Date(),
        lastSync: this.lastSync
      });
      throw error;
    }
  }

  /**
   * Transforma os dados brutos da planilha para o formato esperado pelo frontend
   * 
   * Esta função é responsável por:
   * 1. Extrair os dados relevantes das colunas
   * 2. A normalização de status (NAO_INICIADA, NO_CRONOGRAMA, etc.)
   * 
   * @param {Array} values - Valores brutos da planilha
   * @returns {Array} - Dados formatados para o frontend
   */
  transformSpreadsheetData(values) {
    if (!Array.isArray(values) || values.length < 2) {
      throw new Error('Formato inválido da planilha. Verifique se a estrutura está correta.');
    }

    const [headers, ...rows] = values;
    
    console.log('Cabeçalhos da planilha:', headers);
    
    const findColumnIndex = (keywords) => {
      return headers.findIndex(header => {
        if (!header) return false;
        const headerLower = header.toString().toLowerCase().trim();
        return keywords.some(keyword => headerLower.includes(keyword));
      });
    };

    // Encontrar índices das colunas
    const objectiveIndex = findColumnIndex(['objetivo', 'iniciativa']);
    const areaIndex = findColumnIndex(['área', 'area', 'departamento', 'diretoria']);
    const statusIndex = findColumnIndex(['status', 'situação', 'situacao']);
    const prazoIndex = findColumnIndex(['prazo', 'ano', 'conclusão', 'conclusao']);
    const performanceIndex = findColumnIndex(['performance', 'desempenho']);
    const principleIndex = findColumnIndex(['princípio', 'principio', 'princípios', 'principios', 'princ']);
    const princPioIndex = headers.findIndex(header => 
      header && header.toString().toUpperCase().includes('PRINC') && header.toString().includes('(')
    );
    const objectiveIdIndex = headers.findIndex(h => h === 'objectiveId');
    const principleIdIndex = headers.findIndex(h => h === 'principleId');
    
    console.log("[DIAGNÓSTICO] Índices de colunas encontrados:", {
      objectiveIndex,
      objectiveIdIndex,
      principleIndex,
      principleIdIndex,
      princPioIndex,
      areaIndex,
      statusIndex,
      prazoIndex,
      performanceIndex
    });
    
    return rows.map((row, rowIndex) => {
      const initiative = {
        id: `id-${rowIndex + 1}`,
        name: '',
        principleId: '',
        objectiveId: '',
        principle: '',
        objective: '',
        areaId: '',
        completionYear: '',
        status: 'NAO_INICIADA',
        progress: 0,
        performance: '',
        responsiblePerson: '',
        lastUpdate: '',
        observations: ''
      };
      
      // Processar objectiveId e principleId
      if (objectiveIdIndex !== -1 && row[objectiveIdIndex]) {
        initiative.objectiveId = row[objectiveIdIndex].toString();
      }
      
      if (principleIdIndex !== -1 && row[principleIdIndex]) {
        initiative.principleId = row[principleIdIndex].toString();
      }
      
      // Processar textos de objetivo e princípio
      if (objectiveIndex !== -1 && row[objectiveIndex]) {
        initiative.objective = row[objectiveIndex];
        initiative.name = row[objectiveIndex];
      }
      
      if (principleIndex !== -1 && row[principleIndex]) {
        initiative.principle = row[principleIndex];
      } else if (princPioIndex !== -1 && row[princPioIndex]) {
        initiative.principle = row[princPioIndex];
      }
      
      // Processar status - Leitura primária da coluna STATUS
      if (statusIndex !== -1 && row[statusIndex]) {
        initiative.status = this.normalizeStatus(row[statusIndex]);
        console.log(`[DEBUG] Status lido da coluna STATUS: ${row[statusIndex]} -> normalizado para: ${initiative.status}`);
      }
      
      // Processar outras colunas
      headers.forEach((header, index) => {
        if (!header) return;
        const headerLower = header.toString().toLowerCase().trim();
        const value = row[index];
        
        if (!value) return;
        
        try {
          switch(true) {
            case objectiveIndex === index:
            case principleIndex === index:
            case princPioIndex === index:
            case objectiveIdIndex === index:
            case principleIdIndex === index:
              break;
              
            case headerLower.includes('área') || headerLower.includes('area') || headerLower.includes('departamento'):
              initiative.areaId = value;
              break;
              
            // Removida a lógica que sobrescreve o status com base na coluna 'status'
            // Agora o status é determinado exclusivamente pelo statusIndex acima
              
            case headerLower.includes('prazo') || headerLower.includes('ano') || headerLower.includes('conclusão'):
              initiative.completionYear = value;
              break;
              
            case headerLower.includes('progresso') || headerLower.includes('percentual'):
              const progressMatch = value.toString().match(/(\d+)/);
              initiative.progress = progressMatch ? parseInt(progressMatch[1], 10) : 0;
              if (initiative.progress < 0 || initiative.progress > 100) {
                initiative.progress = 0;
              }
              break;
              
            case headerLower.includes('performance') || headerLower.includes('desempenho'):
              initiative.performance = value;
              // Removida a lógica que sobrescreve o status com base na performance
              // Agora o status é determinado exclusivamente pelo statusIndex acima
              break;
              
            case headerLower.includes('responsável') || headerLower.includes('responsavel'):
              initiative.responsiblePerson = value;
              break;
              
            case headerLower.includes('atualização') || headerLower.includes('atualizacao') || headerLower.includes('data'):
              initiative.lastUpdate = value;
              break;
              
            case headerLower.includes('observações') || headerLower.includes('observacoes') || headerLower.includes('obs'):
              initiative.observations = value;
              break;
          }
        } catch (error) {
          console.error(`Erro ao processar campo ${header}:`, error);
        }
      });
      
      return initiative;
    }).filter(initiative => initiative.name && initiative.name.trim() !== '');
  }

  // Normalize status values to match our standard format
  normalizeStatus(status) {
    if (!status) return 'NAO_INICIADA';
    
    const statusLower = status.toString().toLowerCase().trim();
    console.log(`[DEBUG] Normalizando status: "${statusLower}"`);
    
    // Concluída - verificar primeiro para evitar falsos positivos com "em execução"
    if (statusLower.includes('concluída') || 
        statusLower.includes('concluida') || 
        statusLower === 'concluído' || 
        statusLower === 'concluido' || 
        statusLower === 'finalizada' || 
        statusLower === 'finalizado' ||
        statusLower === 'concluída' ||
        statusLower === 'concluida') {
      console.log(`[DEBUG] Status normalizado para CONCLUIDA`);
      return 'CONCLUIDA';
    }
    
    // Não iniciada
    if (statusLower.includes('não iniciada') || 
        statusLower.includes('nao iniciada') || 
        statusLower === 'não iniciado' || 
        statusLower === 'nao iniciado') {
      console.log(`[DEBUG] Status normalizado para NAO_INICIADA`);
      return 'NAO_INICIADA';
    }
    
    // Em execução
    if (statusLower.includes('execução') || 
        statusLower.includes('execucao') ||
        statusLower === 'em execução' ||
        statusLower === 'em execucao' ||
        statusLower === 'em andamento') {
      console.log(`[DEBUG] Status normalizado para EM_EXECUCAO`);
      return 'EM_EXECUCAO';
    }
    
    // No cronograma
    if (statusLower.includes('cronograma') || 
        statusLower === 'no prazo') {
      console.log(`[DEBUG] Status normalizado para NO_CRONOGRAMA`);
      return 'NO_CRONOGRAMA';
    }
    
    // Atrasada
    if (statusLower.includes('atrasada') || 
        statusLower === 'atrasado' || 
        statusLower === 'em atraso') {
      console.log(`[DEBUG] Status normalizado para ATRASADA`);
      return 'ATRASADA';
    }
    
    console.log(`[DEBUG] Status não reconhecido, usando padrão NAO_INICIADA`);
    return 'NAO_INICIADA';
  }

  startChangePolling() {
    // Poll for changes every 30 seconds
    setInterval(async () => {
      try {
        // Clear cache to force refresh
        this.cache.flushAll();
        await this.getSpreadsheetData();
        
        console.log('Verificação de alterações concluída:', {
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Erro ao verificar alterações:', {
          message: error.message,
          timestamp: new Date(),
          willRetry: true
        });
      }
    }, 30000); // Poll every 30 seconds
  }

  async getInitiatives(filters = {}) {
    try {
      const cacheKey = 'initiatives' + JSON.stringify(filters);
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const initiatives = await this.getSpreadsheetData();
      const filtered = this.filterInitiatives(initiatives, filters);
      
      this.cache.set(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error('Erro ao buscar iniciativas:', {
        message: error.message,
        filters,
        timestamp: new Date()
      });
      throw new Error('Falha ao buscar dados do Google Sheets. Tente novamente em alguns minutos.');
    }
  }

  filterInitiatives(initiatives, filters) {
    return initiatives.filter(initiative => {
      return (!filters.area || initiative.areaId === filters.area) &&
             (!filters.status || initiative.status === filters.status) &&
             (!filters.principle || initiative.principleId === filters.principle) &&
             (!filters.objective || initiative.objectiveId === filters.objective);
    });
  }

  async refreshData() {
    try {
      this.cache.flushAll();
      await this.getSpreadsheetData();
      return { 
        success: true, 
        timestamp: new Date(),
        message: 'Dados atualizados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao atualizar dados:', {
        message: error.message,
        timestamp: new Date()
      });
      throw new Error('Falha ao atualizar dados. Tente novamente em alguns minutos.');
    }
  }

  async checkConnection() {
    try {
      await this.getSpreadsheetData();
      return true;
    } catch {
      return false;
    }
  }

  getLastSyncTime() {
    return this.lastSync;
  }

  getChangeTrackingStatus() {
    return {
      active: true,
      lastSync: this.lastSync,
      changeDetection: 'Polling',
      pollingInterval: '30 seconds',
      retryConfig: {
        attempts: this.retryAttempts,
        delay: this.retryDelay
      }
    };
  }

  // Compatibility methods for SharePoint service
  async setupChangeTracking() {
    return true;
  }

  getWebhookStatus() {
    return 'not-supported';
  }

  async validateWebhook() {
    throw new Error('Webhooks não são suportados pelo serviço Google Sheets');
  }

  async handleWebhookNotification() {
    throw new Error('Webhooks não são suportados pelo serviço Google Sheets');
  }

  async setupWebhook() {
    throw new Error('Webhooks não são suportados pelo serviço Google Sheets');
  }

  async getPrinciples() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const cacheKey = 'principles_data';
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Extrair princípios das iniciativas
      const initiatives = await this.getSpreadsheetData();
      
      // Criar um mapa para armazenar princípios únicos
      const principlesMap = new Map();
      
      initiatives.forEach(initiative => {
        if (initiative.principleId && initiative.principleId.trim() !== '') {
          // Extrair o ID do princípio (assumindo formato "I - Nome do Princípio")
          const match = initiative.principleId.match(/^([IVX]+)\s*-\s*(.+)$/);
          
          if (match) {
            const id = match[1].trim(); // "I", "II", etc.
            const name = initiative.principleId.trim(); // Nome completo com o numeral
            
            if (!principlesMap.has(id)) {
              principlesMap.set(id, { id, name });
            }
          } else {
            // Se não seguir o formato esperado, usar o valor completo como ID e nome
            const id = initiative.principleId.trim();
            if (!principlesMap.has(id)) {
              principlesMap.set(id, { id, name: id });
            }
          }
        }
      });
      
      // Converter o mapa em array e ordenar por ID
      const principles = Array.from(principlesMap.values())
        .sort((a, b) => {
          // Converter numerais romanos para números para ordenação
          const romanToNum = (roman) => {
            const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
            let result = 0;
            for (let i = 0; i < roman.length; i++) {
              const current = romanNumerals[roman[i]];
              const next = romanNumerals[roman[i + 1]];
              if (next && current < next) {
                result -= current;
              } else {
                result += current;
              }
            }
            return result;
          };
          
          try {
            return romanToNum(a.id) - romanToNum(b.id);
          } catch (e) {
            return a.id.localeCompare(b.id);
          }
        });

      console.log(`Encontrados ${principles.length} princípios a partir das iniciativas`);
      this.cache.set(cacheKey, principles);
      return principles;
    } catch (error) {
      console.error('Erro ao extrair princípios das iniciativas:', error);
      return [];
    }
  }

  async getObjectives() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const cacheKey = 'objectives_data';
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Extrair objetivos das iniciativas
      const initiatives = await this.getSpreadsheetData();
      const principles = await this.getPrinciples();
      
      // Criar um mapa para armazenar objetivos únicos
      const objectivesMap = new Map();
      
      initiatives.forEach(initiative => {
        if (initiative.objectiveId && initiative.objectiveId.trim() !== '') {
          // Extrair o ID do objetivo (assumindo formato "01 - Nome do Objetivo")
          const match = initiative.objectiveId.match(/^(\d+)\s*-\s*(.+)$/);
          
          if (match) {
            const id = match[1].trim(); // "01", "02", etc.
            const name = initiative.objectiveId.trim(); // Nome completo com o numeral
            
            // Determinar o principleId para este objetivo
            let principleId = '';
            if (initiative.principleId) {
              const principleMatch = initiative.principleId.match(/^([IVX]+)\s*-\s*(.+)$/);
              if (principleMatch) {
                principleId = principleMatch[1].trim();
              } else {
                principleId = initiative.principleId.trim();
              }
            }
            
            if (!objectivesMap.has(id)) {
              objectivesMap.set(id, { id, name, principleId });
            }
          } else {
            // Se não seguir o formato esperado, usar o valor completo como ID e nome
            const id = initiative.objectiveId.trim();
            if (!objectivesMap.has(id)) {
              objectivesMap.set(id, { 
                id, 
                name: id, 
                principleId: initiative.principleId || '' 
              });
            }
          }
        }
      });
      
      // Converter o mapa em array e ordenar por ID
      const objectives = Array.from(objectivesMap.values())
        .sort((a, b) => {
          // Ordenar numericamente
          const numA = parseInt(a.id, 10) || 0;
          const numB = parseInt(b.id, 10) || 0;
          return numA - numB;
        });

      console.log(`Encontrados ${objectives.length} objetivos a partir das iniciativas`);
      this.cache.set(cacheKey, objectives);
      return objectives;
    } catch (error) {
      console.error('Erro ao extrair objetivos das iniciativas:', error);
      return [];
    }
  }
}

module.exports = GoogleSheetsService;
