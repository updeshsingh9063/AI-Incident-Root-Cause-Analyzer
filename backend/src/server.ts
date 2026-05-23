import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import incidentsRouter from './routes/incidents';
import metricsRouter from './routes/metrics';
import logsRouter from './routes/logs';
import aiRouter from './routes/ai';
import integrationsRouter from './routes/integrations';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { setupWebSocketHandlers } from './websocket/handlers';
import { connectDB } from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// ─── Socket.IO (Real-time) ─────────────────────────────────────────────────
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

setupWebSocketHandlers(io);

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: true, // Allow any origin for development
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Prometheus Metrics ─────────────────────────────────────────────────────
app.get('/metrics', (_, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  let prometheusMetrics = '';
  prometheusMetrics += `# HELP node_process_uptime_seconds Uptime of the Node.js process\n`;
  prometheusMetrics += `# TYPE node_process_uptime_seconds gauge\n`;
  prometheusMetrics += `node_process_uptime_seconds ${uptime}\n\n`;

  prometheusMetrics += `# HELP node_memory_rss_bytes Resident Set Size memory usage\n`;
  prometheusMetrics += `# TYPE node_memory_rss_bytes gauge\n`;
  prometheusMetrics += `node_memory_rss_bytes ${memoryUsage.rss}\n\n`;

  prometheusMetrics += `# HELP node_memory_heap_used_bytes Heap memory used\n`;
  prometheusMetrics += `# TYPE node_memory_heap_used_bytes gauge\n`;
  prometheusMetrics += `node_memory_heap_used_bytes ${memoryUsage.heapUsed}\n\n`;

  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(prometheusMetrics);
});

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1/incidents', authMiddleware, incidentsRouter);
app.use('/api/v1/metrics', authMiddleware, metricsRouter);
app.use('/api/v1/logs', authMiddleware, logsRouter);
app.use('/api/v1/ai', authMiddleware, aiRouter);
app.use('/api/v1/integrations', authMiddleware, integrationsRouter);

// ─── Error Handler ─────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '8080', 10);
httpServer.listen(PORT, () => {
  logger.info(`🚀 AI Incident Backend running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, io };
