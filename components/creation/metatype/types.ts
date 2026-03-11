import type { CreationState } from "@/lib/types";

export interface MetatypeCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export interface MetatypeOption {
  id: string;
  name: string;
  baseMetatype: string | null;
  description?: string;
  specialAttributePoints: number;
  racialTraits: string[];
  attributes: Record<string, { min: number; max: number }>;
  /** Karma cost for Point Buy creation (undefined for priority-based methods) */
  karmaCost?: number;
  /** SAP at each priority level (A–E). null = unavailable at that level. */
  priorityAvailability?: Record<string, number | null>;
}

export interface MetatypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metatypeId: string) => void;
  metatypes: MetatypeOption[];
  /** Priority level label (e.g. "A"). Undefined for Point Buy. */
  priorityLevel?: string;
  currentSelection: string | null;
}
