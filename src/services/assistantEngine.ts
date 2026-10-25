import { AssistantMessage } from '../types/assistant';
import { CryptoFinding } from '../types/crypto';

export interface AssistantContext {
  findings: CryptoFinding[];
  readinessScore: number;
  isDemoData: boolean;
}

export function generateAssistantReply(
  userQuery: string,
  context: AssistantContext,
  selectedFinding?: CryptoFinding
): AssistantMessage {
  const query = userQuery.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Contextual query about a specific finding
  if (selectedFinding && (query.includes('this finding') || query.includes('selected') || query.includes(selectedFinding.algorithm.toLowerCase()))) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `### Analysis of Selected Finding: ${selectedFinding.algorithm} in \`${selectedFinding.fileName}\`

**Current Risk Assessment:** **${selectedFinding.riskLevel}** (${selectedFinding.confidence} Confidence)  
**Threat Vector:** ${selectedFinding.quantumThreat}  
**NIST Status:** ${selectedFinding.nistStatus}

**Detailed Technical Justification:**
${selectedFinding.explanation}

**Recommended Migration Target:**
Migrate to **${selectedFinding.replacementPQC}**. 
${selectedFinding.riskReasoning.map(r => `- ${r}`).join('\n')}

**Immediate Action Item:**
${selectedFinding.actionRequired}`,
      timestamp,
      isDemoAssistant: true,
      suggestedPrompts: [
        'Simulate migration impact for this finding',
        'How does Harvest Now Decrypt Later apply here?',
        'What are the NIST FIPS 203 and 204 standards?'
      ],
      referencedFinding: selectedFinding,
      pqcReferences: [
        {
          standard: 'NIST FIPS 203 (ML-KEM)',
          algorithm: 'Module-Lattice-Based Key-Encapsulation Mechanism',
        },
        {
          standard: 'NIST FIPS 204 (ML-DSA)',
          algorithm: 'Module-Lattice-Based Digital Signature Standard',
        }
      ]
    };
  }

  // 2. Questions about Harvest Now, Decrypt Later (HNDL)
  if (query.includes('harvest') || query.includes('hndl') || query.includes('store now')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `### "Harvest Now, Decrypt Later" (HNDL) Threat Analysis

**What is HNDL?**  
Adversaries (including foreign nation-states and organized threat actors) are currently intercepting and storing encrypted high-value communications (TLS traffic, financial transfers, government secrets, customer PII). Even though they cannot crack classical encryption today, they will decrypt this stored ciphertext as soon as a **Cryptanalytically Relevant Quantum Computer (CRQC)** becomes operational.

**Why it matters today (Mosca's Theorem):**
If your data has a security lifetime of $X$ years, and it takes $Y$ years to migrate your systems to PQC, and a quantum computer arrives in $Z$ years:
$$\\text{If } X + Y > Z \\implies \\text{Your organization is ALREADY compromised.}$$

**Your Current Inventory Exposure:**
In your active scan, you have **${context.findings.filter(f => f.quantumThreat.includes("Shor's")).length} asymmetric / key exchange findings** that are vulnerable to retroactive decryption. Specifically, endpoints using RSA-2048, Diffie-Hellman, and ECDH must be prioritized for hybrid key encapsulation immediately.`,
      timestamp,
      isDemoAssistant: true,
      suggestedPrompts: [
        'How do I implement hybrid TLS 1.3?',
        'Show me my critical risk findings',
        'What is Shor\'s algorithm?'
      ],
      actionableSteps: [
        'Deploy hybrid X25519 + ML-KEM-768 on edge reverse proxies',
        'Classify databases by data retention lifespan (> 5-10 years)',
        'Audit third-party SaaS vendors for post-quantum transport'
      ]
    };
  }

  // 3. Shor's Algorithm vs Grover's Algorithm
  if (query.includes('shor') || query.includes('grover') || query.includes('quantum computer') || query.includes('crqc')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `### Shor's Algorithm vs. Grover's Algorithm

Quantum computing threatens cryptography through two distinct mathematical algorithms:

| Dimension | **Shor's Algorithm** | **Grover's Algorithm** |
| :--- | :--- | :--- |
| **Target Cryptography** | **Public Key (Asymmetric)**: RSA, ECC, ECDSA, DH, DSA | **Symmetric & Hashes**: AES, SHA-2, SHA-3 |
| **Mathematical Speedup** | **Exponential** (Polynomial time $\\mathcal{O}((\\log N)^3)$) | **Quadratic** (Square root speedup $\\mathcal{O}(\\sqrt{N})$) |
| **Real Impact** | **Total Break**: Factorization & discrete log solved easily | **Key Length Halving**: 128-bit key becomes 64-bit security |
| **Defense / Fix** | **Complete Replacement**: Migrate to NIST PQC (ML-KEM / ML-DSA) | **Key Doubling**: Upgrade AES-128 to **AES-256** |

**Current Scan Status:**
- You have **${context.findings.filter(f => f.algorithmCategory === 'Asymmetric' || f.algorithmCategory === 'Key Exchange').length} findings** vulnerable to Shor's algorithm.
- You have **${context.findings.filter(f => f.algorithm === 'AES-128').length} findings** where Grover's algorithm downgrades security.`,
      timestamp,
      isDemoAssistant: true,
      suggestedPrompts: [
        'Explain NIST FIPS 203 vs 204',
        'How do I upgrade AES-128 to AES-256?',
        'Give me an executive summary of my scan'
      ]
    };
  }

  // 4. NIST Standards (FIPS 203, 204, 205)
  if (query.includes('fips') || query.includes('nist') || query.includes('standard') || query.includes('kyber') || query.includes('dilithium')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `### Official NIST Post-Quantum Cryptography Standards (Released August 2024)

NIST formally finalized the first three Federal Information Processing Standards (FIPS) for the post-quantum era:

1. **FIPS 203: ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)**
   - *Original project name:* CRYSTALS-Kyber
   - *Primary use case:* General encryption, secure key exchange, TLS handshakes, VPN tunnels.
   - *Recommended Parameter:* **ML-KEM-768** (Security Category 3, comparable to AES-192).

2. **FIPS 204: ML-DSA (Module-Lattice-Based Digital Signature Algorithm)**
   - *Original project name:* CRYSTALS-Dilithium
   - *Primary use case:* Digital signatures, code signing, PKI certificates, JWT tokens.
   - *Recommended Parameter:* **ML-DSA-65**.

3. **FIPS 205: SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)**
   - *Original project name:* SPHINCS+
   - *Primary use case:* Backup digital signature standard relying strictly on hash security rather than lattice assumptions. Ideal for long-term root trust anchors and firmware signing.

4. **FIPS 206: FN-DSA (In finalization)**
   - *Original project name:* FALCON
   - *Primary use case:* Compact signatures for constrained environments.`,
      timestamp,
      isDemoAssistant: true,
      suggestedPrompts: [
        'How does ML-KEM key size compare to RSA?',
        'What is the migration timeline for NIST compliance?',
        'How do I test these in my code?'
      ],
      pqcReferences: [
        { standard: 'NIST FIPS 203', algorithm: 'ML-KEM (Key Encapsulation)' },
        { standard: 'NIST FIPS 204', algorithm: 'ML-DSA (Digital Signatures)' },
        { standard: 'NIST FIPS 205', algorithm: 'SLH-DSA (Stateless Hash Signatures)' }
      ]
    };
  }

  // 5. Executive summary of current scan
  if (query.includes('summary') || query.includes('report') || query.includes('executive') || query.includes('score')) {
    const criticals = context.findings.filter(f => f.riskLevel === 'Critical');
    const highs = context.findings.filter(f => f.riskLevel === 'High');
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `### Executive Cryptographic Posture Summary

**Overall Quantum-Readiness Score:** **${context.readinessScore}/100**  
**Total Cryptographic Findings:** **${context.findings.length}** across **${new Set(context.findings.map(f => f.fileName)).size} files**

#### Risk Breakdown:
- 🔴 **Critical Risk (${criticals.length}):** Immediate action required. Includes broken classical algorithms (e.g. 3DES, MD5) and active asymmetric primitives (RSA-2048, ECC) central to authentication and key exchanges.
- 🟠 **High Risk (${highs.length}):** Obsolete hash algorithms (SHA-1) and public-facing TLS 1.2 configurations.
- 🟡 **Medium Risk (${context.findings.filter(f => f.riskLevel === 'Medium').length}):** AES-128 configurations and unconfirmed algorithm references.
- 🟢 **Quantum-Resistant (${context.findings.filter(f => f.riskLevel === 'Quantum-Resistant').length}):** Validated AES-256 and SHA-256 implementations.

#### Recommended Next 3 Steps:
1. **Remediate Classical Breaches:** Immediately deprecate 3DES and MD5 in payment and core banking logic.
2. **Implement Hybrid Key Exchange:** Configure edge reverse proxies for X25519 + ML-KEM-768.
3. **Validate CBOM in CI/CD:** Ensure all future pull requests are automatically scanned for hardcoded classical algorithms.`,
      timestamp,
      isDemoAssistant: true,
      suggestedPrompts: [
        'How do I export my Cryptographic Bill of Materials (CBOM)?',
        'Show me the Migration Roadmap',
        'Simulate migration impact for RSA-2048'
      ]
    };
  }

  // Generic / Default AI Cybersecurity Advisory reply
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: `### QuantumReady Cryptographic Intelligence Advisory

I have analyzed your inquiry regarding: **"${userQuery}"**.

In the context of your current cryptographic inventory (**${context.findings.length} findings**, readiness score: **${context.readinessScore}/100**):

1. **Cryptographic Agility is Essential:** Organizations should avoid hardcoding specific cryptographic algorithms. Refactor applications to use provider abstractions (such as Java JCA providers or Go interface facades) so algorithms can be swapped via configuration.
2. **Dual-Key Hybrid Deployment:** For active systems, migrate first to **hybrid mode** (combining classical algorithms like X25519 or RSA with NIST PQC standards like ML-KEM-768). This maintains legacy compliance while immediately protecting against Harvest-Now-Decrypt-Later threats.
3. **Payload & Network Sizing:** Post-quantum public keys and signatures are substantially larger (up to 30x–50x). Ensure network packet MTU and HTTP header buffers are tested before full production cutover.`,
    timestamp,
    isDemoAssistant: true,
    suggestedPrompts: [
      'What is Harvest Now, Decrypt Later?',
      'Explain Shor\'s algorithm vs Grover\'s algorithm',
      'Give me an executive summary of my scan',
      'What are the NIST FIPS 203 and 204 standards?'
    ]
  };
}
