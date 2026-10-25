import { AlgorithmCategory, AlgorithmType, ConfidenceLevel, CryptoFinding } from '../types/crypto';
import { evaluateCryptographicRisk } from './riskEngine';

interface PatternRule {
  regex: RegExp;
  algorithm: AlgorithmType;
  category: AlgorithmCategory;
  defaultConfidence: ConfidenceLevel;
  isCallOrInstantiation: (line: string, matched: string) => boolean;
  detectedPatternName: string;
}

const DETECTION_RULES: PatternRule[] = [
  // --- RSA ---
  {
    regex: /\b(RSA(?:[-_]?(?:1024|2048|4096))?|RSAPrivateKey|RSAPublicKey|RSACryptoServiceProvider|RS256|RS384|RS512|PKCS1(?:v1_5)?|PKCS8)\b/i,
    algorithm: 'RSA-General',
    category: 'Asymmetric',
    defaultConfidence: 'Medium',
    isCallOrInstantiation: (line) =>
      /generate|new\s+|getInstance|createSign|createVerify|createPrivateKey|public_key|sign|verify/i.test(line),
    detectedPatternName: 'RSA Key / Cipher Primitive',
  },
  {
    regex: /\b(?:key[_-]?size|bits|modulusLength|initialize|init)\s*[:=\(]\s*(1024|2048|4096)\b/i,
    algorithm: 'RSA-2048',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'RSA Modulus Key Specification',
  },
  {
    regex: /(?:KeyPairGenerator\.getInstance\s*\(\s*["']RSA["']|rsa\.generate_private_key|crypto\.generateKeyPairSync\s*\(\s*["']rsa["'])/i,
    algorithm: 'RSA-2048',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'Direct RSA Key Generation',
  },

  // --- ECC & ECDSA & Ed25519 ---
  {
    regex: /\b(secp256k1|prime256v1|secp384r1|secp521r1|NIST[- ]?P[-_]?(?:256|384|521)|SECP256R1)\b/i,
    algorithm: 'ECC-P256',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) =>
      /new\s+|generate|curve|ECKey|getInstance|createECDH|sign/i.test(line),
    detectedPatternName: 'Elliptic Curve Domain Parameter',
  },
  {
    regex: /\b(ECDSA|ES256|ES384|ES512|crypto\/ecdsa)\b/i,
    algorithm: 'ECDSA',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) =>
      /sign|verify|new\s+|getInstance|Algorithm/i.test(line),
    detectedPatternName: 'ECDSA Digital Signature Call',
  },
  {
    regex: /\b(Ed25519|EdDSA|ed25519\.GenerateKey)\b/i,
    algorithm: 'Ed25519',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /generate|sign|verify|new/i.test(line),
    detectedPatternName: 'Edwards Curve Signature',
  },

  // --- Key Exchange: ECDH, DH, X25519 ---
  {
    regex: /\b(ECDH|createECDH|deriveBits|computeSecret|ECDHBasicAgreement)\b/i,
    algorithm: 'ECDH',
    category: 'Key Exchange',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /create|new|getInstance|computeSecret/i.test(line),
    detectedPatternName: 'ECDH Key Agreement',
  },
  {
    regex: /\b(Diffie[-_]?Hellman|DHParameterSpec|createDiffieHellman|crypto\/dh|DHE[-_]RSA)\b/i,
    algorithm: 'Diffie-Hellman',
    category: 'Key Exchange',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /create|new|getInstance|generate/i.test(line),
    detectedPatternName: 'Diffie-Hellman Finite Field Key Exchange',
  },
  {
    regex: /\b(X25519|crypto_scalarmult_curve25519)\b/i,
    algorithm: 'X25519',
    category: 'Key Exchange',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /generate|keyExchange|derive/i.test(line),
    detectedPatternName: 'X25519 Montgomery Curve Key Exchange',
  },

  // --- DSA ---
  {
    regex: /\b(DSA(?:Key|ParameterSpec)?|KeyPairGenerator\.getInstance\s*\(\s*["']DSA["'])\b/i,
    algorithm: 'DSA',
    category: 'Asymmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'Digital Signature Algorithm (DSA)',
  },

  // --- Broken Hashes: MD5, SHA-1 ---
  {
    regex: /(?:crypto\.createHash\s*\(\s*["']md5["']|MessageDigest\.getInstance\s*\(\s*["']MD5["']|hashlib\.md5|Digest::MD5|MD5_Init|\bmd5\b)/i,
    algorithm: 'MD5',
    category: 'Hash',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /create|getInstance|hash|digest|checksum|update/i.test(line),
    detectedPatternName: 'MD5 Hash Invocation',
  },
  {
    regex: /(?:crypto\.createHash\s*\(\s*["']sha1["']|MessageDigest\.getInstance\s*\(\s*["']SHA-?1["']|hashlib\.sha1|Digest::SHA1|SHA1_Init|\bsha-?1\b)/i,
    algorithm: 'SHA-1',
    category: 'Hash',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /create|getInstance|hash|digest|checksum|update|sign/i.test(line),
    detectedPatternName: 'SHA-1 Hash Invocation',
  },

  // --- Quantum Safe Hash & Symmetric: SHA-256, AES-256 ---
  {
    regex: /\b(sha256|SHA-256|hashlib\.sha256|MessageDigest\.getInstance\s*\(\s*["']SHA-?256["'])\b/i,
    algorithm: 'SHA-256',
    category: 'Hash',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /digest|createHash|getInstance|hash/i.test(line),
    detectedPatternName: 'SHA-256 Hash Function',
  },
  {
    regex: /\b(aes-?256(?:-gcm|-cbc|-ctr)?|AES_256|Cipher\.getInstance\s*\(\s*["']AES\/GCM)\b/i,
    algorithm: 'AES-256',
    category: 'Symmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /createCipher|Cipher|encrypt|decrypt|new/i.test(line),
    detectedPatternName: 'AES-256 Symmetric Cipher',
  },
  {
    regex: /\b(aes-?128(?:-gcm|-cbc|-ctr)?|AES_128)\b/i,
    algorithm: 'AES-128',
    category: 'Symmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /createCipher|Cipher|encrypt/i.test(line),
    detectedPatternName: 'AES-128 Symmetric Cipher',
  },

  // --- Broken Ciphers: DES / 3DES ---
  {
    regex: /\b(DESede|TripleDES|DES\/CBC|crypto\.createCipheriv\s*\(\s*["']des)/i,
    algorithm: '3DES',
    category: 'Symmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: '3DES / Triple-DES Obsolete Cipher',
  },
  {
    regex: /\b(Cipher\.getInstance\s*\(\s*["']DES["']|crypto\.createCipher\s*\(\s*["']des["'])\b/i,
    algorithm: 'DES',
    category: 'Symmetric',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'DES 56-bit Obsolete Cipher',
  },

  // --- TLS Protocols ---
  {
    regex: /\b(TLSv1\.0|TLSv1\.1|TLSv1_0_server|PROTOCOL_TLSv1)\b/i,
    algorithm: 'TLS 1.0/1.1',
    category: 'Protocol',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'Obsolete TLS 1.0/1.1 Configuration',
  },
  {
    regex: /\b(TLSv1\.2|SSLContext\.getInstance\s*\(\s*["']TLSv1\.2["'])\b/i,
    algorithm: 'TLS 1.2',
    category: 'Protocol',
    defaultConfidence: 'High',
    isCallOrInstantiation: () => true,
    detectedPatternName: 'TLS 1.2 Configuration',
  },

  // --- Cryptographic Libraries ---
  {
    regex: /\b(org\.bouncycastle|cryptography\.hazmat|crypto-js|WebCrypto|subtle\.crypto|openssl\/|libcrypto)\b/i,
    algorithm: 'Crypto-Library',
    category: 'Crypto Library',
    defaultConfidence: 'High',
    isCallOrInstantiation: (line) => /import|require|using|include/i.test(line),
    detectedPatternName: 'Cryptographic Framework Dependency',
  },
];

export interface ScanFileInput {
  name: string;
  content: string;
  serviceHint?: string;
}

export function scanSourceCode(files: ScanFileInput[]): CryptoFinding[] {
  const findings: CryptoFinding[] = [];
  const processedKeys = new Set<string>();

  for (const file of files) {
    const lines = file.content.split(/\r?\n/);
    const fileName = file.name;
    const fileType = fileName.split('.').pop()?.toLowerCase() || 'txt';

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) return;

      // Check comments vs code (basic heuristic for confidence)
      const isPureComment =
        trimmed.startsWith('//') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*');

      for (const rule of DETECTION_RULES) {
        const match = rule.regex.exec(line);
        if (match) {
          const matchedText = match[0];
          let algorithm = rule.algorithm;

          // Refine RSA key sizes if detected in proximity
          if (algorithm === 'RSA-General' || algorithm === 'RSA-2048') {
            if (/1024/.test(line) || /1024/.test(matchedText)) {
              algorithm = 'RSA-1024';
            } else if (/4096/.test(line) || /4096/.test(matchedText)) {
              algorithm = 'RSA-4096';
            } else if (/2048/.test(line) || /2048/.test(matchedText)) {
              algorithm = 'RSA-2048';
            }
          }

          // Refine ECC curves
          if (/secp384r1|NIST[- ]?P[-_]?384/i.test(line)) {
            algorithm = 'ECC-P384';
          } else if (/secp521r1|NIST[- ]?P[-_]?521/i.test(line)) {
            algorithm = 'ECC-P521';
          }

          const isConfirmed = !isPureComment && rule.isCallOrInstantiation(line, matchedText);

          let confidence: ConfidenceLevel = rule.defaultConfidence;
          if (isPureComment) {
            confidence = 'Low';
          } else if (!isConfirmed && confidence === 'High') {
            confidence = 'Medium';
          }

          // Avoid duplicate findings on the same line for the same algorithm
          const dedupeKey = `${fileName}:${lineNum}:${algorithm}`;
          if (processedKeys.has(dedupeKey)) continue;
          processedKeys.add(dedupeKey);

          // Build surrounding context lines (up to 2 before, 2 after)
          const startCtx = Math.max(0, index - 2);
          const endCtx = Math.min(lines.length - 1, index + 2);
          const surroundingContext = lines.slice(startCtx, endCtx + 1);

          // Evaluate risk
          const evalResult = evaluateCryptographicRisk({
            algorithm,
            category: rule.category,
            matchedText,
            codeSnippet: trimmed,
            isConfirmedUsage: isConfirmed,
            fileName,
            confidence,
          });

          // Derive service name if not provided
          let serviceName = file.serviceHint;
          if (!serviceName) {
            if (/auth|login|jwt|token/i.test(fileName)) serviceName = 'Authentication Service';
            else if (/pay|checkout|billing|transaction/i.test(fileName)) serviceName = 'Payment Core Service';
            else if (/api|gateway|proxy|router/i.test(fileName)) serviceName = 'API Edge Gateway';
            else if (/vault|hsm|kms|key/i.test(fileName)) serviceName = 'Key Management Vault';
            else if (/ledger|db|data|store/i.test(fileName)) serviceName = 'Core Banking Ledger';
            else serviceName = 'Application Component';
          }

          findings.push({
            id: `FIND-${findings.length + 1001}`,
            fileName,
            fileType,
            lineNumber: lineNum,
            matchedText,
            codeSnippet: trimmed,
            surroundingContext,
            algorithm,
            algorithmCategory: rule.category,
            riskLevel: evalResult.riskLevel,
            confidence: evalResult.confidence,
            quantumThreat: evalResult.quantumThreat,
            quantumImpact: evalResult.quantumImpact,
            nistStatus: evalResult.nistStatus,
            replacementPQC: evalResult.pqcReplacement,
            explanation: evalResult.explanation,
            riskReasoning: evalResult.riskReasoning,
            actionRequired: evalResult.actionRequired,
            serviceName,
            detectedPattern: rule.detectedPatternName,
            isConfirmedUsage: isConfirmed,
            timestamp: new Date().toISOString(),
          });
        }
      }
    });
  }

  return findings;
}
