"use client";

/**
 * AddModifierModal
 *
 * Modal for adding active modifiers to a character.
 * Supports both template selection and custom modifier creation.
 *
 * @see Issue #114
 */

import { useState } from "react";
import type { ActiveModifier } from "@/lib/types/effects";
import {
  MODIFIER_TEMPLATES,
  type ModifierCategory,
  type DurationPreset,
  type ModifierTemplate,
} from "@/lib/rules/modifiers";
import { BaseModal, ModalBody, ModalFooter } from "@/components/ui/BaseModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AddModifierModalProps {
  characterId: string;
  onClose: () => void;
  onModifierAdded: (modifier: ActiveModifier) => void;
}

type ModalMode = "templates" | "custom";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<ModifierCategory, string> = {
  cover: "Cover",
  visibility: "Visibility",
  environmental: "Environmental",
  social: "Social",
  combat: "Combat",
  magic: "Magic",
};

const CATEGORY_ORDER: ModifierCategory[] = [
  "cover",
  "visibility",
  "environmental",
  "combat",
  "social",
  "magic",
];

const DURATION_LABELS: Record<DurationPreset, string> = {
  "combat-turn": "Combat Turn (12s)",
  minute: "1 Minute",
  scene: "Scene",
  hour: "1 Hour",
  permanent: "Permanent",
};

const EFFECT_TYPE_OPTIONS = [
  { value: "dice-pool-modifier", label: "Dice Pool" },
  { value: "limit-modifier", label: "Limit" },
  { value: "threshold-modifier", label: "Threshold" },
  { value: "initiative-modifier", label: "Initiative" },
  { value: "accuracy-modifier", label: "Accuracy" },
  { value: "armor-modifier", label: "Armor" },
] as const;

const TRIGGER_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "combat-action", label: "Combat" },
  { value: "ranged-attack", label: "Ranged Attack" },
  { value: "melee-attack", label: "Melee Attack" },
  { value: "defense-test", label: "Defense" },
  { value: "social-test", label: "Social" },
  { value: "magic-use", label: "Magic" },
  { value: "matrix-action", label: "Matrix" },
  { value: "perception-visual", label: "Visual Perception" },
  { value: "perception-audio", label: "Audio Perception" },
  { value: "skill-test", label: "Skill Test" },
] as const;

const SOURCE_OPTIONS = [
  { value: "gm", label: "GM" },
  { value: "environment", label: "Environment" },
  { value: "condition", label: "Condition" },
  { value: "temporary", label: "Temporary" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByCategory(templates: ModifierTemplate[]): Map<ModifierCategory, ModifierTemplate[]> {
  const grouped = new Map<ModifierCategory, ModifierTemplate[]>();
  for (const t of templates) {
    const list = grouped.get(t.category) || [];
    list.push(t);
    grouped.set(t.category, list);
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AddModifierModal({ characterId, onClose, onModifierAdded }: AddModifierModalProps) {
  const [mode, setMode] = useState<ModalMode>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<ModifierTemplate | null>(null);
  const [duration, setDuration] = useState<DurationPreset>("scene");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom mode fields
  const [customName, setCustomName] = useState("");
  const [customSource, setCustomSource] = useState<string>("gm");
  const [customEffectType, setCustomEffectType] = useState<string>("dice-pool-modifier");
  const [customTrigger, setCustomTrigger] = useState<string>("always");
  const [customValue, setCustomValue] = useState<number>(-2);

  const grouped = groupByCategory(MODIFIER_TEMPLATES);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      const body =
        mode === "templates" && selectedTemplate
          ? {
              templateId: selectedTemplate.id,
              source: selectedTemplate.source,
              duration,
              notes: notes || undefined,
            }
          : {
              name: customName,
              source: customSource,
              effect: {
                type: customEffectType,
                triggers: [customTrigger],
                value: customValue,
              },
              duration,
              notes: notes || undefined,
            };

      const res = await fetch(`/api/characters/${characterId}/modifiers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add modifier");
        return;
      }

      onModifierAdded(data.modifier);
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = mode === "templates" ? selectedTemplate !== null : customName.trim().length > 0;

  return (
    <BaseModal isOpen onClose={onClose} title="Add Modifier" size="lg">
      <ModalBody className="p-6">
        {/* Mode toggle */}
        <div className="mb-4 flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
          <button
            onClick={() => setMode("templates")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "templates"
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "custom"
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Custom
          </button>
        </div>

        {mode === "templates" ? (
          /* ─── Templates Mode ─────────────────────────────────────── */
          <div className="space-y-3">
            {CATEGORY_ORDER.filter((cat) => grouped.has(cat)).map((cat) => (
              <div key={cat}>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {CATEGORY_LABELS[cat]}
                </div>
                <div className="space-y-1">
                  {grouped.get(cat)!.map((template) => {
                    const value =
                      typeof template.effect.value === "number" ? template.effect.value : 0;
                    const isSelected = selectedTemplate?.id === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setDuration(template.defaultDuration);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}
                      >
                        <span className="flex-1 text-sm text-zinc-800 dark:text-zinc-200">
                          {template.name}
                        </span>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            value > 0
                              ? "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
                              : "border-red-500/20 bg-red-500/12 text-red-600 dark:text-red-300"
                          }`}
                        >
                          {value > 0 ? "+" : ""}
                          {value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ─── Custom Mode ────────────────────────────────────────── */
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Suppressive Fire"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              />
            </div>

            {/* Source */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Source</label>
              <select
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {SOURCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Effect type + Trigger row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Effect Type</label>
                <select
                  value={customEffectType}
                  onChange={(e) => setCustomEffectType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {EFFECT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Trigger</label>
                <select
                  value={customTrigger}
                  onChange={(e) => setCustomTrigger(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {TRIGGER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Value</label>
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>
        )}

        {/* Shared fields: duration + notes */}
        <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as DurationPreset)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {Object.entries(DURATION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., From spirit concealment"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Applying..." : "Apply"}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}
