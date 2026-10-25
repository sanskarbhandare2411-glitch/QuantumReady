import React, { useState } from 'react';
import { CryptoFinding, RiskLevel } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { FindingDetailDrawer } from './FindingDetailDrawer';
import {
  Search,
  Filter,
  Download,
  FileCode,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface InventoryViewProps {
  findings: CryptoFinding[];
  isDemoData: boolean;
  onSimulateAlgorithm: (algorithm: string) => void;
  onSelectFinding: (finding: CryptoFinding) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  findings,
  isDemoData,
  onSimulateAlgorithm,
  onSelectFinding,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmedOnly, setConfirmedOnly] = useState<boolean>(false);
  const [activeDrawerFinding, setActiveDrawerFinding] = useState<CryptoFinding | null>(null);

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (selectedRisk !== 'all' && f.riskLevel !== selectedRisk) return false;
    if (selectedCategory !== 'all' && f.algorithmCategory !== selectedCategory) return false;
    if (confirmedOnly && !f.isConfirmedUsage) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAlgo = f.algorithm.toLowerCase().includes(q);
      const matchFile = f.fileName.toLowerCase().includes(q);
      const matchSnippet = f.codeSnippet.toLowerCase().includes(q);
      const matchService = (f.serviceName || '').toLowerCase().includes(q);
      const matchId = f.id.toLowerCase().includes(q);
      if (!matchAlgo && !matchFile && !matchSnippet && !matchService && !matchId) return false;
    }

    return true;
  });

  const categories = Array.from(new Set(findings.map((f) => f.algorithmCategory)));

  // Export as CycloneDX CBOM JSON
  const exportCBOMJson = () => {
    const cbom = {
      bomFormat: 'CycloneDX-CBOM',
      specVersion: '1.6',
      serialNumber: `urn:uuid:${Math.random().toString(36).substring(2, 15)}`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [
          {
            vendor: 'QuantumReady Security Inc.',
            name: 'QuantumReady Discovery & Migration Engine',
            version: '1.0.0',
          },
        ],
        component: {
          type: 'application',
          name: isDemoData ? 'ApexBank Core Banking' : 'Scanned Application Codebase',
        },
      },
      components: filteredFindings.map((f) => ({
        type: 'cryptographic-asset',
        name: f.algorithm,
        group: f.algorithmCategory,
        version: f.nistStatus,
        properties: [
          { name: 'quantum:threat', value: f.quantumThreat },
          { name: 'quantum:riskLevel', value: f.riskLevel },
          { name: 'quantum:targetPQC', value: f.replacementPQC },
          { name: 'source:file', value: f.fileName },
          { name: 'source:line', value: String(f.lineNumber) },
          { name: 'source:evidence', value: f.codeSnippet },
          { name: 'service:name', value: f.serviceName || 'App Service' },
        ],
      })),
    };

    const blob = new Blob([JSON.stringify(cbom, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantumready-cbom-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export as CSV
  const exportCSV = () => {
    const headers = [
      'Finding ID',
      'Algorithm',
      'Category',
      'Risk Level',
      'Quantum Threat',
      'NIST Status',
      'PQC Replacement',
      'File Name',
      'Line Number',
      'Code Snippet',
      'Service',
      'Confirmed Usage',
    ];

    const rows = filteredFindings.map((f) => [
      `"${f.id}"`,
      `"${f.algorithm}"`,
      `"${f.algorithmCategory}"`,
      `"${f.riskLevel}"`,
      `"${f.quantumThreat}"`,
      `"${f.nistStatus}"`,
      `"${f.replacementPQC}"`,
      `"${f.fileName}"`,
      f.lineNumber,
      `"${f.codeSnippet.replace(/"/g, '""')}"`,
      `"${f.serviceName || ''}"`,
      f.isConfirmedUsage ? 'Yes' : 'No',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantumready-inventory-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              Cryptographic Bill of Materials (CBOM)
            </h1>
            {isDemoData && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Demo
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete inventory of cryptographic primitives, key lengths, quantum vulnerability classifications, and PQC replacements.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={filteredFindings.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyber-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={exportCBOMJson}
            disabled={filteredFindings.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CBOM JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by algorithm, filename, snippet, service, or finding ID..."
              className="w-full bg-[#05070E] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-[#05070E] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
            <option value="Quantum-Resistant">Quantum-Safe</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#05070E] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Confirmed usage checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 select-none">
            <input
              type="checkbox"
              checked={confirmedOnly}
              onChange={(e) => setConfirmedOnly(e.target.checked)}
              className="rounded bg-cyber-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Confirmed Calls Only</span>
          </label>
        </div>

        {/* Active Filter Metrics */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <span>
            Displaying <strong className="text-cyan-400">{filteredFindings.length}</strong> of{' '}
            <strong className="text-white">{findings.length}</strong> inventory items
          </span>

          {(selectedRisk !== 'all' || selectedCategory !== 'all' || searchQuery || confirmedOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRisk('all');
                setSelectedCategory('all');
                setConfirmedOnly(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="cyber-card rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cyber-950 border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">ID / Algorithm</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Risk Level</th>
                <th className="py-3.5 px-4 font-semibold">Quantum Impact</th>
                <th className="py-3.5 px-4 font-semibold">Recommended PQC Target</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No cryptographic findings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFindings.map((finding) => (
                  <tr
                    key={finding.id}
                    onClick={() => setActiveDrawerFinding(finding)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Algorithm & ID */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {finding.algorithm}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{finding.id}</span>
                        <span>•</span>
                        <span className="text-slate-400">{finding.algorithmCategory}</span>
                      </div>
                    </td>

                    {/* Location & Code */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-300 font-medium truncate flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{finding.fileName}</span>
                        <span className="text-cyan-400 font-bold shrink-0">L{finding.lineNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 italic truncate mt-0.5 max-w-xs font-mono">
                        {finding.codeSnippet}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3 px-4">
                      <RiskBadge level={finding.riskLevel} size="sm" />
                      <span className="block text-[10px] text-slate-500 mt-1">
                        {finding.confidence} Confidence
                      </span>
                    </td>

                    {/* Quantum Impact */}
                    <td className="py-3 px-4 max-w-xs font-sans text-xs text-slate-300">
                      <div className="font-semibold text-slate-200 truncate">
                        {finding.quantumThreat}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {finding.nistStatus}
                      </div>
                    </td>

                    {/* Target PQC */}
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="text-cyan-300 font-medium bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/60 inline-block truncate max-w-[200px]">
                        {finding.replacementPQC.split('(')[0]}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate mt-1 max-w-[200px]">
                        {finding.serviceName || 'App Service'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveDrawerFinding(finding)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => onSimulateAlgorithm(finding.algorithm)}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Simulate migration parameters"
                        >
                          <span>Simulate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Detail Drawer */}
      <FindingDetailDrawer
        finding={activeDrawerFinding}
        onClose={() => setActiveDrawerFinding(null)}
        onSimulate={onSimulateAlgorithm}
      />
    </div>
  );
};
