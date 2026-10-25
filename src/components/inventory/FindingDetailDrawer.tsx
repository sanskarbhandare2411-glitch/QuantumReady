import React from 'react';
import { CryptoFinding } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import {
  X,
  FileCode,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  AlertTriangle,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface FindingDetailDrawerProps {
  finding: CryptoFinding | null;
  onClose: () => void;
  onSimulate: (algorithm: string) => void;
}

export const FindingDetailDrawer: React.FC<FindingDetailDrawerProps> = ({
  finding,
  onClose,
  onSimulate,
}) => {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-cyber-950 border-l border-cyan-900/60 h-full overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-cyber-900/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyber-950 border border-cyan-500/30 text-cyan-400">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-base font-bold text-white">
                    {finding.algorithm}
                  </h3>
                  <RiskBadge level={finding.riskLevel} size="sm" />
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: <span className="text-cyan-400">{finding.id}</span> • {finding.serviceName || 'App Service'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6">
            {/* Location & Pattern */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-cyber-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px] uppercase">Source Location</span>
                <span className="text-slate-200 font-semibold block mt-1 truncate">
                  {finding.fileName}
                </span>
                <span className="text-cyan-400 font-bold block mt-0.5">
                  Line {finding.lineNumber}
                </span>
              </div>

              <div className="bg-cyber-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px] uppercase">Confidence & Usage</span>
                <span className="text-slate-200 font-semibold block mt-1">
                  {finding.confidence} Confidence
                </span>
                <span className="text-slate-400 block mt-0.5">
                  {finding.isConfirmedUsage ? 'Confirmed Invocations' : 'Reference / Type Mention'}
                </span>
              </div>
            </div>

            {/* Code Snippet with Surrounding Context */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center justify-between">
                <span>Code Context Evidence</span>
                <span className="text-[10px] text-slate-500">{finding.fileType.toUpperCase()}</span>
              </h4>

              <div className="bg-[#05070E] rounded-xl border border-slate-800 p-3 font-mono text-xs overflow-x-auto leading-relaxed">
                {finding.surroundingContext && finding.surroundingContext.length > 0 ? (
                  finding.surroundingContext.map((line, idx) => {
                    const isFocalLine = line.includes(finding.matchedText) || line.trim() === finding.codeSnippet;
                    return (
                      <div
                        key={idx}
                        className={`py-1 px-2 rounded ${isFocalLine ? 'bg-rose-500/20 text-rose-300 font-semibold border-l-2 border-rose-500' : 'text-slate-400'}`}
                      >
                        {line}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-1 px-2 text-rose-300 font-medium">
                    &gt; {finding.codeSnippet}
                  </div>
                )}
              </div>
            </div>

            {/* Quantum Threat & Scientific Explanation */}
            <div className="cyber-card p-4 rounded-xl border border-rose-500/30 bg-rose-950/10">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Quantum Threat Analysis</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {finding.quantumThreat}
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {finding.quantumImpact}
              </p>
            </div>

            {/* Transparent Rule-Based Reasoning */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                Transparent Risk Scoring Justification
              </h4>
              <div className="space-y-2">
                {finding.riskReasoning.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-cyber-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Migration Target & Next Steps */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyber-900 to-cyber-850 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Recommended PQC Target
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {finding.nistStatus}
                </span>
              </div>

              <div className="text-base font-bold text-white font-mono mt-2">
                {finding.replacementPQC}
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {finding.actionRequired}
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-cyber-900 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onSimulate(finding.algorithm);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-bold font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <span>Simulate Migration Impact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
