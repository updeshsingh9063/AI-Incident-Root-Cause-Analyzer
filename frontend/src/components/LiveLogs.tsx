'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Filter, Terminal, Download } from 'lucide-react';

const LOG_LEVELS = {
  error: { color: '#F87171', bg: 'rgba(239,68,68,0.07)',  label: 'ERR ' },
  warn:  { color: '#FCD34D', bg: 'rgba(245,158,11,0.05)', label: 'WARN' },
  info:  { color: '#67E8F9', bg: 'transparent',            label: 'INFO' },
  debug: { color: '#475569', bg: 'transparent',            label: 'DEBG' },
};

interface LogEntry {
  id: number;
  timestamp: Date;
  level: string;
  service: string;
  pod?: string;
  message: string;
  trace?: string | null;
}

interface LiveLogsProps {
  logs: LogEntry[];
  autoScroll?: boolean;
  maxHeight?: string;
  compact?: boolean;
}

export default function LiveLogs({
  logs,
  autoScroll = true,
  maxHeight = '400px',
  compact = false,
}: LiveLogsProps) {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter]           = useState<string>('all');
  const scrollRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => { setVisibleLogs(logs); }, [logs]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs, autoScroll]);

  const filtered = filter === 'all'
    ? visibleLogs
    : visibleLogs.filter(l => l.level === filter);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    '.' + String(date.getMilliseconds()).padStart(3, '0');

  const counts = {
    error: visibleLogs.filter(l => l.level === 'error').length,
    warn:  visibleLogs.filter(l => l.level === 'warn').length,
    info:  visibleLogs.filter(l => l.level === 'info').length,
  };

  return (
    <div
      className="flex flex-col font-mono"
      style={{
        background: 'rgba(2, 5, 16, 0.75)',
        border: '1px solid rgba(0,229,255,0.08)',
        borderRadius: '10px',
        maxHeight,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)' }}
      />

      {/* ── Title bar ── */}
      {!compact && (
        <div
          className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* macOS dots */}
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <Terminal className="w-3 h-3 text-slate-600" />
            <span className="text-[10.5px] text-slate-600 font-mono">live-logs — production</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Count pills */}
          <div className="flex gap-1.5 ml-auto items-center">
            {counts.error > 0 && (
              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171' }}>
                {counts.error} ERR
              </span>
            )}
            {counts.warn > 0 && (
              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#FCD34D' }}>
                {counts.warn} WARN
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-0.5 ml-2">
            {['all', 'error', 'warn', 'info'].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className="text-[10px] px-2 py-0.5 rounded transition-all font-mono font-medium"
                style={{
                  background: filter === level ? 'rgba(0,229,255,0.12)' : 'transparent',
                  color:      filter === level ? '#67E8F9' : '#334155',
                  border:     filter === level ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Compact filter strip ── */}
      {compact && (
        <div className="flex gap-0.5 px-2 pt-2 flex-shrink-0">
          {['all', 'error', 'warn'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className="text-[9.5px] px-1.5 py-0.5 rounded transition-all font-mono"
              style={{
                background: filter === level ? 'rgba(0,229,255,0.1)' : 'transparent',
                color:      filter === level ? '#67E8F9' : '#334155',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      )}

      {/* ── Log lines ── */}
      <div ref={scrollRef} className="overflow-y-auto flex-1 py-1.5 px-1">
        <AnimatePresence initial={false}>
          {filtered.map(log => {
            const lvl = LOG_LEVELS[log.level as keyof typeof LOG_LEVELS] || LOG_LEVELS.info;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-baseline gap-2 px-2 py-[2px] rounded group hover:bg-white/[0.025] transition-colors"
                style={{ background: lvl.bg }}
              >
                {/* Timestamp */}
                <span className="text-[10px] text-slate-700 font-mono flex-shrink-0 tabular-nums">
                  {formatTime(log.timestamp)}
                </span>

                {/* Level */}
                <span
                  className="text-[10px] font-mono font-black flex-shrink-0 w-8 leading-none"
                  style={{ color: lvl.color }}
                >
                  {lvl.label}
                </span>

                {/* Service */}
                {!compact && (
                  <span className="text-[10px] font-mono flex-shrink-0 truncate"
                    style={{ color: 'rgba(0,229,255,0.45)', width: 110 }}>
                    {log.service}
                  </span>
                )}

                {/* Message */}
                <span className="text-[11px] text-slate-400 flex-1 min-w-0 leading-relaxed">
                  {log.message}
                </span>

                {/* Trace (hover) */}
                {log.trace && !compact && (
                  <span className="text-[10px] text-slate-700 font-mono flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {log.trace}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Cursor */}
        <div className="flex items-center gap-2 px-2 py-[2px] mt-0.5">
          <span className="text-[10px] text-cyan-500 font-mono">$</span>
          <span className="text-[11px] text-slate-600 animate-blink">▋</span>
        </div>
      </div>
    </div>
  );
}
