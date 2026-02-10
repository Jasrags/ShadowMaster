/**
 * Shared constants and helpers for character sheet display components.
 * Extracted from /app/characters/[id]/page.tsx to enable reuse across
 * display components without circular dependencies.
 */

import type { Character, Weapon } from "@/lib/types";

/**
 * Display metadata for each core attribute: abbreviation and accent color.
 */
export const ATTRIBUTE_DISPLAY: Record<string, { abbr: string; color: string }> = {
  body: { abbr: "BOD", color: "text-red-400" },
  agility: { abbr: "AGI", color: "text-amber-400" },
  reaction: { abbr: "REA", color: "text-orange-400" },
  strength: { abbr: "STR", color: "text-rose-400" },
  willpower: { abbr: "WIL", color: "text-purple-400" },
  logic: { abbr: "LOG", color: "text-blue-400" },
  intuition: { abbr: "INT", color: "text-cyan-400" },
  charisma: { abbr: "CHA", color: "text-pink-400" },
};

/**
 * Calculate total bonus for an attribute from all augmentation sources
 * (Cyberware, Bioware, Adept Powers).
 */
export function getAttributeBonus(
  character: Character,
  attrId: string
): Array<{ source: string; value: number }> {
  const bonuses: Array<{ source: string; value: number }> = [];

  character.cyberware?.forEach((item) => {
    if (item.attributeBonuses?.[attrId]) {
      bonuses.push({ source: item.name, value: item.attributeBonuses[attrId] });
    }
  });

  character.bioware?.forEach((item) => {
    if (item.attributeBonuses?.[attrId]) {
      bonuses.push({ source: item.name, value: item.attributeBonuses[attrId] });
    }
  });

  character.adeptPowers?.forEach((power) => {
    if (
      power.name.toLowerCase().includes("improved physical attribute") &&
      power.specification?.toLowerCase() === attrId.toLowerCase() &&
      power.rating
    ) {
      bonuses.push({ source: power.name, value: power.rating });
    }
  });

  return bonuses;
}

/**
 * Determine if a weapon is melee based on its properties.
 */
export function isMeleeWeapon(w: Weapon): boolean {
  const hasReach = typeof w.reach === "number";
  const cat = w.category.toLowerCase();
  const subcat = (w.subcategory || "").toLowerCase();
  const dmg = w.damage.toLowerCase();
  const mode = w.mode || [];

  return (
    hasReach ||
    cat.includes("melee") ||
    subcat.includes("melee") ||
    cat.includes("blade") ||
    subcat.includes("blade") ||
    cat.includes("club") ||
    subcat.includes("club") ||
    cat.includes("unarmed") ||
    subcat.includes("unarmed") ||
    dmg.includes("str") ||
    mode.length === 0
  );
}
