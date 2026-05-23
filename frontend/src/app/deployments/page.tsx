'use client';

import { motion } from 'framer-motion';
import { GitBranch, GitCommit, AlertTriangle, CheckCircle2, Clock, User, Zap, ExternalLink } from 'lucide-react';
import { mockDeployments } from '@/lib/mock-data';

function getRiskColor(risk: number) {
  if (risk >= 80) return '#EF4444';
  if (risk >= 50) return '#F97316';
  if (risk >= 25) return '#F59E0B';
  return '#22C55E';
}

function getRiskLabel(risk: number) {
  if (risk >= 80) return 'High Risk';
  if (risk >= 50) return 'Medium Risk';
  if (risk >= 25) return 'Low Risk';
  return 'Safe';
}

function getTimeSince(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m ago`;
  return `${hours}h ${mins % 60}m ago`;
}

const EXTRA_DEPLOYMENTS = [
  { id: 'dep-005', service: 'user-service', version: 'v3.4.1', environment: 'production', status: 'safe', timestamp: new Date(Date.now() - 12 * 3600000), author: 'priya.s', commitHash: 'e4c2b1a', prTitle: 'feat: user preferences API v2', aiRisk: 8 },
  { id: 'dep-006', service: 'notification-service', version: 'v2.0.7', environment: 'staging', status: 'safe', timestamp: new Date(Date.now() - 18 * 3600000), author: 'david.k', commitHash: 'f5d3c2b', prTitle: 'fix: email template rendering', aiRisk: 5 },
  { id: 'dep-007', service: 'inventory-service', version: 'v1.12.3', environment: 'production', status: 'safe', timestamp: new Date(Date.now() - 24 * 3600000), author: 'alex.r', commitHash: 'g6e4d3c', prTitle: 'perf: stock check query optimization', aiRisk: 15 },
];

const allDeploys = [...mockDeployments, ...EXTRA_DEPLOYMENTS];

export default function DeploymentsPage() {
  const suspicious = allDeploys.filter(d => d.status === 'suspicious').length;
  const safe = allDeploys.filter(d => d.status === 'safe').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            Deployment Timeline
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-analyzed deployment impact correlation</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
            <AlertTriangle className="w-3 h-3" /> {suspicious} Suspicious
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300">
            <CheckCircle2 className="w-3 h-3" /> {safe} Safe
          </span>
        </div>
      </div>

      {/* AI warning banner */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Zap className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-red-300">AI Deployment Correlation Alert</div>
          <div className="text-xs text-slate-400 mt-0.5">
            <span className="font-mono text-red-300">payment-service v2.3.1</span> deployed 38 minutes ago is
            <span className="text-red-300 font-semibold"> 99% correlated</span> with INC-2847 — N+1 query pattern introduced in commit <span className="font-mono">a8f2c3d</span>
          </div>
        </div>
        <button className="text-xs text-red-300 hover:text-red-200 flex items-center gap-1 flex-shrink-0">
          Investigate <ExternalLink className="w-3 h-3" />
        </button>
      </motion.div>

      {/* Deployment list */}
      <div className="space-y-3">
        {allDeploys.map((dep, i) => {
          const riskColor = getRiskColor(dep.aiRisk);
          const riskLabel = getRiskLabel(dep.aiRisk);
          return (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-5"
              style={dep.status === 'suspicious' ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' } : {}}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}25` }}>
                  <GitCommit className="w-5 h-5" style={{ color: riskColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{dep.service}</span>
                    <span className="font-mono text-xs text-slate-400">{dep.version}</span>
                    <span className={`badge ${dep.environment === 'production' ? 'badge-critical' : 'badge-info'}`}>{dep.environment}</span>
                    {dep.status === 'suspicious' && (
                      <span className="badge badge-critical animate-pulse-glow">⚠ Suspicious</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{dep.prTitle}</div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><GitCommit className="w-3 h-3" /><span className="font-mono">{dep.commitHash}</span></span>
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{dep.author}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{getTimeSince(dep.timestamp)}</span>
                  </div>
                </div>

                {/* AI Risk Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-slate-500 mb-1">AI Risk</div>
                  <div className="text-2xl font-bold font-mono" style={{ color: riskColor }}>{dep.aiRisk}</div>
                  <div className="text-xs font-semibold" style={{ color: riskColor }}>{riskLabel}</div>
                  <div className="mt-2 w-24 progress-bar">
                    <div className="progress-fill" style={{ width: `${dep.aiRisk}%`, background: riskColor }} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
