'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Layers, Search, Brain, CheckCircle2, Clock, TrendingDown,
  AlertTriangle, Filter, ChevronRight, Calendar, BarChart2
} from 'lucide-react';
import { mockIncidents } from '@/lib/mock-data';
import { getSeverityColor } from '@/lib/utils';

// Extended historical data
const HISTORICAL = [
  ...mockIncidents,
  { id: 'INC-2842', title: 'Elasticsearch Index Corruption — Search Degraded', severity: 'high', status: 'resolved', service: 'elasticsearch', startedAt: new Date(Date.now() - 2 * 86400000), aiConfidence: 97, rootCause: 'Disk I/O saturation during bulk index operation caused partial shard corruption', mttr: 35 * 60000, assignee: 'Marcus Johnson', tags: ['elasticsearch', 'disk', 'index'], affectedServices: [], description: '', environment: 'production', region: 'us-east-1' },
  { id: 'INC-2841', title: 'Kafka Consumer Lag — Event Processing Delay', severity: 'medium', status: 'resolved', service: 'kafka-cluster', startedAt: new Date(Date.now() - 3 * 86400000), aiConfidence: 89, rootCause: 'Under-provisioned consumer group — 2 of 8 consumers crashed due to OOM', mttr: 19 * 60000, assignee: 'Alex Rivera', tags: ['kafka', 'events', 'lag'], affectedServices: [], description: '', environment: 'production', region: 'us-west-2' },
  { id: 'INC-2840', title: 'Kubernetes PVC ReadOnly — Stateful Services Failing', severity: 'critical', status: 'resolved', service: 'k8s-storage', startedAt: new Date(Date.now() - 4 * 86400000), aiConfidence: 93, rootCause: 'EBS volume reached inode limit — filesystem mounted as read-only by kernel', mttr: 47 * 60000, assignee: 'Sarah Chen', tags: ['kubernetes', 'storage', 'ebs'], affectedServices: [], description: '', environment: 'production', region: 'us-east-1' },
  { id: 'INC-2839', title: 'SSL Certificate Expiry — API Gateway TLS Errors', severity: 'high', status: 'resolved', service: 'api-gateway', startedAt: new Date(Date.now() - 5 * 86400000), aiConfidence: 99, rootCause: 'Automated cert renewal failed silently — cert expired at 00:00 UTC', mttr: 8 * 60000, assignee: 'Priya Sharma', tags: ['ssl', 'certificate', 'tls'], affectedServices: [], description: '', environment: 'production', region: 'global' },
  { id: 'INC-2838', title: 'RDS Read Replica Failover — Increased Latency', severity: 'medium', status: 'resolved', service: 'postgres-cluster', startedAt: new Date(Date.now() - 6 * 86400000), aiConfidence: 91, rootCause: 'Primary instance CPU spike triggered automatic failover to read replica lag', mttr: 12 * 60000, assignee: 'David Kim', tags: ['database', 'rds', 'failover'], affectedServices: [], description: '', environment: 'production', region: 'eu-west-1' },
  { id: 'INC-2837', title: 'GraphQL Query Timeout — Nested Resolvers', severity: 'medium', status: 'resolved', service: 'graphql-gateway', startedAt: new Date(Date.now() - 7 * 86400000), aiConfidence: 85, rootCause: 'Deeply nested query bypassing DataLoader batching — N+1 pattern in user resolver', mttr: 28 * 60000, assignee: 'Sarah Chen', tags: ['graphql', 'timeout', 'query'], affectedServices: [], description: '', environment: 'production', region: 'us-east-1' },
];

const SEVERITY_COLORS: Record<string, string> = { critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#22C55E' };

const STATS = [
  { label: 'Total Incidents', value: '847', sub: 'last 90 days', color: '#00E5FF', icon: Layers },
  { label: 'Avg MTTR', value: '23m', sub: '↓51% vs prev period', color: '#F59E0B', icon: Clock },
  { label: 'AI Accuracy', value: '91.3%', sub: 'root cause detection', color: '#7C3AED', icon: Brain },
  { label: 'Resolved', value: '99.1%', sub: 'resolution rate', color: '#22C55E', icon: CheckCircle2 },
];

function getTimeSince(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filtered = HISTORICAL.filter(inc => {
    const matchSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.service.toLowerCase().includes(search.toLowerCase()) || inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.rootCause.toLowerCase().includes(search.toLowerCase()) || inc.tags.some(t => t.includes(search.toLowerCase()));
    const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-cyan-400" />
            Incident History
          </h1>
          <p className="text-slate-500 text-sm mt-1">Historical database with AI-powered semantic search and pattern detection</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#A78BFA' }}>
          <Brain className="w-3.5 h-3.5" />
          RAG Memory: 847 incidents indexed
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Heatmap Row */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Incident Frequency (Last 30 Days)</span>
          <span className="ml-auto text-xs text-slate-500">Higher intensity = more incidents</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 30 }, (_, i) => {
            const count = Math.floor(Math.random() * 6);
            const opacity = count === 0 ? 0.05 : count < 2 ? 0.25 : count < 4 ? 0.55 : 0.9;
            const color = count === 0 ? '#374151' : count < 2 ? '#7C3AED' : count < 4 ? '#F97316' : '#EF4444';
            return (
              <div key={i} title={`Day ${30 - i}: ${count} incidents`}
                className="w-8 h-8 rounded-md cursor-pointer hover:scale-110 transition-transform"
                style={{ background: color, opacity }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
          <span>Less</span>
          {[0.1, 0.3, 0.55, 0.75, 0.95].map((o, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ background: '#7C3AED', opacity: o }} />
          ))}
          <span>More</span>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Semantic search: 'database timeout', 'memory leak', 'deploy regression'..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-purple-500/40 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg capitalize font-medium transition-all ${
                severityFilter === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">{filtered.length} incidents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left px-5 py-3">Incident</th>
                <th className="text-left px-3 py-3">Service</th>
                <th className="text-left px-3 py-3">Root Cause</th>
                <th className="text-right px-3 py-3">MTTR</th>
                <th className="text-right px-3 py-3">AI Conf.</th>
                <th className="text-right px-3 py-3">When</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((inc, i) => {
                const sCol = getSeverityColor(inc.severity);
                return (
                  <motion.tr key={inc.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: sCol, boxShadow: `0 0 6px ${sCol}` }} />
                        <div>
                          <div className="text-xs font-mono text-slate-500">{inc.id}</div>
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors max-w-xs truncate">{inc.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-xs text-slate-400 font-mono">{inc.service}</span>
                    </td>
                    <td className="px-3 py-3.5 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <Brain className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-500 line-clamp-1">{inc.rootCause}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-mono font-semibold text-amber-400">
                        {inc.mttr ? `${Math.floor(inc.mttr / 60000)}m` : <span className="text-red-400">Active</span>}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-mono font-bold"
                        style={{ color: inc.aiConfidence >= 90 ? '#22C55E' : inc.aiConfidence >= 75 ? '#F59E0B' : '#EF4444' }}>
                        {inc.aiConfidence}%
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs text-slate-500 font-mono">{getTimeSince(inc.startedAt)}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Link href={`/incidents/${inc.id}`}>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pattern Detection */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5" style={{ border: '1px solid rgba(124,58,237,0.15)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">AI Pattern Detection</span>
          <span className="ml-auto badge badge-info text-xs">3 patterns found</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { pattern: 'Database Saturation', count: 12, trend: 'increasing', desc: 'DB connection pool issues recurring every ~8 days', color: '#EF4444' },
            { pattern: 'Deployment Regression', count: 8, trend: 'stable', desc: 'New deployments correlated with 34% of incidents', color: '#F97316' },
            { pattern: 'Memory Leak Cycle', count: 5, trend: 'decreasing', desc: 'Memory leak pattern resolving after pod restarts', color: '#F59E0B' },
          ].map(p => (
            <div key={p.pattern} className="rounded-xl p-4"
              style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: p.color }}>{p.pattern}</span>
                <span className="text-xl font-bold font-mono" style={{ color: p.color }}>{p.count}x</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <TrendingDown className="w-3 h-3" style={{ color: p.color }} />
                <span style={{ color: p.color }}>{p.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
