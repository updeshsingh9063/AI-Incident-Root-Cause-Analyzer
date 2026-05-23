// ============================================================
//  MOCK DATA — AI Incident Root Cause Analyzer
// ============================================================

export const mockIncidents = [
  {
    id: 'INC-2847',
    title: 'Payment Service Latency Spike — P99 > 8s',
    description: 'Critical payment processing degradation affecting checkout across all regions. Error rate climbing to 34% with cascading failures detected in order service.',
    severity: 'critical',
    status: 'investigating',
    service: 'payment-service',
    environment: 'production',
    region: 'us-east-1',
    startedAt: new Date(1716500000000 - 23 * 60000),
    aiConfidence: 94,
    rootCause: 'Database connection pool exhaustion due to unoptimized query in payment-processor v2.3.1',
    affectedServices: ['payment-service', 'order-service', 'checkout-api', 'fraud-detection'],
    mttr: null,
    assignee: 'Sarah Chen',
    tags: ['database', 'latency', 'payment'],
  },
  {
    id: 'INC-2846',
    title: 'Auth Service 5xx Errors — Elevated Rate',
    description: 'Authentication failures spiking to 12% error rate. JWT verification timeouts observed in multiple pods.',
    severity: 'high',
    status: 'investigating',
    service: 'auth-service',
    environment: 'production',
    region: 'eu-west-1',
    startedAt: new Date(1716500000000 - 47 * 60000),
    aiConfidence: 87,
    rootCause: 'Redis session cache eviction under memory pressure — cache hit rate dropped to 23%',
    affectedServices: ['auth-service', 'api-gateway', 'user-service'],
    mttr: null,
    assignee: 'Marcus Johnson',
    tags: ['auth', 'redis', 'cache'],
  },
  {
    id: 'INC-2845',
    title: 'Kubernetes Node OOMKilled — Worker Nodes',
    description: 'Multiple worker nodes experiencing OOMKilled events. Pod restarts exceeding threshold in data processing namespace.',
    severity: 'high',
    status: 'mitigating',
    service: 'data-pipeline',
    environment: 'production',
    region: 'us-west-2',
    startedAt: new Date(1716500000000 - 92 * 60000),
    aiConfidence: 91,
    rootCause: 'Memory leak in spark-job-processor v1.8.2 — Java heap allocation not released after batch completion',
    affectedServices: ['data-pipeline', 'analytics-service', 'reporting-api'],
    mttr: null,
    assignee: 'Alex Rivera',
    tags: ['kubernetes', 'memory', 'oom'],
  },
  {
    id: 'INC-2844',
    title: 'CDN Cache Miss Rate — 89% Global',
    description: 'CDN cache miss rate surged to 89% globally causing origin server overload and increased response times.',
    severity: 'medium',
    status: 'resolved',
    service: 'cdn-layer',
    environment: 'production',
    region: 'global',
    startedAt: new Date(1716500000000 - 3 * 3600000),
    aiConfidence: 98,
    rootCause: 'Deployment of v4.2.0 changed Cache-Control headers to no-cache, bypassing CDN entirely',
    affectedServices: ['cdn-layer', 'static-assets', 'media-service'],
    mttr: 42 * 60000,
    assignee: 'Priya Sharma',
    tags: ['cdn', 'cache', 'deployment'],
  },
  {
    id: 'INC-2843',
    title: 'Database Replication Lag — Primary US-East',
    description: 'Postgres replication lag exceeded 45 seconds on read replicas causing stale data reads.',
    severity: 'medium',
    status: 'resolved',
    service: 'postgres-cluster',
    environment: 'production',
    region: 'us-east-1',
    startedAt: new Date(1716500000000 - 8 * 3600000),
    aiConfidence: 96,
    rootCause: 'Long-running analytics query on primary blocked WAL streaming to replicas for 12 minutes',
    affectedServices: ['postgres-cluster', 'user-service', 'product-catalog'],
    mttr: 28 * 60000,
    assignee: 'David Kim',
    tags: ['database', 'replication', 'postgres'],
  },
];

export const mockMetrics = {
  cpu: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(1716500000000 - (30 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    value: 45 + Math.sin(i * 0.5) * 20 + 0.5 * 15,
    threshold: 80,
  })),
  memory: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(1716500000000 - (30 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    value: 62 + Math.sin(i * 0.3) * 15 + 0.5 * 10,
    threshold: 85,
  })),
  latency: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(1716500000000 - (30 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    p50: 45 + 0.5 * 20,
    p95: 120 + 0.5 * 80,
    p99: 280 + (i > 20 ? (i - 20) * 40 : 0) + 0.5 * 100,
  })),
  errorRate: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(1716500000000 - (30 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    value: i > 22 ? 15 + (i - 22) * 3 + 0.5 * 5 : 0.5 + 0.5 * 1.5,
  })),
  requests: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(1716500000000 - (30 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    value: 8500 + Math.sin(i * 0.4) * 2000 + 0.5 * 1000,
  })),
};

export const mockServices = [
  { id: 'api-gateway', name: 'API Gateway', status: 'degraded', health: 67, requests: 12450, errors: 4.2, latency: 234, dependencies: ['auth-service', 'payment-service', 'product-catalog'] },
  { id: 'payment-service', name: 'Payment Service', status: 'critical', health: 23, requests: 3820, errors: 34.1, latency: 8240, dependencies: ['postgres-primary', 'stripe-api', 'fraud-detection'] },
  { id: 'auth-service', name: 'Auth Service', status: 'degraded', health: 71, requests: 9120, errors: 12.3, latency: 456, dependencies: ['redis-cluster', 'user-service'] },
  { id: 'order-service', name: 'Order Service', status: 'degraded', health: 58, requests: 2340, errors: 18.7, latency: 1890, dependencies: ['payment-service', 'inventory-service', 'postgres-primary'] },
  { id: 'user-service', name: 'User Service', status: 'healthy', health: 98, requests: 6780, errors: 0.1, latency: 45, dependencies: ['postgres-replica', 'redis-cluster'] },
  { id: 'product-catalog', name: 'Product Catalog', status: 'healthy', health: 99, requests: 15600, errors: 0.0, latency: 32, dependencies: ['postgres-replica', 'elasticsearch'] },
  { id: 'inventory-service', name: 'Inventory Service', status: 'healthy', health: 94, requests: 4320, errors: 0.8, latency: 78, dependencies: ['mongodb-primary', 'redis-cluster'] },
  { id: 'notification-service', name: 'Notification Service', status: 'healthy', health: 97, requests: 8900, errors: 0.2, latency: 120, dependencies: ['ses', 'twilio'] },
  { id: 'fraud-detection', name: 'Fraud Detection', status: 'degraded', health: 62, requests: 3820, errors: 8.4, latency: 2100, dependencies: ['ml-inference', 'redis-cluster'] },
  { id: 'mongodb-primary', name: 'MongoDB Primary', status: 'critical', health: 31, requests: 24500, errors: 0.0, latency: 4200, dependencies: [] },
  { id: 'redis-cluster', name: 'Redis Cluster', status: 'degraded', health: 55, requests: 89200, errors: 0.0, latency: 42, dependencies: [] },
  { id: 'elasticsearch', name: 'Elasticsearch', status: 'healthy', health: 99, requests: 5600, errors: 0.1, latency: 28, dependencies: [] },
];

export const mockLogs = [
  { id: 1, timestamp: new Date(1716500000000 - 2000), level: 'error', service: 'payment-service', pod: 'payment-svc-7d9f8b-xk2p4', message: 'Connection pool exhausted: max connections (100) reached for mongodb://payment-db:27017/payments', trace: 'trace-a8f2c4d1' },
  { id: 2, timestamp: new Date(1716500000000 - 5000), level: 'error', service: 'payment-service', pod: 'payment-svc-7d9f8b-xk2p4', message: 'Query timeout after 8000ms: db.transactions.find({user_id: $1, status: \'pending\'})', trace: 'trace-b3e1a2f9' },
  { id: 3, timestamp: new Date(1716500000000 - 8000), level: 'warn', service: 'order-service', pod: 'order-svc-6c8f4a-mn3r1', message: 'Payment service unavailable, retrying (attempt 3/5) with exponential backoff', trace: 'trace-c7d4b8e2' },
  { id: 4, timestamp: new Date(1716500000000 - 12000), level: 'error', service: 'auth-service', pod: 'auth-svc-9b2e7f-pq4s5', message: 'Redis TIMEOUT: GET session:usr_a8f2c3d4 took 3200ms (threshold: 500ms)', trace: 'trace-d1f3a9c6' },
  { id: 5, timestamp: new Date(1716500000000 - 18000), level: 'info', service: 'api-gateway', pod: 'api-gw-5f1c3b-wx8y2', message: 'Circuit breaker OPEN for payment-service: 35% error rate over last 60s', trace: 'trace-e5b2c8d3' },
  { id: 6, timestamp: new Date(1716500000000 - 24000), level: 'warn', service: 'fraud-detection', pod: 'fraud-det-3a7c9f-ab5k6', message: 'ML inference latency degraded: avg 2100ms vs baseline 450ms — possible resource contention', trace: 'trace-f9a1d4e7' },
  { id: 7, timestamp: new Date(1716500000000 - 31000), level: 'error', service: 'postgres-primary', pod: 'pg-primary-0', message: 'FATAL: remaining connection slots reserved for non-replication superuser connections', trace: 'trace-g4c7b2f8' },
  { id: 8, timestamp: new Date(1716500000000 - 38000), level: 'info', service: 'payment-service', pod: 'payment-svc-7d9f8b-xk2p4', message: 'Deployment v2.3.1 started — rolling update 0/6 pods updated', trace: 'trace-h2e9d5a1' },
  { id: 9, timestamp: new Date(1716500000000 - 45000), level: 'info', service: 'k8s-controller', pod: 'kube-controller-manager', message: 'HPA scaled payment-service from 6 to 12 replicas based on CPU utilization (87%)', trace: null },
  { id: 10, timestamp: new Date(1716500000000 - 52000), level: 'warn', service: 'auth-service', pod: 'auth-svc-9b2e7f-rt6u1', message: 'High JWT verification error rate: 847 failures in last 60s (baseline: 12)', trace: 'trace-j8f3c6b4' },
];

export const mockAIInsights = [
  {
    id: 1,
    type: 'root_cause',
    confidence: 94,
    title: 'DB Connection Pool Exhaustion',
    description: 'Payment service DB connection pool is saturated (100/100 connections). Root cause: unoptimized N+1 query introduced in v2.3.1 executing 847 individual SELECT statements per checkout request.',
    evidence: ['Connection pool at 100% capacity for 23 minutes', 'Query latency increased from 45ms to 8240ms', 'New query pattern detected after v2.3.1 deployment at 14:47 UTC'],
    remediation: 'Rollback payment-service to v2.3.0 or apply hotfix to batch transaction queries',
    relatedServices: ['payment-service', 'postgres-primary'],
  },
  {
    id: 2,
    type: 'correlation',
    confidence: 87,
    title: 'Cascading Failure Chain Detected',
    description: 'DB overload → Payment timeouts → Order service retries amplifying load → Circuit breaker tripped → Auth cache miss → JWT verification bottleneck',
    evidence: ['Error cascade started 23 minutes ago', '4 services affected in sequence', 'Retry amplification factor: 5.2x'],
    remediation: 'Reduce retry multiplier in order-service and enable exponential backoff with jitter',
    relatedServices: ['payment-service', 'order-service', 'auth-service', 'api-gateway'],
  },
  {
    id: 3,
    type: 'prediction',
    confidence: 78,
    title: 'Redis Memory Pressure Risk',
    description: 'Redis cluster memory at 78% capacity. At current growth rate (0.3% per minute), OOM eviction will trigger in approximately 73 minutes, causing auth service cache invalidation.',
    evidence: ['Redis memory: 78.2GB / 100GB', 'Session data growth rate elevated +340% vs baseline', 'Cache eviction policy: allkeys-lru'],
    remediation: 'Scale Redis cluster horizontally or flush expired session data immediately',
    relatedServices: ['redis-cluster', 'auth-service'],
  },
];

export const mockDeployments = [
  { id: 'dep-001', service: 'payment-service', version: 'v2.3.1', environment: 'production', status: 'suspicious', timestamp: new Date(1716500000000 - 38 * 60000), author: 'carlos.mendez', commitHash: 'a8f2c3d', prTitle: 'feat: batch transaction processing optimization', aiRisk: 92 },
  { id: 'dep-002', service: 'auth-service', version: 'v5.1.8', environment: 'production', status: 'safe', timestamp: new Date(1716500000000 - 2 * 3600000), author: 'sarah.chen', commitHash: 'b3e1a2f', prTitle: 'fix: JWT token refresh edge case', aiRisk: 12 },
  { id: 'dep-003', service: 'api-gateway', version: 'v3.0.4', environment: 'production', status: 'safe', timestamp: new Date(1716500000000 - 5 * 3600000), author: 'marcus.j', commitHash: 'c7d4b8e', prTitle: 'perf: request deduplication middleware', aiRisk: 18 },
  { id: 'dep-004', service: 'fraud-detection', version: 'v1.9.2', environment: 'production', status: 'safe', timestamp: new Date(1716500000000 - 8 * 3600000), author: 'alex.r', commitHash: 'd1f3a9c', prTitle: 'chore: update ML model weights v14', aiRisk: 24 },
];

export const mockTeamStats = {
  mttr: { current: 23, previous: 47, unit: 'min' },
  mtta: { current: 4.2, previous: 7.8, unit: 'min' },
  incidentsResolved: { current: 847, previous: 723, period: 'this month' },
  uptime: { current: 99.94, previous: 99.87, period: 'last 30d' },
  aiAccuracy: { current: 91.3, previous: 88.2, period: 'last 30d' },
};

export const mockChatMessages = [
  {
    id: 1,
    role: 'user' as const,
    content: 'What is causing the payment service degradation?',
    timestamp: new Date(1716500000000 - 5 * 60000),
  },
  {
    id: 2,
    role: 'assistant' as const,
    content: `I've analyzed the incident data for **INC-2847** and identified the root cause with **94% confidence**:

**Root Cause: Database Connection Pool Exhaustion**

The payment-service deployment **v2.3.1** (deployed 38 minutes ago) introduced an unoptimized database query pattern. Specifically:

1. The new \`batchTransactionProcessor\` function is executing **847 individual SELECT queries** per checkout request instead of a single optimized batch query
2. This caused the Postgres connection pool to reach 100% capacity (100/100 connections)
3. New requests are queuing, causing P99 latency to spike from **45ms → 8,240ms**

**Cascading Impact:**
- Order service receiving timeouts → triggering 5x retry storm
- Auth service Redis cache under pressure from increased load
- API Gateway circuit breaker opened for payment-service

**Recommended Actions:**
\`\`\`bash
# Option 1: Immediate rollback
kubectl rollout undo deployment/payment-service -n production

# Option 2: Emergency hotfix
kubectl set env deployment/payment-service DB_POOL_SIZE=200 -n production
\`\`\`

Estimated recovery time: **8-12 minutes** after rollback.`,
    timestamp: new Date(1716500000000 - 4 * 60000),
  },
  {
    id: 3,
    role: 'user' as const,
    content: 'Show me the exact query causing the issue',
    timestamp: new Date(1716500000000 - 3 * 60000),
  },
  {
    id: 4,
    role: 'assistant' as const,
    content: `Found the problematic query pattern in \`payment-processor.ts:847\`:

**Before (v2.3.0 — efficient):**
\`\`\`sql
SELECT t.*, u.email, u.name 
FROM transactions t 
JOIN users u ON t.user_id = u.id 
WHERE t.status = 'pending' 
AND t.created_at > NOW() - INTERVAL '1 hour'
LIMIT 100;
\`\`\`

**After (v2.3.1 — N+1 problem):**
\`\`\`sql
-- Called 847 times per request:
SELECT * FROM transactions WHERE user_id = $1 AND status = 'pending';
-- Then for each result:
SELECT email, name FROM users WHERE id = $2;
\`\`\`

**Impact Analysis:**
- Query execution time: 45ms → 8,240ms per request
- DB connections held: 1 → 847 per checkout
- Throughput degradation: -97.3%

The fix requires restoring the JOIN query or implementing DataLoader-style batching.`,
    timestamp: new Date(1716500000000 - 2 * 60000),
  },
];
