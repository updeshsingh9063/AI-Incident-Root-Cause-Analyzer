'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Wifi, Zap, ChevronDown, RefreshCw } from 'lucide-react';

export default function TopBar({ title }: { title?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-14 glass border-b border-white/[0.06] flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Title */}
      <div className="flex-1">
        {title && (
          <h1 className="text-sm font-semibold text-white/80">{title}</h1>
        )}
      </div>

      {/* Search */}
      <motion.div
        animate={{ width: isSearchOpen ? 280 : 180 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          onFocus={() => setIsSearchOpen(true)}
          onBlur={() => setIsSearchOpen(false)}
          type="text"
          placeholder="Search incidents, logs..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">⌘K</kbd>
      </motion.div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs text-green-300 font-medium">Live</span>
        <Wifi className="w-3 h-3 text-green-400" />
      </div>

      {/* Refresh */}
      <motion.button
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
      </motion.button>

      {/* Notifications */}
      <button className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#050816]" />
      </button>

      {/* Environment selector */}
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400 hover:text-slate-200 hover:border-white/10 transition-all">
        <Zap className="w-3 h-3 text-cyan-400" />
        Production
        <ChevronDown className="w-3 h-3" />
      </button>
    </header>
  );
}
