import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

const router = Router();

// ─── Types ─────────────────────────────────────────────────────────────────
const IncidentSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  service: z.string(),
  environment: z.enum(['production', 'staging', 'development']).default('production'),
  region: z.string().default('us-east-1'),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ─── In-memory store (replace with DB in production) ──────────────────────
const incidents: any[] = [
  {
    id: 'INC-2847',
    title: 'Payment Service Latency Spike — P99 > 8s',
    description: 'Critical payment processing degradation affecting checkout',
    severity: 'critical',
    status: 'investigating',
    service: 'payment-service',
    environment: 'production',
    region: 'us-east-1',
    startedAt: new Date(Date.now() - 23 * 60000).toISOString(),
    aiConfidence: 94,
    rootCause: 'Database connection pool exhaustion',
    affectedServices: ['payment-service', 'order-service'],
    mttr: null,
    assignee: 'Sarah Chen',
    tags: ['database', 'latency', 'payment'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── GET /incidents ────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { severity, status, service, limit = 50, offset = 0 } = req.query;
    let filtered = [...incidents];
    if (severity) filtered = filtered.filter(i => i.severity === severity);
    if (status) filtered = filtered.filter(i => i.status === status);
    if (service) filtered = filtered.filter(i => i.service === service);
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
    res.json({ data: paginated, total: filtered.length, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    logger.error('Error fetching incidents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /incidents/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  res.json(incident);
});

// ─── POST /incidents ───────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = IncidentSchema.parse(req.body);
    const incident = {
      id: `INC-${Date.now()}`,
      ...body,
      status: 'investigating',
      aiConfidence: 0,
      rootCause: null,
      affectedServices: [],
      mttr: null,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    incidents.unshift(incident);
    logger.info(`New incident created: ${incident.id}`);
    res.status(201).json(incident);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH /incidents/:id ──────────────────────────────────────────────────
router.patch('/:id', async (req: Request, res: Response) => {
  const idx = incidents.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Incident not found' });
  incidents[idx] = { ...incidents[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(incidents[idx]);
});

// ─── DELETE /incidents/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  const idx = incidents.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Incident not found' });
  incidents.splice(idx, 1);
  res.status(204).send();
});

// ─── POST /incidents/:id/resolve ───────────────────────────────────────────
router.post('/:id/resolve', async (req: Request, res: Response) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  incident.status = 'resolved';
  incident.mttr = Date.now() - new Date(incident.startedAt).getTime();
  incident.updatedAt = new Date().toISOString();
  logger.info(`Incident resolved: ${incident.id} — MTTR: ${Math.floor(incident.mttr / 60000)}m`);
  res.json(incident);
});

export default router;
