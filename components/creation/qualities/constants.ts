export const MAX_POSITIVE_KARMA = 25;
export const MAX_NEGATIVE_KARMA = 25;

// Categories for grouping qualities in the modal
export const QUALITY_CATEGORIES = ["physical", "mental", "social", "magical", "other"] as const;
export type QualityCategory = (typeof QUALITY_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<QualityCategory, string> = {
  physical: "Physical",
  mental: "Mental",
  social: "Social",
  magical: "Magical",
  other: "Other",
};
