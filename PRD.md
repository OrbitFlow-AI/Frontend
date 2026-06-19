# OrbitFlow — AI Agent Treasury & Micropayment Router

**Product Requirements Document**
**Status:** Draft v1.0
**Scope:** Frontend only (web dashboard). No smart contract, backend, or custody implementation is in scope for this repo.

---

## 1. Problem Statement

Autonomous AI agents increasingly need to transact with each other — paying for API access, datasets, model inference, or compute time — without a human approving every transfer. Today, that requires either:

- A human manually signing a web3 wallet popup for every machine-to-machine transaction (breaks autonomy, doesn't scale), or
- Agents holding raw private keys with no spending limits, no audit trail, and no programmatic guardrails (unacceptable security posture).

Stellar's low fees, fast finality, and Soroban smart contracts make it a credible settlement layer for agent-to-agent micropayments, and the Smart Account Kit (passkey-based smart wallets) removes the need for agents to manage raw keys. What's missing is a **control surface**: a place where a human operator can allocate a budget to an agent, define the conditions under which that agent is allowed to pay (or be paid), and observe the resulting flow of value in real time.

OrbitFlow is that control surface. It is the dashboard a developer or operator uses to provision agent treasuries, set spend policies, and monitor the micropayment activity that happens automatically between agents thereafter.

## 2. Target Users

| User | Context | What they need from OrbitFlow |
|---|---|---|
| **AI/Web3 developer** building a multi-agent system | Comfortable with React/Stellar tooling; wants to wire agents to real budgets quickly | Fast way to provision an agent treasury, define a policy, and see a working payment flow without writing settlement logic by hand |
| **Agent operator / fleet manager** | Runs several agents in production (e.g., a swarm of data-fetching or trading agents); not necessarily a smart-contract engineer | A dashboard to monitor balances, top up treasuries, catch policy violations, and shut off a misbehaving agent fast |
| **Marketplace participant** | An agent (or its operator) that sells a capability (API access, dataset, compute) to other agents | A way to list a priced service and see incoming payments and call volume |
| **Security/compliance reviewer** | Audits how autonomous spending is bounded | A legible, exportable record of every policy and every transaction tied to it |

All target users are assumed to already have basic familiarity with Stellar/Soroban concepts (accounts, stablecoins, testnet vs. mainnet). OrbitFlow does not need to teach blockchain fundamentals.

## 3. Goals and Non-Goals

### Goals

- Provide a single dashboard to **create and visualize AI agent treasuries** (balance, allocated budget, network).
- Let operators define **spend policies** (conditions) that govern automated path-payments: per-call cap, daily cap, allowed counterparties, allowed service categories.
- Provide a **marketplace view** where agents advertise services and pricing, so other agents have something to pay for.
- Surface a **real-time transaction ledger** of micropayments between agents, with status and the policy that authorized (or blocked) each one.
- Provide a **wallet/passkey connection UI** that models how a human operator links a Smart Account Kit passkey credential to an agent treasury — as a UI flow, against a stubbed service boundary.
- Ship a UI that is **honest about being a frontend**: every place a real Soroban contract call or Smart Account Kit call would occur is isolated behind a clearly named mock service interface, so a backend/contracts team can swap in the real implementation without touching components.

### Non-Goals (explicit out of scope for this repo)

- Writing, deploying, or testing any Soroban smart contract.
- Real custody of funds, real key management, or real signing of transactions.
- Real integration with Stellar's Smart Account Kit SDK (it is mocked behind an interface, not called).
- A production backend, database, or persistence layer (state is in-memory / mock data for this phase).
- Mobile native apps (responsive web only).
- Multi-tenant auth / user account system beyond a single mocked session.
- Actual LLM/agent runtime orchestration (OrbitFlow visualizes and configures agent treasuries; it does not host or run the agents themselves).

## 4. Core Features

| # | Feature | Description | Acceptance Criterion |
|---|---|---|---|
| 1 | **Agent Treasury Dashboard** | List of all provisioned agents with balance, allocated budget, network (testnet/mainnet), and status (active/paused/over-limit) | Given at least one agent exists, the dashboard renders its name, balance, budget, and status without a page error |
| 2 | **Create Agent** | Form/modal to provision a new agent: name, initial budget, stablecoin asset, network | Submitting valid input adds a new agent to the list with the entered values and a default "active" status |
| 3 | **Agent Detail View** | Per-agent page showing balance history, current policies, and recent transactions | Navigating to an agent's detail page shows that agent's own transactions only, not another agent's |
| 4 | **Spend Policy Editor** | UI to define/edit conditions: max per-transaction amount, daily cap, allowed recipient list or category, active/inactive toggle | Saving a policy persists it to the agent's policy list in app state and is reflected immediately in the UI |
| 5 | **Micropayment Transaction Ledger** | Chronological, filterable feed of all payments between agents, each showing sender, recipient, amount, asset, status (settled/blocked/pending), and the policy rule applied | Filtering the ledger by agent or status returns only matching rows |
| 6 | **Policy Violation / Block Indicator** | When a simulated payment would violate an agent's policy, the ledger and agent detail view show it as "blocked" with the specific rule that triggered it | A transaction generated against a policy limit (e.g., exceeds per-call cap) appears with status "blocked" and names the violated rule |
| 7 | **Marketplace** | Listing of services agents offer (name, category, price per call, provider agent) that a buyer agent can "purchase" to generate a simulated payment | Initiating a purchase from the marketplace creates a corresponding entry in the transaction ledger |
| 8 | **Passkey / Smart Account Connect UI** | A modeled connection flow for linking a Smart Account Kit passkey credential to an agent treasury, calling a stub service rather than a real SDK | Completing the mock connect flow updates the agent's "wallet connected" status in the UI |
| 9 | **Network/Environment Switch** | Toggle between Testnet and Mainnet context, scoping displayed agents/data to the selected network | Switching networks changes the agent list shown without a full page reload error |
| 10 | **Empty/Loading/Error States** | Every list/detail view has defined empty, loading, and error states | Each of the above features renders a defined state (not a blank screen) when its data source is empty, loading, or mocked to fail |

## 5. Technical Constraints

- **Scope:** Frontend application only — no backend service, no smart contract code, no real blockchain calls.
- **Framework:** Next.js (App Router) with TypeScript.
- **Styling:** Tailwind CSS; no external component library dependency — hand-built primitives kept in `components/ui`.
- **State:** In-memory mock data + React Context/hooks. No external state-management library required at this scale.
- **Data layer:** All "blockchain" and "Smart Account Kit" interactions go through a service interface (`lib/services/*`) with a mock implementation. This boundary is the seam where real Soroban/Smart Account Kit SDK calls would be substituted later — that substitution is explicitly out of scope here.
- **Validation:** Schema validation on all forms (policy editor, create-agent) via a lightweight schema library.
- **Testing:** Component/unit tests for core logic (policy evaluation, transaction filtering) using a standard React test setup.
- **CI:** Lint + typecheck + test on every push, via GitHub Actions, no deployment credentials required.
- **No dependency installation or build execution is performed as part of delivering this scaffold** — `package.json` declares the intended dependency set; installing and running them is left to the consuming environment.
- **Browser support:** Modern evergreen browsers only (no IE11/legacy polyfills).

## 6. Open Questions

| # | Question | Why it matters |
|---|---|---|
| 1 | Which stablecoin(s) does OrbitFlow assume by default — USDC on Stellar only, or multi-asset? | Affects whether the UI needs an asset selector everywhere or can hardcode one asset for v1 |
| 2 | Will the real backend (when built) expose a REST or a Soroban-RPC-shaped API? | Determines what the mock service interface's method signatures should anticipate to minimize future rework |
| 3 | Is "policy" evaluation expected to ever run client-side against real contract state, or is it always server/contract-enforced and the UI only visualizes the outcome? | Determines whether the policy-evaluation logic built here is illustrative only or meant to be reused as real validation logic |
| 4 | Does the target repo need to support multiple human operators (auth) in a near-term follow-up, or is single-session mock auth acceptable indefinitely? | Affects whether auth scaffolding should be stubbed now even though it's a Non-Goal for this phase |
| 5 | What is the actual shape of a Smart Account Kit passkey credential object once the real SDK is integrated? | The mock connect UI is built against an assumed shape; confirming this early avoids rework when wiring the real SDK |
