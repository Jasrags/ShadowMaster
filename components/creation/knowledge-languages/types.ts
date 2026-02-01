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
  onAddSpecialization?: () => void;
  onRemoveSpecialization?: () => void;
  canAddSpecialization?: boolean;
}

export interface KnowledgeSkillSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spec: string) => void;
  skillName: string;
  pointsRemaining: number;
}

// Note: AddLanguageModalProps and AddKnowledgeSkillModalProps were removed
// when the separate modals were unified into KnowledgeLanguageModal

export interface KnowledgeLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLanguage: (name: string, rating: number, isNative: boolean) => void;
  onAddKnowledgeSkill: (
    name: string,
    category: KnowledgeCategory,
    rating: number,
    specialization?: string
  ) => void;
  existingLanguages: LanguageSkill[];
  existingKnowledgeSkills: KnowledgeSkill[];
  hasNativeLanguage: boolean;
  hasBilingualQuality: boolean;
  pointsRemaining: number;
  defaultMode?: "language" | "knowledge";
}
