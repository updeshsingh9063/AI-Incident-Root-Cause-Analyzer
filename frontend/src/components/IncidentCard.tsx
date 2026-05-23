'use client';

import { motion } from 'framer-motion';
import { getSeverityColor } from '@/lib/utils';
import { AlertTriangle, Clock, Server, User, Brain, ChevronRight } from 'lucide-react';
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
    case 'mitigating': return 'Mitigating';
    case 'resolved': return 'Resolved';
    default: return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'investigating': return '#EF4444';
    case 'mitigating': return '#F59E0B';
    case 'resolved': return '#22C55E';
    default: return '#94A3B8';
  }
}

function getTimeSince(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m ago`;
  return `${hours}h ${mins % 60}m ago`;
}

export function IncidentCard({ incident, index = 0 }: { incident: Incident; index?: number }) {
  const severityColor = getSeverityColor(incident.severity);
  const statusColor = getStatusColor(incident.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/incidents/${incident.id}`}>
        <div className="glass-card p-4 cursor-pointer group hover:scale-[1.01] transition-transform duration-200">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${severityColor}18`, border: `1px solid ${severityColor}30` }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: severityColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-slate-500 font-medium">{incident.id}</span>
                <span
                  className="badge"
                  style={{ background: `${severityColor}18`, border: `1px solid ${severityColor}30`, color: severityColor }}
                >
                  {incident.severity}
                </span>
                <span
                  className="badge"
                  style={{ background: `${statusColor}18`, border: `1px solid ${statusColor}30`, color: statusColor }}
                >
                  <motion.span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: statusColor }}
                    animate={incident.status !== 'resolved' ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {getStatusLabel(incident.status)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {incident.title}
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          {/* AI Root Cause Preview */}
          {incident.rootCause && (
            <div className="mb-3 p-2.5 rounded-lg" style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">AI Root Cause</span>
                <span className="ml-auto text-xs font-mono" style={{ color: incident.aiConfidence >= 85 ? '#22C55E' : '#F59E0B' }}>
                  {incident.aiConfidence}% confidence
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{incident.rootCause}</p>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Server className="w-3 h-3" />
              {incident.service}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {getTimeSince(incident.startedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              {incident.assignee}
            </span>
            <div className="ml-auto flex gap-1">
              {incident.tags.slice(0, 2).map(tag => (
                <span key={tag} className="badge badge-info text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
