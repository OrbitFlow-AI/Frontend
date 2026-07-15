# OrbitFlow — AI Agent Treasury & Micropayment Router

Frontend dashboard for provisioning AI agent treasuries, defining automated spend policies,
and monitoring micropayments between agents on Stellar. See [PRD.md](./PRD.md) for product
scope and [ROADMAP.md](./ROADMAP.md) for the phased build plan.

**This repository is frontend-only.** There is no smart contract, backend, or real wallet
integration here. Every place a real Soroban contract call or Stellar Smart Account Kit call
would occur is isolated behind a mock service interface in `lib/services/`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Zod for form validation
- Vitest + React Testing Library for unit tests

## Getting Started

This scaffold declares its dependencies in `package.json` but does not install them as part
of delivery. To run it locally:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check, no emit |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |

## Project Structure

```
app/                Next.js App Router routes
components/          Shared UI building blocks
  ui/                Hand-built primitives (button, card, badge, toast, stat card, ...)
lib/
  services/          Mock data services — the seam for future real integrations
  observability/      Lightweight client-side logging
  analytics/          Pure ledger/spend aggregation helpers
  utils/              Pure helper functions
types/               Shared domain types (Agent, Transaction, Policy, ...)
tests/               Unit tests
```

## Beyond the PRD

A few extras were added on top of the PRD's core feature set:

- **Toast notifications** for payments, policy saves, wallet connects, agent creation, and
  marketplace purchases.
- **Pause/resume** control on agent treasuries.
- **CSV export** of the transaction ledger, plus pagination and a per-transaction detail modal.
- **Search and filtering** on the agent dashboard and marketplace.
- **Spend policy templates** (conservative/standard/permissive presets).
- **Marketplace listing creation** so an agent can advertise a new service.
- **Analytics page** (`/dashboard/analytics`) with ledger-wide totals and a settled-spend-by-agent
  chart.
- **Reset demo data** control in Settings, to restore the seeded mock state.
- A `c` keyboard shortcut opens the Create Agent modal from the dashboard.
