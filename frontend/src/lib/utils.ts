import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#F59E0B';
    case 'low': return '#22C55E';
    default: return '#94A3B8';
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return 'rgba(239, 68, 68, 0.1)';
    case 'high': return 'rgba(249, 115, 22, 0.1)';
    case 'medium': return 'rgba(245, 158, 11, 0.1)';
    case 'low': return 'rgba(34, 197, 94, 0.1)';
    default: return 'rgba(148, 163, 184, 0.1)';
  }
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateTimeSeriesData(points: number, baseValue: number, variance: number) {
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - (points - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance * 2),
  }));
}
