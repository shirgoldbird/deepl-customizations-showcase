import { useState, useCallback } from "react";
import { generateInstructions } from "@/lib/api/openai";
import { API_CONFIG } from "@/lib/constants/config";
import { toast } from "sonner";
import type { CategorizedInstruction } from "@/types/api";

export type SpiceLevel = "normal" | "spicy" | "nuclear";

export function useDiceRoll(proxyUrl: string) {
  const [isRolling, setIsRolling] = useState(false);
  const [generatedInstructions, setGeneratedInstructions] = useState<CategorizedInstruction[]>(
    []
  );
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    []
  );
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>("normal");

  const rollDice = useCallback(async () => {
    if (!proxyUrl) {
      toast.error("OpenAI proxy URL not configured");
      return;
    }

    setIsRolling(true);
    setGeneratedInstructions([]);
    setSelectedInstructions([]);

    try {
      const response = await generateInstructions(proxyUrl, {
        count: 4, // 2 fun + 2 business
        max_length: API_CONFIG.CUSTOM_INSTRUCTIONS.MAX_LENGTH,
        style: "creative",
        spiceLevel,
      });

      setGeneratedInstructions(response.instructions);
      toast.success("Custom instructions generated!");
    } catch (error) {
      toast.error(
        `Failed to generate instructions: ${(error as Error).message}`
      );
      console.error("Error generating instructions:", error);
    } finally {
      setIsRolling(false);
    }
  }, [proxyUrl, spiceLevel]);

  const toggleInstruction = useCallback((instruction: string) => {
    setSelectedInstructions((prev) => {
      if (prev.includes(instruction)) {
        return prev.filter((i) => i !== instruction);
      }
      // Allow selecting all 4 instructions if user wants
      if (prev.length >= 4) {
        toast.warning("Maximum 4 instructions allowed");
        return prev;
      }
      return [...prev, instruction];
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedInstructions([]);
  }, []);

  return {
    isRolling,
    generatedInstructions,
    selectedInstructions,
    spiceLevel,
    setSpiceLevel,
    rollDice,
    toggleInstruction,
    clearSelections,
  };
}
