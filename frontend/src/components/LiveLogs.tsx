'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const LOG_LEVELS = {
  error: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', label: 'ERR ' },
  warn: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.06)', label: 'WARN' },
  info: { color: '#67E8F9', bg: 'transparent', label: 'INFO' },
  debug: { color: '#94A3B8', bg: 'transparent', label: 'DEBG' },
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

export default function LiveLogs({ logs, autoScroll = true, maxHeight = '400px', compact = false }: LiveLogsProps) {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs, autoScroll]);

  const filtered = filter === 'all' ? visibleLogs : visibleLogs.filter(l => l.level === filter);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' +
      String(date.getMilliseconds()).padStart(3, '0');
  };

  return (
    <div className="terminal flex flex-col" style={{ maxHeight }}>
      {!compact && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-slate-500 font-mono ml-2">live-logs — production</span>
          <div className="ml-auto flex gap-1">
            {['all', 'error', 'warn', 'info'].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`text-xs px-2 py-0.5 rounded transition-all font-mono ${
                  filter === level
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="overflow-y-auto flex-1 space-y-0.5">
        <AnimatePresence initial={false}>
          {filtered.map((log) => {
            const lvl = LOG_LEVELS[log.level as keyof typeof LOG_LEVELS] || LOG_LEVELS.info;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="terminal-line rounded px-1 hover:bg-white/[0.02] group"
                style={{ background: lvl.bg }}
              >
                <span className="text-slate-600 text-xs font-mono flex-shrink-0">
                  {formatTime(log.timestamp)}
                </span>
                <span
                  className="text-xs font-mono font-bold flex-shrink-0 w-8"
                  style={{ color: lvl.color }}
                >
                  {lvl.label}
                </span>
                {!compact && (
                  <span className="text-cyan-500/60 text-xs font-mono flex-shrink-0 w-28 truncate">
                    {log.service}
                  </span>
                )}
                <span className="text-slate-300 text-xs flex-1 min-w-0">
                  {log.message}
                </span>
                {log.trace && !compact && (
                  <span className="text-slate-600 text-xs font-mono flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {log.trace}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="text-slate-500 animate-blink text-sm">_</span>
        </div>
      </div>
    </div>
  );
}
