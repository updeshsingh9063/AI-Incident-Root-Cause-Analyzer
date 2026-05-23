import { Server } from 'socket.io';
import { logger } from '../utils/logger';

export function setupWebSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    logger.info(`WebSocket connected: ${socket.id}`);

    // Join incident room
    socket.on('join:incident', (incidentId: string) => {
      socket.join(`incident:${incidentId}`);
      logger.info(`Socket ${socket.id} joined incident:${incidentId}`);
    });

    // Leave incident room
    socket.on('leave:incident', (incidentId: string) => {
      socket.leave(`incident:${incidentId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${socket.id}`);
    });
  });

  // Broadcast live metrics every 5s
  setInterval(() => {
    const metrics = {
      cpu: 45 + Math.random() * 30,
      memory: 62 + Math.random() * 20,
      errorRate: Math.random() > 0.7 ? 15 + Math.random() * 20 : 0.5 + Math.random() * 2,
      requestsPerSec: 8500 + Math.random() * 2000,
      timestamp: new Date().toISOString(),
    };
    io.emit('metrics:update', metrics);
  }, 5000);

  // Broadcast live logs every 2s
  const LOG_TEMPLATES = [
    { level: 'error', service: 'payment-service', message: 'DB connection pool: 99/100 connections active' },
    { level: 'warn',  service: 'order-service',   message: 'High retry rate detected: 47 retries in last 30s' },
    { level: 'info',  service: 'api-gateway',      message: 'Request rate: 8,742 req/s — within normal bounds' },
    { level: 'error', service: 'auth-service',     message: 'Redis cache MISS rate elevated: 77% (baseline: 8%)' },
  ];

  setInterval(() => {
    const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
    const log = {
      id: Date.now(),
      timestamp: new Date(),
      ...template,
      pod: `${template.service}-${Math.random().toString(36).slice(2, 10)}`,
      trace: `trace-${Math.random().toString(36).slice(2, 12)}`,
    };
    io.emit('log:new', log);
  }, 2000);

  // Broadcast incident updates
  setInterval(() => {
    const update = {
      type: 'incident:update',
      incidentId: 'INC-2847',
      aiConfidence: 94 + Math.floor(Math.random() * 3),
      status: 'investigating',
      timestamp: new Date().toISOString(),
    };
    io.emit('incident:update', update);
  }, 10000);
}
