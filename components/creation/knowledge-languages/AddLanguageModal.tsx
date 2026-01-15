"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useSkills } from "@/lib/rules";
import type { AddLanguageModalProps } from "./types";

export function AddLanguageModal({
  isOpen,
  onClose,
  onAdd,
  existingLanguages,
  hasNativeLanguage,
  pointsRemaining,
}: AddLanguageModalProps) {
  const [name, setName] = useState("");
  const { exampleLanguages } = useSkills();

  // Filter out already-added languages
  const availableExamples = useMemo(() => {
    if (!exampleLanguages) return [];
    return exampleLanguages.filter((lang) => !existingLanguages.includes(lang.name));
  }, [exampleLanguages, existingLanguages]);

  const handleSelectFromDropdown = (langName: string) => {
    setName(langName);
  };

  const handleAddAsNative = () => {
    if (name.trim()) {
      onAdd(name.trim(), 0, true);
      setName("");
      onClose();
    }
  };

  const handleAdd = () => {
    if (name.trim() && pointsRemaining > 0) {
      onAdd(name.trim(), 1, false);
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Add Language</h3>
          <button
            onClick={handleClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Quick select dropdown */}
            {availableExamples.length > 0 && (
              <div>
                <select
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-800 dark:text-zinc-100"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectFromDropdown(e.target.value);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Quick select from examples...
                  </option>
                  {availableExamples.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                      {lang.name}
                      {lang.region ? ` (${lang.region})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom input with buttons */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Or type custom language..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddAsNative}
                  disabled={!name.trim() || hasNativeLanguage}
                  className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && !hasNativeLanguage
                      ? "bg-zinc-600 text-white hover:bg-zinc-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add as Native
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || pointsRemaining <= 0}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && pointsRemaining > 0
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info text */}
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {!hasNativeLanguage ? (
                <p>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Native language
                  </span>{" "}
                  is free and has no rating. Other languages cost 1 point per rating.
                </p>
              ) : (
                <p>
                  Languages cost 1 knowledge point per rating level.{" "}
                  <span className="font-medium">{pointsRemaining} points remaining.</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
