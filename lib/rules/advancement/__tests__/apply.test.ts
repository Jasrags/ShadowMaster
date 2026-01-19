/**
 * Tests for applyAdvancement function
 *
 * Tests applying advancement records to character state for various advancement types.
 */

import { describe, it, expect } from "vitest";
import type { Character, AdvancementRecord } from "@/lib/types";
import { applyAdvancement } from "../apply";
import { createMockCharacter } from "@/__tests__/mocks/storage";

describe("applyAdvancement", () => {
  describe("attribute advancement", () => {
    it("should update character attribute to new value", () => {
      const character = createMockCharacter({
        attributes: { body: 3, agility: 4 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.attributes.body).toBe(4);
      expect(result.attributes.agility).toBe(4); // Unchanged
    });

    it("should preserve other attributes when updating one", () => {
      const character = createMockCharacter({
        attributes: { body: 3, agility: 4, reaction: 5 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "attribute",
        targetId: "agility",
        targetName: "Agility",
        previousValue: 4,
        newValue: 5,
        karmaCost: 25,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.attributes.body).toBe(3);
      expect(result.attributes.agility).toBe(5);
      expect(result.attributes.reaction).toBe(5);
    });
  });

  describe("skill advancement", () => {
    it("should update character skill to new value", () => {
      const character = createMockCharacter({
        skills: { firearms: 3, athletics: 2 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 3,
        newValue: 4,
        karmaCost: 8,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.skills.firearms).toBe(4);
      expect(result.skills.athletics).toBe(2); // Unchanged
    });

    it("should add a new skill if not present", () => {
      const character = createMockCharacter({
        skills: { athletics: 2 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 0,
        newValue: 1,
        karmaCost: 2,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.skills.firearms).toBe(1);
      expect(result.skills.athletics).toBe(2);
    });
  });

  describe("specialization advancement", () => {
    it("should add specialization to skill from notes", () => {
      const character = createMockCharacter({
        skills: { firearms: 4 },
        skillSpecializations: {},
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "specialization",
        targetId: "firearms",
        targetName: "Firearms Specialization",
        previousValue: 0,
        newValue: 1,
        karmaCost: 7,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        notes: "Specialization: Pistols",
      };

      const result = applyAdvancement(character, record);

      expect(result.skillSpecializations?.firearms).toContain("Pistols");
    });

    it("should add to existing specializations for a skill", () => {
      const character = createMockCharacter({
        skills: { firearms: 4 },
        skillSpecializations: { firearms: ["Pistols"] },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "specialization",
        targetId: "firearms",
        targetName: "Firearms Specialization",
        previousValue: 0,
        newValue: 1,
        karmaCost: 7,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        notes: "Specialization: Rifles",
      };

      const result = applyAdvancement(character, record);

      expect(result.skillSpecializations?.firearms).toContain("Pistols");
      expect(result.skillSpecializations?.firearms).toContain("Rifles");
      expect(result.skillSpecializations?.firearms).toHaveLength(2);
    });

    it("should not add duplicate specialization", () => {
      const character = createMockCharacter({
        skills: { firearms: 4 },
        skillSpecializations: { firearms: ["Pistols"] },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "specialization",
        targetId: "firearms",
        targetName: "Firearms Specialization",
        previousValue: 0,
        newValue: 1,
        karmaCost: 7,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        notes: "Specialization: Pistols",
      };

      const result = applyAdvancement(character, record);

      expect(result.skillSpecializations?.firearms).toHaveLength(1);
      expect(result.skillSpecializations?.firearms).toContain("Pistols");
    });

    it("should handle missing notes gracefully", () => {
      const character = createMockCharacter({
        skills: { firearms: 4 },
        skillSpecializations: {},
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "specialization",
        targetId: "firearms",
        targetName: "Firearms Specialization",
        previousValue: 0,
        newValue: 1,
        karmaCost: 7,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        // No notes field
      };

      const result = applyAdvancement(character, record);

      // Should not crash, specializations unchanged
      expect(result.skillSpecializations).toEqual({});
    });

    it("should handle malformed specialization notes", () => {
      const character = createMockCharacter({
        skills: { firearms: 4 },
        skillSpecializations: {},
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "specialization",
        targetId: "firearms",
        targetName: "Firearms Specialization",
        previousValue: 0,
        newValue: 1,
        karmaCost: 7,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
        notes: "Some random note without proper format",
      };

      const result = applyAdvancement(character, record);

      // Should not crash, specializations unchanged
      expect(result.skillSpecializations).toEqual({});
    });
  });

  describe("edge advancement", () => {
    it("should update character edge attribute", () => {
      const character = createMockCharacter({
        specialAttributes: { edge: 2, essence: 6 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "edge",
        targetId: "edge",
        targetName: "Edge",
        previousValue: 2,
        newValue: 3,
        karmaCost: 15,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: false,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.specialAttributes.edge).toBe(3);
      expect(result.specialAttributes.essence).toBe(6); // Unchanged
    });

    it("should preserve other special attributes", () => {
      const character = createMockCharacter({
        specialAttributes: { edge: 2, essence: 6, magic: 4 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "edge",
        targetId: "edge",
        targetName: "Edge",
        previousValue: 2,
        newValue: 3,
        karmaCost: 15,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: false,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.specialAttributes.edge).toBe(3);
      expect(result.specialAttributes.essence).toBe(6);
      expect(result.specialAttributes.magic).toBe(4);
    });
  });

  describe("immutability", () => {
    it("should return a new character object", () => {
      const character = createMockCharacter({
        attributes: { body: 3 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result).not.toBe(character);
      expect(result.attributes).not.toBe(character.attributes);
    });

    it("should not mutate the original character", () => {
      const character = createMockCharacter({
        attributes: { body: 3 },
      });
      const originalBody = character.attributes.body;
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      applyAdvancement(character, record);

      expect(character.attributes.body).toBe(originalBody);
    });
  });

  describe("unhandled advancement types", () => {
    it("should return character unchanged for unhandled types", () => {
      const character = createMockCharacter({
        attributes: { body: 3 },
        skills: { firearms: 4 },
      });
      const record: AdvancementRecord = {
        id: "test-record-id",
        type: "quality" as const,
        targetId: "some-quality",
        targetName: "Some Quality",
        previousValue: 0,
        newValue: 1,
        karmaCost: 10,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: false,
        trainingStatus: "completed",
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };

      const result = applyAdvancement(character, record);

      expect(result.attributes.body).toBe(3);
      expect(result.skills.firearms).toBe(4);
    });
  });
});
