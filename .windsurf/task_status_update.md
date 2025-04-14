GOAL: Atualizar status das iniciativas com novos valores e cores

IMPLEMENTATION:
1. Status Atualizados:
   - NÃO INICIADA:
     * Cor: Cinza Escuro (#444444)
     * Valor padrão para novas iniciativas
     * Progress: 0%

   - NO CRONOGRAMA:
     * Cor: Verde (#00D000)
     * Indica progresso dentro do planejado
     * Progress: variável

   - ATRASADA:
     * Cor: Vermelho (#FF0000)
     * Indica atraso no cronograma
     * Progress: variável

   - CONCLUÍDA:
     * Cor: Azul (#183EFF)
     * Indica conclusão total
     * Progress: 100%

2. Componentes Atualizados:
   - InitiativeList.js: novos labels em português
   - Initiatives.css: novas cores e estilos
   - Mock data: status atualizados

3. Acessibilidade:
   - Labels em português
   - Alto contraste mantido
   - Indicadores visuais claros
   - ARIA labels atualizados
