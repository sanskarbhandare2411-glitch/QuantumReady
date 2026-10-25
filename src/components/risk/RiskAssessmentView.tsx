import React, { useState } from 'react';
import { AlgorithmType, ConfidenceLevel, RiskLevel } from '../../types/crypto';
import { evaluateCryptographicRisk } from '../../services/riskEngine';
import { RiskBadge } from '../common/RiskBadge';
import {
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  AlertOctagon,
  Scale,
  Cpu,
  Calculator,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RiskAssessmentView: React.FC = () => {
  // Interactive Risk Calculator states
  const [calcAlgorithm, setCalcAlgorithm] = useState<AlgorithmType>('RSA-2048');
  const [calcConfirmed, setCalcConfirmed] = useState<boolean>(true);
  const [calcConfidence, setCalcConfidence] = useState<ConfidenceLevel>('High');

  // Evaluate interactive calculator
  const evalResult = evaluateCryptographicRisk({
    algorithm: calcAlgorithm,
    category:
      calcAlgorithm.includes('RSA') || calcAlgorithm.includes('ECC') || calcAlgorithm.includes('DSA')
        ? 'Asymmetric'
        : calcAlgorithm.includes('DH') || calcAlgorithm.includes('X25519')
        ? 'Key Exchange'
        : calcAlgorithm.includes('SHA') || calcAlgorithm.includes('MD5')
        ? 'Hash'
        : 'Symmetric',
    matchedText: `${calcAlgorithm} reference`,
    codeSnippet: `crypto.initialize("${calcAlgorithm}")`,
    isConfirmedUsage: calcConfirmed,
    fileName: 'sample_service.py',
    confidence: calcConfidence,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
          <span>Transparent Rule-Based Risk Engine</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          How QuantumReady scores cryptographic primitives without black-box assumptions, accounting for operational context, Shor&apos;s algorithm, and classical obsolescence.
        </p>
      </div>

      {/* Interactive Risk Evaluator Sandbox */}
      <div className="cyber-card p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyber-900 via-cyber-850 to-cyber-900">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold mb-2">
          <Calculator className="w-4 h-4" />
          <span>Interactive Risk Rule Tester</span>
        </div>
        <h2 className="text-lg font-bold text-white font-mono">
          Simulate Heuristic Scoring for Any Primitive
        </h2>
        <p className="text-xs text-slate-300 mt-1 mb-6">
          Adjust the algorithm, whether it was confirmed in active execution, and observer confidence to see how the engine reasons.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Select Algorithm */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Algorithm / Primitive
            </label>
            <select
              value={calcAlgorithm}
              onChange={(e) => setCalcAlgorithm(e.target.value as AlgorithmType)}
              className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="RSA-1024">RSA-1024 (Classically Weak + Shor)</option>
              <option value="RSA-2048">RSA-2048 (Classical Standard + Shor)</option>
              <option value="RSA-4096">RSA-4096 (Strong Classical + Shor)</option>
              <option value="ECC-P256">ECC-P256 / secp256k1 (Shor Vulnerable)</option>
              <option value="ECDH">ECDH (Harvest Now Decrypt Later)</option>
              <option value="Diffie-Hellman">Diffie-Hellman (Finite Field)</option>
              <option value="SHA-1">SHA-1 (Collision Weakness)</option>
              <option value="MD5">MD5 (Trivially Broken)</option>
              <option value="3DES">3DES / Triple-DES (Sweet32)</option>
              <option value="AES-128">AES-128 (Grover Key Halving)</option>
              <option value="AES-256">AES-256 (Quantum Resistant)</option>
              <option value="SHA-256">SHA-256 (Quantum Resistant)</option>
              <option value="TLS 1.2">TLS 1.2 (Classical Key Exchange)</option>
            </select>
          </div>

          {/* Confirmed Execution Toggle */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Operational Call Context
            </label>
            <select
              value={calcConfirmed ? 'yes' : 'no'}
              onChange={(e) => setCalcConfirmed(e.target.value === 'yes')}
              className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="yes">Confirmed Execution (Cipher / Keygen / Sign)</option>
              <option value="no">Unconfirmed Reference (Import / Variable / String)</option>
            </select>
          </div>

          {/* Observer Confidence */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 font-semibold">
              Detection Confidence
            </label>
            <select
              value={calcConfidence}
              onChange={(e) => setCalcConfidence(e.target.value as ConfidenceLevel)}
              className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="High">High Confidence (Exact Syntax Match)</option>
              <option value="Medium">Medium Confidence (Pattern Heuristic)</option>
              <option value="Low">Low Confidence (Proximity / Comment)</option>
            </select>
          </div>
        </div>

        {/* Engine Result Box */}
        <div className="bg-[#05070E] p-5 rounded-xl border border-cyan-500/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Assessed Output:</span>
              <RiskBadge level={evalResult.riskLevel} size="lg" />
              <span className="text-xs font-mono text-slate-400">
                Confidence: <strong className="text-white">{evalResult.confidence}</strong>
              </span>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-900">
              {evalResult.nistStatus}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
              Deterministic Reasoning Trail:
            </span>
            <div className="space-y-1.5">
              {evalResult.riskReasoning.map((r, i) => (
                <div key={i} className="text-xs font-mono text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">&gt;</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>
              Target PQC Replacement:{' '}
              <strong className="text-white">{evalResult.pqcReplacement}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Methodology Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Shor's Algorithm */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase">
            <AlertOctagon className="w-4 h-4" />
            <span>Pillar 1: Shor&apos;s Algorithm Factor</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Asymmetric Factorization & Discrete Log Collapse
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Shor&apos;s algorithm provides an <strong>exponential speedup</strong> over classical number-sieve algorithms. Increasing RSA key length from 2048 to 4096 bits only modestly delays a quantum adversary (polynomial scaling), while imposing massive classical computational overhead.
          </p>
          <div className="p-3 bg-cyber-950 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
            <strong>Rule:</strong> Any confirmed operational use of RSA, ECC, ECDSA, ECDH, or Diffie-Hellman receives minimum <strong>High or Critical</strong> risk.
          </div>
        </div>

        {/* Pillar 2: Grover's Algorithm */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase">
            <Scale className="w-4 h-4" />
            <span>Pillar 2: Grover&apos;s Algorithm Factor</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Quadratic Speedup on Symmetric Ciphers
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Grover&apos;s algorithm offers only a <strong>quadratic speedup</strong> (O(&radic;N)), effectively cutting symmetric key lengths in half:
          </p>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li><strong>AES-128:</strong> Effectively downgraded to 64-bit security (Marginal / Medium risk).</li>
            <li><strong>AES-256:</strong> Retains 128-bit quantum security (Quantum-Resistant).</li>
            <li><strong>SHA-256:</strong> Retains 128-bit collision resistance (Quantum-Resistant).</li>
          </ul>
          <div className="p-3 bg-cyber-950 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
            <strong>Rule:</strong> AES-256 and SHA-256 require NO algorithmic migration and receive <strong>Quantum-Safe</strong> status.
          </div>
        </div>

        {/* Pillar 3: Harvest Now, Decrypt Later */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Clock className="w-4 h-4" />
            <span>Pillar 3: Harvest Now, Decrypt Later (HNDL)</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Exposure Window & Retention Horizon
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Digital signatures (ML-DSA) can wait until quantum computers exist because past signatures do not risk data leakage. But <strong>Key Encapsulation and Key Exchange (ML-KEM)</strong> must be deployed immediately to prevent adversaries recording TLS sessions today.
          </p>
          <div className="p-3 bg-cyber-950 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
            <strong>Rule:</strong> Ephemeral key exchange (ECDH / DH / TLS) and public encryption receive elevated <strong>Critical urgency</strong>.
          </div>
        </div>

        {/* Pillar 4: Uncertainty & Context */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-semibold uppercase">
            <Info className="w-4 h-4" />
            <span>Pillar 4: Uncertainty & False Positive Dampening</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Avoiding Alert Fatigue
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Static AST pattern matching encounters imports, test suites, and dead code. Classifying every mention as Critical creates alert fatigue and undermines remediation credibility.
          </p>
          <div className="p-3 bg-cyber-950 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
            <strong>Rule:</strong> Unconfirmed mentions without operational function execution drop one risk tier (Critical $\to$ High or Medium) with explicit confidence notes.
          </div>
        </div>
      </div>
    </div>
  );
};
