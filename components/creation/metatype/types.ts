import type { CreationState } from "@/lib/types";

export interface MetatypeCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export interface MetatypeOption {
  id: string;
  name: string;
  description?: string;
  specialAttributePoints: number;
  racialTraits: string[];
  attributes: Record<string, { min: number; max: number }>;
}

export interface MetatypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metatypeId: string) => void;
  metatypes: MetatypeOption[];
  priorityLevel: string;
  currentSelection: string | null;
}
