/** Pure coordination only: does not persist business facts, post or dispatch. */
export const operations = Object.freeze({
  'finance.balance.read': ['woia-financial-ledger', 'read'],
  'finance.statement.read': ['woia-financial-ledger', 'read'],
  'finance.opening-position.record': ['woia-financial-ledger', 'policy'],
  'finance.charge.create': ['woia-financial-ledger', 'policy'],
  'finance.charge.correct': ['woia-financial-ledger', 'policy-or-approval'],
  'finance.charge.adjust': ['woia-financial-ledger', 'approval'],
  'finance.journal.post': ['woia-financial-ledger', 'policy'],
  'finance.journal.compensate': ['woia-financial-ledger', 'policy-or-approval'],
  'finance.allocation.apply': ['woia-financial-ledger', 'policy'],
  'finance.allocation.reverse': ['woia-financial-ledger', 'policy-or-approval'],
  'payment.observe': ['woia-payments', 'read'],
  'payment.accept': ['woia-payments', 'policy'],
  'payment.reconcile': ['woia-payments', 'read'],
  'payment.reserve': ['woia-payments', 'policy'],
  'payment.execute': ['woia-payments', 'approval'],
  'payment.status.observe': ['woia-payments', 'read'],
  'payment.effect.reconcile': ['woia-payments', 'read'],
  'payment.release-reservation': ['woia-payments', 'policy']
});
const text = v => typeof v === 'string' && v.trim().length > 0;
const blocked = reason => ({result:'BLOCKED',reason,dispatch:false,financial_fact_created:false});

export function planFinancialWork(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return blocked('INVALID_INPUT');
  const route = Object.hasOwn(operations,input.operation) ? operations[input.operation] : null;
  if (!route) return blocked('UNSUPPORTED_OPERATION');
  for (const key of ['organization','task','actor','target','purpose','operation_key','source_map_revision','source_reference']) {
    if (!text(input[key])) return blocked('MISSING_'+key.toUpperCase());
  }
  if (input.department !== 'finance') return blocked('DEPARTMENT_MISMATCH');
  if (input.source_state !== 'CURRENT_ACCEPTED') return blocked('SOURCE_UNKNOWN_STALE_OR_CONFLICT');
  if (input.authority_state !== 'CURRENT_SCOPED') return blocked('AUTHORITY_UNRESOLVED');
  const grant = input.grant;
  if (!grant || !text(grant.reference) || grant.current !== true || grant.revoked !== false || !text(grant.power_evidence_reference)) return blocked('EXACT_CURRENT_GRANT_REQUIRED');
  for (const key of ['organization','actor','task','operation','target','purpose','source_map_revision']) {
    if (grant[key] !== input[key]) return blocked('GRANT_SCOPE_MISMATCH');
  }
  if (input.effect_state === 'UNKNOWN' && !['payment.effect.reconcile','payment.status.observe','payment.reconcile'].includes(input.operation)) {
    return {...blocked('RECONCILE_BEFORE_RETRY'),retain_reservation:true};
  }
  if (input.effect_state === 'PARTIAL' && input.operation === 'payment.execute') return {...blocked('PARTIAL_REQUIRES_RECONCILIATION'),retain_reservation:true};
  if (input.effect_state === 'CONFIRMED' && input.operation === 'payment.execute') return blocked('ALREADY_CONFIRMED');
  if (input.effect_state && !['NONE','UNKNOWN','PARTIAL','CONFIRMED'].includes(input.effect_state)) return blocked('INVALID_EFFECT_STATE');
  if (input.hold !== false || input.revoked !== false) return blocked('HOLD_OR_REVOCATION_UNRESOLVED');
  if (route[1] !== 'read') {
    if (!text(input.policy_reference) || !text(input.expected_revision) || !text(input.payload_digest)) return blocked('MISSING_POLICY_REVISION_OR_PAYLOAD');
    if (!input.money || !text(input.money.amount_minor) || !/^-?\d+$/.test(input.money.amount_minor) || !text(input.money.currency) || !text(input.money.beneficiary) || !text(input.money.custody) || !text(input.money.purpose)) return blocked('EXACT_MONEY_SCOPE_REQUIRED');
    if (input.one_writer !== true) return blocked('WRITER_UNRESOLVED');
    const requiresApproval = route[1] === 'approval' || (route[1] === 'policy-or-approval' && input.policy_permits_without_approval !== true);
    if (requiresApproval) {
      const a = input.approval;
      if (!a || !text(a.reference) || !text(a.principal) || a.principal === input.actor || a.competent !== true || !text(a.power_evidence_reference) || a.organization !== input.organization || a.task !== input.task || a.purpose !== input.purpose || a.current !== true || a.revoked !== false || a.payload_digest !== input.payload_digest || a.target !== input.target || a.policy_reference !== input.policy_reference || a.operation !== input.operation || JSON.stringify(a.money) !== JSON.stringify(input.money)) return blocked('COMPETENT_EXACT_APPROVAL_REQUIRED');
    }
    if (input.operation === 'payment.execute' && (!text(input.reservation_reference) || !text(input.money.account) || input.funds_state !== 'ELIGIBLE_RECONCILED')) return blocked('ELIGIBLE_RESERVED_FUNDS_REQUIRED');
    if (input.operation === 'payment.accept' && !['provider-confirmed','competent-human-confirmed','direct-to-beneficiary'].includes(input.acceptance_mode)) return blocked('ACCEPTANCE_MODE_REQUIRED');
    if (input.operation === 'payment.accept' && input.acceptance_mode === 'competent-human-confirmed' && (!text(input.confirmation_reference) || input.confirming_principal_authorized !== true)) return blocked('COMPETENT_CONFIRMATION_REQUIRED');
    if (input.operation === 'payment.release-reservation' && input.effect_state !== 'NONE') return blocked('UNRESOLVED_OUTBOUND_RESERVATION_RETAINED');
  }
  return {result:'PROPOSAL_ONLY',provider:route[0],operation:input.operation,required_control:route[1],task:input.task,operation_key:input.operation_key,dispatch:false,financial_fact_created:false,provider_revalidation_required:true};
}

export function planExternalDelivery(input) {
  if (!input || input.content_state !== 'ACCEPTED_VERSION' || !text(input.document_reference) || !text(input.source_version) || !text(input.task) || !text(input.recipient_reference) || !text(input.purpose)) return blocked('ACCEPTED_SOURCED_DELIVERY_REQUIRED');
  return {result:'CROSS_DEPARTMENT_REQUEST_PROPOSAL',receiver:'customer-service',task:input.task,document_reference:input.document_reference,source_version:input.source_version,recipient_reference:input.recipient_reference,purpose:input.purpose,dispatch:false,payout_proven:false,receiver_authority_inherited:false};
}
