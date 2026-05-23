'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, AlertTriangle, Brain, FileText, GitBranch,
  Home, Layers, MessageSquare, Settings,
  Terminal, TrendingUp, Users, Zap, Bell,
  Shield, Globe, BarChart2, Radio, ChevronLeft,
  Cpu, Sparkles
} from 'lucide-react';

const navSections = [
  {
    label: 'Operations',
    items: [
      { icon: Home,          label: 'Overview',        href: '/',            badge: null },
      { icon: AlertTriangle, label: 'Active Incidents', href: '/incidents',   badge: '3' },
      { icon: Brain,         label: 'Root Cause AI',   href: '/root-cause',  badge: null },
    ],
  },
  {
    label: 'Observability',
    items: [
      { icon: Terminal,   label: 'Live Logs',    href: '/logs',     badge: null },
      { icon: TrendingUp, label: 'Metrics',      href: '/metrics',  badge: null },
      { icon: Globe,      label: 'Topology Map', href: '/topology', badge: null },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { icon: MessageSquare, label: 'AI Copilot',     href: '/copilot',     badge: null },
      { icon: Sparkles,      label: 'Team Analytics', href: '/analytics',   badge: null },
      { icon: FileText,      label: 'Postmortems',    href: '/postmortems', badge: null },
    ],
  },
  {
    label: 'Management',
    items: [
      { icon: GitBranch, label: 'Deployments', href: '/deployments', badge: null },
      { icon: Layers,    label: 'History',     href: '/history',     badge: null },
      { icon: Zap,       label: 'Integrations',href: '/integrations',badge: null },
      { icon: Settings,  label: 'Settings',    href: '/settings',    badge: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen flex flex-col glass-strong border-r border-white/[0.055] sticky top-0 z-40 overflow-hidden"
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-[18px] border-b border-white/[0.055] flex-shrink-0">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)' }}
          >
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', zIndex: -1 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-[13px] font-bold text-white leading-tight tracking-tight">
                AI Incident
              </span>
              <span className="text-[11px] font-semibold gradient-text-cyan leading-tight">
                Root Cause Analyzer
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-auto flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Alert Banner ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-3 mt-3 flex-shrink-0"
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
            >
              <motion.span
                className="status-dot status-dot-red flex-shrink-0"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-[11.5px] text-red-300 font-semibold flex-1">3 Active Incidents</span>
              <Radio className="w-3 h-3 text-red-400 flex-shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 overflow-x-hidden">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidebar-section-label mt-3 mb-1"
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>

            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.href} className="relative group/tooltip">
                  <Link href={item.href} className="block">
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className={`sidebar-btn ${isActive ? 'sidebar-item-active' : ''}`}
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full"
                          style={{ background: 'var(--cyan)', boxShadow: '0 0 8px rgba(0,229,255,0.6)' }}
                          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        />
                      )}

                      {/* Icon */}
                      <item.icon
                        size={16}
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />

                      {/* Label */}
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.15 }}
                            className="text-[13px] font-medium flex-1 min-w-0 truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {item.badge && !collapsed && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{
                            background: 'rgba(239,68,68,0.18)',
                            color: '#FCA5A5',
                            border: '1px solid rgba(239,68,68,0.25)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <div className="tooltip opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1.5 text-red-300 font-bold">({item.badge})</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── System Health ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mb-3 flex-shrink-0"
          >
            <div
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                System Health
              </div>
              {[
                { label: 'API Gateway', health: 98, color: '#22C55E' },
                { label: 'AI Engine',  health: 91, color: '#00E5FF' },
                { label: 'Database',   health: 72, color: '#F59E0B' },
              ].map((svc) => (
                <div key={svc.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: svc.color, boxShadow: `0 0 5px ${svc.color}` }}
                  />
                  <span className="text-[11px] text-slate-500 flex-1 truncate">{svc.label}</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: svc.color }}>
                    {svc.health}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User Profile ── */}
      <div className="p-3 border-t border-white/[0.055] flex-shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)' }}
          >
            SC
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0"
              >
                <div className="text-[12.5px] font-semibold text-white truncate leading-tight">
                  Sarah Chen
                </div>
                <div className="text-[11px] text-slate-500 truncate">SRE Lead · Admin</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Shield className="w-3.5 h-3.5 text-cyan-500/50 flex-shrink-0" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}
