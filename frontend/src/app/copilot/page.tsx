'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Sparkles, User, Zap, MessageSquare,
  ChevronRight, Mic, Copy, ThumbsUp, RotateCcw, Code
} from 'lucide-react';
import { mockChatMessages } from '@/lib/mock-data';

const API_BASE = '/api';

const SUGGESTIONS = [
  "What caused the payment service outage?",
  "Show me the blast radius of INC-2847",
  "Generate a postmortem for the last critical incident",
  "Which deployments are correlated with today's incidents?",
  "What's the current Redis memory status?",
  "Suggest remediation steps for the DB connection issue",
];

function MessageBlock({ msg }: { msg: any }) {
  const isUser = msg.role === 'user';

  // Parse code blocks from markdown-style content
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const lang = lines[0];
        const code = lines.slice(1).join('\n');
        return (
          <div key={i} className="my-2 rounded-lg overflow-hidden border border-white/[0.08]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04]">
              <span className="text-xs text-slate-500 font-mono">{lang || 'code'}</span>
              <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="code-block rounded-none border-0 text-xs leading-relaxed">{code}</div>
          </div>
        );
      }
      // Bold text
      const boldParsed = part.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={j} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
        }
        return <span key={j}>{p}</span>;
      });
      return <span key={i}>{boldParsed}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-cyan-500/20 border border-cyan-500/30'
          : 'bg-purple-500/20 border border-purple-500/30'
      }`}>
        {isUser ? <User className="w-4 h-4 text-cyan-400" /> : <Brain className="w-4 h-4 text-purple-400" />}
      </div>
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`text-xs font-medium mb-1 ${isUser ? 'text-cyan-400 text-right' : 'text-purple-400'}`}>
          {isUser ? 'You' : 'AI Copilot'}
        </div>
        <div className={`rounded-xl p-4 text-sm leading-relaxed ${
          isUser ? 'user-message text-right' : 'ai-message'
        }`}>
          <div className={`text-slate-300 whitespace-pre-line ${isUser ? 'text-right' : ''}`}>
            {renderContent(msg.content)}
          </div>
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 mt-1">
            <button className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors">
              <ThumbsUp className="w-3 h-3" /> Helpful
            </button>
            <button className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors">
              <Copy className="w-3 h-3" /> Copy
            </button>
            <button className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> Regenerate
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<any[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId: 'copilot-session-1',
          context: {
            current_service: 'payment-service',
            incident_id: 'INC-2847',
          }
        })
      });

      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      const data = await response.json();

      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: data.content,
        timestamp: new Date(data.timestamp || Date.now()),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Error calling AI chat API:', err);
      // Fallback response with typing simulation
      await new Promise(r => setTimeout(r, 1200));
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: `I'm analyzing your request about **"${content}"** (Simulation Mode).\n\nBased on current telemetry data, here's what I found:\n\n- **Payment service** is showing P99 latency of 8,240ms (baseline: 45ms)\n- Root cause identified with **94% confidence**: DB connection pool exhaustion from N+1 query in v2.3.1\n- **3 downstream services** are affected: order-service, fraud-detection, api-gateway\n\n**Recommended immediate action:**\n\`\`\`bash\nkubectl rollout undo deployment/payment-service -n production\n\`\`\`\n\nEstimated recovery: **8–12 minutes** post-rollback.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      <div className="flex-1 flex min-h-0">
        {/* Sidebar: Suggestions */}
        <div className="w-72 border-r border-white/[0.06] p-4 overflow-y-auto hidden lg:flex flex-col gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Quick Queries</div>
            <div className="space-y-1.5">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left text-xs text-slate-400 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all flex items-center gap-2 group"
                >
                  <Zap className="w-3 h-3 text-cyan-500/50 group-hover:text-cyan-400 flex-shrink-0" />
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Active Context</div>
            <div className="space-y-2">
              {[
                { label: 'INC-2847', desc: 'Payment Service', color: '#EF4444' },
                { label: 'INC-2846', desc: 'Auth Service', color: '#F97316' },
                { label: 'INC-2845', desc: 'Data Pipeline', color: '#F97316' },
              ].map(ctx => (
                <div key={ctx.label} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-white/[0.02]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ctx.color }} />
                  <span className="font-mono text-slate-400">{ctx.label}</span>
                  <span className="text-slate-600">{ctx.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Status */}
          <div className="mt-auto p-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300">LLaMA-3.3-70B Active</span>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              Connected to live telemetry · 847 incidents in memory · RAG enabled
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">AI SRE Copilot</h1>
              <p className="text-xs text-slate-500">Autonomous incident investigator · Ask anything about your infrastructure</p>
            </div>
            <motion.div
              className="ml-auto flex items-center gap-2 text-xs text-purple-300"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              Analyzing live telemetry
            </motion.div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.map(msg => <MessageBlock key={msg.id} msg={msg} />)}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-500/20 border border-purple-500/30">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <div className="ai-message flex items-center gap-2 px-4 py-3">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-purple-400"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-end gap-3 glass-card p-3 rounded-xl">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder="Ask about incidents, logs, metrics, deployments... (Shift+Enter for newline)"
                rows={1}
                className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none resize-none font-sans"
                style={{ maxHeight: '120px' }}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 text-slate-600 hover:text-slate-400 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-400 transition-colors">
                  <Code className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="p-2 rounded-lg transition-all disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)' }}
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-2 text-center">
              AI Copilot has access to live logs, metrics, traces, and incident history
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
