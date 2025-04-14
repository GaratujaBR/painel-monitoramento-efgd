# Documento de Fluxo da Aplicação EFGD Atualizado

## Introdução

Esta aplicação tem como propósito principal oferecer uma plataforma de monitoramento dinâmico para a Estratégia Federal de Governo Digital (EFGD) do Brasil. O sistema apresenta dashboards interativos que exibem métricas-chave sobre o progresso das iniciativas governamentais, permitindo que gestores, analistas de políticas e outros stakeholders avaliem facilmente o andamento das ações. A aplicação segue os padrões oficiais de design e segurança do governo, garantindo uma experiência consistente e amigável tanto em dispositivos móveis quanto em desktops.

## Autenticação e Acesso

Diferentemente da versão anterior que utilizava integração com o Azure Active Directory, o novo sistema implementará autenticação via Google. Este método foi escolhido para simplificar o processo de login enquanto mantém a segurança necessária. Paralelamente, será desenvolvido um sistema de controle e registro de logins que limitará o acesso apenas a servidores efetivos autorizados. O processo de autenticação permanece com foco na segurança e na verificação da identidade do usuário, garantindo que apenas pessoas autorizadas tenham acesso aos dados sensíveis da EFGD.

## MVP - Painel Principal (Página "Geral")

Após o login bem-sucedido, o usuário é direcionado à página principal denominada "Geral", que serve como hub central da aplicação. Este painel apresenta uma visão abrangente da EFGD com os seguintes elementos:

1. **Gráfico de Pizza do Status Geral**: Exibe o status global da Estratégia, categorizado em três estados:
   - No Cronograma (azul)
   - Em Atraso (vermelho)
   - Concluídas (verde)
   *Nota: Esta representação atualiza a versão anterior que utilizava apenas dois status (Em Execução e Concluída) com cores diferentes.*

2. **Gráfico de Barras por Princípio**: Apresenta barras sobrepostas que mostram a distribuição de iniciativas pelos seis princípios da EFGD, segmentadas pelos três status (No Cronograma, Em Atraso, Concluídas).

3. **Gráfico de Barras por Objetivo**: Visualiza a distribuição de iniciativas pelos objetivos, também segmentadas pelos três status.

4. **Boxes de Métricas**: Três caixas proeminentes exibindo:
   - Número total de iniciativas No Cronograma
   - Número total de iniciativas Em Atraso
   - Número total de iniciativas Concluídas

5. **Box Informativo**: Uma seção textual explicativa sobre a EFGD, contextualizando a estratégia e seus objetivos para os usuários.

## Estrutura de Páginas Adicionais

Além da página principal "Geral", o MVP incluirá as seguintes páginas:

1. **Página de Iniciativas**: Contém a listagem textual de todas as iniciativas com sistema de filtros para facilitar a visualização e busca. Os usuários poderão filtrar por princípio, objetivo, status, e potencialmente outras categorias relevantes.

2. **Páginas de Princípios (6)**: Uma página dedicada para cada um dos seis princípios da EFGD:
   - I - Governo Centrado no Cidadão e Inclusivo
   - II - Governo Integrado e Colaborativo
   - III - Governo Inteligente e Inovador
   - IV - Governo Confiável e Seguro
   - V - Governo Transparente, Aberto e Participativo
   - VI - Governo Eficiente e Sustentável

   Cada página de princípio apresentará:
   - Gráficos detalhados mostrando a evolução dos objetivos relacionados
   - Visualização do progresso das iniciativas específicas daquele princípio
   - Métricas relevantes específicas para cada princípio

## Navegação

A aplicação contará com uma barra lateral (sidebar) que oferecerá navegação intuitiva para todas as oito páginas da aplicação:
- Página Geral (Dashboard principal)
- Página de Iniciativas (com filtros)
- Seis páginas individuais de Princípios

A navegação será projetada para ser intuitiva e responder às necessidades dos usuários, mantendo a consistência visual e funcional em toda a aplicação.

## Considerações Futuras (Pós-MVP)

Após o lançamento do MVP, as seguintes funcionalidades poderão ser consideradas para desenvolvimento:

1. **Sistema Avançado de Gerenciamento de Usuários**: Expansão do controle de acesso com diferentes níveis de permissão.

2. **Módulo de Entrada de Dados**: Interface para que servidores designados possam inserir atualizações de progresso das iniciativas.

3. **Notificações e Alertas**: Sistema para informar sobre prazos próximos e mudanças no status das iniciativas.

4. **Integração com Outras Plataformas**: Conectividade com outros sistemas governamentais relevantes.

5. **Módulo de Relatórios Personalizados**: Funcionalidade para gerar relatórios específicos conforme necessidades dos gestores.

O MVP foca na entrega do valor central - visualização eficaz do progresso da EFGD - enquanto estabelece as bases para expansões futuras que enriquecerão a experiência do usuário e a utilidade da aplicação para o governo digital brasileiro.