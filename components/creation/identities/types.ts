import type { LifestyleModification, LifestyleSubscription, SinnerQuality } from "@/lib/types";

export type ModalType =
  | "identity"
  | "license"
  | "lifestyle"
  | "edit-identity"
  | "edit-license"
  | "edit-lifestyle"
  | null;

export interface NewIdentityState {
  name: string;
  sinType: "fake" | "real";
  sinRating: number;
}

export interface NewLicenseState {
  name: string;
  rating: number;
  notes: string;
}

export interface NewLifestyleState {
  type: string;
  location: string;
  customExpenses: number;
  customIncome: number;
  notes: string;
  modifications: LifestyleModification[];
  subscriptions: LifestyleSubscription[];
}

export interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (identity: NewIdentityState) => void;
  hasSINnerQuality: boolean;
  sinnerQualityLevel: SinnerQuality | null;
  nuyenRemaining: number;
  initialData?: NewIdentityState;
  isEditMode?: boolean;
}

export interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (license: NewLicenseState) => void;
  sinType: "fake" | "real";
  nuyenRemaining: number;
  initialData?: NewLicenseState;
  isEditMode?: boolean;
}

export interface LifestyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lifestyle: NewLifestyleState) => void;
  nuyenRemaining: number;
  initialData?: NewLifestyleState;
  isEditMode?: boolean;
}
