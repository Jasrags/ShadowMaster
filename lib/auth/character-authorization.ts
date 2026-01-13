/**
 * Character Authorization
 *
 * Provides authorization checks for character operations.
 * Determines what actions a user can perform on a character
 * based on ownership, campaign role, and admin status.
 *
 * Satisfies:
 * - Requirement: "Access to character modification and deletion operations
 *   MUST be restricted to authorized owners"
 * - Requirement: "Authentication and authorization MUST be verified
 *   for every operation involving character data retrieval or modification"
 */

import type { Character } from "@/lib/types/character";
import type { Campaign } from "@/lib/types/campaign";
import type { ID } from "@/lib/types/core";
import type { ActorRole } from "@/lib/types/audit";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";

// =============================================================================
// PERMISSION TYPES
// =============================================================================

/**
 * All possible permissions on a character
 */
export type CharacterPermission =
  | "view" // View character details
  | "edit" // Edit draft characters
  | "delete" // Delete character
  | "finalize" // Finalize draft to active
  | "retire" // Retire active character
  | "resurrect" // Bring back deceased character
  | "advance" // Apply karma advancement
  | "approve_advancement" // Approve pending advancements (GM)
  | "reject_advancement" // Reject pending advancements (GM)
  | "transfer" // Transfer ownership (admin)
  | "manage_campaign"; // Join/leave campaign

// =============================================================================
// AUTHORIZATION RESULT
// =============================================================================

/**
 * Result of a character authorization check
 */
export interface CharacterAuthResult {
  authorized: boolean;
  character: Character | null;
  campaign: Campaign | null;
  role: ActorRole;
  permissions: CharacterPermission[];
  error?: string;
  status: number;
}

// =============================================================================
// AUTHORIZATION CONTEXT
// =============================================================================

/**
 * Context for authorization check
 */
export interface AuthorizationContext {
  userId: ID | null;
  isAdmin?: boolean;
  requiredPermission?: CharacterPermission;
}

// =============================================================================
// PERMISSION MATRIX
// =============================================================================

/**
 * Get all permissions for a given role and character status
 */
export function getPermissionsForRole(
  role: ActorRole,
  characterStatus: Character["status"]
): CharacterPermission[] {
  const permissions: CharacterPermission[] = [];

  switch (role) {
    case "admin":
      // Admin has all permissions
      return [
        "view",
        "edit",
        "delete",
        "finalize",
        "retire",
        "resurrect",
        "advance",
        "approve_advancement",
        "reject_advancement",
        "transfer",
        "manage_campaign",
      ];

    case "gm":
      // GM can view campaign characters and manage approvals
      permissions.push("view");
      if (characterStatus === "active") {
        permissions.push("retire", "approve_advancement", "reject_advancement");
      }
      if (characterStatus === "deceased") {
        permissions.push("resurrect");
      }
      break;

    case "owner":
      // Owner permissions depend on status
      permissions.push("view", "delete", "manage_campaign");
      if (characterStatus === "draft") {
        permissions.push("edit", "finalize");
      }
      if (characterStatus === "active") {
        permissions.push("retire", "advance");
      }
      if (characterStatus === "retired") {
        // Can reactivate retired characters
        permissions.push("advance"); // Reactivation handled separately
      }
      break;

    case "system":
      // System can do anything (for automated processes)
      return [
        "view",
        "edit",
        "delete",
        "finalize",
        "retire",
        "resurrect",
        "advance",
        "approve_advancement",
        "reject_advancement",
        "transfer",
        "manage_campaign",
      ];
  }

  return permissions;
}

/**
 * Check if a permission is granted
 */
export function hasPermission(
  permissions: CharacterPermission[],
  required: CharacterPermission
): boolean {
  return permissions.includes(required);
}

// =============================================================================
// AUTHORIZATION FUNCTIONS
// =============================================================================

/**
 * Determine the role of a user for a specific character
 */
export async function determineRole(
  userId: ID,
  character: Character,
  isAdmin: boolean = false
): Promise<{ role: ActorRole; campaign: Campaign | null }> {
  // Admin supersedes all
  if (isAdmin) {
    return { role: "admin", campaign: null };
  }

  // Check ownership
  if (userId === character.ownerId) {
    // If in a campaign, could also be GM
    if (character.campaignId) {
      const campaign = await getCampaignById(character.campaignId);
      if (campaign && campaign.gmId === userId) {
        // Owner who is also GM - use owner role for own characters
        return { role: "owner", campaign };
      }
      return { role: "owner", campaign };
    }
    return { role: "owner", campaign: null };
  }

  // Check if user is GM of character's campaign
  if (character.campaignId) {
    const campaign = await getCampaignById(character.campaignId);
    if (campaign && campaign.gmId === userId) {
      return { role: "gm", campaign };
    }
    // Could be a player in the same campaign - limited view access
    if (campaign && campaign.playerIds.includes(userId)) {
      // Players can't do much with other players' characters
      return { role: "owner", campaign }; // Treat as minimal permissions
    }
  }

  // No recognized role - will result in denied access
  return { role: "owner", campaign: null };
}

/**
 * Authorize a user to perform an action on a character
 */
export async function authorizeCharacter(
  characterId: string,
  ownerId: string, // The character owner's ID (for storage lookup)
  context: AuthorizationContext
): Promise<CharacterAuthResult> {
  const { userId, isAdmin, requiredPermission } = context;

  // Authentication check
  if (!userId) {
    return {
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions: [],
      error: "Authentication required",
      status: 401,
    };
  }

  // Get character
  const character = await getCharacter(ownerId, characterId);
  if (!character) {
    return {
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions: [],
      error: "Character not found",
      status: 404,
    };
  }

  // Determine role and get campaign if applicable
  const { role, campaign } = await determineRole(userId, character, isAdmin);

  // Get permissions for this role
  const permissions = getPermissionsForRole(role, character.status);

  // If no specific permission required, just check access
  if (!requiredPermission) {
    // Must have at least view permission
    const canView = hasPermission(permissions, "view");
    return {
      authorized: canView,
      character: canView ? character : null,
      campaign,
      role,
      permissions,
      error: canView ? undefined : "Access denied",
      status: canView ? 200 : 403,
    };
  }

  // Check specific permission
  const hasRequiredPermission = hasPermission(permissions, requiredPermission);

  return {
    authorized: hasRequiredPermission,
    character: hasRequiredPermission ? character : null,
    campaign,
    role,
    permissions,
    error: hasRequiredPermission ? undefined : `Permission denied: ${requiredPermission}`,
    status: hasRequiredPermission ? 200 : 403,
  };
}

/**
 * Authorize character access by the owner (simplified for common case)
 *
 * This is the most common authorization pattern: user accessing their own character.
 * Optimized to avoid campaign lookups when not needed.
 */
export async function authorizeOwnerAccess(
  userId: ID | null,
  characterOwnerId: ID,
  characterId: ID,
  requiredPermission?: CharacterPermission
): Promise<CharacterAuthResult> {
  // Authentication check
  if (!userId) {
    return {
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions: [],
      error: "Authentication required",
      status: 401,
    };
  }

  // Quick ownership check
  if (userId !== characterOwnerId) {
    // Not the owner - need full authorization check
    return authorizeCharacter(characterId, characterOwnerId, {
      userId,
      requiredPermission,
    });
  }

  // Owner accessing their own character
  const character = await getCharacter(userId, characterId);
  if (!character) {
    return {
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions: [],
      error: "Character not found",
      status: 404,
    };
  }

  const permissions = getPermissionsForRole("owner", character.status);

  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return {
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions,
      error: `Permission denied: ${requiredPermission}`,
      status: 403,
    };
  }

  return {
    authorized: true,
    character,
    campaign: null,
    role: "owner",
    permissions,
    status: 200,
  };
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Check if user can view a character
 */
export async function canViewCharacter(
  userId: ID | null,
  ownerId: ID,
  characterId: ID
): Promise<boolean> {
  const result = await authorizeOwnerAccess(userId, ownerId, characterId, "view");
  return result.authorized;
}

/**
 * Check if user can edit a character
 */
export async function canEditCharacter(
  userId: ID | null,
  ownerId: ID,
  characterId: ID
): Promise<boolean> {
  const result = await authorizeOwnerAccess(userId, ownerId, characterId, "edit");
  return result.authorized;
}

/**
 * Check if user can finalize a character
 */
export async function canFinalizeCharacter(
  userId: ID | null,
  ownerId: ID,
  characterId: ID
): Promise<boolean> {
  const result = await authorizeOwnerAccess(userId, ownerId, characterId, "finalize");
  return result.authorized;
}

/**
 * Check if user can delete a character
 */
export async function canDeleteCharacter(
  userId: ID | null,
  ownerId: ID,
  characterId: ID
): Promise<boolean> {
  const result = await authorizeOwnerAccess(userId, ownerId, characterId, "delete");
  return result.authorized;
}
