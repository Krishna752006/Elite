// Simple simulation for testing.
// Control outcome with header: X-Mock-Payment: SUCCESS | FAILED

export async function chargePayment({ req, amount, currency = 'INR' }) {
  const desired = (req.header('X-Mock-Payment') || 'SUCCESS').toUpperCase();
  if (desired === 'FAILED') {
    return {
      provider: 'mockpay',
      status: 'FAILED',
      reason: 'MOCK_FAILURE',
      transactionId: `txn_fail_${Date.now()}`,
      amount,
      currency
    };
  }

  return {
    provider: 'mockpay',
    status: 'SUCCESS',
    transactionId: `txn_${Date.now()}`,
    amount,
    currency
  };
}
