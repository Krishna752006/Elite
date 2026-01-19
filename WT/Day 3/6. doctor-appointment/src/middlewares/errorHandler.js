export function errorHandler(err, req, res, next) {
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

  const entry = {
    ts: new Date().toISOString(),
    level: status >= 500 ? 'error' : 'warn',
    requestId: req.requestId,
    message: err.message || 'Unknown error',
    status,
    stack: status >= 500 ? err.stack : undefined
  };
  console.error(JSON.stringify(entry));

  res.status(status).json({
    error: {
      message: err.message || 'Something went wrong',
      requestId: req.requestId
    }
  });
}
