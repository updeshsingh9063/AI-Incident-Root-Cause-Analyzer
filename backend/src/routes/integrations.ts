import { Router } from 'express';

const router = Router();

const INTEGRATIONS = [
  { id: 'datadog', name: 'Datadog', category: 'monitoring', status: 'connected', lastSync: new Date(Date.now() - 60000).toISOString(), metrics: { eventsReceived: 14520, alertsProcessed: 234 } },
  { id: 'grafana', name: 'Grafana', category: 'monitoring', status: 'connected', lastSync: new Date(Date.now() - 120000).toISOString(), metrics: { dashboards: 47, alerts: 128 } },
  { id: 'prometheus', name: 'Prometheus', category: 'monitoring', status: 'connected', lastSync: new Date(Date.now() - 30000).toISOString(), metrics: { metricsScraped: 892400, series: 12450 } },
  { id: 'pagerduty', name: 'PagerDuty', category: 'alerting', status: 'connected', lastSync: new Date(Date.now() - 45000).toISOString(), metrics: { incidentsCreated: 47, escalations: 8 } },
  { id: 'slack', name: 'Slack', category: 'communication', status: 'connected', lastSync: new Date(Date.now() - 15000).toISOString(), metrics: { messagesent: 1247, channels: 3 } },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', status: 'connected', lastSync: new Date(Date.now() - 10000).toISOString(), metrics: { clusters: 2, pods: 847, nodes: 24 } },
  { id: 'argocd', name: 'ArgoCD', category: 'devops', status: 'connected', lastSync: new Date(Date.now() - 90000).toISOString(), metrics: { applications: 34, deployments: 156 } },
  { id: 'newrelic', name: 'New Relic', category: 'monitoring', status: 'available', lastSync: null, metrics: null },
  { id: 'opsgenie', name: 'OpsGenie', category: 'alerting', status: 'available', lastSync: null, metrics: null },
];

router.get('/', (_, res) => {
  res.json({
    data: INTEGRATIONS,
    summary: {
      total: INTEGRATIONS.length,
      connected: INTEGRATIONS.filter(i => i.status === 'connected').length,
      available: INTEGRATIONS.filter(i => i.status === 'available').length,
    },
  });
});

router.get('/:id', (req, res) => {
  const integration = INTEGRATIONS.find(i => i.id === req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

router.post('/:id/connect', (req, res) => {
  const integration = INTEGRATIONS.find(i => i.id === req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  integration.status = 'connected';
  integration.lastSync = new Date().toISOString();
  res.json({ message: `${integration.name} connected successfully`, integration });
});

router.delete('/:id/disconnect', (req, res) => {
  const integration = INTEGRATIONS.find(i => i.id === req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  integration.status = 'available';
  res.json({ message: `${integration.name} disconnected` });
});

export default router;
