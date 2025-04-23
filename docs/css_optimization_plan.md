# Plano de Otimização CSS
> Documento de planejamento para refatoração e otimização de estilos CSS

## Visão Geral
Este documento detalha o processo de otimização dos arquivos CSS do projeto, visando eliminar duplicações, padronizar estilos e melhorar a manutenibilidade do código.

## Fases de Implementação

### Fase 1: Preparação e Documentação
- [ ] Criar backup dos arquivos CSS atuais
  - Criar pasta `css_backup` com data
  - Copiar todos os arquivos CSS existentes
- [ ] Documentar estados visuais
  - Screenshots de todos os componentes
  - Estados: normal, hover, active, disabled
  - Documentar breakpoints responsivos

### Fase 2: Centralização das Variáveis
#### Passo 1: Configuração Initial
- [ ] Criar/atualizar `frontend/src/styles/variables.css`
  ```css
  :root {
    /* Cores base */
    --color-primary: #071D41;
    --color-secondary: #1351B4;
    
    /* Status */
    --status-total: #FFC107;
    --status-on-schedule: #2196F3;
    --status-delayed: #F44336;
    --status-completed: #4CAF50;
    
    /* Espaçamento */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* Tipografia */
    --font-family-primary: 'Rawline', Verdana, sans-serif;
    --font-size-normal: 1rem;
    --font-size-large: 1.4rem;
    --font-size-xlarge: 3.5rem;
  }
  ```

#### Passo 2: Validação
- [ ] Testar variáveis em componente não crítico (footer)
- [ ] Documentar qualquer inconsistência
- [ ] Ajustar valores conforme necessário

### Fase 3: Componente StatusCard
#### Passo 1: Criação do Novo Arquivo
- [ ] Criar `frontend/src/components/shared/StatusCard.css`
- [ ] Implementar estilos base
- [ ] Manter classes antigas como fallback

#### Passo 2: Migração Gradual
- [ ] Migrar status cards um por vez
- [ ] Testar cada variação
- [ ] Documentar mudanças

### Fase 4: Limpeza de Duplicações
#### Passo 1: Identificação
- [ ] Marcar duplicações com comentário `@cleanup-phase4`
- [ ] Criar planilha de rastreamento em `docs/css-cleanup-tracker.md`

#### Passo 2: Documentação
```markdown
| Arquivo | Linha | Estilo Duplicado | Status | Testado |
|---------|-------|------------------|---------|---------|
```

### Fase 5: Migração de Componentes
#### Ordem de Migração
1. [ ] StatusCard
2. [ ] Dashboard cards
3. [ ] Initiative cards
4. [ ] Notification components
5. [ ] Report components

#### Para Cada Componente
- [ ] Criar branch específica
- [ ] Aplicar novas variáveis
- [ ] Testar visualmente
- [ ] Code review
- [ ] Merge após aprovação

### Fase 6: Limpeza Final
- [ ] Remover comentários `@cleanup-phase4`
- [ ] Remover classes não utilizadas
- [ ] Remover arquivos CSS obsoletos
- [ ] Executar testes de regressão visual

## Monitoramento e Rollback

### Log de Migração
```markdown
# CSS Migration Log

## Fase [X] - [Data]
- ✅ Tarefa concluída
- ⚠️ Ajuste necessário
- 🔄 Rollback necessário
```

### Plano de Rollback
1. Manter branches separadas por fase
2. Backup dos arquivos originais
3. Documentar todas as mudanças
4. Testar rollback após cada fase

## Cronograma Estimado
- Fase 1-2: 1 dia
- Fase 3: 2-3 dias
- Fase 4: 1-2 dias
- Fase 5: 1 semana
- Fase 6: 1-2 dias

## Checklist de Testes
- [ ] Compatibilidade cross-browser
- [ ] Responsividade
- [ ] Estados de interação
- [ ] Performance
- [ ] Acessibilidade

## Métricas de Sucesso
- Redução no tamanho total dos arquivos CSS
- Eliminação de estilos duplicados
- Manutenção de todas as funcionalidades visuais
- Tempo de carregamento mantido ou melhorado

## Recursos Necessários
- Acesso ao repositório
- Ambiente de desenvolvimento local
- Ferramentas de teste visual
- Documentação atual do projeto

## Considerações de Segurança
- Manter backup de todos os arquivos
- Testar em ambiente de desenvolvimento
- Validar mudanças em diferentes resoluções
- Documentar todas as alterações

---
*Última atualização: [DATA]*