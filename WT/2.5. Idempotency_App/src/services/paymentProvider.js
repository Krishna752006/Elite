const state = { failureRate: 0, minDelayMs: 50, maxDelayMs: 150 };

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function charge({ orderId, amount, currency }) {
  const delay = Math.floor(Math.random() * (state.maxDelayMs - state.minDelayMs + 1)) + state.minDelayMs;
  await sleep(delay);

  if (Math.random() < state.failureRate) {
    const err = new Error("Payment provider failure");
    err.code = "PAYMENT_PROVIDER_DOWN";
    throw err;
  }

  return {
    provider: "MockPay",
    paymentId: `pay_${orderId}_${Date.now()}`,
    amount,
    currency,
    chargedAt: new Date().toISOString()
  };
}

function setBehavior(b) { Object.assign(state, b); }
function getBehavior() { return state; }

module.exports = { charge, setBehavior, getBehavior };