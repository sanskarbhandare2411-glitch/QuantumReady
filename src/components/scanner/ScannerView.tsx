import React, { useState, useRef } from 'react';
import { CryptoFinding } from '../../types/crypto';
import { scanSourceCode, ScanFileInput } from '../../services/scanner';
import { SAMPLE_CODE_PRESETS, CodePreset } from '../../data/sampleSnippets';
import { RiskBadge } from '../common/RiskBadge';
import {
  Upload,
  FileCode,
  Play,
  RotateCcw,
  PlusCircle,
  Replace,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Code2,
  Trash2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ScannerViewProps {
  onScanComplete: (newFindings: CryptoFinding[], mode: 'replace' | 'append') => void;
  onNavigateToSimulator: (algorithm: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onScanComplete,
  onNavigateToSimulator,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [codeText, setCodeText] = useState<string>(SAMPLE_CODE_PRESETS[0].code);
  const [codeFileName, setCodeFileName] = useState<string>(SAMPLE_CODE_PRESETS[0].fileName);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_CODE_PRESETS[0].id);

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<ScanFileInput[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<CryptoFinding[] | null>(null);
  const [scanDuration, setScanDuration] = useState<number>(0);

  // Filters for scan results view
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterAlgorithm, setFilterAlgorithm] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: CodePreset) => {
    setSelectedPresetId(preset.id);
    setCodeText(preset.code);
    setCodeFileName(preset.fileName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: ScanFileInput[] = [];
    const readers: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const p = new Promise<void>((resolve) => {
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            newFiles.push({
              name: file.name,
              content,
            });
          }
          resolve();
        };
        reader.readAsText(file);
      });
      readers.push(p);
    });

    Promise.all(readers).then(() => {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newFiles: ScanFileInput[] = [];
    const readers: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const p = new Promise<void>((resolve) => {
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            newFiles.push({
              name: file.name,
              content,
            });
          }
          resolve();
        };
        reader.readAsText(file);
      });
      readers.push(p);
    });

    Promise.all(readers).then(() => {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    });
  };

  const runScan = () => {
    setIsScanning(true);
    const startTime = performance.now();

    let filesToScan: ScanFileInput[] = [];

    if (activeTab === 'paste') {
      filesToScan = [
        {
          name: codeFileName || 'pasted_code.txt',
          content: codeText,
        },
      ];
    } else {
      filesToScan = uploadedFiles;
    }

    // Small timeout to simulate scanning pipeline and show crisp UI progress
    setTimeout(() => {
      const findings = scanSourceCode(filesToScan);
      const duration = Math.round(performance.now() - startTime);

      setScanResults(findings);
      setScanDuration(duration);
      setIsScanning(false);
    }, 400);
  };

  const handleApplyToInventory = (mode: 'replace' | 'append') => {
    if (scanResults) {
      onScanComplete(scanResults, mode);
    }
  };

  // Filter scan results
  const filteredResults = (scanResults || []).filter((f) => {
    if (filterRisk !== 'all' && f.riskLevel !== filterRisk) return false;
    if (filterAlgorithm !== 'all' && f.algorithm !== filterAlgorithm) return false;
    return true;
  });

  const uniqueScanAlgos = Array.from(new Set((scanResults || []).map((f) => f.algorithm)));

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <span>Cryptographic Source Scanner</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detect classical algorithms (RSA, ECC, ECDH, Diffie-Hellman, SHA-1, MD5, 3DES, TLS) with rule-based quantum risk assessment.
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 bg-cyber-900 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'paste'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Paste Code</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Files ({uploadedFiles.length})</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editor or Dropzone */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'paste' ? (
            <div className="cyber-card rounded-xl overflow-hidden border border-slate-800">
              {/* Editor Toolbar */}
              <div className="px-4 py-2.5 bg-cyber-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <input
                    type="text"
                    value={codeFileName}
                    onChange={(e) => setCodeFileName(e.target.value)}
                    className="bg-transparent border-none text-xs font-mono text-cyan-300 focus:outline-none focus:ring-0 ml-2 w-48"
                    placeholder="filename.py"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {codeText.split('\n').length} lines
                  </span>
                  <button
                    onClick={() => setCodeText('')}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Clear editor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="relative">
                <textarea
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  rows={14}
                  className="w-full bg-[#070A12] text-slate-200 font-mono text-xs p-4 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500/30 selection:text-cyan-200 border-none"
                  placeholder="Paste your source code, cryptographic configuration, or certificate files here..."
                  spellCheck={false}
                />
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="cyber-card rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-cyber-900/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".py,.js,.ts,.tsx,.jsx,.java,.go,.c,.cpp,.h,.hpp,.cs,.pem,.crt,.key,.conf,.json,.yaml,.yml,.txt"
              />

              <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-base font-semibold text-white font-mono">
                Drag & Drop Source Code or Config Files
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Supported: Python, TypeScript, JavaScript, Java, Go, C/C++, C#, PEM/CRT, Nginx/Apache configs.
              </p>

              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-lg bg-cyber-850 hover:bg-cyber-800 text-cyan-400 border border-cyan-800/60 text-xs font-mono font-medium"
              >
                Browse Files
              </button>

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div
                  className="mt-6 w-full max-w-md bg-cyber-950/80 rounded-lg p-3 border border-slate-800 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>{uploadedFiles.length} file(s) staged:</span>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-rose-400 hover:underline text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 no-scrollbar">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs font-mono bg-cyber-900 px-2 py-1 rounded text-slate-300"
                      >
                        <span className="truncate max-w-[240px]">{file.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {file.content.split('\n').length} lines
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sandbox execution: Code is parsed locally without execution</span>
            </div>

            <button
              onClick={runScan}
              disabled={isScanning || (activeTab === 'paste' && !codeText.trim()) || (activeTab === 'upload' && uploadedFiles.length === 0)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold font-mono shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Cryptographic AST...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Pattern Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample Snippets & Presets Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="cyber-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Quick Test Presets</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Load realistic enterprise code snippets with known classical cryptography vulnerabilities:
            </p>

            <div className="space-y-2">
              {SAMPLE_CODE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs font-mono ${
                    selectedPresetId === preset.id && activeTab === 'paste'
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
                      : 'bg-cyber-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className="text-[10px] text-cyan-400 uppercase">{preset.language}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="cyber-card p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <h4 className="font-mono font-semibold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Detection Capabilities</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>RSA keys (1024, 2048, 4096-bit) and modulus sizes</li>
              <li>Elliptic Curves (secp256k1, prime256v1, P-384, P-521)</li>
              <li>Key Exchange (ECDH, Diffie-Hellman, X25519)</li>
              <li>Broken ciphers and hashes (3DES, DES, MD5, SHA-1)</li>
              <li>Protocol configurations (TLS 1.0, TLS 1.1, TLS 1.2)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scan Results Panel */}
      {scanResults !== null && (
        <div className="cyber-card rounded-xl overflow-hidden border border-slate-800 mt-8">
          {/* Results Summary Header */}
          <div className="p-4 sm:p-5 bg-cyber-950/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">
                  Scan Results: {scanResults.length} Finding{scanResults.length === 1 ? '' : 's'}
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {scanDuration}ms
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Discovered in analyzed code buffers using rule-based pattern AST heuristics.
              </p>
            </div>

            {/* Inventory Action Buttons */}
            {scanResults.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApplyToInventory('append')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Append to Inventory</span>
                </button>
                <button
                  onClick={() => handleApplyToInventory('replace')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold shadow-md transition-colors"
                >
                  <Replace className="w-3.5 h-3.5" />
                  <span>Replace Active Inventory</span>
                </button>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          {scanResults.length > 0 && (
            <div className="px-5 py-2.5 bg-cyber-900 border-b border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter By:</span>
              </div>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-cyber-950 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
                <option value="Quantum-Resistant">Quantum-Resistant</option>
              </select>

              <select
                value={filterAlgorithm}
                onChange={(e) => setFilterAlgorithm(e.target.value)}
                className="bg-cyber-950 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs font-mono focus:outline-none"
              >
                <option value="all">All Algorithms</option>
                {uniqueScanAlgos.map((algo) => (
                  <option key={algo} value={algo}>
                    {algo}
                  </option>
                ))}
              </select>

              <span className="text-slate-500 ml-auto">
                Showing {filteredResults.length} of {scanResults.length}
              </span>
            </div>
          )}

          {/* Results List */}
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              {scanResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <p className="font-semibold text-white">No Classical Cryptographic Vulnerabilities Found</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    No recognized RSA, ECC, Diffie-Hellman, MD5, SHA-1, or 3DES patterns were detected in the supplied code.
                  </p>
                </div>
              ) : (
                <p>No findings match the current filter criteria.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredResults.map((finding) => (
                <div key={finding.id} className="p-4 hover:bg-slate-900/40 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {finding.algorithm}
                      </span>
                      <RiskBadge level={finding.riskLevel} size="sm" />
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {finding.detectedPattern}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${finding.isConfirmedUsage ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-400'}`}>
                        {finding.isConfirmedUsage ? 'Confirmed Call' : 'Symbol Reference'}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigateToSimulator(finding.algorithm)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                    >
                      <span>Simulate PQC</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-300">{finding.fileName}</span>
                    <span className="text-slate-600">:</span>
                    <span className="text-cyan-400 font-bold">Line {finding.lineNumber}</span>
                  </div>

                  {/* Code snippet with highlighted line */}
                  <div className="bg-[#070A12] p-2.5 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                    <div className="text-rose-400 font-medium">
                      &gt; {finding.codeSnippet}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong className="text-slate-200">Recommendation:</strong> {finding.actionRequired}
                    </p>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900 shrink-0">
                      Target: {finding.replacementPQC.split('(')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
