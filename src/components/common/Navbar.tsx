import React from 'react';
import {
  ShieldAlert,
  Search,
  Database,
  GitGraph,
  FastForward,
  KanbanSquare,
  Bot,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'scanner'
  | 'inventory'
  | 'risk'
  | 'dependencies'
  | 'simulator'
  | 'roadmap'
  | 'assistant';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDemoData: boolean;
  onResetDemo: () => void;
  onClearData: () => void;
  findingsCount: number;
  readinessScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDemoData,
  onResetDemo,
  onClearData,
  findingsCount,
  readinessScore,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'scanner', label: 'Code Scanner', icon: Search },
    { id: 'inventory', label: 'Crypto Inventory', icon: Database },
    { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
    { id: 'dependencies', label: 'Dependency Graph', icon: GitGraph },
    { id: 'simulator', label: 'Migration Simulator', icon: FastForward },
    { id: 'roadmap', label: 'PQC Roadmap', icon: KanbanSquare },
    { id: 'assistant', label: 'AI Security Advisor', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-900/40 bg-cyber-950/90 backdrop-blur-md">
      {/* Top micro-bar: Demo status notification */}
      {isDemoData && (
        <div className="bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-purple-950/80 border-b border-cyan-500/20 px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-medium font-mono text-[11px] uppercase tracking-wider">
              Demo Environment Active:
            </span>
            <span className="text-slate-300">
              ApexBank Core Banking Sample Dataset (10 findings across 8 enterprise services)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearData}
              className="text-slate-400 hover:text-rose-300 transition-colors text-xs flex items-center gap-1 font-mono"
              title="Clear demo data and start blank"
            >
              Clear Data
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onResetDemo}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-xs flex items-center gap-1 font-mono font-medium"
              title="Reload fresh demo dataset"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              {/* Lattice shield SVG icon */}
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-500 rounded-full border-2 border-cyber-950 flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  Quantum<span className="text-cyan-400">Ready</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  MVP v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Post-Quantum Cryptographic Discovery & Migration
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons & status badges */}
          <div className="flex items-center gap-3">
            {/* Quick Readiness Score Pill */}
            <div
              onClick={() => onSelectTab('dashboard')}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">PQC Score</span>
                <span className={`text-xs font-mono font-bold ${readinessScore >= 80 ? 'text-emerald-400' : readinessScore >= 50 ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {readinessScore}%
                </span>
              </div>
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* Scan button */}
            <button
              onClick={() => onSelectTab('scanner')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-mono"
            >
              <Search className="w-3.5 h-3.5" />
              <span>+ New Scan</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
