# Ingressos Online — Mobile (Expo)

Versão mobile nativa (Expo + React Native) do app Ingressos Online.

## Rodar
1. `cp .env.example .env` e preencha as variáveis `EXPO_PUBLIC_FIREBASE_*` do seu projeto Firebase.
2. `npm i`
3. `npm run start` e escolha Android/iOS/Web.

## Estrutura
- `app/` (Expo Router)
  - `(public)/login.tsx`
  - `(tabs)/_layout.tsx`, `dashboard.tsx`, `eventos.tsx`, `meus-ingressos.tsx`
  - `camera.tsx`, `diagnostico.tsx`, `sobre.tsx`
- `src/context/` Auth, Toast, AppData
- `src/components/` `EventoForm`, `EventoItem`, `Toast`
- `src/services/` Firebase
- `src/utils/` `csvExport.native.ts`
- `src/theme/` tokens

## Notas
- Auth usa `initializeAuth` com `AsyncStorage`.
- Câmera usa `expo-camera` e salva a foto em base64 no contexto de dados.
- Tabs são protegidas: usuários não logados vão para `/login`.
