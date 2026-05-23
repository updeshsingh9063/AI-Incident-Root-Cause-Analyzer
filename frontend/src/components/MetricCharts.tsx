'use client';

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricChartProps {
  data: Array<{ time: string; value?: number; p50?: number; p95?: number; p99?: number; threshold?: number }>;
  type?: 'area' | 'line' | 'bar' | 'multiline';
  color?: string;
  title?: string;
  unit?: string;
  threshold?: number;
  height?: number;
  showGrid?: boolean;
  compact?: boolean;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-2.5 text-xs"
        style={{
          background: 'rgba(6,10,24,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="text-slate-500 mb-1.5 font-mono text-[10.5px]">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-400 text-[11px]">{entry.name}:</span>
            <span className="font-mono font-bold text-[11px]" style={{ color: entry.color }}>
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}{unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function MetricChart({
  data,
  type = 'area',
  color = '#00E5FF',
  title,
  unit = '',
  threshold,
  height = 120,
  showGrid = false,
  compact = false,
}: MetricChartProps) {
  return (
    <div>
      {title && (
        <div className="text-[10.5px] text-slate-500 font-semibold mb-2 uppercase tracking-widest">
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'multiline' ? (
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
            {showGrid && <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" />}
            <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line type="monotone" dataKey="p50" stroke="#22C55E" strokeWidth={1.5} dot={false} name="p50" />
            <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="p95" />
            <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={2} dot={false} name="p99" />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
            {showGrid && <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" />}
            <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} opacity={0.8} name="value" />
            {threshold && <ReferenceLine y={threshold} stroke={color} strokeDasharray="3 5" strokeOpacity={0.4} />}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
            {showGrid && <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" />}
            <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} name="value" />
            {threshold && <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="3 5" strokeOpacity={0.4} />}
          </LineChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
            <defs>
              <linearGradient id={`area-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
                <stop offset="60%"  stopColor={color} stopOpacity={0.06} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" />}
            <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9.5, fill: '#334155' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#area-grad-${color.replace('#', '')})`}
              name="value"
              style={{ filter: `drop-shadow(0 2px 6px ${color}40)` }}
            />
            {threshold && <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="3 5" strokeOpacity={0.4} />}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================
   STAT CARD
   ============================================ */
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  color?: string;
  icon?: React.ReactNode;
  description?: string;
  index?: number;
}

export function StatCard({
  label,
  value,
  unit = '',
  change,
  color = '#00E5FF',
  icon,
  description,
  index = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-xl overflow-hidden group cursor-default"
      style={{
        background: 'linear-gradient(155deg, rgba(18,26,48,0.6) 0%, rgba(8,13,26,0.92) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Top color accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      <div className="p-4 relative">
        {/* Icon + change badge */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}20`,
              boxShadow: `0 0 12px ${color}15`,
            }}
          >
            {icon && <div style={{ color }}>{icon}</div>}
          </div>

          {change !== undefined && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
              style={{
                background: isPositive
                  ? 'rgba(34,197,94,0.1)'
                  : isNegative
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(148,163,184,0.1)',
                color: isPositive ? '#86EFAC' : isNegative ? '#FCA5A5' : '#94A3B8',
              }}
            >
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : isNegative
                ? <TrendingDown className="w-3 h-3" />
                : <Minus className="w-3 h-3" />
              }
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="font-mono font-black leading-none tracking-tight" style={{ color, fontSize: '1.85rem', letterSpacing: '-0.04em' }}>
          {value}
          {unit && (
            <span className="text-base font-semibold ml-0.5" style={{ color: `${color}70` }}>
              {unit}
            </span>
          )}
        </div>

        {/* Label */}
        <div className="text-[10.5px] font-bold uppercase tracking-widest text-slate-600 mt-1.5">
          {label}
        </div>

        {/* Description */}
        {description && (
          <div className="text-[11px] text-slate-700 mt-0.5 font-mono">{description}</div>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================
   AI CONFIDENCE BADGE
   ============================================ */
interface AIConfidenceBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AIConfidenceBadge({ score, size = 'md' }: AIConfidenceBadgeProps) {
  const color      = score >= 90 ? '#22C55E' : score >= 70 ? '#F59E0B' : '#EF4444';
  const label      = score >= 90 ? 'High'    : score >= 70 ? 'Medium'  : 'Low';
  const dim        = size === 'sm' ? 32 : size === 'lg' ? 52 : 42;
  const r          = size === 'sm' ? 13 : size === 'lg' ? 21 : 17;
  const cx         = dim / 2;
  const circ       = 2 * Math.PI * r;
  const dash       = (score / 100) * circ;
  const fontSize   = size === 'sm' ? '9px' : size === 'lg' ? '13px' : '11px';

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-shrink-0">
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${color})`, transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-bold font-mono"
          style={{ color, fontSize }}
        >
          {score}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold" style={{ color }}>{label}</div>
        <div className="text-[10px] text-slate-600">Confidence</div>
      </div>
    </div>
  );
}
