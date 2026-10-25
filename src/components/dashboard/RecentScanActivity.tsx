import React from 'react';
import { CryptoFinding } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { FileCode, ArrowRight, ShieldAlert } from 'lucide-react';

interface RecentScanActivityProps {
  findings: CryptoFinding[];
  onSelectFinding: (finding: CryptoFinding) => void;
  onNavigateToSimulator: (algorithm: string) => void;
}

export const RecentScanActivity: React.FC<RecentScanActivityProps> = ({
  findings,
  onSelectFinding,
  onNavigateToSimulator,
}) => {
  const recentItems = findings.slice(0, 5);

  if (recentItems.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No cryptographic activity recorded. Run a code scan to populate findings.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80">
      {recentItems.map((finding) => (
        <div
          key={finding.id}
          className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-cyber-900 border border-slate-800 text-cyan-400 mt-0.5 group-hover:border-cyan-500/40 transition-colors">
              <FileCode className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-semibold text-white">
                  {finding.algorithm}
                </span>
                <RiskBadge level={finding.riskLevel} size="sm" />
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {finding.id}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1 truncate">
                <span className="truncate text-slate-300">{finding.fileName}</span>
                <span className="text-slate-600">:</span>
                <span className="text-cyan-400 font-bold">L{finding.lineNumber}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 truncate">{finding.serviceName || 'App Service'}</span>
              </div>

              <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic font-mono text-[11px] bg-cyber-950/70 p-1 rounded border border-slate-800/60">
                {finding.codeSnippet}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onSelectFinding(finding)}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Inspect
            </button>
            <button
              onClick={() => onNavigateToSimulator(finding.algorithm)}
              className="px-2.5 py-1.5 rounded-md bg-cyan-950 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <span>Simulate PQC</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
