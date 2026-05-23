'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle, Brain, Clock, Server, User, GitCommit,
  ChevronLeft, Zap, Shield, Activity, Terminal, CheckCircle2,
  Radio, ExternalLink, Copy, TrendingDown
} from 'lucide-react';
import { mockIncidents, mockAIInsights, mockLogs } from '@/lib/mock-data';
import { AIConfidenceBadge } from '@/components/MetricCharts';
import LiveLogs from '@/components/LiveLogs';
import { getSeverityColor } from '@/lib/utils';

function getStatusColor(status: string) {
  switch (status) {
    case 'investigating': return '#EF4444';
    case 'mitigating': return '#F59E0B';
    case 'resolved': return '#22C55E';
    default: return '#94A3B8';
  }
}

function getTimeSince(date: any) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'just now';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${Math.max(0, mins)}m ago`;
  return `${hours}h ${mins % 60}m ago`;
}

const TIMELINE = [
  { time: '23m ago', event: 'Incident detected — P99 latency threshold breached', type: 'alert', icon: AlertTriangle },
  { time: '22m ago', event: 'AI Incident Detection Agent triggered investigation', type: 'ai', icon: Brain },
  { time: '21m ago', event: 'Cascading failure detected in order-service and fraud-detection', type: 'warn', icon: Activity },
  { time: '20m ago', event: 'Root cause identified with 94% confidence: DB connection pool exhaustion', type: 'ai', icon: Brain },
  { time: '19m ago', event: 'PagerDuty alert sent to on-call rotation (Sarah Chen)', type: 'info', icon: Radio },
  { time: '18m ago', event: 'Deployment v2.3.1 correlated — N+1 query pattern confirmed', type: 'alert', icon: GitCommit },
  { time: '15m ago', event: 'Circuit breaker opened on api-gateway for payment-service', type: 'warn', icon: Zap },
  { time: '12m ago', event: 'Remediation suggested: rollback to v2.3.0', type: 'ai', icon: Shield },
  { time: 'Now', event: 'Investigation ongoing — team reviewing rollback options', type: 'info', icon: User },
];

const REMEDIATION_STEPS = [
  { step: 1, action: 'Immediate rollback to v2.3.0', command: 'kubectl rollout undo deployment/payment-service -n production', risk: 'low', eta: '2–3 min' },
  { step: 2, action: 'Monitor connection pool recovery', command: 'kubectl exec -it pg-primary-0 -- psql -c "SELECT count(*) FROM pg_stat_activity;"', risk: 'none', eta: '1 min' },
  { step: 3, action: 'Scale down retry backoff in order-service', command: 'kubectl set env deployment/order-service RETRY_MAX_DELAY=60s RETRY_MULTIPLIER=2 -n production', risk: 'low', eta: '1 min' },
  { step: 4, action: 'Increase DB connection pool size (temporary)', command: 'kubectl set env deployment/payment-service DB_POOL_SIZE=200 -n production', risk: 'medium', eta: '1 min' },
];

export default function IncidentDetailPage() {
  const { id } = useParams();
  const incident = mockIncidents.find(i => i.id === id) || mockIncidents[0];
  const severityColor = getSeverityColor(incident.severity);
  const statusColor = getStatusColor(incident.status);
  const insight = mockAIInsights[0];

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link href="/incidents">
        <motion.div
          whileHover={{ x: -3 }}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Incidents
        </motion.div>
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${severityColor}15`, border: `1px solid ${severityColor}30` }}>
            <AlertTriangle className="w-6 h-6" style={{ color: severityColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono text-sm text-slate-500">{incident.id}</span>
              <span className="badge" style={{ background: `${severityColor}15`, border: `1px solid ${severityColor}30`, color: severityColor }}>
                {incident.severity}
              </span>
              <span className="badge" style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30`, color: statusColor }}>
                <motion.span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: statusColor }}
                  animate={incident.status !== 'resolved' ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }} />
                {incident.status}
              </span>
              <span className="text-xs text-slate-500 ml-auto" suppressHydrationWarning>{getTimeSince(incident.startedAt)}</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">{incident.title}</h1>
            <p className="text-sm text-slate-400 leading-relaxed">{incident.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
          {[
            { label: 'Service', value: incident.service, icon: Server, color: '#00E5FF' },
            { label: 'Region', value: incident.region, icon: Activity, color: '#7C3AED' },
            { label: 'Assignee', value: incident.assignee, icon: User, color: '#22C55E' },
            { label: 'MTTR', value: incident.mttr ? `${Math.floor(incident.mttr / 60000)}m` : 'Ongoing', icon: Clock, color: '#F59E0B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-sm font-medium text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: AI Analysis + Remediation + Logs */}
        <div className="xl:col-span-2 space-y-6">

          {/* AI Root Cause */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Root Cause Analysis</div>
                <div className="text-xs text-slate-500">Analyzed 847 log entries, 23 metrics, 4 deployments</div>
              </div>
              <div className="ml-auto">
                <AIConfidenceBadge score={incident.aiConfidence} size="md" />
              </div>
            </div>

            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p className="text-sm text-slate-300 leading-relaxed">{incident.rootCause}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evidence Points</div>
              {insight.evidence.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                  {e}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex gap-1 flex-wrap">
                {incident.affectedServices.map(svc => (
                  <span key={svc} className="badge badge-info">{svc}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Remediation Steps */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Remediation Playbook</div>
                <div className="text-xs text-slate-500">Auto-generated step-by-step fix</div>
              </div>
              <span className="ml-auto badge badge-low text-xs">Est. 8–12 min</span>
            </div>

            <div className="space-y-3">
              {REMEDIATION_STEPS.map((r, i) => (
                <motion.div key={r.step} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}>
                      {r.step}
                    </div>
                    <span className="text-sm font-medium text-white">{r.action}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-slate-500">ETA: {r.eta}</span>
                      <span className={`badge ${r.risk === 'low' ? 'badge-low' : r.risk === 'medium' ? 'badge-medium' : 'badge-active'}`}>
                        {r.risk === 'none' ? 'safe' : r.risk}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-black/30">
                      <span className="text-xs text-slate-500 font-mono">bash</span>
                      <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <div className="code-block rounded-none border-0 text-xs">{r.command}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Live Logs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Related Log Stream</span>
              <motion.div className="w-2 h-2 rounded-full bg-green-400 ml-auto"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
            <LiveLogs logs={mockLogs} autoScroll maxHeight="320px" />
          </motion.div>
        </div>

        {/* Right: Timeline + Affected Services */}
        <div className="space-y-6">
          {/* Timeline */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Incident Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/[0.06]" />
              <div className="space-y-4">
                {TIMELINE.map((item, i) => {
                  const Icon = item.icon;
                  const color = item.type === 'alert' ? '#EF4444' : item.type === 'ai' ? '#7C3AED' : item.type === 'warn' ? '#F59E0B' : '#00E5FF';
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="flex items-start gap-3 pl-2 relative">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-xs text-slate-300 leading-relaxed">{item.event}</div>
                        <div className="text-xs text-slate-600 font-mono mt-0.5">{item.time}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Affected Services */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" /> Blast Radius
            </h3>
            <div className="space-y-2">
              {incident.affectedServices.map((svc, i) => {
                const impact = 100 - i * 18;
                return (
                  <div key={svc} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400 flex-1">{svc}</span>
                    <div className="w-20 progress-bar">
                      <motion.div className="progress-fill bg-red-500"
                        initial={{ width: 0 }} animate={{ width: `${impact}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
                    </div>
                    <span className="text-xs font-mono text-red-400">{impact}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Rollback Deployment', color: '#EF4444', icon: GitCommit },
                { label: 'Scale Up Service', color: '#00E5FF', icon: Activity },
                { label: 'Notify Team', color: '#7C3AED', icon: Radio },
                { label: 'Generate Postmortem', color: '#22C55E', icon: CheckCircle2 },
                { label: 'Open in PagerDuty', color: '#F59E0B', icon: ExternalLink },
              ].map(({ label, color, icon: Icon }) => (
                <button key={label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.01]"
                  style={{ background: `${color}08`, border: `1px solid ${color}20`, color }}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
