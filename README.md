# QuantumReady — AI-Assisted Cryptographic Discovery and Migration Platform

> **Discover Classical Cryptography Vulnerabilities, Triage Quantum Risk, and Orchestrate Post-Quantum Migration (NIST FIPS 203 / 204 / 205).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![NIST Standards](https://img.shields.io/badge/NIST-FIPS%20203%20%7C%20204%20%7C%20205-10b981)](https://csrc.nist.gov/pqc)

---

## 🛡️ Executive Overview

As quantum computing advances toward a **Cryptanalytically Relevant Quantum Computer (CRQC)**, classical public-key cryptography (RSA, ECC, ECDSA, Diffie-Hellman) faces complete mathematical obsolescence via **Shor's Algorithm**. Concurrently, threat actors are executing **"Harvest Now, Decrypt Later" (HNDL)** attacks—recording encrypted financial and sensitive data in transit today to decrypt it retroactively once quantum capability matures.

**QuantumReady** is an enterprise-grade, browser-native cybersecurity platform that allows organizations to:
1. **Discover & Inventory:** Scan source code and configurations without executing code or exposing sensitive secrets.
2. **Assess Quantum Threat:** Transparently evaluate cryptographic exposure through deterministic rule-based scoring (accounting for Shor's algorithm, Grover's algorithm, and classical obsolescence).
3. **Map Dependencies:** Visualize blast radius across microservices, cryptographic primitives, and runtime libraries using interactive graph topology.
4. **Simulate Migration Impact:** Predict packet fragmentation risks, key/ciphertext size inflation (e.g. 30x–50x expansion), and latency shifts before touching production code.
5. **Orchestrate Rollout:** Execute a prioritized 4-phase migration roadmap aligned with **NIST SP 800-131A, FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and CNSA 2.0 mandates**.

---

## ⚡ Technology Stack

- **Frontend Framework:** React 18 + Vite + TypeScript
- **Styling & Cyber Theme:** Tailwind CSS with custom cyber-navy backgrounds, cyan glow, and violet accents
- **Interactive Topology Graph:** React Flow (`reactflow`) with custom cyber nodes and animated edge trajectories
- **Visual Analytics:** Recharts for risk and algorithm distribution metrics
- **Icons:** Lucide React
- **State Management & Persistence:** Browser LocalStorage (zero external database or paid API requirement)
- **Engine Security:** 100% client-side parsing; no code or private keys leave the user's browser.

---

## 🚀 Core Features

### 1. Enterprise Security Dashboard
- **Quantum-Readiness Score:** Weighted score (0–100%) dynamically calculated from the severity of discovered primitives.
- **KPI Metrics:** Total findings, Shor-vulnerable counts, files scanned, and microservices impacted.
- **Risk Distribution Chart:** Interactive Recharts donut visualization categorized by Critical, High, Medium, Low, and Quantum-Safe tiers.
- **Dominant Algorithms Chart:** Horizontal bar chart profiling the top 6 cryptographic primitives.
- **NIST Milestone Alert:** Real-time countdown and guidance on FIPS 203/204 standard transition deadlines.

### 2. Cryptographic Source Code Scanner
- **Dual Ingestion Modes:** 
  - Paste Code directly into a code editor.
  - Drag-and-drop multiple source files (`.py`, `.ts`, `.js`, `.java`, `.go`, `.c`, `.cs`, `.pem`, `.conf`, etc.).
- **AST Pattern Recognition:** Detects RSA (1024, 2048, 4096), ECC curves (`secp256k1`, `prime256v1`, `P-384`, `P-521`), ECDSA, ECDH, Diffie-Hellman, DSA, MD5, SHA-1, 3DES, DES, TLS 1.0/1.1/1.2, and cryptographic libraries (OpenSSL, BouncyCastle).
- **False-Positive Dampening:** Distinguishes operational execution calls (`crypto.createCipheriv`) from comments or non-functional symbol mentions.
- **Quick Test Presets:** One-click preloads for Python RSA auth, Node.js ECDH, Java payment HSM 3DES, and Go Diffie-Hellman.

### 3. Cryptographic Bill of Materials (CBOM)
- Searchable and filterable inventory table.
- Filter by Risk Severity, Algorithm Category (Asymmetric, Symmetric, Hash, Key Exchange, Protocol), and Operational Certainty.
- **Export Standards:**
  - **CycloneDX CBOM JSON:** Formatted according to CycloneDX 1.6 Cryptography specification.
  - **CSV Export:** Ready for enterprise spreadsheet reporting and executive compliance decks.
- **Slide-Over Detail Drawer:** Deep dive into line numbers, surrounding context code windows, deterministic risk reasoning, and NIST target specifications.

### 4. Transparent Rule-Based Risk Engine
- Deterministic, non-black-box risk scoring:
  - **Pillar 1 (Shor's Factor):** Exponential factorization break on RSA/ECC/DH.
  - **Pillar 2 (Grover's Factor):** Quadratic key halving on AES-128 (Medium risk) vs AES-256 (Quantum-Resistant).
  - **Pillar 3 (HNDL Factor):** Elevates key exchange and long-term storage secrets to Critical urgency.
  - **Pillar 4 (Uncertainty Factor):** Automatically downgrades unconfirmed symbol mentions to avoid alert fatigue.
- **Interactive Risk Calculator:** Sandbox allowing users to tweak algorithm, key length, operational context, and confidence to test how the engine arrives at decisions.

### 5. Dependency Topology Graph
- Interactive React Flow canvas mapping relationships between:
  - **Application Service Layer:** API Gateway, Payment Core, Authentication Service, Core Banking Ledger.
  - **Cryptographic Primitives:** Classical algorithms in production use.
  - **Shared Libraries:** OpenSSL / libcrypto, BouncyCastle JCA.
  - **PQC Targets:** ML-KEM-768, ML-DSA-65, AES-256-GCM.
- Toggle visibility by layer, inspect node blast radius, and launch migration simulations directly from selected nodes.

### 6. PQC Migration Impact Simulator
- Select any finding or classical algorithm and simulate transition to NIST Post-Quantum standards:
  - **RSA-2048 &rarr; ML-KEM-768 (FIPS 203):** 4.6x public key expansion (256B &rarr; 1,184B).
  - **ECC-P256 &rarr; ML-DSA-65 (FIPS 204):** 30.5x key size growth, 51.7x signature growth (64B &rarr; 3,309B).
  - **ECDH &rarr; Hybrid X25519 + ML-KEM-768:** Key exchange overhead analysis.
  - **3DES / MD5 &rarr; AES-256-GCM / SHA-256:** Immediate classical remediation.
- **Network Frame Analysis:** Evaluates whether enlarged keys/signatures exceed the 1,500-byte Ethernet MTU, warning about TCP packet fragmentation and web server HTTP header buffer limits (Nginx `large_client_header_buffers`).

### 7. Prioritized 4-Phase Migration Roadmap
- Structured according to NIST IR 8424 and NSA CNSA 2.0:
  - **Phase 1:** Discovery & CBOM Validation (Q1–Q2 2025)
  - **Phase 2:** Triage & Cryptographic Agility (Q3 2025–Q1 2026)
  - **Phase 3:** Hybrid Post-Quantum Deployment (2026–2028)
  - **Phase 4:** Classical Retirement & FIPS Cutover (2029–2033)
- Interactive task cards with status toggles (`Pending`, `In Progress`, `Completed`), priority badges, and target deliverables.
- Add Custom Tasks modal with automatic LocalStorage synchronization.

### 8. AI Cryptographic Advisor
- Responsive cybersecurity chat interface powered by a **Local Expert Engine**.
- Context-aware: analyzes your active scan findings, readiness score, and file references.
- Suggested prompt chips for instant exploration:
  - *"What is Harvest Now, Decrypt Later?"*
  - *"Explain Shor's algorithm vs. Grover's algorithm"*
  - *"What are the NIST FIPS 203 and 204 standards?"*
  - *"Give me an executive summary of my scan"*
- Clearly labeled with an offline badge; does not pretend a live external API is connected when none is supplied.

### 9. Demo Environment (ApexBank Core Banking)
- Instant 1-click dataset toggle preloaded with 10 realistic findings across 8 banking microservices:
  - ATM PIN Block 3DES encryption
  - Mobile Banking ECDH P-256 key agreement
  - Enterprise JWT RS256 token verification
  - Legacy Mainframe RACF MD5 password hashing
  - Database column-level AES-256-GCM envelope encryption
- Prominent banner distinguishing demo environment data from live user scan results.
- 1-click **Reset Demo Data** or **Clear to Blank State**.

---

## 📦 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quantumready.git

# Enter project directory
cd quantumready

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build & Verification

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment to Vercel

This repository includes a preconfigured `vercel.json` for single-page application (SPA) routing.

### Quick Deploy via Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Deploy via GitHub:
1. Push this repository to GitHub.
2. Link the repository in the [Vercel Dashboard](https://vercel.com/new).
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Click **Deploy**.

---

## 🔒 Security & Privacy Notice

- **No Remote Code Execution:** Uploaded source files are parsed locally in browser memory using static regular expression heuristics and string tokenizer AST rules.
- **Zero Data Ingestion:** No source code, certificates, or environment secrets are sent to external servers or third-party cloud APIs.
- **Evaluation Disclaimer:** QuantumReady is a discovery and migration planning platform. It does not provide absolute cryptographic proof of quantum immunity. Organizations should complement automated CBOM discovery with formal cryptographic audits and validate implementations against official NIST FIPS 203, 204, and 205 reference test vectors.

---

## 📄 License

Licensed under the [MIT License](LICENSE).
