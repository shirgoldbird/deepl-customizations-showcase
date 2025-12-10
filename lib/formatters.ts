// Format style rule parameter names from snake_case to Title Case
export function formatParameterName(paramName: string): string {
  return paramName
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Format style rule configuration for display
export function formatStyleRuleConfig(config: Record<string, unknown>): string[] {
  const formatted: string[] = [];

  for (const [category, values] of Object.entries(config)) {
    if (typeof values === "object" && values !== null) {
      for (const [param, value] of Object.entries(values)) {
        const paramName = formatParameterName(param);
        const valueStr = typeof value === "string" ? value : JSON.stringify(value);
        formatted.push(`${paramName}: ${valueStr}`);
      }
    }
  }

  return formatted;
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

// Format duration in milliseconds to readable format
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
