# Configuração do Google Sheets para o Painel de Monitoramento

Este documento descreve como configurar o Google Sheets como fonte de dados para o Painel de Monitoramento EFGD.

## Pré-requisitos

1. Uma conta Google
2. Acesso ao Google Cloud Console
3. Uma planilha do Google Sheets com os dados das iniciativas

## Estrutura da Planilha

A planilha deve conter uma aba chamada "Iniciativas" (ou o nome configurado em GOOGLE_SHEETS_TAB_NAME) com as seguintes colunas:

- ID
- Iniciativa (título da iniciativa)
- Área
- Status
- Prazo
- Progresso (%) - valor numérico entre 0 e 100
- Objetivo
- Princípio

Exemplo:

| ID | Iniciativa | Área | Status | Prazo | Progresso (%) | Objetivo | Princípio |
|----|------------|------|--------|-------|---------------|----------|-----------|
| 1  | Implementar sistema X | TI | Em andamento | 31/12/2025 | 45 | Melhorar eficiência | Transparência |
| 2  | Revisar processos Y | RH | Concluído | 15/06/2024 | 100 | Otimizar fluxo de trabalho | Eficiência |

## Passos para Configuração

### 1. Criar uma Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie a primeira aba para "Iniciativas"
4. Adicione os cabeçalhos conforme a estrutura acima
5. Preencha com os dados das iniciativas
6. Anote o ID da planilha (encontrado na URL: `https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit`)

### 2. Configurar o Google Cloud Project e API Key

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Sheets:
   - No menu lateral, clique em "APIs e Serviços" > "Biblioteca"
   - Pesquise por "Google Sheets API"
   - Clique em "Google Sheets API" e depois em "Ativar"
4. Crie uma chave de API:
   - No menu lateral, clique em "APIs e Serviços" > "Credenciais"
   - Clique em "Criar credenciais" > "Chave de API"
   - Uma chave de API será gerada. Copie esta chave.
   - (Opcional, mas recomendado) Restrinja a chave de API para maior segurança:
     - Clique em "Restringir chave"
     - Em "Restrições de API", selecione "Google Sheets API"
     - Em "Restrições de aplicativo", você pode limitar a quais sites/IPs podem usar esta chave

### 3. Configurar o Compartilhamento da Planilha

1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" no canto superior direito
3. Defina a planilha como "Qualquer pessoa com o link pode visualizar"
   - Isso é necessário para que a API possa acessar os dados sem autenticação adicional
   - Alternativamente, você pode compartilhar apenas com uma conta de serviço específica se precisar de mais segurança

### 4. Configurar as Variáveis de Ambiente

Atualize o arquivo `.env` no diretório backend com as seguintes informações:

```
GOOGLE_SHEETS_API_KEY=sua_chave_api_aqui
GOOGLE_SHEETS_ID=id_da_sua_planilha_aqui
GOOGLE_SHEETS_TAB_NAME=Iniciativas
```

## Testando a Integração

1. Inicie o servidor backend:
   ```
   cd backend
   npm run dev
   ```

2. Acesse a rota de saúde para verificar se a conexão está funcionando:
   ```
   GET http://localhost:3003/api/initiatives/health
   ```

3. Acesse a rota de iniciativas para verificar se os dados estão sendo carregados corretamente:
   ```
   GET http://localhost:3003/api/initiatives
   ```

## Solução de Problemas

### Erro de API Key Inválida

Se você receber um erro indicando que a chave de API é inválida, verifique:
- Se a chave foi copiada corretamente para o arquivo .env
- Se a API do Google Sheets está ativada no seu projeto do Google Cloud
- Se há restrições na chave de API que possam estar bloqueando o acesso

### Erro de Acesso à Planilha

Se você receber um erro indicando que não foi possível acessar a planilha, verifique:
- Se o ID da planilha está correto no arquivo .env
- Se a planilha está compartilhada com as permissões adequadas
- Se o nome da aba (GOOGLE_SHEETS_TAB_NAME) corresponde exatamente ao nome na planilha

### Erro de Formato de Dados

Se os dados não estiverem sendo processados corretamente, verifique:
- Se a estrutura da planilha corresponde ao esperado
- Se os tipos de dados estão corretos (especialmente para campos numéricos como ID e Progresso)
