'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, AlertTriangle, Brain, FileText, GitBranch,
  Home, Layers, MessageSquare, Search, Settings,
  Terminal, TrendingUp, Users, Zap, Bell, ChevronDown,
  Shield, Globe, BarChart2, Radio, X
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Overview', href: '/', badge: null },
  { icon: AlertTriangle, label: 'Active Incidents', href: '/incidents', badge: '3' },
  { icon: Brain, label: 'Root Cause AI', href: '/root-cause', badge: null },
  { icon: Terminal, label: 'Live Logs', href: '/logs', badge: null },
  { icon: TrendingUp, label: 'Metrics', href: '/metrics', badge: null },
  { icon: Globe, label: 'Topology Map', href: '/topology', badge: null },
  { icon: GitBranch, label: 'Deployments', href: '/deployments', badge: null },
  { icon: Layers, label: 'Incident History', href: '/history', badge: null },
  { icon: MessageSquare, label: 'AI Copilot', href: '/copilot', badge: null },
  { icon: Users, label: 'Team Analytics', href: '/analytics', badge: null },
  { icon: FileText, label: 'Postmortems', href: '/postmortems', badge: null },
  { icon: Zap, label: 'Integrations', href: '/integrations', badge: null },
  { icon: Settings, label: 'Settings', href: '/settings', badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount] = useState(3);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen flex flex-col glass-strong border-r border-white/[0.06] sticky top-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <motion.div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}
        >
          <Activity className="w-5 h-5 text-white" />
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <div className="font-bold text-sm text-white leading-tight">AI Incident</div>
              <div className="font-bold text-sm leading-tight gradient-text-cyan">Analyzer</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </motion.div>
        </button>
      </div>

      {/* System Status Bar */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3 p-2.5 rounded-lg"
            style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <div className="flex items-center gap-2">
              <span className="status-dot status-dot-red animate-pulse-dot" />
              <span className="text-xs text-red-300 font-medium">{alertCount} Active Incidents</span>
              <Radio className="w-3 h-3 text-red-400 ml-auto animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                  isActive
                    ? 'sidebar-item-active'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(0, 229, 255, 0.06)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400/70'} transition-colors`}
                  size={18}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 min-w-0 truncate z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !collapsed && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold z-10">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-t border-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)' }}>
                SC
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">Sarah Chen</div>
                <div className="text-xs text-slate-500 truncate">SRE Lead · Admin</div>
              </div>
              <Shield className="w-3.5 h-3.5 text-cyan-400/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
