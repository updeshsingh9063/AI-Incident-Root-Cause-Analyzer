'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ZoomIn, ZoomOut, Info, Server, Database, Layers } from 'lucide-react';
import { mockServices } from '@/lib/mock-data';

const NODE_POSITIONS: Record<string, { x: number; y: number; type: string }> = {
  'api-gateway':         { x: 50,  y: 10,  type: 'gateway' },
  'auth-service':        { x: 20,  y: 28,  type: 'service' },
  'payment-service':     { x: 50,  y: 28,  type: 'service' },
  'order-service':       { x: 78,  y: 28,  type: 'service' },
  'user-service':        { x: 10,  y: 52,  type: 'service' },
  'fraud-detection':     { x: 35,  y: 52,  type: 'service' },
  'inventory-service':   { x: 65,  y: 52,  type: 'service' },
  'notification-service':{ x: 90,  y: 52,  type: 'service' },
  'postgres-primary':    { x: 30,  y: 76,  type: 'database' },
  'redis-cluster':       { x: 55,  y: 76,  type: 'database' },
  'elasticsearch':       { x: 80,  y: 76,  type: 'database' },
  'product-catalog':     { x: 78,  y: 40,  type: 'service' },
};

const CONNECTIONS = [
  ['api-gateway', 'auth-service'],
  ['api-gateway', 'payment-service'],
  ['api-gateway', 'order-service'],
  ['api-gateway', 'product-catalog'],
  ['payment-service', 'postgres-primary'],
  ['payment-service', 'fraud-detection'],
  ['auth-service', 'redis-cluster'],
  ['auth-service', 'user-service'],
  ['order-service', 'payment-service'],
  ['order-service', 'inventory-service'],
  ['order-service', 'postgres-primary'],
  ['user-service', 'postgres-primary'],
  ['user-service', 'redis-cluster'],
  ['inventory-service', 'postgres-primary'],
  ['inventory-service', 'redis-cluster'],
  ['product-catalog', 'elasticsearch'],
  ['fraud-detection', 'redis-cluster'],
];

const statusColor = (status: string) =>
  status === 'healthy' ? '#22C55E' : status === 'critical' ? '#EF4444' : '#F59E0B';

export default function TopologyPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selectedService = selectedNode ? mockServices.find(s => s.id === selectedNode) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-cyan-400" />
            Infrastructure Topology
          </h1>
          <p className="text-slate-500 text-sm mt-1">Live service dependency map with health status</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[['#22C55E','Healthy'],['#F59E0B','Degraded'],['#EF4444','Critical']].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Topology SVG map */}
        <div className="xl:col-span-3 glass-card p-4" style={{ minHeight: 520 }}>
          <svg viewBox="0 0 100 90" className="w-full h-full" style={{ minHeight: 480 }}>
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.12)" />
              </marker>
              {['#22C55E','#EF4444','#F59E0B'].map(c => (
                <filter key={c} id={`glow-${c.replace('#','')}`}>
                  <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              ))}
            </defs>

            {/* Layer labels */}
            {[{y:6,label:'API Gateway'},{y:24,label:'Services'},{y:48,label:'Microservices'},{y:72,label:'Data Layer'}].map(l => (
              <text key={l.label} x="1" y={l.y} fontSize="2.5" fill="rgba(148,163,184,0.3)" fontFamily="sans-serif">{l.label}</text>
            ))}

            {/* Connection lines */}
            {CONNECTIONS.map(([from, to], i) => {
              const f = NODE_POSITIONS[from];
              const t = NODE_POSITIONS[to];
              if (!f || !t) return null;
              const svc = mockServices.find(s => s.id === from);
              const isAffected = svc?.status !== 'healthy';
              return (
                <motion.line
                  key={i}
                  x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke={isAffected ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isAffected ? 0.4 : 0.25}
                  strokeDasharray={isAffected ? "1 0.5" : undefined}
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.6 }}
                />
              );
            })}

            {/* Nodes */}
            {mockServices.map((svc) => {
              const pos = NODE_POSITIONS[svc.id];
              if (!pos) return null;
              const color = statusColor(svc.status);
              const isSelected = selectedNode === svc.id;
              const isCritical = svc.status === 'critical';
              const Icon = pos.type === 'database' ? '🗄' : pos.type === 'gateway' ? '⬡' : '◉';
              return (
                <g key={svc.id} onClick={() => setSelectedNode(isSelected ? null : svc.id)} style={{ cursor: 'pointer' }}>
                  {/* Selection ring */}
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="5" fill="none" stroke="#00E5FF" strokeWidth="0.5" opacity={0.6} />
                  )}
                  {/* Pulse for critical */}
                  {isCritical && (
                    <motion.circle
                      cx={pos.x} cy={pos.y} r="4"
                      fill="none" stroke={color} strokeWidth="0.3"
                      animate={{ r: [4, 7, 4], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                  {/* Node bg */}
                  <circle
                    cx={pos.x} cy={pos.y} r="3.2"
                    fill={`${color}18`}
                    stroke={color}
                    strokeWidth={isSelected ? 0.6 : 0.35}
                    filter={`url(#glow-${color.replace('#','')})`}
                  />
                  {/* Label */}
                  <text
                    x={pos.x} y={pos.y + 5.5}
                    textAnchor="middle"
                    fontSize="2.2"
                    fill="rgba(248,250,252,0.75)"
                    fontFamily="sans-serif"
                  >
                    {svc.name.replace(' Service','').replace(' Cluster','').replace(' Gateway','GW')}
                  </text>
                  {/* Health dot */}
                  <circle cx={pos.x + 2.8} cy={pos.y - 2.8} r="0.8" fill={color} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {selectedService ? (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${statusColor(selectedService.status)}18`, border: `1px solid ${statusColor(selectedService.status)}35` }}>
                  <Server className="w-4.5 h-4.5" style={{ color: statusColor(selectedService.status) }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{selectedService.name}</div>
                  <div className={`text-xs font-semibold capitalize mt-0.5`} style={{ color: statusColor(selectedService.status) }}>
                    {selectedService.status}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Health Score', value: `${selectedService.health}%`, color: statusColor(selectedService.status) },
                  { label: 'Requests/s', value: selectedService.requests.toLocaleString(), color: '#00E5FF' },
                  { label: 'Error Rate', value: `${selectedService.errors.toFixed(1)}%`, color: selectedService.errors > 5 ? '#EF4444' : '#22C55E' },
                  { label: 'Avg Latency', value: `${selectedService.latency}ms`, color: selectedService.latency > 1000 ? '#EF4444' : '#22C55E' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-xs text-slate-500">{m.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Dependencies</div>
                <div className="flex flex-wrap gap-1">
                  {selectedService.dependencies.map(dep => (
                    <span key={dep} className="text-xs px-2 py-0.5 rounded font-mono bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      {dep}
                    </span>
                  ))}
                  {selectedService.dependencies.length === 0 && (
                    <span className="text-xs text-slate-600">No upstream dependencies</span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-5 text-center">
              <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Click a node to inspect service details</p>
            </div>
          )}

          {/* Service list */}
          <div className="glass-card p-4">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">All Services</div>
            <div className="space-y-1.5">
              {mockServices.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedNode(svc.id === selectedNode ? null : svc.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                    selectedNode === svc.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor(svc.status) }} />
                  <span className="text-xs text-slate-400 flex-1 truncate">{svc.name}</span>
                  <span className="text-xs font-mono" style={{ color: statusColor(svc.status) }}>{svc.health}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
