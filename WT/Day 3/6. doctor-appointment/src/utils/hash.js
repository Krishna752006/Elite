import crypto from 'crypto';

export function sha256Json(obj) {
  const json = JSON.stringify(obj);
  return crypto.createHash('sha256').update(json).digest('hex');
}
