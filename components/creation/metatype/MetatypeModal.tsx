"use client";

import { useCallback, useState } from "react";
import { Check, X } from "lucide-react";
import { METATYPE_DESCRIPTIONS } from "./constants";
import type { MetatypeModalProps } from "./types";

export function MetatypeModal({
  isOpen,
  onClose,
  onConfirm,
  metatypes,
  priorityLevel,
  currentSelection,
}: MetatypeModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentSelection);

  // Reset selection when modal opens
  const handleClose = useCallback(() => {
    setSelectedId(currentSelection);
    onClose();
  }, [currentSelection, onClose]);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onConfirm(selectedId);
      onClose();
    }
  }, [selectedId, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            SELECT METATYPE
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Priority info */}
        <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Available at Priority {priorityLevel}:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {metatypes.length === 5
                ? "All metatypes"
                : `${metatypes.length} metatype${metatypes.length !== 1 ? "s" : ""}`}
            </span>
          </p>
        </div>

        {/* Metatype list */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="space-y-2">
            {metatypes.map((metatype) => {
              const isSelected = selectedId === metatype.id;
              const description = METATYPE_DESCRIPTIONS[metatype.id] || metatype.description || "";

              return (
                <button
                  key={metatype.id}
                  onClick={() => setSelectedId(metatype.id)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                      : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-500"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>

                    <span
                      className={`text-base font-semibold uppercase ${
                        isSelected
                          ? "text-emerald-900 dark:text-emerald-100"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {metatype.name}
                    </span>
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mt-3 space-y-1 pl-8 text-sm">
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <span className="font-medium">Special Attribute Points:</span>{" "}
                      {metatype.specialAttributePoints}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <span className="font-medium">Racial Traits:</span>{" "}
                      {metatype.racialTraits.length > 0 ? metatype.racialTraits.join(", ") : "None"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedId
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
