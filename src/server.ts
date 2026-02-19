import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// ─── Security Middleware ─────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Ensure DB connection before every request ───────────
app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api', routes);

// ─── Root Endpoint ───────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Action Auto CRM API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/health',
  });
});

// ─── Error Handling ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Server Startup ──────────────────────────────────────
app.listen(env.PORT, () => {
  console.log('\n═══════════════════════════════════════════');
  console.log('  Action Auto CRM — API Server');
  console.log('═══════════════════════════════════════════');
  console.log(`  Environment : ${env.NODE_ENV}`);
  console.log(`  Port        : ${env.PORT}`);
  console.log(`  API URL     : http://localhost:${env.PORT}/api`);
  console.log(`  CORS Origin : ${env.CORS_ORIGIN}`);
  console.log('═══════════════════════════════════════════\n');
});

export default app;