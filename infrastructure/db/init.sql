-- Initialize Incidents Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE severity_level AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE status_type AS ENUM ('investigating', 'mitigating', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity severity_level NOT NULL,
    status status_type NOT NULL DEFAULT 'investigating',
    service VARCHAR(100) NOT NULL,
    environment VARCHAR(50) DEFAULT 'production',
    region VARCHAR(50) DEFAULT 'global',
    assignee VARCHAR(100),
    ai_confidence INTEGER DEFAULT 0,
    root_cause TEXT,
    affected_services TEXT[],
    tags TEXT[],
    mttr_ms BIGINT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(50) REFERENCES incidents(id),
    level VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    trace_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO incidents (id, title, description, severity, status, service, ai_confidence, root_cause) 
VALUES 
('INC-2847', 'Payment Service Latency Spike', 'P99 > 8s', 'critical', 'investigating', 'payment-service', 94, 'DB Connection Pool Exhaustion')
ON CONFLICT DO NOTHING;
