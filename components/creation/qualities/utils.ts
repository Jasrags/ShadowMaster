import type { QualityData } from "@/lib/rules/loader-types";
import { hasUnifiedRatings, getRatingTableValue, getAvailableRatings } from "@/lib/types/ratings";
import type { QualityCategory } from "./constants";

// Map quality tags to categories
export function getQualityCategory(quality: QualityData): QualityCategory {
  const name = quality.name.toLowerCase();
  const summary = (quality.summary || "").toLowerCase();

  // Magic-related
  if (
    quality.requiresMagic ||
    name.includes("astral") ||
    name.includes("magic") ||
    name.includes("spirit")
  ) {
    return "magical";
  }

  // Physical traits
  if (
    name.includes("ambidextrous") ||
    name.includes("catlike") ||
    name.includes("double-jointed") ||
    name.includes("pain") ||
    name.includes("natural") ||
    name.includes("allergy") ||
    name.includes("addiction") ||
    summary.includes("physical") ||
    summary.includes("body")
  ) {
    return "physical";
  }

  // Mental traits
  if (
    name.includes("analytical") ||
    name.includes("codeslinger") ||
    name.includes("photographic") ||
    name.includes("aptitude") ||
    name.includes("exceptional") ||
    summary.includes("logic") ||
    summary.includes("memory") ||
    summary.includes("mental")
  ) {
    return "mental";
  }

  // Social traits
  if (
    name.includes("first impression") ||
    name.includes("blandness") ||
    name.includes("sinner") ||
    name.includes("prejudiced") ||
    name.includes("fame") ||
    summary.includes("social") ||
    summary.includes("charisma")
  ) {
    return "social";
  }

  return "other";
}

// Get cost for a quality at a specific level
// Supports unified ratings table (preferred) and legacy levels array
export function getQualityCost(quality: QualityData, level?: number): number {
  // Check unified ratings table first
  if (hasUnifiedRatings(quality)) {
    const ratingValue = getRatingTableValue(quality, level || 1);
    if (ratingValue?.karmaCost !== undefined) {
      return Math.abs(ratingValue.karmaCost);
    }
  }

  // Fall back to legacy levels array
  if (quality.levels && quality.levels.length > 0) {
    const levelData = quality.levels.find((l) => l.level === (level || 1));
    return levelData ? Math.abs(levelData.karma) : quality.karmaCost || 0;
  }

  return quality.karmaCost || quality.karmaBonus || 0;
}

// Check if quality has levels (unified or legacy)
export function hasLevels(quality: QualityData): boolean {
  if (hasUnifiedRatings(quality)) return true;
  return !!(quality.levels && quality.levels.length > 0);
}

// Get available levels for a quality (unified or legacy)
export function getQualityLevels(
  quality: QualityData
): Array<{ level: number; name?: string; karma: number }> {
  // Check unified ratings first
  if (hasUnifiedRatings(quality)) {
    const ratings = getAvailableRatings(quality);
    return ratings.map((rating) => {
      const ratingValue = getRatingTableValue(quality, rating);
      return {
        level: rating,
        name: undefined, // Unified ratings don't have named levels
        karma: ratingValue?.karmaCost ?? 0,
      };
    });
  }

  // Fall back to legacy levels
  if (quality.levels && quality.levels.length > 0) {
    return quality.levels.map((l) => ({
      level: l.level,
      name: l.name,
      karma: l.karma,
    }));
  }

  return [];
}
