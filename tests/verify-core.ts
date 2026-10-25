import { scanSourceCode } from '../src/services/scanner.ts';
import { evaluateCryptographicRisk, calculateQuantumReadinessScore } from '../src/services/riskEngine.ts';
import { simulateMigration } from '../src/services/simulatorEngine.ts';
import { generateAssistantReply } from '../src/services/assistantEngine.ts';
import { SAMPLE_CODE_PRESETS } from '../src/data/sampleSnippets.ts';

function runTests() {
  console.log('🧪 Starting QuantumReady Core Engine Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  // Test 1: Python RSA preset scanning
  const pythonPreset = SAMPLE_CODE_PRESETS.find(p => p.id === 'python-jwt-rsa')!;
  const pythonFindings = scanSourceCode([{ name: pythonPreset.fileName, content: pythonPreset.code }]);
  assert(pythonFindings.length >= 2, 'Python preset yields at least 2 findings (RSA and MD5)');
  assert(pythonFindings.some(f => f.algorithm === 'RSA-2048' && f.riskLevel === 'Critical'), 'RSA-2048 identified as Critical');
  assert(pythonFindings.some(f => f.algorithm === 'MD5' && f.riskLevel === 'Critical'), 'MD5 identified as Critical classical vulnerability');

  // Test 2: Node.js ECDH preset scanning
  const nodePreset = SAMPLE_CODE_PRESETS.find(p => p.id === 'node-ecdh-tls')!;
  const nodeFindings = scanSourceCode([{ name: nodePreset.fileName, content: nodePreset.code }]);
  assert(nodeFindings.some(f => f.algorithm.includes('ECC') || f.algorithm === 'ECDH'), 'Node.js preset detects ECDH / ECC curve');
  assert(nodeFindings.some(f => f.algorithm === 'SHA-1' && f.riskLevel === 'High'), 'SHA-1 identified as High risk');
  assert(nodeFindings.some(f => f.algorithm === 'AES-256' && f.riskLevel === 'Quantum-Resistant'), 'AES-256 recognized as Quantum-Resistant');

  // Test 3: Java 3DES Payment HSM scanning
  const javaPreset = SAMPLE_CODE_PRESETS.find(p => p.id === 'java-payment-hsm')!;
  const javaFindings = scanSourceCode([{ name: javaPreset.fileName, content: javaPreset.code }]);
  assert(javaFindings.some(f => f.algorithm === '3DES' && f.riskLevel === 'Critical'), '3DES detected as Critical risk');
  assert(javaFindings.some(f => f.algorithm === 'RSA-1024' && f.riskLevel === 'Critical'), 'RSA-1024 detected as Critical risk');

  // Test 4: Risk Engine Uncertainty Dampening
  const unconfirmedRisk = evaluateCryptographicRisk({
    algorithm: 'RSA-2048',
    category: 'Asymmetric',
    matchedText: 'RSA',
    codeSnippet: '# Just a comment mentioning RSA in documentation',
    isConfirmedUsage: false,
    fileName: 'docs.md',
    confidence: 'Low'
  });
  assert(unconfirmedRisk.riskLevel === 'Medium', 'Unconfirmed comment reference drops from Critical to Medium to avoid alert fatigue');
  assert(unconfirmedRisk.riskReasoning.length >= 2, 'Transparent reasoning provided');

  // Test 5: Quantum Readiness Score Calculation
  const scoreFull = calculateQuantumReadinessScore([]);
  assert(scoreFull === 100, 'Empty inventory returns 100% readiness score');
  const scoreVulnerable = calculateQuantumReadinessScore(pythonFindings);
  assert(scoreVulnerable < 70, `Score accurately reflects critical vulnerabilities (computed: ${scoreVulnerable}%)`);

  // Test 6: Migration Simulator Calculation
  const sim = simulateMigration('RSA-2048', 'Hybrid Dual-Key (Classical + PQC)');
  assert(sim.targetPQC.includes('ML-KEM-768'), 'RSA-2048 maps to NIST FIPS 203 ML-KEM-768');
  assert(sim.keySizeMultiplier > 4, 'Public key multiplier calculated accurately (~4.6x)');
  assert(sim.fragmentationAnalysis.includes('MTU'), 'MTU packet fragmentation analysis included');

  // Test 7: AI Assistant Reasoning
  const aiReply = generateAssistantReply('What is Harvest Now, Decrypt Later?', {
    findings: pythonFindings,
    readinessScore: 50,
    isDemoData: false
  });
  assert(aiReply.content.includes('Harvest Now, Decrypt Later'), 'Assistant explains HNDL threat');
  assert(aiReply.suggestedPrompts !== undefined && aiReply.suggestedPrompts.length > 0, 'Assistant supplies suggested prompt chips');

  console.log(`\n🎉 Test Suite Completed: ${passed}/${total} assertions passed!`);
}

runTests();
