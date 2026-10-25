import React, { useState } from 'react';
import { AlgorithmType, CryptoFinding } from '../../types/crypto';
import { MigrationStrategyType } from '../../types/simulator';
import { simulateMigration } from '../../services/simulatorEngine';
import {
  FastForward,
  Scale,
  Layers,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Network,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Terminal,
} from 'lucide-react';

interface MigrationSimulatorViewProps {
  findings: CryptoFinding[];
  initialAlgorithm?: string;
  onNavigateToRoadmap: () => void;
}

export const MigrationSimulatorView: React.FC<MigrationSimulatorViewProps> = ({
  findings,
  initialAlgorithm = 'RSA-2048',
  onNavigateToRoadmap,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>(
    (initialAlgorithm as AlgorithmType) || 'RSA-2048'
  );
  const [selectedStrategy, setSelectedStrategy] = useState<MigrationStrategyType>(
    'Hybrid Dual-Key (Classical + PQC)'
  );

  const simulation = simulateMigration(selectedAlgo, selectedStrategy);

  const availableAlgos: AlgorithmType[] = [
    'RSA-2048',
    'RSA-4096',
    'ECC-P256',
    'ECDH',
    'Diffie-Hellman',
    '3DES',
    'MD5',
    'SHA-1',
    'AES-128',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <FastForward className="w-6 h-6 text-cyan-400" />
            <span>PQC Migration Impact Simulator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate payload inflation, network MTU packet fragmentation, API buffer constraints, and rollout strategies for NIST Post-Quantum standards.
          </p>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-medium transition-colors self-start sm:self-center"
        >
          <span>View Implementation Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Control Panel: Algorithm & Strategy Selection */}
      <div className="cyber-card p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Target Vulnerable Algorithm
          </label>
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value as AlgorithmType)}
            className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            {availableAlgos.map((algo) => (
              <option key={algo} value={algo}>
                {algo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Migration Strategy Pattern
          </label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value as MigrationStrategyType)}
            className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Hybrid Dual-Key (Classical + PQC)">
              Hybrid Dual-Key (Classical + PQC Composite) - Recommended
            </option>
            <option value="Direct Native PQC Cutover">
              Direct Native PQC Cutover (Immediate FIPS 203/204)
            </option>
            <option value="Cryptographic Agility Abstraction">
              Cryptographic Agility Abstraction Layer
            </option>
            <option value="Deprecation & Algorithm Sunsetting">
              Deprecation & Algorithm Sunsetting
            </option>
          </select>
        </div>
      </div>

      {/* Comparison Metrics Header Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Public Key Sizing */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Public Key Overhead</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              {simulation.keySizeMultiplier}x
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({simulation.sourceMetrics.publicKeySize}B &rarr; {simulation.targetMetrics.publicKeySize}B)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {simulation.keySizeMultiplier > 10 ? 'Severe payload inflation; check database column limits' : 'Manageable overhead for modern storage'}
          </p>
        </div>

        {/* Metric 2: Ciphertext / Signature Sizing */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Cipher / Signature Growth</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-violet-400">
              {simulation.cipherOrSigMultiplier}x
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({simulation.sourceMetrics.ciphertextSizeOrSigSize}B &rarr; {simulation.targetMetrics.ciphertextSizeOrSigSize}B)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Transmitted over network on every session or token exchange
          </p>
        </div>

        {/* Metric 3: Effort & Complexity */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Estimated Engineering Effort</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ~{simulation.estimatedEffortDays}d
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({simulation.complexityScore})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Includes schema expansion, canary testing, and library updates
          </p>
        </div>
      </div>

      {/* Side-by-side Architectural Specification Comparison */}
      <div className="cyber-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-4 bg-cyber-950 border-b border-slate-800 font-mono text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Comparative Technical Specifications</span>
          <span className="text-cyan-400">NIST Post-Quantum Benchmark</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Classical Algorithm Column */}
          <div className="p-6 space-y-4 bg-[#0A0E18]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-400 uppercase font-semibold">
                Classical Primitive
              </span>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                Vulnerable
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-mono">
                {simulation.sourceMetrics.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {simulation.sourceMetrics.category}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800/80">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Security Level:</span>
                <span className="text-slate-200">{simulation.sourceMetrics.securityLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Public Key Size:</span>
                <span className="text-slate-200">{simulation.sourceMetrics.publicKeySize} bytes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cipher / Sig Size:</span>
                <span className="text-slate-200">{simulation.sourceMetrics.ciphertextSizeOrSigSize} bytes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">CPU Latency:</span>
                <span className="text-slate-200">{simulation.sourceMetrics.handshakeLatencyMs} ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">NIST Status:</span>
                <span className="text-amber-400 font-semibold">{simulation.sourceMetrics.fipsStatus}</span>
              </div>
            </div>
          </div>

          {/* Post-Quantum Replacement Column */}
          <div className="p-6 space-y-4 bg-[#081512]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                NIST Post-Quantum Target
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                Quantum Secure
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-mono">
                {simulation.targetMetrics.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {simulation.targetMetrics.category}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800/80">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Security Level:</span>
                <span className="text-emerald-300 font-semibold">{simulation.targetMetrics.securityLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Public Key Size:</span>
                <span className="text-emerald-300 font-bold">{simulation.targetMetrics.publicKeySize} bytes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cipher / Sig Size:</span>
                <span className="text-emerald-300 font-bold">{simulation.targetMetrics.ciphertextSizeOrSigSize} bytes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">CPU Latency:</span>
                <span className="text-emerald-300">{simulation.targetMetrics.handshakeLatencyMs} ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">NIST Status:</span>
                <span className="text-emerald-400 font-semibold">{simulation.targetMetrics.fipsStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Fragmentation Risk Deep Dive */}
      <div className="cyber-card p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider font-semibold">
          <Network className="w-4 h-4" />
          <span>Network & MTU Frame Fragmentation Analysis</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {simulation.fragmentationAnalysis}
        </p>

        <div className="p-3 bg-cyber-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Latency Impact Projection:</span>
          <span className="text-cyan-400 font-bold">{simulation.latencyImpactDelta}</span>
        </div>
      </div>

      {/* Compatibility & Rollout Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compatibility Concerns */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Compatibility & Blast Radius Concerns</span>
          </h3>
          <div className="space-y-2">
            {simulation.compatibilityRisks.map((risk, idx) => (
              <div
                key={idx}
                className="p-3 bg-cyber-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
              >
                <span className="text-amber-400 font-bold">&bull;</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Migration Sequence */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Recommended Phased Rollout Sequence</span>
          </h3>
          <div className="space-y-2">
            {simulation.recommendedSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 bg-cyber-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
              >
                <span className="text-cyan-400 font-bold font-mono">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
