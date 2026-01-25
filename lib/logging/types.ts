/**
 * Logging Type Definitions
 *
 * Types for the structured logging system.
 */

import type { Level } from "pino";

/**
 * Supported log levels (matches pino levels)
 */
export type LogLevel = Level;

/**
 * Context attached to request-scoped loggers
 */
export interface LogContext {
  /** Correlation ID for request tracing */
  requestId?: string;
  /** Authenticated user ID */
  userId?: string;
  /** HTTP method */
  method?: string;
  /** Request path */
  path?: string;
  /** Client IP address */
  ip?: string;
}

/**
 * Configuration options for the logger
 */
export interface LoggerConfig {
  /** Minimum log level */
  level: LogLevel;
  /** Logger name (appears in log output) */
  name: string;
  /** Current environment */
  env: string;
  /** Whether to use pretty printing (local dev only) */
  pretty: boolean;
  /** Whether to use synchronous writes (for Docker stdout) */
  sync: boolean;
}

/**
 * Fields that should be redacted from log output
 */
export const REDACTED_FIELDS = [
  "password",
  "token",
  "secret",
  "apiKey",
  "api_key",
  "apikey",
  "authorization",
  "cookie",
  "sessionSecretHash",
] as const;
