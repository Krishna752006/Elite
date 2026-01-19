function base64UrlEncode(str) {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(token) {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  // pad
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64').toString('utf8');
}

export function encodeCursor({ createdAt, id }) {
  return base64UrlEncode(JSON.stringify({ createdAt: new Date(createdAt).toISOString(), id: String(id) }));
}

export function decodeCursor(token) {
  try {
    const obj = JSON.parse(base64UrlDecode(token));
    if (!obj.createdAt || !obj.id) return null;
    return { createdAt: new Date(obj.createdAt), id: obj.id };
  } catch {
    return null;
  }
}
