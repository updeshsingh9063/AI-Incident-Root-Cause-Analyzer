'use client';

import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

const INTEGRATIONS = [
  { category: 'Monitoring', items: [
    { name: 'Datadog', logo: '🐶', status: 'connected', desc: 'Metrics, APM traces, logs', color: '#7C3AED' },
    { name: 'Grafana', logo: '📊', status: 'connected', desc: 'Dashboards, alerting rules', color: '#F97316' },
    { name: 'Prometheus', logo: '🔥', status: 'connected', desc: 'Metrics scraping, alerts', color: '#EF4444' },
    { name: 'New Relic', logo: '🔭', status: 'available', desc: 'Full-stack observability', color: '#00E5FF' },
    { name: 'Elastic Stack', logo: '🔍', status: 'connected', desc: 'Log search and analytics', color: '#F59E0B' },
    { name: 'Loki', logo: '📝', status: 'available', desc: 'Log aggregation', color: '#22C55E' },
  ]},
  { category: 'Alerting', items: [
    { name: 'PagerDuty', logo: '🚨', status: 'connected', desc: 'Incident alerting & on-call', color: '#22C55E' },
    { name: 'OpsGenie', logo: '⚡', status: 'available', desc: 'Alert management', color: '#F59E0B' },
    { name: 'VictorOps', logo: '🦾', status: 'available', desc: 'Incident collaboration', color: '#7C3AED' },
  ]},
  { category: 'Communication', items: [
    { name: 'Slack', logo: '💬', status: 'connected', desc: 'Real-time incident alerts', color: '#22C55E' },
    { name: 'Microsoft Teams', logo: '🤝', status: 'available', desc: 'Team notifications', color: '#00E5FF' },
    { name: 'Discord', logo: '🎮', status: 'available', desc: 'Channel notifications', color: '#7C3AED' },
  ]},
  { category: 'Cloud Providers', items: [
    { name: 'AWS', logo: '☁️', status: 'connected', desc: 'CloudWatch, EKS, RDS', color: '#F59E0B' },
    { name: 'Google Cloud', logo: '🌐', status: 'available', desc: 'GKE, Cloud Monitoring', color: '#00E5FF' },
    { name: 'Azure', logo: '🔷', status: 'available', desc: 'AKS, Azure Monitor', color: '#3B82F6' },
  ]},
  { category: 'DevOps', items: [
    { name: 'Kubernetes', logo: '⚙️', status: 'connected', desc: 'Cluster metrics & events', color: '#00E5FF' },
    { name: 'ArgoCD', logo: '🚀', status: 'connected', desc: 'Deployment tracking', color: '#F97316' },
    { name: 'GitHub Actions', logo: '🐙', status: 'connected', desc: 'CI/CD pipeline events', color: '#22C55E' },
    { name: 'Jenkins', logo: '🤖', status: 'available', desc: 'Build pipeline tracking', color: '#F59E0B' },
  ]},
];

export default function IntegrationsPage() {
  const connected = INTEGRATIONS.flatMap(c => c.items).filter(i => i.status === 'connected').length;
  const total = INTEGRATIONS.flatMap(c => c.items).length;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            Integrations Marketplace
          </h1>
          <p className="text-slate-500 text-sm mt-1">Connect your observability stack · {connected}/{total} active</p>
        </div>
        <div className="text-xs px-4 py-2 rounded-xl font-semibold"
          style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#67E8F9' }}>
          {connected} Connected · {total - connected} Available
        </div>
      </div>

      {INTEGRATIONS.map((cat, ci) => (
        <motion.section key={cat.category} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">{cat.category}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {cat.items.map((item, ii) => (
              <motion.div key={item.name} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: ci * 0.08 + ii * 0.04 }}
                className="glass-card p-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                style={item.status === 'connected' ? { borderColor: `${item.color}25` } : {}}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{item.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {item.status === 'connected' ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> Available
                    </span>
                  )}
                  <button className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    item.status === 'connected'
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                      : 'text-white font-semibold'
                  }`}
                  style={item.status !== 'connected' ? { background: `${item.color}20`, border: `1px solid ${item.color}35`, color: item.color } : {}}>
                    {item.status === 'connected' ? 'Configure' : 'Connect'}
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
