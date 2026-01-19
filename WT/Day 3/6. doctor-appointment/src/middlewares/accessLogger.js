export function accessLogger() {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - start;
      const entry = {
        ts: new Date().toISOString(),
        level: 'info',
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        ip: req.ip
      };
      // Structured log line (easy to grep / parse)
      console.log(JSON.stringify(entry));
    });

    next();
  };
}
