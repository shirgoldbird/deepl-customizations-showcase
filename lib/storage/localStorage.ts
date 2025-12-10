import { STORAGE_KEYS } from "@/lib/constants/config";
import type { DeepLConfig } from "@/types/api";

export function getConfig(): DeepLConfig | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!stored) return null;

    const config = JSON.parse(stored) as DeepLConfig;
    return config;
  } catch (error) {
    console.error("Error reading config from localStorage:", error);
    return null;
  }
}

export function saveConfig(config: DeepLConfig): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving config to localStorage:", error);
    throw new Error("Failed to save configuration");
  }
}

export function clearConfig(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  } catch (error) {
    console.error("Error clearing config from localStorage:", error);
  }
}
