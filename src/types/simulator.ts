export type MigrationStrategyType =
  | 'Hybrid Dual-Key (Classical + PQC)'
  | 'Direct Native PQC Cutover'
  | 'Cryptographic Agility Abstraction'
  | 'Deprecation & Algorithm Sunsetting';

export interface AlgorithmMetrics {
  name: string;
  category: string;
  securityLevel: string; // e.g. "NIST Level 1 (AES-128 equivalent)", "NIST Level 3"
  publicKeySize: number; // bytes
  privateKeySize: number; // bytes
  ciphertextSizeOrSigSize: number; // bytes
  handshakeLatencyMs: number;
  networkFragmentationRisk: 'Low' | 'Medium' | 'High' | 'Severe';
  fipsStatus: string; // e.g. "FIPS 203 Approved (Aug 2024)"
}

export interface SimulationResult {
  sourceAlgorithm: string;
  targetPQC: string;
  strategy: MigrationStrategyType;
  sourceMetrics: AlgorithmMetrics;
  targetMetrics: AlgorithmMetrics;
  keySizeMultiplier: number;
  cipherOrSigMultiplier: number;
  latencyImpactDelta: string;
  fragmentationAnalysis: string;
  compatibilityRisks: string[];
  testingRequirements: string[];
  recommendedSteps: string[];
  estimatedEffortDays: number;
  complexityScore: 'Low' | 'Medium' | 'High' | 'Complex Architectural Shift';
}
