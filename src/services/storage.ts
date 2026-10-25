import { DEMO_FINDINGS } from '../data/demoData';
import { INITIAL_ROADMAP_TASKS } from '../data/defaultRoadmap';
import { CryptoFinding } from '../types/crypto';
import { RoadmapTask } from '../types/roadmap';

const STORAGE_KEYS = {
  FINDINGS: 'quantumready_findings_v1',
  ROADMAP: 'quantumready_roadmap_v1',
  IS_DEMO: 'quantumready_is_demo_v1',
  SCAN_HISTORY: 'quantumready_scan_history_v1',
};

export function getStoredFindings(): { findings: CryptoFinding[]; isDemo: boolean } {
  try {
    const isDemoStr = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    const isDemo = isDemoStr !== null ? JSON.parse(isDemoStr) : true; // Default to demo loaded for instant rich UX

    const stored = localStorage.getItem(STORAGE_KEYS.FINDINGS);
    if (stored) {
      return { findings: JSON.parse(stored), isDemo };
    }
  } catch (err) {
    console.error('Failed to parse stored findings:', err);
  }

  // Initial default: load demo findings
  return { findings: DEMO_FINDINGS, isDemo: true };
}

export function saveStoredFindings(findings: CryptoFinding[], isDemo: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify(findings));
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemo));
  } catch (err) {
    console.error('Failed to save findings to local storage:', err);
  }
}

export function getStoredRoadmap(): RoadmapTask[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to parse roadmap:', err);
  }
  return INITIAL_ROADMAP_TASKS;
}

export function saveStoredRoadmap(tasks: RoadmapTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save roadmap:', err);
  }
}

export function resetToDemoData(): { findings: CryptoFinding[]; roadmap: RoadmapTask[] } {
  try {
    localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify(DEMO_FINDINGS));
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(INITIAL_ROADMAP_TASKS));
  } catch (err) {
    console.error('Failed to reset demo data:', err);
  }
  return { findings: DEMO_FINDINGS, roadmap: INITIAL_ROADMAP_TASKS };
}

export function clearAllScanData(): { findings: CryptoFinding[]; roadmap: RoadmapTask[] } {
  try {
    localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(false));
  } catch (err) {
    console.error('Failed to clear scan data:', err);
  }
  return { findings: [], roadmap: INITIAL_ROADMAP_TASKS };
}
