# Painel de Monitoramento EFGD - Configuração do Backend

## Configuração de Ambiente

1. Crie um arquivo `.env` na pasta `backend`:
   ```bash
   cp .env.template .env
   ```

2. Configure as variáveis no arquivo `.env`:
   - `GOOGLE_SHEETS_API_KEY`: Chave de API do Google Cloud
   - `GOOGLE_SHEETS_ID`: ID da planilha do Google Sheets
   - `GOOGLE_SHEETS_TAB_NAME`: Nome da aba na planilha (padrão: "Iniciativas")
   - `PORT`: Porta do servidor (padrão: 3003)
   - `NODE_ENV`: Ambiente (development/production)

## Configuração do Google Sheets

Para instruções detalhadas sobre como configurar o Google Sheets como fonte de dados, consulte o arquivo [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md).

## Segurança (Governo confiável e seguro)
- Nunca compartilhe o arquivo `.env`
- Mantenha as credenciais em local seguro
- O arquivo `.env` está no `.gitignore`
- Faça rotação da chave de API a cada 12 meses
- Restrinja o acesso à sua chave de API no Google Cloud Console

## Integração (Governo integrado e colaborativo)
O backend se conecta ao Google Sheets usando:
- Google Sheets API v4
- Autenticação por chave de API
- Cache para otimização
- Tratamento de erros em português

## Sustentabilidade (Governo eficiente e sustentável)
- Cache configurado para 5 minutos
- Atualização automática de dados a cada 30 segundos
- Logs para monitoramento
- Tratamento de erros resiliente com tentativas automáticas
