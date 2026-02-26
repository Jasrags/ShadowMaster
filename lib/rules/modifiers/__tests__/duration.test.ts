/**
 * Tests for duration helper
 *
 * @see Issue #114
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { computeExpiresAt } from "../duration";

describe("computeExpiresAt", () => {
  const NOW = new Date("2025-06-15T12:00:00.000Z").getTime();

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns ISO string 12 seconds ahead for combat-turn", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const result = computeExpiresAt("combat-turn");
    expect(result).toBe(new Date(NOW + 12_000).toISOString());
  });

  it("returns ISO string 60 seconds ahead for minute", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const result = computeExpiresAt("minute");
    expect(result).toBe(new Date(NOW + 60_000).toISOString());
  });

  it("returns ISO string 3600 seconds ahead for hour", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const result = computeExpiresAt("hour");
    expect(result).toBe(new Date(NOW + 3_600_000).toISOString());
  });

  it("returns undefined for scene", () => {
    expect(computeExpiresAt("scene")).toBeUndefined();
  });

  it("returns undefined for permanent", () => {
    expect(computeExpiresAt("permanent")).toBeUndefined();
  });
});
