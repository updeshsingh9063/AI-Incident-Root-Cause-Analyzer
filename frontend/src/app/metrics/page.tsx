'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Activity, Cpu, HardDrive, Wifi, AlertTriangle } from 'lucide-react';
import { MetricChart, StatCard } from '@/components/MetricCharts';
import { mockMetrics } from '@/lib/mock-data';

export default function MetricsPage() {
  const lastCpu = mockMetrics.cpu[mockMetrics.cpu.length - 1].value;
  const lastMem = mockMetrics.memory[mockMetrics.memory.length - 1].value;
  const lastP99 = mockMetrics.latency[mockMetrics.latency.length - 1].p99 ?? 0;
  const lastErr = mockMetrics.errorRate[mockMetrics.errorRate.length - 1].value;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Metrics Correlation
        </h1>
        <p className="text-slate-500 text-sm mt-1">Real-time infrastructure metrics with AI correlation engine</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CPU Usage" value={lastCpu.toFixed(1)} unit="%" color="#00E5FF" icon={<Cpu size={16} />} index={0} change={12} />
        <StatCard label="Memory Usage" value={lastMem.toFixed(1)} unit="%" color="#7C3AED" icon={<HardDrive size={16} />} index={1} change={5} />
        <StatCard label="P99 Latency" value={(lastP99 / 1).toFixed(0)} unit="ms" color="#EF4444" icon={<Activity size={16} />} index={2} change={1730} />
        <StatCard label="Error Rate" value={lastErr.toFixed(1)} unit="%" color="#F97316" icon={<AlertTriangle size={16} />} index={3} change={3300} />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency percentiles */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Latency Percentiles</h3>
              <p className="text-xs text-slate-500 mt-0.5">P50 · P95 · P99</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-400 rounded inline-block" /> P50</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 rounded inline-block" /> P95</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded inline-block" /> P99</span>
            </div>
          </div>
          <MetricChart data={mockMetrics.latency} type="multiline" height={200} unit="ms" showGrid />
          <div className="mt-3 p-2.5 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <AlertTriangle className="w-3 h-3 text-red-400 inline mr-1.5" />
            <span className="text-red-300">P99 latency 182x above baseline — payment-service DB queries identified as root cause</span>
          </div>
        </motion.div>

        {/* Error Rate */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Error Rate</h3>
              <p className="text-xs text-slate-500 mt-0.5">5xx responses across all services</p>
            </div>
            <span className="text-red-400 font-mono text-lg font-bold">{lastErr.toFixed(1)}%</span>
          </div>
          <MetricChart data={mockMetrics.errorRate} type="area" color="#EF4444" height={200} unit="%" showGrid threshold={5} />
        </motion.div>

        {/* CPU Usage */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">CPU Utilization</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cluster-wide average</p>
            </div>
            <span className="text-cyan-400 font-mono text-lg font-bold">{lastCpu.toFixed(1)}%</span>
          </div>
          <MetricChart data={mockMetrics.cpu} type="area" color="#00E5FF" height={200} unit="%" showGrid threshold={80} />
        </motion.div>

        {/* Memory */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Memory Usage</h3>
              <p className="text-xs text-slate-500 mt-0.5">Across all pods</p>
            </div>
            <span className="text-purple-400 font-mono text-lg font-bold">{lastMem.toFixed(1)}%</span>
          </div>
          <MetricChart data={mockMetrics.memory} type="area" color="#7C3AED" height={200} unit="%" showGrid threshold={85} />
        </motion.div>

        {/* Requests/s */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Request Throughput</h3>
              <p className="text-xs text-slate-500 mt-0.5">Requests per second across API gateway</p>
            </div>
            <span className="text-green-400 font-mono text-lg font-bold">
              {(mockMetrics.requests[mockMetrics.requests.length - 1].value / 1000).toFixed(1)}k/s
            </span>
          </div>
          <MetricChart data={mockMetrics.requests} type="bar" color="#22C55E" height={180} unit="/s" showGrid />
        </motion.div>
      </div>

      {/* Correlation insights */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-purple-400" />
          AI Correlation Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'DB latency → P99', correlation: 0.97, desc: 'Near-perfect positive correlation', color: '#EF4444' },
            { label: 'CPU → Error Rate', correlation: 0.84, desc: 'Strong positive correlation detected', color: '#F97316' },
            { label: 'Deploy v2.3.1 → Errors', correlation: 0.99, desc: 'Causal relationship confirmed', color: '#EF4444' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <div className="text-xs font-semibold text-white mb-1">{item.label}</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 progress-bar">
                  <div className="progress-fill" style={{ width: `${item.correlation * 100}%`, background: item.color }} />
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: item.color }}>
                  {item.correlation.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
