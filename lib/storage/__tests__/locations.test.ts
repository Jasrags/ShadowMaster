/**
 * Tests for location storage layer
 *
 * Tests location CRUD operations, hierarchy management, content linking, and visit tracking.
 */

import { promises as fs } from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
    createLocation,
    getLocation,
    getLocationsByCampaign,
    getLocationHierarchy,
    updateLocation,
    deleteLocation,
    linkContentToLocation,
    unlinkContentFromLocation,
    recordLocationVisit,
    searchLocations,
} from "../locations";

const TEST_DATA_DIR = path.join(process.cwd(), "__tests__", "temp-locations");

describe("Location Storage", () => {
    // Use unique test campaign IDs with timestamp to avoid conflicts
    const timestamp = Date.now();
    const campaignId1 = `test-campaign-1-${timestamp}`;
    const campaignId2 = `test-campaign-2-${timestamp}`;

    beforeEach(async () => {
        // Ensure test directory is clean before each test
        try {
            await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
        } catch {
            // Ignore
        }
    });

    afterEach(async () => {
        // Clean up test directory
        try {
            await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
            // Also clean up any test locations created in actual data directory
            const campaignDir1 = path.join(
                process.cwd(),
                "data",
                "campaigns",
                campaignId1
            );
            const campaignDir2 = path.join(
                process.cwd(),
                "data",
                "campaigns",
                campaignId2
            );
            await fs.rm(campaignDir1, { recursive: true, force: true });
            await fs.rm(campaignDir2, { recursive: true, force: true });
        } catch {
            // Ignore
        }
    });

    describe("createLocation", () => {
        it("should create a new location", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                description: "A test location",
                visibility: "players",
            });

            expect(location).toBeDefined();
            expect(location.id).toBeDefined();
            expect(location.campaignId).toBe(campaignId1);
            expect(location.name).toBe("Test Location");
            expect(location.type).toBe("physical");
            expect(location.description).toBe("A test location");
            expect(location.visibility).toBe("players");
            expect(location.createdAt).toBeDefined();
            expect(location.updatedAt).toBeDefined();
            expect(location.visitCount).toBe(0);
        });

        it("should create location with all properties", async () => {
            const location = await createLocation(campaignId1, {
                name: "Corporate HQ",
                type: "corporate",
                description: "A megacorporation headquarters",
                visibility: "gm-only",
                address: "123 Corporate Way",
                coordinates: { latitude: 47.6062, longitude: -122.3321 },
                district: "Downtown",
                city: "Seattle",
                country: "UCAS",
                securityRating: 8,
                tags: ["high-security", "corporate"],
                gmNotes: "Secret entrance in the basement",
            });

            expect(location.address).toBe("123 Corporate Way");
            expect(location.coordinates?.latitude).toBe(47.6062);
            expect(location.district).toBe("Downtown");
            expect(location.city).toBe("Seattle");
            expect(location.country).toBe("UCAS");
            expect(location.securityRating).toBe(8);
            expect(location.tags).toContain("high-security");
            expect(location.gmNotes).toBe("Secret entrance in the basement");
        });
    });

    describe("getLocation", () => {
        it("should retrieve location by ID", async () => {
            const created = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const retrieved = await getLocation(campaignId1, created.id);

            expect(retrieved).toBeDefined();
            expect(retrieved?.id).toBe(created.id);
            expect(retrieved?.name).toBe("Test Location");
        });

        it("should return null for non-existent location", async () => {
            const result = await getLocation(campaignId1, "nonexistent-id");
            expect(result).toBeNull();
        });

        it("should not retrieve location from wrong campaign", async () => {
            const created = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const result = await getLocation(campaignId2, created.id);
            expect(result).toBeNull();
        });
    });

    describe("getLocationsByCampaign", () => {
        it("should return all locations for a campaign", async () => {
            await createLocation(campaignId1, {
                name: "Location 1",
                type: "physical",
                visibility: "players",
            });
            await createLocation(campaignId1, {
                name: "Location 2",
                type: "corporate",
                visibility: "gm-only",
            });

            const locations = await getLocationsByCampaign(campaignId1);

            expect(locations.length).toBe(2);
            expect(locations.find((l) => l.name === "Location 1")).toBeDefined();
            expect(locations.find((l) => l.name === "Location 2")).toBeDefined();
        });

        it("should filter by type", async () => {
            await createLocation(campaignId1, {
                name: "Physical Location",
                type: "physical",
                visibility: "players",
            });
            await createLocation(campaignId1, {
                name: "Corporate Location",
                type: "corporate",
                visibility: "players",
            });

            const physicalLocations = await getLocationsByCampaign(campaignId1, {
                type: "physical",
            });

            expect(physicalLocations.length).toBe(1);
            expect(physicalLocations[0].name).toBe("Physical Location");
        });

        it("should filter by visibility", async () => {
            await createLocation(campaignId1, {
                name: "Visible Location",
                type: "physical",
                visibility: "players",
            });
            await createLocation(campaignId1, {
                name: "GM Only Location",
                type: "physical",
                visibility: "gm-only",
            });

            const playerLocations = await getLocationsByCampaign(campaignId1, {
                visibility: "players",
            });

            expect(playerLocations.length).toBe(1);
            expect(playerLocations[0].name).toBe("Visible Location");
        });

        it("should filter by tags", async () => {
            await createLocation(campaignId1, {
                name: "Tagged Location",
                type: "physical",
                visibility: "players",
                tags: ["important", "danger"],
            });
            await createLocation(campaignId1, {
                name: "Untagged Location",
                type: "physical",
                visibility: "players",
            });

            const taggedLocations = await getLocationsByCampaign(campaignId1, {
                tags: ["important"],
            });

            expect(taggedLocations.length).toBe(1);
            expect(taggedLocations[0].name).toBe("Tagged Location");
        });

        it("should return empty array for empty campaign", async () => {
            const uniqueCampaignId = `empty-campaign-${Date.now()}`;
            const locations = await getLocationsByCampaign(uniqueCampaignId);
            expect(locations).toEqual([]);
        });
    });

    describe("updateLocation", () => {
        it("should update location fields", async () => {
            const created = await createLocation(campaignId1, {
                name: "Original Name",
                type: "physical",
                visibility: "players",
            });

            // Small delay to ensure updatedAt differs
            await new Promise((r) => setTimeout(r, 10));

            const updated = await updateLocation(campaignId1, created.id, {
                name: "Updated Name",
                description: "Updated description",
                securityRating: 5,
            });

            expect(updated.name).toBe("Updated Name");
            expect(updated.description).toBe("Updated description");
            expect(updated.securityRating).toBe(5);
            expect(updated.id).toBe(created.id);
            expect(updated.campaignId).toBe(campaignId1);
            expect(new Date(updated.updatedAt!).getTime()).toBeGreaterThan(
                new Date(created.updatedAt!).getTime()
            );
        });

        it("should throw error for non-existent location", async () => {
            await expect(
                updateLocation(campaignId1, "nonexistent", { name: "Test" })
            ).rejects.toThrow();
        });
    });

    describe("deleteLocation", () => {
        it("should delete location", async () => {
            const created = await createLocation(campaignId1, {
                name: "To Delete",
                type: "physical",
                visibility: "players",
            });

            await deleteLocation(campaignId1, created.id);

            const retrieved = await getLocation(campaignId1, created.id);
            expect(retrieved).toBeNull();
        });

        it("should throw error for non-existent location", async () => {
            await expect(deleteLocation(campaignId1, "nonexistent")).rejects.toThrow();
        });
    });

    describe("hierarchy operations", () => {
        it("should create child location under parent", async () => {
            const parent = await createLocation(campaignId1, {
                name: "Parent Location",
                type: "physical",
                visibility: "players",
            });

            const child = await createLocation(campaignId1, {
                name: "Child Location",
                type: "physical",
                visibility: "players",
                parentLocationId: parent.id,
            });

            expect(child.parentLocationId).toBe(parent.id);

            // Verify parent has child in its childLocationIds
            const updatedParent = await getLocation(campaignId1, parent.id);
            expect(updatedParent?.childLocationIds).toContain(child.id);
        });

        it("should get location hierarchy", async () => {
            const parent = await createLocation(campaignId1, {
                name: "Parent",
                type: "physical",
                visibility: "players",
            });

            await createLocation(campaignId1, {
                name: "Child",
                type: "physical",
                visibility: "players",
                parentLocationId: parent.id,
            });

            const topLevel = await getLocationHierarchy(campaignId1);
            expect(topLevel.length).toBe(1);
            expect(topLevel[0].name).toBe("Parent");
        });

        it("should remove child from parent when deleted", async () => {
            const parent = await createLocation(campaignId1, {
                name: "Parent",
                type: "physical",
                visibility: "players",
            });

            const child = await createLocation(campaignId1, {
                name: "Child",
                type: "physical",
                visibility: "players",
                parentLocationId: parent.id,
            });

            await deleteLocation(campaignId1, child.id);

            const updatedParent = await getLocation(campaignId1, parent.id);
            expect(updatedParent?.childLocationIds).not.toContain(child.id);
        });
    });

    describe("linkContentToLocation", () => {
        it("should link NPC to location", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const npcId = "npc-123";
            const updated = await linkContentToLocation(
                campaignId1,
                location.id,
                "npc",
                npcId
            );

            expect(updated.npcIds).toContain(npcId);
        });

        it("should not duplicate linked content", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const npcId = "npc-123";
            await linkContentToLocation(campaignId1, location.id, "npc", npcId);
            const updated = await linkContentToLocation(
                campaignId1,
                location.id,
                "npc",
                npcId
            );

            expect(updated.npcIds?.filter((id) => id === npcId).length).toBe(1);
        });

        it("should link different content types", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            await linkContentToLocation(campaignId1, location.id, "npc", "npc-1");
            await linkContentToLocation(campaignId1, location.id, "grunt", "grunt-1");
            const updated = await linkContentToLocation(
                campaignId1,
                location.id,
                "encounter",
                "encounter-1"
            );

            expect(updated.npcIds).toContain("npc-1");
            expect(updated.gruntTeamIds).toContain("grunt-1");
            expect(updated.encounterIds).toContain("encounter-1");
        });
    });

    describe("unlinkContentFromLocation", () => {
        it("should unlink content from location", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const npcId = "npc-123";
            await linkContentToLocation(campaignId1, location.id, "npc", npcId);
            const updated = await unlinkContentFromLocation(
                campaignId1,
                location.id,
                "npc",
                npcId
            );

            expect(updated.npcIds).not.toContain(npcId);
        });
    });

    describe("recordLocationVisit", () => {
        it("should record visit and update tracking", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            const characterId = "char-123";
            const sessionId = "session-456";

            const updated = await recordLocationVisit(
                campaignId1,
                location.id,
                characterId,
                sessionId
            );

            expect(updated.visitCount).toBe(1);
            expect(updated.visitedByCharacterIds).toContain(characterId);
            expect(updated.sessionIds).toContain(sessionId);
            expect(updated.firstVisitedAt).toBeDefined();
            expect(updated.lastVisitedAt).toBeDefined();
        });

        it("should increment visit count on multiple visits", async () => {
            const location = await createLocation(campaignId1, {
                name: "Test Location",
                type: "physical",
                visibility: "players",
            });

            await recordLocationVisit(campaignId1, location.id, "char-1");
            await recordLocationVisit(campaignId1, location.id, "char-2");
            const updated = await recordLocationVisit(
                campaignId1,
                location.id,
                "char-1"
            );

            expect(updated.visitCount).toBe(3);
            expect(updated.visitedByCharacterIds?.length).toBe(2);
        });
    });

    describe("searchLocations", () => {
        it("should search by name", async () => {
            await createLocation(campaignId1, {
                name: "Downtown Bar",
                type: "physical",
                visibility: "players",
            });
            await createLocation(campaignId1, {
                name: "Corporate Office",
                type: "corporate",
                visibility: "players",
            });

            const results = await searchLocations(campaignId1, "Downtown");

            expect(results.length).toBe(1);
            expect(results[0].name).toBe("Downtown Bar");
        });

        it("should search by description", async () => {
            await createLocation(campaignId1, {
                name: "Mystery Place",
                type: "physical",
                visibility: "players",
                description: "A hidden underground bunker",
            });
            await createLocation(campaignId1, {
                name: "Normal Place",
                type: "physical",
                visibility: "players",
                description: "Just a regular building",
            });

            const results = await searchLocations(campaignId1, "underground");

            expect(results.length).toBe(1);
            expect(results[0].name).toBe("Mystery Place");
        });
    });
});
