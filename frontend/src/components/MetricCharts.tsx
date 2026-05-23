'use client';

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';

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
      <div className="glass-strong rounded-lg p-3 text-xs border border-white/10">
        <div className="text-slate-400 mb-1.5 font-mono">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-mono font-semibold" style={{ color: entry.color }}>
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
        <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'multiline' ? (
          <LineChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />}
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line type="monotone" dataKey="p50" stroke="#22C55E" strokeWidth={1.5} dot={false} name="p50" />
            <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="p95" />
            <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={2} dot={false} name="p99" />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />}
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} opacity={0.8} name="value" />
            {threshold && <ReferenceLine y={threshold} stroke={color} strokeDasharray="4 4" strokeOpacity={0.5} />}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />}
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} name="value" />
            {threshold && <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5} />}
          </LineChart>
        ) : (
          <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
            <defs>
              <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />}
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#', '')})`} name="value" />
            {threshold && <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5} />}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

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

export function StatCard({ label, value, unit = '', change, color = '#00E5FF', icon, description, index = 0 }: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          {icon && <div style={{ color }}>{icon}</div>}
        </div>
        {change !== undefined && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: isPositive ? 'rgba(34,197,94,0.12)' : isNegative ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.12)',
              color: isPositive ? '#86EFAC' : isNegative ? '#FCA5A5' : '#94A3B8',
            }}
          >
            {isPositive ? '↑' : isNegative ? '↓' : '→'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="metric-value font-mono" style={{ color }}>
        {value}<span className="text-xl ml-0.5 font-normal text-slate-500">{unit}</span>
      </div>
      <div className="metric-label mt-1">{label}</div>
      {description && <div className="text-xs text-slate-600 mt-1">{description}</div>}
    </motion.div>
  );
}

interface AIConfidenceBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AIConfidenceBadge({ score, size = 'md' }: AIConfidenceBadgeProps) {
  const color = score >= 90 ? '#22C55E' : score >= 70 ? '#F59E0B' : '#EF4444';
  const sizeClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg width={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} height={size === 'sm' ? 32 : size === 'lg' ? 48 : 40}>
          <circle
            cx={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            cy={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            r={size === 'sm' ? 13 : size === 'lg' ? 20 : 17}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2.5"
          />
          <circle
            cx={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            cy={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            r={size === 'sm' ? 13 : size === 'lg' ? 20 : 17}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${(score / 100) * (size === 'sm' ? 82 : size === 'lg' ? 126 : 107)} 200`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size === 'sm' ? 16 : size === 'lg' ? 24 : 20} ${size === 'sm' ? 16 : size === 'lg' ? 24 : 20})`}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div
          className={`absolute inset-0 flex items-center justify-center font-bold font-mono ${sizeClasses[size]}`}
          style={{ color }}
        >
          {score}
        </div>
      </div>
      <div>
        <div className={`font-semibold ${sizeClasses[size]}`} style={{ color }}>
          {score >= 90 ? 'High' : score >= 70 ? 'Medium' : 'Low'}
        </div>
        <div className="text-xs text-slate-500">AI Confidence</div>
      </div>
    </div>
  );
}
