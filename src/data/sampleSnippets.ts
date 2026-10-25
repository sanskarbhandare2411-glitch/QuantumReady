export interface CodePreset {
  id: string;
  title: string;
  language: string;
  fileName: string;
  description: string;
  code: string;
}

export const SAMPLE_CODE_PRESETS: CodePreset[] = [
  {
    id: 'python-jwt-rsa',
    title: 'Python: Enterprise RSA-2048 Auth Service',
    language: 'python',
    fileName: 'auth_jwt_provider.py',
    description: 'Demonstrates RSA-2048 keypair generation, RS256 token verification, and hashlib MD5 caching.',
    code: `import jwt
import hashlib
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Generate RSA private key (Quantum Vulnerable - Shor's Algorithm)
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

def sign_session_token(claims: dict) -> str:
    # RS256 is vulnerable to quantum token forgery
    token = jwt.encode(claims, private_key, algorithm="RS256")
    return token

def compute_cache_fingerprint(data: bytes) -> str:
    # Obsolete legacy hash
    return hashlib.md5(data).hexdigest()
`,
  },
  {
    id: 'node-ecdh-tls',
    title: 'Node.js: Mobile API & ECDH Key Exchange',
    language: 'typescript',
    fileName: 'mobile_crypto_gateway.ts',
    description: 'Demonstrates Elliptic Curve Diffie-Hellman (ECDH), secp256k1 curve parameters, and SHA-1.',
    code: `import crypto from 'crypto';

export class MobileSecureChannel {
  // Elliptic Curve Diffie-Hellman over prime256v1 (Vulnerable to HNDL)
  public static initiateHandshake() {
    const ecdh = crypto.createECDH('prime256v1');
    ecdh.generateKeys();
    return ecdh;
  }

  // Legacy checksum verification
  public static verifyLegacyChecksum(payload: Buffer, expected: string): boolean {
    const hash = crypto.createHash('sha1').update(payload).digest('hex');
    return hash === expected;
  }

  // Modern quantum-resistant envelope storage
  public static encryptLedgerPayload(key: Buffer, plaintext: Buffer) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    return Buffer.concat([cipher.update(plaintext), cipher.final()]);
  }
}
`,
  },
  {
    id: 'java-payment-hsm',
    title: 'Java: Core Banking Payment HSM & 3DES',
    language: 'java',
    fileName: 'PaymentHsmBridge.java',
    description: 'Demonstrates Triple-DES, RSA 1024-bit legacy keys, and TLS 1.0 endpoint configuration.',
    code: `package com.apexbank.payments;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import java.security.KeyPairGenerator;

public class PaymentHsmBridge {
    public void processLegacyPinBlock(byte[] pinBytes, SecretKey key) throws Exception {
        // Disallowed by NIST - Sweet32 & classical collision vulnerability
        Cipher cipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        cipher.doFinal(pinBytes);
    }

    public void generateLegacySigner() throws Exception {
        // Insecure key length (RSA-1024)
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(1024);
        kpg.generateKeyPair();
    }
}
`,
  },
  {
    id: 'go-quantum-hybrid',
    title: 'Go: Diffie-Hellman & Agility Architecture',
    language: 'go',
    fileName: 'session_negotiator.go',
    description: 'Demonstrates finite-field Diffie-Hellman, ECDSA signatures, and OpenSSL/libcrypto bindings.',
    code: `package gateway

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "fmt"
)

// Finite field and ECC key generation (Target for NIST FIPS 203/204 migration)
func GeneratePeerIdentity() (*ecdsa.PrivateKey, error) {
    // ECDSA with P-256 is subject to Shor's algorithm polynomial time discrete log
    key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
    if err != nil {
        return nil, fmt.Errorf("ECDSA generation failed: %w", err)
    }
    return key, nil
}
`,
  },
];
