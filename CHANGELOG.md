# Changelog

## [1.1.0] - 2025-03-29
### Adicionado
- Implementação da visualização de iniciativas concluídas no gráfico de Objetivos
- Novas cores e legendas no gráfico ObjectiveStatusChart seguindo padrões do governo
- Logs detalhados de ajustes de contagem no console para diagnóstico

### Modificado
- Aprimoramento do tooltip para mostrar porcentagens e contagem de concluídas
- Ajuste na lógica de contagem para evitar duplicação entre status e performance

## [0.9.0] - 2025-03-24
### Adicionado
- Implementação completa do gráfico de status por princípio
- Funcionalidade de "Ver todos/Ver menos" no gráfico de status por objetivo
- Botão interativo para alternar entre visualização parcial e completa no gráfico de objetivos
- Estilização para o botão de alternância de visualização
- Integração dos princípios e objetivos do back-end para nomes corretos nos gráficos

### Modificado
- Atualização do componente de gráfico por objetivo para limitar inicialmente a 10 itens
- Ajuste no componente Dashboard para fornecer dados de princípios e objetivos aos gráficos
- Melhoria na apresentação responsiva dos gráficos
- Ajuste dinâmico de altura do gráfico baseado na quantidade de itens exibidos

## [0.8.0] - 2025-03-23
### Modificado
- Ajuste de tamanhos de fonte para melhor visualização
- Melhoria no espaçamento entre elementos do dashboard
- Correção do posicionamento da data/hora de última atualização
- Otimização do layout da sidebar para textos longos
- Ajuste nas proporções dos cards de métricas
- Melhoria na organização visual dos elementos

## [0.7.0] - 2025-03-23
### Adicionado
- Sistema de variáveis CSS para padronização visual
- Classes de utilidade para layout, cores e espaçamento
- Exibição da data/hora da última atualização no dashboard
- Estilos consistentes para componentes de UI

### Modificado
- Atualização completa do CSS seguindo diretrizes do manual de identidade visual
- Padronização de tamanhos de fonte conforme especificações
- Ajuste do layout para proporção 16:9 (1280x720)
- Melhoria na responsividade para dispositivos móveis
- Refinamento das cores para seguir a paleta oficial

## [0.6.0] - 2025-03-23
### Adicionado
- Acesso ao dashboard real após login
- Integração com o sistema de autenticação principal

### Modificado
- Fluxo de login redirecionando para o dashboard real
- Botões de simulação agora usam o sistema de autenticação real
- Melhoria na experiência de usuário durante o login

## [0.5.0] - 2025-03-23
### Adicionado
- Suporte para autenticação com Google
- Simulação de login simplificada para testes

### Modificado
- Atualização do fluxo de autenticação
- Melhoria na experiência de login
- Correção de erros no processo de login

## [0.4.0] - 2025-03-23
### Adicionado
- Gráficos de barras para status por princípio e por objetivo
- Reorganização da sidebar com princípios
- Tooltips interativos nos gráficos

### Modificado
- Removida a seção de princípios do dashboard
- Atualização do texto de status "Atrasada" para "Em Atraso"
- Melhoria no layout e estilo do dashboard

## [0.3.0] - 2025-03-23
### Adicionado
- Integração com Recharts para visualização de dados
- Gráfico de pizza interativo para status de iniciativas
- Tooltips e legendas melhoradas nos gráficos

### Modificado
- Substituição do gráfico CSS por componente Recharts
- Melhoria no layout e estilo dos gráficos
- Ajustes de responsividade para melhor visualização em diferentes dispositivos

## [0.2.0] - 2025-03-23
### Adicionado
- Endpoint de dashboard para fornecer métricas agregadas
- Integração do frontend com o endpoint de dashboard
- Visualização de métricas adicionais no dashboard (progresso médio, total de iniciativas)
- Visualização de iniciativas por ano de conclusão
- Tratamento de erros e estados de carregamento no dashboard

### Modificado
- Atualização do caminho para o arquivo de credenciais do Google Sheets
- Melhoria no layout e estilo do dashboard
- Refatoração do componente Dashboard para usar dados do endpoint de dashboard

## [0.1.0] - 2025-03-21
### Adicionado
- Integração completa com Google Sheets
- Transformação de dados para formato compatível com o frontend
- Endpoints para principles, objectives e areas
- Filtros funcionais no frontend
- Layout do dashboard seguindo o padrão da EFGD

### Modificado
- Estrutura de dados padronizada entre backend e frontend
- Normalização de status de iniciativas
- Redesign do dashboard para seguir o layout da EFGD
