# Sistema Simples de Venda de Ingressos Online — Revisão TP4 e Plano TP5

## 1) Mudanças de Requisitos (conforme feedback do professor)
- **Autenticação**: incluir **cadastro**, **login/logout** e **separação por espaço/cliente/empresa** (multi-tenant).
- **CRUD do recurso-core (Eventos)**: entregar as 4 visões — **Overview (lista)**, **Focus (detalhe)**, **Make (criar/editar)**, **Do (ação rápida)**.
- **Dashboard/Resumo**: cards/gráfico simples (eventos disponíveis, ingressos comprados, próximas datas).
- **Notificações & Mobile**: **pull-to-refresh**, **swipe** para ação rápida (ex.: arquivar), **push local/toast** em mudanças de estado.
- **Relatórios/Exportação**: botão **Exportar CSV** (Meus Ingressos) e/ou **Enviar e-mail** (mock com confirmação).
- **Acessibilidade (a11y)**: navegação por teclado, contraste, `aria-*`, rótulos, foco visível.
- **SASS**: criar **página de apresentação da solução SASS** demonstrando variáveis, mixins e organização (Mobile-First).
- **Correção de navegação**: links não devem levar todos ao mesmo destino; garantir âncoras/rotas corretas.
- **Testes automatizados**: smoke + unit (componentes-chave) + acessibilidade básica (axe/core).

---

## 2) Histórias de Usuário Revisadas (com critérios de aceitação)

### 2.1 Autenticação & Usuários
**Como usuário**, quero **me cadastrar** e **entrar/sair** do sistema, para acessar recursos protegidos.
- CA:
  - Tela de **Cadastro** (nome, e-mail, senha) e **Login** (e-mail/usuário + senha).
  - **Logout** limpa sessão/estado.
  - Erros e validações visíveis; suporte a teclado e leitores de tela.
  - (Opcional) Persistência simples (localStorage) para manter sessão.

**Como admin de um cliente (tenant)**, quero operar apenas **meus dados**.
- CA:
  - Contexto de **tenant** definido no login.
  - Listas e operações **filtradas por tenant**.

### 2.2 CRUD do Recurso-Core (Eventos)
**Como admin**, quero **listar** eventos (**Overview**), ver **detalhes** (**Focus**), **criar/editar** (**Make**) e executar **ações rápidas** (**Do**) para manter a vitrine atualizada.
- CA:
  - Overview: lista com nome/data/local, busca simples e paginação mínima.
  - Focus: página/modal com dados completos.
  - Make: formulário com validação; sucesso mostra toast; acessível.
  - Do: **swipe** em mobile para **arquivar**/**remover** rapidamente; confirmação.

### 2.3 Compra de Ingressos e Notificações
**Como usuário**, quero **comprar** ingressos e receber **notificação** de sucesso.
- CA:
  - Botão “Comprar” adiciona ingresso; atualiza **Meus Ingressos**.
  - **Toast** imediato (e push local quando disponível).
  - **Pull-to-refresh** na lista de eventos para simular atualização.

### 2.4 Dashboard/Resumo
**Como usuário/admin**, desejo um **dashboard** com visão rápida do sistema.
- CA:
  - Cards: total de eventos, ingressos comprados, próximas datas.
  - (Opcional) Gráfico simples de compras por mês.

### 2.5 Relatórios/Exportação
**Como usuário**, quero **exportar CSV** dos meus ingressos e/ou **enviar por e-mail** (mock) para registro.
- CA:
  - Botão “Exportar CSV” em Meus Ingressos.
  - “Enviar por e-mail” exibe confirmação (mock).

### 2.6 Acessibilidade
**Como pessoa com necessidades de acessibilidade**, quero **usar o sistema por teclado** e leitor de tela.
- CA:
  - Foco visível, ordem lógica de tabulação.
  - Labels e `aria-*` nos controles.
  - Contraste mínimo WCAG AA nas cores.

### 2.7 SASS — Apresentação
**Como avaliador**, quero ver uma **página SASS** exibindo **variáveis, mixins e utilitários** para comprovar o uso.
- CA:
  - Página “SASS” com exemplos de tokens (cores, espaçamentos), mixins (breakpoints), nesting e BEM.

---

## 3) Backlog Priorizado (mapeado a componentes e status)

| ID | Épico              | História/Feature                                | Componentes/Rotas                         | Status       | Sprint alvo |
|----|--------------------|--------------------------------------------------|-------------------------------------------|--------------|-------------|
| A1 | Autenticação       | Cadastro + Login + Logout                        | `/login`, `AuthForm`, `AuthContext`       | **Novo**     | S1          |
| A2 | Multi-tenant       | Escopo por cliente/empresa                       | `AuthContext`, filtros no Events API      | **Novo**     | S2          |
| C1 | Eventos Overview   | Lista com busca, paginação                       | `Eventos`                                 | Em andamento | S1          |
| C2 | Eventos Focus      | Detalhe do evento                                | `EventoDetalhe` (modal/section)           | **Novo**     | S1          |
| C3 | Eventos Make       | Criar/Editar evento (form)                       | `EventoForm`                              | **Novo**     | S1          |
| C4 | Eventos Do         | Swipe (arquivar/remover) + confirmação           | `EventosItem`, gesto mobile               | **Novo**     | S2          |
| D1 | Dashboard          | Cards + (opcional) gráfico simples               | `Dashboard`                               | **Novo**     | S1          |
| N1 | Notificações       | Toast/push em compra/CRUD                        | `Toast`, `useNotifications`               | **Novo**     | S1          |
| M1 | Pull-to-Refresh    | Atualizar lista de eventos                       | `Eventos` (mobile)                        | **Novo**     | S2          |
| R1 | Exportação CSV     | Exportar “Meus Ingressos”                        | `MeusIngressos`, `csvExport.ts`           | **Novo**     | S1          |
| X1 | Acessibilidade     | Foco, `aria-*`, contraste                         | Globais + componentes                     | **Novo**     | S1–S2       |
| S1 | SASS Page          | Página de apresentação SASS                      | `SassShowcase` + scss                     | **Novo**     | S2          |
| T1 | Testes             | Smoke + unit + a11y (axe-core)                   | `__tests__/...`                           | **Novo**     | S2          |
| NAV| Navegação correta  | Corrigir links que caem no mesmo destino         | `Header` + ancoragem/rotas                | **Novo**     | S1          |

**Status atual do código (TP2):** `Header`, `Eventos` (lista simples), `MeusIngressos`, `Sobre`, `Footer`, **Login mock**.  
**A implementar (TP5):** A1, A2, C2–C4, D1, N1, M1, R1, X1, S1, T1, NAV.

---

## 4) Mapeamento História → Componentes
- **Autenticação**: `AuthContext` (estado global), `Login`/`Register` (forms), `Header` (user/Logout).
- **CRUD Eventos**: `Eventos` (Overview), `EventoDetalhe` (Focus), `EventoForm` (Make), `EventosItem` com swipe (Do).
- **Dashboard**: `Dashboard` + `Card` + (opcional) `MiniChart`.
- **Notificações**: `Toast` (portals) + `useNotifications()`; **push local** (Notification API) quando suportado.
- **Relatórios**: util `csvExport.ts` (gera blob CSV).
- **Acessibilidade**: atributos e tokens globais; revisar `tabIndex`, `aria-*`, foco.
- **SASS**: `SassShowcase` + `styles/` (`_variables.scss`, `_mixins.scss`, `_globals.scss`).

---

## 5) Definição de Pronto (DoD) para TP5
- Feature atendendo **critérios de aceitação**.
- **A11y** básica validada (foco/aria/contraste).
- **Testes**: pelo menos 1 smoke/unit por feature crítica.
- **Docs**: README atualizado (o que é, como usar, limitações).
- **Responsive/Mobile-First** funcional.
- **Sem erros** no console.

---

## 6) Plano de Sprints (curto)
- **S1**: A1, NAV, C2, C3, D1, N1, R1, X1 (parcial).
- **S2**: A2, C4 (swipe), M1 (pull-to-refresh), S1 (SASS page), T1, X1 (final).

---

## 7) Riscos e Mitigações
- Tempo x escopo → priorizar MVP por épico (entregar valor primeiro).
- Multi-tenant complexo → iniciar com **tenant em memória** (mock) e filtros locais.
- Push/Notificação → fallback para **toast** se API Notification indisponível.
