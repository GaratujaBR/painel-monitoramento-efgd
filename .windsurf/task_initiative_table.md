GOAL: Implementar tabela de iniciativas padronizada com filtros seguindo diretrizes EFGD

IMPLEMENTATION:
1. Estrutura da Tabela:
   - Colunas padronizadas:
     * Iniciativa (name)
     * Princípio (principleId)
     * Objetivo (objectiveId)
     * Área (areaId)
     * Ano Prazo para Conclusão (completionYear)
     * Status (status)
     * Progresso (progress)
   - Ordenação em todas as colunas
   - Alinhamento específico por tipo de dado

2. Filtros Implementados:
   - Por Princípio
   - Por Objetivo
   - Por Área
   - Por Status
   - Layout responsivo
   - Equal-width design

3. Padrões Visuais EFGD:
   - Tipografia: Verdana
   - Cores oficiais:
     * Azul (#183EFF) - Em Andamento
     * Verde (#00D000) - Concluído
     * Vermelho (#FF0000) - Atrasado
     * Amarelo (#FFD000) - Planejado
   - Layout: 1280×720
   - Espaçamento consistente (20px)

4. Melhorias de Acessibilidade:
   - Labels ARIA para status
   - Navegação por teclado
   - Indicadores de foco
   - Suporte a leitores de tela

5. Componentes React:
   - InitiativeList.js: Tabela principal
   - InitiativeFilters.js: Filtros
   - Initiatives.css: Estilos padronizados
   - InitiativesContext.js: Gerenciamento de estado

6. Otimizações:
   - useCallback para funções auxiliares
   - useMemo para ordenação
   - Tratamento de estados de loading/erro
   - Responsividade mobile-first
