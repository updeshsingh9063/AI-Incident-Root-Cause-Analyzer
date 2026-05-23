'use client';

import { motion } from 'framer-motion';
import { FileText, Brain, Clock, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { mockIncidents } from '@/lib/mock-data';

const resolvedIncidents = mockIncidents.filter(i => i.status === 'resolved');

const POSTMORTEM_SECTIONS = [
  { title: 'Summary', content: 'A deployment of CDN configuration changes caused the Cache-Control headers to be set to no-cache, effectively bypassing the CDN for all static assets globally. This resulted in all requests hitting the origin servers directly, causing an 89% cache miss rate and significant origin server load increase.' },
  { title: 'Timeline', items: [
    { time: '11:23 UTC', event: 'Deployment of cdn-layer v4.2.0 began' },
    { time: '11:31 UTC', event: 'Cache miss rate began climbing, reached 45%' },
    { time: '11:42 UTC', event: 'Monitoring alert fired: CDN hit rate < 20%' },
    { time: '11:48 UTC', event: 'Origin servers reaching 92% CPU — scaling triggered' },
    { time: '11:55 UTC', event: 'AI identified deployment correlation — 98% confidence' },
    { time: '12:04 UTC', event: 'Cache-Control headers reverted, CDN warming began' },
    { time: '12:45 UTC', event: 'Full resolution — cache hit rate restored to 94%' },
  ]},
  { title: 'Root Cause', content: 'PR #4821 "feat: debug mode for CDN caching" inadvertently set Cache-Control: no-cache, no-store for all routes in production. The debug flag was not excluded from the production build config.' },
  { title: 'Impact', content: '42 minutes of degraded performance. Origin server costs increased 340% during the incident. No data loss. Estimated 2.3% of users experienced timeouts.' },
  { title: 'Action Items', items: [
    { owner: 'Carlos M.', task: 'Add pre-deployment cache header validation to CI pipeline', due: '2024-02-15', status: 'open' },
    { owner: 'Sarah C.', task: 'Implement CDN hit-rate alert with 5min detection window', due: '2024-02-12', status: 'done' },
    { owner: 'Priya S.', task: 'Add production env exclusion tests for debug flags', due: '2024-02-20', status: 'open' },
  ]},
];

export default function PostmortemsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Postmortem Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-generated incident postmortems with action items</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#A78BFA' }}>
          <Brain className="w-3.5 h-3.5" /> AI Auto-Generated
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Incident selector */}
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Resolved Incidents</div>
          {resolvedIncidents.map((inc, i) => (
            <motion.div key={inc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-4 cursor-pointer" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="font-mono text-xs text-slate-500">{inc.id}</span>
                <span className="badge badge-low">Resolved</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1 line-clamp-1">{inc.title}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                MTTR: {inc.mttr ? Math.floor(inc.mttr / 60000) + 'm' : 'N/A'}
                <span className="ml-auto font-mono text-purple-400">{inc.aiConfidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Postmortem document */}
        <div className="xl:col-span-2 space-y-4">
          <div className="glass-card p-5" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">INC-2844 — CDN Cache Miss Rate</h2>
                <p className="text-xs text-slate-500 mt-0.5">AI-generated · Reviewed by Priya Sharma</p>
              </div>
              <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>

            <div className="space-y-5">
              {POSTMORTEM_SECTIONS.map((section, si) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    {section.title}
                  </h3>
                  {'content' in section && (
                    <p className="text-sm text-slate-400 leading-relaxed pl-5">{section.content}</p>
                  )}
                  {'items' in section && section.title === 'Timeline' && (
                    <div className="pl-5 space-y-2">
                      {(section.items as {time:string;event:string}[]).map((item, ii) => (
                        <div key={ii} className="flex items-start gap-3 text-xs">
                          <span className="font-mono text-slate-500 w-20 flex-shrink-0">{item.time}</span>
                          <span className="text-slate-400">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {'items' in section && section.title === 'Action Items' && (
                    <div className="pl-5 space-y-2">
                      {(section.items as {owner:string;task:string;due:string;status:string}[]).map((item, ii) => (
                        <div key={ii} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                          <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${item.status === 'done' ? 'text-green-400' : 'text-slate-600'}`} />
                          <span className={`text-xs flex-1 ${item.status === 'done' ? 'line-through text-slate-600' : 'text-slate-300'}`}>{item.task}</span>
                          <span className="text-xs text-slate-500">{item.owner}</span>
                          <span className="text-xs font-mono text-slate-600">{item.due}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
