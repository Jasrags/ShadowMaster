/**
 * Character archetype types
 *
 * Archetypes provide pre-filled character creation starting points.
 * Players can pick an archetype to begin with suggested priorities,
 * attributes, and skills, then customize from there.
 */

import type { ID } from "./core";
import type { EditionCode } from "./edition";
import type { CreationSelections } from "./creation-selections";

// =============================================================================
// ARCHETYPE CATEGORY
// =============================================================================

export type ArchetypeCategory = "combat" | "magic" | "technology" | "social";

// =============================================================================
// CHARACTER ARCHETYPE
// =============================================================================

export interface CharacterArchetype {
  id: ID;
  editionCode: EditionCode;
  name: string;
  description: string;
  category: ArchetypeCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  keyAttributes: string[];
  suggestedMetatype: string;
  magicalPath: string;
  priorities: Record<string, string>;
  selections: Partial<CreationSelections>;
  source?: string;
}
