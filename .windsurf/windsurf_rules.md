# Windsurf Rules e Boas Práticas

## Regras de Operação para Diferentes Ambientes

### PowerShell (Windows)

1. **Operadores de Sequência de Comandos**:
   - No PowerShell do Windows, use o ponto e vírgula (`;`) para separar comandos sequenciais.
   - Exemplo correto: `cd frontend; npm start`
   - Exemplo incorreto: `cd frontend && npm start` (este formato é para ambientes Unix/Linux)

2. **Variáveis de Ambiente**:
   - No PowerShell, defina variáveis de ambiente temporárias usando `$env:NOME_VARIAVEL=valor`
   - Exemplo: `$env:PORT=3001; npm start`

3. **Caminhos de Arquivo**:
   - No Windows, os caminhos usam backslash (`\`) em vez de forward slash (`/`)
   - Exemplo: `C:\Users\username\project` em vez de `C:/Users/username/project`

### Bash (Unix/Linux)

1. **Operadores de Sequência de Comandos**:
   - No Bash (Linux/Unix/Mac), use `&&` para executar o próximo comando apenas se o anterior for bem-sucedido
   - Exemplo: `cd frontend && npm start`
   - Também é possível usar `;` para executar comandos sequencialmente independentemente do sucesso

2. **Variáveis de Ambiente**:
   - No Bash, defina variáveis de ambiente temporárias usando `NOME_VARIAVEL=valor comando`
   - Exemplo: `PORT=3001 npm start`

## Boas Práticas para Desenvolvimento

1. **Sempre especificar o diretório de trabalho explicitamente** ao executar comandos
2. **Verificar o ambiente de execução** antes de usar operadores específicos de shell
3. **Documentar comandos importantes** para facilitar a reutilização
4. **Usar caminhos absolutos** quando possível para evitar problemas de contexto

## Convenções de Código

1. **Seguir as diretrizes visuais do governo**:
   - Tipografia: Verdana em toda a aplicação
   - Esquema de cores: Amarelo (#FFD000), Azul (#183EFF), Verde (#00D000), Vermelho (#FF0000)
   - Padrões de layout: proporção 1280×720

2. **Nomenclatura de componentes**:
   - Usar PascalCase para nomes de componentes React
   - Usar camelCase para funções e variáveis
   - Usar UPPER_SNAKE_CASE para constantes

3. **Estrutura de arquivos**:
   - Organizar componentes por funcionalidade (initiatives, notifications, reports, etc.)
   - Manter arquivos CSS junto aos componentes relacionados
   - Usar contextos para gerenciamento de estado global
