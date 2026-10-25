import { AlgorithmCategory, AlgorithmType, RiskLevel } from './crypto';

export interface CBOMFilterState {
  searchQuery: string;
  riskLevels: RiskLevel[];
  algorithms: AlgorithmType[];
  categories: AlgorithmCategory[];
  serviceFilter: string;
  confirmedOnly: boolean;
}

export interface CBOMExportData {
  bomFormat: 'CBOM-1.0';
  specVersion: '1.0';
  serialNumber: string;
  version: number;
  metadata: {
    timestamp: string;
    tool: {
      vendor: 'QuantumReady Security';
      name: 'QuantumReady CBOM Engine';
      version: '1.0.0';
    };
    component: {
      type: 'application';
      name: string;
      riskScore: number;
    };
  };
  components: Array<{
    id: string;
    name: string;
    algorithm: string;
    category: string;
    nistStatus: string;
    quantumRisk: string;
    pqcTarget: string;
    file: string;
    line: number;
  }>;
}
