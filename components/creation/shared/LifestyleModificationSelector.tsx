"use client";

import { useState } from "react";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import type { LifestyleModification } from "@/lib/types";

interface LifestyleModificationSelectorProps {
  onAdd: (modification: LifestyleModification) => void;
  existingModifications: LifestyleModification[];
}

// Default lifestyle modifications (will be replaced with ruleset data when available)
const DEFAULT_MODIFICATIONS: Array<{
  id: string;
  name: string;
  type: "positive" | "negative";
  modifierType: "percentage" | "fixed";
  modifier: number;
  description: string;
  effects?: string;
}> = [
  {
    id: "special-work-area",
    name: "Special Work Area",
    type: "positive",
    modifierType: "fixed",
    modifier: 1000,
    description: "Dedicated workspace for skill use",
    effects: "+2 limit to relevant skill tests",
  },
  {
    id: "extra-secure",
    name: "Extra Secure",
    type: "positive",
    modifierType: "percentage",
    modifier: 20,
    description: "Enhanced security",
    effects: "Improves security response tier",
  },
  {
    id: "obscure-difficult-to-find",
    name: "Obscure/Difficult to Find",
    type: "positive",
    modifierType: "percentage",
    modifier: 10,
    description: "Hard to locate",
    effects: "-2 dice on intruders' Sneaking tests",
  },
  {
    id: "cramped",
    name: "Cramped",
    type: "negative",
    modifierType: "percentage",
    modifier: 10,
    description: "Limited space",
    effects: "-2 to Logic-linked test limits",
  },
  {
    id: "dangerous-area",
    name: "Dangerous Area",
    type: "negative",
    modifierType: "percentage",
    modifier: 20,
    description: "High crime neighborhood",
    effects: "Degrades security response tier",
  },
  {
    id: "permanent-lifestyle",
    name: "Permanent Lifestyle",
    type: "positive",
    modifierType: "fixed",
    modifier: 0,
    description: "Lifestyle purchased permanently at character creation",
    effects: "One-time payment of 100 × monthly cost. No monthly payments required.",
  },
];

export function LifestyleModificationSelector({
  onAdd,
  existingModifications,
}: LifestyleModificationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableModifications = DEFAULT_MODIFICATIONS.filter(
    (mod) => !existingModifications.some((existing) => existing.catalogId === mod.id)
  );

  const handleSelect = (mod: (typeof DEFAULT_MODIFICATIONS)[0]) => {
    const modification: LifestyleModification = {
      catalogId: mod.id,
      name: mod.name,
      type: mod.type,
      modifierType: mod.modifierType,
      modifier: mod.modifier,
      effects: mod.effects,
    };
    onAdd(modification);
    setIsOpen(false);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className="rounded px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
        + Add Modification
      </Button>
      <Modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Dialog className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {({ close }) => (
            <>
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Select Lifestyle Modification
              </h3>

              {availableModifications.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  All available modifications have been added.
                </p>
              ) : (
                <div className="space-y-2">
                  {availableModifications.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelect(mod)}
                      className="w-full rounded-md border border-zinc-200 bg-white p-4 text-left hover:border-amber-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                              {mod.name}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                mod.type === "positive"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {mod.type === "positive" ? "Positive" : "Negative"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {mod.description}
                          </p>
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              Cost Modifier:{" "}
                            </span>
                            <span className="text-zinc-900 dark:text-zinc-50">
                              {mod.id === "permanent-lifestyle" ? (
                                "One-time payment (100 × monthly cost)"
                              ) : (
                                <>
                                  {mod.type === "positive" ? "+" : "-"}
                                  {mod.modifierType === "percentage"
                                    ? `${mod.modifier}%`
                                    : `${mod.modifier.toLocaleString()}¥`}
                                </>
                              )}
                            </span>
                          </div>
                          {mod.effects && (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Effects: {mod.effects}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onPress={close}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
