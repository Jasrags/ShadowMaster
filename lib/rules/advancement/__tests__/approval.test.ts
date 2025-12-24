import { describe, it, expect } from "vitest";
import { approveAdvancement, rejectAdvancement } from "../approval";
import type { Character, AdvancementRecord } from "@/lib/types";

describe("Campaign Governance Approval Logic", () => {
    const mockCharacter: Character = {
        id: "char-123",
        ownerId: "user-123",
        name: "Test Character",
        karmaCurrent: 10,
        attributes: { body: 3 },
        advancementHistory: [
            {
                id: "adv-1",
                type: "attribute",
                targetId: "body",
                targetName: "Body",
                newValue: 4,
                karmaCost: 20,
                gmApproved: false,
                trainingStatus: "completed",
                createdAt: new Date().toISOString(),
                karmaSpentAt: new Date().toISOString(),
                trainingRequired: false,
            } as AdvancementRecord
        ],
    } as unknown as Character;

    it("should approve an advancement and apply changes if completed", () => {
        const gmId = "gm-456";
        const result = approveAdvancement(mockCharacter, "adv-1", gmId);

        expect(result.updatedAdvancementRecord.gmApproved).toBe(true);
        expect(result.updatedAdvancementRecord.gmApprovedBy).toBe(gmId);
        expect(result.updatedCharacter.attributes.body).toBe(4);
    });

    it("should reject an advancement and restore resources", () => {
        const gmId = "gm-456";
        const reason = "Too fast";
        const result = rejectAdvancement(mockCharacter, "adv-1", gmId, reason);

        expect(result.updatedAdvancementRecord.gmApproved).toBe(false);
        expect(result.updatedAdvancementRecord.rejectionReason).toBe(reason);
        // Initial karma 10 + restored 20 = 30
        expect(result.updatedCharacter.karmaCurrent).toBe(30);
        expect(result.updatedCharacter.attributes.body).toBe(3);
    });

    it("should enforce self-approval restriction", () => {
        const gmId = "user-123"; // Same as character owner
        expect(() => approveAdvancement(mockCharacter, "adv-1", gmId)).toThrow(/Self-approval restriction/);
    });

    it("should require a rejection reason", () => {
        const gmId = "gm-456";
        expect(() => rejectAdvancement(mockCharacter, "adv-1", gmId, "")).toThrow(/Rejection reason is mandatory/);
    });
});
