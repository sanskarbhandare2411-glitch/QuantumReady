import React from 'react';
import { CryptoFinding } from '../../types/crypto';
import { QuantumScoreGauge } from '../common/QuantumScoreGauge';
import { RiskDistributionChart } from './RiskDistributionChart';
import { AlgorithmBarChart } from './AlgorithmBarChart';
import { RecentScanActivity } from './RecentScanActivity';
import {
  ShieldAlert,
  Search,
  FileCode2,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
  AlertOctagon,
  Lock,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { NavTab } from '../common/Navbar';

interface DashboardViewProps {
  findings: CryptoFinding[];
  readinessScore: number;
  isDemoData: boolean;
  onNavigate: (tab: NavTab) => void;
  onSelectFinding: (finding: CryptoFinding) => void;
  onSimulateAlgorithm: (algorithm: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  findings,
  readinessScore,
  isDemoData,
  onNavigate,
  onSelectFinding,
  onSimulateAlgorithm,
}) => {
  const criticalCount = findings.filter((f) => f.riskLevel === 'Critical').length;
  const highCount = findings.filter((f) => f.riskLevel === 'High').length;
  const mediumCount = findings.filter((f) => f.riskLevel === 'Medium').length;
  const lowCount = findings.filter((f) => f.riskLevel === 'Low').length;
  const quantumSafeCount = findings.filter((f) => f.riskLevel === 'Quantum-Resistant').length;

  const uniqueFiles = new Set(findings.map((f) => f.fileName)).size;
  const uniqueServices = new Set(findings.map((f) => f.serviceName || 'App Service')).size;
  const shorCount = findings.filter((f) => f.quantumThreat.includes("Shor's")).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              Cryptographic Posture & Quantum Risk
            </h1>
            {isDemoData && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                Demo Dataset
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analysis of classical cryptographic algorithms, Shor&apos;s algorithm exposure, and NIST PQC migration tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-mono"
          >
            <Search className="w-4 h-4" />
            <span>Scan Source Files</span>
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all font-mono"
          >
            <Layers className="w-4 h-4" />
            <span>View CBOM ({findings.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Findings */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Crypto Inventory
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {findings.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active cryptographic primitives detected
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">{quantumSafeCount} Quantum-Safe</span>
            <span className="font-mono text-cyan-400 font-medium">
              {uniqueFiles} Files Scanned
            </span>
          </div>
        </div>

        {/* Card 2: Quantum Vulnerable (Shor's Threat) */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
              Shor&apos;s Vulnerability
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-rose-400 tracking-tight">
              {criticalCount + highCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Critical & High risk (RSA, ECC, 3DES, MD5)
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-rose-400 font-mono font-medium">
              {shorCount} Breakable by CRQC
            </span>
            <button
              onClick={() => onNavigate('risk')}
              className="text-slate-400 hover:text-white flex items-center gap-0.5"
            >
              <span>Explain</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Enterprise Blast Radius */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Services & Coverage
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {uniqueServices}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Microservices & subsystems impacted
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Payment, Auth, Core API</span>
            <button
              onClick={() => onNavigate('dependencies')}
              className="text-purple-400 hover:text-purple-300 font-mono flex items-center gap-0.5"
            >
              <span>View Map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Quantum Readiness Score */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between bg-gradient-to-br from-cyber-900 to-cyber-850">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Readiness Score
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1 flex items-center justify-center">
            <QuantumScoreGauge score={readinessScore} size={110} showDetails={false} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Target: &gt;85%</span>
            <span className="text-amber-400 font-mono font-medium">HNDL Risk Active</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts & Threat Warning Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <span>Risk Distribution</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">By Severity</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Breakdown of discovered primitives by operational & quantum risk tier.
            </p>
          </div>
          <RiskDistributionChart findings={findings} />
        </div>

        {/* Algorithm Breakdown Chart */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <span>Dominant Algorithms</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Top 6 Primitives</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Cryptographic schemes identified across scanned files.
            </p>
          </div>
          <AlgorithmBarChart findings={findings} />
        </div>

        {/* Threat Insight & Migration Trigger Card */}
        <div className="cyber-card p-5 rounded-xl flex flex-col justify-between bg-gradient-to-b from-cyber-900 via-cyber-850 to-cyber-900 border-cyan-500/30">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>NIST PQC Milestone Alert</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              NIST FIPS 203 / 204 Standards Finalized
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Federal mandates (NSM-10) require full transition away from RSA-2048 and classical ECC. Organizations must begin deploying hybrid key exchange (X25519MLKEM768) to protect current data against retroactive quantum decryption.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyber-950 border border-slate-800">
                <span className="text-slate-400 font-mono">ML-KEM (Kyber)</span>
                <span className="text-emerald-400 font-semibold font-mono">FIPS 203 Approved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyber-950 border border-slate-800">
                <span className="text-slate-400 font-mono">ML-DSA (Dilithium)</span>
                <span className="text-emerald-400 font-semibold font-mono">FIPS 204 Approved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyber-950 border border-slate-800">
                <span className="text-slate-400 font-mono">Classical Phaseout</span>
                <span className="text-amber-400 font-semibold font-mono">2030 - 2033 Horizon</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => onSimulateAlgorithm('RSA-2048')}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              <span>Simulate RSA-2048 to ML-KEM Migration</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Findings Stream */}
      <div className="cyber-card rounded-xl overflow-hidden border border-slate-800">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white font-mono">
              Recent Cryptographic Findings Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live telemetry of discovered classical algorithms and configuration references.
            </p>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 font-medium"
          >
            <span>Full Inventory ({findings.length})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <RecentScanActivity
          findings={findings}
          onSelectFinding={onSelectFinding}
          onNavigateToSimulator={onSimulateAlgorithm}
        />
      </div>
    </div>
  );
};
