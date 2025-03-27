const { google } = require('googleapis');
const NodeCache = require('node-cache');
const crypto = require('crypto');

class GoogleSheetsService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutos de cache
    this.lastSync = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 segundo
    this.initialized = false;
    this.watchingSheets = ['Iniciativas', 'Princípios', 'Objetivos'];
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // Usar caminho para o arquivo de credenciais relativo ao diretório atual
      const path = require('path');
      const credentialsPath = path.resolve(__dirname, '../painel-de-monitoramento-efgd-b064b0a5d751.json');
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1lxfHZcf_C2TL05nkELhvHMXJYttRDwHLRkNESxmWbPQ';
      const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || 'Iniciativas';

      if (!spreadsheetId) {
        throw new Error('ID da planilha não configurado. Verifique a variável de ambiente GOOGLE_SHEETS_ID.');
      }

      // Inicializar cliente da API Google Sheets com conta de serviço
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      });

      const authClient = await auth.getClient();
      
      this.sheets = google.sheets({
        version: 'v4',
        auth: authClient
      });

      this.spreadsheetId = spreadsheetId;
      this.sheetName = sheetName;
      this.initialized = true;

      console.log('Cliente Google Sheets inicializado com sucesso', {
        timestamp: new Date(),
        spreadsheetId,
        sheetName,
        environment: process.env.NODE_ENV
      });

      // Iniciar polling para mudanças
      this.startChangePolling();

      return true;
    } catch (error) {
      console.error('Erro fatal ao inicializar cliente Google Sheets:', {
        message: error.message,
        timestamp: new Date(),
        stack: error.stack
      });
      throw new Error('Falha crítica na inicialização do serviço Google Sheets. Entre em contato com o suporte técnico.');
    }
  }

  async withRetry(operation, attempts = this.retryAttempts) {
    let lastError;
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`Tentativa ${i + 1}/${attempts} falhou:`, {
          message: error.message,
          timestamp: new Date()
        });
        
        if (i < attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }

  async getSpreadsheetData(sheetName = this.sheetName) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const cacheKey = `spreadsheet_data_${sheetName}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await this.withRetry(async () => {
        return await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:Z` // Obter todas as colunas
        });
      });

      const data = this.transformSpreadsheetData(response.data.values, sheetName);
      this.cache.set(cacheKey, data);
      this.lastSync = new Date();

      console.log(`Dados da planilha ${sheetName} atualizados:`, {
        timestamp: this.lastSync,
        rowCount: data.length,
        cacheKey
      });
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar dados da planilha ${sheetName}:`, {
        message: error.message,
        timestamp: new Date(),
        lastSync: this.lastSync
      });
      throw new Error('Falha ao acessar planilha do Google Sheets. Tente novamente em alguns minutos.');
    }
  }

  /**
   * PONTO CRÍTICO: Transformação de dados do Google Sheets
   * 
   * Esta função mapeia os dados brutos do Google Sheets para o formato esperado pelo frontend.
   * Qualquer alteração aqui deve manter a compatibilidade com:
   * 1. Os nomes de campos esperados pelo frontend (name, principleId, objectiveId, etc.)
   * 2. A normalização de status (NAO_INICIADA, NO_CRONOGRAMA, etc.)
   * 
   * @param {Array} values - Valores brutos da planilha
   * @param {String} sheetName - Nome da planilha sendo processada
   * @returns {Array} - Dados formatados para o frontend
   */
  transformSpreadsheetData(values, sheetName) {
    if (!Array.isArray(values) || values.length < 2) {
      console.warn(`Formato inválido da planilha ${sheetName}. Não há dados suficientes.`);
      return [];
    }

    // Pular linha de cabeçalho
    const [headers, ...rows] = values;
    
    // Log de cabeçalhos para depuração
    console.log(`Cabeçalhos da planilha ${sheetName}:`, headers);
    
    // Logs adicionais para diagnóstico
    console.log(`[DIAGNÓSTICO] Nome da planilha recebida: "${sheetName}"`);
    console.log(`[DIAGNÓSTICO] Comparando com: 'Iniciativas'=${sheetName === 'Iniciativas'}, 'Princípios'=${sheetName === 'Princípios'}, 'Objetivos'=${sheetName === 'Objetivos'}`);
    console.log(`[DIAGNÓSTICO] Comparando case-insensitive: 'principios'=${sheetName.toLowerCase() === 'principios'}, 'objetivos'=${sheetName.toLowerCase() === 'objetivos'}`);
    console.log(`[DIAGNÓSTICO] Comparando singular: 'PRINCÍPIO'=${sheetName.toUpperCase() === 'PRINCÍPIO'}, 'OBJETIVO'=${sheetName.toUpperCase() === 'OBJETIVO'}`);
    
    if (sheetName === 'Iniciativas' || sheetName === this.sheetName) {
      return this.transformInitiativesData(headers, rows);
    } else if (sheetName === 'Princípios' || sheetName.toUpperCase() === 'PRINCÍPIO') {
      console.log(`[DIAGNÓSTICO] Processando planilha de princípios: ${sheetName}`);
      return this.transformPrinciplesData(headers, rows);
    } else if (sheetName === 'Objetivos' || sheetName.toUpperCase() === 'OBJETIVO') {
      console.log(`[DIAGNÓSTICO] Processando planilha de objetivos: ${sheetName}`);
      return this.transformObjectivesData(headers, rows);
    } else {
      console.warn(`Planilha ${sheetName} não reconhecida. Retornando dados brutos.`);
      return rows.map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });
        return item;
      });
    }
  }

  transformInitiativesData(headers, rows) {
    // Encontrar índices das colunas importantes (baseado nos cabeçalhos)
    const findColumnIndex = (keywords) => {
      return headers.findIndex(header => {
        if (!header) return false;
        const headerLower = header.toString().toLowerCase().trim();
        return keywords.some(keyword => headerLower.includes(keyword));
      });
    };

    // Logs adicionais para diagnóstico de colunas
    console.log('[DIAGNÓSTICO] Headers completos:', headers);
    
    // Verificar especificamente colunas de princípio e objetivo
    const principleKeywords = ['princípio', 'principio', 'princípios', 'principios', 'princ'];
    const objectiveKeywords = ['objetivo', 'objetivos', 'iniciativa'];
    
    console.log('[DIAGNÓSTICO] Buscando colunas de princípio com keywords:', principleKeywords);
    headers.forEach((header, index) => {
      if (header) {
        const headerLower = header.toString().toLowerCase().trim();
        const matchesPrinciple = principleKeywords.some(keyword => headerLower.includes(keyword));
        const matchesObjective = objectiveKeywords.some(keyword => headerLower.includes(keyword));
        console.log(`[DIAGNÓSTICO] Header[${index}]: "${header}" - matchesPrinciple: ${matchesPrinciple}, matchesObjective: ${matchesObjective}`);
      }
    });
    
    // Verificar especificamente "PRINC (PIO)"
    const princPioIndex = headers.findIndex(header => 
      header && header.toString().toUpperCase().includes('PRINC') && header.toString().includes('(')
    );
    console.log(`[DIAGNÓSTICO] Índice da coluna "PRINC (PIO)": ${princPioIndex}`);
    if (princPioIndex !== -1) {
      console.log(`[DIAGNÓSTICO] Valor encontrado: "${headers[princPioIndex]}"`);
    }

    const objectiveIndex = findColumnIndex(['objetivo', 'iniciativa']);
    const areaIndex = findColumnIndex(['área', 'area', 'departamento', 'diretoria']);
    const statusIndex = findColumnIndex(['status', 'situação', 'situacao']);
    const prazoIndex = findColumnIndex(['prazo', 'ano', 'conclusão', 'conclusao']);
    const performanceIndex = findColumnIndex(['performance', 'desempenho']);
    const principleIndex = findColumnIndex(['princípio', 'principio', 'princípios', 'principios', 'princ']);
    
    console.log("[DIAGNÓSTICO] Índices de colunas encontrados:", {
      objectiveIndex,
      principleIndex,
      areaIndex,
      statusIndex,
      prazoIndex,
      performanceIndex
    });
    
    // Verificar amostra de dados
    if (rows.length > 0) {
      console.log('[DIAGNÓSTICO] Amostra de dados (primeira linha):');
      headers.forEach((header, index) => {
        console.log(`  ${header}: "${rows[0][index]}"`);
      });
    }
    
    return rows.map((row, rowIndex) => {
      // Inicializar objeto da iniciativa com valores padrão
      const initiative = {
        id: `id-${rowIndex + 1}`,
        name: '',
        principleId: '',
        objectiveId: '',
        areaId: '',
        completionYear: '',
        status: 'NAO_INICIADA',
        progress: 0,
        performance: '',        // Campo para Performance
        responsiblePerson: '',  // Novo campo
        lastUpdate: '',         // Novo campo
        observations: ''        // Novo campo
      };
      
      // Processar colunas especiais primeiro
      // Extrair o objetivo da coluna correspondente, se existir
      if (objectiveIndex !== -1 && row[objectiveIndex]) {
        const objectiveValue = row[objectiveIndex];
        initiative.objectiveId = objectiveValue;
        
        // Se não houver coluna específica para 'name', usar o valor do objetivo
        // Este campo é tanto o objetivo como o nome da iniciativa
        initiative.name = objectiveValue;
      }
      
      // Extrair o princípio da coluna correspondente, se existir
      if (principleIndex !== -1 && row[principleIndex]) {
        initiative.principleId = row[principleIndex];
      }
      // Verificar também a coluna "PRINC (PIO)" se existir
      else if (princPioIndex !== -1 && row[princPioIndex]) {
        initiative.principleId = row[princPioIndex];
        console.log(`[DIAGNÓSTICO] Princípio encontrado na coluna "PRINC (PIO)": "${row[princPioIndex]}"`);
      }
      
      // Processar outras colunas
      headers.forEach((header, index) => {
        if (!header) return;
        const headerLower = header.toString().toLowerCase().trim();
        const value = row[index];
        
        if (!value) return;
        
        try {
          switch(true) {
            // Já processados acima, pular
            case objectiveIndex === index:
            case principleIndex === index:
            case princPioIndex === index:
              break;
              
            case headerLower.includes('área') || headerLower.includes('area') || headerLower.includes('departamento'):
              initiative.areaId = value;
              break;
              
            case headerLower.includes('status') || headerLower.includes('situação') || headerLower.includes('situacao'):
              initiative.status = this.normalizeStatus(value);
              break;
              
            case headerLower.includes('prazo') || headerLower.includes('ano') || headerLower.includes('conclusão'):
              initiative.completionYear = value;
              break;
              
            case headerLower.includes('progresso') || headerLower.includes('percentual'):
              // Extrair apenas números
              const progressMatch = value.toString().match(/(\d+)/);
              initiative.progress = progressMatch ? parseInt(progressMatch[1], 10) : 0;
              
              // Validar intervalo
              if (initiative.progress < 0 || initiative.progress > 100) {
                initiative.progress = 0;
              }
              break;
              
            case headerLower.includes('performance') || headerLower.includes('desempenho'):
              initiative.performance = value;
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

  /**
   * Transforma os dados da planilha de princípios para o formato esperado pelo frontend
   * @param {Array} headers - Cabeçalhos da planilha
   * @param {Array} rows - Linhas de dados da planilha
   * @returns {Array} - Princípios formatados para o frontend
   */
  transformPrinciplesData(headers, rows) {
    console.log(`[DIAGNÓSTICO] Transformando dados de princípios, ${rows.length} linhas encontradas`);
    
    // Encontrar índices das colunas importantes
    const findColumnIndex = (keywords) => {
      return headers.findIndex(header => {
        if (!header) return false;
        const headerLower = header.toString().toLowerCase().trim();
        return keywords.some(keyword => headerLower.includes(keyword));
      });
    };
    
    const idIndex = findColumnIndex(['id', 'número', 'numero', 'numeral']);
    const nameIndex = findColumnIndex(['nome', 'princípio', 'principio', 'descrição', 'descricao']);
    
    console.log(`[DIAGNÓSTICO] Índices de colunas de princípios: idIndex=${idIndex}, nameIndex=${nameIndex}`);
    
    // Se não encontrou as colunas esperadas, tenta usar a primeira coluna como ID e a segunda como nome
    const useFirstColumns = idIndex === -1 || nameIndex === -1;
    
    return rows.map((row, index) => {
      let id, name;
      
      if (useFirstColumns) {
        // Usar as primeiras colunas disponíveis
        id = row[0] || `P${index + 1}`;
        name = row[1] || id;
      } else {
        // Usar as colunas encontradas
        id = row[idIndex] || `P${index + 1}`;
        name = row[nameIndex] || id;
      }
      
      // Extrair o ID numeral romano se estiver no formato "I - Nome do Princípio"
      const match = name.match(/^([IVX]+)\s*-\s*(.+)$/);
      if (match) {
        id = match[1].trim();
        // Manter o nome completo com o numeral
      }
      
      console.log(`[DIAGNÓSTICO] Princípio processado: id=${id}, name=${name}`);
      
      return {
        id,
        name,
        // Campos adicionais que podem ser úteis
        description: row[findColumnIndex(['descrição', 'descricao', 'detalhes'])] || '',
        status: 'ATIVO'
      };
    }).filter(principle => principle.name && principle.name.trim() !== '');
  }
  
  /**
   * Transforma os dados da planilha de objetivos para o formato esperado pelo frontend
   * @param {Array} headers - Cabeçalhos da planilha
   * @param {Array} rows - Linhas de dados da planilha
   * @returns {Array} - Objetivos formatados para o frontend
   */
  transformObjectivesData(headers, rows) {
    console.log(`[DIAGNÓSTICO] Transformando dados de objetivos, ${rows.length} linhas encontradas`);
    
    // Encontrar índices das colunas importantes
    const findColumnIndex = (keywords) => {
      return headers.findIndex(header => {
        if (!header) return false;
        const headerLower = header.toString().toLowerCase().trim();
        return keywords.some(keyword => headerLower.includes(keyword));
      });
    };
    
    const idIndex = findColumnIndex(['id', 'número', 'numero', 'código', 'codigo']);
    const nameIndex = findColumnIndex(['nome', 'objetivo', 'descrição', 'descricao']);
    const principleIndex = findColumnIndex(['princípio', 'principio', 'princ']);
    
    console.log(`[DIAGNÓSTICO] Índices de colunas de objetivos: idIndex=${idIndex}, nameIndex=${nameIndex}, principleIndex=${principleIndex}`);
    
    // Se não encontrou as colunas esperadas, tenta usar a primeira coluna como ID e a segunda como nome
    const useFirstColumns = idIndex === -1 || nameIndex === -1;
    
    return rows.map((row, index) => {
      let id, name, principleId = '';
      
      if (useFirstColumns) {
        // Usar as primeiras colunas disponíveis
        id = row[0] || `O${index + 1}`;
        name = row[1] || id;
      } else {
        // Usar as colunas encontradas
        id = row[idIndex] || `O${index + 1}`;
        name = row[nameIndex] || id;
      }
      
      // Extrair o ID numérico se estiver no formato "01 - Nome do Objetivo"
      const match = name.match(/^(\d+)\s*-\s*(.+)$/);
      if (match) {
        id = match[1].trim();
        // Manter o nome completo com o numeral
      }
      
      // Processar o princípio associado, se existir
      if (principleIndex !== -1 && row[principleIndex]) {
        principleId = row[principleIndex];
        
        // Extrair o ID do princípio se estiver no formato "I - Nome do Princípio"
        const principleMatch = principleId.match(/^([IVX]+)\s*-\s*(.+)$/);
        if (principleMatch) {
          principleId = principleMatch[1].trim();
        }
      }
      
      console.log(`[DIAGNÓSTICO] Objetivo processado: id=${id}, name=${name}, principleId=${principleId}`);
      
      return {
        id,
        name,
        principleId,
        // Campos adicionais que podem ser úteis
        description: row[findColumnIndex(['descrição', 'descricao', 'detalhes'])] || '',
        status: 'ATIVO'
      };
    }).filter(objective => objective.name && objective.name.trim() !== '');
  }
  
  // Normalize status values to match our standard format
  normalizeStatus(status) {
    if (!status) return 'NAO_INICIADA';
    
    const statusLower = status.toString().toLowerCase().trim();
    
    if (statusLower.includes('não iniciada') || statusLower.includes('nao iniciada') || statusLower === 'não iniciado' || statusLower === 'nao iniciado') {
      return 'NAO_INICIADA';
    }
    
    if (statusLower.includes('cronograma') || statusLower === 'no prazo' || statusLower === 'em andamento') {
      return 'NO_CRONOGRAMA';
    }
    
    if (statusLower.includes('atrasada') || statusLower === 'atrasado' || statusLower === 'em atraso') {
      return 'ATRASADA';
    }
    
    if (statusLower.includes('concluída') || statusLower.includes('concluida') || statusLower === 'concluído' || statusLower === 'concluido' || statusLower === 'finalizada' || statusLower === 'finalizado') {
      return 'CONCLUIDA';
    }
    
    return 'NAO_INICIADA';
  }
}