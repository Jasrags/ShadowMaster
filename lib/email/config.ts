/**
 * Email Configuration Loader
 *
 * Loads email configuration from environment variables with validation.
 */

import type { EmailConfig, EmailTransportType } from "./types";

// Cached configuration
let cachedConfig: EmailConfig | null = null;

/**
 * Valid transport types
 */
const VALID_TRANSPORTS: EmailTransportType[] = ["smtp", "resend", "file", "mock"];

/**
 * Default configuration values
 */
const DEFAULTS = {
  transport: "file" as EmailTransportType,
  fromEmail: "noreply@localhost",
  fromName: "Shadow Master",
  smtpPort: 587,
  smtpSecure: false,
  fileOutputDir: "data/emails",
};

/**
 * Configuration validation error
 */
export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}

/**
 * Parse boolean from environment variable
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parse number from environment variable
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === "") return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate transport type
 */
function validateTransportType(value: string | undefined): EmailTransportType {
  const transport = (value || DEFAULTS.transport).toLowerCase() as EmailTransportType;
  if (!VALID_TRANSPORTS.includes(transport)) {
    throw new EmailConfigError(
      `Invalid EMAIL_TRANSPORT: "${value}". Must be one of: ${VALID_TRANSPORTS.join(", ")}`
    );
  }
  return transport;
}

/**
 * Validate SMTP configuration
 */
function validateSmtpConfig(env: NodeJS.ProcessEnv): EmailConfig["smtp"] {
  const host = env.SMTP_HOST;
  if (!host) {
    throw new EmailConfigError("SMTP_HOST is required when using smtp transport");
  }

  return {
    host,
    port: parseNumber(env.SMTP_PORT, DEFAULTS.smtpPort),
    secure: parseBoolean(env.SMTP_SECURE, DEFAULTS.smtpSecure),
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  };
}

/**
 * Validate Resend configuration
 */
function validateResendConfig(env: NodeJS.ProcessEnv): EmailConfig["resend"] {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailConfigError("RESEND_API_KEY is required when using resend transport");
  }

  return { apiKey };
}

/**
 * Load email configuration from environment variables
 *
 * Configuration is cached after first load for performance.
 *
 * @param forceReload - Force reload from environment (useful for testing)
 * @returns EmailConfig object
 * @throws EmailConfigError if configuration is invalid
 */
export function loadEmailConfig(forceReload = false): EmailConfig {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }

  const env = process.env;
  const transport = validateTransportType(env.EMAIL_TRANSPORT);

  const config: EmailConfig = {
    transport,
    from: {
      email: env.EMAIL_FROM || DEFAULTS.fromEmail,
      name: env.EMAIL_FROM_NAME || DEFAULTS.fromName,
    },
  };

  // Load transport-specific configuration
  switch (transport) {
    case "smtp":
      config.smtp = validateSmtpConfig(env);
      break;

    case "resend":
      config.resend = validateResendConfig(env);
      break;

    case "file":
      config.file = {
        outputDir: env.EMAIL_OUTPUT_DIR || DEFAULTS.fileOutputDir,
      };
      break;

    case "mock":
      // No additional configuration needed
      break;
  }

  cachedConfig = config;
  return config;
}

/**
 * Clear the cached configuration
 *
 * Useful for testing when environment variables change.
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}

/**
 * Get the current cached configuration without reloading
 *
 * Returns null if not yet loaded.
 */
export function getCachedConfig(): EmailConfig | null {
  return cachedConfig;
}
