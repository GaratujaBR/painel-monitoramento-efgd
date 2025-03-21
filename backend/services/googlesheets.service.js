const { google } = require('googleapis');
const NodeCache = require('node-cache');
const crypto = require('crypto');

class GoogleSheetsService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
    this.lastSync = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // Use direct path to credentials file
      const credentialsPath = 'c:/Users/gabri/Desktop/MGI/Painel de Monitoramento/backend/painel-de-monitoramento-efgd-b064b0a5d751.json';
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1lxfHZcf_C2TL05nkELhvHMXJYttRDwHLRkNESxmWbPQ';
      const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || 'Iniciativas';

      if (!spreadsheetId) {
        throw new Error('ID da planilha não configurado. Verifique a variável de ambiente GOOGLE_SHEETS_ID.');
      }

      // Initialize Google Sheets API client with service account
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

      // Start polling for changes
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
      throw new Error('Falha ao acessar planilha do Google Sheets. Tente novamente em alguns minutos.');
    }
  }

  transformSpreadsheetData(values) {
    if (!Array.isArray(values) || values.length < 2) {
      throw new Error('Formato inválido da planilha. Verifique se a estrutura está correta.');
    }

    // Skip header row
    const [headers, ...rows] = values;
    
    return rows.map((row, rowIndex) => {
      const initiative = {
        id: '',
        name: '',
        principleId: '',
        objectiveId: '',
        areaId: '',
        completionYear: '',
        status: 'NAO_INICIADA',
        progress: 0
      };
      
      headers.forEach((header, index) => {
        const value = row[index];
        try {
          switch(header.toLowerCase()) {
            case 'id':
              initiative.id = value || `id-${rowIndex + 1}`;
              break;
            case 'iniciativa':
            case 'iniciativas':
              initiative.name = value || '';
              break;
            case 'área':
            case 'area':
              initiative.areaId = value || '';
              break;
            case 'status':
              initiative.status = this.normalizeStatus(value) || '';
              break;
            case 'prazo':
            case 'ano prazo para conclusão':
            case 'ano':
              initiative.completionYear = value || '';
              break;
            case 'progresso':
            case 'progresso (%)':
              initiative.progress = parseInt(value, 10) || 0;
              if (initiative.progress < 0 || initiative.progress > 100) {
                initiative.progress = 0;
                console.warn(`Progresso inválido na linha ${rowIndex + 2}, definido como 0`);
              }
              break;
            case 'objetivo':
            case 'objetivos':
              initiative.objectiveId = value || '';
              break;
            case 'princípio':
            case 'principio':
            case 'princípios':
            case 'principios':
              initiative.principleId = value || '';
              break;
          }
        } catch (error) {
          console.error('Erro ao processar campo:', {
            header,
            value,
            rowIndex: rowIndex + 2,
            error: error.message
          });
          // Continue processing instead of throwing error
          console.warn(`Erro ignorado para continuar processamento: ${error.message}`);
        }
      });

      return initiative;
    }).filter(initiative => initiative.name); // Filter out rows without a title
  }

  // Normalize status values to match our standard format
  normalizeStatus(status) {
    if (!status) return 'NAO_INICIADA';
    
    const statusLower = status.toLowerCase().trim();
    
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
    
    return status.toUpperCase();
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
}

module.exports = GoogleSheetsService;
