GOAL: Adicionar filtro por Ano Prazo para Conclusão na tabela de iniciativas

IMPLEMENTATION:
1. Contexto de Iniciativas:
   - Adicionado campo completionYear aos filtros
   - Implementada função getUniqueYears para obter anos únicos
   - Atualizada função getFilteredInitiatives para incluir filtro por ano
   - Substituído setFilters por updateFilters para melhor gerenciamento de estado

2. Componente de Filtros:
   - Adicionado novo select para Ano de Conclusão
   - Integrado com grid layout 5 colunas
   - Mantida consistência visual EFGD
   - Implementada responsividade

3. Estilos CSS:
   - Grid responsivo (5 -> 3 -> 2 -> 1 colunas)
   - Tipografia Verdana
   - Cores oficiais (#183EFF para interações)
   - Espaçamento padronizado (20px)

4. Melhorias de UX:
   - Anos ordenados cronologicamente
   - Opção "Todos" como padrão
   - Feedback visual nas interações
   - Layout adaptativo
