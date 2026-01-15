import type { CreationState } from "@/lib/types";

export interface MagicPathCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export interface PathOption {
  path: string;
  magicRating?: number;
  resonanceRating?: number;
}

export interface MagicPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pathId: string) => void;
  availableOptions: PathOption[];
  priorityLevel: string;
  currentSelection: string | null;
  magicPaths: Array<{ id: string; name: string; hasResonance?: boolean }>;
}

export interface AspectedMageGroup {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export interface PathInfo {
  description: string;
  features: string[];
}
