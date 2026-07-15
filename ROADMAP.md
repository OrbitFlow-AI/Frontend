# OrbitFlow Frontend — Phased Roadmap

Derived from [PRD.md](./PRD.md). Frontend-only scope throughout; no contract or backend work in any phase.

---

## Phase 0 — Scaffold

| | |
|---|---|
| **Objective** | Stand up a working, lint-clean Next.js + TypeScript + Tailwind project skeleton with no feature code yet. |
| **Deliverables** | • Next.js App Router project structure (`app/`, `components/`, `lib/`, `types/`, `tests/`)<br>• `package.json` with the intended dependency set (not installed)<br>• `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.ts`<br>• `.eslintrc`, `.prettierrc`, `.gitignore`, `.env.example`<br>• Base layout (`app/layout.tsx`), global styles, root page shell<br>• `README.md` with setup/run instructions<br>• GitHub Actions CI skeleton (`.github/workflows/ci.yml`) running lint/typecheck/test/build steps |
| **Exit Criteria** | Folder structure matches the plan; every config file is syntactically valid; root page renders a shell with no feature logic; CI workflow file is present and would run lint/typecheck/test on push. |
| **Complexity** | Low |

## Phase 1 — Core Loop

| | |
|---|---|
| **Objective** | Prove the core concept end-to-end: an operator can see an agent's treasury and watch one simulated micropayment move between two agents. |
| **Deliverables** | • Domain types (`Agent`, `Transaction`, `Policy`, `MarketplaceListing`)<br>• Mock data service layer (`lib/services/agentService.ts`, `lib/services/transactionService.ts`) with seeded in-memory data<br>• `AgentProvider` context exposing agents + transactions to the tree<br>• Dashboard page listing agents with balance/budget/status<br>• Agent card component<br>• Agent detail page showing balance + an empty transaction list<br>• One scripted "Pay Agent" action that creates a settled transaction and updates both balances |
| **Exit Criteria** | From the dashboard, an operator can open an agent, trigger the one payment action, and see the balance update and the transaction appear — fully driven by mock data and local state, no dead links. |
| **Complexity** | Medium |

## Phase 2 — Feature Complete

| | |
|---|---|
| **Objective** | Implement every remaining Core Feature from the PRD, including edge cases and defined error/empty states. |
| **Deliverables** | • Create Agent modal/form with validation<br>• Spend Policy editor (per-tx cap, daily cap, allowed counterparties, active toggle)<br>• Policy evaluation logic that marks a payment "blocked" with the violated rule<br>• Full Transaction Ledger page with filtering by agent/status<br>• Marketplace page + listing cards + "purchase" action wired into the ledger<br>• Passkey/Smart Account mock connect flow + connected-state badge<br>• Network switch (Testnet/Mainnet) scoping visible agents<br>• Empty, loading, and error states for every list/detail view<br>• Toast/inline notification system for action feedback |
| **Exit Criteria** | Every acceptance criterion in PRD §4 (Core Features) is demonstrable in the UI using mock data; navigating with no agents, slow-mocked data, and forced-error mocks each shows a defined state instead of a blank screen. |
| **Complexity** | High |

## Phase 3 — Production Hardening

| | |
|---|---|
| **Objective** | Bring the scaffold up to a shippable quality bar: validated inputs, tested logic, observable errors, and a real deploy path. |
| **Deliverables** | • Zod schemas for every form (create agent, policy editor) with inline error messages<br>• Global error boundary + per-route error/not-found pages<br>• Lightweight client-side logging/telemetry stub (`lib/observability/logger.ts`) for action and error events<br>• Unit tests for policy evaluation, transaction filtering, and service layer (Vitest + React Testing Library)<br>• Performance pass: memoized list rendering, dynamic import of heavy chart component, image/font optimization via Next.js defaults<br>• Finalized CI pipeline (lint, typecheck, test, build all gating merges)<br>• Deployment config for a static-friendly host (`vercel.json` and/or Dockerfile) with documented env vars<br>• Security headers config (CSP, frame-options) in `next.config.ts`<br>• Mock single-session auth gate around the dashboard (guards routes; not a real auth system, per PRD Non-Goals) |
| **Exit Criteria** | `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` are all defined and would pass once dependencies are installed; every form rejects invalid input with a visible message; no console errors are thrown by mocked failure states. |
| **Complexity** | High |

---

## Phase 4 — Beyond the PRD

| | |
|---|---|
| **Objective** | Layer operator-quality-of-life features on top of the feature-complete Phase 2/3 dashboard, without expanding the PRD's non-goals. |
| **Deliverables** | • App-wide toast notification system for action feedback<br>• Agent pause/resume status control<br>• CSV export, pagination, and a detail modal for the transaction ledger<br>• Search/filter controls on the agent dashboard and marketplace<br>• Spend policy templates (conservative/standard/permissive)<br>• Marketplace listing creation flow<br>• Analytics route with ledger-wide totals and a settled-spend-by-agent chart<br>• "Reset demo data" control in Settings<br>• `c` keyboard shortcut to open Create Agent |
| **Exit Criteria** | Every addition reuses the existing mock service boundary and component conventions; `npm run lint`, `npm run typecheck`, and `npm run test` all pass. |
| **Complexity** | Medium |

## Summary Timeline

| Phase | Name | Objective (short) | Complexity | Primary Output |
|---|---|---|---|---|
| 0 | Scaffold | Project skeleton, configs, CI shell | Low | Buildable empty app |
| 1 | Core Loop | One agent paying another, end-to-end | Medium | Working proof of concept |
| 2 | Feature Complete | All PRD core features + edge states | High | Feature-complete mock dashboard |
| 3 | Production Hardening | Validation, tests, observability, deploy | High | Shippable, reviewable scaffold |
| 4 | Beyond the PRD | Operator quality-of-life features | Medium | Richer mock dashboard |
