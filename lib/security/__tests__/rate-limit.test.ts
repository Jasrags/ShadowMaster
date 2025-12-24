
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RateLimiter } from "../rate-limit";

describe("RateLimiter", () => {
  const options = { windowMs: 100, max: 2 };
  let limiter: RateLimiter;

  beforeEach(() => {
    // Reset the internal state between tests by clearing instances
    // @ts-expect-error - accessing private field for testing
    RateLimiter.instances = new Map();
    limiter = RateLimiter.get("test-scope", options);
  });

  it("should allow requests under the limit", () => {
    expect(limiter.isRateLimited("key1")).toBe(false);
    expect(limiter.isRateLimited("key1")).toBe(false);
  });

  it("should block requests over the limit", () => {
    limiter.isRateLimited("key1");
    limiter.isRateLimited("key1");
    expect(limiter.isRateLimited("key1")).toBe(true);
  });

  it("should reset after the window expires", async () => {
    limiter.isRateLimited("key1");
    limiter.isRateLimited("key1");
    expect(limiter.isRateLimited("key1")).toBe(true);

    // Mock time passage
    vi.useFakeTimers();
    vi.advanceTimersByTime(101);

    expect(limiter.isRateLimited("key1")).toBe(false);
    vi.useRealTimers();
  });

  it("should track keys independently", () => {
    limiter.isRateLimited("key1");
    limiter.isRateLimited("key1");
    expect(limiter.isRateLimited("key1")).toBe(true);
    expect(limiter.isRateLimited("key2")).toBe(false);
  });

  it("should return correct remaining attempts", () => {
    expect(limiter.getRemaining("key3")).toBe(2);
    limiter.isRateLimited("key3");
    expect(limiter.getRemaining("key3")).toBe(1);
    limiter.isRateLimited("key3");
    expect(limiter.getRemaining("key3")).toBe(0);
  });
});
