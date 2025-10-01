# Ingressos Online — Web + Mobile (Expo/React Native)

Um projeto **full stack front-end** (web + mobile) para gerenciamento de **eventos** e **ingressos** com autenticação Firebase, câmera integrada, exportação de CSV e boas práticas de acessibilidade.

> **Teste rápido (mobile no navegador):**  
> Abra o app mobile diretamente no Snack (Expo)  
> 👉 https://snack.expo.dev/@marcos-rezende-infnet/marcos-rezende-projeto-bloco-desenvolvimento-front-end-frameworks-25e2_5?platform=web

---

## Sumário
- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do repositório](#arquitetura-do-repositório)
- [Stack técnico](#stack-técnico)
- [Pré‑requisitos](#pré-requisitos)
- [Configuração de ambiente](#configuração-de-ambiente)
- [Rodando o projeto (Web)](#rodando-o-projeto-web)
- [Rodando o projeto (Mobile)](#rodando-o-projeto-mobile)
- [Build e Deploy (Web)](#build-e-deploy-web)
- [Acessibilidade](#acessibilidade)
- [Diagnóstico e Câmera](#diagnóstico-e-câmera)
- [Solução de problemas (FAQ)](#solução-de-problemas-faq)
- [Roadmap](#roadmap)
- [Licença](#licença)

---

## Visão geral
Este repositório contém duas aplicações:
- **Web (React + TypeScript)**: SPA com autenticação, CRUD local de eventos, câmera via `getUserMedia`, exportação de CSV e toasts.
- **Mobile (Expo/React Native)**: app com autenticação, navegação por abas (Dashboard, Eventos, Meus Ingressos) e câmera com `expo-camera`.

> **Observação**: Os **eventos/ingressos** são mantidos **em memória** (estado do app). O Firebase Firestore está preparado, mas **não há persistência real** de domínio por padrão.

---

## Funcionalidades
- 🔐 **Autenticação (Firebase Authentication)**: login, cadastro e logout.
- 🧭 **Navegação protegida** (Web e Mobile).
- 🗂️ **Eventos**: lista, busca, criar/editar, arquivar e remover (estado local).
- 🎟️ **Meus Ingressos**: compra de ingresso (associa evento ao usuário).
- 📷 **Câmera**:
  - **Web**: captura com `getUserMedia` (HTTPS requerido).
  - **Mobile**: `expo-camera` com modal de captura e anexação.
- 📤 **Exportar CSV**: exportação da lista de ingressos (Web).
- 🔔 **Toasts** (feedback de ações).
- ♿ **Acessibilidade**: `SkipLink`, `aria-live`, foco gerenciado, contraste.
- 🎨 **SASS / Design tokens**: variáveis e mixins (página de showcase).

---

## Arquitetura do repositório
```
.
├─ web/                         # App Web (CRA/React 18+TS)
│  ├─ src/
│  │  ├─ App.tsx               # Rotas (públicas e protegidas)
│  │  ├─ context/
│  │  │  ├─ AuthContext.tsx    # Firebase Auth (v12 modular)
│  │  │  └─ ToastContext.tsx   # Toasts
│  │  ├─ components/           # Header, Footer, Formulários, Modais, etc.
│  │  ├─ pages/                # Dashboard, Eventos, MeusIngressos, etc.
│  │  ├─ services/firebase.ts  # init do Firebase
│  │  ├─ utils/                # env, csvExport, helpers
│  │  └─ styles/               # SASS (variables + mixins)
│  ├─ public/
│  ├─ package.json
│  └─ Dockerfile               # build + NGINX (SPA)
│
└─ mobile/                      # App Mobile (Expo 53 / RN 0.79)
   ├─ App.tsx
   ├─ src/
   │  ├─ AuthContext.tsx       # Firebase Auth (SDK compat v8)
   │  ├─ EventsContext.tsx     # Estado de eventos/ingressos (local)
   │  ├─ navigation.tsx        # Stack + Bottom Tabs
   │  ├─ components/
   │  ├─ screens/
   │  ├─ firebase.ts           # init (compat), shims e long polling
   │  ├─ shim.ts               # polyfills RN
   │  └─ config.ts             # chaves do Firebase (dev)
   ├─ package.json
   └─ app.json / babel.config.js
```

---

## Stack técnico
**Web**
- React 18, TypeScript, React Router
- Firebase JS SDK **modular (v9+) / v12**: `auth`, `firestore`
- SASS + CSS Modules
- Build com Docker/NGINX

**Mobile**
- Expo SDK 53, React Native 0.79
- `expo-camera`, `@react-navigation/*`, `react-native-paper`
- Firebase SDK **compat v8** (com polyfills)

---

## Pré‑requisitos
- **Node.js** 18 LTS ou 20 LTS
- **npm** 9+ ou **pnpm/yarn** (opcional)
- **Expo CLI** (`npm i -g expo`)
- Dispositivo Android/iOS com **Expo Go** (opcional) ou emulador
- Para **câmera no Web**: **HTTPS** habilitado (ou `localhost`)

---

## Configuração de ambiente
Crie um arquivo `.env` **na pasta `web/`** com as chaves do Firebase (exemplo):

```ini
# web/.env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

No **mobile**, as chaves ficam em `mobile/src/config.ts`:

```ts
// mobile/src/config.ts
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

> **Dica**: para evitar commit de segredos, garanta que `.env` esteja no `.gitignore`. As chaves públicas do Firebase não concedem acesso ao projeto sem regras adequadas no Firestore, mas trate-as como **config sensível**.

---

## Rodando o projeto (Web)
```bash
cd web
npm ci
cp .env.example .env   # se existir; caso contrário, crie a partir do bloco acima
npm start
```
- O app sobe em `http://localhost:3000`.
- Rotas protegidas requerem login no Firebase Auth.

### Scripts úteis (web)
```bash
npm run build     # build de produção
npm test          # testes (se configurados)
```

---

## Rodando o projeto (Mobile)

### 1) Testar diretamente no navegador (Snack)
Abra o link e rode **sem instalar nada**:
- 👉 https://snack.expo.dev/@marcos-rezende-infnet/marcos-rezende-projeto-bloco-desenvolvimento-front-end-frameworks-25e2_5?platform=web

> Observação: alguns recursos (ex.: câmera) podem ter limitações no navegador do Snack.

### 2) Rodar localmente (Expo)
```bash
cd mobile
npm ci
expo start
```
- Pressione **a** (Android), **i** (iOS) ou **w** (web).
- Para testar em dispositivo físico, instale **Expo Go** e escaneie o QR code.

---

## Build e Deploy (Web)

### Build de produção
```bash
cd web
npm ci
npm run build
```
Os artefatos ficam em `web/build/`.

### Docker (NGINX)
O `web/Dockerfile` faz o build e serve via NGINX:
```bash
cd web
docker build -t ingressos-web:prod .
docker run -p 8000:80 ingressos-web:prod
```

**SPA e roteamento**: o NGINX está configurado para `try_files $uri /index.html;` garantindo que as rotas do React funcionem em refresh.

**HTTPS é obrigatório** para `getUserMedia` (câmera) no navegador – use TLS (Let's Encrypt, CloudFront, etc.) em produção.

---

## Acessibilidade
- **Skip to content** (SkipLink)
- **Toasts com `aria-live`** para feedback não intrusivo
- **Foco gerenciado** ao entrar em modais/rotas
- **Contraste** e navegação por teclado testadas nas principais telas

---

## Diagnóstico e Câmera
- **Web**: página de *Diagnóstico* verifica `isSecureContext`, `mediaDevices` e permissões.
- **Mobile**: `expo-camera` pede permissão em runtime. O modal de câmera integra com *Meus Ingressos*.

> Em ambiente **não seguro** (sem HTTPS), os browsers podem bloquear a câmera.

---

## Solução de problemas (FAQ)

**A câmera não funciona no Web.**
- Verifique se está em **HTTPS** (ou em `localhost`).
- Permissões do navegador: limpe e reautorize.
- Outra aba/app está usando a câmera? Feche-a.

**Erro de autenticação Firebase.**
- Confirme as chaves no `.env` (web) / `config.ts` (mobile).
- Verifique se o **domínio** está autorizado no Console Firebase (Authentication → Settings).

**No Snack (web) algo não abre.**
- Alguns módulos RN têm limitações no ambiente do navegador do Snack. Rode localmente com `expo start` para validar.

**`expo-camera` pede permissão e não abre.**
- Reinstale o app no Expo Go e garanta permissão em `Configurações → App → Câmera`.

---

## Roadmap
- 🔄 Persistir **Eventos/Ingressos** no **Firestore** (`tenants/{tenant}/events` e `users/{uid}/tickets`) com regras de segurança.
- 🔍 Busca e filtros avançados (por data, preço, categoria).
- 🧾 PDFs/Passes de ingresso com QRCode.
- ☁️ Sincronização offline-first no mobile.
- 🧪 Testes E2E (Detox/Playwright).

---

## Licença
Distribuído sob a licença MIT. Sinta-se à vontade para usar e contribuir.

---

**Autor**  
Marcos Rezende — Projeto acadêmico (Infnet) / Estudo prático de Web + Mobile com Firebase e Expo.
