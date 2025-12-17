/**
 * Campaign storage layer
 *
 * File-based storage for campaigns in data/campaigns/{id}.json
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Campaign, CreateCampaignRequest, ID } from "../types";
import { getEdition } from "./editions";

const DATA_DIR = path.join(process.cwd(), "data", "campaigns");

/**
 * Ensures the data directory exists, creating it if necessary
 */
async function ensureDataDirectory(): Promise<void> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
            throw error;
        }
    }
}

/**
 * Get the file path for a campaign by ID
 */
function getCampaignFilePath(campaignId: string): string {
    return path.join(DATA_DIR, `${campaignId}.json`);
}

/**
 * Generate a random invite code
 */
function generateInviteCode(): string {
    return uuidv4().slice(0, 8).toUpperCase();
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
        const filePath = getCampaignFilePath(campaignId);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent) as Campaign;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return null;
        }
        throw error;
    }
}

/**
 * Get all campaigns
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
    try {
        await ensureDataDirectory();
        const files = await fs.readdir(DATA_DIR);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));

        const campaigns: Campaign[] = [];
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(DATA_DIR, file);
                const fileContent = await fs.readFile(filePath, "utf-8");
                const campaign = JSON.parse(fileContent) as Campaign;
                campaigns.push(campaign);
            } catch (error) {
                console.error(`Error reading campaign file ${file}:`, error);
            }
        }
        return campaigns;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Get campaigns by user ID (as GM or player)
 */
export async function getCampaignsByUserId(userId: ID): Promise<Campaign[]> {
    const allCampaigns = await getAllCampaigns();
    return allCampaigns.filter(
        (campaign) => campaign.gmId === userId || campaign.playerIds.includes(userId)
    );
}

/**
 * Get campaigns where user is GM
 */
export async function getCampaignsByGmId(gmId: ID): Promise<Campaign[]> {
    const allCampaigns = await getAllCampaigns();
    return allCampaigns.filter((campaign) => campaign.gmId === gmId);
}

/**
 * Get public campaigns (for discovery)
 */
export async function getPublicCampaigns(): Promise<Campaign[]> {
    const allCampaigns = await getAllCampaigns();
    return allCampaigns.filter(
        (campaign) => campaign.visibility === "public" && campaign.status === "active"
    );
}

/**
 * Get campaign by invite code
 */
export async function getCampaignByInviteCode(inviteCode: string): Promise<Campaign | null> {
    const allCampaigns = await getAllCampaigns();
    return allCampaigns.find(
        (campaign) => campaign.inviteCode?.toUpperCase() === inviteCode.toUpperCase()
    ) || null;
}

/**
 * Create a new campaign
 */
export async function createCampaign(
    gmId: ID,
    data: CreateCampaignRequest
): Promise<Campaign> {
    await ensureDataDirectory();

    // Get edition to get editionId
    const edition = await getEdition(data.editionCode);
    if (!edition) {
        throw new Error(`Edition not found: ${data.editionCode}`);
    }

    const now = new Date().toISOString();
    const campaign: Campaign = {
        id: uuidv4(),
        gmId,
        title: data.title,
        description: data.description,
        status: "active",
        editionId: edition.id,
        editionCode: data.editionCode,
        enabledBookIds: data.enabledBookIds,
        enabledCreationMethodIds: data.enabledCreationMethodIds,
        gameplayLevel: data.gameplayLevel,
        enabledOptionalRules: data.enabledOptionalRules,
        houseRules: data.houseRules,
        playerIds: [],
        visibility: data.visibility,
        inviteCode: data.visibility === "invite-only" || data.visibility === "private"
            ? generateInviteCode()
            : undefined,
        maxPlayers: data.maxPlayers,
        createdAt: now,
        updatedAt: now,
    };

    // Atomic write
    const filePath = getCampaignFilePath(campaign.id);
    const tempFilePath = `${filePath}.tmp`;

    try {
        await fs.writeFile(tempFilePath, JSON.stringify(campaign, null, 2), "utf-8");
        await fs.rename(tempFilePath, filePath);
    } catch (error) {
        try {
            await fs.unlink(tempFilePath);
        } catch {
            // Ignore cleanup errors
        }
        throw error;
    }

    return campaign;
}

/**
 * Update a campaign
 */
export async function updateCampaign(
    campaignId: string,
    updates: Partial<Campaign>
): Promise<Campaign> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    const updatedCampaign: Campaign = {
        ...campaign,
        ...updates,
        id: campaign.id, // Ensure ID cannot be changed
        gmId: campaign.gmId, // Ensure GM cannot be changed
        editionId: campaign.editionId, // Ensure edition cannot be changed
        editionCode: campaign.editionCode,
        createdAt: campaign.createdAt,
        updatedAt: new Date().toISOString(),
    };

    // Atomic write
    const filePath = getCampaignFilePath(campaignId);
    const tempFilePath = `${filePath}.tmp`;

    try {
        await fs.writeFile(tempFilePath, JSON.stringify(updatedCampaign, null, 2), "utf-8");
        await fs.rename(tempFilePath, filePath);
    } catch (error) {
        try {
            await fs.unlink(tempFilePath);
        } catch {
            // Ignore cleanup errors
        }
        throw error;
    }

    return updatedCampaign;
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(campaignId: string): Promise<void> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    const filePath = getCampaignFilePath(campaignId);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
        }
    }
}

/**
 * Add a player to a campaign
 */
export async function addPlayerToCampaign(campaignId: string, userId: ID): Promise<Campaign> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    if (campaign.playerIds.includes(userId)) {
        return campaign; // Already a member
    }

    if (campaign.maxPlayers && campaign.playerIds.length >= campaign.maxPlayers) {
        throw new Error("Campaign has reached maximum player limit");
    }

    return updateCampaign(campaignId, {
        playerIds: [...campaign.playerIds, userId],
    });
}

/**
 * Remove a player from a campaign
 */
export async function removePlayerFromCampaign(campaignId: string, userId: ID): Promise<Campaign> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    return updateCampaign(campaignId, {
        playerIds: campaign.playerIds.filter((id) => id !== userId),
    });
}

/**
 * Check if a user is a player in a campaign
 */
export async function isPlayerInCampaign(campaignId: string, userId: ID): Promise<boolean> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        return false;
    }
    return campaign.playerIds.includes(userId);
}

/**
 * Regenerate invite code for a campaign
 */
export async function regenerateInviteCode(campaignId: string): Promise<Campaign> {
    return updateCampaign(campaignId, {
        inviteCode: generateInviteCode(),
    });
}
