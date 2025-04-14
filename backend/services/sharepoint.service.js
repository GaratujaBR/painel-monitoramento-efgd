const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const NodeCache = require('node-cache');
require('isomorphic-fetch');
const crypto = require('crypto');

class SharePointService {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
    this.lastSync = null;
    this.deltaToken = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.initializeClient();
  }

  async initializeClient() {
    try {
      const clientId = process.env.SHAREPOINT_CLIENT_ID;
      const clientSecret = process.env.SHAREPOINT_CLIENT_SECRET;
      const tenantId = '8ba9c2c6-dd21-4a00-b23e-2f75af1fd1aa'; // MTe tenant ID

      if (!clientId || !clientSecret) {
        throw new Error('Credenciais do SharePoint não configuradas. Verifique as variáveis de ambiente SHAREPOINT_CLIENT_ID e SHAREPOINT_CLIENT_SECRET.');
      }

      // Initialize Azure AD credential with retry logic
      await this.withRetry(async () => {
        const credential = new ClientSecretCredential(
          tenantId,
          clientId,
          clientSecret
        );

        // Initialize Microsoft Graph client with required scopes
        this.client = Client.init({
          authProvider: async (done) => {
            try {
              const token = await credential.getToken('https://graph.microsoft.com/.default');
              done(null, token.token);
            } catch (error) {
              console.error('Erro de autenticação:', {
                message: error.message,
                code: error.code,
                timestamp: new Date(),
                details: error.details || 'Sem detalhes adicionais'
              });
              done(error, null);
            }
          },
          defaultVersion: 'v1.0',
          debugLogging: process.env.NODE_ENV === 'development'
        });
      });

      // Get site ID and initialize file tracking
      await this.initializeSiteAndFile();
      
      console.log('Cliente SharePoint inicializado com sucesso', {
        timestamp: new Date(),
        tenant: tenantId,
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('Erro fatal ao inicializar cliente SharePoint:', {
        message: error.message,
        code: error.code,
        timestamp: new Date(),
        stack: error.stack
      });
      throw new Error('Falha crítica na inicialização do serviço SharePoint. Entre em contato com o suporte técnico.');
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

  async initializeSiteAndFile() {
    const siteUrl = process.env.SHAREPOINT_SITE_URL;
    const fileId = process.env.SHAREPOINT_FILE_ID;

    if (!siteUrl || !fileId) {
      throw new Error('URL do SharePoint ou ID do arquivo não configurados. Verifique as variáveis SHAREPOINT_SITE_URL e SHAREPOINT_FILE_ID.');
    }

    try {
      const hostname = new URL(siteUrl).hostname;
      
      // Get site ID with retry
      const site = await this.withRetry(async () => {
        const response = await this.client
          .api('/sites')
          .filter(`siteCollection/hostname eq '${hostname}' and name eq 'CGGOV534'`)
          .get();

        if (!response || !response.value || !response.value[0]) {
          throw new Error('Site do SharePoint não encontrado. Verifique se o site existe e se você tem permissão de acesso.');
        }

        return response;
      });

      this.siteId = site.value[0].id;
      console.log('Site SharePoint identificado:', {
        siteId: this.siteId,
        hostname,
        timestamp: new Date()
      });

      // Start tracking changes
      await this.setupChangeTracking();
    } catch (error) {
      console.error('Erro ao inicializar site e arquivo:', {
        message: error.message,
        siteUrl,
        fileId,
        timestamp: new Date()
      });
      throw error;
    }
  }

  async getSpreadsheetData() {
    try {
      const cacheKey = 'spreadsheet_data';
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await this.withRetry(async () => {
        return await this.client
          .api(`/sites/${this.siteId}/drive/items/${process.env.SHAREPOINT_FILE_ID}/workbook/worksheets/Iniciativas/range`)
          .get();
      });

      const data = this.transformSpreadsheetData(response.values);
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
      throw new Error('Falha ao acessar planilha do SharePoint. Tente novamente em alguns minutos.');
    }
  }

  transformSpreadsheetData(values) {
    if (!Array.isArray(values) || values.length < 2) {
      throw new Error('Formato inválido da planilha. Verifique se a estrutura está correta.');
    }

    // Skip header row
    const [headers, ...rows] = values;
    
    return rows.map((row, rowIndex) => {
      const initiative = {};
      headers.forEach((header, index) => {
        const value = row[index];
        try {
          switch(header.toLowerCase()) {
            case 'id':
              initiative.id = parseInt(value, 10);
              if (isNaN(initiative.id)) {
                throw new Error(`ID inválido na linha ${rowIndex + 2}`);
              }
              break;
            case 'iniciativa':
              initiative.titulo = value || '';
              break;
            case 'área':
            case 'area':
              initiative.area = value || '';
              break;
            case 'status':
              initiative.status = value || '';
              break;
            case 'prazo':
              initiative.prazo = value || '';
              break;
            case 'progresso':
            case 'progresso (%)':
              initiative.progresso = parseInt(value, 10) || 0;
              if (initiative.progresso < 0 || initiative.progresso > 100) {
                throw new Error(`Progresso inválido na linha ${rowIndex + 2}`);
              }
              break;
            case 'objetivo':
              initiative.objetivo = value || '';
              break;
            case 'princípio':
            case 'principio':
              initiative.principio = value || '';
              break;
          }
        } catch (error) {
          console.error('Erro ao processar campo:', {
            header,
            value,
            rowIndex: rowIndex + 2,
            error: error.message
          });
          throw error;
        }
      });
      return initiative;
    });
  }

  async setupChangeTracking() {
    try {
      const response = await this.withRetry(async () => {
        return await this.client
          .api(`/sites/${this.siteId}/drive/items/${process.env.SHAREPOINT_FILE_ID}/workbook/changes`)
          .get();
      });

      this.deltaToken = response['@odata.deltaLink'];
      console.log('Monitoramento de alterações iniciado:', {
        timestamp: new Date(),
        deltaToken: this.deltaToken ? 'Configurado' : 'Não configurado'
      });
      
      // Start polling for changes
      this.startChangePolling();
      
      return true;
    } catch (error) {
      console.error('Erro ao configurar monitoramento:', {
        message: error.message,
        timestamp: new Date()
      });
      return false;
    }
  }

  async startChangePolling() {
    setInterval(async () => {
      try {
        if (!this.deltaToken) {
          console.warn('Delta token não configurado. Tentando reconfigurar...');
          await this.setupChangeTracking();
          return;
        }

        const changes = await this.withRetry(async () => {
          return await this.client
            .api(this.deltaToken)
            .get();
        });

        if (changes.value && changes.value.length > 0) {
          console.log('Alterações detectadas:', {
            count: changes.value.length,
            timestamp: new Date()
          });
          await this.processChanges(changes.value);
        }

        // Update delta token for next polling
        this.deltaToken = changes['@odata.deltaLink'];
      } catch (error) {
        console.error('Erro ao verificar alterações:', {
          message: error.message,
          timestamp: new Date(),
          willRetry: true
        });
      }
    }, 30000); // Poll every 30 seconds
  }

  async processChanges(changes) {
    // Clear cache to force refresh
    this.cache.flushAll();
    
    // Log changes for audit
    console.log('Alterações detectadas:', {
      timestamp: new Date(),
      changeCount: changes.length,
      changes: changes.map(c => ({
        type: c.type,
        resource: c.resource,
        time: c.time
      }))
    });

    return await this.getSpreadsheetData();
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
      throw new Error('Falha ao buscar dados do SharePoint. Tente novamente em alguns minutos.');
    }
  }

  filterInitiatives(initiatives, filters) {
    return initiatives.filter(initiative => {
      return (!filters.area || initiative.area === filters.area) &&
             (!filters.status || initiative.status === filters.status) &&
             (!filters.principle || initiative.principio === filters.principle);
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
      active: Boolean(this.deltaToken),
      lastSync: this.lastSync,
      changeDetection: 'Delta Query',
      pollingInterval: '30 seconds',
      retryConfig: {
        attempts: this.retryAttempts,
        delay: this.retryDelay
      }
    };
  }
}

module.exports = SharePointService;
