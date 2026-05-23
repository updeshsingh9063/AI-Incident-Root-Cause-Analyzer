'use client';

import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, Brain, Clock, Server,
  TrendingDown, Zap, Shield, Radio, CheckCircle2,
  ArrowUpRight, Flame, BarChart2
} from 'lucide-react';
import { mockIncidents, mockMetrics, mockServices, mockLogs } from '@/lib/mock-data';
import { IncidentCard } from '@/components/IncidentCard';
import { MetricChart, StatCard } from '@/components/MetricCharts';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import LiveLogs from '@/components/LiveLogs';
import Link from 'next/link';

const activeIncidents  = mockIncidents.filter(i => i.status !== 'resolved');
const resolvedIncidents = mockIncidents.filter(i => i.status === 'resolved');
const criticalCount    = activeIncidents.filter(i => i.severity === 'critical').length;

/* ── tiny section header ── */
function SectionHeader({
  icon: Icon,
  title,
  iconColor = '#00E5FF',
  iconBg = 'rgba(0,229,255,0.1)',
  badge,
  action,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  iconColor?: string;
  iconBg?: string;
  badge?: string | number;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconColor}22` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <h2 className="text-[13.5px] font-bold text-white/90 tracking-tight">{title}</h2>
      {badge !== undefined && (
        <span
          className="text-[10.5px] font-bold px-2 py-0.5 rounded-full font-mono"
          style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.22)',
            color: '#FCA5A5',
          }}
        >
          {badge}
        </span>
      )}
      {action && actionHref && (
        <Link
          href={actionHref}
          className="ml-auto flex items-center gap-1 text-[11.5px] text-cyan-500 hover:text-cyan-300 font-medium transition-colors group"
        >
          {action}
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

/* ── metric card wrapper ── */
function MetricCardWrapper({
  label, valueNode, color, delay,
}: {
  label: string;
  valueNode: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="card-3d p-4 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10.5px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </span>
        {valueNode}
      </div>
    </motion.div>
  );
}

export default function OverviewPage() {
  const healthyServices  = mockServices.filter(s => s.status === 'healthy').length;
  const degradedServices = mockServices.filter(s => s.status === 'degraded').length;
  const criticalServices = mockServices.filter(s => s.status === 'critical').length;

  return (
    <div className="p-5 space-y-5 min-h-full">

      {/* ── Critical Alert Banner ── */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          {/* animated top line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.7), transparent)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="flex items-center gap-4 px-4 py-3">
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.14)' }}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-4.5 h-4.5 text-red-400" strokeWidth={2} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-red-300">
                {criticalCount} Critical Incident{criticalCount > 1 ? 's' : ''} Active
              </div>
              <div className="text-[11.5px] text-red-400/60 mt-0.5">
                Payment service P99 latency at 8.2s · AI identified root cause with 94% confidence
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-red-300"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Radio className="w-3 h-3" />
                Live Investigation
              </motion.div>
              <Link href="/incidents">
                <button
                  className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#FCA5A5',
                  }}
                >
                  Investigate →
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          label="Active Incidents" value={activeIncidents.length}
          color="#EF4444" icon={<AlertTriangle size={15} />}
          change={-23} index={0} description="vs last week"
        />
        <StatCard
          label="MTTR" value="23" unit="min"
          color="#F59E0B" icon={<Clock size={15} />}
          change={-51} index={1} description="↓ from 47min"
        />
        <StatCard
          label="MTTA" value="4.2" unit="min"
          color="#00E5FF" icon={<Zap size={15} />}
          change={-46} index={2} description="↓ from 7.8min"
        />
        <StatCard
          label="Services OK" value={`${healthyServices}/${mockServices.length}`}
          color="#22C55E" icon={<Server size={15} />}
          index={3} description={`${criticalServices} critical`}
        />
        <StatCard
          label="AI Accuracy" value="91.3" unit="%"
          color="#7C3AED" icon={<Brain size={15} />}
          change={3.5} index={4} description="root cause"
        />
        <StatCard
          label="Uptime (30d)" value="99.94" unit="%"
          color="#10B981" icon={<Shield size={15} />}
          index={5} description="SLA: 99.9%"
        />
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ══ Left 2 cols ══ */}
        <div className="xl:col-span-2 space-y-5">

          {/* Active Incidents */}
          <section>
            <SectionHeader
              icon={AlertTriangle} title="Active Incidents"
              iconColor="#EF4444" iconBg="rgba(239,68,68,0.1)"
              badge={activeIncidents.length}
              action="View all" actionHref="/incidents"
            />
            <div className="space-y-2.5">
              {activeIncidents.map((inc, i) => (
                <IncidentCard key={inc.id} incident={inc} index={i} />
              ))}
            </div>
          </section>

          {/* Metrics 2×2 */}
          <section>
            <SectionHeader
              icon={Activity} title="System Metrics"
              iconColor="#00E5FF" iconBg="rgba(0,229,255,0.08)"
              action="Full dashboard" actionHref="/metrics"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Error Rate */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }} className="card-3d p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-600">Error Rate</span>
                  <span className="text-red-400 font-mono text-[13px] font-bold tabular-nums">
                    {mockMetrics.errorRate[mockMetrics.errorRate.length - 1].value.toFixed(1)}%
                  </span>
                </div>
                <MetricChart data={mockMetrics.errorRate} type="area" color="#EF4444" height={88} unit="%" />
              </motion.div>

              {/* Latency */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.13 }} className="card-3d p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-600">P99 Latency</span>
                  <span className="text-amber-400 font-mono text-[13px] font-bold tabular-nums">
                    {mockMetrics.latency[mockMetrics.latency.length - 1].p99?.toFixed(0)}ms
                  </span>
                </div>
                <MetricChart data={mockMetrics.latency} type="multiline" height={88} unit="ms" />
              </motion.div>

              {/* CPU */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }} className="card-3d p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-600">CPU Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${mockMetrics.cpu[mockMetrics.cpu.length - 1].value}%`,
                          background: mockMetrics.cpu[mockMetrics.cpu.length - 1].value > 80
                            ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                            : 'linear-gradient(90deg, #00E5FF, #3B82F6)',
                        }}
                      />
                    </div>
                    <span className="text-cyan-400 font-mono text-[13px] font-bold tabular-nums">
                      {mockMetrics.cpu[mockMetrics.cpu.length - 1].value.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <MetricChart data={mockMetrics.cpu} type="area" color="#00E5FF" height={88} unit="%" threshold={80} />
              </motion.div>

              {/* Requests/s */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.23 }} className="card-3d p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-600">Requests/s</span>
                  <span className="text-green-400 font-mono text-[13px] font-bold tabular-nums">
                    {(mockMetrics.requests[mockMetrics.requests.length - 1].value / 1000).toFixed(1)}k
                  </span>
                </div>
                <MetricChart data={mockMetrics.requests} type="bar" color="#22C55E" height={88} unit="/s" />
              </motion.div>
            </div>
          </section>

          {/* Service Health */}
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.18)' }}
              >
                <Server className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
              </div>
              <h2 className="text-[13.5px] font-bold text-white/90">Service Health</h2>
              <div className="flex items-center gap-3 ml-auto text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="status-dot status-dot-green" /> {healthyServices} healthy
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="status-dot status-dot-amber" /> {degradedServices} degraded
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="status-dot status-dot-red" /> {criticalServices} critical
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mockServices.slice(0, 9).map((svc, i) => {
                const color = svc.status === 'healthy' ? '#22C55E'
                            : svc.status === 'critical' ? '#EF4444' : '#F59E0B';
                const dotClass = svc.status === 'healthy' ? 'status-dot-green'
                               : svc.status === 'critical' ? 'status-dot-red' : 'status-dot-amber';
                return (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="card-3d px-3 py-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`status-dot ${dotClass} ${svc.status !== 'healthy' ? 'animate-pulse-dot' : ''}`} />
                      <span className="text-[12px] font-semibold text-white/80 truncate flex-1 group-hover:text-white transition-colors">
                        {svc.name}
                      </span>
                    </div>

                    <div className="progress-bar mb-1.5">
                      <motion.div
                        className="progress-fill"
                        style={{ background: color, width: `${svc.health}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${svc.health}%` }}
                        transition={{ delay: i * 0.04 + 0.3, duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold font-mono tabular-nums" style={{ color }}>
                        {svc.health}%
                      </span>
                      <span className="text-[10.5px] text-slate-700 font-mono">
                        {svc.errors.toFixed(1)}% err
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ══ Right col ══ */}
        <div className="space-y-4">

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="card-3d p-4"
          >
            <AIInsightsPanel />
          </motion.div>

          {/* Live Logs */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />
              </div>
              <h2 className="text-[13.5px] font-bold text-white/90">Live Log Stream</h2>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <LiveLogs logs={mockLogs} compact maxHeight="260px" />
          </motion.div>

          {/* Recently Resolved */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card-3d p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.16)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
              </div>
              <h2 className="text-[13.5px] font-bold text-white/90">Recently Resolved</h2>
              <span
                className="ml-auto text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  color: '#86EFAC',
                }}
              >
                {resolvedIncidents.length}
              </span>
            </div>

            <div className="space-y-1">
              {resolvedIncidents.map((inc, i) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 py-2 group cursor-pointer rounded-lg px-2 hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: i < resolvedIncidents.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500/70 flex-shrink-0" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                      {inc.title}
                    </div>
                    <div className="text-[10.5px] text-slate-700 font-mono mt-0.5">
                      MTTR: {inc.mttr ? Math.floor(inc.mttr / 60000) + 'm' : 'N/A'}
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-mono font-bold flex-shrink-0"
                    style={{ color: inc.aiConfidence >= 85 ? '#86EFAC' : '#FCD34D' }}
                  >
                    {inc.aiConfidence}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
