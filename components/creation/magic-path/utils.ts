import type { QualityData } from "@/lib/rules/loader-types";

/**
 * Quality selection can be either a string ID or an object with embedded data.
 * Object format supports embedded specification and karma values.
 */
type QualitySelection = string | { id: string; specification?: string; karma?: number };

export function calculatePositiveKarmaSpent(
  selectedQualities: QualitySelection[],
  qualitiesData: QualityData[],
  qualityLevels: Record<string, number>
): number {
  return selectedQualities.reduce((sum, quality) => {
    // Handle both string and object formats
    const id = typeof quality === "string" ? quality : quality.id;

    // If object format has embedded karma value, use it directly
    if (typeof quality === "object" && quality.karma !== undefined) {
      return sum + quality.karma;
    }

    // Otherwise, look up from quality data
    const q = qualitiesData.find((x) => x.id === id);
    if (!q) return sum;
    let cost = q.karmaCost || 0;
    if (q.levels) {
      const lvl = qualityLevels[id] || 1;
      const lData = q.levels.find((l) => l.level === lvl);
      if (lData) cost = Math.abs(lData.karma);
    }
    return sum + cost;
  }, 0);
}
