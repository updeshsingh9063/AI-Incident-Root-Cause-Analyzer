'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Filter, Search, SortDesc, Plus,
  X, ChevronDown, Server, MapPin, User,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { mockIncidents } from '@/lib/mock-data';
import { IncidentCard } from '@/components/IncidentCard';

const API_BASE = '/api';

const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'];
const STATUSES   = ['all', 'investigating', 'mitigating', 'resolved'];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#22C55E',
};

const SERVICES = [
  'payment-service', 'auth-service', 'api-gateway', 'order-service',
  'user-service', 'product-catalog', 'inventory-service', 'fraud-detection',
];
const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'global'];
const ENVIRONMENTS = ['production', 'staging', 'development'];

/* ─── Create Incident Modal ─────────────────────────────────── */
function CreateIncidentModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (incident: any) => void;
}) {
  const [form, setForm] = useState({
    title: '', description: '', severity: 'high',
    service: '', region: 'us-east-1', environment: 'production',
    assignee: '', tags: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim())       errs.title   = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.service)            errs.service = 'Service is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          severity: form.severity,
          service: form.service,
          environment: form.environment,
          region: form.region,
          assignee: form.assignee,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        })
      });
      
      const newIncident = await res.json();
      setSuccess(true);
      await new Promise(r => setTimeout(r, 800));
      onCreate(newIncident);
      onClose();
    } catch (err) {
      console.error("Failed to create incident:", err);
      setSubmitting(false);
    }
  };

  const severityColor = SEVERITY_COLORS[form.severity] || '#94A3B8';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-lg pointer-events-auto rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(6, 10, 28, 0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-400" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white">Create New Incident</h2>
              <p className="text-[11px] text-slate-500">AI agents will begin analysis automatically</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Incident Title *
              </label>
              <input
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })); }}
                placeholder="e.g. Payment Service Latency Spike"
                className="w-full h-9 px-3 rounded-lg text-[13px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: errors.title ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                }}
              />
              {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })); }}
                placeholder="Describe the symptoms, impact, and any error messages observed..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] text-slate-200 placeholder:text-slate-600 outline-none resize-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: errors.description ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                }}
              />
              {errors.description && <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>}
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Severity
              </label>
              <div className="flex gap-2">
                {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, severity: sev }))}
                    className="flex-1 py-2 rounded-lg text-[11.5px] font-semibold capitalize transition-all"
                    style={{
                      background: form.severity === sev ? `${SEVERITY_COLORS[sev]}18` : 'rgba(255,255,255,0.03)',
                      border: form.severity === sev ? `1px solid ${SEVERITY_COLORS[sev]}40` : '1px solid rgba(255,255,255,0.07)',
                      color: form.severity === sev ? SEVERITY_COLORS[sev] : '#475569',
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Service + Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Affected Service *
                </label>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                  <select
                    value={form.service}
                    onChange={e => { setForm(f => ({ ...f, service: e.target.value })); setErrors(er => ({ ...er, service: '' })); }}
                    className="w-full h-9 pl-8 pr-3 rounded-lg text-[12.5px] text-slate-300 outline-none appearance-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: errors.service ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                    }}
                  >
                    <option value="" style={{ background: '#0c1020' }}>Select service</option>
                    {SERVICES.map(s => <option key={s} value={s} style={{ background: '#0c1020' }}>{s}</option>)}
                  </select>
                </div>
                {errors.service && <p className="text-[11px] text-red-400 mt-1">{errors.service}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                  <select
                    value={form.region}
                    onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                    className="w-full h-9 pl-8 pr-3 rounded-lg text-[12.5px] text-slate-300 outline-none appearance-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    {REGIONS.map(r => <option key={r} value={r} style={{ background: '#0c1020' }}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Assignee + Environment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                  <input
                    value={form.assignee}
                    onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                    placeholder="e.g. Sarah Chen"
                    className="w-full h-9 pl-8 pr-3 rounded-lg text-[12.5px] text-slate-300 placeholder:text-slate-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Environment
                </label>
                <select
                  value={form.environment}
                  onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg text-[12.5px] text-slate-300 outline-none appearance-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  {ENVIRONMENTS.map(env => <option key={env} value={env} style={{ background: '#0c1020' }}>{env}</option>)}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Tags <span className="text-slate-600 normal-case">(comma separated)</span>
              </label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="e.g. database, latency, payment"
                className="w-full h-9 px-3 rounded-lg text-[12.5px] text-slate-300 placeholder:text-slate-600 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
              />
            </div>

            {/* AI note */}
            <div
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)' }}
            >
              <AlertCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-purple-300/80 leading-relaxed">
                AI agents will begin root cause analysis automatically after incident creation. Results available within 30–60 seconds.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[12.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting || success}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)', color: '#fff' }}
            >
              {success ? (
                <><CheckCircle2 className="w-4 h-4" /> Created!</>
              ) : submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Incident</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([...mockIncidents]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [search, setSearch]                 = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [justCreated, setJustCreated]       = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/incidents`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length > 0) {
          const dbIncidents = data.data;
          const merged = [...dbIncidents];
          mockIncidents.forEach(mockInc => {
            if (!merged.find(i => i.id === mockInc.id)) {
              merged.push(mockInc);
            }
          });
          setIncidents(merged);
        }
      })
      .catch(err => console.error("Failed to fetch incidents", err));
  }, []);

  const filtered = incidents.filter(inc => {
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
    const matchesStatus   = statusFilter === 'all'   || inc.status   === statusFilter;
    const matchesSearch   = !search
      || inc.title.toLowerCase().includes(search.toLowerCase())
      || inc.service.toLowerCase().includes(search.toLowerCase())
      || inc.id.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const counts = {
    critical:     incidents.filter(i => i.severity === 'critical').length,
    high:         incidents.filter(i => i.severity === 'high').length,
    medium:       incidents.filter(i => i.severity === 'medium').length,
    investigating:incidents.filter(i => i.status   === 'investigating').length,
    resolved:     incidents.filter(i => i.status   === 'resolved').length,
  };

  const handleCreate = useCallback((newIncident: any) => {
    setIncidents(prev => [newIncident, ...prev]);
    setJustCreated(newIncident.id);
    setTimeout(() => setJustCreated(null), 4000);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Active Incidents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time incident tracking with AI-powered root cause analysis
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}
        >
          <Plus className="w-4 h-4" />
          Create Incident
        </motion.button>
      </div>

      {/* New incident toast */}
      <AnimatePresence>
        {justCreated && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-[13px] text-green-300 font-medium">
              Incident <strong className="font-mono">{justCreated}</strong> created — AI agents are analyzing the root cause
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Critical',      count: counts.critical,      color: '#EF4444', filter: () => setSeverityFilter('critical') },
          { label: 'High',          count: counts.high,          color: '#F97316', filter: () => setSeverityFilter('high') },
          { label: 'Medium',        count: counts.medium,        color: '#F59E0B', filter: () => setSeverityFilter('medium') },
          { label: 'Investigating', count: counts.investigating, color: '#7C3AED', filter: () => setStatusFilter('investigating') },
          { label: 'Resolved',      count: counts.resolved,      color: '#22C55E', filter: () => setStatusFilter('resolved') },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-3d p-3 text-center cursor-pointer hover:scale-[1.03] transition-transform active:scale-[0.97]"
            onClick={item.filter}
            style={{ border: `1px solid ${item.color}18` }}
          >
            <div className="text-2xl font-bold font-mono" style={{ color: item.color }}>
              {item.count}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-3d p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title, service..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {SEVERITIES.map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                severityFilter === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/[0.07]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 ml-auto">
          <SortDesc className="w-3.5 h-3.5 text-slate-500" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                statusFilter === s
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/[0.07]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Reset */}
        {(severityFilter !== 'all' || statusFilter !== 'all' || search) && (
          <button
            onClick={() => { setSeverityFilter('all'); setStatusFilter('all'); setSearch(''); }}
            className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-3d p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No incidents match your filters</p>
            <button
              onClick={() => { setSeverityFilter('all'); setStatusFilter('all'); setSearch(''); }}
              className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map((inc, i) => <IncidentCard key={inc.id} incident={inc} index={i} />)
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateIncidentModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
