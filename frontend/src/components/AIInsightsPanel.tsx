'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ChevronRight, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockAIInsights } from '@/lib/mock-data';
import { AIConfidenceBadge } from './MetricCharts';

const typeConfig = {
  root_cause: { icon: Brain, color: '#7C3AED', label: 'Root Cause', border: 'rgba(124,58,237,0.2)', bg: 'rgba(124,58,237,0.06)' },
  correlation: { icon: TrendingUp, color: '#00E5FF', label: 'Correlation', border: 'rgba(0,229,255,0.2)', bg: 'rgba(0,229,255,0.06)' },
  prediction: { icon: AlertTriangle, color: '#F59E0B', label: 'Prediction', border: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.06)' },
};

export default function AIInsightsPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <span className="text-sm font-semibold text-white">AI Intelligence</span>
        <motion.div
          className="ml-auto flex items-center gap-1.5 text-xs text-purple-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Analyzing
        </motion.div>
      </div>

      <AnimatePresence>
        {mockAIInsights.map((insight, i) => {
          const cfg = typeConfig[insight.type as keyof typeof typeConfig];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="rounded-xl p-4 cursor-pointer group hover:scale-[1.01] transition-transform duration-200"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <cfg.icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <div className="ml-auto">
                  <AIConfidenceBadge score={insight.confidence} size="sm" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-white mb-1.5">{insight.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{insight.description}</p>

              {/* Evidence */}
              <div className="space-y-1 mb-3">
                {insight.evidence.slice(0, 2).map((e, ei) => (
                  <div key={ei} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
                    {e}
                  </div>
                ))}
              </div>

              {/* Remediation */}
              <div className="pt-2 border-t border-white/[0.05]">
                <div className="flex items-start gap-1.5">
                  <Shield className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-300/80">{insight.remediation}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
