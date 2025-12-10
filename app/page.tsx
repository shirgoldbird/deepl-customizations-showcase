"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { DiceInterface } from "@/components/dice/DiceInterface";
import { StyleRulesPanel } from "@/components/style-rules/StyleRulesPanel";
import { TranslationForm } from "@/components/translation/TranslationForm";
import { TranslationResults } from "@/components/translation/TranslationResults";
import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { useApiKeys } from "@/context/ApiKeysContext";
import { useStyleRules } from "@/context/StyleRulesContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { config, isConfigured } = useApiKeys();
  const { rules, selectedRuleId } = useStyleRules();
  const { baselineResult, customResult, isLoading, translate } = useTranslation();

  const [selectedCustomInstructions, setSelectedCustomInstructions] = useState<string[]>([]);
  const [lastRequest, setLastRequest] = useState<{
    baseline: unknown;
    custom: unknown;
  } | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [currentSourceLang, setCurrentSourceLang] = useState("auto");
  const [currentTargetLang, setCurrentTargetLang] = useState("de");

  // Create live preview of API requests
  const previewRequests = useMemo(() => {
    const baseline = {
      text: currentText ? [currentText] : ["[Enter text to see request preview]"],
      target_lang: currentTargetLang,
      ...(currentSourceLang !== "auto" && { source_lang: currentSourceLang }),
    };

    const custom = {
      text: currentText ? [currentText] : ["[Enter text to see request preview]"],
      target_lang: currentTargetLang,
      ...(currentSourceLang !== "auto" && { source_lang: currentSourceLang }),
      ...(selectedRuleId && { style_rule_id: selectedRuleId }),
      ...(selectedCustomInstructions.length > 0 && {
        custom_instructions: selectedCustomInstructions,
      }),
    };

    return { baseline, custom };
  }, [currentText, currentSourceLang, currentTargetLang, selectedRuleId, selectedCustomInstructions]);

  const handleInstructionsSelected = (instructions: string[]) => {
    setSelectedCustomInstructions(instructions);
    toast.success(`${instructions.length} custom instructions selected`);
  };

  const handleTranslate = (text: string, sourceLang: string, targetLang: string) => {
    if (!isConfigured || !config) {
      toast.error("Please configure your API keys in settings");
      return;
    }

    console.log("handleTranslate - Selected values:", {
      selectedRuleId,
      selectedCustomInstructions,
      selectedCustomInstructionsLength: selectedCustomInstructions.length
    });

    const baselineReq = {
      text: [text],
      target_lang: targetLang,
      ...(sourceLang !== "auto" && { source_lang: sourceLang }),
    };

    const customReq = {
      text: [text],
      target_lang: targetLang,
      ...(sourceLang !== "auto" && { source_lang: sourceLang }),
      ...(selectedRuleId && { style_rule_id: selectedRuleId }),
      ...(selectedCustomInstructions.length > 0 && {
        custom_instructions: selectedCustomInstructions,
      }),
    };

    console.log("handleTranslate - Constructed requests:", {
      baselineReq,
      customReq
    });

    setLastRequest({
      baseline: baselineReq,
      custom: customReq,
    });

    translate({
      apiKey: config.deeplApiKey,
      text,
      sourceLang: sourceLang !== "auto" ? sourceLang : undefined,
      targetLang,
      styleRuleId: selectedRuleId,
      customInstructions: selectedCustomInstructions.length > 0 ? selectedCustomInstructions : undefined,
    });
  };

  const selectedStyleRule = rules.find((rule) => rule.style_id === selectedRuleId);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deepl-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isConfigured && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Welcome!</strong> Please configure your API keys using the settings button in the header.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Custom Instructions and Style Rules - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dice Interface */}
              <DiceInterface onInstructionsSelected={handleInstructionsSelected} />

              {/* Style Rules Panel */}
              <StyleRulesPanel />
            </div>

            <Separator />

            {/* Translation Input and Output - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Translation Form */}
              <TranslationForm
                onTranslate={handleTranslate}
                isLoading={isLoading}
                onFormChange={(text, sourceLang, targetLang) => {
                  setCurrentText(text);
                  setCurrentSourceLang(sourceLang);
                  setCurrentTargetLang(targetLang);
                }}
              />

              {/* Translation Results - Stacked */}
              <div className="space-y-6">
                <TranslationResults
                  baseline={baselineResult}
                  custom={customResult}
                  isLoading={isLoading}
                  selectedStyleRuleName={selectedStyleRule?.name}
                  customInstructionsCount={selectedCustomInstructions.length}
                  baselineRequest={previewRequests.baseline}
                  customRequest={previewRequests.custom}
                />
              </div>
            </div>

            {/* API Debug Panel */}
            {config?.showDebugLogs && lastRequest && (
              <ApiDebugPanel
                baselineRequest={lastRequest.baseline}
                baselineResponse={baselineResult}
                customRequest={lastRequest.custom}
                customResponse={customResult}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
