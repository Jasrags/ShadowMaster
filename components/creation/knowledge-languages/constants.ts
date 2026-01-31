import type { KnowledgeCategory } from "./types";

export const MAX_SKILL_RATING = 6;

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  academic: "Academic",
  interests: "Interests",
  professional: "Professional",
  street: "Street",
};

export const CATEGORY_DESCRIPTIONS: Record<KnowledgeCategory, string> = {
  academic: "Scholarly and theoretical knowledge",
  interests: "Hobbies and personal interests",
  professional: "Career and job-related expertise",
  street: "Street-level and underground knowledge",
};

// Abbreviated category labels for compact display
export const CATEGORY_ABBREVS: Record<KnowledgeCategory, string> = {
  academic: "Acad",
  interests: "Int",
  professional: "Prof",
  street: "Str",
};

export const SPEC_KNOWLEDGE_POINT_COST = 1;

export const COMMON_LANGUAGES = [
  "English",
  "Japanese",
  "Mandarin",
  "Spanish",
  "German",
  "French",
  "Russian",
  "Arabic",
  "Portuguese",
  "Korean",
  "Italian",
  "Or'zet",
  "Sperethiel",
  "Aztlaner Spanish",
  "Cantonese",
];
