import { useState, useCallback } from "react";
import { translateText } from "@/lib/api/deepl";
import type { DeepLTranslateRequest } from "@/types/api";
import type { TranslationResult } from "@/types/components";
import { toast } from "sonner";

interface TranslateOptions {
  apiKey: string;
  text: string;
  sourceLang?: string;
  targetLang: string;
  styleRuleId?: string | null;
  customInstructions?: string[];
}

export function useTranslation() {
  const [baselineResult, setBaselineResult] =
    useState<TranslationResult | null>(null);
  const [customResult, setCustomResult] = useState<TranslationResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const translate = useCallback(async (options: TranslateOptions) => {
    const {
      apiKey,
      text,
      sourceLang,
      targetLang,
      styleRuleId,
      customInstructions,
    } = options;

    if (!text.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    setBaselineResult(null);
    setCustomResult(null);

    try {
      // Baseline request (no style rules or custom instructions)
      const baselineRequest: DeepLTranslateRequest = {
        text: [text],
        target_lang: targetLang as any,
        ...(sourceLang && sourceLang !== "auto" && { source_lang: sourceLang }),
      };

      // Custom request (with style rules and custom instructions)
      const customRequest: DeepLTranslateRequest = {
        text: [text],
        target_lang: targetLang as any,
        ...(sourceLang && sourceLang !== "auto" && { source_lang: sourceLang }),
        ...(styleRuleId && { style_rule_id: styleRuleId }),
        ...(customInstructions &&
          customInstructions.length > 0 && {
            custom_instructions: customInstructions,
          }),
      };

      console.log("Custom translation request:", {
        styleRuleId,
        customInstructions,
        customRequest
      });

      // Run both translations in parallel
      const [baselineResponse, customResponse] = await Promise.all([
        translateText(apiKey, baselineRequest),
        translateText(apiKey, customRequest),
      ]);

      setBaselineResult({
        text: baselineResponse.translations[0].text,
        detectedSourceLanguage:
          baselineResponse.translations[0].detected_source_language,
        timestamp: Date.now(),
      });

      setCustomResult({
        text: customResponse.translations[0].text,
        detectedSourceLanguage:
          customResponse.translations[0].detected_source_language,
        timestamp: Date.now(),
      });

      toast.success("Translation completed!");
    } catch (error) {
      const errorMessage = (error as Error).message || "Translation failed";
      toast.error(errorMessage);

      setBaselineResult({
        text: "",
        error: errorMessage,
        timestamp: Date.now(),
      });

      setCustomResult({
        text: "",
        error: errorMessage,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    baselineResult,
    customResult,
    isLoading,
    translate,
  };
}
