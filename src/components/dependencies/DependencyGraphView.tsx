import React, { useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CryptoFinding } from '../../types/crypto';
import {
  GitGraph,
  Layers,
  ShieldAlert,
  Cpu,
  Lock,
  Sparkles,
  Info,
  Filter,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface DependencyGraphViewProps {
  findings: CryptoFinding[];
  isDemoData: boolean;
  onSimulateAlgorithm: (algorithm: string) => void;
}

// Custom Node Component for Cyber Aesthetic
const CyberCustomNode = ({ data }: { data: any }) => {
  const getBorderColor = () => {
    if (data.type === 'service') return 'border-cyan-500/50 bg-[#0C1220]';
    if (data.type === 'pqc') return 'border-emerald-500/60 bg-[#091A14] shadow-[0_0_15px_rgba(16,185,129,0.25)]';
    if (data.riskLevel === 'Critical') return 'border-rose-500/60 bg-[#1A0B10] shadow-[0_0_15px_rgba(244,63,94,0.25)]';
    if (data.riskLevel === 'High') return 'border-amber-500/60 bg-[#1A140B] shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    if (data.riskLevel === 'Quantum-Resistant') return 'border-emerald-500/50 bg-[#091A14]';
    return 'border-slate-700 bg-cyber-900';
  };

  const getIcon = () => {
    if (data.type === 'service') return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
    if (data.type === 'pqc') return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    return <Lock className="w-3.5 h-3.5 text-amber-400" />;
  };

  return (
    <div
      className={`px-3 py-2 rounded-xl border font-mono text-xs cursor-pointer transition-all hover:scale-105 min-w-[170px] ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2 !h-2" />

      <div className="flex items-center gap-1.5 mb-1">
        {getIcon()}
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
          {data.sublabel || data.type}
        </span>
      </div>

      <div className="font-bold text-white text-xs truncate">{data.label}</div>

      {data.status && (
        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
          <span className="truncate">{data.status}</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-violet-400 !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  cyberNode: CyberCustomNode,
};

export const DependencyGraphView: React.FC<DependencyGraphViewProps> = ({
  findings,
  isDemoData,
  onSimulateAlgorithm,
}) => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Filter toggles
  const [showPQC, setShowPQC] = useState<boolean>(true);
  const [showLibraries, setShowLibraries] = useState<boolean>(true);

  // Generate Graph Nodes & Edges dynamically from findings or demo architecture
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [
      // Layer 1: Services (Top Level)
      {
        id: 'srv-gateway',
        type: 'cyberNode',
        position: { x: 80, y: 30 },
        data: {
          label: 'API Edge Gateway',
          sublabel: 'Ingress Microservice',
          type: 'service',
          status: 'Nginx / Envoy TLS',
          details: 'Handles all public internet customer requests and negotiates TLS handshakes.',
        },
      },
      {
        id: 'srv-auth',
        type: 'cyberNode',
        position: { x: 340, y: 30 },
        data: {
          label: 'Auth Service',
          sublabel: 'Identity Provider',
          type: 'service',
          status: 'OAuth2 / JWT Minting',
          details: 'Issues and verifies cryptographic bearer tokens across all 24 downstream microservices.',
        },
      },
      {
        id: 'srv-payment',
        type: 'cyberNode',
        position: { x: 600, y: 30 },
        data: {
          label: 'Payment Core',
          sublabel: 'Financial Settlement',
          type: 'service',
          status: 'HSM Interface',
          details: 'Processes card transactions, ATM PIN blocks, and inter-bank SWIFT messages.',
        },
      },
      {
        id: 'srv-ledger',
        type: 'cyberNode',
        position: { x: 860, y: 30 },
        data: {
          label: 'Core Banking Ledger',
          sublabel: 'System of Record',
          type: 'service',
          status: 'ACID Database Engine',
          details: 'Stores immutable account balances and ledger entries with column-level encryption.',
        },
      },

      // Layer 2: Discovered Cryptographic Primitives
      {
        id: 'prim-tls12',
        type: 'cyberNode',
        position: { x: 60, y: 160 },
        data: {
          label: 'TLS 1.2 (ECDHE-RSA)',
          sublabel: 'Crypto Primitive',
          type: 'primitive',
          riskLevel: 'High',
          status: 'Shor Vulnerable',
          details: 'Classical key exchange subject to Harvest Now Decrypt Later eavesdropping.',
        },
      },
      {
        id: 'prim-rsa2048',
        type: 'cyberNode',
        position: { x: 320, y: 160 },
        data: {
          label: 'RSA-2048 (RS256)',
          sublabel: 'Crypto Primitive',
          type: 'primitive',
          riskLevel: 'Critical',
          status: 'Shor Factorable',
          details: 'Integer factorization solvable by Shor’s algorithm on quantum hardware.',
        },
      },
      {
        id: 'prim-3des',
        type: 'cyberNode',
        position: { x: 580, y: 160 },
        data: {
          label: '3DES (Triple-DES)',
          sublabel: 'Crypto Primitive',
          type: 'primitive',
          riskLevel: 'Critical',
          status: 'Classical Obsolete',
          details: 'Sweet32 collision vulnerability; revoked by NIST SP 800-131A in 2023.',
        },
      },
      {
        id: 'prim-aes256',
        type: 'cyberNode',
        position: { x: 850, y: 160 },
        data: {
          label: 'AES-256-GCM',
          sublabel: 'Crypto Primitive',
          type: 'primitive',
          riskLevel: 'Quantum-Resistant',
          status: 'Grover Resilient',
          details: 'Retains 128-bit quantum security after Grover’s quadratic speedup.',
        },
      },

      // Layer 3: Cryptographic Runtime Libraries
      {
        id: 'lib-openssl',
        type: 'cyberNode',
        position: { x: 180, y: 280 },
        data: {
          label: 'OpenSSL 3.0 / libcrypto',
          sublabel: 'Crypto Library',
          type: 'library',
          status: 'C Engine Runtime',
          details: 'Native shared library executing TLS and asymmetric cipher operations.',
        },
      },
      {
        id: 'lib-bouncycastle',
        type: 'cyberNode',
        position: { x: 680, y: 280 },
        data: {
          label: 'BouncyCastle JCA',
          sublabel: 'Crypto Library',
          type: 'library',
          status: 'Java Security Provider',
          details: 'Java Cryptography Extension provider powering payment HSM drivers.',
        },
      },

      // Layer 4: Target NIST Post-Quantum Standards
      {
        id: 'pqc-mlkem',
        type: 'cyberNode',
        position: { x: 100, y: 410 },
        data: {
          label: 'ML-KEM-768 (Kyber)',
          sublabel: 'NIST Standard (FIPS 203)',
          type: 'pqc',
          status: 'Post-Quantum Safe',
          details: 'Module-Lattice Key Encapsulation Mechanism for quantum-secure key agreement.',
        },
      },
      {
        id: 'pqc-mldsa',
        type: 'cyberNode',
        position: { x: 360, y: 410 },
        data: {
          label: 'ML-DSA-65 (Dilithium)',
          sublabel: 'NIST Standard (FIPS 204)',
          type: 'pqc',
          status: 'Post-Quantum Safe',
          details: 'Module-Lattice Digital Signature Algorithm for quantum-proof authentication.',
        },
      },
      {
        id: 'pqc-aes256',
        type: 'cyberNode',
        position: { x: 620, y: 410 },
        data: {
          label: 'AES-256-GCM Direct',
          sublabel: 'NIST Approved',
          type: 'pqc',
          status: 'Quantum Resistant',
          details: 'Direct native authenticated cipher replacement for obsolete Triple-DES.',
        },
      },
    ];

    const edges: Edge[] = [
      // Service -> Primitive connections
      {
        id: 'e-gw-tls',
        source: 'srv-gateway',
        target: 'prim-tls12',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
      },
      {
        id: 'e-auth-rsa',
        source: 'srv-auth',
        target: 'prim-rsa2048',
        animated: true,
        style: { stroke: '#f43f5e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' },
      },
      {
        id: 'e-pay-3des',
        source: 'srv-payment',
        target: 'prim-3des',
        animated: true,
        style: { stroke: '#f43f5e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' },
      },
      {
        id: 'e-led-aes',
        source: 'srv-ledger',
        target: 'prim-aes256',
        style: { stroke: '#10b981', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },

      // Primitive -> Library connections
      {
        id: 'e-tls-openssl',
        source: 'prim-tls12',
        target: 'lib-openssl',
        style: { stroke: '#64748b', strokeDasharray: '4 4' },
      },
      {
        id: 'e-rsa-openssl',
        source: 'prim-rsa2048',
        target: 'lib-openssl',
        style: { stroke: '#64748b', strokeDasharray: '4 4' },
      },
      {
        id: 'e-3des-bc',
        source: 'prim-3des',
        target: 'lib-bouncycastle',
        style: { stroke: '#64748b', strokeDasharray: '4 4' },
      },

      // Primitive -> PQC Target Migration connections
      {
        id: 'e-tls-mlkem',
        source: 'prim-tls12',
        target: 'pqc-mlkem',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      {
        id: 'e-rsa-mldsa',
        source: 'prim-rsa2048',
        target: 'pqc-mldsa',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
      {
        id: 'e-3des-aes',
        source: 'prim-3des',
        target: 'pqc-aes256',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
      },
    ];

    return { initialNodes: nodes, initialEdges: edges };
  }, [findings]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter displayed nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (!showPQC && n.data.type === 'pqc') return false;
      if (!showLibraries && n.data.type === 'library') return false;
      return true;
    });
  }, [nodes, showPQC, showLibraries]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <GitGraph className="w-6 h-6 text-cyan-400" />
              <span>Cryptographic Dependency & Topology Graph</span>
            </h1>
            {isDemoData && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Enterprise Topology
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Trace the blast radius from microservices down to cryptographic primitives, shared libraries, and NIST PQC targets.
          </p>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showPQC}
              onChange={(e) => setShowPQC(e.target.checked)}
              className="rounded bg-cyber-950 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span className="text-emerald-400 font-semibold">Show PQC Targets</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showLibraries}
              onChange={(e) => setShowLibraries(e.target.checked)}
              className="rounded bg-cyber-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Show Libraries</span>
          </label>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 h-[540px] cyber-card rounded-2xl overflow-hidden border border-slate-800 relative bg-[#070A12]">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-cyber-900 !border !border-slate-700 !text-slate-200" />
            <MiniMap
              className="!bg-cyber-950 !border !border-slate-800"
              nodeColor={(n) => {
                if (n.data?.type === 'service') return '#06b6d4';
                if (n.data?.type === 'pqc') return '#10b981';
                if (n.data?.riskLevel === 'Critical') return '#f43f5e';
                return '#94a3b8';
              }}
            />
          </ReactFlow>

          {/* Graph Legend Overlay */}
          <div className="absolute top-4 left-4 bg-cyber-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 pointer-events-none">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Legend
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Application Service Layer</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Vulnerable Classical Primitive</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>NIST FIPS 203/204 PQC Target</span>
            </div>
          </div>
        </div>

        {/* Selected Node Inspection Panel */}
        <div className="lg:col-span-3 cyber-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
              <Info className="w-4 h-4" />
              <span>Node Inspector</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                    {selectedNode.sublabel || selectedNode.type}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono mt-0.5">
                    {selectedNode.label}
                  </h3>
                  <div className="mt-1">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/60 inline-block">
                      {selectedNode.status || 'Active Node'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-cyber-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedNode.details}
                </div>

                {selectedNode.riskLevel && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Quantum Vulnerability:</span>
                      <span className="text-rose-400 font-bold">
                        {selectedNode.riskLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs font-mono space-y-2">
                <p>Click any node in the topology map to inspect its connections, blast radius, and migration dependencies.</p>
              </div>
            )}
          </div>

          {selectedNode && (selectedNode.label.includes('RSA') || selectedNode.label.includes('TLS') || selectedNode.label.includes('3DES')) && (
            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => onSimulateAlgorithm(selectedNode.label.split(' ')[0])}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Simulate Migration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
