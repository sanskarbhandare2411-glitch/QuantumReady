import React, { useState, useEffect } from 'react';
import { CryptoFinding } from './types/crypto';
import { RoadmapTask, TaskStatus } from './types/roadmap';
import {
  getStoredFindings,
  saveStoredFindings,
  getStoredRoadmap,
  saveStoredRoadmap,
  resetToDemoData,
  clearAllScanData,
} from './services/storage';
import { calculateQuantumReadinessScore } from './services/riskEngine';
import { Navbar, NavTab } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScannerView } from './components/scanner/ScannerView';
import { InventoryView } from './components/inventory/InventoryView';
import { RiskAssessmentView } from './components/risk/RiskAssessmentView';
import { DependencyGraphView } from './components/dependencies/DependencyGraphView';
import { MigrationSimulatorView } from './components/simulator/MigrationSimulatorView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AssistantView } from './components/assistant/AssistantView';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Cryptographic Findings & Demo State
  const [findings, setFindings] = useState<CryptoFinding[]>(() => {
    return getStoredFindings().findings;
  });
  const [isDemoData, setIsDemoData] = useState<boolean>(() => {
    return getStoredFindings().isDemo;
  });

  // Roadmap State
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(() => {
    return getStoredRoadmap();
  });

  // Simulator target state
  const [simulatorTargetAlgo, setSimulatorTargetAlgo] = useState<string>('RSA-2048');

  // Compute Quantum Readiness Score dynamically
  const readinessScore = calculateQuantumReadinessScore(findings);

  // Persistence effects
  useEffect(() => {
    saveStoredFindings(findings, isDemoData);
  }, [findings, isDemoData]);

  useEffect(() => {
    saveStoredRoadmap(roadmapTasks);
  }, [roadmapTasks]);

  // Handlers
  const handleResetDemo = () => {
    const res = resetToDemoData();
    setFindings(res.findings);
    setIsDemoData(true);
    setRoadmapTasks(res.roadmap);
  };

  const handleClearData = () => {
    const res = clearAllScanData();
    setFindings(res.findings);
    setIsDemoData(false);
  };

  const handleScanComplete = (newFindings: CryptoFinding[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setFindings(newFindings);
    } else {
      setFindings((prev) => [...prev, ...newFindings]);
    }
    setIsDemoData(false);
    setCurrentTab('inventory');
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setRoadmapTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = (newTask: Omit<RoadmapTask, 'id'>) => {
    const taskWithId: RoadmapTask = {
      ...newTask,
      id: `TASK-${Date.now().toString().slice(-4)}`,
    };
    setRoadmapTasks((prev) => [taskWithId, ...prev]);
  };

  const handleResetRoadmap = () => {
    const defaultRoadmap = resetToDemoData().roadmap;
    setRoadmapTasks(defaultRoadmap);
  };

  const handleSimulateAlgorithm = (algorithm: string) => {
    setSimulatorTargetAlgo(algorithm);
    setCurrentTab('simulator');
  };

  const handleSelectFinding = (finding: CryptoFinding) => {
    setCurrentTab('inventory');
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDemoData={isDemoData}
        onResetDemo={handleResetDemo}
        onClearData={handleClearData}
        findingsCount={findings.length}
        readinessScore={readinessScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            findings={findings}
            readinessScore={readinessScore}
            isDemoData={isDemoData}
            onNavigate={setCurrentTab}
            onSelectFinding={handleSelectFinding}
            onSimulateAlgorithm={handleSimulateAlgorithm}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            onScanComplete={handleScanComplete}
            onNavigateToSimulator={handleSimulateAlgorithm}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            findings={findings}
            isDemoData={isDemoData}
            onSimulateAlgorithm={handleSimulateAlgorithm}
            onSelectFinding={handleSelectFinding}
          />
        )}

        {currentTab === 'risk' && <RiskAssessmentView />}

        {currentTab === 'dependencies' && (
          <DependencyGraphView
            findings={findings}
            isDemoData={isDemoData}
            onSimulateAlgorithm={handleSimulateAlgorithm}
          />
        )}

        {currentTab === 'simulator' && (
          <MigrationSimulatorView
            findings={findings}
            initialAlgorithm={simulatorTargetAlgo}
            onNavigateToRoadmap={() => setCurrentTab('roadmap')}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapView
            tasks={roadmapTasks}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onAddTask={handleAddTask}
            onResetRoadmap={handleResetRoadmap}
          />
        )}

        {currentTab === 'assistant' && (
          <AssistantView
            findings={findings}
            readinessScore={readinessScore}
            isDemoData={isDemoData}
            onNavigateToSimulator={handleSimulateAlgorithm}
          />
        )}
      </main>

      {/* Enterprise Cyber Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-cyber-950 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-semibold">QuantumReady Platform</span>
            <span>&bull;</span>
            <span>NIST FIPS 203 / 204 / 205 Standard Alignment</span>
          </div>
          <div className="text-[11px] text-slate-500">
            For evaluation & discovery purposes. Verify against official NIST IR 8424 & CNSA 2.0 specs.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
