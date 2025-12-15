"use client";

import { useState, useMemo } from "react";
import { Button } from "react-aria-components";
import type { License } from "@/lib/types";

interface LicenseEditorProps {
  license?: License;
  sinType: "fake" | "real";
  onSave: (license: License) => void;
  onCancel: () => void;
}

// Common license type suggestions
const LICENSE_TYPE_SUGGESTIONS = [
  "Firearms License",
  "Magic User License",
  "Driver's License",
  "Vehicle Registration",
  "Restricted Augmentation License",
  "Security License",
  "Corporate License",
  "Bounty Hunter License",
  "Private Investigator License",
  "Bodyguard License",
  "Academic License",
  "Media License",
] as const;

export function LicenseEditor({
  license,
  sinType,
  onSave,
  onCancel,
}: LicenseEditorProps) {
  const [name, setName] = useState(license?.name || "");
  const [type, setType] = useState<"fake" | "real">(license?.type || sinType);
  const [rating, setRating] = useState<number>(license?.rating || 1);
  const [notes, setNotes] = useState(license?.notes || "");

  // License type must match SIN type
  const effectiveType = sinType;

  // Validation
  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (effectiveType === "fake") {
      if (rating < 1 || rating > 4) return false;
    }
    return true;
  }, [name, effectiveType, rating]);

  const handleSave = () => {
    const updatedLicense: License = {
      id: license?.id,
      type: effectiveType,
      name: name.trim(),
      rating: effectiveType === "fake" ? rating : undefined,
      notes: notes.trim() || undefined,
    };

    onSave(updatedLicense);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {license ? "Edit License" : "New License"}
        </h3>

        {/* License Name */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            License Name/Type
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Firearms License, Driver's License"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <div className="mt-2">
            <p className="mb-1 text-xs text-zinc-600 dark:text-zinc-400">
              Common license types:
            </p>
            <div className="flex flex-wrap gap-2">
              {LICENSE_TYPE_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* License Type Display (read-only, matches SIN) */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            License Type
          </label>
          <div className="rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
            {effectiveType === "fake" ? (
              <span className="text-zinc-700 dark:text-zinc-300">
                Fake License (matches fake SIN)
              </span>
            ) : (
              <span className="text-zinc-700 dark:text-zinc-300">
                Real License (matches real SIN)
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            License type automatically matches the identity's SIN type.
          </p>
        </div>

        {/* Fake License Rating */}
        {effectiveType === "fake" && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              License Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number.parseInt(e.target.value, 10))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value={1}>Rating 1</option>
              <option value={2}>Rating 2</option>
              <option value={3}>Rating 3</option>
              <option value={4}>Rating 4</option>
            </select>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Fake licenses must have a rating between 1-4. Higher ratings are more expensive but harder to detect.
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about this license..."
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onPress={onCancel}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSave}
            isDisabled={!isValid}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Save License
          </Button>
        </div>
      </div>
    </div>
  );
}
