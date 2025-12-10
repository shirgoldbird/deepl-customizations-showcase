// Languages that support custom instructions
export const SUPPORTED_LANGUAGES = [
  { code: "de", name: "German" },
  { code: "en", name: "English" },
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// Source languages (optional, for auto-detection)
export const SOURCE_LANGUAGES = [
  { code: "auto", name: "Auto-detect" },
  ...SUPPORTED_LANGUAGES,
] as const;
