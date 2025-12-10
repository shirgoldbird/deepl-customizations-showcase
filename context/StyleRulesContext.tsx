"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getStyleRules } from "@/lib/api/deepl";
import type { StyleRule } from "@/types/api";
import { toast } from "sonner";

interface StyleRulesContextType {
  rules: StyleRule[];
  selectedRuleId: string | null;
  setSelectedRuleId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  fetchStyleRules: (apiKey: string) => Promise<void>;
  refreshStyleRules: (apiKey: string) => Promise<void>;
}

const StyleRulesContext = createContext<StyleRulesContextType | undefined>(
  undefined
);

export function StyleRulesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rules, setRules] = useState<StyleRule[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStyleRules = useCallback(async (apiKey: string) => {
    if (!apiKey) {
      setError("API key is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getStyleRules(apiKey, { detailed: true });
      setRules(response.style_rules || []);
      if (response.style_rules.length === 0) {
        toast.info("No style rules found. Create some in your DeepL account.");
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Failed to fetch style rules";
      setError(errorMessage);
      toast.error(errorMessage);
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStyleRules = useCallback(
    async (apiKey: string) => {
      toast.promise(fetchStyleRules(apiKey), {
        loading: "Refreshing style rules...",
        success: "Style rules refreshed successfully",
        error: "Failed to refresh style rules",
      });
    },
    [fetchStyleRules]
  );

  return (
    <StyleRulesContext.Provider
      value={{
        rules,
        selectedRuleId,
        setSelectedRuleId,
        isLoading,
        error,
        fetchStyleRules,
        refreshStyleRules,
      }}
    >
      {children}
    </StyleRulesContext.Provider>
  );
}

export function useStyleRules() {
  const context = useContext(StyleRulesContext);
  if (context === undefined) {
    throw new Error("useStyleRules must be used within a StyleRulesProvider");
  }
  return context;
}
