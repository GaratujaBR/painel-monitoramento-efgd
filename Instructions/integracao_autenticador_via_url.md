# 🧠 Integração via Parâmetro de URL – Autenticação Externa (gov.br) para Painel React

Este guia é para desenvolvedores que estão atuando em modo *vibe coding* 🚀. Ele traz instruções claras e operacionais para implementar autenticação via parâmetro na URL em um painel React já hospedado, que será embutido por uma plataforma que autentica via gov.br.

---

## 🎯 Objetivo

Permitir que o painel verifique se o usuário está autenticado com base em um parâmetro (`id` ou `token`) enviado na URL pelo sistema que incorpora o painel via `<iframe>`.

---

## ⚙️ Requisitos

- Projeto já hospedado (ex: Netlify)
- Plataforma externa já autenticando com gov.br
- O painel será embutido via `<iframe src="https://painel.site?id=12345" />`

---

## 🛠️ Etapas de Implementação

### 1. Instale as dependências

Caso ainda não esteja usando React Router:

```bash
npm install react-router-dom
```

Se for usar token JWT (opcional):

```bash
npm install jwt-decode
```

---

### 2. Crie o componente `Autenticador.js`

```jsx
// src/components/Autenticador.js
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Autenticador({ children }) {
  const [searchParams] = useSearchParams();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get("id"); // ou token

    if (userId) {
      setAutenticado(true);
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) return <p>Verificando autenticação...</p>;
  if (!autenticado) return <p>Acesso não autorizado</p>;

  return <>{children}</>;
}
```

---

### 3. Envolva seu painel no `App.js`

```jsx
import { BrowserRouter } from "react-router-dom";
import Autenticador from "./components/Autenticador";
import Painel from "./components/Painel";

function App() {
  return (
    <BrowserRouter>
      <Autenticador>
        <Painel />
      </Autenticador>
    </BrowserRouter>
  );
}

export default App;
```

---

### 4. (Opcional) Usar e validar `token` com JWT

```jsx
import jwt_decode from "jwt-decode";

function validarToken(token) {
  try {
    const decoded = jwt_decode(token);
    return decoded && decoded.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
}
```

---

## 🧪 Teste final

1. Acesse: `https://seupainel.netlify.app?id=abc123` → ✅ painel visível
2. Acesse sem parâmetro: `https://seupainel.netlify.app` → ❌ acesso negado
3. Teste com token inválido → ⚠️ acesso negado

---

## 📦 Deploy

Faça o deploy no Netlify normalmente. O painel já estará protegido via URL.

---

## 🧘 Vibe Coding Ativado

Use Live Server, hot reload, arquivos limpos e commit frequente. Não entre em estado de dúvida: *builda e testa*. Integração rápida, segura e vibe-friendly.

---

## 🧾 Checklist

- [ ] Recebimento do parâmetro na URL
- [ ] Lógica de validação implementada
- [ ] Componente `Autenticador` criado
- [ ] Painel protegido e testado
- [ ] Deploy realizado
