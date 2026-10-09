---
name: woia-finance
description: Coordinate sourced obligations, accepted movements, eligible allocations, external formal settlements and separately approved disbursements through governed providers.
license: MIT
---

# Finance coordination

Requires Core >=0.5.6. One root per organization/department/Project context. Generic method, no Real Estate delta. Never create a second ledger, private work engine or model-generated monetary truth.

## Five stages

1. Recover accepted sources, rules and starting position. Resolve organization, Task, scope, period, currency, custody/beneficiary and current Source Authority Map writer/freshness/conflict owner. Preserve external-observed vs WOIA-owned scope and reconciled opening positions, never fabricated historic cash. Data governs sources when needed, not every read.
2. Coordinate receivables/payables using Ledger. Charges follow accepted rules with stable business identity. Factual correction differs from approved non-error ChargeAdjustment. Quotes, invoice, work acceptance, liability and payment remain distinct. Do not invent fees, policy, accounts, rounding or monetary authority.
3. Confirm movements through Payments and allocate eligible credit through Ledger. Observation/Evidence is not Payment; Allocation creates no cash. Provider-confirmed, competent-human-confirmed and direct-to-beneficiary acceptance follow the actual source contract. Preserve partial/unapplied/reversed funds, holds, custody and single writer. Direct beneficiary payment invents no agency custody/payout.
4. Coordinate source-authoritative settlements and separately authorized disbursements. The external formal system computes the initial settlement; preserve original Document/version and attributed extraction, with required competent source acceptance. Request Customer Service delivery. Delivery is not payout. Payout requires current exact approval, reconciled eligible funds and reservation, independently rechecked by Payments. Never calculate or issue a competing formal settlement.
5. Own exceptions and durable continuation through Core Tasks/Due Work. UNKNOWN retains reservation and reconciles before retry; partial consumes only confirmed amount. Preserve compensating records and issued history. Task/contract closure, restore or journal reversal does not undo external effects. Explain provider-derived balances without recomputing a master.

## Guards and handoffs

Read [coordination contract](references/finance-contract.md) before planning consequential work. `scripts/plan-financial-work.mjs` is pure and returns proposal-only results, no posting/dispatch/persistence. It is not proof of effective authority; providers resolve current actor, target, policy/source revisions, exact approval, aggregate limits and concurrency at their operation boundary.

Finance owns financial content. Customer Service alone executes external-person contact and scheduling; embedded notifications cannot bypass Communications/Customer Service. Internal staff contact requires authenticated membership, scope and purpose. Use Core correlated receiver-owned requests for distinct contributions without inherited authority or a human courier. Missing transport is an owned blocker. Direct shared-data access does not need a root handoff.

Negotiation/Offers, exceptional waiver/concession, grants and exceptional beneficiary substitution remain competent human decisions. Exact policy-governed recurring obligations/payment acceptance must not be denied by invented blanket human gates. Finance never posts/executes inside this root.

## Evidence

Report source versions, stable operation/Effect identity, confirmed outcome, unresolved scope and owner/next action. Domain schemas/evals belong to shared Domain Contracts, not copied here. Local synthetic tests establish coordination guard behavior only; real provider persistence/atomicity, transport/adapters, organization configuration, Operator E2E and Production Ready remain later qualification.
