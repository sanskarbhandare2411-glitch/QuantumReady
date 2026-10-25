import { AlgorithmCategory, AlgorithmType, ConfidenceLevel, CryptoFinding, QuantumThreatType, RiskLevel } from '../types/crypto';
import { ALGORITHM_KNOWLEDGE_BASE } from './pqcKnowledge';

export interface EvaluationInput {
  algorithm: AlgorithmType;
  category: AlgorithmCategory;
  matchedText: string;
  codeSnippet: string;
  isConfirmedUsage: boolean;
  fileName: string;
  confidence: ConfidenceLevel;
}

export interface EvaluationResult {
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  quantumThreat: QuantumThreatType;
  quantumImpact: string;
  nistStatus: string;
  pqcReplacement: string;
  explanation: string;
  riskReasoning: string[];
  actionRequired: string;
}

export function evaluateCryptographicRisk(input: EvaluationInput): EvaluationResult {
  const { algorithm, matchedText, codeSnippet, isConfirmedUsage, fileName, confidence } = input;
  const kb = ALGORITHM_KNOWLEDGE_BASE[algorithm] || ALGORITHM_KNOWLEDGE_BASE['RSA-General'];

  const reasoning: string[] = [];
  let finalRisk: RiskLevel = 'Medium';
  let adjustedConfidence = confidence;

  // 1. Quantum Impact & Threat categorization
  const quantumThreat = kb.threatType;
  const nistStatus = kb.nistStatus;
  const pqcReplacement = kb.pqcReplacement;

  // 2. Rule-based risk assignment
  if (algorithm === 'AES-256' || algorithm === 'SHA-256') {
    finalRisk = 'Quantum-Resistant';
    reasoning.push(
      `Symmetric security margin: ${algorithm} provides >= 128 bits of quantum security against Grover's algorithm.`,
      `NIST Post-Quantum Cryptography guidelines approve ${algorithm} without algorithmic replacement.`
    );
    if (!isConfirmedUsage) {
      reasoning.push('Reference detected as import or configuration string; verify operational usage.');
    }
  } else if (algorithm === 'MD5' || algorithm === 'DES' || algorithm === '3DES' || algorithm === 'TLS 1.0/1.1' || algorithm === 'RSA-1024') {
    // Classically broken legacy primitives
    if (isConfirmedUsage) {
      finalRisk = 'Critical';
      reasoning.push(
        `Immediate classical vulnerability: ${algorithm} is cryptographically obsolete, revoked by NIST, and prone to direct attacks.`,
        `Quantum impact is secondary to immediate pre-quantum exploitability (e.g., collisions, key recovery).`
      );
    } else {
      finalRisk = 'High';
      adjustedConfidence = 'Medium';
      reasoning.push(
        `Reference to obsolete primitive ${algorithm} discovered in source code.`,
        `Assessed as High rather than Critical because active execution has not been conclusively validated.`
      );
    }
  } else if (algorithm === 'SHA-1') {
    if (isConfirmedUsage) {
      finalRisk = 'High';
      reasoning.push(
        'SHA-1 collision attacks are practically feasible today (NIST disallowed for generation).',
        'Should be replaced immediately with SHA-256 or SHA-3.'
      );
    } else {
      finalRisk = 'Medium';
      reasoning.push('Potential legacy hashing reference; check if used for security or non-security checksumming.');
    }
  } else if (
    algorithm === 'RSA-2048' ||
    algorithm === 'RSA-4096' ||
    algorithm === 'RSA-General' ||
    algorithm === 'ECC-P256' ||
    algorithm === 'ECC-P384' ||
    algorithm === 'ECC-P521' ||
    algorithm === 'ECDSA' ||
    algorithm === 'ECDH' ||
    algorithm === 'Diffie-Hellman' ||
    algorithm === 'DSA' ||
    algorithm === 'Ed25519' ||
    algorithm === 'X25519'
  ) {
    // Asymmetric & Key Exchange: Shor's algorithm threat
    const isKeyExchange = algorithm === 'ECDH' || algorithm === 'Diffie-Hellman' || algorithm === 'X25519';
    
    if (isConfirmedUsage) {
      if (isKeyExchange || algorithm === 'RSA-2048' || algorithm === 'ECC-P256') {
        finalRisk = 'Critical';
        reasoning.push(
          `Vulnerable to Shor's Algorithm: Polynomial time integer factorization or discrete log breaking.`,
          `Urgent "Harvest Now, Decrypt Later" (HNDL) exposure: Encrypted communications or exchanged session keys can be stored by adversaries today and decrypted once a CRQC exists.`,
          `Active instantiation identified in file: ${fileName}.`
        );
      } else {
        finalRisk = 'High';
        reasoning.push(
          `Vulnerable to Shor's Algorithm: Signatures or tokens can be forged once quantum capability is reached.`,
          `Classical key size provides zero quantum advantage against Shor's algorithm.`,
          `NIST FIPS 204 (ML-DSA) migration required.`
        );
      }
    } else {
      // Uncertainty check: Not confirmed active execution (e.g. constant, type, import)
      finalRisk = 'Medium';
      adjustedConfidence = 'Low';
      reasoning.push(
        `Algorithm symbol referenced, but direct cryptographic execution (keygen/encrypt/sign) was not conclusively observed on this line.`,
        `Classified as Medium risk pending static call-graph verification to avoid alert fatigue.`,
        `If this module flows into production crypto pipelines, elevate to High/Critical.`
      );
    }
  } else if (algorithm === 'AES-128') {
    if (isConfirmedUsage) {
      finalRisk = 'Medium';
      reasoning.push(
        "Grover's Algorithm reduces effective key strength from 128 bits down to 64 bits.",
        "While not broken today, 64-bit security lies within potential quantum brute-force reach. Upgrade to AES-256 recommended."
      );
    } else {
      finalRisk = 'Low';
      reasoning.push('Reference to AES-128; verify whether sensitive long-term data at rest is being encrypted.');
    }
  } else if (algorithm === 'TLS 1.2') {
    if (isConfirmedUsage) {
      finalRisk = 'High';
      reasoning.push(
        'TLS 1.2 lacks native quantum-hybrid cipher suites standardized in modern TLS 1.3 drafts.',
        'Transport traffic is exposed to retroactive decryption if classical DH/ECDHE is negotiated.'
      );
    } else {
      finalRisk = 'Medium';
      reasoning.push('Configuration references TLS 1.2; ensure minimum protocol policy enforces TLS 1.3 with hybrid groups.');
    }
  } else {
    // Crypto libraries or generic
    finalRisk = isConfirmedUsage ? 'Medium' : 'Low';
    reasoning.push(
      `Third-party cryptographic dependency detected (${matchedText}).`,
      `Requires assessment for cryptographic agility and provider support for FIPS 203/204 PQC algorithms.`
    );
  }

  // Explanation builder
  const explanation = `${kb.summary} Rule engine detected ${isConfirmedUsage ? 'active cryptographic operation' : 'symbol reference'} for ${algorithm} in '${fileName}'.`;

  // Action required
  let actionRequired = '';
  switch (finalRisk) {
    case 'Critical':
      actionRequired = `Immediate triage: Prioritize migration to ${pqcReplacement}. Implement crypto-agility wrapper or hybrid key exchange to mitigate Harvest-Now-Decrypt-Later threats.`;
      break;
    case 'High':
      actionRequired = `Schedule Phase 2 migration: Replace legacy/quantum-vulnerable primitive with ${pqcReplacement}. Review API contract and payload sizing constraints.`;
      break;
    case 'Medium':
      actionRequired = `Verify code context: Confirm whether this finding is actively used in production cryptography. If confirmed, evaluate transition to ${pqcReplacement}.`;
      break;
    case 'Low':
      actionRequired = `Document in Cryptographic Bill of Materials (CBOM). No immediate operational disruption required.`;
      break;
    case 'Quantum-Resistant':
      actionRequired = `No algorithmic replacement required. Maintain adherence to NIST approved operational parameters (e.g. GCM mode, proper IV nonce management).`;
      break;
  }

  const quantumImpact = kb.summary;

  return {
    riskLevel: finalRisk,
    confidence: adjustedConfidence,
    quantumThreat,
    quantumImpact,
    nistStatus,
    pqcReplacement,
    explanation,
    riskReasoning: reasoning,
    actionRequired,
  };
}

export function calculateQuantumReadinessScore(findings: CryptoFinding[]): number {
  if (findings.length === 0) return 100;

  // Weighted scoring system:
  // Critical: -25 pts
  // High: -12 pts
  // Medium: -5 pts
  // Low: -1 pt
  // Quantum-Resistant: +5 pts (max 20 pts bonus)
  let score = 100;
  let qrBonus = 0;

  for (const f of findings) {
    switch (f.riskLevel) {
      case 'Critical':
        score -= 22;
        break;
      case 'High':
        score -= 10;
        break;
      case 'Medium':
        score -= 4;
        break;
      case 'Low':
        score -= 1;
        break;
      case 'Quantum-Resistant':
        qrBonus += 2;
        break;
    }
  }

  score += Math.min(qrBonus, 15);
  return Math.max(5, Math.min(100, Math.round(score)));
}
