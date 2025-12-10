"use client";

import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, SOURCE_LANGUAGES } from "@/lib/constants/languages";
import { EXAMPLE_TEXTS, getCategoryLabel } from "@/lib/constants/exampleTexts";

interface TranslationFormProps {
  onTranslate: (text: string, sourceLang: string, targetLang: string) => void;
  isLoading: boolean;
  onFormChange?: (text: string, sourceLang: string, targetLang: string) => void;
}

export function TranslationForm({ onTranslate, isLoading, onFormChange }: TranslationFormProps) {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("de");

  // Notify parent of form changes for live preview
  useEffect(() => {
    onFormChange?.(text, sourceLang, targetLang);
  }, [text, sourceLang, targetLang, onFormChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTranslate(text, sourceLang, targetLang);
    }
  };

  const loadExampleText = (exampleId: string) => {
    const example = EXAMPLE_TEXTS.find((ex) => ex.id === exampleId);
    if (example) {
      setText(example.text);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-6 w-6 text-deepl-accent" />
          Translation Input
        </CardTitle>
        <CardDescription>
          Enter your text or select an example to see the translation comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-lang">Source Language</Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger id="source-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-lang">Target Language</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger id="target-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="example-texts">Example Texts (Optional)</Label>
            <Select onValueChange={loadExampleText}>
              <SelectTrigger id="example-texts">
                <SelectValue placeholder="Select an example text..." />
              </SelectTrigger>
              <SelectContent>
                {EXAMPLE_TEXTS.map((example) => (
                  <SelectItem key={example.id} value={example.id}>
                    {getCategoryLabel(example.category)} - {example.text.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-input">Your Text</Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={!text.trim() || isLoading}
            size="lg"
            className="w-full bg-deepl-accent hover:bg-deepl-accent/90"
          >
            {isLoading ? "Translating..." : "Translate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
