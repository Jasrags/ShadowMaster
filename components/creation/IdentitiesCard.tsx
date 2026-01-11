"use client";

/**
 * IdentitiesCard
 *
 * Card for managing identities, SINs, licenses, and lifestyles during character creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Create identities with fake or real SINs (modal-based)
 * - Add licenses to identities with type chips
 * - Associate lifestyles with identities
 * - Track nuyen costs for fake SINs and licenses
 * - SINner quality integration for real SINs
 */

import { useMemo, useCallback, useState } from "react";
import { Plus, X, FileText, AlertTriangle, Home } from "lucide-react";
import type {
  CreationState,
  Identity,
  License,
  SIN,
  SinnerQuality,
  Lifestyle,
  LifestyleModification,
  LifestyleSubscription,
} from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { LifestyleModificationSelector } from "./shared/LifestyleModificationSelector";
import { LifestyleSubscriptionSelector } from "./shared/LifestyleSubscriptionSelector";

// =============================================================================
// TYPES
// =============================================================================

interface IdentitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

type ModalType =
  | "identity"
  | "license"
  | "lifestyle"
  | "edit-identity"
  | "edit-license"
  | "edit-lifestyle"
  | null;

interface NewIdentityState {
  name: string;
  sinType: "fake" | "real";
  sinRating: number;
}

interface NewLicenseState {
  name: string;
  rating: number;
  notes: string;
}

interface NewLifestyleState {
  type: string;
  location: string;
  customExpenses: number;
  customIncome: number;
  notes: string;
  modifications: LifestyleModification[];
  subscriptions: LifestyleSubscription[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIN_COST_PER_RATING = 2500; // Rating × 2,500¥
const LICENSE_COST_PER_RATING = 200; // Rating × 200¥

const SINNER_QUALITY_LABELS: Record<SinnerQuality, string> = {
  [SinnerQualityEnum.National]: "National",
  [SinnerQualityEnum.Criminal]: "Criminal",
  [SinnerQualityEnum.CorporateLimited]: "Corporate (Limited)",
  [SinnerQualityEnum.CorporateBorn]: "Corporate Born",
};

const COMMON_LICENSE_TYPES = [
  "Firearms License",
  "Magic User License",
  "Driver's License",
  "Vehicle Registration",
  "Restricted Augmentation License",
  "Security License",
  "Private Investigator License",
  "Bounty Hunter License",
  "Bodyguard License",
  "Academic License",
  "Media License",
];

const LIFESTYLE_TYPES = [
  { id: "street", name: "Street", monthlyCost: 0 },
  { id: "squatter", name: "Squatter", monthlyCost: 500 },
  { id: "low", name: "Low", monthlyCost: 2000 },
  { id: "medium", name: "Medium", monthlyCost: 5000 },
  { id: "high", name: "High", monthlyCost: 10000 },
  { id: "luxury", name: "Luxury", monthlyCost: 100000 },
];

// =============================================================================
// MODAL COMPONENTS
// =============================================================================

/**
 * Modal wrapper component
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * New Identity Modal
 */
function NewIdentityModal({
  isOpen,
  onClose,
  onSave,
  hasSINnerQuality,
  sinnerQualityLevel,
  nuyenRemaining,
  initialData,
  isEditMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (identity: NewIdentityState) => void;
  hasSINnerQuality: boolean;
  sinnerQualityLevel: SinnerQuality | null;
  nuyenRemaining: number;
  initialData?: NewIdentityState;
  isEditMode?: boolean;
}) {
  const [formState, setFormState] = useState<NewIdentityState>(
    initialData || {
      name: "",
      sinType: "fake",
      sinRating: 1,
    }
  );

  // Reset form when modal opens with initialData (for edit mode)
  const resetFormOnOpen = useCallback(() => {
    if (isOpen && initialData) {
      setFormState(initialData);
    } else if (isOpen && !initialData) {
      setFormState({ name: "", sinType: "fake", sinRating: 1 });
    }
  }, [isOpen, initialData]);

  // Use effect to reset form when modal opens
  useMemo(() => {
    resetFormOnOpen();
  }, [resetFormOnOpen]);

  const cost = formState.sinType === "fake" ? formState.sinRating * SIN_COST_PER_RATING : 0;
  const canAfford = formState.sinType === "real" || cost <= nuyenRemaining;
  const canSave = formState.name.trim() && canAfford;

  const handleSave = () => {
    if (canSave) {
      onSave(formState);
      setFormState({ name: "", sinType: "fake", sinRating: 1 });
      onClose();
    }
  };

  const handleClose = () => {
    setFormState({ name: "", sinType: "fake", sinRating: 1 });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Identity" : "New Identity"}
    >
      <div className="space-y-5">
        {/* Identity Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Identity Name
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g., John Smith, Jane Doe"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            autoFocus
          />
        </div>

        {/* SIN Type Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            SIN Type
          </label>
          <div className="space-y-2">
            {/* Fake SIN Option */}
            <button
              type="button"
              onClick={() => setFormState({ ...formState, sinType: "fake" })}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formState.sinType === "fake"
                  ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Fake SIN</div>
              <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Purchased as gear (Rating 1-4)
              </div>
            </button>

            {/* Real SIN Option */}
            <button
              type="button"
              onClick={() => hasSINnerQuality && setFormState({ ...formState, sinType: "real" })}
              disabled={!hasSINnerQuality}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formState.sinType === "real"
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                  : hasSINnerQuality
                    ? "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Real SIN</span>
                {!hasSINnerQuality && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    (Requires SINner quality)
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                From SINner quality
              </div>
            </button>
          </div>
        </div>

        {/* Fake SIN Rating (conditional) */}
        {formState.sinType === "fake" && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Fake SIN Rating
            </label>
            <select
              value={formState.sinRating}
              onChange={(e) => setFormState({ ...formState, sinRating: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            >
              {[1, 2, 3, 4].map((r) => (
                <option key={r} value={r}>
                  Rating {r} (¥{(r * SIN_COST_PER_RATING).toLocaleString()})
                </option>
              ))}
            </select>

            {/* Cost warning */}
            {!canAfford && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Insufficient funds (need ¥{cost.toLocaleString()})</span>
              </div>
            )}
          </div>
        )}

        {/* Real SIN info (conditional) */}
        {formState.sinType === "real" && sinnerQualityLevel && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              SINner Quality: {SINNER_QUALITY_LABELS[sinnerQualityLevel]}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Save Identity"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * New License Modal
 */
function NewLicenseModal({
  isOpen,
  onClose,
  onSave,
  sinType,
  nuyenRemaining,
  initialData,
  isEditMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (license: NewLicenseState) => void;
  sinType: "fake" | "real";
  nuyenRemaining: number;
  initialData?: NewLicenseState;
  isEditMode?: boolean;
}) {
  const [formState, setFormState] = useState<NewLicenseState>(
    initialData || {
      name: "",
      rating: 1,
      notes: "",
    }
  );

  // Reset form when modal opens with initialData (for edit mode)
  const resetFormOnOpen = useCallback(() => {
    if (isOpen && initialData) {
      setFormState(initialData);
    } else if (isOpen && !initialData) {
      setFormState({ name: "", rating: 1, notes: "" });
    }
  }, [isOpen, initialData]);

  // Use effect to reset form when modal opens
  useMemo(() => {
    resetFormOnOpen();
  }, [resetFormOnOpen]);

  const cost = sinType === "fake" ? formState.rating * LICENSE_COST_PER_RATING : 0;
  const canAfford = sinType === "real" || cost <= nuyenRemaining;
  const canSave = formState.name.trim() && canAfford;

  const handleSave = () => {
    if (canSave) {
      onSave(formState);
      setFormState({ name: "", rating: 1, notes: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormState({ name: "", rating: 1, notes: "" });
    onClose();
  };

  const selectLicenseType = (type: string) => {
    setFormState({ ...formState, name: type });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit License" : "New License"}
    >
      <div className="space-y-5">
        {/* License Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            License Name/Type
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="e.g., Firearms License, Driver's License"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            autoFocus
          />
        </div>

        {/* Common license types */}
        <div>
          <label className="mb-2 block text-xs text-zinc-500 dark:text-zinc-400">
            Common license types:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_LICENSE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => selectLicenseType(type)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  formState.name === type
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* License Type (auto-set) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            License Type
          </label>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            {sinType === "fake"
              ? "Fake License (matches fake SIN)"
              : "Real License (matches real SIN)"}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            License type automatically matches the identity&apos;s SIN type.
          </p>
        </div>

        {/* License Rating (for fake only) */}
        {sinType === "fake" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              License Rating
            </label>
            <select
              value={formState.rating}
              onChange={(e) => setFormState({ ...formState, rating: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            >
              {[1, 2, 3, 4].map((r) => (
                <option key={r} value={r}>
                  Rating {r} (¥{(r * LICENSE_COST_PER_RATING).toLocaleString()})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Fake licenses must have a rating between 1-4. Higher ratings are more expensive but
              harder to detect.
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <textarea
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
            placeholder="Additional notes about this license..."
            rows={2}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Save License"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * New Lifestyle Modal
 */
function NewLifestyleModal({
  isOpen,
  onClose,
  onSave,
  nuyenRemaining,
  initialData,
  isEditMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lifestyle: NewLifestyleState) => void;
  nuyenRemaining: number;
  initialData?: NewLifestyleState;
  isEditMode?: boolean;
}) {
  const defaultFormState: NewLifestyleState = {
    type: "",
    location: "",
    customExpenses: 0,
    customIncome: 0,
    notes: "",
    modifications: [],
    subscriptions: [],
  };

  const [formState, setFormState] = useState<NewLifestyleState>(initialData || defaultFormState);

  // Reset form when modal opens with initialData (for edit mode)
  const resetFormOnOpen = useCallback(() => {
    if (isOpen && initialData) {
      setFormState(initialData);
    } else if (isOpen && !initialData) {
      setFormState(defaultFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Use effect to reset form when modal opens
  useMemo(() => {
    resetFormOnOpen();
  }, [resetFormOnOpen]);

  const selectedLifestyle = LIFESTYLE_TYPES.find((l) => l.id === formState.type);

  // Calculate total cost including modifications and subscriptions
  const baseCost = selectedLifestyle?.monthlyCost || 0;
  const modificationsCost = formState.modifications.reduce((sum, mod) => {
    if (mod.modifierType === "percentage") {
      return sum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
    }
    return sum + mod.modifier * (mod.type === "positive" ? 1 : -1);
  }, 0);
  const subscriptionsCost = formState.subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalCost = Math.max(0, baseCost + modificationsCost + subscriptionsCost);

  const canAfford = totalCost <= nuyenRemaining;
  const canSave = formState.type && canAfford;

  // Add modification handler
  const handleAddModification = (mod: LifestyleModification) => {
    setFormState({
      ...formState,
      modifications: [...formState.modifications, mod],
    });
  };

  // Remove modification handler
  const handleRemoveModification = (index: number) => {
    setFormState({
      ...formState,
      modifications: formState.modifications.filter((_, i) => i !== index),
    });
  };

  // Add subscription handler
  const handleAddSubscription = (sub: LifestyleSubscription) => {
    setFormState({
      ...formState,
      subscriptions: [...formState.subscriptions, sub],
    });
  };

  // Remove subscription handler
  const handleRemoveSubscription = (index: number) => {
    setFormState({
      ...formState,
      subscriptions: formState.subscriptions.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (canSave) {
      onSave(formState);
      setFormState({
        type: "",
        location: "",
        customExpenses: 0,
        customIncome: 0,
        notes: "",
        modifications: [],
        subscriptions: [],
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormState({
      type: "",
      location: "",
      customExpenses: 0,
      customIncome: 0,
      notes: "",
      modifications: [],
      subscriptions: [],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Lifestyle" : "New Lifestyle"}
    >
      <div className="space-y-5">
        {/* Lifestyle Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Lifestyle Type *
          </label>
          <select
            value={formState.type}
            onChange={(e) => setFormState({ ...formState, type: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="">Select a lifestyle...</option>
            {LIFESTYLE_TYPES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} (
                {l.monthlyCost === 0 ? "Free" : `¥${l.monthlyCost.toLocaleString()}/month`})
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location (Optional)
          </label>
          <input
            type="text"
            value={formState.location}
            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            placeholder="e.g., Downtown Seattle, Redmond Barrens"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Modifications */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Modifications
            </label>
            <LifestyleModificationSelector
              onAdd={handleAddModification}
              existingModifications={formState.modifications}
            />
          </div>
          {formState.modifications.length > 0 ? (
            <div className="space-y-2">
              {formState.modifications.map((mod, index) => (
                <div
                  key={mod.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{mod.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        mod.type === "positive"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {mod.type === "positive" ? "+" : "-"}
                      {mod.modifierType === "percentage"
                        ? `${mod.modifier}%`
                        : `¥${mod.modifier.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModification(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No modifications added. Click &quot;+ Add Modification&quot; to add lifestyle
              modifications.
            </p>
          )}
        </div>

        {/* Subscriptions */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subscriptions
            </label>
            <LifestyleSubscriptionSelector
              onAdd={handleAddSubscription}
              existingSubscriptions={formState.subscriptions}
            />
          </div>
          {formState.subscriptions.length > 0 ? (
            <div className="space-y-2">
              {formState.subscriptions.map((sub, index) => (
                <div
                  key={sub.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{sub.name}</span>
                    {sub.category && (
                      <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {sub.category}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ¥{sub.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubscription(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No subscriptions added. Click &quot;+ Add Subscription&quot; to add services like
              DocWagon contracts.
            </p>
          )}
        </div>

        {/* Custom Expenses / Income */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Expenses (¥/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customExpenses}
              onChange={(e) =>
                setFormState({ ...formState, customExpenses: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Income (¥/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customIncome}
              onChange={(e) =>
                setFormState({ ...formState, customIncome: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <textarea
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
            placeholder="Additional notes about this lifestyle..."
            rows={2}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Cost Summary */}
        {formState.type && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Monthly Cost Summary
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Base ({selectedLifestyle?.name})</span>
                <span>¥{baseCost.toLocaleString()}</span>
              </div>
              {modificationsCost !== 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Modifications</span>
                  <span
                    className={
                      modificationsCost > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {modificationsCost > 0 ? "+" : ""}¥{modificationsCost.toLocaleString()}
                  </span>
                </div>
              )}
              {subscriptionsCost > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subscriptions</span>
                  <span>+¥{subscriptionsCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-zinc-900 dark:text-zinc-100 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                <span>Total</span>
                <span className={!canAfford ? "text-red-600 dark:text-red-400" : ""}>
                  ¥{totalCost.toLocaleString()}/month
                </span>
              </div>
              {!canAfford && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Exceeds available budget (¥{nuyenRemaining.toLocaleString()} remaining)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Save Lifestyle"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// =============================================================================
// IDENTITY CARD COMPONENT
// =============================================================================

function IdentityCard({
  identity,
  lifestyles,
  onEdit,
  onRemove,
  onAddLicense,
  onEditLicense,
  onRemoveLicense,
  onAddLifestyle,
  onEditLifestyle,
  onRemoveLifestyle,
}: {
  identity: Identity;
  lifestyles: Lifestyle[];
  onEdit: () => void;
  onRemove: () => void;
  onAddLicense: () => void;
  onEditLicense: (licenseIndex: number) => void;
  onRemoveLicense: (licenseIndex: number) => void;
  onAddLifestyle: () => void;
  onEditLifestyle: (lifestyleId: string) => void;
  onRemoveLifestyle: (lifestyleId: string) => void;
}) {
  // Get all lifestyles associated with this identity
  const associatedLifestyles = lifestyles.filter(
    (l) => l.id === identity.associatedLifestyleId || l.associatedIdentityId === identity.id
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-700/50">
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-100">{identity.name}</div>
          {identity.sin.type === "fake" ? (
            <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Fake SIN (Rating {identity.sin.rating})
            </span>
          ) : (
            <span className="mt-1 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Real SIN ({SINNER_QUALITY_LABELS[identity.sin.sinnerQuality!]})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            Edit
          </button>
          <button
            onClick={onRemove}
            className="rounded px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Licenses Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Licenses{identity.licenses?.length ? ` (${identity.licenses.length})` : ""}
            </span>
            <button
              onClick={onAddLicense}
              className="rounded px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add License
            </button>
          </div>

          {identity.licenses && identity.licenses.length > 0 ? (
            <div className="space-y-1.5">
              {identity.licenses.map((license, licenseIndex) => (
                <div
                  key={license.id || licenseIndex}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {license.name}
                      {license.type === "fake" && license.rating && (
                        <span className="ml-1 text-zinc-500">(Rating {license.rating})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditLicense(licenseIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemoveLicense(licenseIndex)}
                      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No licenses added yet. Click &quot;Add License&quot; to add a license to this
              identity.
            </p>
          )}
        </div>

        {/* Associated Lifestyles Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Lifestyles{associatedLifestyles.length ? ` (${associatedLifestyles.length})` : ""}
            </span>
            <button
              onClick={onAddLifestyle}
              className="rounded px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add Lifestyle
            </button>
          </div>

          {associatedLifestyles.length > 0 ? (
            <div className="space-y-1.5">
              {associatedLifestyles.map((lifestyle) => {
                const lifestyleType = LIFESTYLE_TYPES.find((lt) => lt.id === lifestyle.type);
                return (
                  <div
                    key={lifestyle.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-3.5 w-3.5 text-zinc-400" />
                      <div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {lifestyleType?.name || lifestyle.type}
                        </span>
                        {lifestyle.location && (
                          <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
                            ({lifestyle.location})
                          </span>
                        )}
                        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                          ¥{lifestyle.monthlyCost.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditLifestyle(lifestyle.id!)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemoveLifestyle(lifestyle.id!)}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No lifestyles added yet. Click &quot;+ Add Lifestyle&quot; to add a lifestyle for this
              identity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function IdentitiesCard({ state, updateState }: IdentitiesCardProps) {
  const { budgets } = useCreationBudgets();

  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingIdentityIndex, setEditingIdentityIndex] = useState<number | null>(null);
  const [editingLicenseIndex, setEditingLicenseIndex] = useState<number | null>(null);
  const [editingLifestyleId, setEditingLifestyleId] = useState<string | null>(null);

  // Get identities and lifestyles from state
  const identities = useMemo(() => {
    return (state.selections.identities || []) as Identity[];
  }, [state.selections.identities]);

  const lifestyles = useMemo(() => {
    return (state.selections.lifestyles || []) as Lifestyle[];
  }, [state.selections.lifestyles]);

  // Check if character has SINner quality
  const hasSINnerQuality = useMemo(() => {
    const negativeQualitiesList = (state.selections.negativeQualities || []) as string[];
    return negativeQualitiesList.includes("sinner");
  }, [state.selections.negativeQualities]);

  // Get SINner quality level if present
  const sinnerQualityLevel = useMemo(() => {
    if (!hasSINnerQuality) return null;
    const qualityLevels = (state.selections.qualityLevels || {}) as Record<string, number>;
    const sinnerLevel = qualityLevels["sinner"] || 1;
    const levelMap: Record<number, SinnerQuality> = {
      1: SinnerQualityEnum.National,
      2: SinnerQualityEnum.Criminal,
      3: SinnerQualityEnum.CorporateLimited,
      4: SinnerQualityEnum.CorporateBorn,
    };
    return levelMap[sinnerLevel] || SinnerQualityEnum.National;
  }, [hasSINnerQuality, state.selections.qualityLevels]);

  // Check if has real SIN identity (required if SINner quality)
  const hasRealSIN = useMemo(() => {
    return identities.some((id) => id.sin?.type === "real");
  }, [identities]);

  // Calculate total costs
  const totalCosts = useMemo(() => {
    let sinsCost = 0;
    let licensesCost = 0;
    let lifestylesCost = 0;

    identities.forEach((identity) => {
      if (identity.sin?.type === "fake" && identity.sin.rating) {
        sinsCost += identity.sin.rating * SIN_COST_PER_RATING;
      }
      identity.licenses?.forEach((license) => {
        if (license.type === "fake" && license.rating) {
          licensesCost += license.rating * LICENSE_COST_PER_RATING;
        }
      });
    });

    lifestyles.forEach((lifestyle) => {
      lifestylesCost += lifestyle.monthlyCost * (lifestyle.prepaidMonths || 1);
    });

    return {
      sinsCost,
      licensesCost,
      lifestylesCost,
      total: sinsCost + licensesCost + lifestylesCost,
    };
  }, [identities, lifestyles]);

  // Get nuyen remaining
  const nuyenRemaining = budgets["nuyen"]?.remaining ?? 0;

  // Validation
  const needsRealSIN = hasSINnerQuality && !hasRealSIN;

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleAddIdentity = useCallback(
    (newIdentityData: NewIdentityState) => {
      const sin: SIN =
        newIdentityData.sinType === "fake"
          ? { type: "fake", rating: newIdentityData.sinRating }
          : { type: "real", sinnerQuality: sinnerQualityLevel || SinnerQualityEnum.National };

      const identity: Identity = {
        id: `identity-${Date.now()}`,
        name: newIdentityData.name.trim(),
        sin,
        licenses: [],
      };

      updateState({
        selections: {
          ...state.selections,
          identities: [...identities, identity],
        },
      });
    },
    [identities, state.selections, updateState, sinnerQualityLevel]
  );

  const handleRemoveIdentity = useCallback(
    (index: number) => {
      const updatedIdentities = identities.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  const handleAddLicense = useCallback(
    (identityIndex: number, licenseData: NewLicenseState) => {
      const identity = identities[identityIndex];
      const licenseType = identity.sin.type === "fake" ? "fake" : "real";

      const license: License = {
        id: `license-${Date.now()}`,
        type: licenseType,
        name: licenseData.name.trim(),
        rating: licenseType === "fake" ? licenseData.rating : undefined,
        notes: licenseData.notes || undefined,
      };

      const updatedIdentities = [...identities];
      updatedIdentities[identityIndex] = {
        ...identity,
        licenses: [...(identity.licenses || []), license],
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  const handleRemoveLicense = useCallback(
    (identityIndex: number, licenseIndex: number) => {
      const updatedIdentities = [...identities];
      const identity = { ...updatedIdentities[identityIndex] };
      identity.licenses = identity.licenses.filter((_, i) => i !== licenseIndex);
      updatedIdentities[identityIndex] = identity;

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  const handleAddLifestyle = useCallback(
    (identityIndex: number, lifestyleData: NewLifestyleState) => {
      const lifestyleType = LIFESTYLE_TYPES.find((l) => l.id === lifestyleData.type);
      if (!lifestyleType) return;

      const identity = identities[identityIndex];

      const lifestyle: Lifestyle = {
        id: `lifestyle-${Date.now()}`,
        type: lifestyleData.type,
        monthlyCost: lifestyleType.monthlyCost,
        prepaidMonths: 1,
        location: lifestyleData.location || undefined,
        customExpenses: lifestyleData.customExpenses || undefined,
        customIncome: lifestyleData.customIncome || undefined,
        notes: lifestyleData.notes || undefined,
        modifications:
          lifestyleData.modifications.length > 0 ? lifestyleData.modifications : undefined,
        subscriptions:
          lifestyleData.subscriptions.length > 0 ? lifestyleData.subscriptions : undefined,
        // Associate with the identity
        associatedIdentityId: identity.id,
      };

      // Add lifestyle to lifestyles array
      const updatedLifestyles = [...lifestyles, lifestyle];

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [identities, lifestyles, state.selections, updateState]
  );

  const handleRemoveLifestyleById = useCallback(
    (lifestyleId: string) => {
      // Remove lifestyle from lifestyles array
      const updatedLifestyles = lifestyles.filter((l) => l.id !== lifestyleId);

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [lifestyles, state.selections, updateState]
  );

  // Edit handlers
  const handleEditIdentity = useCallback(
    (identityIndex: number, identityData: NewIdentityState) => {
      const oldIdentity = identities[identityIndex];
      const sin: SIN =
        identityData.sinType === "fake"
          ? { type: "fake", rating: identityData.sinRating }
          : { type: "real", sinnerQuality: sinnerQualityLevel || SinnerQualityEnum.National };

      const updatedIdentities = [...identities];
      updatedIdentities[identityIndex] = {
        ...oldIdentity,
        name: identityData.name.trim(),
        sin,
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState, sinnerQualityLevel]
  );

  const handleEditLicense = useCallback(
    (identityIndex: number, licenseIndex: number, licenseData: NewLicenseState) => {
      const identity = identities[identityIndex];
      const licenseType = identity.sin.type === "fake" ? "fake" : "real";
      const oldLicense = identity.licenses[licenseIndex];

      const updatedLicense: License = {
        ...oldLicense,
        type: licenseType,
        name: licenseData.name.trim(),
        rating: licenseType === "fake" ? licenseData.rating : undefined,
        notes: licenseData.notes || undefined,
      };

      const updatedIdentities = [...identities];
      const updatedLicenses = [...identity.licenses];
      updatedLicenses[licenseIndex] = updatedLicense;
      updatedIdentities[identityIndex] = {
        ...identity,
        licenses: updatedLicenses,
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  const handleEditLifestyle = useCallback(
    (lifestyleId: string, lifestyleData: NewLifestyleState) => {
      const lifestyleType = LIFESTYLE_TYPES.find((l) => l.id === lifestyleData.type);
      if (!lifestyleType) return;

      const lifestyleIndex = lifestyles.findIndex((l) => l.id === lifestyleId);
      if (lifestyleIndex === -1) return;

      const oldLifestyle = lifestyles[lifestyleIndex];
      const updatedLifestyle: Lifestyle = {
        ...oldLifestyle, // Preserves id and associatedIdentityId
        type: lifestyleData.type,
        monthlyCost: lifestyleType.monthlyCost,
        location: lifestyleData.location || undefined,
        customExpenses: lifestyleData.customExpenses || undefined,
        customIncome: lifestyleData.customIncome || undefined,
        notes: lifestyleData.notes || undefined,
        modifications:
          lifestyleData.modifications.length > 0 ? lifestyleData.modifications : undefined,
        subscriptions:
          lifestyleData.subscriptions.length > 0 ? lifestyleData.subscriptions : undefined,
      };

      const updatedLifestyles = [...lifestyles];
      updatedLifestyles[lifestyleIndex] = updatedLifestyle;

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [lifestyles, state.selections, updateState]
  );

  // Modal handlers
  const openAddIdentityModal = () => setActiveModal("identity");
  const openAddLicenseModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLicenseIndex(null);
    setActiveModal("license");
  };
  const openAddLifestyleModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLifestyleId(null);
    setActiveModal("lifestyle");
  };

  // Edit modal handlers
  const openEditIdentityModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setActiveModal("edit-identity");
  };
  const openEditLicenseModal = (identityIndex: number, licenseIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLicenseIndex(licenseIndex);
    setActiveModal("edit-license");
  };
  const openEditLifestyleModal = (identityIndex: number, lifestyleId: string) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLifestyleId(lifestyleId);
    setActiveModal("edit-lifestyle");
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingIdentityIndex(null);
    setEditingLicenseIndex(null);
    setEditingLifestyleId(null);
  };

  // Get current identity for modal context
  const currentIdentity = editingIdentityIndex !== null ? identities[editingIdentityIndex] : null;

  // Get current license for edit modal
  const currentLicense =
    editingIdentityIndex !== null && editingLicenseIndex !== null
      ? identities[editingIdentityIndex]?.licenses?.[editingLicenseIndex]
      : null;

  // Get current lifestyle for edit modal
  const currentLifestyle = editingLifestyleId
    ? lifestyles.find((l) => l.id === editingLifestyleId)
    : null;

  return (
    <>
      <CreationCard
        title="Identities & SINs"
        description={`${identities.length} identit${identities.length !== 1 ? "ies" : "y"}${totalCosts.total > 0 ? ` • ¥${totalCosts.total.toLocaleString()}` : ""}`}
        status={needsRealSIN ? "error" : identities.length > 0 ? "valid" : "warning"}
      >
        <div className="space-y-3">
          {/* Cost Summary */}
          {totalCosts.total > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
              <span className="text-zinc-600 dark:text-zinc-400">SINs & Licenses Cost:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                ¥{totalCosts.total.toLocaleString()}
              </span>
            </div>
          )}

          {/* SINner Quality Warning */}
          {needsRealSIN && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300">
                SINner quality requires at least one identity with a real SIN (
                {sinnerQualityLevel && SINNER_QUALITY_LABELS[sinnerQualityLevel]}).
              </span>
            </div>
          )}

          {/* Identities List */}
          {identities.length > 0 && (
            <div className="space-y-3">
              {identities.map((identity, index) => (
                <IdentityCard
                  key={identity.id || index}
                  identity={identity}
                  lifestyles={lifestyles}
                  onEdit={() => openEditIdentityModal(index)}
                  onRemove={() => handleRemoveIdentity(index)}
                  onAddLicense={() => openAddLicenseModal(index)}
                  onEditLicense={(licenseIndex) => openEditLicenseModal(index, licenseIndex)}
                  onRemoveLicense={(licenseIndex) => handleRemoveLicense(index, licenseIndex)}
                  onAddLifestyle={() => openAddLifestyleModal(index)}
                  onEditLifestyle={(lifestyleId) => openEditLifestyleModal(index, lifestyleId)}
                  onRemoveLifestyle={(lifestyleId) => handleRemoveLifestyleById(lifestyleId)}
                />
              ))}
            </div>
          )}

          {/* Add Identity Button */}
          <button
            onClick={openAddIdentityModal}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Identity
          </button>

          {/* Empty state hint */}
          {identities.length === 0 && (
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Every runner needs at least one identity with a SIN.
            </p>
          )}
        </div>
      </CreationCard>

      {/* Modals */}
      {/* Add Identity Modal */}
      <NewIdentityModal
        isOpen={activeModal === "identity"}
        onClose={closeModal}
        onSave={handleAddIdentity}
        hasSINnerQuality={hasSINnerQuality}
        sinnerQualityLevel={sinnerQualityLevel}
        nuyenRemaining={nuyenRemaining}
      />

      {/* Edit Identity Modal */}
      {currentIdentity && editingIdentityIndex !== null && (
        <NewIdentityModal
          isOpen={activeModal === "edit-identity"}
          onClose={closeModal}
          onSave={(identityData) => {
            handleEditIdentity(editingIdentityIndex, identityData);
            closeModal();
          }}
          hasSINnerQuality={hasSINnerQuality}
          sinnerQualityLevel={sinnerQualityLevel}
          nuyenRemaining={nuyenRemaining}
          isEditMode
          initialData={{
            name: currentIdentity.name,
            sinType: currentIdentity.sin.type,
            sinRating: currentIdentity.sin.type === "fake" ? currentIdentity.sin.rating || 1 : 1,
          }}
        />
      )}

      {currentIdentity && (
        <>
          {/* Add License Modal */}
          <NewLicenseModal
            isOpen={activeModal === "license"}
            onClose={closeModal}
            onSave={(license) => handleAddLicense(editingIdentityIndex!, license)}
            sinType={currentIdentity.sin.type}
            nuyenRemaining={nuyenRemaining}
          />

          {/* Edit License Modal */}
          {currentLicense && editingLicenseIndex !== null && (
            <NewLicenseModal
              isOpen={activeModal === "edit-license"}
              onClose={closeModal}
              onSave={(licenseData) => {
                handleEditLicense(editingIdentityIndex!, editingLicenseIndex, licenseData);
                closeModal();
              }}
              sinType={currentIdentity.sin.type}
              nuyenRemaining={nuyenRemaining}
              isEditMode
              initialData={{
                name: currentLicense.name,
                rating: currentLicense.rating || 1,
                notes: currentLicense.notes || "",
              }}
            />
          )}

          {/* Add Lifestyle Modal */}
          <NewLifestyleModal
            isOpen={activeModal === "lifestyle"}
            onClose={closeModal}
            onSave={(lifestyle) => handleAddLifestyle(editingIdentityIndex!, lifestyle)}
            nuyenRemaining={nuyenRemaining}
          />

          {/* Edit Lifestyle Modal */}
          {currentLifestyle && editingLifestyleId && (
            <NewLifestyleModal
              isOpen={activeModal === "edit-lifestyle"}
              onClose={closeModal}
              onSave={(lifestyleData) => {
                handleEditLifestyle(editingLifestyleId, lifestyleData);
                closeModal();
              }}
              nuyenRemaining={nuyenRemaining}
              isEditMode
              initialData={{
                type: currentLifestyle.type,
                location: currentLifestyle.location || "",
                customExpenses: currentLifestyle.customExpenses || 0,
                customIncome: currentLifestyle.customIncome || 0,
                notes: currentLifestyle.notes || "",
                modifications: currentLifestyle.modifications || [],
                subscriptions: currentLifestyle.subscriptions || [],
              }}
            />
          )}
        </>
      )}
    </>
  );
}
