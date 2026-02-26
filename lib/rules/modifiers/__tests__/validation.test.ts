/**
 * Tests for modifier validation
 *
 * @see Issue #114
 */

import { describe, it, expect } from "vitest";
import { validateAddModifier } from "../validation";
import type { AddModifierRequest } from "../validation";

describe("validateAddModifier", () => {
  describe("template mode", () => {
    it("accepts a valid template request", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "environment",
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects unknown template ID", () => {
      const req: AddModifierRequest = {
        templateId: "nonexistent-template",
        source: "gm",
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "templateId" }));
    });

    it("accepts template with notes and duration override", () => {
      const req: AddModifierRequest = {
        templateId: "good-cover",
        source: "gm",
        duration: "hour",
        notes: "Behind the wall",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(true);
    });
  });

  describe("custom mode", () => {
    it("accepts a valid custom request", () => {
      const req: AddModifierRequest = {
        name: "Custom Modifier",
        source: "gm",
        effect: {
          type: "dice-pool-modifier",
          triggers: ["always"],
          value: -3,
        },
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects custom without name", () => {
      const req: AddModifierRequest = {
        source: "gm",
        effect: {
          type: "dice-pool-modifier",
          triggers: ["always"],
          value: -1,
        },
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "name" }));
    });

    it("rejects custom without effect", () => {
      const req: AddModifierRequest = {
        name: "Test",
        source: "gm",
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "effect" }));
    });

    it("rejects invalid effect type", () => {
      const req: AddModifierRequest = {
        name: "Test",
        source: "gm",
        effect: {
          type: "invalid-type" as never,
          triggers: ["always"],
          value: -1,
        },
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "effect.type" }));
    });

    it("rejects empty triggers", () => {
      const req: AddModifierRequest = {
        name: "Test",
        source: "gm",
        effect: {
          type: "dice-pool-modifier",
          triggers: [],
          value: -1,
        },
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "effect.triggers" }));
    });

    it("rejects invalid trigger value", () => {
      const req: AddModifierRequest = {
        name: "Test",
        source: "gm",
        effect: {
          type: "dice-pool-modifier",
          triggers: ["not-a-trigger" as never],
          value: -1,
        },
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "effect.triggers" }));
    });
  });

  describe("shared fields", () => {
    it("rejects missing source", () => {
      const req = {
        templateId: "partial-cover",
        duration: "scene",
      } as AddModifierRequest;
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "source" }));
    });

    it("rejects invalid source", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "magic" as never,
        duration: "scene",
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "source" }));
    });

    it("rejects missing duration", () => {
      const req = {
        templateId: "partial-cover",
        source: "gm",
      } as AddModifierRequest;
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "duration" }));
    });

    it("rejects invalid duration", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "gm",
        duration: "forever" as never,
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "duration" }));
    });

    it("rejects non-integer expiresAfterUses", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "gm",
        duration: "scene",
        expiresAfterUses: 1.5,
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: "expiresAfterUses" }));
    });

    it("rejects zero expiresAfterUses", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "gm",
        duration: "scene",
        expiresAfterUses: 0,
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(false);
    });

    it("accepts valid expiresAfterUses", () => {
      const req: AddModifierRequest = {
        templateId: "partial-cover",
        source: "gm",
        duration: "scene",
        expiresAfterUses: 3,
      };
      const result = validateAddModifier(req);
      expect(result.valid).toBe(true);
    });
  });
});
