import { API_CONFIG } from "@/lib/constants/config";
import type {
  DeepLTranslateRequest,
  DeepLTranslateResponse,
  StyleRulesResponse,
  ApiError,
} from "@/types/api";

export async function translateText(
  apiKey: string,
  request: DeepLTranslateRequest
): Promise<DeepLTranslateResponse> {
  try {
    // Call our Next.js API route instead of DeepL directly (avoids CORS)
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        ...request,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.error || `API error: ${response.statusText}`,
        code: response.status,
        details: errorData.details,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    if ((error as ApiError).code) {
      throw error;
    }
    throw {
      message: `Network error: ${(error as Error).message}`,
      details: error,
    } as ApiError;
  }
}

export async function getStyleRules(
  apiKey: string,
  options?: {
    detailed?: boolean;
    page?: number;
    pageSize?: number;
  }
): Promise<StyleRulesResponse> {
  try {
    const params = new URLSearchParams({
      detailed: options?.detailed !== false ? "true" : "false",
      page: (options?.page ?? 0).toString(),
      page_size: (options?.pageSize ?? API_CONFIG.STYLE_RULES.DEFAULT_PAGE_SIZE).toString(),
    });

    // Call our Next.js API route instead of DeepL directly (avoids CORS)
    const response = await fetch(`/api/style-rules?${params}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.error || `API error: ${response.statusText}`,
        code: response.status,
        details: errorData.details,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    if ((error as ApiError).code) {
      throw error;
    }
    throw {
      message: `Network error: ${(error as Error).message}`,
      details: error,
    } as ApiError;
  }
}
