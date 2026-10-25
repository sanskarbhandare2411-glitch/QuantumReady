import React, { useState, useRef, useEffect } from 'react';
import { AssistantMessage } from '../../types/assistant';
import { CryptoFinding } from '../../types/crypto';
import { generateAssistantReply } from '../../services/assistantEngine';
import {
  Bot,
  Send,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  User,
  CheckCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface AssistantViewProps {
  findings: CryptoFinding[];
  readinessScore: number;
  isDemoData: boolean;
  onNavigateToSimulator: (algorithm: string) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  findings,
  readinessScore,
  isDemoData,
  onNavigateToSimulator,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `### Welcome to QuantumReady Security Intelligence

I am your **AI Cryptographic Migration Advisor**. I can explain your scan findings, analyze exposure to **Shor's algorithm** and **Harvest Now, Decrypt Later (HNDL)**, and guide your transition to official NIST standards (**FIPS 203 ML-KEM, FIPS 204 ML-DSA**).

Currently analyzing: **${findings.length} findings** across your codebase with a Post-Quantum Readiness Score of **${readinessScore}/100**.

How can I assist your cryptographic migration strategy today?`,
      timestamp: 'Just now',
      isDemoAssistant: true,
      suggestedPrompts: [
        'Give me an executive summary of my scan',
        'What is Harvest Now, Decrypt Later?',
        'Explain Shor\'s algorithm vs Grover\'s algorithm',
        'What are the NIST FIPS 203 and 204 standards?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemoAssistant: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Realistic assistant response latency
    setTimeout(() => {
      const reply = generateAssistantReply(
        text,
        {
          findings,
          readinessScore,
          isDemoData,
        }
      );

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400" />
              <span>AI Cryptographic Advisor</span>
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              ⚡ Local Expert Engine (Offline Demonstration)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in NIST Post-Quantum Cryptography standards, FIPS 203/204/205 specifications, and CNSA 2.0 timelines.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${Date.now()}`,
                sender: 'assistant',
                content: `Chat session reset. I am ready to evaluate any cryptographic primitive or explain migration guidelines.`,
                timestamp: 'Just now',
                isDemoAssistant: true,
                suggestedPrompts: [
                  'Give me an executive summary of my scan',
                  'What is Harvest Now, Decrypt Later?',
                  'What are the NIST FIPS 203 and 204 standards?',
                ],
              },
            ]);
          }}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 self-start sm:self-center"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs font-sans space-y-2.5 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none font-medium'
                  : 'cyber-card border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 font-mono">
                <span className="font-semibold text-cyan-400">
                  {msg.sender === 'assistant' ? 'QuantumReady Security Advisor' : 'Security Engineer'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content rendered cleanly */}
              <div className="space-y-2 prose prose-invert prose-xs max-w-none text-slate-200">
                {msg.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="font-mono text-sm font-bold text-white pt-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-1 text-slate-300">
                        {paragraph.split('\n').map((li, lidx) => (
                          <li key={lidx}>{li.replace(/^[-*]\s+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.includes('|')) {
                    // Render simple table
                    return (
                      <div key={idx} className="overflow-x-auto my-2">
                        <table className="w-full text-left border-collapse border border-slate-700 text-[11px] font-mono">
                          <tbody>
                            {paragraph.split('\n').filter(r => !r.includes('---')).map((row, ridx) => (
                              <tr key={ridx} className="border-b border-slate-800">
                                {row.split('|').filter(c => c.trim()).map((cell, cidx) => (
                                  <td key={cidx} className={`p-1.5 ${ridx === 0 ? 'bg-cyber-950 font-bold text-cyan-300' : 'text-slate-300'}`}>
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-200 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Suggested Prompts if any */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Suggested Next Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, pidx) => (
                      <button
                        key={pidx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] font-mono bg-cyber-950 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-900/60 hover:border-cyan-500/50 px-2.5 py-1 rounded-lg text-left transition-colors"
                      >
                        {prompt} &rarr;
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-cyber-900 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="cyber-card p-3 rounded-2xl rounded-tl-none border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs font-mono text-slate-400 ml-1">Analyzing cryptographic AST...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="cyber-card p-2 rounded-2xl border border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about Shor's algorithm, NIST FIPS 203/204, or how to migrate specific finding..."
            className="flex-1 bg-transparent border-none text-xs font-mono text-slate-200 placeholder-slate-500 px-3 py-2 focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-40 text-white shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
