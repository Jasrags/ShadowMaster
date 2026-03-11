/**
 * Creation Method Filter
 *
 * Filters available creation methods based on campaign settings.
 * When a campaign is active, only methods in `enabledCreationMethodIds` are shown.
 * Standalone creation (no campaign) shows all methods from loaded books.
 */

import type { CreationMethod, ID } from "../types";
import type { Campaign } from "../types/campaign";

/**
 * Result of filtering creation methods with diagnostic information
 */
export interface CreationMethodFilterResult {
  /** Methods available for selection */
  readonly availableMethods: readonly CreationMethod[];
  /** Whether the current method is valid (included in available methods) */
  readonly isCurrentMethodValid: boolean;
  /** Suggested default method ID if current is invalid */
  readonly suggestedMethodId: ID | null;
  /** Whether no methods are available (error state) */
  readonly hasNoMethods: boolean;
}

/**
 * Filters creation methods by campaign settings.
 *
 * - If no campaign, returns all methods unchanged.
 * - If campaign with enabledCreationMethodIds, filters to only those.
 * - If campaign with empty enabledCreationMethodIds, returns all (no restriction).
 */
export function getAvailableCreationMethods(
  allMethods: readonly CreationMethod[],
  campaign: Campaign | null | undefined,
  currentMethodId: ID | null | undefined
): CreationMethodFilterResult {
  // No campaign = standalone creation, show all methods
  if (!campaign) {
    const isCurrentMethodValid = currentMethodId
      ? allMethods.some((m) => m.id === currentMethodId)
      : false;
    return {
      availableMethods: allMethods,
      isCurrentMethodValid,
      suggestedMethodId: isCurrentMethodValid ? null : (allMethods[0]?.id ?? null),
      hasNoMethods: allMethods.length === 0,
    };
  }

  // Campaign with no restrictions (empty array) = show all
  const enabledIds = campaign.enabledCreationMethodIds;
  if (!enabledIds || enabledIds.length === 0) {
    const isCurrentMethodValid = currentMethodId
      ? allMethods.some((m) => m.id === currentMethodId)
      : false;
    return {
      availableMethods: allMethods,
      isCurrentMethodValid,
      suggestedMethodId: isCurrentMethodValid ? null : (allMethods[0]?.id ?? null),
      hasNoMethods: allMethods.length === 0,
    };
  }

  // Campaign with restrictions: filter methods
  const availableMethods = allMethods.filter((m) => enabledIds.includes(m.id));
  const isCurrentMethodValid = currentMethodId
    ? availableMethods.some((m) => m.id === currentMethodId)
    : false;

  return {
    availableMethods,
    isCurrentMethodValid,
    suggestedMethodId: isCurrentMethodValid ? null : (availableMethods[0]?.id ?? null),
    hasNoMethods: availableMethods.length === 0,
  };
}

/**
 * Validates that a creation method ID is allowed for a campaign.
 * Returns null if valid, or an error message if not.
 */
export function validateCreationMethodForCampaign(
  creationMethodId: ID,
  campaign: Campaign | null | undefined
): string | null {
  if (!campaign) return null;

  const enabledIds = campaign.enabledCreationMethodIds;
  if (!enabledIds || enabledIds.length === 0) return null;

  if (!enabledIds.includes(creationMethodId)) {
    return `Creation method "${creationMethodId}" is not allowed in campaign "${campaign.title}". Allowed methods: ${enabledIds.join(", ")}`;
  }

  return null;
}
