/**
 * Tests for client-facing legality helper functions.
 *
 * These tests focus on the UI-friendly helpers (isLegalAtCreation, getCreationLegalityStatus)
 * that are used by creation panels to show real-time feedback.
 *
 * The server-side validation is tested separately in validation.test.ts.
 */

import { describe, test, expect } from "vitest";
import {
  isLegalAtCreation,
  getCreationLegalityStatus,
  CREATION_CONSTRAINTS,
} from "@/lib/rules/gear/validation";

describe("isLegalAtCreation", () => {
  const maxAvail = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

  test("returns true for legal item with availability at boundary", () => {
    expect(isLegalAtCreation(12, undefined)).toBe(true);
  });

  test("returns false for item over availability threshold", () => {
    expect(isLegalAtCreation(13, undefined)).toBe(false);
  });

  test("returns false for restricted items regardless of availability", () => {
    expect(isLegalAtCreation(6, "restricted")).toBe(false);
  });

  test("returns false for forbidden items regardless of availability", () => {
    expect(isLegalAtCreation(6, "forbidden")).toBe(false);
  });

  test("returns true for basic legal item with low availability", () => {
    expect(isLegalAtCreation(0, undefined)).toBe(true);
  });

  test("returns true for item at availability 0", () => {
    expect(isLegalAtCreation(0)).toBe(true);
  });

  test("returns true for availability exactly at max", () => {
    expect(isLegalAtCreation(maxAvail, undefined)).toBe(true);
  });

  test("returns false for availability one over max", () => {
    expect(isLegalAtCreation(maxAvail + 1, undefined)).toBe(false);
  });
});

describe("getCreationLegalityStatus", () => {
  const maxAvail = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

  test("returns 'legal' for legal item with valid availability", () => {
    expect(getCreationLegalityStatus(6, undefined)).toBe("legal");
  });

  test("returns 'forbidden' for forbidden items (highest severity)", () => {
    expect(getCreationLegalityStatus(6, "forbidden")).toBe("forbidden");
  });

  test("returns 'restricted' for restricted items", () => {
    expect(getCreationLegalityStatus(6, "restricted")).toBe("restricted");
  });

  test("returns 'over-availability' for high availability legal items", () => {
    expect(getCreationLegalityStatus(13, undefined)).toBe("over-availability");
  });

  test("returns 'forbidden' even if also over availability (forbidden takes precedence)", () => {
    expect(getCreationLegalityStatus(15, "forbidden")).toBe("forbidden");
  });

  test("returns 'restricted' even if also over availability (restricted takes precedence)", () => {
    expect(getCreationLegalityStatus(15, "restricted")).toBe("restricted");
  });

  test("returns 'legal' at availability boundary", () => {
    expect(getCreationLegalityStatus(maxAvail, undefined)).toBe("legal");
  });

  test("returns 'over-availability' at one over boundary", () => {
    expect(getCreationLegalityStatus(maxAvail + 1, undefined)).toBe("over-availability");
  });

  test("returns 'legal' for availability 0", () => {
    expect(getCreationLegalityStatus(0, undefined)).toBe("legal");
  });
});

describe("CREATION_CONSTRAINTS", () => {
  test("maxAvailabilityAtCreation is 12", () => {
    expect(CREATION_CONSTRAINTS.maxAvailabilityAtCreation).toBe(12);
  });

  test("maxDeviceRatingAtCreation is 6", () => {
    expect(CREATION_CONSTRAINTS.maxDeviceRatingAtCreation).toBe(6);
  });

  test("allowRestrictedAtCreation is false", () => {
    expect(CREATION_CONSTRAINTS.allowRestrictedAtCreation).toBe(false);
  });

  test("allowForbiddenAtCreation is false", () => {
    expect(CREATION_CONSTRAINTS.allowForbiddenAtCreation).toBe(false);
  });
});
