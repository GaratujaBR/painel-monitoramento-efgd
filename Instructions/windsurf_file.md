# Painel de Monitoramento da EFGD

## Visão Geral do Projeto

* **Tipo:** Dashboard de Monitoramento
* **Descrição:** Painel de monitoramento para a Estratégia Federal de Governo Digital (EFGD) do Brasil, com funcionalidades para acompanhamento de iniciativas, visualização de dados, notificações e geração de relatórios.

* **Objetivo Principal:** Fornecer uma plataforma centralizada para que gestores e servidores públicos possam acompanhar o progresso das iniciativas da EFGD, visualizar indicadores-chave de desempenho, receber notificações sobre atualizações importantes e gerar relatórios personalizados.

## Componentes do Sistema

O sistema possui dois componentes principais:
1. **Aplicativo de Entrada de Dados**: Interface para servidores registrarem o progresso das iniciativas
2. **Painel de Monitoramento**: Interface para visualização de KPIs e acompanhamento das iniciativas

## Estrutura do Projeto

### Organização de Diretórios

* **frontend/**: Contém a aplicação React do painel de monitoramento
  * **src/**: Código-fonte da aplicação
    * **components/**: Componentes React organizados por funcionalidade
      * **dashboard/**: Componentes da página inicial do dashboard
      * **initiatives/**: Componentes para gerenciamento de iniciativas
      * **notifications/**: Componentes para o centro de notificações
      * **reports/**: Componentes para o módulo de relatórios
      * **layout/**: Componentes de layout (sidebar, header, footer)
    * **context/**: Contextos React para gerenciamento de estado
    * **assets/**: Recursos estáticos (imagens, ícones)
    * **styles/**: Estilos CSS globais
  * **public/**: Arquivos públicos da aplicação

### Arquivos Principais

* **src/App.js**: Ponto de entrada da aplicação React, define as rotas principais
* **src/context/AuthContext.js**: Gerencia autenticação e usuários
* **src/context/InitiativesContext.js**: Gerencia dados de iniciativas
* **src/context/NotificationsContext.js**: Gerencia notificações
* **src/components/reports/ReportList.js**: Lista de relatórios disponíveis
* **src/components/reports/ReportDetail.js**: Visualização e configuração de relatórios específicos
* **src/components/reports/ReportGenerator.js**: Geração de relatórios personalizados

## Stack Tecnológica

* **Frontend**: React 18+
* **Gerenciamento de Estado**: Context API
* **Roteamento**: React Router 6+
* **UI/UX**: CSS personalizado seguindo diretrizes visuais do governo
* **Ícones**: React Icons
* **Autenticação**: Simulada via Context API (preparada para integração com MSAL)

## Identidade Visual

* **Tipografia**: Verdana em toda a aplicação
* **Esquema de Cores**:
  * Amarelo: #FFD000
  * Azul: #183EFF
  * Verde: #00D000
  * Vermelho: #FF0000
* **Layout**: Padrão de 1280×720 para compatibilidade com monitores governamentais

## Módulos Implementados

### Módulo de Autenticação
* Login de usuários
* Proteção de rotas
* Gerenciamento de sessão

### Módulo de Iniciativas
* Listagem de iniciativas
* Visualização detalhada
* Criação e edição
* Gerenciamento de marcos e equipes

### Módulo de Notificações
* Centro de notificações
* Notificações não lidas
* Filtragem por tipo
* Badge de notificações na interface

### Módulo de Relatórios
* **ReportList**: Lista todos os relatórios disponíveis com funcionalidades de filtragem por tipo, departamento, período e termo de busca
* **ReportDetail**: Visualização e configuração de relatórios específicos com opções de exportação em diferentes formatos (PDF, Excel, CSV)
* **ReportGenerator**: Criação de relatórios personalizados com base em templates pré-definidos (desempenho, status, detalhado, resumo)
* **Funcionalidades**:
  * Filtragem avançada de relatórios
  * Visualização prévia antes da exportação
  * Exportação em múltiplos formatos
  * Impressão direta
  * Personalização do conteúdo
  * Templates pré-definidos
  * Exibição de dados em gráficos e tabelas

## Próximos Passos

* **Implementação do Módulo de Gestão de Usuários**:
  * Lista de usuários
  * Detalhes e edição de usuários
  * Gerenciamento de papéis e permissões

* **Melhorias Futuras**:
  * Integração com backend real
  * Implementação de gráficos interativos
  * Dashboard personalizado por usuário
  * Exportação de dados em formatos adicionais