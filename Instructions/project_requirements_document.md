# Project Requirements Document (PRD) - Dashboard MVP

## 1. Project Overview

Este projeto consiste em um dashboard de monitoramento para a Estratégia Federal de Governo Digital (EFGD) do Brasil. A EFGD é um framework que moderniza as operações governamentais e serviços públicos, promovendo transparência, eficiência, inclusão e inovação. O MVP do dashboard visualizará métricas-chave de desempenho, facilitando o acompanhamento da evolução da estratégia por gestores, analistas e stakeholders.

O objetivo principal é fornecer uma solução digital de fácil utilização que apresente informações críticas em formato gráfico claro, aprimorando a tomada de decisões e garantindo transparência na execução da EFGD. O sucesso será medido pela clareza na visualização dos dados, aderência aos padrões de design governamentais e usabilidade geral da experiência tanto em dispositivos móveis quanto em desktops.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

* Um dashboard responsivo otimizado para dispositivos móveis e desktops.
* Autenticação de usuários segura com integração Google (em substituição ao Azure AD).
* Um dashboard de monitoramento que exibe métricas-chave através de representações gráficas, incluindo:
  * Gráfico de pizza mostrando o status geral da EFGD (No Cronograma, Em Atraso, Concluídas).
  * Gráfico de barras sobrepostas mostrando status por Princípio.
  * Gráfico de barras sobrepostas mostrando status por Objetivo.
  * Boxes informativos com contagem de iniciativas por status.
  * Box explicativo sobre a EFGD.
* Navegação intuitiva entre páginas através de uma barra lateral.
* Página dedicada à listagem de iniciativas com filtros para melhor visualização.
* Seis páginas individuais, uma para cada Princípio da EFGD.
* Integração com manuais de design governamentais para consistência visual.

**Out-of-Scope para o MVP:**

* Interface de entrada de dados para servidores registrarem progresso (implementação futura).
* Sistema de notificações para alertar usuários sobre prazos ou atualizações.
* Funcionalidades administrativas avançadas de gerenciamento de usuários.
* Integração com SharePoint para atualização de dados (implementação futura).
* Sistema de mensagens entre usuários.
* Funcionalidade offline.
* Ferramentas analíticas avançadas ou análises preditivas.
* Customizações extensivas ou integrações com sistemas externos.

## 3. User Flow

A jornada típica do usuário começa quando um servidor civil acessa a aplicação em seu dispositivo móvel ou desktop. Eles são recebidos com uma tela de login que utiliza autenticação via Google. Uma vez autenticados, os usuários são direcionados para o dashboard principal (página "Geral"), projetado de acordo com as diretrizes de design governamentais.

Na página principal, os usuários visualizam imediatamente os gráficos e métricas que mostram o status geral da EFGD. Utilizando a barra lateral de navegação, podem acessar a página de iniciativas, que lista todas as iniciativas com opções de filtro, ou navegar para uma das seis páginas de Princípios para visualizar métricas específicas de cada área.

## 4. Core Features

* **Autenticação de Usuários:**
  * Login seguro via Google.
  * Sistema de controle para limitar acesso apenas a servidores autorizados.

* **Dashboard de Monitoramento (Página "Geral"):**
  * Gráfico de pizza mostrando distribuição de status das iniciativas (No Cronograma, Em Atraso, Concluídas).
  * Gráfico de barras sobrepostas mostrando a distribuição por Princípio.
  * Gráfico de barras sobrepostas mostrando a distribuição por Objetivo.
  * Três boxes informativos com contagens de iniciativas por status.
  * Box explicativo sobre a EFGD.

* **Página de Iniciativas:**
  * Listagem completa das iniciativas da EFGD.
  * Sistema de filtros para facilitar a visualização (por Princípio, Objetivo, status).
  * Visualização de informações detalhadas sobre cada iniciativa.

* **Páginas de Princípios (6):**
  * Visualizações detalhadas para cada um dos seis princípios da EFGD.
  * Gráficos mostrando a evolução dos objetivos relacionados ao princípio.
  * Visualização do progresso das iniciativas específicas do princípio.

* **Navegação:**
  * Barra lateral (sidebar) com links para todas as oito páginas da aplicação.
  * Design intuitivo e consistente em toda a aplicação.

## 5. Tech Stack & Tools

* **Frontend:**
  * Framework: React (garantindo uma interface de usuário responsiva e dinâmica).
  * Data Formulator (Microsoft) para criação de visualizações de dados personalizadas.
  * Compatibilidade Mobile/Desktop: O design da UI priorizará usabilidade em ambas plataformas, seguindo diretrizes governamentais.

* **Backend:**
  * Inicialmente simplificado, focado apenas na autenticação e acesso a dados estáticos.
  * Preparação para expansão futura com Node.js/Express quando necessário.

* **Segurança & Autenticação:**
  * Autenticação via Google.
  * Sistema de registro e controle de logins para limitar acesso a servidores autorizados.

* **Desenvolvimento & Ferramentas:**
  * Gerenciamento de dados inicial com armazenamento estático (JSON).
  * GitHub para controle de versão e colaboração.

## 6. Non-Functional Requirements

* **Performance:**
  * A aplicação deve carregar em poucos segundos em dispositivos móveis e desktops.
  * As visualizações de dados devem ser renderizadas de forma eficiente sem atrasos perceptíveis.

* **Segurança:**
  * Autenticação segura via Google.
  * Proteção contra acessos não autorizados.

* **Usabilidade & Acessibilidade:**
  * Interface intuitiva que segue manuais de design governamentais.
  * Navegação clara e consistente entre todas as páginas.
  * Responsividade completa para diferentes tamanhos de tela.

* **Compliance:**
  * Aderência às regulamentações de proteção de dados do Brasil (LGPD).
  * Conformidade com padrões visuais governamentais.

## 7. Constraints & Assumptions

* O MVP utilizará dados estáticos para visualização, preparando a estrutura para integração futura com fontes de dados dinâmicas.
* Assume-se que a autenticação via Google será suficiente para a fase inicial, com aprimoramentos de segurança planejados para futuras iterações.
* O design e a identidade visual devem seguir estritamente os manuais governamentais existentes.
* A fase de MVP focará exclusivamente na visualização de dados, deixando a funcionalidade de entrada de dados para implementações futuras.

## 8. Known Issues & Potential Pitfalls

* **Limitações de Dados Estáticos:**
  * O uso de dados estáticos no MVP pode limitar a capacidade de mostrar informações em tempo real.
  * Para mitigar, estruturar os dados de forma que facilite a transição para fontes dinâmicas no futuro.

* **Consistência Visual:**
  * A aderência estrita a manuais de design governamentais pode restringir melhorias flexíveis no design.
  * Desenvolver um protótipo de design antecipadamente para garantir viabilidade e obter feedback dos stakeholders.

* **Escalabilidade:**
  * Garantir que a arquitetura seja planejada para acomodar funcionalidades futuras como entrada de dados e integrações.
  * Implementar práticas de código limpo e modular desde o início.

* **Autenticação:**
  * A mudança para autenticação Google (em vez de Azure AD) pode necessitar ajustes para garantir o nível adequado de segurança para dados governamentais.
  * Implementar camadas adicionais de verificação conforme necessário.

Este documento serve como fonte central de informações para o desenvolvimento do MVP do dashboard da EFGD. Ele fornece diretrizes claras e detalhadas que devem ser seguidas para garantir que não haja ambiguidade no design, implementação ou objetivos do projeto.