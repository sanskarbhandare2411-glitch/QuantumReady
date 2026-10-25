export type NodeType =
  | 'application'
  | 'service'
  | 'crypto-primitive'
  | 'library'
  | 'data-store';

export interface GraphNodeData {
  label: string;
  sublabel?: string;
  type: NodeType;
  algorithm?: string;
  riskLevel?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Quantum-Resistant';
  quantumThreat?: string;
  pqcReplacement?: string;
  findingCount?: number;
  details?: string;
}

export interface DependencyFilter {
  showServices: boolean;
  showPrimitives: boolean;
  showLibraries: boolean;
  riskOnly: boolean;
}
