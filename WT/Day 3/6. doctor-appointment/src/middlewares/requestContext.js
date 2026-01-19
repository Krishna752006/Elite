import crypto from 'crypto';

export function requestContext() {
  return (req, res, next) => {
    const incoming = req.header('X-Request-Id');
    const requestId = incoming && String(incoming).trim() ? String(incoming).trim() : crypto.randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    next();
  };
}
