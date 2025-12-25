/**
 * Grunt storage layer
 *
 * File-based storage for grunt teams in data/campaigns/{campaignId}/grunt-teams/{teamId}.json
 *
 * Capability References:
 * - "Modification of NPC attributes and group configurations MUST be restricted to campaign authorities"
 * - "NPC state changes resulting from encounter actions MUST be permanently recorded"
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ID } from "../types";
import type {
  GruntTeam,
  GruntTeamState,
  IndividualGrunt,
  IndividualGrunts,
  GruntSpecialist,
  CreateGruntTeamRequest,
  UpdateGruntTeamRequest,
  ProfessionalRating,
} from "../types/grunts";
import {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  deleteFile,
  listJsonFiles,
  readAllJsonFiles,
} from "./base";

// =============================================================================
// PATH UTILITIES
// =============================================================================

/**
 * Base data directory
 */
const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Get the grunt teams directory for a campaign
 */
function getGruntTeamsDir(campaignId: ID): string {
  return path.join(DATA_DIR, "campaigns", campaignId, "grunt-teams");
}

/**
 * Get the file path for a grunt team
 */
function getGruntTeamPath(campaignId: ID, teamId: ID): string {
  return path.join(getGruntTeamsDir(campaignId), `${teamId}.json`);
}

/**
 * Get the combat state file path for a grunt team
 */
function getCombatStatePath(campaignId: ID, teamId: ID): string {
  return path.join(getGruntTeamsDir(campaignId), `${teamId}.combat.json`);
}

// =============================================================================
// CRUD OPERATIONS
// =============================================================================

/**
 * Create a new grunt team
 *
 * @param campaignId - Campaign this team belongs to
 * @param request - Team creation data
 * @returns Created grunt team
 */
export async function createGruntTeam(
  campaignId: ID,
  request: CreateGruntTeamRequest
): Promise<GruntTeam> {
  const dir = getGruntTeamsDir(campaignId);
  await ensureDirectory(dir);

  const now = new Date().toISOString();
  const teamId = uuidv4();

  // Process specialists to add IDs
  const specialists: GruntSpecialist[] | undefined = request.specialists?.map(
    (spec) => ({
      ...spec,
      id: uuidv4(),
    })
  );

  const team: GruntTeam = {
    id: teamId,
    campaignId,
    encounterId: request.encounterId,
    name: request.name,
    description: request.description,
    professionalRating: request.professionalRating,
    groupEdge: request.professionalRating, // Edge pool = PR
    groupEdgeMax: request.professionalRating,
    baseGrunts: request.baseGrunts!, // API ensures this is populated
    initialSize: request.initialSize,
    lieutenant: request.lieutenant,
    specialists,
    state: {
      activeCount: request.initialSize,
      casualties: 0,
      moraleBroken: false,
    },
    options: request.options,
    visibility: request.visibility ?? { showToPlayers: false },
    createdAt: now,
  };

  const filePath = getGruntTeamPath(campaignId, teamId);
  await writeJsonFile(filePath, team);

  return team;
}

/**
 * Get a grunt team by ID
 *
 * @param teamId - Team ID to retrieve
 * @param campaignId - Optional campaign ID for direct lookup (faster)
 * @returns Grunt team or null if not found
 */
export async function getGruntTeam(
  teamId: ID,
  campaignId?: ID
): Promise<GruntTeam | null> {
  // If campaignId provided, do direct lookup
  if (campaignId) {
    const filePath = getGruntTeamPath(campaignId, teamId);
    return readJsonFile<GruntTeam>(filePath);
  }

  // Otherwise, search all campaigns
  const campaignsDir = path.join(DATA_DIR, "campaigns");
  try {
    const { promises: fs } = await import("fs");
    const campaigns = await fs.readdir(campaignsDir);

    for (const campaign of campaigns) {
      const filePath = getGruntTeamPath(campaign, teamId);
      const team = await readJsonFile<GruntTeam>(filePath);
      if (team) {
        return team;
      }
    }
  } catch {
    // Directory doesn't exist or other error
  }

  return null;
}

/**
 * Update a grunt team
 *
 * @param teamId - Team ID to update
 * @param updates - Partial updates to apply
 * @param campaignId - Optional campaign ID for direct lookup
 * @returns Updated grunt team
 * @throws Error if team not found
 */
export async function updateGruntTeam(
  teamId: ID,
  updates: UpdateGruntTeamRequest,
  campaignId?: ID
): Promise<GruntTeam> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  const updatedTeam: GruntTeam = {
    ...team,
    ...updates,
    // Preserve immutable fields
    id: team.id,
    campaignId: team.campaignId,
    createdAt: team.createdAt,
    updatedAt: new Date().toISOString(),
    // Handle null values for optional fields
    encounterId: updates.encounterId === null ? undefined : (updates.encounterId ?? team.encounterId),
    lieutenant: updates.lieutenant === null ? undefined : (updates.lieutenant ?? team.lieutenant),
    // Merge partial baseGrunts if provided
    baseGrunts: updates.baseGrunts
      ? { ...team.baseGrunts, ...updates.baseGrunts }
      : team.baseGrunts,
  };

  // Recalculate groupEdgeMax if PR changed
  if (updates.professionalRating !== undefined) {
    updatedTeam.groupEdgeMax = updates.professionalRating;
    // Cap current edge to new max
    updatedTeam.groupEdge = Math.min(updatedTeam.groupEdge, updatedTeam.groupEdgeMax);
  }

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  await writeJsonFile(filePath, updatedTeam);

  return updatedTeam;
}

/**
 * Delete a grunt team
 *
 * @param teamId - Team ID to delete
 * @param campaignId - Optional campaign ID for direct lookup
 * @returns True if deleted, false if not found
 */
export async function deleteGruntTeam(
  teamId: ID,
  campaignId?: ID
): Promise<boolean> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    return false;
  }

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  const deleted = await deleteFile(filePath);

  // Also delete combat state file if it exists
  const combatStatePath = getCombatStatePath(team.campaignId, teamId);
  await deleteFile(combatStatePath);

  return deleted;
}

// =============================================================================
// QUERY OPERATIONS
// =============================================================================

/**
 * Get all grunt teams for a campaign
 *
 * @param campaignId - Campaign to query
 * @param options - Optional filters
 * @returns Array of grunt teams
 */
export async function getGruntTeamsByCampaign(
  campaignId: ID,
  options?: {
    professionalRating?: ProfessionalRating;
    search?: string;
    encounterId?: ID;
  }
): Promise<GruntTeam[]> {
  const dir = getGruntTeamsDir(campaignId);
  await ensureDirectory(dir);

  // Read all team files, filtering out combat state files
  const fileIds = await listJsonFiles(dir);
  const teamFileIds = fileIds.filter((id) => !id.endsWith(".combat"));

  const teams: GruntTeam[] = [];
  for (const id of teamFileIds) {
    const filePath = path.join(dir, `${id}.json`);
    const team = await readJsonFile<GruntTeam>(filePath);
    if (team) {
      teams.push(team);
    }
  }

  // Apply filters
  let filtered = teams;

  if (options?.professionalRating !== undefined) {
    filtered = filtered.filter(
      (t) => t.professionalRating === options.professionalRating
    );
  }

  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
    );
  }

  if (options?.encounterId) {
    filtered = filtered.filter((t) => t.encounterId === options.encounterId);
  }

  // Sort by name
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all grunt teams linked to a specific encounter
 *
 * @param encounterId - Encounter to query
 * @param campaignId - Campaign the encounter belongs to
 * @returns Array of grunt teams
 */
export async function getGruntTeamsByEncounter(
  encounterId: ID,
  campaignId: ID
): Promise<GruntTeam[]> {
  return getGruntTeamsByCampaign(campaignId, { encounterId });
}

// =============================================================================
// COMBAT STATE OPERATIONS
// =============================================================================

/**
 * Initialize individual grunt tracking for a team
 *
 * Creates individual grunt records for combat tracking based on team size.
 *
 * @param team - Grunt team to initialize
 * @returns Individual grunts tracking state
 */
export function initializeIndividualGrunts(team: GruntTeam): IndividualGrunts {
  const monitorSize = team.baseGrunts.conditionMonitorSize;

  // Create individual grunt records
  const grunts: Record<ID, IndividualGrunt> = {};
  for (let i = 0; i < team.initialSize; i++) {
    const gruntId = uuidv4();
    grunts[gruntId] = {
      id: gruntId,
      conditionMonitor: new Array(monitorSize).fill(false),
      currentDamage: 0,
      isStunned: false,
      isDead: false,
    };
  }

  // Create lieutenant record if present
  let lieutenant: IndividualGrunt | undefined;
  if (team.lieutenant) {
    const ltMonitorSize = team.lieutenant.conditionMonitorSize;
    lieutenant = {
      id: uuidv4(),
      conditionMonitor: new Array(ltMonitorSize).fill(false),
      currentDamage: 0,
      isStunned: false,
      isDead: false,
    };
  }

  // Create specialist records if present
  let specialists: Record<ID, IndividualGrunt> | undefined;
  if (team.specialists && team.specialists.length > 0) {
    specialists = {};
    for (const spec of team.specialists) {
      // Specialists use base grunt monitor unless modified
      const specMonitorSize =
        spec.statModifications?.attributes?.body !== undefined ||
        spec.statModifications?.attributes?.willpower !== undefined
          ? calculateConditionMonitorSize(
              spec.statModifications?.attributes?.body ?? team.baseGrunts.attributes.body,
              spec.statModifications?.attributes?.willpower ?? team.baseGrunts.attributes.willpower
            )
          : monitorSize;

      specialists[spec.id] = {
        id: spec.id,
        conditionMonitor: new Array(specMonitorSize).fill(false),
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      };
    }
  }

  return { grunts, lieutenant, specialists };
}

/**
 * Calculate condition monitor size from attributes
 * Formula: 8 + ceil(max(Body, Willpower) / 2)
 */
function calculateConditionMonitorSize(body: number, willpower: number): number {
  return 8 + Math.ceil(Math.max(body, willpower) / 2);
}

/**
 * Get individual grunt tracking state for a team
 *
 * @param teamId - Team ID
 * @param campaignId - Campaign ID
 * @returns Individual grunts or null if not initialized
 */
export async function getIndividualGrunts(
  teamId: ID,
  campaignId: ID
): Promise<IndividualGrunts | null> {
  const filePath = getCombatStatePath(campaignId, teamId);
  return readJsonFile<IndividualGrunts>(filePath);
}

/**
 * Save individual grunt tracking state
 *
 * @param teamId - Team ID
 * @param campaignId - Campaign ID
 * @param state - Combat state to save
 */
export async function saveIndividualGrunts(
  teamId: ID,
  campaignId: ID,
  state: IndividualGrunts
): Promise<void> {
  const dir = getGruntTeamsDir(campaignId);
  await ensureDirectory(dir);

  const filePath = getCombatStatePath(campaignId, teamId);
  await writeJsonFile(filePath, state);
}

/**
 * Get or initialize individual grunt tracking
 *
 * @param team - Grunt team
 * @returns Individual grunts (existing or newly initialized)
 */
export async function getOrInitializeIndividualGrunts(
  team: GruntTeam
): Promise<IndividualGrunts> {
  const existing = await getIndividualGrunts(team.id, team.campaignId);
  if (existing) {
    return existing;
  }

  const initialized = initializeIndividualGrunts(team);
  await saveIndividualGrunts(team.id, team.campaignId, initialized);
  return initialized;
}

/**
 * Update a single grunt's combat state
 *
 * @param teamId - Team ID
 * @param campaignId - Campaign ID
 * @param gruntId - Individual grunt ID
 * @param updates - Partial updates to apply
 * @returns Updated individual grunt
 */
export async function updateIndividualGrunt(
  teamId: ID,
  campaignId: ID,
  gruntId: ID,
  updates: Partial<IndividualGrunt>
): Promise<IndividualGrunt> {
  const state = await getIndividualGrunts(teamId, campaignId);
  if (!state) {
    throw new Error(`Combat state not initialized for team ${teamId}`);
  }

  // Find the grunt in grunts, lieutenant, or specialists
  let grunt: IndividualGrunt | undefined;
  let location: "grunts" | "lieutenant" | "specialists" = "grunts";

  if (state.grunts[gruntId]) {
    grunt = state.grunts[gruntId];
    location = "grunts";
  } else if (state.lieutenant?.id === gruntId) {
    grunt = state.lieutenant;
    location = "lieutenant";
  } else if (state.specialists?.[gruntId]) {
    grunt = state.specialists[gruntId];
    location = "specialists";
  }

  if (!grunt) {
    throw new Error(`Grunt ${gruntId} not found in team ${teamId}`);
  }

  // Apply updates
  const updated: IndividualGrunt = {
    ...grunt,
    ...updates,
    id: grunt.id, // Preserve ID
  };

  // Update in correct location
  if (location === "grunts") {
    state.grunts[gruntId] = updated;
  } else if (location === "lieutenant") {
    state.lieutenant = updated;
  } else if (location === "specialists" && state.specialists) {
    state.specialists[gruntId] = updated;
  }

  await saveIndividualGrunts(teamId, campaignId, state);
  return updated;
}

// =============================================================================
// TEAM STATE OPERATIONS
// =============================================================================

/**
 * Update grunt team combat state
 *
 * @param teamId - Team ID
 * @param updates - State updates
 * @param campaignId - Optional campaign ID
 * @returns Updated grunt team
 */
export async function updateGruntTeamState(
  teamId: ID,
  updates: Partial<GruntTeamState>,
  campaignId?: ID
): Promise<GruntTeam> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  const updatedTeam: GruntTeam = {
    ...team,
    state: {
      ...team.state,
      ...updates,
    },
    updatedAt: new Date().toISOString(),
  };

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  await writeJsonFile(filePath, updatedTeam);

  return updatedTeam;
}

/**
 * Spend Group Edge from the team pool
 *
 * @param teamId - Team ID
 * @param amount - Amount of Edge to spend
 * @param campaignId - Optional campaign ID
 * @returns Updated grunt team
 * @throws Error if insufficient Edge
 */
export async function spendGroupEdge(
  teamId: ID,
  amount: number,
  campaignId?: ID
): Promise<GruntTeam> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  if (team.groupEdge < amount) {
    throw new Error(
      `Insufficient Group Edge: have ${team.groupEdge}, need ${amount}`
    );
  }

  const updatedTeam: GruntTeam = {
    ...team,
    groupEdge: team.groupEdge - amount,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  await writeJsonFile(filePath, updatedTeam);

  return updatedTeam;
}

/**
 * Refresh Group Edge to maximum
 *
 * @param teamId - Team ID
 * @param campaignId - Optional campaign ID
 * @returns Updated grunt team
 */
export async function refreshGroupEdge(
  teamId: ID,
  campaignId?: ID
): Promise<GruntTeam> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  const updatedTeam: GruntTeam = {
    ...team,
    groupEdge: team.groupEdgeMax,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  await writeJsonFile(filePath, updatedTeam);

  return updatedTeam;
}

/**
 * Reset combat state for a team (for new encounter)
 *
 * @param teamId - Team ID
 * @param campaignId - Optional campaign ID
 * @returns Updated grunt team with fresh combat state
 */
export async function resetCombatState(
  teamId: ID,
  campaignId?: ID
): Promise<GruntTeam> {
  const team = await getGruntTeam(teamId, campaignId);
  if (!team) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  // Reset team state
  const updatedTeam: GruntTeam = {
    ...team,
    groupEdge: team.groupEdgeMax,
    state: {
      activeCount: team.initialSize,
      casualties: 0,
      moraleBroken: false,
      moraleState: "steady",
    },
    updatedAt: new Date().toISOString(),
  };

  const filePath = getGruntTeamPath(team.campaignId, teamId);
  await writeJsonFile(filePath, updatedTeam);

  // Reinitialize individual grunts
  const individualGrunts = initializeIndividualGrunts(updatedTeam);
  await saveIndividualGrunts(teamId, team.campaignId, individualGrunts);

  return updatedTeam;
}

// =============================================================================
// DUPLICATE/CLONE OPERATIONS
// =============================================================================

/**
 * Duplicate a grunt team (for reuse across encounters)
 *
 * @param teamId - Team ID to duplicate
 * @param newName - Optional new name (defaults to "Copy of {original}")
 * @param campaignId - Optional campaign ID
 * @returns New grunt team
 */
export async function duplicateGruntTeam(
  teamId: ID,
  newName?: string,
  campaignId?: ID
): Promise<GruntTeam> {
  const original = await getGruntTeam(teamId, campaignId);
  if (!original) {
    throw new Error(`Grunt team with ID ${teamId} not found`);
  }

  const request: CreateGruntTeamRequest = {
    name: newName ?? `Copy of ${original.name}`,
    description: original.description,
    professionalRating: original.professionalRating,
    baseGrunts: original.baseGrunts,
    initialSize: original.initialSize,
    lieutenant: original.lieutenant,
    specialists: original.specialists?.map((s) => ({
      type: s.type,
      description: s.description,
      statModifications: s.statModifications,
      usesIndividualInitiative: s.usesIndividualInitiative,
    })),
    options: original.options,
    visibility: original.visibility,
  };

  return createGruntTeam(original.campaignId, request);
}
