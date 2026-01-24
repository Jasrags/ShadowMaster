/**
 * Environment Detection and Configuration
 *
 * Provides utilities for detecting the current environment and
 * accessing build-time metadata like version and git SHA.
 */

/**
 * Application environment types
 */
export type AppEnvironment = "local" | "docker" | "staging" | "production";

/**
 * Build metadata injected at build time
 */
export interface BuildInfo {
  /** Application environment */
  env: AppEnvironment;
  /** Version from package.json */
  version: string;
  /** Git commit SHA (short) */
  gitSha: string;
  /** Build timestamp (ISO string) */
  buildDate: string;
  /** Whether this is a development build */
  isDev: boolean;
}

/**
 * Environment display configuration
 */
export interface EnvironmentDisplay {
  /** Display label */
  label: string;
  /** Tailwind color classes for text */
  textColor: string;
  /** Tailwind color classes for background (badges) */
  bgColor: string;
  /** Whether to show the environment indicator */
  showIndicator: boolean;
  /** Whether to show full details (SHA, date) */
  showDetails: boolean;
}

/**
 * Display configuration per environment
 */
const ENV_DISPLAY: Record<AppEnvironment, EnvironmentDisplay> = {
  local: {
    label: "local",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/20",
    showIndicator: true,
    showDetails: true,
  },
  docker: {
    label: "docker",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/20",
    showIndicator: true,
    showDetails: true,
  },
  staging: {
    label: "staging",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/20",
    showIndicator: true,
    showDetails: true,
  },
  production: {
    label: "",
    textColor: "text-neutral-500",
    bgColor: "bg-neutral-500/20",
    showIndicator: false,
    showDetails: false,
  },
};

/**
 * Validate and parse environment string
 */
function parseEnvironment(env: string | undefined): AppEnvironment {
  const validEnvs: AppEnvironment[] = ["local", "docker", "staging", "production"];
  const parsed = (env?.toLowerCase() || "local") as AppEnvironment;
  return validEnvs.includes(parsed) ? parsed : "local";
}

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  }
  return "just now";
}

/**
 * Format date for display
 */
export function formatBuildDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get build information from environment variables
 *
 * These are injected at build time via next.config.ts
 */
export function getBuildInfo(): BuildInfo {
  return {
    env: parseEnvironment(process.env.NEXT_PUBLIC_APP_ENV),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0",
    gitSha: process.env.NEXT_PUBLIC_GIT_SHA || "unknown",
    buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
    isDev: process.env.NODE_ENV === "development",
  };
}

/**
 * Get display configuration for the current environment
 */
export function getEnvironmentDisplay(env?: AppEnvironment): EnvironmentDisplay {
  const buildInfo = getBuildInfo();
  const targetEnv = env || buildInfo.env;
  return ENV_DISPLAY[targetEnv];
}

/**
 * Check if we should show the environment indicator
 */
export function shouldShowEnvironmentIndicator(): boolean {
  const buildInfo = getBuildInfo();
  const display = getEnvironmentDisplay(buildInfo.env);
  return display.showIndicator;
}
