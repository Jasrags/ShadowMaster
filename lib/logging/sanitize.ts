/**
 * Log Sanitization Utilities
 *
 * Prevents log injection attacks (CWE-117) by escaping control characters
 * that could be used to forge log entries or corrupt log output.
 *
 * Primary defense: Use structured logging (Pino) with data as object fields.
 * This module provides additional sanitization for edge cases.
 */

/**
 * Regex matching control characters that enable log injection attacks.
 * Includes:
 * - C0 controls (0x00-0x1F): newlines, tabs, null, etc.
 * - DEL (0x7F)
 * - C1 controls (0x80-0x9F): rarely used but potentially dangerous
 */
const CONTROL_CHAR_REGEX = /[\x00-\x1F\x7F\x80-\x9F]/g;

/**
 * Human-readable escape sequences for common control characters.
 */
const ESCAPE_MAP: Record<string, string> = {
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\x00": "\\0",
};

/**
 * Sanitize a value for safe log inclusion.
 *
 * Escapes control characters to prevent log injection (CWE-117).
 * Common characters get readable escapes (\n, \r, \t, \0).
 * Other control chars get hex escapes (\x1b for ESC, etc.).
 *
 * @param value - Any value to sanitize
 * @returns Sanitized string safe for log output
 *
 * @example
 * sanitizeLogValue("normal text") // "normal text"
 * sanitizeLogValue("line1\nline2") // "line1\\nline2"
 * sanitizeLogValue("fake entry\n[INFO] Injected log") // "fake entry\\n[INFO] Injected log"
 */
export function sanitizeLogValue(value: unknown): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  const str = typeof value === "string" ? value : String(value);

  return str.replace(CONTROL_CHAR_REGEX, (char) => {
    return ESCAPE_MAP[char] ?? `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`;
  });
}
