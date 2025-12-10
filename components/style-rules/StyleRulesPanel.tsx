"use client";

import { useEffect } from "react";
import { RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStyleRules } from "@/context/StyleRulesContext";
import { useApiKeys } from "@/context/ApiKeysContext";
import { formatParameterName, formatStyleRuleConfig } from "@/lib/formatters";

export function StyleRulesPanel() {
  const { config, isConfigured } = useApiKeys();
  const { rules, selectedRuleId, setSelectedRuleId, isLoading, fetchStyleRules, refreshStyleRules } =
    useStyleRules();

  useEffect(() => {
    if (isConfigured && config?.deeplApiKey) {
      fetchStyleRules(config.deeplApiKey);
    }
  }, [isConfigured, config?.deeplApiKey, fetchStyleRules]);

  const handleRefresh = () => {
    if (config?.deeplApiKey) {
      refreshStyleRules(config.deeplApiKey);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-deepl-accent" />
              Style Rules
            </CardTitle>
            <CardDescription>
              Optionally select a style rule to apply to your translation
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading || !isConfigured}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConfigured ? (
          <p className="text-sm text-muted-foreground">
            Configure your API key to load style rules
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading style rules...</p>
        ) : rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No style rules found. Create some in your DeepL account.
          </p>
        ) : (
          <RadioGroup
            value={selectedRuleId || "none"}
            onValueChange={(value) => setSelectedRuleId(value === "none" ? null : value)}
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="none" id="none" className="mt-0.5" />
                <Label htmlFor="none" className="font-normal cursor-pointer">
                  None (no style rule)
                </Label>
              </div>

              {rules.map((rule) => {
                const configuredParams = rule.configured_rules
                  ? formatStyleRuleConfig(rule.configured_rules)
                  : [];

                return (
                  <div
                    key={rule.style_id}
                    className="flex items-start space-x-2 p-3 rounded-lg border"
                  >
                    <RadioGroupItem value={rule.style_id} id={rule.style_id} className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor={rule.style_id}
                        className="font-medium cursor-pointer"
                      >
                        {rule.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Language: {rule.language} • Version: {rule.version}
                      </p>
                      {configuredParams.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {configuredParams.map((param, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
