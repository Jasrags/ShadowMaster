/**
 * Pre-configured Child Loggers
 *
 * Module-specific loggers for different areas of the application.
 * Each logger includes a 'module' field for filtering.
 */

import { createChildLogger } from "./logger";

/**
 * Email module logger
 *
 * Replaces `console.log("[Email]...")` patterns.
 */
export const emailLogger = createChildLogger({ module: "email" });

/**
 * Authentication module logger
 *
 * For auth operations: signin, signout, session management.
 */
export const authLogger = createChildLogger({ module: "auth" });

/**
 * Storage module logger
 *
 * For file system operations: reads, writes, migrations.
 */
export const storageLogger = createChildLogger({ module: "storage" });

/**
 * Ruleset module logger
 *
 * For ruleset loading, merging, and validation.
 */
export const rulesetLogger = createChildLogger({ module: "ruleset" });

/**
 * Security module logger
 *
 * For audit logging and security events.
 */
export const securityLogger = createChildLogger({ module: "security" });

/**
 * Combat module logger
 *
 * For combat session operations.
 */
export const combatLogger = createChildLogger({ module: "combat" });

/**
 * API module logger
 *
 * For general API route logging.
 */
export const apiLogger = createChildLogger({ module: "api" });
