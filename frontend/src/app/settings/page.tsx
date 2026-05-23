'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Key, Palette, Users, Brain, ChevronRight } from 'lucide-react';

const SETTING_SECTIONS = [
  { icon: Bell, label: 'Notifications', color: '#F59E0B' },
  { icon: Shield, label: 'Security & Access', color: '#22C55E' },
  { icon: Key, label: 'API Keys', color: '#00E5FF' },
  { icon: Brain, label: 'AI Configuration', color: '#7C3AED' },
  { icon: Palette, label: 'Appearance', color: '#F97316' },
  { icon: Users, label: 'Team Management', color: '#3B82F6' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0 ${checked ? 'bg-cyan-500' : 'bg-white/10'}`}>
      <motion.div animate={{ x: checked ? 22 : 2 }}
        className="w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-sm"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Notifications');
  const [settings, setSettings] = useState({
    slackAlerts: true, emailDigest: true, pagerDuty: true, teamsAlerts: false,
    criticalOnly: false, aiAutoAnalysis: true, aiAutoRemediation: false,
    streamingResponses: true, voiceAssistant: false, darkMode: true,
    compactMode: false, animations: true,
  });

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const renderSection = () => {
    switch (activeSection) {
      case 'Notifications': return (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 mb-4">Configure how and when you receive incident alerts</p>
          {[
            { key: 'slackAlerts', label: 'Slack Notifications', desc: 'Real-time alerts in #incidents channel' },
            { key: 'emailDigest', label: 'Email Digest', desc: 'Daily summary of resolved incidents' },
            { key: 'pagerDuty', label: 'PagerDuty Escalation', desc: 'Auto-escalate critical incidents' },
            { key: 'teamsAlerts', label: 'Microsoft Teams', desc: 'Send alerts to Teams channels' },
            { key: 'criticalOnly', label: 'Critical Only Mode', desc: 'Only alert for P0/P1 severities' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={() => toggle(key as keyof typeof settings)} />
            </div>
          ))}
        </div>
      );
      case 'AI Configuration': return (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 mb-4">Configure AI agent behavior and model settings</p>
          {[
            { key: 'aiAutoAnalysis', label: 'Auto Root Cause Analysis', desc: 'AI automatically analyzes new incidents' },
            { key: 'aiAutoRemediation', label: 'Auto Remediation', desc: 'AI executes remediation steps automatically (use with caution)' },
            { key: 'streamingResponses', label: 'Streaming Responses', desc: 'Show AI responses word-by-word in real-time' },
            { key: 'voiceAssistant', label: 'Voice Assistant', desc: 'Enable voice input for AI Copilot' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={() => toggle(key as keyof typeof settings)} />
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Model Settings</div>
            {[
              { label: 'Primary Model', value: 'GPT-4.1 Turbo' },
              { label: 'Embedding Model', value: 'text-embedding-3-large' },
              { label: 'Context Window', value: '128k tokens' },
              { label: 'Temperature', value: '0.1 (Precise)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{value}</span>
              </div>
            ))}
          </div>
        </div>
      );
      case 'Appearance': return (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 mb-4">Customize the dashboard appearance</p>
          {[
            { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme (recommended)' },
            { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for more data density' },
            { key: 'animations', label: 'Animations', desc: 'Enable smooth transitions and effects' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={() => toggle(key as keyof typeof settings)} />
            </div>
          ))}
        </div>
      );
      case 'API Keys': return (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 mb-4">Manage API keys for integrations and webhooks</p>
          {[
            { name: 'OpenAI API Key', value: 'sk-...a8f2', status: 'active' },
            { name: 'PagerDuty Token', value: 'pd_...c3d4', status: 'active' },
            { name: 'Datadog API Key', value: 'dd_...e5f6', status: 'active' },
            { name: 'Slack Bot Token', value: 'xoxb-...g7h8', status: 'active' },
          ].map(key => (
            <div key={key.name} className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{key.name}</div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">{key.value}</div>
              </div>
              <span className="badge badge-active">{key.status}</span>
              <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Rotate</button>
            </div>
          ))}
          <button className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">+ Generate new API key</button>
        </div>
      );
      default: return (
        <div className="flex items-center justify-center h-32">
          <p className="text-slate-500 text-sm">Select a section from the left</p>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Platform configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="space-y-1">
          {SETTING_SECTIONS.map((s, i) => (
            <motion.button key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => setActiveSection(s.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeSection === s.label ? 'bg-white/[0.06] border border-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}>
              <s.icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
              <span className="flex-1 text-left font-medium">{s.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </motion.button>
          ))}
        </div>
        <div className="xl:col-span-3">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-5">{activeSection}</h2>
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
