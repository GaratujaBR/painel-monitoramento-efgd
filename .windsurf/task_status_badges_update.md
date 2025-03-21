GOAL: Melhorar a legibilidade dos status badges seguindo diretrizes EFGD

IMPLEMENTATION:
1. Estilo Visual:
   - Texto colorido ao invés de fundo sólido
   - Borda colorida de 2px
   - Background com opacidade 0.1
   - Cores oficiais mantidas:
     * Em Andamento: #183EFF
     * Concluído: #00D000
     * Atrasado: #FF0000
     * Planejado: #FFD000

2. Componente React:
   - Uso de data-status para estilização
   - Removida lógica de cores inline
   - Mantida acessibilidade com aria-label
   - Labels padronizados em português

3. CSS Aprimorado:
   - Seletores baseados em data-attributes
   - Background com transparência
   - Bordas consistentes
   - Padding e border-radius mantidos

4. Acessibilidade:
   - Alto contraste mantido
   - Tamanho mínimo para toque
   - Feedback visual claro
   - Labels descritivos
