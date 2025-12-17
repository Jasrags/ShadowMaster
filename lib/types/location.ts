/**
 * Location type definitions
 *
 * Types for campaign locations - enabling GMs to create and manage
 * campaign world locations with hierarchies, visibility, and content linking.
 */

import type { ID, ISODateString, Metadata } from "./core";

// -----------------------------------------------------------------------------
// Location Types
// -----------------------------------------------------------------------------

/**
 * Location type/category
 */
export type LocationType =
    | "physical" // Physical locations (buildings, districts, cities)
    | "matrix-host" // Matrix hosts
    | "astral" // Astral spaces
    | "safe-house" // Safe houses
    | "meeting-place" // Meeting locations
    | "corporate" // Corporate facilities
    | "gang-territory" // Gang territories
    | "residential" // Residential areas
    | "commercial" // Commercial districts
    | "industrial" // Industrial areas
    | "underground" // Underground/undercity locations
    | "other"; // Other/uncategorized

/**
 * Location visibility levels
 */
export type LocationVisibility = "gm-only" | "players" | "public";

/**
 * Connection type between locations
 */
export type LocationConnectionType =
    | "physical"
    | "matrix"
    | "astral"
    | "transport"
    | "related"
    | "other";

// -----------------------------------------------------------------------------
// Location Interface
// -----------------------------------------------------------------------------

/**
 * A location within a campaign world
 */
export interface Location {
    id: ID;

    /** Campaign this location belongs to */
    campaignId: ID;

    /** Location metadata */
    name: string;
    type: LocationType;
    description?: string;

    /** Visibility control */
    visibility: LocationVisibility;

    /** GM-only notes */
    gmNotes?: string;

    /** GM-only content */
    gmOnlyContent?: {
        /** Hidden NPCs at this location */
        npcIds?: ID[];
        /** Hidden grunt teams at this location */
        gruntTeamIds?: ID[];
        /** Hidden encounters at this location */
        encounterIds?: ID[];
        /** Additional GM-only notes */
        notes?: string;
    };

    // ---------------------------------------------------------------------------
    // Physical Properties
    // ---------------------------------------------------------------------------

    /** Physical address or location description */
    address?: string;

    /** Geographic coordinates (optional) */
    coordinates?: {
        latitude: number;
        longitude: number;
    };

    /** District/area this location is in */
    district?: string;

    /** City/metroplex this location is in */
    city?: string;

    /** Country/nation this location is in */
    country?: string;

    // ---------------------------------------------------------------------------
    // Hierarchy & Relationships
    // ---------------------------------------------------------------------------

    /** Parent location (if this is a sub-location) */
    parentLocationId?: ID;

    /** Child locations (sub-locations within this location) */
    childLocationIds?: ID[];

    /** Related/connected locations */
    relatedLocationIds?: ID[];

    /** NPCs associated with this location */
    npcIds?: ID[];

    /** Grunt teams associated with this location */
    gruntTeamIds?: ID[];

    /** Encounters that occurred at this location */
    encounterIds?: ID[];

    /** Sessions that referenced this location */
    sessionIds?: ID[];

    // ---------------------------------------------------------------------------
    // Game Mechanics
    // ---------------------------------------------------------------------------

    /** Security rating (1-10, if applicable) */
    securityRating?: number;

    /** Matrix host details (if Matrix location) */
    matrixHost?: {
        hostRating: number;
        hostType: "public" | "private" | "restricted" | "public-grid";
        ic?: string[]; // IC types present
        patrol?: number; // Patrol IC rating
    };

    /** Astral properties (if astral location) */
    astralProperties?: {
        backgroundCount?: number;
        manaLevel?: "low" | "normal" | "high" | "very-high";
        barrierRating?: number;
    };

    /** Location-specific modifiers or rules */
    modifiers?: Record<string, unknown>;

    // ---------------------------------------------------------------------------
    // Media & References
    // ---------------------------------------------------------------------------

    /** Location image URL */
    imageUrl?: string;

    /** Additional images */
    images?: string[];

    /** Map image URL */
    mapUrl?: string;

    /** External references (sourcebook pages, etc.) */
    references?: Array<{
        source: string;
        page?: number;
        note?: string;
    }>;

    // ---------------------------------------------------------------------------
    // Tags & Organization
    // ---------------------------------------------------------------------------

    /** Tags for categorization and search */
    tags?: string[];

    /** Custom fields (extensible) */
    customFields?: Record<string, unknown>;

    // ---------------------------------------------------------------------------
    // History & Tracking
    // ---------------------------------------------------------------------------

    /** When this location was first created */
    createdAt: ISODateString;

    /** When this location was last updated */
    updatedAt?: ISODateString;

    /** When this location was first visited (in-game) */
    firstVisitedAt?: ISODateString;

    /** When this location was last visited (in-game) */
    lastVisitedAt?: ISODateString;

    /** Characters who have visited this location */
    visitedByCharacterIds?: ID[];

    /** Visit count */
    visitCount?: number;

    /** Extensible metadata */
    metadata?: Metadata;
}

/**
 * A connection or relationship between locations
 */
export interface LocationConnection {
    id: ID;
    fromLocationId: ID;
    toLocationId: ID;
    connectionType: LocationConnectionType;
    description?: string;
    bidirectional: boolean;
    metadata?: Record<string, unknown>;
}

/**
 * A reusable location template
 */
export interface LocationTemplate {
    id: ID;

    /** Template creator (user ID) */
    createdBy: ID;

    /** Template name */
    name: string;

    /** Template description */
    description?: string;

    /** Template type */
    type: LocationType;

    /** Template data (location structure without campaign-specific IDs) */
    templateData: Omit<Location, "id" | "campaignId" | "createdAt" | "updatedAt" | "npcIds" | "gruntTeamIds" | "encounterIds" | "sessionIds" | "visitedByCharacterIds" | "parentLocationId" | "childLocationIds" | "relatedLocationIds">;

    /** Template tags */
    tags?: string[];

    /** Is this template public (shared) or private */
    isPublic: boolean;

    /** Usage count (how many times template has been used) */
    usageCount: number;

    createdAt: ISODateString;
    updatedAt?: ISODateString;
}

/**
 * Request to create a location template
 */
export interface CreateLocationTemplateRequest {
    name: string;
    description?: string;
    type: LocationType;
    templateData: Omit<Location, "id" | "campaignId" | "createdAt" | "updatedAt" | "npcIds" | "gruntTeamIds" | "encounterIds" | "sessionIds" | "visitedByCharacterIds" | "parentLocationId" | "childLocationIds" | "relatedLocationIds">;
    tags?: string[];
    isPublic: boolean;
}

/**
 * Filters for querying location templates
 */
export interface LocationTemplateFilters {
    userId?: ID;
    public?: boolean;
    type?: LocationType;
    search?: string;
}

// -----------------------------------------------------------------------------
// API Request/Response Types
// -----------------------------------------------------------------------------

/**
 * Request to create a new location
 */
export interface CreateLocationRequest {
    name: string;
    type: LocationType;
    description?: string;
    visibility: LocationVisibility;
    address?: string;
    coordinates?: { latitude: number; longitude: number };
    district?: string;
    city?: string;
    country?: string;
    parentLocationId?: ID;
    securityRating?: number;
    matrixHost?: Location["matrixHost"];
    astralProperties?: Location["astralProperties"];
    modifiers?: Record<string, unknown>;
    imageUrl?: string;
    images?: string[];
    mapUrl?: string;
    tags?: string[];
    gmNotes?: string;
    customFields?: Record<string, unknown>;
}

/**
 * Request to update a location
 */
export interface UpdateLocationRequest {
    name?: string;
    type?: LocationType;
    description?: string;
    visibility?: LocationVisibility;
    address?: string;
    coordinates?: { latitude: number; longitude: number };
    district?: string;
    city?: string;
    country?: string;
    parentLocationId?: ID | null;
    securityRating?: number;
    matrixHost?: Location["matrixHost"];
    astralProperties?: Location["astralProperties"];
    modifiers?: Record<string, unknown>;
    imageUrl?: string;
    images?: string[];
    mapUrl?: string;
    tags?: string[];
    gmNotes?: string;
    gmOnlyContent?: Location["gmOnlyContent"];
    customFields?: Record<string, unknown>;
}

/**
 * Request to link content to a location
 */
export interface LinkContentRequest {
    type: "npc" | "grunt" | "encounter" | "session";
    targetId: ID;
    hidden?: boolean;
}

/**
 * Request to record a location visit
 */
export interface RecordVisitRequest {
    characterId: ID;
    sessionId?: ID;
    notes?: string;
}

/**
 * Response for location operations
 */
export interface LocationResponse {
    success: boolean;
    location?: Location;
    error?: string;
}

/**
 * Response for location list operations
 */
export interface LocationsListResponse {
    success: boolean;
    locations: Location[];
    error?: string;
}

/**
 * Response for location with related content
 */
export interface LocationDetailResponse {
    success: boolean;
    location?: Location;
    relatedLocations?: Location[];
    userRole?: "gm" | "player" | null;
    error?: string;
}

/**
 * Filters for querying locations
 */
export interface LocationFilters {
    type?: LocationType;
    visibility?: LocationVisibility;
    tags?: string[];
    search?: string;
    parentId?: ID;
    includeChildren?: boolean;
}
