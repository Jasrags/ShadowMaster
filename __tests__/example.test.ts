/**
 * Example test file to verify Vitest setup
 *
 * This file can be deleted once real tests are added.
 */

import { describe, it, expect } from "vitest";

describe("Vitest Setup", () => {
  it("should run tests successfully", () => {
    expect(true).toBe(true);
  });

  it("should support basic assertions", () => {
    const value = 42;
    expect(value).toBe(42);
    expect(value).not.toBe(43);
  });
});
