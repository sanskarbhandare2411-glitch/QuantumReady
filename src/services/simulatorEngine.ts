import { AlgorithmType } from '../types/crypto';
import { MigrationStrategyType, SimulationResult } from '../types/simulator';

export function simulateMigration(algorithm: AlgorithmType, selectedStrategy?: MigrationStrategyType): SimulationResult {
  switch (algorithm) {
    case 'RSA-1024':
    case 'RSA-2048':
    case 'RSA-4096':
    case 'RSA-General': {
      const is4096 = algorithm === 'RSA-4096';
      const strategy: MigrationStrategyType = selectedStrategy || 'Hybrid Dual-Key (Classical + PQC)';
      return {
        sourceAlgorithm: algorithm,
        targetPQC: is4096 ? 'ML-KEM-1024 / ML-DSA-87 (NIST Level 5)' : 'ML-KEM-768 / ML-DSA-65 (FIPS 203 / 204)',
        strategy,
        sourceMetrics: {
          name: algorithm,
          category: 'Asymmetric (Integer Factorization)',
          securityLevel: is4096 ? '128-bit Classical (0-bit Quantum)' : '112-bit Classical (0-bit Quantum)',
          publicKeySize: is4096 ? 512 : 256,
          privateKeySize: is4096 ? 2048 : 1024,
          ciphertextSizeOrSigSize: is4096 ? 512 : 256,
          handshakeLatencyMs: 4.2,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Deprecated post-2030 (NIST SP 800-131A)',
        },
        targetMetrics: {
          name: is4096 ? 'ML-KEM-1024 (FIPS 203)' : 'ML-KEM-768 (FIPS 203)',
          category: 'Module-Lattice Based KEM',
          securityLevel: is4096 ? 'NIST Level 5 (AES-256 equivalent)' : 'NIST Level 3 (AES-192 equivalent)',
          publicKeySize: is4096 ? 1568 : 1184,
          privateKeySize: is4096 ? 3168 : 2400,
          ciphertextSizeOrSigSize: is4096 ? 1568 : 1088,
          handshakeLatencyMs: 1.1, // Lattice ops are much faster than RSA modular exponentiation!
          networkFragmentationRisk: 'Medium',
          fipsStatus: 'FIPS 203 Approved Standard (Aug 2024)',
        },
        keySizeMultiplier: is4096 ? 3.1 : 4.6,
        cipherOrSigMultiplier: is4096 ? 3.1 : 4.25,
        latencyImpactDelta: '-3.1 ms CPU execution time (Faster!), +0.8 ms network serialization overhead',
        fragmentationAnalysis:
          'Public key (1,184 bytes) + Ciphertext (1,088 bytes) combined exceed standard Ethernet MTU (1,500 bytes). TCP handshakes will split across two IP packets, creating potential latency hiccups if network packet reassembly is delayed.',
        compatibilityRisks: [
          'Legacy TLS client proxies without support for large ClientHello/ServerHello payloads',
          'Database schemas restricting public key storage columns to VARCHAR(512) or 256-byte BLOBs',
          'Hardware Security Modules (HSMs) lacking native lattice arithmetic microcode firmware',
        ],
        testingRequirements: [
          'Packet fragmentation & TCP segmentation benchmark across WAN edge',
          'Load test TLS connection rate with ML-KEM-768 hybrid key negotiation',
          'Memory footprint benchmarking in memory-constrained containers',
        ],
        recommendedSteps: [
          'Phase 1: Expand database schema column widths for public keys from 512 bytes to >= 2048 bytes.',
          'Phase 2: Deploy hybrid composite certificates (e.g. RSA-2048 + ML-DSA-65).',
          'Phase 3: Upgrade web server TLS libraries to OpenSSL 3.2+ with oqsprovider.',
          'Phase 4: Sunset classical verification once 99.5% of clients support FIPS 203.',
        ],
        estimatedEffortDays: 24,
        complexityScore: 'Medium',
      };
    }

    case 'ECC-P256':
    case 'ECC-P384':
    case 'ECC-P521':
    case 'ECDSA':
    case 'Ed25519': {
      const strategy: MigrationStrategyType = selectedStrategy || 'Direct Native PQC Cutover';
      return {
        sourceAlgorithm: algorithm,
        targetPQC: 'ML-DSA-65 (FIPS 204 / Dilithium3)',
        strategy,
        sourceMetrics: {
          name: algorithm,
          category: 'Elliptic Curve Digital Signature',
          securityLevel: '128-bit Classical (0-bit Quantum)',
          publicKeySize: 64,
          privateKeySize: 32,
          ciphertextSizeOrSigSize: 64,
          handshakeLatencyMs: 1.8,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Disallowed after 2030 (CNSA 2.0)',
        },
        targetMetrics: {
          name: 'ML-DSA-65 (FIPS 204)',
          category: 'Module-Lattice Digital Signature Algorithm',
          securityLevel: 'NIST Level 3 (Quantum Secure)',
          publicKeySize: 1952,
          privateKeySize: 4032,
          ciphertextSizeOrSigSize: 3309,
          handshakeLatencyMs: 0.9,
          networkFragmentationRisk: 'High',
          fipsStatus: 'FIPS 204 Approved Standard (Aug 2024)',
        },
        keySizeMultiplier: 30.5,
        cipherOrSigMultiplier: 51.7,
        latencyImpactDelta: '-0.9 ms CPU verification speed, +1.9 ms transmission latency across 3 MTU frames',
        fragmentationAnalysis:
          'CRITICAL: Signature size increases from 64 bytes to 3,309 bytes (51x increase!). In HTTP headers (Authorization: Bearer <JWT>), signed tokens will exceed typical 4KB or 8KB web server header buffer limits (nginx large_client_header_buffers).',
        compatibilityRisks: [
          'HTTP Header truncation in API gateways (Nginx/Kong/Envoy default limits: 4KB-8KB)',
          'JWT authentication payload inflation causing bandwidth exhaustion on mobile devices',
          'Embedded IoT and smartcard chips with < 4KB RAM buffer limits',
        ],
        testingRequirements: [
          'Verify API Gateway maximum header buffer configurations (increase to 16KB)',
          'Measure cellular payload overhead for mobile app authentication',
          'Benchmark digital signature verification throughput on API reverse proxies',
        ],
        recommendedSteps: [
          'Step 1: Increase HTTP reverse proxy header size buffer limits to 16KB.',
          'Step 2: Transition from signed JSON Web Tokens (JWT) in headers to short opaque session tokens with server-side ML-DSA validation.',
          'Step 3: Test SLH-DSA-SHA2-128s (SPHINCS+) for stateless offline signing alternatives.',
        ],
        estimatedEffortDays: 32,
        complexityScore: 'High',
      };
    }

    case 'ECDH':
    case 'Diffie-Hellman':
    case 'X25519': {
      const strategy: MigrationStrategyType = selectedStrategy || 'Hybrid Dual-Key (Classical + PQC)';
      return {
        sourceAlgorithm: algorithm,
        targetPQC: 'Hybrid X25519 + ML-KEM-768 (draft-ietf-tls-hybrid-design)',
        strategy,
        sourceMetrics: {
          name: algorithm,
          category: 'Key Exchange Protocol',
          securityLevel: '128-bit Classical (0-bit Quantum)',
          publicKeySize: 32,
          privateKeySize: 32,
          ciphertextSizeOrSigSize: 32,
          handshakeLatencyMs: 2.1,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Critical HNDL exposure',
        },
        targetMetrics: {
          name: 'X25519MLKEM768 Hybrid',
          category: 'Hybrid Dual Classical-Post-Quantum KEM',
          securityLevel: '128-bit Classical + 192-bit Quantum Safe',
          publicKeySize: 1216,
          privateKeySize: 2432,
          ciphertextSizeOrSigSize: 1120,
          handshakeLatencyMs: 1.6,
          networkFragmentationRisk: 'Medium',
          fipsStatus: 'Standardized in draft-ietf-tls-hybrid-design, RFC 9370',
        },
        keySizeMultiplier: 38.0,
        cipherOrSigMultiplier: 35.0,
        latencyImpactDelta: '-0.5 ms cryptographic calculation, +1.1 ms network transport',
        fragmentationAnalysis:
          'Combined hybrid key share (1,216 bytes) fits neatly into modern TLS 1.3 ClientHello extensions without triggering multi-packet TLS fragment negotiation on unconstrained networks.',
        compatibilityRisks: [
          'Middleboxes and legacy Deep Packet Inspection (DPI) firewalls dropping unknown TLS key_share extensions (grease tolerances)',
        ],
        testingRequirements: [
          'Interoperability test with Google Chrome, Firefox, and curl with liboqs',
          'Audit middlebox TLS handshake drop rates across enterprise perimeter',
        ],
        recommendedSteps: [
          'Enable X25519MLKEM768 on all TLS 1.3 endpoints immediately.',
          'Retain classical X25519 fallback for legacy mobile clients.',
          'Monitor TLS handshake failure metrics in APM dashboards.',
        ],
        estimatedEffortDays: 14,
        complexityScore: 'Medium',
      };
    }

    case 'MD5':
    case 'SHA-1': {
      const strategy: MigrationStrategyType = selectedStrategy || 'Deprecation & Algorithm Sunsetting';
      return {
        sourceAlgorithm: algorithm,
        targetPQC: 'SHA-256 (FIPS 180-4) or SHA-3-256 (FIPS 202)',
        strategy,
        sourceMetrics: {
          name: algorithm,
          category: 'Legacy Hash Function',
          securityLevel: 'Classically Broken (Collisions possible)',
          publicKeySize: 0,
          privateKeySize: 0,
          ciphertextSizeOrSigSize: algorithm === 'MD5' ? 16 : 20,
          handshakeLatencyMs: 0.1,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Prohibited / Revoked by NIST',
        },
        targetMetrics: {
          name: 'SHA-256 (FIPS 180-4)',
          category: 'Cryptographic Secure Hash',
          securityLevel: '256-bit Classical / 128-bit Quantum Safe',
          publicKeySize: 0,
          privateKeySize: 0,
          ciphertextSizeOrSigSize: 32,
          handshakeLatencyMs: 0.15,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'NIST Approved / Quantum Resistant',
        },
        keySizeMultiplier: 1.0,
        cipherOrSigMultiplier: algorithm === 'MD5' ? 2.0 : 1.6,
        latencyImpactDelta: '< 0.05 ms (Hardware accelerated via Intel SHA-NI & ARMv8 crypto)',
        fragmentationAnalysis: 'Negligible network impact. Output size increases from 16/20 bytes to 32 bytes.',
        compatibilityRisks: [
          'Historical database records hashed with legacy algorithm require dual verification during transition',
        ],
        testingRequirements: [
          'Verify rainbow table / dictionary lookup invalidation',
          'Test data migration pipeline for cached password hashes or file integrity checksums',
        ],
        recommendedSteps: [
          'Step 1: Replace hash library call with SHA-256 / SHA-3.',
          'Step 2: If used for password storage, migrate to Argon2id with work factors.',
          'Step 3: Re-checksum stored object blobs.',
        ],
        estimatedEffortDays: 7,
        complexityScore: 'Low',
      };
    }

    case '3DES':
    case 'DES': {
      const strategy: MigrationStrategyType = selectedStrategy || 'Direct Native PQC Cutover';
      return {
        sourceAlgorithm: algorithm,
        targetPQC: 'AES-256-GCM (NIST FIPS 197)',
        strategy,
        sourceMetrics: {
          name: algorithm,
          category: 'Legacy Block Cipher (64-bit Block)',
          securityLevel: algorithm === 'DES' ? '56-bit (Broken)' : '112-bit (Sweet32 Vulnerable)',
          publicKeySize: 0,
          privateKeySize: algorithm === 'DES' ? 7 : 24,
          ciphertextSizeOrSigSize: 8,
          handshakeLatencyMs: 0.8,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Disallowed by NIST (Dec 2023)',
        },
        targetMetrics: {
          name: 'AES-256-GCM',
          category: 'Authenticated Symmetric Cipher (128-bit Block)',
          securityLevel: '256-bit Classical / 128-bit Quantum Resistant (Grover Safe)',
          publicKeySize: 0,
          privateKeySize: 32,
          ciphertextSizeOrSigSize: 16,
          handshakeLatencyMs: 0.1, // AES-NI hardware speedup
          networkFragmentationRisk: 'Low',
          fipsStatus: 'NIST Approved Gold Standard',
        },
        keySizeMultiplier: 1.0,
        cipherOrSigMultiplier: 2.0,
        latencyImpactDelta: '8x faster throughput via hardware AES-NI instructions',
        fragmentationAnalysis: 'Zero fragmentation risk. Block size doubles from 8 bytes to 16 bytes.',
        compatibilityRisks: [
          'Hardware POS/ATM terminals expecting 64-bit DES block layout',
          'Payment HSM firmware requiring license upgrade for modern AES DUKPT keys',
        ],
        testingRequirements: [
          'Payment network authorization gateway end-to-end certification',
          'Unique 96-bit nonce IV generation collision validation',
        ],
        recommendedSteps: [
          'Step 1: Provision AES DUKPT keys in Payment Hardware Security Modules.',
          'Step 2: Replace DESede cipher instances with AES/GCM/NoPadding.',
          'Step 3: Decommission 3DES master keys.',
        ],
        estimatedEffortDays: 18,
        complexityScore: 'Medium',
      };
    }

    default: {
      return {
        sourceAlgorithm: algorithm,
        targetPQC: 'NIST Standard Post-Quantum Primitive (FIPS 203/204/205)',
        strategy: 'Cryptographic Agility Abstraction',
        sourceMetrics: {
          name: algorithm,
          category: 'Classical Cryptography',
          securityLevel: 'Variable',
          publicKeySize: 256,
          privateKeySize: 256,
          ciphertextSizeOrSigSize: 256,
          handshakeLatencyMs: 2.0,
          networkFragmentationRisk: 'Low',
          fipsStatus: 'Under PQC Review',
        },
        targetMetrics: {
          name: 'NIST PQC Candidate',
          category: 'Post-Quantum Standard',
          securityLevel: 'NIST Level 3 / Level 5 Quantum Safe',
          publicKeySize: 1184,
          privateKeySize: 2400,
          ciphertextSizeOrSigSize: 1088,
          handshakeLatencyMs: 1.2,
          networkFragmentationRisk: 'Medium',
          fipsStatus: 'FIPS Approved',
        },
        keySizeMultiplier: 4.6,
        cipherOrSigMultiplier: 4.25,
        latencyImpactDelta: 'Marginal CPU improvement, slight network buffer expansion',
        fragmentationAnalysis: 'Review payload buffers against maximum MTU transmission units.',
        compatibilityRisks: ['Verify protocol specifications and downstream client support.'],
        testingRequirements: ['Conduct integration tests with PQC software development kits.'],
        recommendedSteps: [
          'Implement crypto agility interface to abstract algorithm calls.',
          'Perform benchmark testing with synthetic PQC key loads.',
        ],
        estimatedEffortDays: 14,
        complexityScore: 'Medium',
      };
    }
  }
}
