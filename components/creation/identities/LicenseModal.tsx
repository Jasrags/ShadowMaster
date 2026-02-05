"use client";

import { useState, useCallback, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { LICENSE_COST_PER_RATING, COMMON_LICENSE_TYPES } from "./constants";
import type { LicenseModalProps, NewLicenseState } from "./types";

export function LicenseModal({
  isOpen,
  onClose,
  onSave,
  sinType,
  sinRating,
  nuyenRemaining,
  initialData,
  isEditMode,
}: LicenseModalProps) {
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {Array.from({ length: sinRating ?? 6 }, (_, i) => i + 1).map((r) => (
                <option key={r} value={r}>
                  Rating {r} ({(r * LICENSE_COST_PER_RATING).toLocaleString()})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Fake licenses must have a rating between 1-{sinRating ?? 6}. Higher ratings are more
              expensive but harder to detect.
            </p>
            {sinRating !== undefined && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>License rating cannot exceed the SIN rating ({sinRating})</span>
              </div>
            )}
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
