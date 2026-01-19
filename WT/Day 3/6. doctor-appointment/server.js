import express from 'express';
import mongoose from 'mongoose';

import { env } from './src/config/env.js';
import { requestContext } from './src/middlewares/requestContext.js';
import { accessLogger } from './src/middlewares/accessLogger.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

import { doctorsRouter } from './src/routes/doctors.js';
import { appointmentsRouter } from './src/routes/appointments.js';
import { auditRouter } from './src/routes/audit.js';
import { testRouter } from './src/routes/test.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

// Let browser-based clients read the ETag header.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers', 'ETag, X-Request-Id, Idempotent-Replay');
  next();
});

// Logging foundation (request correlation + access log)
app.use(requestContext());
app.use(accessLogger());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'doctor-appointment-booking' });
});

app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/audit', auditRouter);

if (env.ENABLE_TEST_ROUTES) {
  app.use('/test', testRouter);
}

// Error handler MUST be last
app.use(errorHandler);

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`[boot] connected to MongoDB`);

  app.listen(env.PORT, () => {
    console.log(`[boot] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('[boot] failed to start', err);
  process.exit(1);
});
