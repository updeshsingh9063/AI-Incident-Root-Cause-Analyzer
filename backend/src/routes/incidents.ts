import { Router, Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const router = Router();

// ─── Mongoose Schema & Model ───────────────────────────────────────────────
const IncidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], required: true },
  status: { type: String, default: 'investigating' },
  service: { type: String, required: true },
  environment: { type: String, default: 'production' },
  region: { type: String, default: 'us-east-1' },
  assignee: { type: String },
  tags: [String],
  aiConfidence: { type: Number, default: 0 },
  rootCause: { type: String },
  affectedServices: [String],
  mttr: { type: Number },
  startedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent overwrite model error upon hot reloads
const Incident = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);

// ─── Validation ────────────────────────────────────────────────────────────
const IncidentValidation = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  service: z.string(),
  environment: z.enum(['production', 'staging', 'development']).default('production'),
  region: z.string().default('us-east-1'),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ─── GET /incidents ────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { severity, status, service, limit = 50, offset = 0 } = req.query;
    const filter: any = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (service) filter.service = service;

    const data = await Incident.find(filter)
      .sort({ startedAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));
    
    const total = await Incident.countDocuments(filter);

    res.json({ data, total, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    logger.error('Error fetching incidents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /incidents/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    logger.error('Error fetching incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /incidents ───────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = IncidentValidation.parse(req.body);
    const incidentData = {
      id: `INC-${Date.now()}`,
      ...body,
      status: 'investigating',
      aiConfidence: 0,
      startedAt: new Date(),
    };
    const incident = await Incident.create(incidentData);
    logger.info(`New incident created: ${incident.id}`);
    res.status(201).json(incident);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    logger.error('Error creating incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH /incidents/:id ──────────────────────────────────────────────────
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    logger.error('Error updating incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE /incidents/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await Incident.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Incident not found' });
    res.status(204).send();
  } catch (err) {
    logger.error('Error deleting incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /incidents/:id/resolve ───────────────────────────────────────────
router.post('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    
    incident.status = 'resolved';
    incident.mttr = Date.now() - new Date(incident.startedAt).getTime();
    await incident.save();

    logger.info(`Incident resolved: ${incident.id} — MTTR: ${Math.floor(incident.mttr / 60000)}m`);
    res.json(incident);
  } catch (err) {
    logger.error('Error resolving incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
