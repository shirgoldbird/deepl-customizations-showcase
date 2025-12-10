"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApiKeys } from "@/context/ApiKeysContext";
import { toast } from "sonner";

const settingsSchema = z.object({
  deeplApiKey: z.string().min(1, "DeepL API key is required"),
  openaiProxyUrl: z.string().url("Must be a valid URL"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { config, setConfig } = useApiKeys();
  const [isSaving, setIsSaving] = useState(false);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      deeplApiKey: config?.deeplApiKey || "",
      openaiProxyUrl: config?.openaiProxyUrl || "",
    },
  });

  useEffect(() => {
    if (config) {
      reset({
        deeplApiKey: config.deeplApiKey || "",
        openaiProxyUrl: config.openaiProxyUrl || "",
      });
      setShowDebugLogs(config.showDebugLogs || false);
    }
  }, [config, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      setConfig({
        deeplApiKey: data.deeplApiKey,
        openaiProxyUrl: data.openaiProxyUrl,
        showDebugLogs,
        lastUpdated: new Date().toISOString(),
      });
      toast.success("Settings saved successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Configure your DeepL API key and OpenAI proxy endpoint.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deeplApiKey">DeepL API Key</Label>
            <Input
              id="deeplApiKey"
              type="password"
              placeholder="your_deepl_api_key_here"
              {...register("deeplApiKey")}
            />
            {errors.deeplApiKey && (
              <p className="text-sm text-destructive">
                {errors.deeplApiKey.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://www.deepl.com/pro-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-deepl-accent hover:underline"
              >
                deepl.com/pro-api
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openaiProxyUrl">OpenAI Proxy URL</Label>
            <Input
              id="openaiProxyUrl"
              type="url"
              placeholder="https://your-openai-proxy-url.com"
              {...register("openaiProxyUrl")}
            />
            {errors.openaiProxyUrl && (
              <p className="text-sm text-destructive">
                {errors.openaiProxyUrl.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Custom OpenAI proxy endpoint for generating instructions
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2 py-2">
            <div className="space-y-0.5">
              <Label htmlFor="showDebugLogs">Show API Debug Logs</Label>
              <p className="text-xs text-muted-foreground">
                Display detailed API request/response information
              </p>
            </div>
            <Switch
              id="showDebugLogs"
              checked={showDebugLogs}
              onCheckedChange={setShowDebugLogs}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
