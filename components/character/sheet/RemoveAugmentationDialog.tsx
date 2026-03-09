"use client";

import type { CyberwareItem, BiowareItem } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

interface RemoveAugmentationDialogProps {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  isAwakened?: boolean;
  isTechnomancer?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function RemoveAugmentationDialog({
  item,
  type,
  isAwakened,
  isTechnomancer,
  onConfirm,
  onCancel,
  loading,
}: RemoveAugmentationDialogProps) {
  const essenceRestored = item.essenceCost ?? 0;
  const hasEssenceHoleWarning = (isAwakened || isTechnomancer) && essenceRestored > 0;

  return (
    <BaseModalRoot isOpen onClose={onCancel} size="sm">
      {({ close }) => (
        <>
          <ModalHeader title="Remove Augmentation" onClose={close} />
          <ModalBody>
            <div className="space-y-3">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Remove <span className="font-semibold">{item.name}</span>?
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <span>
                  Grade{" "}
                  <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                    {item.grade}
                  </span>
                </span>
                <span>
                  Essence restored{" "}
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    +{essenceRestored.toFixed(2)}
                  </span>
                </span>
                <span>
                  Type{" "}
                  <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                    {type}
                  </span>
                </span>
              </div>

              {hasEssenceHoleWarning && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/50">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {isAwakened ? "Magic" : "Resonance"} will <strong>not</strong> be restored.
                    Essence holes from prior augmentation are permanent.
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={close}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Removing..." : "Remove"}
            </button>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
