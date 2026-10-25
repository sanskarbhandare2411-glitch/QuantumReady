export type AlgorithmType =
  | 'RSA-1024'
  | 'RSA-2048'
  | 'RSA-4096'
  | 'RSA-General'
  | 'ECC-P256'
  | 'ECC-P384'
  | 'ECC-P521'
  | 'ECDSA'
  | 'ECDH'
  | 'Diffie-Hellman'
  | 'DSA'
  | 'Ed25519'
  | 'X25519'
  | 'SHA-1'
  | 'MD5'
  | 'SHA-256'
  | 'SHA-384'
  | 'SHA-512'
  | 'AES-128'
  | 'AES-256'
  | '3DES'
  | 'DES'
  | 'TLS 1.0/1.1'
  | 'TLS 1.2'
  | 'TLS 1.3'
  | 'Crypto-Library';

export type AlgorithmCategory =
  | 'Asymmetric'
  | 'Symmetric'
  | 'Hash'
  | 'Key Exchange'
  | 'Protocol'
  | 'Crypto Library';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Quantum-Resistant';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type QuantumThreatType =
  | "Shor's Algorithm (Full Break)"
  | "Grover's Algorithm (Key Halving)"
  | "Classical Vulnerability (Collision/Broken)"
  | "Protocol Degradation"
  | "Quantum Safe / Negligible Impact";

export interface CryptoFinding {
  id: string;
  fileName: string;
  filePath?: string;
  fileType: string;
  lineNumber: number;
  matchedText: string;
  codeSnippet: string;
  surroundingContext?: string[];
  algorithm: AlgorithmType;
  algorithmCategory: AlgorithmCategory;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  quantumThreat: QuantumThreatType;
  quantumImpact: string;
  nistStatus: string; // e.g. "Deprecated 2030", "FIPS 203 Replaced", "Disallowed"
  replacementPQC: string; // e.g. "ML-KEM-768 (FIPS 203)", "ML-DSA-65 (FIPS 204)"
  explanation: string;
  riskReasoning: string[];
  actionRequired: string;
  serviceName?: string;
  detectedPattern: string;
  isConfirmedUsage: boolean; // Confirmed cryptographic call vs string/import reference
  timestamp?: string;
}

export interface ScanSummary {
  totalFindings: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  quantumResistant: number;
  filesScanned: number;
  quantumReadinessScore: number; // 0 to 100
  isDemoData: boolean;
  scanDurationMs: number;
  scannedAt: string;
}
