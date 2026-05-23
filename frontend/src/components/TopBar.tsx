'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Search, Zap, ChevronDown,
  RefreshCw, X, AlertCircle, CheckCircle2,
  Info, CheckCheck, Volume2, VolumeX
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  type: 'critical' | 'warning' | 'info' | 'resolved';
  msg: string;
  detail?: string;
  time: string;
  read: boolean;
  href?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'critical', msg: 'Payment service P99 > 8s', detail: 'INC-2847 · us-east-1', time: '2m ago', read: false, href: '/incidents' },
  { id: 2, type: 'warning',  msg: 'DB connection pool at 89%', detail: 'postgres-primary · production', time: '8m ago', read: false, href: '/metrics' },
  { id: 3, type: 'info',     msg: 'Auth service deployment v5.1.8 complete', detail: 'eu-west-1 · by sarah.chen', time: '12m ago', read: false, href: '/deployments' },
  { id: 4, type: 'resolved', msg: 'INC-2844 CDN cache miss resolved', detail: 'MTTR: 42 min · AI confidence 98%', time: '3h ago', read: true, href: '/history' },
  { id: 5, type: 'warning',  msg: 'Redis memory at 78% capacity', detail: 'redis-cluster · us-east-1', time: '15m ago', read: false, href: '/metrics' },
];

const ENVIRONMENTS = ['Production', 'Staging', 'Development', 'DR'];

const notifIcons: Record<string, React.ElementType> = {
  critical: AlertCircle,
  warning:  AlertCircle,
  info:     Info,
  resolved: CheckCircle2,
};

const notifColors: Record<string, string> = {
  critical: '#EF4444',
  warning:  '#F59E0B',
  info:     '#3B82F6',
  resolved: '#22C55E',
};

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [environment, setEnvironment] = useState('Production');
  const [showEnvMenu, setShowEnvMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const dismissNotification = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNotifClick = useCallback((notif: Notification) => {
    markAsRead(notif.id);
    if (notif.href) {
      setShowNotifications(false);
      router.push(notif.href);
    }
  }, [markAsRead, router]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/incidents?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  }, [searchQuery, router]);

  return (
    <header
      className="h-[52px] flex items-center px-5 gap-3 sticky top-0 z-30 flex-shrink-0"
      style={{
        background: 'rgba(5, 8, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.02)',
      }}
    >
      {/* ── Page Title / Breadcrumb ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-600 font-medium">Platform</span>
          <span className="text-slate-700">/</span>
          <h1 className="text-[13px] font-semibold text-white/90 truncate">
            {title || 'Overview'}
          </h1>
        </div>
      </div>

      {/* ── Search ── */}
      <form onSubmit={handleSearch}>
        <motion.div
          animate={{ width: isSearchOpen ? 260 : 160 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex-shrink-0"
        >
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600 pointer-events-none" />
          <input
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Search incidents…"
            className="w-full h-[30px] rounded-lg pl-7 pr-10 text-[12px] text-slate-300 placeholder:text-slate-700 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: isSearchOpen
                ? '1px solid rgba(0,229,255,0.3)'
                : '1px solid rgba(255,255,255,0.07)',
              boxShadow: isSearchOpen ? '0 0 0 3px rgba(0,229,255,0.05)' : 'none',
            }}
          />
          <kbd
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 py-0.5 rounded"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#4A5578',
            }}
          >
            ⌘K
          </kbd>
        </motion.div>
      </form>

      {/* ── Separator ── */}
      <div className="w-px h-5 bg-white/[0.07] flex-shrink-0" />

      {/* ── Live Status ── */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-[11.5px] font-semibold text-green-300">Live</span>
      </div>

      {/* ── Refresh ── */}
      <motion.button
        onClick={handleRefresh}
        whileTap={{ scale: 0.9 }}
        title="Refresh data"
        className="flex-shrink-0 w-[30px] h-[30px] rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
      >
        <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      {/* ── Sound toggle ── */}
      <button
        onClick={() => setSoundEnabled(v => !v)}
        title={soundEnabled ? 'Mute alerts' : 'Enable alerts'}
        className="flex-shrink-0 w-[30px] h-[30px] rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
      >
        {soundEnabled
          ? <Volume2 className="w-3.5 h-3.5" />
          : <VolumeX className="w-3.5 h-3.5 text-red-400" />
        }
      </button>

      {/* ── Notifications ── */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowNotifications(v => !v)}
          className="relative w-[30px] h-[30px] rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: '#EF4444' }}
            >
              {unreadCount}
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'rgba(8,12,28,0.98)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[12.5px] font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5' }}
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        title="Mark all as read"
                        className="text-[10.5px] text-cyan-500 hover:text-cyan-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-all"
                      >
                        <CheckCheck className="w-3 h-3" />
                        All read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-600 hover:text-slate-400 transition-colors p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="py-1 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-[12px] text-slate-600">All caught up!</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {notifications.map(n => {
                        const Icon = notifIcons[n.type];
                        const color = notifColors[n.type];
                        return (
                          <motion.div
                            key={n.id}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleNotifClick(n)}
                            className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer group relative"
                            style={{ borderLeft: !n.read ? `2px solid ${color}` : '2px solid transparent' }}
                          >
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: `${color}15` }}
                            >
                              <Icon className="w-3 h-3" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[12px] leading-snug ${n.read ? 'text-slate-500' : 'text-slate-200'}`}>
                                {n.msg}
                              </p>
                              {n.detail && (
                                <p className="text-[10.5px] text-slate-600 mt-0.5">{n.detail}</p>
                              )}
                              <p className="text-[10.5px] text-slate-700 mt-0.5 font-mono">{n.time}</p>
                            </div>
                            <button
                              onClick={e => dismissNotification(n.id, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 hover:text-slate-400 p-0.5 flex-shrink-0"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={clearAll}
                      className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => { setShowNotifications(false); router.push('/incidents'); }}
                      className="text-[11.5px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      View all incidents →
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Environment Selector ── */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowEnvMenu(v => !v)}
          className="flex items-center gap-1.5 h-[30px] px-3 rounded-lg text-[12px] font-medium text-slate-400 hover:text-slate-200 transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>{environment}</span>
          <ChevronDown className="w-3 h-3 text-slate-600" />
        </button>

        <AnimatePresence>
          {showEnvMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowEnvMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+6px)] w-40 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'rgba(8,12,28,0.98)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                }}
              >
                {ENVIRONMENTS.map(env => (
                  <button
                    key={env}
                    onClick={() => { setEnvironment(env); setShowEnvMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-[12px] hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                    style={{ color: env === environment ? '#00E5FF' : '#94A3B8' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: env === 'Production' ? '#22C55E'
                          : env === 'Staging' ? '#F59E0B'
                          : env === 'Development' ? '#3B82F6' : '#6B7280'
                      }}
                    />
                    {env}
                    {env === environment && (
                      <CheckCircle2 className="w-3 h-3 ml-auto text-cyan-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
