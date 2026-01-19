// Simple simulation for testing.
// Control outcome with header: X-Mock-SMS: SENT | FAILED

export async function sendSms({ req, to, message }) {
  const desired = (req.header('X-Mock-SMS') || 'SENT').toUpperCase();
  if (desired === 'FAILED') {
    return {
      provider: 'mocksms',
      status: 'FAILED',
      reason: 'MOCK_FAILURE',
      messageId: `sms_fail_${Date.now()}`,
      to,
      message
    };
  }
  return {
    provider: 'mocksms',
    status: 'SENT',
    messageId: `sms_${Date.now()}`,
    to,
    message
  };
}
