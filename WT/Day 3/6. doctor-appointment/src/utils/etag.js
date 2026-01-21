import { httpError } from './httpErrors.js';

export function buildEtag({ prefix, id, updatedAt }) {
  const ts = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  return `"${prefix}-${id}-${ts}"`;
}

export function handleIfNoneMatch(req, res, currentEtag) {
  const inm = req.header('If-None-Match');
  if (!inm) return false;

  // Handle single ETag or a comma-separated list (weak/strong treated the same here)
  const candidates = inm
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (candidates.includes('*') || candidates.includes(currentEtag)) {
    res.status(304);
    // 304 responses must not include a body
    res.end();
    return true;
  }

  return false;
}

export function requireIfMatch(req, currentEtag) {
  const ifMatch = req.header('If-Match');

  // Missing If-Match => 428 Precondition Required
  if (!ifMatch) {
    throw httpError(428, 'Missing If-Match header');
  }

  const candidates = ifMatch
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // "*" means "match anything that exists"
  if (candidates.includes('*')) return;

  // Stale/mismatch => 412 Precondition Failed
  if (!candidates.includes(currentEtag)) {
    throw httpError(412, 'ETag mismatch');
  }
}
