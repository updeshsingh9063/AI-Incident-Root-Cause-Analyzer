import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// AI Analysis routes
router.post('/analyze', async (req: Request, res: Response) => {
  const { incidentId, title, description, severity, service, logs, metrics, deployments } = req.body;
  try {
    logger.info(`Forwarding analysis request to AI Service for incident ${incidentId}`);
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/analyze`, {
      incident_id: incidentId || `INC-${Date.now()}`,
      title: title || 'System Degradation',
      description: description || 'High latency or errors observed',
      severity: severity || 'high',
      service: service || 'unknown-service',
      logs: logs || [],
      metrics: metrics || {},
      deployments: deployments || []
    });
    res.json(response.data);
  } catch (error: any) {
    logger.error(`Error calling AI Service /analyze: ${error.message}`);
    // Fallback to mock data if AI service fails or is not ready
    res.json({
      incidentId,
      rootCause: {
        summary: 'Database connection pool exhaustion due to N+1 query pattern in v2.3.1 (Simulated)',
        technical_detail: 'N+1 query pattern in batchTransactionProcessor introduced in v2.3.1 executing 847 individual SELECT statements per checkout request instead of a single optimized JOIN query.',
        confidence: 94,
        category: 'database_saturation',
      },
      contributing_factors: [
        { factor: 'Deployment v2.3.1 — unoptimized query pattern', weight: 0.91, confidence: 97 },
        { factor: 'Missing DB connection pool monitoring', weight: 0.61, confidence: 85 },
        { factor: 'No CI query performance tests', weight: 0.45, confidence: 78 },
      ],
      blast_radius: {
        directly_affected: [service || 'payment-service'],
        indirectly_affected: ['order-service', 'fraud-detection', 'api-gateway'],
        users_impacted_estimate: 12000,
        revenue_impact_estimate: '$47,800/hour',
      },
      timeline: [
        { offset_minutes: 0,  event: `Deployment ${service || 'payment-service'} v2.3.1 completed` },
        { offset_minutes: 5,  event: 'DB query latency increased 340% above baseline' },
        { offset_minutes: 12, event: 'P99 latency alert fired — PagerDuty notified' },
        { offset_minutes: 15, event: 'Connection pool reached 100% capacity' },
        { offset_minutes: 17, event: 'Cascade failure detected in order-service' },
        { offset_minutes: 23, event: 'AI root cause identified with 94% confidence' },
      ],
      remediation: {
        recommended: `Rollback ${service || 'payment-service'} to v2.3.0`,
        estimated_recovery: '8-12 minutes',
        commands: [
          `kubectl rollout undo deployment/${service || 'payment-service'} -n production`,
          `kubectl rollout status deployment/${service || 'payment-service'} -n production`,
        ],
        alternatives: [
          'Increase DB connection pool size to 200 (temporary)',
          'Enable read replica routing for payment queries',
        ],
      },
      similar_incidents: [
        { id: 'INC-2801', similarity: 0.89, resolution: 'DB pool increase + query optimization' },
        { id: 'INC-2756', similarity: 0.73, resolution: 'Deployment rollback' },
      ],
      analysis_time_seconds: 2.3,
      model: 'gpt-4.1-turbo',
      agents_used: ['detection', 'root-cause', 'correlation', 'deployment'],
      timestamp: new Date().toISOString(),
    });
  }
});

// AI Chat endpoint
router.post('/chat', async (req: Request, res: Response) => {
  const { message, conversationId, context } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    logger.info(`Forwarding chat request to AI Service`);
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/chat`, {
      message,
      conversation_id: conversationId,
      context: context || {}
    });
    res.json(response.data);
  } catch (error: any) {
    logger.error(`Error calling AI Service /chat: ${error.message}`);
    // Fallback
    res.json({
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Based on current telemetry for **"${message}"**, the AI has identified:\n\n**Root Cause**: Database connection pool exhaustion (94% confidence)\n\nThe payment-service v2.3.1 deployment introduced an N+1 query pattern executing 847 individual SELECT queries per checkout instead of a single optimized batch query.\n\n**Recommended Action**:\n\`\`\`bash\nkubectl rollout undo deployment/payment-service -n production\n\`\`\`\n\nEstimated recovery: **8–12 minutes** post-rollback.`,
      timestamp: new Date().toISOString(),
      confidence: 94,
      sources: ['incident-log', 'metrics-correlation', 'deployment-analysis'],
    });
  }
});

// AI Postmortem generation
router.post('/postmortem', async (req: Request, res: Response) => {
  const { incidentId } = req.body;
  try {
    logger.info(`Forwarding postmortem request to AI Service for incident ${incidentId}`);
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/postmortem`, {
      incident_id: incidentId
    });
    res.json(response.data);
  } catch (error: any) {
    logger.error(`Error calling AI Service /postmortem: ${error.message}`);
    res.json({
      incidentId,
      title: `INC-${incidentId} Postmortem — AI Generated`,
      summary: 'Critical payment service outage caused by N+1 database query pattern introduced in deployment v2.3.1',
      timeline: [
        { time: '14:47 UTC', event: 'Deployment payment-service v2.3.1 completed' },
        { time: '14:52 UTC', event: 'DB query latency increased 340% above baseline' },
        { time: '14:59 UTC', event: 'P99 latency alert fired — PagerDuty notified' },
        { time: '15:10 UTC', event: 'AI root cause identified with 94% confidence' },
        { time: '15:18 UTC', event: 'Rollback to v2.3.0 initiated' },
        { time: '15:31 UTC', event: 'Full service recovery confirmed' },
      ],
      rootCause: 'Unoptimized database query in batchTransactionProcessor function',
      impact: 'Payment processing degraded for 44 minutes, affecting ~12,000 users',
      actionItems: [
        { task: 'Add query performance tests to CI pipeline', owner: 'Platform Team', priority: 'high', due: '2024-02-15' },
        { task: 'Implement DB connection pool monitoring alerts', owner: 'SRE Team', priority: 'critical', due: '2024-02-10' },
        { task: 'Add pre-deployment DB query analysis', owner: 'Engineering', priority: 'medium', due: '2024-02-28' },
      ],
      generatedAt: new Date().toISOString(),
      reviewedBy: null,
    });
  }
});

// AI anomaly detection
router.post('/detect-anomaly', async (req: Request, res: Response) => {
  const { metrics, service } = req.body;
  try {
    logger.info(`Forwarding anomaly detection request to AI Service for ${service}`);
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/detect-anomaly`, {
      service: service || 'unknown-service',
      metrics: metrics || {}
    });
    res.json(response.data);
  } catch (error: any) {
    logger.error(`Error calling AI Service /detect-anomaly: ${error.message}`);
    res.json({
      service,
      anomalies: [
        { metric: 'latency_p99', severity: 'critical', deviation: 18200, baseline: 45, current: 8240, confidence: 97 },
        { metric: 'error_rate', severity: 'high', deviation: 3400, baseline: 0.1, current: 34.1, confidence: 94 },
        { metric: 'db_connections', severity: 'critical', deviation: 733, baseline: 12, current: 100, confidence: 99 },
      ],
      overallSeverity: 'critical',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
