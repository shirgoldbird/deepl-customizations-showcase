"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dices, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDiceRoll } from "@/hooks/useDiceRoll";
import { useApiKeys } from "@/context/ApiKeysContext";
import { toast } from "sonner";

interface DiceInterfaceProps {
  onInstructionsSelected: (instructions: string[]) => void;
}

export function DiceInterface({ onInstructionsSelected }: DiceInterfaceProps) {
  const { config } = useApiKeys();
  const {
    isRolling,
    generatedInstructions,
    selectedInstructions,
    spiceLevel,
    setSpiceLevel,
    rollDice,
    toggleInstruction,
    clearSelections,
  } = useDiceRoll(config?.openaiProxyUrl || "");

  const [manualInstructions, setManualInstructions] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const handleRoll = async () => {
    await rollDice();
  };

  const addManualInstruction = () => {
    if (!currentInput.trim()) {
      toast.error("Please enter an instruction");
      return;
    }
    if (currentInput.length > 300) {
      toast.error("Instruction must be 300 characters or less");
      return;
    }
    setManualInstructions([...manualInstructions, currentInput.trim()]);
    setCurrentInput("");
    toast.success("Custom instruction added");
  };

  const removeManualInstruction = (index: number) => {
    setManualInstructions(manualInstructions.filter((_, i) => i !== index));
  };

  // Auto-update parent whenever selections change
  const allInstructions = [...selectedInstructions, ...manualInstructions];
  useEffect(() => {
    onInstructionsSelected(allInstructions);
  }, [selectedInstructions.length, manualInstructions.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-6 w-6 text-deepl-accent" />
          Custom Instructions Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manual Custom Instructions Input */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Add Your Own Instructions</h3>
          <div className="flex gap-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addManualInstruction();
                }
              }}
              placeholder="Enter a custom instruction (max 300 chars)"
              maxLength={300}
              className="flex-1"
            />
            <Button
              onClick={addManualInstruction}
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Display manual instructions */}
          {manualInstructions.length > 0 && (
            <div className="space-y-1">
              {manualInstructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm"
                >
                  <p className="flex-1">{instruction}</p>
                  <Button
                    onClick={() => removeManualInstruction(index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spice Level Selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">🌶️ Spice Level</h3>
          <div className="grid grid-cols-3 gap-2">
            {(["normal", "spicy", "nuclear"] as const).map((level) => {
              const labels = {
                normal: { emoji: "😄", text: "Normal" },
                spicy: { emoji: "🔥", text: "Spicy" },
                nuclear: { emoji: "💥", text: "Nuclear" },
              };
              const label = labels[level];
              return (
                <button
                  key={level}
                  onClick={() => setSpiceLevel(level)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    spiceLevel === level
                      ? "bg-deepl-accent text-white border-deepl-accent"
                      : "bg-card border-border hover:border-deepl-accent/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{label.emoji}</span>
                    <span className="text-xs">{label.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dice Roll Section */}
        <div className="flex gap-2">
          <motion.div
            className="w-full"
            animate={
              isRolling
                ? {
                    rotateY: [0, 360, 720, 1080],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Button
              onClick={handleRoll}
              disabled={isRolling}
              size="lg"
              className="bg-deepl-accent hover:bg-deepl-accent/90 w-full"
            >
              <Dices className="h-5 w-5 mr-2" />
              {isRolling ? "Rolling..." : "Roll Dice for AI Suggestions"}
            </Button>
          </motion.div>
        </div>

        {/* AI-Generated Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {generatedInstructions.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Select instructions to apply to your translation:
              </p>

              {/* Fun Instructions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-deepl-accent flex items-center gap-2">
                  <span>🎉</span> Fun Instructions
                </h3>
                <div className="space-y-3">
                  {generatedInstructions
                    .filter((item) => item.category === "fun")
                    .map((item, index) => {
                      const isSelected = selectedInstructions.includes(item.instruction);
                      return (
                        <motion.button
                          key={`fun-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => toggleInstruction(item.instruction)}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            isSelected
                              ? "bg-deepl-accent/10 border-deepl-accent"
                              : "bg-card border-border hover:border-deepl-accent/50"
                          }`}
                        >
                          <p className="text-sm">{item.instruction}</p>
                        </motion.button>
                      );
                    })}
                </div>
              </div>

              {/* Business Instructions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-deepl-primary flex items-center gap-2">
                  <span>💼</span> Business Instructions
                </h3>
                <div className="space-y-3">
                  {generatedInstructions
                    .filter((item) => item.category === "business")
                    .map((item, index) => {
                      const isSelected = selectedInstructions.includes(item.instruction);
                      const funCount = generatedInstructions.filter((i) => i.category === "fun").length;
                      return (
                        <motion.button
                          key={`business-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (funCount + index) * 0.1 }}
                          onClick={() => toggleInstruction(item.instruction)}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            isSelected
                              ? "bg-deepl-primary/10 border-deepl-primary"
                              : "bg-card border-border hover:border-deepl-primary/50"
                          }`}
                        >
                          <p className="text-sm">{item.instruction}</p>
                        </motion.button>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Fun Instructions Placeholders */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-deepl-accent flex items-center gap-2">
                  <span>🎉</span> Fun Instructions
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={`fun-placeholder-${i}`}
                      className="w-full p-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30"
                    >
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse" style={{ width: `${60 + (i * 10)}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Instructions Placeholders */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-deepl-primary flex items-center gap-2">
                  <span>💼</span> Business Instructions
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={`business-placeholder-${i}`}
                      className="w-full p-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30"
                    >
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse" style={{ width: `${55 + (i * 15)}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
