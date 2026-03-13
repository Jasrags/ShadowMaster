import type { InfectedTypeData } from "./types";

const PHYSICAL_ATTRIBUTES = ["body", "agility", "reaction", "strength"];
const MENTAL_ATTRIBUTES = ["willpower", "logic", "intuition", "charisma"];

export function applyInfectedAttributeBonuses(
  attributes: Readonly<Record<string, number>>,
  infectedType: InfectedTypeData
): Record<string, number> {
  const result = { ...attributes };

  for (const attr of PHYSICAL_ATTRIBUTES) {
    if (attr in result) {
      result[attr] = result[attr] + infectedType.physicalAttributeBonus;
    }
  }

  for (const attr of MENTAL_ATTRIBUTES) {
    if (attr in result) {
      result[attr] = result[attr] + infectedType.mentalAttributeBonus;
    }
  }

  return result;
}

export function getAttributeBonusBreakdown(infectedType: InfectedTypeData): {
  physical: number;
  mental: number;
} {
  return {
    physical: infectedType.physicalAttributeBonus,
    mental: infectedType.mentalAttributeBonus,
  };
}
