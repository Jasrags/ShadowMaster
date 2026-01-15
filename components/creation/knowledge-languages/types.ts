import type { LanguageSkill, KnowledgeSkill } from "@/lib/types";

export type KnowledgeCategory = "academic" | "interests" | "professional" | "street";

export interface LanguageRowProps {
  language: LanguageSkill;
  onRatingChange: (delta: number) => void;
  onRemove: () => void;
}

export interface KnowledgeSkillRowProps {
  skill: KnowledgeSkill;
  onRatingChange: (delta: number) => void;
  onRemove: () => void;
}

export interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, rating: number, isNative: boolean) => void;
  existingLanguages: string[];
  hasNativeLanguage: boolean;
  pointsRemaining: number;
}

export interface AddKnowledgeSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: KnowledgeCategory, rating: number) => void;
  pointsRemaining: number;
}
