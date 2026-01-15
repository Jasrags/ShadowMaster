import type { QualityData } from "@/lib/rules/loader-types";

export function calculatePositiveKarmaSpent(
  selectedQualities: string[],
  qualitiesData: QualityData[],
  qualityLevels: Record<string, number>
): number {
  return selectedQualities.reduce((sum, id) => {
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
