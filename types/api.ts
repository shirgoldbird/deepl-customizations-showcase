import { LanguageCode } from "@/lib/constants/languages";

// DeepL API Types
export interface DeepLTranslateRequest {
  text: string[];
  source_lang?: string;
  target_lang: LanguageCode;
  style_rule_id?: string;
  custom_instructions?: string[];
}

export interface DeepLTranslateResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export interface StyleRuleParameter {
  [key: string]: string | number | boolean | object;
}

export interface StyleRule {
  style_id: string;
  name: string;
  creation_time: string;
  updated_time: string;
  language: string;
  version: number;
  configured_rules?: {
    numbers?: Record<string, unknown>;
    style_and_tone?: Record<string, unknown>;
    [key: string]: unknown;
  };
  custom_instructions?: {
    label: string;
    prompt: string;
  };
}

export interface StyleRulesResponse {
  style_rules: StyleRule[];
  pagination?: {
    page: number;
    page_size: number;
    total: number;
  };
}

// OpenAI Proxy Types
export type SpiceLevel = "normal" | "spicy" | "nuclear";

export interface GenerateInstructionsRequest {
  count: number;
  max_length: number;
  style?: string;
  spiceLevel?: SpiceLevel;
}

export interface CategorizedInstruction {
  category: "fun" | "business";
  instruction: string;
}

export interface GenerateInstructionsResponse {
  instructions: CategorizedInstruction[];
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}

// Storage Types
export interface DeepLConfig {
  deeplApiKey: string;
  openaiProxyUrl: string;
  showDebugLogs?: boolean;
  lastUpdated: string;
}
