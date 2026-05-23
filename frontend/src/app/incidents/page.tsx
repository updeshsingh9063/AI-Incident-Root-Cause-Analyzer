'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Filter, Search, SortDesc, RefreshCw, Plus } from 'lucide-react';
import { mockIncidents } from '@/lib/mock-data';
import { IncidentCard } from '@/components/IncidentCard';

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'];
const STATUSES = ['all', 'investigating', 'mitigating', 'resolved'];

export default function IncidentsPage() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockIncidents.filter(inc => {
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchesSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.service.toLowerCase().includes(search.toLowerCase()) || inc.id.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const counts = {
    critical: mockIncidents.filter(i => i.severity === 'critical').length,
    high: mockIncidents.filter(i => i.severity === 'high').length,
    medium: mockIncidents.filter(i => i.severity === 'medium').length,
    investigating: mockIncidents.filter(i => i.status === 'investigating').length,
    resolved: mockIncidents.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Active Incidents
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time incident tracking with AI-powered root cause analysis</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#050816]"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #3B82F6)' }}
        >
          <Plus className="w-4 h-4" />
          Create Incident
        </motion.button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Critical', count: counts.critical, color: '#EF4444' },
          { label: 'High', count: counts.high, color: '#F97316' },
          { label: 'Medium', count: counts.medium, color: '#F59E0B' },
          { label: 'Investigating', count: counts.investigating, color: '#7C3AED' },
          { label: 'Resolved', count: counts.resolved, color: '#22C55E' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-3 text-center cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => {
              if (['critical', 'high', 'medium', 'low'].includes(item.label.toLowerCase()))
                setSeverityFilter(item.label.toLowerCase());
              else setStatusFilter(item.label.toLowerCase());
            }}
          >
            <div className="text-2xl font-bold font-mono" style={{ color: item.color }}>{item.count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title, service..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>

        {/* Severity */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {SEVERITIES.map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                severityFilter === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 ml-auto">
          <SortDesc className="w-3.5 h-3.5 text-slate-500" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                statusFilter === s
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No incidents match your filters</p>
          </div>
        ) : (
          filtered.map((inc, i) => <IncidentCard key={inc.id} incident={inc} index={i} />)
        )}
      </div>
    </div>
  );
}
