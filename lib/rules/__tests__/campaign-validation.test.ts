import { describe, it, expect } from "vitest";
import { validateCharacterCampaignCompliance } from "../campaign-validation";
import type { Character, Campaign, EditionCode } from "../../types";

describe("campaign-validation", () => {
    const mockCampaign: Campaign = {
        id: "camp-1",
        gmId: "gm-1",
        title: "Test Campaign",
        status: "active",
        editionId: "ed-5",
        editionCode: "sr5",
        enabledBookIds: ["core", "run-faster"],
        enabledCreationMethodIds: ["priority"],
        gameplayLevel: "experienced",
        playerIds: [],
        visibility: "private",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        advancementSettings: {
            trainingTimeMultiplier: 1.0,
            attributeKarmaMultiplier: 5,
            skillKarmaMultiplier: 2,
            skillGroupKarmaMultiplier: 5,
            knowledgeSkillKarmaMultiplier: 1,
            specializationKarmaCost: 7,
            spellKarmaCost: 5,
            complexFormKarmaCost: 4,
            attributeRatingCap: 10,
            skillRatingCap: 13,
            allowInstantAdvancement: false,
            requireApproval: true,
        },
    };

    const mockCharacter: Character = {
        id: "char-1",
        ownerId: "player-1",
        editionId: "ed-5",
        editionCode: "sr5",
        creationMethodId: "priority",
        attachedBookIds: ["core"],
        name: "Test Runner",
        metatype: "Human",
        status: "active",
        attributes: { bod: 3, agi: 3 },
        specialAttributes: { edge: 2, essence: 6 },
        skills: { pistols: 3 },
        positiveQualities: [],
        negativeQualities: [],
        magicalPath: "mundane",
        nuyen: 1000,
        startingNuyen: 1000,
        contacts: [],
        gear: [],
        derivedStats: {},
        condition: { physicalDamage: 0, stunDamage: 0 },
        karmaTotal: 0,
        karmaCurrent: 0,
        karmaSpentAtCreation: 0,
        createdAt: "2024-01-01T00:00:00Z",
    };

    it("should pass when character is compliant", () => {
        const result = validateCharacterCampaignCompliance(mockCharacter, mockCampaign);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it("should fail on edition mismatch", () => {
        const char: Character = { ...mockCharacter, editionCode: "sr6" as EditionCode };
        const result = validateCharacterCampaignCompliance(char, mockCampaign);
        expect(result.valid).toBe(false);
        expect(result.errors[0].constraintId).toBe("campaign-edition-mismatch");
    });

    it("should fail on unauthorized books", () => {
        const char = { ...mockCharacter, attachedBookIds: ["core", "street-grimoire"] };
        const result = validateCharacterCampaignCompliance(char, mockCampaign);
        expect(result.valid).toBe(false);
        expect(result.errors[0].constraintId).toBe("campaign-book-restriction");
    });

    it("should fail on unauthorized creation method", () => {
        const char = { ...mockCharacter, creationMethodId: "sum-to-ten" };
        const result = validateCharacterCampaignCompliance(char, mockCampaign);
        expect(result.valid).toBe(false);
        expect(result.errors[0].constraintId).toBe("campaign-creation-method-restriction");
    });

    it("should fail when attributes exceed campaign cap", () => {
        const campaign = {
            ...mockCampaign,
            advancementSettings: { ...mockCampaign.advancementSettings, attributeRatingCap: 2 }
        };
        const result = validateCharacterCampaignCompliance(mockCharacter, campaign);
        expect(result.valid).toBe(false);
        expect(result.errors[0].constraintId).toBe("campaign-attribute-cap");
    });

    it("should fail when skills exceed campaign cap", () => {
        const campaign = {
            ...mockCampaign,
            advancementSettings: { ...mockCampaign.advancementSettings, skillRatingCap: 2 }
        };
        const result = validateCharacterCampaignCompliance(mockCharacter, campaign);
        expect(result.valid).toBe(false);
        expect(result.errors[0].constraintId).toBe("campaign-skill-cap");
    });
});
