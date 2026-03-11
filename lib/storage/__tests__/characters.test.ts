/**
 * Tests for character storage layer
 *
 * Tests character CRUD operations, filtering, and gameplay functions.
 * Uses a temporary directory via CHARACTER_DATA_DIR env var for full isolation.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

let testDir: string;

// Dynamic imports so we can set CHARACTER_DATA_DIR before module evaluation
let getCharacter: typeof import("../characters").getCharacter;
let getUserCharacters: typeof import("../characters").getUserCharacters;
let getAllCharacters: typeof import("../characters").getAllCharacters;
let getCharactersByStatus: typeof import("../characters").getCharactersByStatus;
let getDraftCharacters: typeof import("../characters").getDraftCharacters;
let getActiveCharacters: typeof import("../characters").getActiveCharacters;
let getCharactersByEdition: typeof import("../characters").getCharactersByEdition;
let getCharactersByCampaign: typeof import("../characters").getCharactersByCampaign;
let createCharacterDraft: typeof import("../characters").createCharacterDraft;
let updateCharacter: typeof import("../characters").updateCharacter;
let finalizeCharacter: typeof import("../characters").finalizeCharacter;
let deleteCharacter: typeof import("../characters").deleteCharacter;
let updateCharacterAttributes: typeof import("../characters").updateCharacterAttributes;
let updateCharacterSkills: typeof import("../characters").updateCharacterSkills;
let updateCharacterQualities: typeof import("../characters").updateCharacterQualities;
let updateCharacterGear: typeof import("../characters").updateCharacterGear;
let applyDamage: typeof import("../characters").applyDamage;
let healCharacter: typeof import("../characters").healCharacter;
let spendKarma: typeof import("../characters").spendKarma;
let awardKarma: typeof import("../characters").awardKarma;
let setCharacterCampaign: typeof import("../characters").setCharacterCampaign;
let retireCharacter: typeof import("../characters").retireCharacter;
let killCharacter: typeof import("../characters").killCharacter;

describe("Character Storage", () => {
  const userId1 = "test-user-1";
  const userId2 = "test-user-2";

  beforeEach(async () => {
    // Create isolated temp directory for each test
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "character-storage-test-"));
    process.env.CHARACTER_DATA_DIR = testDir;

    // Reset module cache so characters.ts picks up the new env var
    vi.resetModules();
    const chars = await import("../characters");
    getCharacter = chars.getCharacter;
    getUserCharacters = chars.getUserCharacters;
    getAllCharacters = chars.getAllCharacters;
    getCharactersByStatus = chars.getCharactersByStatus;
    getDraftCharacters = chars.getDraftCharacters;
    getActiveCharacters = chars.getActiveCharacters;
    getCharactersByEdition = chars.getCharactersByEdition;
    getCharactersByCampaign = chars.getCharactersByCampaign;
    createCharacterDraft = chars.createCharacterDraft;
    updateCharacter = chars.updateCharacter;
    finalizeCharacter = chars.finalizeCharacter;
    deleteCharacter = chars.deleteCharacter;
    updateCharacterAttributes = chars.updateCharacterAttributes;
    updateCharacterSkills = chars.updateCharacterSkills;
    updateCharacterQualities = chars.updateCharacterQualities;
    updateCharacterGear = chars.updateCharacterGear;
    applyDamage = chars.applyDamage;
    healCharacter = chars.healCharacter;
    spendKarma = chars.spendKarma;
    awardKarma = chars.awardKarma;
    setCharacterCampaign = chars.setCharacterCampaign;
    retireCharacter = chars.retireCharacter;
    killCharacter = chars.killCharacter;
  });

  afterEach(async () => {
    delete process.env.CHARACTER_DATA_DIR;
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("createCharacterDraft", () => {
    it("should create a new character draft", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Test Character");

      expect(draft.id).toBeDefined();
      expect(draft.ownerId).toBe(userId1);
      expect(draft.name).toBe("Test Character");
      expect(draft.status).toBe("draft");
      expect(draft.editionCode).toBe("sr5");
      expect(draft.attributes).toEqual({});
      expect(draft.skills).toEqual({});
      expect(draft.createdAt).toBeDefined();
      expect(draft.updatedAt).toBeDefined();
    });

    it("should use default name if not provided", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");

      expect(draft.name).toBe("Unnamed Character");
    });

    it("should initialize default values", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");

      expect(draft.specialAttributes?.edge).toBe(0);
      expect(draft.specialAttributes?.essence).toBe(6);
      expect(draft.magicalPath).toBe("mundane");
      expect(draft.nuyen).toBe(0);
      expect(draft.karmaCurrent).toBe(0);
      expect(draft.condition?.physicalDamage).toBe(0);
      expect(draft.condition?.stunDamage).toBe(0);
    });
  });

  describe("getCharacter", () => {
    it("should retrieve character by ID", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Test");
      const retrieved = await getCharacter(userId1, draft.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(draft.id);
      expect(retrieved?.name).toBe("Test");
    });

    it("should return null for non-existent character", async () => {
      const result = await getCharacter(userId1, "nonexistent-id");
      expect(result).toBeNull();
    });

    it("should not retrieve characters from other users", async () => {
      const draft = await createCharacterDraft(
        userId1,
        "sr5",
        "sr5",
        "priority",
        "User1 Character"
      );
      const result = await getCharacter(userId2, draft.id);

      expect(result).toBeNull();
    });
  });

  describe("getUserCharacters", () => {
    it("should return all characters for a user", async () => {
      const char1 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Char1");
      const char2 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Char2");

      const characters = await getUserCharacters(userId1);

      expect(characters.length).toBe(2);
      expect(characters.map((c) => c.id)).toContain(char1.id);
      expect(characters.map((c) => c.id)).toContain(char2.id);
    });

    it("should return empty array for user with no characters", async () => {
      const characters = await getUserCharacters("nonexistent-user");
      expect(characters).toEqual([]);
    });

    it("should only return characters for specified user", async () => {
      await createCharacterDraft(userId1, "sr5", "sr5", "priority", "User1");
      await createCharacterDraft(userId2, "sr5", "sr5", "priority", "User2");

      const user1Chars = await getUserCharacters(userId1);
      const user2Chars = await getUserCharacters(userId2);

      expect(user1Chars.length).toBe(1);
      expect(user1Chars[0].name).toBe("User1");
      expect(user2Chars.length).toBe(1);
      expect(user2Chars[0].name).toBe("User2");
    });
  });

  describe("getCharactersByStatus", () => {
    it("should filter characters by status", async () => {
      const draft1 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Draft1");
      const draft2 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Draft2");
      await finalizeCharacter(userId1, draft1.id);

      const drafts = await getCharactersByStatus(userId1, "draft");
      const active = await getCharactersByStatus(userId1, "active");

      expect(drafts.length).toBe(1);
      expect(drafts[0].id).toBe(draft2.id);
      expect(drafts[0].status).toBe("draft");
      expect(active.length).toBe(1);
      expect(active[0].id).toBe(draft1.id);
      expect(active[0].status).toBe("active");
    });
  });

  describe("getDraftCharacters and getActiveCharacters", () => {
    it("should return draft characters", async () => {
      const draft1 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Draft");
      const draft2 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Draft2");
      await finalizeCharacter(userId1, draft2.id);

      const drafts = await getDraftCharacters(userId1);
      expect(drafts.length).toBe(1);
      expect(drafts[0].id).toBe(draft1.id);
      expect(drafts[0].status).toBe("draft");
    });

    it("should return active characters", async () => {
      const char = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Active");
      await finalizeCharacter(userId1, char.id);

      const active = await getActiveCharacters(userId1);
      expect(active.length).toBe(1);
      expect(active[0].id).toBe(char.id);
      expect(active[0].status).toBe("active");
    });
  });

  describe("getCharactersByEdition", () => {
    it("should filter characters by edition", async () => {
      await createCharacterDraft(userId1, "sr5", "sr5", "priority", "SR5 Char");
      await createCharacterDraft(userId1, "sr6", "sr6", "priority", "SR6 Char");

      const sr5Chars = await getCharactersByEdition(userId1, "sr5");
      const sr6Chars = await getCharactersByEdition(userId1, "sr6");

      expect(sr5Chars.length).toBe(1);
      expect(sr5Chars[0].editionCode).toBe("sr5");
      expect(sr6Chars.length).toBe(1);
      expect(sr6Chars[0].editionCode).toBe("sr6");
    });
  });

  describe("getCharactersByCampaign", () => {
    it("should filter characters by campaign", async () => {
      const char1 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Char1");
      const char2 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Char2");
      const campaignId = "campaign-1";

      await setCharacterCampaign(userId1, char1.id, campaignId);
      await setCharacterCampaign(userId1, char2.id, campaignId);

      const campaignChars = await getCharactersByCampaign(userId1, campaignId);
      expect(campaignChars.length).toBe(2);
    });
  });

  describe("updateCharacter", () => {
    it("should update character fields", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "Original");

      // Small delay to ensure updatedAt timestamp differs
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await updateCharacter(userId1, draft.id, {
        name: "Updated",
        metatype: "Elf",
      });

      expect(updated.name).toBe("Updated");
      expect(updated.metatype).toBe("Elf");
      expect(updated.updatedAt).not.toBe(draft.updatedAt);
    });

    it("should preserve ID and ownerId", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const updated = await updateCharacter(userId1, draft.id, {
        id: "new-id",
        ownerId: "new-owner",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      expect(updated.id).toBe(draft.id);
      expect(updated.ownerId).toBe(userId1);
    });

    it("should throw error for non-existent character", async () => {
      await expect(updateCharacter(userId1, "nonexistent", { name: "Test" })).rejects.toThrow();
    });
  });

  describe("finalizeCharacter", () => {
    it("should change status from draft to active", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const finalized = await finalizeCharacter(userId1, draft.id);

      expect(finalized.status).toBe("active");
    });

    it("should throw error if character is not a draft", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      await finalizeCharacter(userId1, draft.id);

      await expect(finalizeCharacter(userId1, draft.id)).rejects.toThrow("not a draft");
    });
  });

  describe("deleteCharacter", () => {
    it("should delete character", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const deleted = await deleteCharacter(userId1, draft.id);

      expect(deleted).toBe(true);
      const retrieved = await getCharacter(userId1, draft.id);
      expect(retrieved).toBeNull();
    });

    it("should return false for non-existent character", async () => {
      const result = await deleteCharacter(userId1, "nonexistent");
      expect(result).toBe(false);
    });
  });

  describe("specialized update functions", () => {
    it("should update character attributes", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const updated = await updateCharacterAttributes(userId1, draft.id, {
        body: 4,
        agility: 5,
      });

      expect(updated.attributes.body).toBe(4);
      expect(updated.attributes.agility).toBe(5);
    });

    it("should update character skills", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const updated = await updateCharacterSkills(userId1, draft.id, {
        firearms: 4,
        athletics: 3,
      });

      expect(updated.skills.firearms).toBe(4);
      expect(updated.skills.athletics).toBe(3);
    });

    it("should update character qualities", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const updated = await updateCharacterQualities(
        userId1,
        draft.id,
        [
          { qualityId: "aptitude", source: "creation" },
          { qualityId: "lucky", source: "creation" },
        ],
        [{ qualityId: "allergy", source: "creation" }]
      );

      expect(updated.positiveQualities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ qualityId: "aptitude" }),
          expect.objectContaining({ qualityId: "lucky" }),
        ])
      );
      expect(updated.negativeQualities).toEqual(
        expect.arrayContaining([expect.objectContaining({ qualityId: "allergy" })])
      );
    });

    it("should update character gear and nuyen", async () => {
      const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
      const gear = [{ id: "gun-1", name: "Pistol", cost: 500, quantity: 1, category: "Gear" }];
      const updated = await updateCharacterGear(userId1, draft.id, gear, 1000);

      expect(updated.gear).toEqual(gear);
      expect(updated.nuyen).toBe(1000);
    });
  });

  describe("gameplay functions", () => {
    describe("applyDamage", () => {
      it("should add physical and stun damage", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        const updated = await applyDamage(userId1, draft.id, 2, 1);

        expect(updated.condition.physicalDamage).toBe(2);
        expect(updated.condition.stunDamage).toBe(1);
      });

      it("should accumulate damage", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await applyDamage(userId1, draft.id, 1, 1);
        const updated = await applyDamage(userId1, draft.id, 2, 1);

        expect(updated.condition.physicalDamage).toBe(3);
        expect(updated.condition.stunDamage).toBe(2);
      });
    });

    describe("healCharacter", () => {
      it("should reduce damage", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await applyDamage(userId1, draft.id, 5, 3);
        const healed = await healCharacter(userId1, draft.id, 2, 1);

        expect(healed.condition.physicalDamage).toBe(3);
        expect(healed.condition.stunDamage).toBe(2);
      });

      it("should not go below zero", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await applyDamage(userId1, draft.id, 2, 1);
        const healed = await healCharacter(userId1, draft.id, 5, 5);

        expect(healed.condition.physicalDamage).toBe(0);
        expect(healed.condition.stunDamage).toBe(0);
      });
    });

    describe("spendKarma", () => {
      it("should reduce karma current", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await awardKarma(userId1, draft.id, 10);
        const updated = await spendKarma(userId1, draft.id, 5);

        expect(updated.karmaCurrent).toBe(5);
        expect(updated.karmaTotal).toBe(10);
      });

      it("should throw error if not enough karma", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await awardKarma(userId1, draft.id, 5);

        await expect(spendKarma(userId1, draft.id, 10)).rejects.toThrow("Not enough karma");
      });
    });

    describe("awardKarma", () => {
      it("should increase karma current and total", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        const updated = await awardKarma(userId1, draft.id, 5);

        expect(updated.karmaCurrent).toBe(5);
        expect(updated.karmaTotal).toBe(5);
      });

      it("should accumulate karma", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await awardKarma(userId1, draft.id, 5);
        const updated = await awardKarma(userId1, draft.id, 3);

        expect(updated.karmaCurrent).toBe(8);
        expect(updated.karmaTotal).toBe(8);
      });
    });

    describe("setCharacterCampaign", () => {
      it("should set campaign ID", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        const campaignId = "campaign-1";
        const updated = await setCharacterCampaign(userId1, draft.id, campaignId);

        expect(updated.campaignId).toBe(campaignId);
      });

      it("should clear campaign when set to null", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await setCharacterCampaign(userId1, draft.id, "campaign-1");
        const updated = await setCharacterCampaign(userId1, draft.id, null);

        expect(updated.campaignId).toBeUndefined();
      });
    });

    describe("retireCharacter", () => {
      it("should change status to retired", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await finalizeCharacter(userId1, draft.id);
        const retired = await retireCharacter(userId1, draft.id);

        expect(retired.status).toBe("retired");
      });
    });

    describe("killCharacter", () => {
      it("should change status to deceased", async () => {
        const draft = await createCharacterDraft(userId1, "sr5", "sr5", "priority");
        await finalizeCharacter(userId1, draft.id);
        const killed = await killCharacter(userId1, draft.id);

        expect(killed.status).toBe("deceased");
      });
    });
  });

  describe("getAllCharacters", () => {
    it("should return all characters across all users", async () => {
      const char1 = await createCharacterDraft(userId1, "sr5", "sr5", "priority", "User1");
      const char2 = await createCharacterDraft(userId2, "sr5", "sr5", "priority", "User2");

      const all = await getAllCharacters();
      expect(all.length).toBe(2);
      expect(all.find((c) => c.id === char1.id)).toBeDefined();
      expect(all.find((c) => c.id === char2.id)).toBeDefined();
      expect(all.find((c) => c.id === char1.id)?.name).toBe("User1");
      expect(all.find((c) => c.id === char2.id)?.name).toBe("User2");
    });
  });
});
