# Integração Google Sheets - Painel de Monitoramento EFGD

## Mapeamento de Colunas

| Coluna Google Sheets | Campo no Frontend | Descrição |
|----------------------|-------------------|-----------|
| INICIATIVAS | name | Nome da iniciativa |
| OBJETIVO | objectiveId | Identificador do objetivo relacionado |
| PRINCÍPIO | principleId | Identificador do princípio relacionado |
| ÁREA | areaId | Identificador da área relacionada |
| PRAZO | completionYear | Ano previsto para conclusão |
| STATUS | status | Status atual da iniciativa |
| PROGRESSO | progress | Percentual de conclusão (0-100) |

## Tabelas de Referência

O sistema utiliza três tabelas de referência que podem ser carregadas do Google Sheets:

1. **Princípios** (aba "Princípios")
   - ID: Identificador único (ex: P1, P2, P3...)
   - Nome: Nome do princípio
   - Descrição: Descrição detalhada

2. **Objetivos** (aba "Objetivos")
   - ID: Identificador único (ex: O1, O2, O3...)
   - Nome: Nome do objetivo
   - PrincípiID: Referência ao princípio relacionado
   - Descrição: Descrição detalhada

3. **Áreas** (aba "Areas")
   - ID: Identificador único (ex: A1, A2, A3...)
   - Nome: Nome da área
   - Descrição: Descrição detalhada

## Normalização de Status

Os status são normalizados conforme as diretrizes EFGD:

| Valor no Google Sheets | Valor no Sistema | Exibição na Interface | Cor |
|------------------------|------------------|------------------------|-----|
| NÃO INICIADA | NAO_INICIADA | Não Iniciada | #444444 |
| NO CRONOGRAMA | NO_CRONOGRAMA | No Cronograma | #00D000 |
| ATRASADA | ATRASADA | Atrasada | #FF0000 |
| CONCLUÍDA | CONCLUIDA | Concluída | #183EFF |
| EM ANDAMENTO | EM_ANDAMENTO | Em Andamento | #183EFF |
| PLANEJADO | PLANEJADO | Planejado | #FFD000 |

## Fluxo de Dados

1. O backend busca os dados do Google Sheets usando a API do Google
2. Os dados são transformados e normalizados no backend
3. O frontend solicita os dados através da API REST
4. Os dados são exibidos na tabela de iniciativas com referências resolvidas

## Atualização de Dados

Os dados podem ser atualizados manualmente através do botão "Atualizar" na interface, que faz uma requisição para a rota `/api/initiatives/refresh` no backend.
