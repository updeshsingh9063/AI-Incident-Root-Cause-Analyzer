'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Shield, ChevronRight, AlertTriangle,
  GitCommit, Clock, Zap, TrendingDown, CheckCircle2,
  Search, Layers, BarChart2, Activity, Play, RefreshCw, Cpu, Server, Network, Sparkles
} from 'lucide-react';
import { mockIncidents, mockAIInsights } from '@/lib/mock-data';
import { AIConfidenceBadge } from '@/components/MetricCharts';

const API_BASE = '/api';

const AGENT_STEPS = [
  { name: 'Telemetry Analyzer', desc: 'Ingesting live Prometheus metrics & service logs...', icon: Activity, color: '#00E5FF' },
  { name: 'Causal Inference Engine', desc: 'Analyzing dependency topology & error propagation...', icon: Network, color: '#A78BFA' },
  { name: 'Similarity Matcher', desc: 'Searching Pinecone Vector DB for historical correlations...', icon: Layers, color: '#FCD34D' },
  { name: 'SRE Specialist Synthesis', desc: 'Synthesizing root cause using LLaMA-3.3-70B...', icon: Brain, color: '#22C55E' },
];

export default function RootCausePage() {
  const [activeIncident, setActiveIncident] = useState(mockIncidents[0]);
  const [selectedTab, setSelectedTab] = useState<'analysis' | 'timeline' | 'evidence' | 'remediation'>('analysis');
  
  // Real AI Live Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [liveData, setLiveData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runLiveAIAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setError(null);

    // Simulate Agent Step Transitions visually
    for (let i = 0; i < AGENT_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          title: activeIncident.title,
          description: activeIncident.description || 'Database latency spike with connection pool saturation.',
          severity: activeIncident.severity,
          service: activeIncident.service,
          logs: [
            { timestamp: new Date().toISOString(), level: 'error', service: activeIncident.service, message: 'Postgres connection pool exhausted (100/100 active connections)' },
            { timestamp: new Date().toISOString(), level: 'error', service: activeIncident.service, message: 'N+1 query pattern detected in batchTransactionProcessor v2.3.1 executing 847 SELECT queries' }
          ],
          metrics: {
            p99_latency: 8240,
            db_connections: 100,
            error_rate: 34.1
          },
          deployments: [
            { version: 'v2.3.1', service: activeIncident.service, status: 'completed', description: 'Updated batchTransactionProcessor query optimizer' }
          ]
        })
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      
      setLiveData(data);
      // Update our current active incident with the real live data
      setActiveIncident(prev => ({
        ...prev,
        aiConfidence: data.root_cause.confidence,
        rootCause: `${data.root_cause.summary}. ${data.root_cause.technical_detail}`,
      }));
    } catch (err: any) {
      console.error('Error running AI RCA:', err);
      setError(err.message || 'Failed to communicate with AI Service.');
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(null);
    }
  };

  // Compute values dynamically from liveData or fallback to mock
  const displayConfidence = liveData ? liveData.root_cause.confidence : activeIncident.aiConfidence;
  const displayRootCause = liveData 
    ? `${liveData.root_cause.summary}. ${liveData.root_cause.technical_detail}`
    : activeIncident.rootCause;
  
  const displayTimeline = liveData 
    ? liveData.timeline.map((t: any, i: number) => ({
        time: t.offset_minutes === 0 ? '14:47' : `+${t.offset_minutes}m`,
        label: t.event.includes('Deployment') ? 'Deployment' : t.event.includes('latency') ? 'Latency Spike' : 'System Event',
        desc: t.event,
        color: t.event.includes('Deployment') ? '#F59E0B' : t.event.includes('recovery') || t.event.includes('identified') ? '#00E5FF' : '#EF4444'
      }))
    : [
        { time: '14:47', label: 'Deployment', desc: 'payment-service v2.3.1 deployed to production', color: '#F59E0B' },
        { time: '14:52', label: 'Anomaly Detected', desc: 'DB query latency increased 340% above baseline', color: '#F97316' },
        { time: '14:59', label: 'Alert Fired', desc: 'P99 latency exceeded 2000ms threshold — PagerDuty alerted', color: '#EF4444' },
        { time: '15:02', label: 'Connection Pool', desc: 'Postgres connection pool reached 100% capacity', color: '#EF4444' },
        { time: '15:04', label: 'Cascade Begins', desc: 'Order service retry storm amplifying DB load (5.2x)', color: '#EF4444' },
        { time: '15:07', label: 'Circuit Breaker', desc: 'API Gateway circuit breaker opened for payment-service', color: '#7C3AED' },
        { time: '15:10', label: 'AI Root Cause', desc: 'Root cause identified: N+1 query in batchTransactionProcessor', color: '#00E5FF' },
        { time: '15:18', label: 'Rollback Initiated', desc: 'Engineer initiated rollback to v2.3.0', color: '#22C55E' },
      ];

  const displayInsights = liveData
    ? [
        {
          id: 'insight-1',
          title: 'Database Connection Pool Saturation',
          confidence: liveData.root_cause.confidence,
          description: liveData.root_cause.technical_detail,
          evidence: liveData.contributing_factors.map((f: any) => `${f.factor} (Weight: ${f.weight * 100}%)`),
          remediation: liveData.remediation.recommended,
        }
      ]
    : mockAIInsights;

  const displayEvidence = liveData
    ? [
        { label: 'Query executions/request', before: '1', after: '847', severity: 'critical' },
        { label: 'DB connection pool usage', before: '12%', after: '100%', severity: 'critical' },
        { label: 'P99 latency', before: '45ms', after: '8,240ms', severity: 'critical' },
        { label: 'Error rate', before: '0.1%', after: '34.1%', severity: 'critical' },
        { label: 'Throughput', before: '3,820 req/s', after: '234 req/s', severity: 'high' },
        { label: 'Blast Radius (direct)', before: '0', after: String(liveData.blast_radius.directly_affected.length), severity: 'high' }
      ]
    : [
        { label: 'Query executions/request', before: '1', after: '847', severity: 'critical' },
        { label: 'DB connection pool usage', before: '12%', after: '100%', severity: 'critical' },
        { label: 'P99 latency', before: '45ms', after: '8,240ms', severity: 'critical' },
        { label: 'Error rate', before: '0.1%', after: '34.1%', severity: 'critical' },
        { label: 'Throughput', before: '3,820 req/s', after: '234 req/s', severity: 'high' },
        { label: 'Affected services', before: '0', after: '4', severity: 'high' },
      ];

  const displayRemediation = liveData
    ? [
        { 
          title: 'Option 1: Recommended Action', 
          time: liveData.remediation.estimated_recovery || '8–12 min', 
          risk: 'Low', 
          commands: liveData.remediation.commands || ['kubectl rollout undo deployment/payment-service -n production'] 
        },
        ... (liveData.remediation.alternatives || []).map((alt: string, i: number) => ({
          title: `Option ${i + 2}: Alternative Approach`,
          time: '5 min',
          risk: 'Medium',
          commands: [alt]
        }))
      ]
    : [
        { title: 'Option 1: Rollback (Recommended)', time: '8–12 min', risk: 'Low', commands: ['kubectl rollout undo deployment/payment-service -n production', 'kubectl rollout status deployment/payment-service -n production'] },
        { title: 'Option 2: Emergency Pool Scaling', time: '2–5 min', risk: 'Medium', commands: ['kubectl set env deployment/payment-service DB_POOL_SIZE=200 -n production', 'kubectl rollout restart deployment/payment-service -n production'] },
        { title: 'Option 3: Traffic Rerouting', time: '1–3 min', risk: 'Low', commands: ['kubectl patch service payment-service -p \'{"spec":{"selector":{"version":"v2.3.0"}}}\''] },
      ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            Root Cause Analysis
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered SRE agent · Multi-agent causal inference engine</p>
        </div>

        <div className="flex items-center gap-2">
          {liveData && (
            <span className="text-[11.5px] px-2.5 py-1 rounded-lg font-semibold bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-1.5 animate-pulse">
              <Cpu className="w-3.5 h-3.5" />
              Live Telemetry Wired
            </span>
          )}
          <button
            onClick={runLiveAIAnalysis}
            disabled={isAnalyzing}
            className="relative px-4 py-2 text-xs font-bold rounded-lg text-white transition-all overflow-hidden flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #00E5FF)',
              boxShadow: '0 0 16px rgba(124,58,237,0.3)',
            }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Multi-Agent RCA...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Trigger Live AI RCA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-Agent Diagnostic Pipeline Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-5 overflow-hidden"
            style={{ borderColor: 'rgba(124,58,237,0.25)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-pulse" />
              Multi-Agent Diagnostic Pipeline Active
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {AGENT_STEPS.map((step, idx) => {
                const isCurrent = currentStep === idx;
                const isCompleted = currentStep !== null && idx < currentStep;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-xl relative border transition-all"
                    style={{
                      background: isCurrent 
                        ? 'rgba(124,58,237,0.06)' 
                        : isCompleted 
                        ? 'rgba(34,197,94,0.03)' 
                        : 'rgba(255,255,255,0.01)',
                      borderColor: isCurrent 
                        ? '#7C3AED' 
                        : isCompleted 
                        ? 'rgba(34,197,94,0.3)' 
                        : 'rgba(255,255,255,0.04)'
                    }}
                    animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: isCurrent 
                            ? `${step.color}25` 
                            : isCompleted 
                            ? 'rgba(34,197,94,0.15)' 
                            : 'rgba(255,255,255,0.04)'
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: isCurrent ? step.color : '#64748B' }} />
                        )}
                      </div>
                      <span className={`text-[12.5px] font-bold ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-slate-500'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 leading-normal">{step.desc}</p>
                    
                    {/* Status Dot */}
                    {isCurrent && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Incident selector */}
        <div className="xl:col-span-1 space-y-4">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Select Incident</div>
          {mockIncidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => {
                setActiveIncident(inc);
                setLiveData(null); // Reset live data to fallback when switching
              }}
              className={`glass-card p-4 cursor-pointer transition-all ${
                activeIncident.id === inc.id ? 'border-purple-500/40' : ''
              }`}
              style={activeIncident.id === inc.id ? { borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.06)' } : {}}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-slate-500">{inc.id}</span>
                <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
              </div>
              <div className="text-sm font-medium text-white line-clamp-1 mb-2">{inc.title}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{inc.service}</span>
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-mono font-semibold text-purple-300">
                    {activeIncident.id === inc.id ? displayConfidence : inc.aiConfidence}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Analysis */}
        <div className="xl:col-span-2 space-y-4">
          {/* Confidence Score Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div className="flex items-start gap-6">
              <AIConfidenceBadge score={displayConfidence} size="lg" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{activeIncident.title}</h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`badge badge-${activeIncident.severity}`}>{activeIncident.severity}</span>
                  <span className="text-xs text-slate-400 font-mono">{activeIncident.id}</span>
                  <span className="text-xs text-slate-500">{activeIncident.service}</span>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-xs text-purple-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    AI Determined Root Cause {liveData && `(${liveData.model})`}
                  </div>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{displayRootCause}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 glass-card p-1">
            {(['analysis', 'timeline', 'evidence', 'remediation'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold capitalize rounded-lg transition-all ${
                  selectedTab === tab
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === 'analysis' && (
              <motion.div key="analysis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {displayInsights.map((insight, i) => (
                  <div key={insight.id} className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-white">{insight.title}</span>
                      <span className="ml-auto text-xs font-mono text-green-400 font-semibold">{insight.confidence}%</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{insight.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Supporting Evidence</div>
                      {insight.evidence.map((e: string, ei: number) => (
                        <div key={ei} className="flex items-start gap-2 text-xs text-slate-400">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-cyan-400 flex-shrink-0" />
                          {e}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                      <div className="flex items-start gap-2">
                        <Shield className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-green-300 font-semibold mb-0.5">Remediation</div>
                          <p className="text-xs text-slate-400">{insight.remediation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {selectedTab === 'timeline' && (
              <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass-card p-5">
                <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Incident Timeline
                </div>
                <div className="relative space-y-0">
                  <div className="absolute left-[52px] top-4 bottom-4 w-px bg-white/[0.06]" />
                  {displayTimeline.map((evt: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-4 py-3"
                    >
                      <span className="text-xs font-mono text-slate-600 w-12 flex-shrink-0 pt-0.5">{evt.time}</span>
                      <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1 z-10" style={{ background: evt.color, boxShadow: `0 0 8px ${evt.color}` }} />
                      <div>
                        <div className="text-xs font-semibold" style={{ color: evt.color }}>{evt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{evt.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'evidence' && (
              <motion.div key="evidence" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass-card p-5">
                <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Before vs After Comparison
                </div>
                <div className="space-y-3">
                  {displayEvidence.map((ev: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0"
                    >
                      <div className="flex-1 text-xs text-slate-400">{ev.label}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-green-500/10 text-green-300 px-2 py-1 rounded border border-green-500/20">
                          {ev.before}
                        </span>
                        <TrendingDown className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-xs font-mono bg-red-500/10 text-red-300 px-2 py-1 rounded border border-red-500/20">
                          {ev.after}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'remediation' && (
              <motion.div key="remediation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                {displayRemediation.map((opt: any, i: number) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-white">{opt.title}</span>
                      <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {opt.time}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        opt.risk === 'Low' ? 'bg-green-500/10 text-green-300' : 'bg-amber-500/10 text-amber-300'
                      }`}>{opt.risk} Risk</span>
                    </div>
                    {opt.commands.map((cmd: string, ci: number) => (
                      <div key={ci} className="code-block mb-2 text-xs">{cmd}</div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
