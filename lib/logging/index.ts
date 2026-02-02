/**
 * Logging Module
 *
 * Structured logging with pino for Shadow Master.
 *
 * Features:
 * - Environment-aware configuration (local=pretty, others=JSON)
 * - Automatic field redaction (passwords, tokens, secrets)
 * - Request correlation IDs
 * - Synchronous writes for Docker stdout (fixes buffering)
 *
 * @example
 * // Basic usage
 * import { logger } from "@/lib/logging";
 * logger.info({ userId }, "User signed in");
 *
 * @example
 * // Module-specific logger
 * import { emailLogger } from "@/lib/logging";
 * emailLogger.info({ to, subject }, "Email sent");
 *
 * @example
 * // Request-scoped logger
 * import { createRequestLogger } from "@/lib/logging";
 * const log = createRequestLogger(request);
 * log.info("Processing request");
 */

// Core logger
export { logger, getLogger, createChildLogger, resetLogger } from "./logger";

// Request middleware
export { getRequestId, getClientIp, createRequestLogger, logRequestComplete } from "./middleware";

// Pre-configured module loggers
export {
  emailLogger,
  authLogger,
  storageLogger,
  rulesetLogger,
  securityLogger,
  combatLogger,
  apiLogger,
} from "./child-loggers";

// Sanitization utilities
export { sanitizeLogValue } from "./sanitize";

// Types
export type { LogLevel, LogContext, LoggerConfig } from "./types";
export { REDACTED_FIELDS } from "./types";
