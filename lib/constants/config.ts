export const API_CONFIG = {
  DEEPL: {
    BASE_URL: "https://api.deepl.com",
    TRANSLATE_ENDPOINT: "/v2/translate",
    STYLE_RULES_ENDPOINT: "/v3/style_rules",
  },
  OPENAI_PROXY: {
    DEFAULT_URL: "",
  },
  CUSTOM_INSTRUCTIONS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 300,
  },
  STYLE_RULES: {
    DEFAULT_PAGE_SIZE: 25,
  },
} as const;

export const STORAGE_KEYS = {
  CONFIG: "deepl-demo-config",
} as const;
