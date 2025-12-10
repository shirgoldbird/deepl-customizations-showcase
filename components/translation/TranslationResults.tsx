"use client";

import { Copy, CheckCircle2, Eye, EyeOff, Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TranslationResult } from "@/types/components";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as Diff from "diff";

interface TranslationResultsProps {
  baseline: TranslationResult | null;
  custom: TranslationResult | null;
  isLoading: boolean;
  selectedStyleRuleName?: string;
  customInstructionsCount: number;
  baselineRequest?: any;
  customRequest?: any;
}

export function TranslationResults({
  baseline,
  custom,
  isLoading,
  selectedStyleRuleName,
  customInstructionsCount,
  baselineRequest,
  customRequest,
}: TranslationResultsProps) {
  const [copiedBaseline, setCopiedBaseline] = useState(false);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // Reset diff view when new results come in
  useEffect(() => {
    setShowDiff(false);
  }, [custom?.text]);

  const copyToClipboard = async (text: string, isBaseline: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isBaseline) {
        setCopiedBaseline(true);
        setTimeout(() => setCopiedBaseline(false), 2000);
      } else {
        setCopiedCustom(true);
        setTimeout(() => setCopiedCustom(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const renderDiffText = (baselineText: string, customText: string) => {
    const diff = Diff.diffWords(baselineText, customText);

    return (
      <div className="text-sm whitespace-pre-wrap">
        {diff.map((part, index) => {
          if (part.added) {
            return (
              <span
                key={index}
                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded px-0.5"
              >
                {part.value}
              </span>
            );
          }
          if (part.removed) {
            return (
              <span
                key={index}
                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through rounded px-0.5 opacity-70"
              >
                {part.value}
              </span>
            );
          }
          return <span key={index}>{part.value}</span>;
        })}
      </div>
    );
  };

  const renderRequestPreview = (request: any, isCustom: boolean) => {
    if (!request) return <p className="text-xs text-muted-foreground">No request data</p>;

    const displayRequest = { ...request };
    // Don't show the text array in the preview, it's too long
    if (displayRequest.text) {
      displayRequest.text = `[${displayRequest.text.length} text(s)]`;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            API Request
          </span>
        </div>
        <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-auto max-h-[300px]">
          {JSON.stringify(displayRequest, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Custom Translation Card */}
      <Card className="border-deepl-accent/50">
        <CardHeader>
          <CardTitle className="text-lg text-deepl-accent">
            Custom Translation
          </CardTitle>
          <CardDescription>
            {!selectedStyleRuleName && customInstructionsCount === 0
              ? "Without style rules or custom instructions"
              : `With ${selectedStyleRuleName ? `"${selectedStyleRuleName}" style rule` : "no style rule"}${customInstructionsCount > 0 ? ` + ${customInstructionsCount} custom instruction${customInstructionsCount > 1 ? 's' : ''}` : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-deepl-accent/20 animate-pulse rounded" />
              <div className="h-4 bg-deepl-accent/20 animate-pulse rounded w-5/6" />
              <div className="h-4 bg-deepl-accent/20 animate-pulse rounded w-4/6" />
            </div>
          ) : custom ? (
            <>
              {custom.error ? (
                <p className="text-sm text-destructive">{custom.error}</p>
              ) : (
                <>
                  {/* Diff Toggle Button */}
                  {baseline && !baseline.error && (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDiff(!showDiff)}
                        className="text-xs"
                      >
                        {showDiff ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide Diff
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show Diff
                          </>
                        )}
                      </Button>
                      {showDiff && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></span>
                            Added
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></span>
                            Removed
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 bg-deepl-accent/5 border border-deepl-accent/20 rounded-lg">
                    {baseline && !baseline.error && showDiff ? (
                      renderDiffText(baseline.text, custom.text)
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{custom.text}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(custom.text, false)}
                    className="w-full border-deepl-accent/50 hover:bg-deepl-accent/10"
                  >
                    {copiedCustom ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Translation results will appear here
            </p>
          )}

          {/* API Request Preview */}
          {customRequest && (
            <div className="border-t pt-4">
              {renderRequestPreview(customRequest, true)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Baseline Translation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Baseline Translation</CardTitle>
          <CardDescription>Without style rules or custom instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
              <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
            </div>
          ) : baseline ? (
            <>
              {baseline.error ? (
                <p className="text-sm text-destructive">{baseline.error}</p>
              ) : (
                <>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{baseline.text}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(baseline.text, true)}
                    className="w-full"
                  >
                    {copiedBaseline ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Translation results will appear here
            </p>
          )}

          {/* API Request Preview */}
          {baselineRequest && (
            <div className="border-t pt-4">
              {renderRequestPreview(baselineRequest, false)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
