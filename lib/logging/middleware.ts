/**
 * Request Logging Middleware
 *
 * Utilities for request-scoped logging with correlation IDs.
 */

import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import type { Logger } from "pino";
import { createChildLogger } from "./logger";

/**
 * Extract or generate a request correlation ID
 *
 * Checks the x-request-id header first, falls back to generating a new UUID.
 */
export function getRequestId(request: NextRequest): string {
  return request.headers.get("x-request-id") || randomUUID();
}

/**
 * Extract client IP from request headers
 *
 * Checks x-forwarded-for header (for proxied requests) first.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs; take the first (client)
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Create a child logger with request context
 *
 * Includes requestId, method, path, and client IP for correlation.
 */
export function createRequestLogger(request: NextRequest): Logger {
  const url = new URL(request.url);

  return createChildLogger({
    requestId: getRequestId(request),
    method: request.method,
    path: url.pathname,
    ip: getClientIp(request),
  });
}

/**
 * Log request completion with timing and status
 *
 * @param logger - The request-scoped logger
 * @param statusCode - HTTP response status code
 * @param startTime - Request start time (from Date.now())
 */
export function logRequestComplete(logger: Logger, statusCode: number, startTime: number): void {
  const duration = Date.now() - startTime;

  // Choose log level based on status code
  if (statusCode >= 500) {
    logger.error({ statusCode, duration }, "Request failed");
  } else if (statusCode >= 400) {
    logger.warn({ statusCode, duration }, "Request error");
  } else {
    logger.info({ statusCode, duration }, "Request completed");
  }
}
