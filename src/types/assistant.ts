import { CryptoFinding } from './crypto';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isDemoAssistant: boolean;
  suggestedPrompts?: string[];
  referencedFinding?: CryptoFinding;
  actionableSteps?: string[];
  pqcReferences?: {
    standard: string;
    algorithm: string;
    url?: string;
  }[];
}

export interface AssistantConfig {
  mode: 'local-expert' | 'gemini-api';
  apiKey?: string;
}
