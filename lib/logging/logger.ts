/**
 * Core Logger Factory
 *
 * Provides a singleton pino logger with environment-aware configuration.
 * Uses synchronous writes in non-local environments to fix Docker stdout buffering.
 */

import pino, { type Logger, type LoggerOptions, type DestinationStream } from "pino";
import { getBuildInfo, type AppEnvironment } from "@/lib/env";
import { REDACTED_FIELDS, type LogLevel } from "./types";

interface LoggerResult {
  options: LoggerOptions;
  destination?: DestinationStream;
}

/**
 * Default log levels per environment
 */
const DEFAULT_LEVELS: Record<AppEnvironment, LogLevel> = {
  local: "debug",
  docker: "info",
  staging: "info",
  production: "warn",
};

/**
 * Build pino configuration for the given environment
 */
function buildConfig(env: AppEnvironment): LoggerResult {
  // Allow override via environment variable
  const levelOverride = process.env.LOG_LEVEL as LogLevel | undefined;
  const level = levelOverride || DEFAULT_LEVELS[env];

  // Build redaction paths for nested objects
  const redactPaths = REDACTED_FIELDS.flatMap((field) => [field, `*.${field}`, `*.*.${field}`]);

  const baseConfig: LoggerOptions = {
    level,
    name: "shadow-master",
    redact: {
      paths: redactPaths,
      censor: "[REDACTED]",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env,
      pid: process.pid,
    },
  };

  // Local development: use pretty printing
  if (env === "local") {
    return {
      options: {
        ...baseConfig,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      },
    };
  }

  // Non-local environments: JSON output with sync writes for Docker
  // Synchronous writes ensure immediate stdout flush (fixes Docker buffering)
  return {
    options: baseConfig,
    destination: pino.destination({ sync: true }),
  };
}

// Singleton logger instance
let loggerInstance: Logger | null = null;

/**
 * Get the singleton logger instance
 *
 * Creates the logger on first call with environment-appropriate configuration.
 * Subsequent calls return the same instance.
 *
 * @param env - Optional environment override (mainly for testing)
 */
export function getLogger(env?: AppEnvironment): Logger {
  if (!loggerInstance) {
    const effectiveEnv = env || getBuildInfo().env;
    const { options, destination } = buildConfig(effectiveEnv);
    loggerInstance = destination ? pino(options, destination) : pino(options);
  }
  return loggerInstance;
}

/**
 * Reset the logger instance (for testing only)
 */
export function resetLogger(): void {
  loggerInstance = null;
}

/**
 * Create a child logger with additional context
 *
 * @param bindings - Additional fields to include in all log entries
 */
export function createChildLogger(bindings: Record<string, unknown>): Logger {
  return getLogger().child(bindings);
}

/**
 * Default logger export for convenience
 */
export const logger = getLogger();
