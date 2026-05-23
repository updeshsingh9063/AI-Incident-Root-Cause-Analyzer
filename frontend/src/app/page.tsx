'use client';

import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, Brain, Clock, Server,
  TrendingDown, TrendingUp, Zap, Shield, Radio, CheckCircle2
} from 'lucide-react';
import { mockIncidents, mockMetrics, mockServices, mockLogs } from '@/lib/mock-data';
import { IncidentCard } from '@/components/IncidentCard';
import { MetricChart, StatCard } from '@/components/MetricCharts';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import LiveLogs from '@/components/LiveLogs';

const activeIncidents = mockIncidents.filter(i => i.status !== 'resolved');
const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;

export default function OverviewPage() {
  const healthyServices = mockServices.filter(s => s.status === 'healthy').length;
  const degradedServices = mockServices.filter(s => s.status === 'degraded').length;
  const criticalServices = mockServices.filter(s => s.status === 'critical').length;

  return (
    <div className="p-6 space-y-6">

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.15)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </motion.div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-300">
              {criticalCount} Critical Incident{criticalCount > 1 ? 's' : ''} Active
            </div>
            <div className="text-xs text-red-400/70 mt-0.5">
              Payment service P99 latency at 8.2s · AI has identified root cause with 94% confidence
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div className="flex items-center gap-1.5 text-xs text-red-300 font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Radio className="w-3 h-3" />
              Live Investigation
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard label="Active Incidents" value={activeIncidents.length} color="#EF4444"
          icon={<AlertTriangle size={16} />} change={-23} index={0} description="vs last week" />
        <StatCard label="MTTR" value="23" unit="min" color="#F59E0B"
          icon={<Clock size={16} />} change={-51} index={1} description="↓ from 47min" />
        <StatCard label="MTTA" value="4.2" unit="min" color="#00E5FF"
          icon={<Zap size={16} />} change={-46} index={2} description="↓ from 7.8min" />
        <StatCard label="Services Healthy" value={`${healthyServices}/${mockServices.length}`} color="#22C55E"
          icon={<Server size={16} />} index={3} description={`${criticalServices} critical`} />
        <StatCard label="AI Accuracy" value="91.3" unit="%" color="#7C3AED"
          icon={<Brain size={16} />} change={3.5} index={4} description="root cause detection" />
        <StatCard label="Uptime (30d)" value="99.94" unit="%" color="#22C55E"
          icon={<Shield size={16} />} index={5} description="SLA: 99.9%" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Incidents + Charts */}
        <div className="xl:col-span-2 space-y-6">

          {/* Active Incidents */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Active Incidents
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 font-mono">
                  {activeIncidents.length}
                </span>
              </h2>
              <a href="/incidents" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {activeIncidents.map((inc, i) => (
                <IncidentCard key={inc.id} incident={inc} index={i} />
              ))}
            </div>
          </section>

          {/* Metrics Charts 2x2 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              System Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Error Rate */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }} className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Error Rate</span>
                  <span className="text-red-400 font-mono text-sm font-semibold">
                    {mockMetrics.errorRate[mockMetrics.errorRate.length - 1].value.toFixed(1)}%
                  </span>
                </div>
                <MetricChart data={mockMetrics.errorRate} type="area" color="#EF4444" height={100} unit="%" />
              </motion.div>

              {/* Latency */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }} className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">P99 Latency</span>
                  <span className="text-amber-400 font-mono text-sm font-semibold">
                    {(mockMetrics.latency[mockMetrics.latency.length - 1].p99 / 1).toFixed(0)}ms
                  </span>
                </div>
                <MetricChart data={mockMetrics.latency} type="multiline" height={100} unit="ms" />
              </motion.div>

              {/* CPU */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }} className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">CPU Usage</span>
                  <span className="text-cyan-400 font-mono text-sm font-semibold">
                    {mockMetrics.cpu[mockMetrics.cpu.length - 1].value.toFixed(1)}%
                  </span>
                </div>
                <MetricChart data={mockMetrics.cpu} type="area" color="#00E5FF" height={100} unit="%" threshold={80} />
              </motion.div>

              {/* Requests/s */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }} className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Requests/s</span>
                  <span className="text-green-400 font-mono text-sm font-semibold">
                    {(mockMetrics.requests[mockMetrics.requests.length - 1].value / 1000).toFixed(1)}k
                  </span>
                </div>
                <MetricChart data={mockMetrics.requests} type="bar" color="#22C55E" height={100} unit="/s" />
              </motion.div>
            </div>
          </section>

          {/* Service Health Grid */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Service Health
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="status-dot status-dot-green" /> Healthy ({healthyServices})</span>
                <span className="flex items-center gap-1"><span className="status-dot status-dot-amber" /> Degraded ({degradedServices})</span>
                <span className="flex items-center gap-1"><span className="status-dot status-dot-red" /> Critical ({criticalServices})</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mockServices.slice(0, 9).map((svc, i) => {
                const dotClass = svc.status === 'healthy' ? 'status-dot-green' : svc.status === 'critical' ? 'status-dot-red' : 'status-dot-amber';
                const healthColor = svc.status === 'healthy' ? '#22C55E' : svc.status === 'critical' ? '#EF4444' : '#F59E0B';
                return (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card p-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`status-dot ${dotClass} ${svc.status !== 'healthy' ? 'animate-pulse-dot' : ''}`} />
                      <span className="text-xs font-medium text-white truncate flex-1">{svc.name}</span>
                    </div>
                    <div className="progress-bar mb-1.5">
                      <motion.div
                        className="progress-fill"
                        style={{ background: healthColor, width: `${svc.health}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${svc.health}%` }}
                        transition={{ delay: i * 0.04 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span style={{ color: healthColor }} className="font-mono font-semibold">{svc.health}%</span>
                      <span className="font-mono">{svc.errors.toFixed(1)}% err</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: AI Panel + Live Logs */}
        <div className="space-y-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <AIInsightsPanel />
          </motion.div>

          {/* Live Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Live Log Stream</span>
              <motion.div
                className="ml-auto w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <LiveLogs logs={mockLogs} compact maxHeight="280px" />
          </motion.div>

          {/* Recent Resolved */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Recently Resolved
            </h3>
            <div className="space-y-2">
              {mockIncidents.filter(i => i.status === 'resolved').map(inc => (
                <div key={inc.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <span className="status-dot status-dot-green" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-300 truncate">{inc.title}</div>
                    <div className="text-xs text-slate-600 font-mono">
                      MTTR: {inc.mttr ? Math.floor(inc.mttr / 60000) + 'm' : 'N/A'}
                    </div>
                  </div>
                  <span className="text-xs text-green-400 font-mono flex-shrink-0">{inc.aiConfidence}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
