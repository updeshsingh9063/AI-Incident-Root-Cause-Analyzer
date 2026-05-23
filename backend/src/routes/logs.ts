import { Router, Request, Response } from 'express';

const router = Router();

const LOG_MESSAGES = [
  { level: 'error', service: 'payment-service', message: 'Connection pool exhausted: max connections (100) reached' },
  { level: 'error', service: 'payment-service', message: 'Query timeout after 8000ms: SELECT * FROM transactions' },
  { level: 'warn',  service: 'order-service',   message: 'Payment service unavailable, retrying (attempt 3/5)' },
  { level: 'error', service: 'auth-service',     message: 'Redis TIMEOUT: GET session:usr_a8f2 took 3200ms' },
  { level: 'info',  service: 'api-gateway',      message: 'Circuit breaker OPEN for payment-service: 35% error rate' },
  { level: 'warn',  service: 'fraud-detection',  message: 'ML inference latency degraded: avg 2100ms vs baseline 450ms' },
  { level: 'error', service: 'postgres-primary', message: 'FATAL: remaining connection slots reserved for superuser' },
];

router.get('/', (req: Request, res: Response) => {
  const { service, level, limit = 100, since } = req.query;
  const now = Date.now();

  let logs = Array.from({ length: Number(limit) }, (_, i) => {
    const template = LOG_MESSAGES[i % LOG_MESSAGES.length];
    return {
      id: `log-${now - i * 2000}`,
      timestamp: new Date(now - i * 2000).toISOString(),
      level: template.level,
      service: template.service,
      pod: `${template.service}-${Math.random().toString(36).slice(2, 10)}`,
      message: template.message,
      trace: Math.random() > 0.5 ? `trace-${Math.random().toString(36).slice(2, 10)}` : null,
      namespace: 'production',
      cluster: 'k8s-prod-us-east-1',
    };
  });

  if (service && service !== 'all') logs = logs.filter(l => l.service === service);
  if (level && level !== 'all') logs = logs.filter(l => l.level === level);

  res.json({ data: logs, total: logs.length });
});

router.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    const template = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    const log = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: template.level,
      service: template.service,
      message: template.message,
      trace: `trace-${Math.random().toString(36).slice(2, 10)}`,
    };
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  }, 2000);

  req.on('close', () => clearInterval(interval));
});

export default router;
