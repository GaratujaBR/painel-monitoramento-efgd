# Painel de Monitoramento EFGD

## Visão Geral do Projeto
Este é um painel de monitoramento e aplicação de entrada de dados para a Estratégia Federal de Governo Digital (EFGD) do Brasil. O sistema serve a dois propósitos principais:

1. **Aplicação de Entrada de Dados**: Permite que servidores públicos registrem o progresso em tempo real de várias iniciativas de governo digital
2. **Painel de Monitoramento**: Visualiza métricas-chave de desempenho para ajudar as partes interessadas a acompanhar a evolução da estratégia

## Estrutura do Projeto
- `/frontend` - Interface de usuário baseada em React
- `/backend` - Servidor Node.js/Express e endpoints de API
- `/.windsurf` - Documentação de tarefas do projeto e acompanhamento de progresso

## Funcionalidades
- Autenticação segura com MFA e controle de acesso baseado em perfis
- Formulários de entrada de dados para registro do progresso das iniciativas
- Painel visual para monitoramento de indicadores-chave de desempenho
- Integração com Google Sheets para sincronização de dados
- Notificações para prazos e atualizações
- Gerenciamento de usuários com permissões baseadas em perfis

## Stack Tecnológica
- **Frontend**: React
- **Backend**: Node.js, Express
- **Banco de Dados**: NoSQL
- **Autenticação**: Azure Active Directory
- **Hospedagem**: Microsoft Azure

## Identidade Visual
O projeto segue diretrizes específicas de identidade visual do governo:
- **Tipografia**: Fonte Verdana em todo o sistema
- **Esquema de cores**: Amarelo (#FFD000), Azul (#183EFF), Verde (#00D000), Vermelho (#FF0000)
- **Padrões de layout**: Proporção de aspecto 1280×720

## Como Começar
Instruções para configurar o ambiente de desenvolvimento:

1. Clone o repositório
2. Navegue até o diretório frontend: `cd frontend`
3. Instale as dependências: `npm install`
4. Inicie o servidor de desenvolvimento: `npm start`

## Status do Projeto
Este projeto está atualmente em desenvolvimento ativo.
