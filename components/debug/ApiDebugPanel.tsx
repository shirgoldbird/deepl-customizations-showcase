"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ApiDebugPanelProps {
  baselineRequest?: unknown;
  baselineResponse?: unknown;
  customRequest?: unknown;
  customResponse?: unknown;
}

export function ApiDebugPanel({
  baselineRequest,
  baselineResponse,
  customRequest,
  customResponse,
}: ApiDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!baselineRequest && !customRequest) {
    return null;
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="flex items-center gap-2 text-base">
                <Code className="h-5 w-5" />
                API Debug Information
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Baseline API Call */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Baseline API Call</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Request:</p>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[200px]">
                      {JSON.stringify(baselineRequest, null, 2)}
                    </pre>
                  </div>
                  {baselineResponse ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Response:</p>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[200px]">
                        {JSON.stringify(baselineResponse, null, 2)}
                      </pre>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Custom API Call */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Custom API Call</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Request:</p>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[200px]">
                      {JSON.stringify(customRequest, null, 2)}
                    </pre>
                  </div>
                  {customResponse ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Response:</p>
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[200px]">
                        {JSON.stringify(customResponse, null, 2)}
                      </pre>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
