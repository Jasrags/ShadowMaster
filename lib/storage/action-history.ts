/**
 * Action History Storage Layer
 *
 * Handles persistent storage of action resolution history for characters.
 * Action history is stored in data/characters/{userId}/{characterId}/action-history.json
 */

import path from "path";
import type { ID, ActionHistory, ActionResult, ActionHistoryStats } from "../types";
import { ensureDirectory, readJsonFile, writeJsonFile } from "./base";

// =============================================================================
// CONSTANTS
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data", "characters");
const MAX_HISTORY_SIZE = 1000; // Maximum actions to keep per character

// =============================================================================
// PATH HELPERS
// =============================================================================

/**
 * Get the path to a character's action history file
 */
function getActionHistoryPath(userId: ID, characterId: ID): string {
  return path.join(DATA_DIR, userId, characterId, "action-history.json");
}

/**
 * Get the character directory path
 */
function getCharacterDir(userId: ID, characterId: ID): string {
  return path.join(DATA_DIR, userId, characterId);
}

// =============================================================================
// READ OPERATIONS
// =============================================================================

/**
 * Get action history for a character
 */
export async function getActionHistory(userId: ID, characterId: ID): Promise<ActionHistory | null> {
  const filePath = getActionHistoryPath(userId, characterId);
  return readJsonFile<ActionHistory>(filePath);
}

/**
 * Get recent actions for a character
 */
export async function getRecentActions(
  userId: ID,
  characterId: ID,
  limit: number = 20
): Promise<ActionResult[]> {
  const history = await getActionHistory(userId, characterId);
  if (!history) {
    return [];
  }
  return history.actions.slice(0, limit);
}

/**
 * Get a specific action by ID
 */
export async function getAction(
  userId: ID,
  characterId: ID,
  actionId: ID
): Promise<ActionResult | null> {
  const history = await getActionHistory(userId, characterId);
  if (!history) {
    return null;
  }
  return history.actions.find((a) => a.id === actionId) || null;
}

// =============================================================================
// WRITE OPERATIONS
// =============================================================================

/**
 * Initialize action history for a character
 */
export async function initializeActionHistory(userId: ID, characterId: ID): Promise<ActionHistory> {
  const characterDir = getCharacterDir(userId, characterId);
  await ensureDirectory(characterDir);

  const now = new Date().toISOString();
  const history: ActionHistory = {
    characterId,
    actions: [],
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getActionHistoryPath(userId, characterId);
  await writeJsonFile(filePath, history);

  return history;
}

/**
 * Save an action result to history
 */
export async function saveActionResult(
  userId: ID,
  characterId: ID,
  result: ActionResult
): Promise<ActionHistory> {
  let history = await getActionHistory(userId, characterId);

  if (!history) {
    history = await initializeActionHistory(userId, characterId);
  }

  // Add new action at the beginning (newest first)
  history.actions.unshift(result);

  // Trim to max size
  if (history.actions.length > MAX_HISTORY_SIZE) {
    history.actions = history.actions.slice(0, MAX_HISTORY_SIZE);
  }

  // Update timestamp
  history.updatedAt = new Date().toISOString();

  // Save
  const filePath = getActionHistoryPath(userId, characterId);
  await writeJsonFile(filePath, history);

  return history;
}

/**
 * Update an existing action (e.g., after reroll)
 */
export async function updateActionResult(
  userId: ID,
  characterId: ID,
  actionId: ID,
  updates: Partial<ActionResult>
): Promise<ActionResult | null> {
  const history = await getActionHistory(userId, characterId);
  if (!history) {
    return null;
  }

  const index = history.actions.findIndex((a) => a.id === actionId);
  if (index === -1) {
    return null;
  }

  // Update the action
  history.actions[index] = {
    ...history.actions[index],
    ...updates,
  };

  // Update timestamp
  history.updatedAt = new Date().toISOString();

  // Save
  const filePath = getActionHistoryPath(userId, characterId);
  await writeJsonFile(filePath, history);

  return history.actions[index];
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Calculate statistics for action history
 */
export async function calculateActionStats(
  userId: ID,
  characterId: ID
): Promise<ActionHistoryStats | null> {
  const history = await getActionHistory(userId, characterId);
  if (!history || history.actions.length === 0) {
    return null;
  }

  const actions = history.actions;

  // Basic counts
  const totalActions = actions.length;
  const totalHits = actions.reduce((sum, a) => sum + a.hits, 0);
  const totalGlitches = actions.filter((a) => a.isGlitch).length;
  const totalCriticalGlitches = actions.filter((a) => a.isCriticalGlitch).length;
  const totalEdgeSpent = actions.reduce((sum, a) => sum + a.edgeSpent, 0);

  // Average hits
  const averageHits = totalHits / totalActions;

  // Most used skill
  const skillCounts = new Map<string, number>();
  for (const action of actions) {
    const skill = action.context?.skillUsed || action.pool.skill;
    if (skill) {
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
    }
  }

  let mostUsedSkill: string | undefined;
  let maxSkillCount = 0;
  for (const [skill, count] of skillCounts) {
    if (count > maxSkillCount) {
      maxSkillCount = count;
      mostUsedSkill = skill;
    }
  }

  return {
    totalActions,
    totalHits,
    totalGlitches,
    totalCriticalGlitches,
    totalEdgeSpent,
    averageHits,
    mostUsedSkill,
  };
}

// =============================================================================
// QUERY OPERATIONS
// =============================================================================

/**
 * Query options for action history
 */
export interface ActionHistoryQuery {
  /** Filter by action type */
  actionType?: string;
  /** Filter by skill used */
  skill?: string;
  /** Filter by date range (start) */
  startDate?: string;
  /** Filter by date range (end) */
  endDate?: string;
  /** Filter by glitch status */
  hadGlitch?: boolean;
  /** Filter by Edge usage */
  usedEdge?: boolean;
  /** Maximum results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Query action history with filters
 */
export async function queryActionHistory(
  userId: ID,
  characterId: ID,
  query: ActionHistoryQuery
): Promise<{ actions: ActionResult[]; total: number }> {
  const history = await getActionHistory(userId, characterId);
  if (!history) {
    return { actions: [], total: 0 };
  }

  let filtered = history.actions;

  // Apply filters
  if (query.actionType) {
    filtered = filtered.filter((a) => a.context?.actionType === query.actionType);
  }

  if (query.skill) {
    filtered = filtered.filter(
      (a) => a.pool.skill === query.skill || a.context?.skillUsed === query.skill
    );
  }

  if (query.startDate) {
    const start = new Date(query.startDate).getTime();
    filtered = filtered.filter((a) => new Date(a.timestamp).getTime() >= start);
  }

  if (query.endDate) {
    const end = new Date(query.endDate).getTime();
    filtered = filtered.filter((a) => new Date(a.timestamp).getTime() <= end);
  }

  if (query.hadGlitch !== undefined) {
    filtered = filtered.filter((a) => a.isGlitch === query.hadGlitch);
  }

  if (query.usedEdge !== undefined) {
    if (query.usedEdge) {
      filtered = filtered.filter((a) => a.edgeSpent > 0);
    } else {
      filtered = filtered.filter((a) => a.edgeSpent === 0);
    }
  }

  const total = filtered.length;

  // Apply pagination
  const offset = query.offset || 0;
  const limit = query.limit || 20;
  filtered = filtered.slice(offset, offset + limit);

  return { actions: filtered, total };
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Clear action history for a character
 */
export async function clearActionHistory(userId: ID, characterId: ID): Promise<void> {
  const history = await getActionHistory(userId, characterId);
  if (!history) {
    return;
  }

  history.actions = [];
  history.updatedAt = new Date().toISOString();

  const filePath = getActionHistoryPath(userId, characterId);
  await writeJsonFile(filePath, history);
}

/**
 * Delete action history file for a character
 */
export async function deleteActionHistory(userId: ID, characterId: ID): Promise<boolean> {
  const filePath = getActionHistoryPath(userId, characterId);
  try {
    const fs = await import("fs/promises");
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}
