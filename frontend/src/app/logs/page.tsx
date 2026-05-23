'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Download, Pause, Play, Search, Filter } from 'lucide-react';
import { mockLogs } from '@/lib/mock-data';
import LiveLogs from '@/components/LiveLogs';

const EXTRA_LOGS = [
  { id: 11, timestamp: new Date(Date.now() - 1000), level: 'error', service: 'payment-service', pod: 'payment-svc-7d9f8b-xk2p4', message: 'CRITICAL: Transaction commit timeout 12000ms — rolling back', trace: 'trace-k1f7c3b9' },
  { id: 12, timestamp: new Date(Date.now() - 3000), level: 'warn', service: 'redis-cluster', pod: 'redis-cluster-0', message: 'Memory usage at 78.2% — approaching eviction threshold', trace: null },
  { id: 13, timestamp: new Date(Date.now() - 6000), level: 'info', service: 'k8s-hpa', pod: 'kube-system', message: 'HPA payment-service: current=12, desired=20, scaling up', trace: null },
  { id: 14, timestamp: new Date(Date.now() - 9000), level: 'error', service: 'order-service', pod: 'order-svc-6c8f4a-mn3r1', message: 'Upstream payment-service returned 503: Service Unavailable', trace: 'trace-l4a8c2d6' },
];

export default function LogsPage() {
  const [logs, setLogs] = useState([...mockLogs, ...EXTRA_LOGS].sort((a, b) => b.id - a.id));
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const services = ['payment-service', 'auth-service', 'order-service', 'api-gateway', 'redis-cluster'];
      const levels: Array<'error' | 'warn' | 'info'> = ['error', 'error', 'warn', 'info', 'info', 'info'];
      const messages = [
        'Connection pool: 98/100 connections active',
        'Query latency spike detected: 7840ms',
        'Retry attempt 4/5 for payment endpoint',
        'Cache MISS: session lookup exceeded 800ms',
        'Health check passing for /api/v1/health',
        'Processed 124 requests in last 5 seconds',
      ];
      const newLog = {
        id: Date.now(),
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        service: services[Math.floor(Math.random() * services.length)],
        pod: 'pod-auto-' + Math.random().toString(36).slice(2, 8),
        message: messages[Math.floor(Math.random() * messages.length)],
        trace: Math.random() > 0.5 ? 'trace-' + Math.random().toString(36).slice(2, 10) : null,
      };
      setLogs(prev => [newLog, ...prev].slice(0, 200));
    }, 2000);
    return () => clearInterval(interval);
  }, [paused]);

  const services = ['all', ...new Set(logs.map(l => l.service))];
  const filtered = logs.filter(l => {
    const matchesService = serviceFilter === 'all' || l.service === serviceFilter;
    const matchesFilter = !filter || l.message.toLowerCase().includes(filter.toLowerCase()) || l.service.includes(filter.toLowerCase());
    return matchesService && matchesFilter;
  });

  const counts = {
    error: logs.filter(l => l.level === 'error').length,
    warn: logs.filter(l => l.level === 'warn').length,
    info: logs.filter(l => l.level === 'info').length,
  };

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-cyan-400" />
            Live Log Explorer
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time aggregated log stream · AI anomaly detection enabled</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 text-xs mr-4">
            <span className="text-red-400 font-mono font-semibold">{counts.error} ERR</span>
            <span className="text-amber-400 font-mono font-semibold">{counts.warn} WARN</span>
            <span className="text-slate-500 font-mono">{counts.info} INFO</span>
          </div>
          <button
            onClick={() => setPaused(!paused)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              paused
                ? 'bg-green-500/10 border-green-500/30 text-green-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-slate-400 hover:text-slate-200 transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter logs..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <div className="flex gap-1 overflow-x-auto">
          {services.map(svc => (
            <button
              key={svc}
              onClick={() => setServiceFilter(svc)}
              className={`text-xs px-2.5 py-1.5 rounded-lg capitalize font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                serviceFilter === svc
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
      </div>

      {/* Log terminal - takes remaining space */}
      <div className="flex-1 min-h-0">
        <LiveLogs logs={filtered} autoScroll={!paused} maxHeight="100%" />
      </div>
    </div>
  );
}
