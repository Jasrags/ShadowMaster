/**
 * Campaign storage layer
 *
 * File-based storage for campaigns in data/campaigns/{id}.json
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Campaign, CampaignTemplate, CreateCampaignRequest, ID, CampaignPost, CampaignEvent } from "../types";
import type { CampaignAdvancementSettings } from "../types/campaign";
import { getEdition } from "./editions";

const DATA_DIR = path.join(process.cwd(), "data", "campaigns");
const TEMPLATES_DIR = path.join(process.cwd(), "data", "campaign_templates");

/**
 * Ensures the data directory exists, creating it if necessary
 */
async function ensureDataDirectory(): Promise<void> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(TEMPLATES_DIR, { recursive: true });
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
 * Default advancement settings for a new campaign
 */
export function getDefaultAdvancementSettings(): CampaignAdvancementSettings {
    return {
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
    };
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
        const filePath = getCampaignFilePath(campaignId);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const campaign = JSON.parse(fileContent) as Campaign;

        // Populate default settings for older campaigns
        if (!campaign.advancementSettings) {
            campaign.advancementSettings = getDefaultAdvancementSettings();
        }

        return campaign;
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
 * Search public campaigns
 */
export async function searchCampaigns(params: {
    query?: string;
    editionCode?: string;
    gameplayLevel?: string;
    tags?: string[];
}): Promise<Campaign[]> {
    const publicCampaigns = await getPublicCampaigns();

    return publicCampaigns.filter((campaign) => {
        // Text Match
        if (params.query) {
            const q = params.query.toLowerCase();
            const titleMatch = campaign.title.toLowerCase().includes(q);
            const descMatch = campaign.description?.toLowerCase().includes(q) || false;
            // Also search tags text
            const tagMatch = campaign.tags?.some(t => t.toLowerCase().includes(q)) || false;

            if (!titleMatch && !descMatch && !tagMatch) return false;
        }

        // Edition filter
        if (params.editionCode && campaign.editionCode !== params.editionCode) {
            return false;
        }

        // Gameplay Level filter
        if (params.gameplayLevel && campaign.gameplayLevel !== params.gameplayLevel) {
            return false;
        }

        // Tags filter (exact match of selected tags)
        if (params.tags && params.tags.length > 0) {
            if (!campaign.tags || campaign.tags.length === 0) return false;
            const campaignTags = campaign.tags.map(t => t.toLowerCase());
            // Check if every requested tag exists in campaign tags
            const allTagsMatch = params.tags.every(tag => campaignTags.includes(tag.toLowerCase()));
            if (!allTagsMatch) return false;
        }

        return true;
    });
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
        imageUrl: data.imageUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        tags: data.tags,
        advancementSettings: {
            ...getDefaultAdvancementSettings(),
            ...(data.advancementSettings || {}),
        },
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

/**
 * Save a campaign as a template
 */
export async function saveCampaignAsTemplate(
    campaignId: string,
    templateName: string,
    userId: ID
): Promise<CampaignTemplate> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    await ensureDataDirectory();

    const now = new Date().toISOString();
    const template: CampaignTemplate = {
        id: uuidv4(),
        name: templateName,
        description: campaign.description,
        editionCode: campaign.editionCode,
        enabledBookIds: campaign.enabledBookIds,
        enabledCreationMethodIds: campaign.enabledCreationMethodIds,
        gameplayLevel: campaign.gameplayLevel,
        enabledOptionalRules: campaign.enabledOptionalRules,
        houseRules: campaign.houseRules,
        createdBy: userId,
        isPublic: false, // Default to private
        createdAt: now,
        updatedAt: now,
    };

    const filePath = path.join(TEMPLATES_DIR, `${template.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");

    return template;
}

/**
 * Get all available templates (user's own + public)
 */
export async function getCampaignTemplates(userId: ID): Promise<CampaignTemplate[]> {
    try {
        await ensureDataDirectory();

        // Ensure templates dir exists (it might be empty if we just created it)
        try {
            await fs.access(TEMPLATES_DIR);
        } catch {
            await fs.mkdir(TEMPLATES_DIR, { recursive: true });
        }

        const files = await fs.readdir(TEMPLATES_DIR);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));

        const templates: CampaignTemplate[] = [];
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(TEMPLATES_DIR, file);
                const fileContent = await fs.readFile(filePath, "utf-8");
                const template = JSON.parse(fileContent) as CampaignTemplate;

                // Filter: Created by user OR is public
                if (template.createdBy === userId || template.isPublic) {
                    templates.push(template);
                }
            } catch (error) {
                console.error(`Error reading template file ${file}:`, error);
            }
        }
        return templates;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Get campaign posts
 */
export async function getCampaignPosts(campaignId: string): Promise<CampaignPost[]> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    return campaign.posts || [];
}

/**
 * Create a campaign post
 */
export async function createCampaignPost(
    campaignId: string,
    postData: Omit<CampaignPost, "id" | "createdAt" | "updatedAt">
): Promise<CampaignPost> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    const now = new Date().toISOString();
    const newPost: CampaignPost = {
        id: uuidv4(),
        ...postData,
        createdAt: now,
        updatedAt: now,
    };

    const updatedPosts = [newPost, ...(campaign.posts || [])];

    await updateCampaign(campaignId, { posts: updatedPosts });
    return newPost;
}

/**
 * Get campaign events
 */
export async function getCampaignEvents(campaignId: string): Promise<CampaignEvent[]> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    return campaign.events || [];
}

/**
 * Get downtime events from a campaign
 */
export async function getDowntimeEvents(campaignId: string): Promise<CampaignEvent[]> {
    const events = await getCampaignEvents(campaignId);
    return events
        .filter((event) => event.type === "downtime")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get a specific downtime event by ID
 */
export async function getDowntimeEventById(
    campaignId: string,
    downtimeId: string
): Promise<CampaignEvent | null> {
    const events = await getCampaignEvents(campaignId);
    const downtime = events.find(
        (event) => event.type === "downtime" && event.id === downtimeId
    );
    return downtime || null;
}

/**
 * Create a campaign event
 */
export async function createCampaignEvent(
    campaignId: string,
    eventData: Omit<CampaignEvent, "id" | "createdAt" | "updatedAt">
): Promise<CampaignEvent> {
    const campaign = await getCampaignById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    const now = new Date().toISOString();
    const newEvent: CampaignEvent = {
        id: uuidv4(),
        ...eventData,
        createdAt: now,
        updatedAt: now,
    };

    const updatedEvents = [...(campaign.events || []), newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    await updateCampaign(campaignId, { events: updatedEvents });
    return newEvent;
}
