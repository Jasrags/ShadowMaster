import type { QualityData, SkillGroupData, SkillData } from "@/lib/rules";

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
  /** Initial type to show when modal opens (defaults to 'positive') */
  defaultType?: "positive" | "negative";
  /** All positive qualities from the ruleset */
  positiveQualities: QualityData[];
  /** All negative qualities from the ruleset */
  negativeQualities: QualityData[];
  /** IDs of already-selected positive qualities */
  selectedPositiveIds: string[];
  /** IDs of already-selected negative qualities */
  selectedNegativeIds: string[];
  /** Karma spent on positive qualities */
  positiveKarmaUsed: number;
  /** Karma gained from negative qualities */
  negativeKarmaUsed: number;
  /** Maximum karma for positive qualities (typically 25) */
  maxPositiveKarma: number;
  /** Maximum karma for negative qualities (typically 25) */
  maxNegativeKarma: number;
  /** Current karma balance available */
  karmaBalance: number;
  /** Callback when a quality is added - isPositive indicates the type */
  onAdd: (qualityId: string, isPositive: boolean, specification?: string, level?: number) => void;
  skillGroups: SkillGroupData[];
  skills: SkillData[];
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
