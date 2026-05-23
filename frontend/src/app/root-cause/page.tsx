'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Shield, ChevronRight, AlertTriangle,
  GitCommit, Clock, Zap, TrendingDown, CheckCircle2,
  Search, Layers, BarChart2, Activity
} from 'lucide-react';
import { mockIncidents, mockAIInsights, mockDeployments } from '@/lib/mock-data';
import { AIConfidenceBadge } from '@/components/MetricCharts';

const TIMELINE_EVENTS = [
  { time: '14:47', label: 'Deployment', desc: 'payment-service v2.3.1 deployed to production', type: 'deploy', color: '#F59E0B' },
  { time: '14:52', label: 'Anomaly Detected', desc: 'DB query latency increased 340% above baseline', type: 'anomaly', color: '#F97316' },
  { time: '14:59', label: 'Alert Fired', desc: 'P99 latency exceeded 2000ms threshold — PagerDuty alerted', type: 'alert', color: '#EF4444' },
  { time: '15:02', label: 'Connection Pool', desc: 'Postgres connection pool reached 100% capacity', type: 'critical', color: '#EF4444' },
  { time: '15:04', label: 'Cascade Begins', desc: 'Order service retry storm amplifying DB load (5.2x)', type: 'cascade', color: '#EF4444' },
  { time: '15:07', label: 'Circuit Breaker', desc: 'API Gateway circuit breaker opened for payment-service', type: 'mitigation', color: '#7C3AED' },
  { time: '15:10', label: 'AI Root Cause', desc: 'Root cause identified: N+1 query in batchTransactionProcessor', type: 'ai', color: '#00E5FF' },
  { time: '15:18', label: 'Rollback Initiated', desc: 'Engineer initiated rollback to v2.3.0', type: 'mitigation', color: '#22C55E' },
];

const EVIDENCE = [
  { label: 'Query executions/request', before: '1', after: '847', severity: 'critical' },
  { label: 'DB connection pool usage', before: '12%', after: '100%', severity: 'critical' },
  { label: 'P99 latency', before: '45ms', after: '8,240ms', severity: 'critical' },
  { label: 'Error rate', before: '0.1%', after: '34.1%', severity: 'critical' },
  { label: 'Throughput', before: '3,820 req/s', after: '234 req/s', severity: 'high' },
  { label: 'Affected services', before: '0', after: '4', severity: 'high' },
];

export default function RootCausePage() {
  const [activeIncident] = useState(mockIncidents[0]);
  const [selectedTab, setSelectedTab] = useState<'analysis' | 'timeline' | 'evidence' | 'remediation'>('analysis');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            Root Cause Analysis
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered investigation · Autonomous causal inference engine</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA' }}
          >
            <Brain className="w-3.5 h-3.5" />
            AI Analyzing
          </motion.div>
        </div>
      </div>

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
                  <span className="text-xs font-mono font-semibold text-purple-300">{inc.aiConfidence}%</span>
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
              <AIConfidenceBadge score={activeIncident.aiConfidence} size="lg" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{activeIncident.title}</h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`badge badge-${activeIncident.severity}`}>{activeIncident.severity}</span>
                  <span className="text-xs text-slate-400 font-mono">{activeIncident.id}</span>
                  <span className="text-xs text-slate-500">{activeIncident.service}</span>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="text-xs text-purple-300 font-semibold mb-1">AI Determined Root Cause</div>
                  <p className="text-sm text-white leading-relaxed">{activeIncident.rootCause}</p>
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
                {mockAIInsights.map((insight, i) => (
                  <div key={insight.id} className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-white">{insight.title}</span>
                      <span className="ml-auto text-xs font-mono text-green-400 font-semibold">{insight.confidence}%</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{insight.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Supporting Evidence</div>
                      {insight.evidence.map((e, ei) => (
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
                  {TIMELINE_EVENTS.map((evt, i) => (
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
                  {EVIDENCE.map((ev, i) => (
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
                {[
                  { title: 'Option 1: Rollback (Recommended)', time: '8–12 min', risk: 'Low', commands: ['kubectl rollout undo deployment/payment-service -n production', 'kubectl rollout status deployment/payment-service -n production'] },
                  { title: 'Option 2: Emergency Pool Scaling', time: '2–5 min', risk: 'Medium', commands: ['kubectl set env deployment/payment-service DB_POOL_SIZE=200 -n production', 'kubectl rollout restart deployment/payment-service -n production'] },
                  { title: 'Option 3: Traffic Rerouting', time: '1–3 min', risk: 'Low', commands: ['kubectl patch service payment-service -p \'{"spec":{"selector":{"version":"v2.3.0"}}}\''] },
                ].map((opt, i) => (
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
                    {opt.commands.map((cmd, ci) => (
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
