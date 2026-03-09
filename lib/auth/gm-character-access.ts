/**
 * GM Character Access
 *
 * Provides cross-user character resolution for GM gameplay edits.
 * When a GM needs to modify a player's character (damage, healing, karma, etc.),
 * this module resolves the character across user boundaries and validates
 * GM permissions via the campaign relationship.
 */

import type { Character } from "@/lib/types/character";
import type { Campaign } from "@/lib/types/campaign";
import type { ID } from "@/lib/types/core";
import type { ActorRole } from "@/lib/types/audit";
import type { CharacterPermission } from "./character-authorization";
import { getCharacter, getCharacterById } from "@/lib/storage/characters";
import { determineRole, getPermissionsForRole, hasPermission } from "./character-authorization";
import { createNotification } from "@/lib/storage/notifications";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of resolving a character for gameplay access
 */
export interface GameplayAccessResult {
  authorized: true;
  character: Character;
  ownerId: ID;
  actorRole: ActorRole;
  campaign: Campaign | null;
  isGMAccess: boolean;
}

export interface GameplayAccessDenied {
  authorized: false;
  error: string;
  status: number;
}

export type GameplayResolution = GameplayAccessResult | GameplayAccessDenied;

// =============================================================================
// CORE RESOLUTION
// =============================================================================

/**
 * Resolve a character for gameplay access, supporting cross-user GM lookup.
 *
 * 1. Fast path: check if actorUserId owns the character
 * 2. GM path: find character across all users, verify actor is GM of character's campaign
 * 3. Check required permission against the permission matrix
 */
export async function resolveCharacterForGameplay(
  actorUserId: ID,
  characterId: ID,
  requiredPermission: CharacterPermission = "gameplay_edit"
): Promise<GameplayResolution> {
  // Fast path: actor owns the character
  const ownedCharacter = await getCharacter(actorUserId, characterId);
  if (ownedCharacter) {
    const { role, campaign } = await determineRole(actorUserId, ownedCharacter);
    const permissions = getPermissionsForRole(role, ownedCharacter.status);

    if (!hasPermission(permissions, requiredPermission)) {
      return {
        authorized: false,
        error: `Permission denied: ${requiredPermission}`,
        status: 403,
      };
    }

    return {
      authorized: true,
      character: ownedCharacter,
      ownerId: actorUserId,
      actorRole: role,
      campaign,
      isGMAccess: false,
    };
  }

  // GM path: character belongs to another user
  const character = await getCharacterById(characterId);
  if (!character) {
    return {
      authorized: false,
      error: "Character not found",
      status: 404,
    };
  }

  // Character must be in a campaign for GM access
  if (!character.campaignId) {
    return {
      authorized: false,
      error: "Character not found",
      status: 404,
    };
  }

  // Determine actor's role for this character
  const { role, campaign } = await determineRole(actorUserId, character);

  if (role !== "gm" && role !== "admin") {
    return {
      authorized: false,
      error: "Not authorized to access this character",
      status: 403,
    };
  }

  // Check permission
  const permissions = getPermissionsForRole(role, character.status);
  if (!hasPermission(permissions, requiredPermission)) {
    return {
      authorized: false,
      error: `Permission denied: ${requiredPermission}`,
      status: 403,
    };
  }

  return {
    authorized: true,
    character,
    ownerId: character.ownerId,
    actorRole: role,
    campaign,
    isGMAccess: true,
  };
}

// =============================================================================
// NOTIFICATION HELPER
// =============================================================================

/**
 * Notify the character owner that a GM has edited their character.
 */
export async function notifyOwnerOfGMEdit(
  character: Character,
  campaign: Campaign,
  gmUserId: ID,
  action: string,
  details?: string
): Promise<void> {
  // Don't notify if the GM owns the character (e.g., GM's own NPC)
  if (character.ownerId === gmUserId) {
    return;
  }

  const message = details
    ? `GM made a gameplay edit to ${character.name}: ${action} — ${details}`
    : `GM made a gameplay edit to ${character.name}: ${action}`;

  await createNotification({
    userId: character.ownerId,
    campaignId: campaign.id,
    type: "character_gm_edited",
    title: `Character Updated by GM`,
    message,
    actionUrl: `/characters/${character.id}`,
  });
}
