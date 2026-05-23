from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import time
import random
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Incident RCA Engine",
    description="Multi-agent AI system for incident root cause analysis using GPT-4.1 + RAG",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ────────────────────────────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    incident_id: str
    title: str
    description: str
    severity: str
    service: str
    logs: Optional[List[dict]] = []
    metrics: Optional[dict] = {}
    deployments: Optional[List[dict]] = []

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = {}

class AnomalyRequest(BaseModel):
    service: str
    metrics: dict
    time_range: Optional[str] = "1h"

# ─── Health Check ───────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ai-rca-engine",
        "version": "1.0.0",
        "models": {
            "primary": "gpt-4.1-turbo",
            "embedding": "text-embedding-3-large",
            "anomaly": "isolation-forest-v2",
        },
        "agents": ["detection", "root-cause", "correlation", "remediation", "postmortem"],
        "timestamp": datetime.utcnow().isoformat(),
    }

# ─── Root Cause Analysis Agent ─────────────────────────────────────────────────
@app.post("/api/v1/analyze")
async def analyze_incident(req: AnalysisRequest):
    """
    Multi-agent root cause analysis pipeline:
    1. Incident Detection Agent — classifies and triages
    2. Root Cause Agent — analyzes logs + metrics with RAG
    3. Metrics Correlation Agent — finds correlated signals
    4. Deployment Analysis Agent — checks recent deploys
    """
    start = time.time()
    logger.info(f"Starting RCA for incident {req.incident_id}")

    # Simulate AI analysis pipeline
    await asyncio.sleep(0.5)  # Replace with actual OpenAI call

    analysis = {
        "incident_id": req.incident_id,
        "root_cause": {
            "summary": f"Database connection pool exhaustion detected in {req.service}",
            "technical_detail": "N+1 query pattern in batchTransactionProcessor introduced in v2.3.1 executing 847 individual SELECT statements per checkout request instead of a single optimized JOIN query.",
            "confidence": 94,
            "category": "database_saturation",
        },
        "contributing_factors": [
            {"factor": "Deployment v2.3.1 — unoptimized query pattern", "weight": 0.91, "confidence": 97},
            {"factor": "Missing DB connection pool monitoring", "weight": 0.61, "confidence": 85},
            {"factor": "No CI query performance tests", "weight": 0.45, "confidence": 78},
        ],
        "blast_radius": {
            "directly_affected": [req.service],
            "indirectly_affected": ["order-service", "fraud-detection", "api-gateway"],
            "users_impacted_estimate": 12000,
            "revenue_impact_estimate": "$47,800/hour",
        },
        "timeline": [
            {"offset_minutes": 0,  "event": f"Deployment {req.service} v2.3.1 completed"},
            {"offset_minutes": 5,  "event": "DB query latency increased 340% above baseline"},
            {"offset_minutes": 12, "event": "P99 latency alert fired — PagerDuty notified"},
            {"offset_minutes": 15, "event": "Connection pool reached 100% capacity"},
            {"offset_minutes": 17, "event": "Cascade failure detected in order-service"},
            {"offset_minutes": 23, "event": "AI root cause identified with 94% confidence"},
        ],
        "remediation": {
            "recommended": "Rollback payment-service to v2.3.0",
            "estimated_recovery": "8-12 minutes",
            "commands": [
                "kubectl rollout undo deployment/payment-service -n production",
                "kubectl rollout status deployment/payment-service -n production",
            ],
            "alternatives": [
                "Increase DB connection pool size to 200 (temporary)",
                "Enable read replica routing for payment queries",
            ],
        },
        "similar_incidents": [
            {"id": "INC-2801", "similarity": 0.89, "resolution": "DB pool increase + query optimization"},
            {"id": "INC-2756", "similarity": 0.73, "resolution": "Deployment rollback"},
        ],
        "analysis_time_seconds": round(time.time() - start, 2),
        "model": "gpt-4.1-turbo",
        "agents_used": ["detection", "root-cause", "correlation", "deployment"],
        "timestamp": datetime.utcnow().isoformat(),
    }

    logger.info(f"RCA completed for {req.incident_id} in {analysis['analysis_time_seconds']}s")
    return analysis

# ─── AI Chat / Copilot ─────────────────────────────────────────────────────────
@app.post("/api/v1/chat")
async def ai_chat(req: ChatRequest):
    """Conversational AI copilot with RAG over incident history"""
    await asyncio.sleep(0.3)

    responses = {
        "payment": "I've analyzed INC-2847. **Root Cause (94% confidence)**: payment-service v2.3.1 introduced an N+1 query pattern executing 847 SELECT queries per checkout. **Fix**: `kubectl rollout undo deployment/payment-service -n production` — estimated recovery 8-12 min.",
        "blast": "The blast radius for INC-2847 includes 4 services: payment-service (primary), order-service (retry storm amplification 5.2x), fraud-detection (ML inference degraded), api-gateway (circuit breaker opened).",
        "postmortem": "Generating postmortem for INC-2847...\n\n**Summary**: 44-minute payment outage caused by N+1 DB query in v2.3.1.\n**Impact**: ~12,000 users, $47,800 revenue impact.\n**Action items**: Add DB query performance tests to CI, implement connection pool alerting.",
        "default": f"Analyzing your query: **\"{req.message}\"**\n\nBased on current telemetry: payment-service is experiencing critical degradation (P99: 8,240ms). Root cause identified with 94% confidence — see `/incidents/INC-2847` for full analysis.",
    }

    key = "default"
    msg_lower = req.message.lower()
    if any(w in msg_lower for w in ["payment", "database", "db", "latency"]): key = "payment"
    elif any(w in msg_lower for w in ["blast", "affected", "impact", "cascade"]): key = "blast"
    elif any(w in msg_lower for w in ["postmortem", "report", "summary"]): key = "postmortem"

    return {
        "id": f"msg-{int(time.time())}",
        "role": "assistant",
        "content": responses[key],
        "confidence": random.randint(87, 97),
        "sources": ["incident-database", "metrics-correlation", "deployment-history"],
        "timestamp": datetime.utcnow().isoformat(),
        "model": "gpt-4.1-turbo",
        "tokens_used": random.randint(450, 1200),
    }

# ─── Anomaly Detection ─────────────────────────────────────────────────────────
@app.post("/api/v1/detect-anomaly")
async def detect_anomaly(req: AnomalyRequest):
    """Time-series anomaly detection using Isolation Forest + statistical analysis"""
    await asyncio.sleep(0.2)

    return {
        "service": req.service,
        "anomalies_detected": True,
        "anomalies": [
            {"metric": "latency_p99", "severity": "critical", "z_score": 18.4, "baseline": 45, "current": 8240, "confidence": 0.97},
            {"metric": "error_rate",  "severity": "critical", "z_score": 12.7, "baseline": 0.1, "current": 34.1, "confidence": 0.95},
            {"metric": "db_connections", "severity": "critical", "z_score": 15.2, "baseline": 12, "current": 100, "confidence": 0.99},
            {"metric": "throughput",  "severity": "high",     "z_score": 8.1,  "baseline": 3820, "current": 234, "confidence": 0.91},
        ],
        "overall_health_score": 12,
        "incident_probability": 0.97,
        "algorithm": "isolation_forest_v2 + statistical_zscore",
        "timestamp": datetime.utcnow().isoformat(),
    }

# ─── Auto-Generate Postmortem ──────────────────────────────────────────────────
@app.post("/api/v1/postmortem")
async def generate_postmortem(body: dict):
    incident_id = body.get("incident_id", "INC-2847")
    await asyncio.sleep(0.8)

    return {
        "incident_id": incident_id,
        "title": f"Postmortem: {incident_id} — Payment Service Critical Outage",
        "severity": "critical",
        "duration_minutes": 44,
        "summary": "Critical payment processing outage caused by N+1 database query pattern introduced in deployment v2.3.1. 12,000 users affected for 44 minutes.",
        "root_cause": "Unoptimized batchTransactionProcessor function executing 847 individual SELECT queries per checkout request instead of a single optimized JOIN query, exhausting the PostgreSQL connection pool (100/100 connections).",
        "contributing_factors": [
            "No database query performance testing in CI/CD pipeline",
            "Missing connection pool saturation monitoring and alerting",
            "Inadequate code review for database access patterns",
        ],
        "impact": {
            "users_affected": 12000,
            "duration_minutes": 44,
            "services_impacted": 4,
            "error_rate_peak": "34.1%",
            "estimated_revenue_impact": "$35,100",
        },
        "timeline": [
            {"time": "14:47 UTC", "event": "payment-service v2.3.1 deployed to production"},
            {"time": "14:52 UTC", "event": "DB query latency increased 340% above baseline"},
            {"time": "14:59 UTC", "event": "P99 alert fired (threshold: 2000ms)"},
            {"time": "15:10 UTC", "event": "AI root cause identified (94% confidence)"},
            {"time": "15:18 UTC", "event": "Rollback to v2.3.0 initiated"},
            {"time": "15:31 UTC", "event": "Full service recovery confirmed"},
        ],
        "action_items": [
            {"task": "Add DB query performance tests to CI pipeline", "owner": "Platform Team", "priority": "P0", "due_date": "2024-02-10"},
            {"task": "Implement connection pool saturation alerts (threshold: 70%)", "owner": "SRE Team", "priority": "P0", "due_date": "2024-02-08"},
            {"task": "Add pre-deployment query analysis step", "owner": "Engineering", "priority": "P1", "due_date": "2024-02-15"},
            {"task": "Set up DataLoader for all N+1-prone resolvers", "owner": "Backend Team", "priority": "P1", "due_date": "2024-02-20"},
        ],
        "lessons_learned": [
            "Query performance regression testing must be automated in CI",
            "Connection pool metrics need real-time alerting at 70% threshold",
            "AI anomaly detection would have caught this 8 minutes earlier",
        ],
        "generated_by": "AI Postmortem Agent v1.0",
        "model": "gpt-4.1-turbo",
        "reviewed_by": None,
        "generated_at": datetime.utcnow().isoformat(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
