import { StyleRule } from "./api";

export interface TranslationResult {
  text: string;
  detectedSourceLanguage?: string;
  timestamp: number;
  error?: string;
}

export interface TranslationComparison {
  baseline: TranslationResult | null;
  custom: TranslationResult | null;
  isLoading: boolean;
  error?: string;
}

export interface DiceState {
  isRolling: boolean;
  generatedInstructions: string[];
  selectedInstructions: string[];
  error?: string;
}

export interface StyleRulesState {
  rules: StyleRule[];
  selectedRuleId: string | null;
  isLoading: boolean;
  error?: string;
}

export interface ApiDebugInfo {
  endpoint: string;
  method: string;
  request: unknown;
  response: unknown;
  statusCode: number;
  duration: number;
  timestamp: number;
}
