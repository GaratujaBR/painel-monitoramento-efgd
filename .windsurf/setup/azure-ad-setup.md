# Azure AD Setup for EFGD Dashboard

## 1. Acessar Portal Azure
1. Abra [portal.azure.com](https://portal.azure.com)
2. Faça login com sua conta organizacional MTEGov
3. Navegue até "Azure Active Directory"

## 2. Registrar Aplicativo
1. Clique em "Registros de aplicativo"
2. Selecione "Novo registro"
3. Configure:
   - Nome: `EFGD-Dashboard`
   - Tipo de conta: "Contas somente neste diretório organizacional (MTEGov somente - Locatário único)"
   - URI de Redirecionamento: (deixe em branco por enquanto)
4. Clique em "Registrar"

## 3. Coletar Informações
Após o registro, anote:
- ID do Aplicativo (client_id)
- ID do Diretório (tenant_id)

## 4. Configurar Permissões
1. Clique em "Permissões de API"
2. Clique em "Adicionar permissão"
3. Selecione "Microsoft Graph"
4. Escolha "Permissões de aplicativo"
5. Procure e selecione:
   - `Sites.Read.All`
6. Clique em "Adicionar permissões"
7. Clique em "Conceder consentimento de administrador"

## 5. Criar Segredo
1. Navegue até "Certificados e segredos"
2. Clique em "Novo segredo do cliente"
3. Configure:
   - Descrição: `EFGD-Dashboard-Access`
   - Expiração: 12 meses
4. IMPORTANTE: Copie o valor do segredo imediatamente
   - Este valor só será mostrado uma vez
   - Guarde em local seguro

## 6. Configurar Variáveis de Ambiente
Adicione ao arquivo `.env`:
```
SHAREPOINT_CLIENT_ID=<id_do_aplicativo>
SHAREPOINT_CLIENT_SECRET=<valor_do_segredo>
```

## Segurança
- Nunca compartilhe credenciais
- Mantenha o segredo em local seguro
- Planeje a rotação do segredo antes da expiração
- Monitore o uso através do Azure AD

## Próximos Passos
1. Testar autenticação
2. Verificar acesso ao SharePoint
3. Validar permissões
4. Monitorar logs de acesso
