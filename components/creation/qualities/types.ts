import type { QualityData, SkillGroupData } from "@/lib/rules/loader-types";

export interface SelectedQuality {
  id: string;
  specification?: string;
  level?: number;
  /** Karma cost/value for this selection - used by CreationBudgetContext */
  karma?: number;
}

export interface QualitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPositive: boolean;
  qualities: QualityData[];
  selectedIds: string[];
  usedKarma: number;
  maxKarma: number;
  karmaBalance: number;
  onAdd: (qualityId: string, specification?: string, level?: number) => void;
  skillGroups: SkillGroupData[];
  existingSkillIds: string[]; // Skills currently selected by the user
  existingSkillGroupIds: string[]; // Skill groups currently selected by the user
}

export interface SelectedQualityCardProps {
  quality: QualityData;
  selection: SelectedQuality;
  isPositive: boolean;
  cost: number;
  onRemove: () => void;
}
