/**
 * Campaign type definitions
 * 
 * Types for campaign support feature - enabling GMs to create campaigns
 * with ruleset constraints and players to join and create characters.
 */

import type { ID, ISODateString, Metadata } from "./core";
import type { EditionCode } from "./edition";

/**
 * Campaign visibility levels
 */
export type CampaignVisibility = "private" | "invite-only" | "public";

/**
 * Gameplay level affects starting resources and restrictions
 */
export type GameplayLevel = "street" | "experienced" | "prime-runner";

/**
 * Campaign status
 */
export type CampaignStatus = "active" | "paused" | "archived" | "completed";

/**
 * Configuration for character advancement in a campaign
 */
export interface CampaignAdvancementSettings {
    /** Multiplier for training times (default: 1.0) */
    trainingTimeMultiplier: number;
    
    /** Karma multiplier for attribute advancement (new rating x multiplier, default: 5) */
    attributeKarmaMultiplier: number;
    
    /** Karma multiplier for active skill advancement (new rating x multiplier, default: 2) */
    skillKarmaMultiplier: number;
    
    /** Karma multiplier for skill group advancement (new rating x multiplier, default: 5) */
    skillGroupKarmaMultiplier: number;
    
    /** Karma multiplier for knowledge/language skill advancement (new rating x multiplier, default: 1) */
    knowledgeSkillKarmaMultiplier: number;
    
    /** Fixed karma cost for specializations (default: 7) */
    specializationKarmaCost: number;
    
    /** Fixed karma cost for spells/rituals (default: 5) */
    spellKarmaCost: number;
    
    /** Fixed karma cost for complex forms (default: 4) */
    complexFormKarmaCost: number;

    /** Maximum rating for physical/mental attributes (default: 10) */
    attributeRatingCap: number;

    /** Maximum rating for active skills (default: 13) */
    skillRatingCap: number;

    /** Whether training time requirement is skipped (default: false) */
    allowInstantAdvancement: boolean;

    /** Whether GM approval is required for all advancements (default: true) */
    requireApproval: boolean;
}

/**
 * A Shadowrun campaign managed by a GM
 */
export interface Campaign {
    id: ID;

    /** GM user ID (campaign creator/owner) */
    gmId: ID;

    /** Campaign title */
    title: string;

    /** Campaign description/narrative */
    description?: string;

    /** Campaign status */
    status: CampaignStatus;

    // -------------------------------------------------------------------------
    // Ruleset Configuration
    // -------------------------------------------------------------------------

    /** Edition this campaign uses */
    editionId: ID;
    editionCode: EditionCode;

    /** Books/sourcebooks enabled for this campaign */
    enabledBookIds: ID[];

    /** Creation methods allowed for character creation */
    enabledCreationMethodIds: ID[];

    /** Gameplay level (Street, Experienced, Prime Runner) */
    gameplayLevel: GameplayLevel;

    /** Optional rules enabled (e.g., "wireless bonuses", "alternate init") */
    enabledOptionalRules?: string[];

    /**
     * Structured optional rules configuration (GM-controlled).
     * Takes precedence over enabledOptionalRules when present.
     *
     * @see docs/capabilities/ruleset.integrity.md
     */
    optionalRules?: {
        /** IDs of rules explicitly enabled (overrides defaultEnabled: false) */
        enabledRuleIds: string[];
        /** IDs of rules explicitly disabled (overrides defaultEnabled: true) */
        disabledRuleIds: string[];
    };

    /** House rules (freeform text or structured JSON) */
    houseRules?: string | Record<string, unknown>;

    /** Advancement and training rules for this campaign */
    advancementSettings: CampaignAdvancementSettings;

    // -------------------------------------------------------------------------
    // Roster & Access
    // -------------------------------------------------------------------------

    /** Player user IDs (excluding GM) */
    playerIds: ID[];

    /** Campaign visibility */
    visibility: CampaignVisibility;

    /** Invite code for join-by-code (generated if visibility is "invite-only") */
    inviteCode?: string;

    /** Maximum number of players (null = unlimited) */
    maxPlayers?: number;

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    /** Campaign start date (first session) */
    startDate?: ISODateString;

    /** Campaign end date (if completed/archived) */
    endDate?: ISODateString;

    /** Campaign image/logo URL */
    imageUrl?: string;

    /** Tags/categories for discoverability */
    tags?: string[];

    /** GM-only notes */
    gmNotes?: string;

    /** Campaign notes/journal entries */
    notes?: CampaignNote[];

    /** Campaign sessions (scheduled and completed) */
    sessions?: CampaignSession[];

    /** Campaign bulletin board posts */
    posts?: CampaignPost[];

    /** Campaign calendar events */
    events?: CampaignEvent[];

    createdAt: ISODateString;
    updatedAt: ISODateString;

    /** Extensible metadata */
    metadata?: Metadata;
}

/**
 * Campaign Template (Reusable Configuration)
 */
export interface CampaignTemplate {
    id: ID;
    name: string;
    description?: string;
    editionCode: EditionCode;
    enabledBookIds: ID[];
    enabledCreationMethodIds: ID[];
    gameplayLevel: GameplayLevel;
    enabledOptionalRules?: string[];
    houseRules?: string | Record<string, unknown>;
    createdBy: ID; // User who created the template
    isPublic: boolean; // If true, other GMs can use this template
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Player membership in a campaign
 */
export interface CampaignMembership {
    id: ID;
    campaignId: ID;
    userId: ID;
    role: "gm" | "player";
    joinedAt: ISODateString;
    status: "active" | "invited" | "left";
    /** Optional player-specific notes from GM */
    notes?: string;
}

/**
 * A note or journal entry in a campaign (GM-only by default)
 */
export interface CampaignNote {
    id: ID;
    /** Note title */
    title: string;
    /** Note content (markdown supported) */
    content: string;
    /** Note category for organization */
    category?: "general" | "session" | "npc" | "location" | "plot" | "rules";
    /** Whether players can view this note */
    playerVisible: boolean;
    /** Author user ID */
    authorId: ID;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * A scheduled or completed session
 */
export interface CampaignSession {
    id: ID;
    /** Session title/name */
    title: string;
    /** Session date and time */
    scheduledAt: ISODateString;
    /** Session duration in minutes */
    durationMinutes?: number;
    /** Session status */
    status: "scheduled" | "completed" | "cancelled";
    /** Users (players) who attended/will attend */
    attendeeIds: ID[];
    /** Characters that participated (for reward distribution) */
    participantCharacterIds?: ID[];
    /** Session recap/summary (visible to all) */
    recap?: string;
    /** Internal GM-only session notes */
    gmSessionNotes?: string;
    /** Public session notes/recap (Legacy: use recap instead) */
    notes?: string;
    /** Whether rewards have been distributed for this session */
    rewardsDistributed?: boolean;
    /** Karma awarded this session per participant */
    karmaAwarded?: number;
    /** Nuyen awarded this session per participant */
    nuyenAwarded?: number;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Data for distributing session rewards
 */
export interface SessionRewardData {
    participantCharacterIds: ID[];
    karmaAward: number;
    nuyenAward: number;
    recap?: string;
    distributeRewards: boolean;
}

/**
 * A bulletin board post
 */
export interface CampaignPost {
    id: ID;
    title: string;
    content: string;
    authorId: ID; // Usually GM for "announcements", but could be players for "rumors"
    createdAt: ISODateString;
    updatedAt: ISODateString;
    isPinned: boolean;
    type: "announcement" | "rumor" | "general";
    /** Whether players can view this post */
    playerVisible?: boolean;
}

/**
 * A calendar event (distinct from Session, more detailed)
 */
export interface CampaignEvent {
    id: ID;
    title: string;
    description?: string;
    date: ISODateString;
    type: "session" | "deadline" | "downtime" | "other";
    /** Whether players can view this event */
    playerVisible?: boolean;
    createdBy: ID;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/**
 * Activity types for the campaign feed
 */
export type CampaignActivityType =
    | "player_joined"
    | "player_left"
    | "character_created"
    | "character_approved"
    | "character_rejected"
    | "character_retired"
    | "session_scheduled"
    | "session_completed"
    | "karma_awarded"
    | "advancement_approved"
    | "advancement_rejected"
    | "post_created"
    | "campaign_updated"
    | "location_added"
    | "location_updated"
    // Grunt team activities
    | "grunt_team_created"
    | "grunt_team_updated"
    | "grunt_team_deleted"
    | "grunt_casualties"
    | "grunt_morale_break"
    | "grunt_morale_rally";

/**
 * Campaign activity feed entry
 */
export interface CampaignActivityEvent {
    id: ID;
    campaignId: ID;
    type: CampaignActivityType;

    /** User who triggered the activity */
    actorId: ID;

    /** Target of the activity (character, player, session, etc.) */
    targetId?: ID;
    targetType?: "character" | "player" | "session" | "post" | "location" | "campaign" | "grunt_team";
    targetName?: string;

    /** Human-readable description */
    description: string;

    /** Additional metadata */
    metadata?: Record<string, unknown>;

    timestamp: ISODateString;
}

/**
 * Notification types
 */
export type NotificationType =
    | "campaign_invite"
    | "campaign_join_request"
    | "session_reminder"
    | "session_cancelled"
    | "character_approval_requested"
    | "character_approved"
    | "character_rejected"
    | "advancement_approval_requested"
    | "advancement_approved"
    | "advancement_rejected"
    | "karma_awarded"
    | "post_created"
    | "mentioned";

/**
 * User notification
 */
export interface CampaignNotification {
    id: ID;
    userId: ID;
    campaignId: ID;
    type: NotificationType;

    /** Notification title */
    title: string;

    /** Notification message */
    message: string;

    /** Link to relevant page */
    actionUrl?: string;

    /** Whether the notification has been read */
    read: boolean;

    /** Whether the notification has been dismissed */
    dismissed: boolean;

    createdAt: ISODateString;
    readAt?: ISODateString;
}

// -----------------------------------------------------------------------------
// API Request/Response Types
// -----------------------------------------------------------------------------

/**
 * Request to create a new campaign
 */
export interface CreateCampaignRequest {
    title: string;
    description?: string;
    editionCode: EditionCode;
    enabledBookIds: ID[];
    enabledCreationMethodIds: ID[];
    gameplayLevel: GameplayLevel;
    enabledOptionalRules?: string[];
    houseRules?: string | Record<string, unknown>;
    visibility: CampaignVisibility;
    maxPlayers?: number;
    imageUrl?: string;
    startDate?: ISODateString;
    endDate?: ISODateString;
    tags?: string[];
    advancementSettings?: Partial<CampaignAdvancementSettings>;
}

/**
 * Request to update campaign settings
 */
export interface UpdateCampaignRequest {
    title?: string;
    description?: string;
    enabledBookIds?: ID[];
    enabledCreationMethodIds?: ID[];
    gameplayLevel?: GameplayLevel;
    enabledOptionalRules?: string[];
    houseRules?: string | Record<string, unknown>;
    status?: CampaignStatus;
    visibility?: CampaignVisibility;
    maxPlayers?: number;
    imageUrl?: string;
    startDate?: ISODateString;
    endDate?: ISODateString;
    tags?: string[];
    advancementSettings?: Partial<CampaignAdvancementSettings>;
}

/**
 * Response for campaign operations
 */
export interface CampaignResponse {
    success: boolean;
    campaign?: Campaign;
    userRole?: "gm" | "player" | null;
    error?: string;
}

/**
 * Response for campaign list
 */
export interface CampaignsListResponse {
    success: boolean;
    campaigns: Campaign[];
    error?: string;
}

/**
 * Request to join a campaign
 */
export interface JoinCampaignRequest {
    inviteCode?: string;
}
