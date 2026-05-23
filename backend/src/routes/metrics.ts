import { Router, Request, Response } from 'express';

const router = Router();

// Simulated real-time metrics
function generateMetrics() {
  const now = Date.now();
  return {
    cpu: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (30 - i) * 60000).toISOString(),
      value: Math.max(10, 45 + Math.sin(i * 0.5) * 20 + Math.random() * 15),
      threshold: 80,
    })),
    memory: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (30 - i) * 60000).toISOString(),
      value: Math.max(10, 62 + Math.sin(i * 0.3) * 15 + Math.random() * 10),
      threshold: 85,
    })),
    latency: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (30 - i) * 60000).toISOString(),
      p50: 45 + Math.random() * 20,
      p95: 120 + Math.random() * 80,
      p99: 280 + (i > 20 ? (i - 20) * 40 : 0) + Math.random() * 100,
    })),
    errorRate: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (30 - i) * 60000).toISOString(),
      value: i > 22 ? 15 + (i - 22) * 3 + Math.random() * 5 : 0.5 + Math.random() * 1.5,
    })),
    requests: Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (30 - i) * 60000).toISOString(),
      value: 8500 + Math.sin(i * 0.4) * 2000 + Math.random() * 1000,
    })),
  };
}

// GET /metrics — full metrics bundle
router.get('/', (_: Request, res: Response) => {
  res.json({ data: generateMetrics(), timestamp: new Date().toISOString() });
});

// GET /metrics/services — per-service metrics
router.get('/services', (_: Request, res: Response) => {
  const services = [
    { id: 'api-gateway', name: 'API Gateway', status: 'degraded', health: 67, requests: 12450, errors: 4.2, latency: 234 },
    { id: 'payment-service', name: 'Payment Service', status: 'critical', health: 23, requests: 3820, errors: 34.1, latency: 8240 },
    { id: 'auth-service', name: 'Auth Service', status: 'degraded', health: 71, requests: 9120, errors: 12.3, latency: 456 },
    { id: 'order-service', name: 'Order Service', status: 'degraded', health: 58, requests: 2340, errors: 18.7, latency: 1890 },
    { id: 'user-service', name: 'User Service', status: 'healthy', health: 98, requests: 6780, errors: 0.1, latency: 45 },
  ];
  res.json({ data: services });
});

// GET /metrics/correlation — AI correlation data
router.get('/correlation', (_: Request, res: Response) => {
  res.json({
    data: [
      { metric1: 'DB Latency', metric2: 'P99 Response Time', correlation: 0.97, type: 'positive', significance: 'critical' },
      { metric1: 'CPU Usage', metric2: 'Error Rate', correlation: 0.84, type: 'positive', significance: 'high' },
      { metric1: 'Deployment v2.3.1', metric2: 'Error Rate', correlation: 0.99, type: 'causal', significance: 'critical' },
      { metric1: 'Redis Memory', metric2: 'Auth Latency', correlation: 0.76, type: 'positive', significance: 'medium' },
    ],
  });
});

export default router;
