function makeId(prefix) {
  const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${value}`
}

function createAttempt(status, idempotencyKey, extra = {}) {
  return {
    status,
    attemptId: makeId("pay-attempt"),
    idempotencyKey: idempotencyKey ?? makeId("payment-key"),
    timestamp: new Date().toISOString(),
    ...extra,
  }
}

export async function payWithCard(order, { forceOutcome = "success", idempotencyKey } = {}) {
  // Production: POST the order and idempotency key to the selected provider through your backend.
  // Verify provider webhook signatures on the backend; never trust a browser-supplied payment result.
  void order
  await new Promise((resolve) => setTimeout(resolve, 900))

  const outcomeStatus = {
    success: "Paid",
    failure: "Failed",
    cancel: "Cancelled",
  }[forceOutcome] ?? "Failed"

  return createAttempt(outcomeStatus, idempotencyKey, {
    reason: outcomeStatus === "Failed" ? "The simulated card payment was declined." : undefined,
  })
}

export async function payWithCash(order, { idempotencyKey } = {}) {
  // Production: create a pending cash-on-delivery payment through the order API.
  // Verify any later payment status changes using signed backend webhooks.
  void order
  return createAttempt("Pending", idempotencyKey)
}

export async function payWithBankTransfer(order, { idempotencyKey } = {}) {
  // Production: fetch bank instructions from the backend and reconcile transfers server-side.
  // Verify bank/provider callbacks and webhook signatures on the backend.
  return createAttempt("Pending", idempotencyKey, {
    paymentDetails: {
      bankName: "Example Bank (placeholder)",
      iban: "GE00 0000 0000 0000 0000 00",
      beneficiary: "Nona's Cross-Stitches",
      memo: order.orderRef,
    },
  })
}

export const paymentProviders = {
  card: payWithCard,
  cash: payWithCash,
  "bank-transfer": payWithBankTransfer,
}

export function createIdempotencyKey() {
  return makeId("idempotency")
}
