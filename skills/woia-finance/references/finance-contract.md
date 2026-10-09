# Finance coordination contract

Canonical source: WOIA Real Estate b716f1d1c0e2bc5ecf946043b337a2ddba4285f0; ADR-0016 and docs/21,22,24,25. Five stages: accepted sources/opening; obligations; accepted movements/allocations; external formal settlement/separate disbursement; exceptions/continuity. B6 permits implementation without conferring operational financial powers.

Core >=0.5.6 owns work/authority/Effects. Ledger owns Charges, ChargeAdjustment, journal, Allocation and balances; Payments owns observation, acceptance, reservation, execution and reconciliation. Documents owns immutable artifacts. Domain settlement provider is context-selected, not a generic hard dependency. Actual policy, accounts, grants, amount/currency/fees, beneficiary/custody/purpose and source contract remain organization configuration.

The helper accepts references resolved independently by the caller and returns PROPOSAL_ONLY. It does not authenticate the caller or execute provider effects. Required provider revalidation: actor/department/capability/effect/principal, source freshness/conflict/writer, scope/target/counterparty, money/fees/aggregate limits, exact payload-bound competent approval, policy/revisions/validity/revocation/holds, concurrency/fencing/idempotency. Installing/accessing a capability, a wake, Task or accepted request grants none of this authority. Unknown input fails closed; an admitted proposal still requires provider enforcement.

UNKNOWN payout retains reservation; reconcile same operation before retry. Partial retains explicit remainder. Correction differs from non-error adjustment; original Charge remains immutable. Allocation does not create cash, cross-owner funds cannot cover shortfalls, source authority is not payment power. External settlement acceptance preserves original/source/version and required competent approval; delivery via Customer Service proves no payout. No universal backend, bank, account, policy or legal rule is chosen.

These tests prove local planning guards, not qualified financial runtime, current configuration, fresh G6/G7 or Operator E2E. Transport and physical provider persistence/atomicity remain qualified separately.

## Resolved authority inputs

The helper requires a current, nonrevoked grant reference and power-evidence reference with exact organization/actor/Task/operation/target/purpose/source-map revision. Currentness is an explicit trusted attestation from the current Core/policy resolver, not an inference by this helper. Exact approval additionally requires competent current power evidence and org/Task/purpose match. These supplied references must be resolved independently; callers cannot treat a constructed fixture as authenticated authority. Providers still enforce exact current policies at dispatch.
