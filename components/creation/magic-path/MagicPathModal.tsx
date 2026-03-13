"use client";

import { useMemo, useCallback, useState } from "react";
import { Check, Sparkles, Zap, User } from "lucide-react";
import { Heading } from "react-aria-components";
import { BaseModalRoot, ModalFooter } from "@/components/ui/BaseModal";
import { PATH_INFO, AWAKENED_PATHS, EMERGED_PATHS } from "./constants";
import type { MagicPathModalProps, PathOption } from "./types";

// ─── Detail Panel ────────────────────────────────────────────────────────────

function PathDetailPanel({
  option,
  magicPaths,
}: {
  option: PathOption | null;
  magicPaths: Array<{ id: string; name: string; hasResonance?: boolean }>;
}) {
  if (!option) {
    return (
      <div className="flex h-full items-center justify-center text-sm italic text-zinc-500">
        Select a path to see details
      </div>
    );
  }

  const pathInfo = magicPaths.find((p) => p.id === option.path);
  const info = PATH_INFO[option.path];
  const isResonance = EMERGED_PATHS.includes(option.path);
  const rating = option.magicRating || option.resonanceRating || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
          {pathInfo?.name || option.path}
        </h3>
        <div className="mt-1.5 flex gap-1.5">
          <span
            className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
              isResonance
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
            }`}
          >
            {isResonance ? "Emerged" : "Awakened"}
          </span>
        </div>
      </div>

      {/* Rating chip */}
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <span className="text-zinc-500">{isResonance ? "Resonance" : "Magic"}</span>
          <span
            className={`font-mono font-semibold ${
              isResonance
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-purple-600 dark:text-purple-400"
            }`}
          >
            {rating}
          </span>
        </div>
      </div>

      {/* Description */}
      {info && (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {info.description}
        </p>
      )}

      {/* Features */}
      {info && info.features.length > 0 && (
        <div>
          <div className="mb-2 border-b border-zinc-200 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700">
            Features
          </div>
          <ul className="space-y-1.5">
            {info.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    isResonance ? "bg-cyan-500" : "bg-purple-500"
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MundaneDetailPanel() {
  const info = PATH_INFO.mundane;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
          No Magical Abilities
        </h3>
        <div className="mt-1.5 flex gap-1.5">
          <span className="inline-flex rounded bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            Mundane
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{info.description}</p>

      {/* Features */}
      {info.features.length > 0 && (
        <div>
          <div className="mb-2 border-b border-zinc-200 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700">
            Features
          </div>
          <ul className="space-y-1.5">
            {info.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

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

  // Get the selected option for detail panel
  const selectedOption = useMemo(() => {
    if (!selectedId || selectedId === "mundane") return null;
    return availableOptions.find((opt) => opt.path === selectedId) ?? null;
  }, [selectedId, availableOptions]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full">
      {({ close }) => (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <Heading
              slot="title"
              className="text-lg font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
            >
              Select Magical Path
            </Heading>
            <button
              onClick={close}
              aria-label="Close modal"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Priority info bar */}
          {priorityLevel && (
            <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Available at Priority {priorityLevel}
              </p>
            </div>
          )}

          {/* Two-panel body */}
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            {/* Left panel: browse list */}
            <div className="max-h-[200px] w-full shrink-0 overflow-y-auto border-b border-zinc-200 bg-zinc-50 sm:max-h-none sm:w-60 sm:border-b-0 sm:border-r dark:border-zinc-700 dark:bg-zinc-800/30 [scrollbar-width:thin]">
              {/* AWAKENED section */}
              {groupedPaths.awakened.length > 0 && (
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-1.5 bg-zinc-100/80 px-4 py-2 backdrop-blur-sm dark:bg-zinc-800/80">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                      Awakened
                    </span>
                    <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-600">
                      ({groupedPaths.awakened.length})
                    </span>
                  </div>
                  {groupedPaths.awakened.map((opt) => {
                    const pathInfo = magicPaths.find((p) => p.id === opt.path);
                    const isSelected = selectedId === opt.path;
                    const rating = opt.magicRating || opt.resonanceRating || 0;
                    return (
                      <button
                        key={opt.path}
                        onClick={() => setSelectedId(opt.path)}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        <div
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-purple-500 bg-purple-500"
                              : "border-zinc-300 dark:border-zinc-600"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className="flex-1 font-medium">{pathInfo?.name || opt.path}</span>
                        <span
                          className={`font-mono text-xs ${
                            isSelected
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-zinc-400 dark:text-zinc-600"
                          }`}
                        >
                          {rating}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* EMERGED section */}
              {groupedPaths.emerged.length > 0 && (
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-1.5 bg-zinc-100/80 px-4 py-2 backdrop-blur-sm dark:bg-zinc-800/80">
                    <Zap className="h-3 w-3 text-cyan-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                      Emerged
                    </span>
                    <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-600">
                      ({groupedPaths.emerged.length})
                    </span>
                  </div>
                  {groupedPaths.emerged.map((opt) => {
                    const pathInfo = magicPaths.find((p) => p.id === opt.path);
                    const isSelected = selectedId === opt.path;
                    const rating = opt.magicRating || opt.resonanceRating || 0;
                    return (
                      <button
                        key={opt.path}
                        onClick={() => setSelectedId(opt.path)}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        <div
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-zinc-300 dark:border-zinc-600"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className="flex-1 font-medium">{pathInfo?.name || opt.path}</span>
                        <span
                          className={`font-mono text-xs ${
                            isSelected
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-zinc-400 dark:text-zinc-600"
                          }`}
                        >
                          {rating}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MUNDANE section */}
              <div>
                <div className="sticky top-0 z-10 flex items-center gap-1.5 bg-zinc-100/80 px-4 py-2 backdrop-blur-sm dark:bg-zinc-800/80">
                  <User className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Mundane
                  </span>
                </div>
                <button
                  onClick={() => setSelectedId("mundane")}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                    selectedId === "mundane"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selectedId === "mundane"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {selectedId === "mundane" && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="flex-1 font-medium">No Magical Abilities</span>
                </button>
              </div>
            </div>

            {/* Right panel: detail */}
            <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
              {selectedId === "mundane" ? (
                <MundaneDetailPanel />
              ) : (
                <PathDetailPanel option={selectedOption} magicPaths={magicPaths} />
              )}
            </div>
          </div>

          {/* Footer */}
          <ModalFooter className="bg-zinc-50 dark:bg-zinc-800/50">
            <div className="text-sm text-zinc-500">
              {selectedId ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      selectedId === "mundane"
                        ? "bg-emerald-500"
                        : EMERGED_PATHS.includes(selectedId)
                          ? "bg-cyan-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <span>
                    Selected:{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      {selectedId === "mundane"
                        ? "Mundane"
                        : magicPaths.find((p) => p.id === selectedId)?.name || selectedId}
                    </strong>
                  </span>
                </div>
              ) : (
                <span>Choose a magical path</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedId
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                Confirm
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
