'use client';

import { motion } from 'framer-motion';
import { BarChart2, Users, Clock, TrendingDown, Award, Brain, ArrowDown } from 'lucide-react';
import { MetricChart, StatCard } from '@/components/MetricCharts';
import { mockTeamStats } from '@/lib/mock-data';

const TEAM = [
  { name: 'Sarah Chen', role: 'SRE Lead', incidents: 28, mttr: 18, accuracy: 94, avatar: 'SC', color: '#00E5FF' },
  { name: 'Marcus Johnson', role: 'Platform Eng', incidents: 21, mttr: 24, accuracy: 91, avatar: 'MJ', color: '#7C3AED' },
  { name: 'Alex Rivera', role: 'DevOps Eng', incidents: 19, mttr: 31, accuracy: 88, avatar: 'AR', color: '#22C55E' },
  { name: 'Priya Sharma', role: 'SRE Eng', incidents: 17, mttr: 27, accuracy: 89, avatar: 'PS', color: '#F59E0B' },
  { name: 'David Kim', role: 'Infra Eng', incidents: 14, mttr: 35, accuracy: 86, avatar: 'DK', color: '#F97316' },
];

const mttrTrend = Array.from({ length: 30 }, (_, i) => ({
  time: `D${i + 1}`,
  value: Math.max(10, 70 - i * 1.8 + Math.sin(i * 0.5) * 8 + Math.random() * 6),
}));

const incidentsByDay = Array.from({ length: 14 }, (_, i) => ({
  time: `${14 - i}d`,
  value: Math.floor(3 + Math.random() * 8),
})).reverse();

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-cyan-400" />
          Team Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">MTTR trends, AI adoption, and performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Avg MTTR" value={mockTeamStats.mttr.current} unit="min" color="#F59E0B" icon={<Clock size={16} />} change={-51} index={0} />
        <StatCard label="Avg MTTA" value={mockTeamStats.mtta.current} unit="min" color="#00E5FF" icon={<Clock size={16} />} change={-46} index={1} />
        <StatCard label="Resolved" value={mockTeamStats.incidentsResolved.current} color="#22C55E" icon={<TrendingDown size={16} />} change={17} index={2} />
        <StatCard label="Uptime" value={mockTeamStats.uptime.current} unit="%" color="#22C55E" icon={<Award size={16} />} index={3} />
        <StatCard label="AI Accuracy" value={mockTeamStats.aiAccuracy.current} unit="%" color="#7C3AED" icon={<Brain size={16} />} change={3} index={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">MTTR Trend (30 days)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mean Time to Resolve</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
              <ArrowDown className="w-3 h-3" /> 51% improvement
            </div>
          </div>
          <MetricChart data={mttrTrend} type="area" color="#F59E0B" height={160} unit="min" showGrid />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Daily Incidents</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last 14 days</p>
          </div>
          <MetricChart data={incidentsByDay} type="bar" color="#7C3AED" height={160} showGrid />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> Team Performance
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/[0.05]">
              <th className="text-left pb-3">Engineer</th>
              <th className="text-right pb-3">Incidents</th>
              <th className="text-right pb-3">MTTR</th>
              <th className="text-right pb-3">AI Accuracy</th>
              <th className="text-right pb-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {TEAM.map((m, i) => {
              const score = Math.round(100 - m.mttr * 0.8 + m.incidents * 0.5 + m.accuracy * 0.3);
              return (
                <motion.tr key={m.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: `${m.color}25`, border: `1px solid ${m.color}40` }}>
                        {m.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-xs text-slate-300">{m.incidents}</td>
                  <td className="py-3 text-right font-mono text-xs font-semibold" style={{ color: m.mttr < 25 ? '#22C55E' : m.mttr < 35 ? '#F59E0B' : '#EF4444' }}>{m.mttr}min</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 progress-bar"><div className="progress-fill" style={{ width: `${m.accuracy}%`, background: m.accuracy > 90 ? '#22C55E' : '#F59E0B' }} /></div>
                      <span className="font-mono text-xs text-slate-400">{m.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-sm font-bold text-cyan-400">{score}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
