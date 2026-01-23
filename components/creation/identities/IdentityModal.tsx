"use client";

import { useState, useCallback, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { SIN_COST_PER_RATING, SINNER_QUALITY_LABELS } from "./constants";
import type { IdentityModalProps, NewIdentityState } from "./types";

export function IdentityModal({
  isOpen,
  onClose,
  onSave,
  hasSINnerQuality,
  sinnerQualityLevel,
  nuyenRemaining,
  initialData,
  isEditMode,
}: IdentityModalProps) {
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {[1, 2, 3, 4].map((r) => (
                <option key={r} value={r}>
                  Rating {r} ({(r * SIN_COST_PER_RATING).toLocaleString()})
                </option>
              ))}
            </select>

            {/* Cost warning */}
            {!canAfford && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Insufficient funds (need {cost.toLocaleString()})</span>
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
