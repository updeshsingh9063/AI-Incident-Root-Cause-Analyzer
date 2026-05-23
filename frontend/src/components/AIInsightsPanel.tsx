'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Brain, Sparkles, ChevronRight, Shield,
  TrendingUp, AlertTriangle, ArrowRight, Zap
} from 'lucide-react';
import { mockAIInsights } from '@/lib/mock-data';
import { AIConfidenceBadge } from './MetricCharts';

const typeConfig = {
  root_cause:  {
    icon:    Brain,
    color:   '#A78BFA',
    label:   'Root Cause',
    border:  'rgba(167,139,250,0.2)',
    bg:      'rgba(124,58,237,0.07)',
    topLine: 'rgba(167,139,250,0.5)',
  },
  correlation: {
    icon:    TrendingUp,
    color:   '#22D3EE',
    label:   'Correlation',
    border:  'rgba(34,211,238,0.2)',
    bg:      'rgba(0,229,255,0.06)',
    topLine: 'rgba(34,211,238,0.5)',
  },
  prediction:  {
    icon:    AlertTriangle,
    color:   '#FCD34D',
    label:   'Prediction',
    border:  'rgba(252,211,77,0.2)',
    bg:      'rgba(245,158,11,0.06)',
    topLine: 'rgba(252,211,77,0.5)',
  },
};

export default function AIInsightsPanel() {
  const router = useRouter();

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.28)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-white">AI Intelligence</div>
          <div className="text-[10.5px] text-slate-600">Real-time analysis</div>
        </div>
        <motion.div
          className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.16)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-purple-400"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-[10.5px] font-semibold text-purple-300">Analyzing</span>
        </motion.div>
      </div>

      {/* ── Insights ── */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {mockAIInsights.map((insight, i) => {
            const cfg = typeConfig[insight.type as keyof typeof typeConfig];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
                className="relative rounded-xl cursor-pointer group overflow-hidden"
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                }}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-12 right-12 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${cfg.topLine}, transparent)` }}
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${cfg.bg}, transparent)` }}
                />

                <div className="p-3.5 relative">
                  {/* Type + confidence */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}18` }}
                    >
                      <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} strokeWidth={2} />
                    </div>
                    <span
                      className="text-[10.5px] font-bold uppercase tracking-widest"
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <div className="ml-auto scale-75 origin-right">
                      <AIConfidenceBadge score={insight.confidence} size="sm" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-[13px] font-semibold text-white/90 mb-1 leading-snug">
                    {insight.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11.5px] text-slate-500 leading-relaxed mb-2.5 line-clamp-2">
                    {insight.description}
                  </p>

                  {/* Evidence */}
                  <div className="space-y-1 mb-3">
                    {insight.evidence.slice(0, 2).map((e: string, ei: number) => (
                      <div key={ei} className="flex items-start gap-1.5">
                        <ChevronRight
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: cfg.color }}
                          strokeWidth={2.5}
                        />
                        <span className="text-[11px] text-slate-600 leading-snug">{e}</span>
                      </div>
                    ))}
                  </div>

                  {/* Remediation */}
                  <div
                    className="rounded-lg px-3 py-2 flex items-start gap-2"
                    style={{
                      background: 'rgba(34,197,94,0.07)',
                      border: '1px solid rgba(34,197,94,0.14)',
                    }}
                  >
                    <Shield className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-[11px] text-green-400/80 leading-snug">{insight.remediation}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Footer CTA ── */}
      <button
        onClick={() => router.push('/root-cause')}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-semibold transition-all hover:bg-purple-500/10"
        style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.18)',
          color: '#C4B5FD',
        }}
      >
        <Brain className="w-3.5 h-3.5" />
        Open Full AI Analysis
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
