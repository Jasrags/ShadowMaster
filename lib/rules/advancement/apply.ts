/**
 * Shared logic for applying advancement records to character state.
 */

import type { Character, AdvancementRecord } from "@/lib/types";

/**
 * Apply mechanical changes from an advancement record to a character
 *
 * @param character - Character to update
 * @param record - Advancement record to apply
 * @returns Updated character
 */
export function applyAdvancement(
  character: Character,
  record: AdvancementRecord
): Character {
  const updatedCharacter: Character = { ...character };

  if (record.type === "attribute") {
    updatedCharacter.attributes = {
      ...character.attributes,
      [record.targetId]: record.newValue,
    };
  } else if (record.type === "skill") {
    updatedCharacter.skills = {
      ...character.skills,
      [record.targetId]: record.newValue,
    };
  } else if (record.type === "specialization") {
    // Extract specialization name from notes (format: "Specialization: {name}")
    const specializationMatch = record.notes?.match(/^Specialization:\s*(.+)$/);
    if (specializationMatch) {
      const specializationName = specializationMatch[1].trim();
      const skillId = record.targetId;
      const existingSpecializations = character.skillSpecializations?.[skillId] || [];
      
      if (!existingSpecializations.includes(specializationName)) {
        updatedCharacter.skillSpecializations = {
          ...character.skillSpecializations,
          [skillId]: [...existingSpecializations, specializationName],
        };
      }
    }
  }
  // Add more types as they are implemented

  return updatedCharacter;
}
