"use client";

import { useMemo, useCallback, useState } from "react";
import { Check, X, Sparkles, Zap, User } from "lucide-react";
import { PATH_INFO, AWAKENED_PATHS, EMERGED_PATHS } from "./constants";
import type { MagicPathModalProps, PathOption } from "./types";

export function MagicPathModal({
  isOpen,
  onClose,
  onConfirm,
  availableOptions,
  priorityLevel,
  currentSelection,
  magicPaths,
}: MagicPathModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentSelection);

  // Reset selection when modal closes
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

  // Group available paths
  const groupedPaths = useMemo(() => {
    const awakened: PathOption[] = [];
    const emerged: PathOption[] = [];

    availableOptions.forEach((opt) => {
      if (AWAKENED_PATHS.includes(opt.path)) {
        awakened.push(opt);
      } else if (EMERGED_PATHS.includes(opt.path)) {
        emerged.push(opt);
      }
    });

    return { awakened, emerged };
  }, [availableOptions]);

  if (!isOpen) return null;

  const renderPathOption = (option: PathOption, isResonance: boolean) => {
    const pathInfo = magicPaths.find((p) => p.id === option.path);
    if (!pathInfo) return null;

    const info = PATH_INFO[option.path];
    const isSelected = selectedId === option.path;
    const rating = option.magicRating || option.resonanceRating || 0;

    return (
      <button
        key={option.path}
        onClick={() => setSelectedId(option.path)}
        className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
          isSelected
            ? isResonance
              ? "border-cyan-500 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20"
              : "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
            : "border-zinc-200 bg-white hover:border-purple-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-purple-500"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center gap-3">
          {/* Radio indicator */}
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isSelected
                ? isResonance
                  ? "border-cyan-500 bg-cyan-500 text-white"
                  : "border-purple-500 bg-purple-500 text-white"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>

          <span
            className={`text-base font-semibold uppercase ${
              isSelected
                ? isResonance
                  ? "text-cyan-900 dark:text-cyan-100"
                  : "text-purple-900 dark:text-purple-100"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {pathInfo.name}
          </span>

          {/* Rating badge */}
          <span
            className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${
              isResonance
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
            }`}
          >
            {isResonance ? "Resonance" : "Magic"} {rating}
          </span>
        </div>

        {/* Description */}
        {info && (
          <>
            <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">{info.description}</p>
            <p className="mt-1 pl-8 text-xs text-zinc-500 dark:text-zinc-500">
              {info.features.join(" • ")}
            </p>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            SELECT MAGICAL PATH
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
            Available at Priority {priorityLevel}
          </p>
        </div>

        {/* Path list */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="space-y-4">
            {/* AWAKENED section */}
            {groupedPaths.awakened.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Awakened
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedPaths.awakened.map((opt) => renderPathOption(opt, false))}
                </div>
              </div>
            )}

            {/* EMERGED section */}
            {groupedPaths.emerged.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Emerged
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedPaths.emerged.map((opt) => renderPathOption(opt, true))}
                </div>
              </div>
            )}

            {/* MUNDANE section */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Mundane
                </span>
              </div>
              <button
                onClick={() => setSelectedId("mundane")}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedId === "mundane"
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                    : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-emerald-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selectedId === "mundane"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {selectedId === "mundane" && <Check className="h-3 w-3" />}
                  </div>
                  <span
                    className={`text-base font-semibold uppercase ${
                      selectedId === "mundane"
                        ? "text-emerald-900 dark:text-emerald-100"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    No Magical Abilities
                  </span>
                </div>
                <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">
                  {PATH_INFO.mundane.description}
                </p>
                <p className="mt-1 pl-8 text-xs text-zinc-500 dark:text-zinc-500">
                  {PATH_INFO.mundane.features.join(" • ")}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
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
