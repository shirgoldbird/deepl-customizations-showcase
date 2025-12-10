"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getConfig, saveConfig } from "@/lib/storage/localStorage";
import type { DeepLConfig } from "@/types/api";
import { API_CONFIG } from "@/lib/constants/config";

interface ApiKeysContextType {
  config: DeepLConfig | null;
  setConfig: (config: DeepLConfig) => void;
  isConfigured: boolean;
  isLoading: boolean;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(
  undefined
);

export function ApiKeysProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<DeepLConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getConfig();
    if (stored) {
      setConfigState(stored);
    } else {
      // Set default OpenAI proxy URL
      setConfigState({
        deeplApiKey: "",
        openaiProxyUrl: API_CONFIG.OPENAI_PROXY.DEFAULT_URL,
        lastUpdated: new Date().toISOString(),
      });
    }
    setIsLoading(false);
  }, []);

  const setConfig = (newConfig: DeepLConfig) => {
    const configWithTimestamp = {
      ...newConfig,
      lastUpdated: new Date().toISOString(),
    };
    setConfigState(configWithTimestamp);
    saveConfig(configWithTimestamp);
  };

  const isConfigured = !!(config?.deeplApiKey && config?.openaiProxyUrl);

  return (
    <ApiKeysContext.Provider
      value={{ config, setConfig, isConfigured, isLoading }}
    >
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (context === undefined) {
    throw new Error("useApiKeys must be used within an ApiKeysProvider");
  }
  return context;
}
