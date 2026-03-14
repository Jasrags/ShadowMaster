import type { NextRequest } from "next/server";

/**
 * Extract the client IP address from a NextRequest.
 *
 * Handles the common proxy pattern where `x-forwarded-for` contains a
 * comma-separated list of IPs (client, proxy1, proxy2, ...).  The first
 * entry is the original client IP.
 *
 * Falls back to `x-real-ip`, then to `"unknown"`.
 */
export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (firstIp.length > 0) {
      return firstIp;
    }
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  return "unknown";
}
