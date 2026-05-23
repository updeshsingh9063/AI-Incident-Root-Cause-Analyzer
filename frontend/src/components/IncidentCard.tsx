'use client';

import { motion } from 'framer-motion';
import { getSeverityColor } from '@/lib/utils';
import {
  AlertTriangle, Clock, Server, User, Brain,
  ChevronRight, MapPin, Flame, Zap
} from 'lucide-react';
import Link from 'next/link';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  service: string;
  environment: string;
  region: string;
  startedAt: Date;
  aiConfidence: number;
  rootCause: string;
  affectedServices: string[];
  mttr: number | null;
  assignee: string;
  tags: string[];
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'investigating': return 'Investigating';
    case 'mitigating':   return 'Mitigating';
    case 'resolved':     return 'Resolved';
    default:             return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'investigating': return '#EF4444';
    case 'mitigating':   return '#F59E0B';
    case 'resolved':     return '#22C55E';
    default:             return '#94A3B8';
  }
}

function getTimeSince(date: any): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'just now';
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${Math.max(0, mins)}m ago`;
  return `${hours}h ${mins % 60}m ago`;
}

export function IncidentCard({ incident, index = 0 }: { incident: Incident; index?: number }) {
  const severityColor = getSeverityColor(incident.severity);
  const statusColor   = getStatusColor(incident.status);
  const isCritical    = incident.severity === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/incidents/${incident.id}`} className="block outline-none">
        <div
          className="relative rounded-xl cursor-pointer group overflow-hidden transition-all duration-250"
          style={{
            background: 'linear-gradient(155deg, rgba(18,26,48,0.65) 0%, rgba(8,13,26,0.92) 100%)',
            border: `1px solid ${isCritical ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
            borderTop: `1px solid ${isCritical ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.09)'}`,
            boxShadow: isCritical
              ? '0 0 0 1px rgba(239,68,68,0.04), 0 4px 16px rgba(0,0,0,0.4)'
              : '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          {/* Critical glow strip */}
          {isCritical && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none"
            style={{
              background: 'linear-gradient(155deg, rgba(0,229,255,0.025) 0%, transparent 60%)',
            }}
          />

          <div className="p-4 relative z-10">
            {/* ── Header ── */}
            <div className="flex items-start gap-3 mb-3">
              {/* Severity icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${severityColor}12`,
                  border: `1px solid ${severityColor}28`,
                  boxShadow: `0 0 12px ${severityColor}15`,
                }}
              >
                {isCritical
                  ? <Flame className="w-4 h-4" style={{ color: severityColor }} strokeWidth={2} />
                  : <AlertTriangle className="w-4 h-4" style={{ color: severityColor }} strokeWidth={2} />
                }
              </div>

              <div className="flex-1 min-w-0">
                {/* ID + badges */}
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10.5px] font-mono text-slate-600 font-medium tracking-wide">
                    {incident.id}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: `${severityColor}12`,
                      border: `1px solid ${severityColor}28`,
                      color: severityColor,
                    }}
                  >
                    {incident.severity}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: `${statusColor}10`,
                      border: `1px solid ${statusColor}25`,
                      color: statusColor,
                    }}
                  >
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: statusColor }}
                      animate={incident.status !== 'resolved' ? { opacity: [1, 0.25, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {getStatusLabel(incident.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[13.5px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug line-clamp-1">
                  {incident.title}
                </h3>
              </div>

              {/* Arrow */}
              <ChevronRight
                className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1.5"
              />
            </div>

            {/* ── AI Root Cause ── */}
            {incident.rootCause && (
              <div
                className="mb-3 rounded-lg px-3 py-2.5"
                style={{
                  background: 'rgba(124,58,237,0.07)',
                  border: '1px solid rgba(124,58,237,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Brain className="w-3 h-3 text-purple-400 flex-shrink-0" strokeWidth={2} />
                  <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                    AI Root Cause
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div
                      className="h-1 w-16 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${incident.aiConfidence}%`,
                          background: incident.aiConfidence >= 85
                            ? 'linear-gradient(90deg, #22C55E, #10B981)'
                            : 'linear-gradient(90deg, #F59E0B, #F97316)',
                        }}
                      />
                    </div>
                    <span
                      className="text-[10.5px] font-mono font-bold"
                      style={{ color: incident.aiConfidence >= 85 ? '#86EFAC' : '#FCD34D' }}
                    >
                      {incident.aiConfidence}%
                    </span>
                  </div>
                </div>
                <p className="text-[11.5px] text-slate-400 leading-relaxed line-clamp-1">
                  {incident.rootCause}
                </p>
              </div>
            )}

            {/* ── Affected services ── */}
            {incident.affectedServices && incident.affectedServices.length > 1 && (
              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <span className="text-[10.5px] text-slate-600 font-medium">Affected:</span>
                {incident.affectedServices.slice(0, 3).map((svc) => (
                  <span
                    key={svc}
                    className="text-[10.5px] px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: '#6B7FA3',
                    }}
                  >
                    {svc}
                  </span>
                ))}
                {incident.affectedServices.length > 3 && (
                  <span className="text-[10.5px] text-slate-600">
                    +{incident.affectedServices.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* ── Footer meta ── */}
            <div
              className="flex items-center gap-0 pt-2.5 flex-wrap gap-y-1"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-3 flex-1 flex-wrap gap-y-1">
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Server className="w-3 h-3" />
                  <span className="font-medium text-slate-500">{incident.service}</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span suppressHydrationWarning>{getTimeSince(incident.startedAt)}</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <MapPin className="w-3 h-3" />
                  {incident.region}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <User className="w-3 h-3" />
                  {incident.assignee}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                {incident.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: 'rgba(0,229,255,0.07)',
                      border: '1px solid rgba(0,229,255,0.14)',
                      color: '#4DA9BF',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
