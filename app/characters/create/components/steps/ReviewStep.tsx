"use client";

import { useMemo, useState } from "react";
import { useMetatypes, useSkills, useQualities } from "@/lib/rules";
import type { CreationState, ID } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
  onComplete: (characterId: ID) => void;
}

export function ReviewStep({ state, budgetValues }: StepProps) {
  const metatypes = useMetatypes();
  const { activeSkills, skillGroups } = useSkills();
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const [characterName, setCharacterName] = useState("");

  // Get selected metatype data
  const selectedMetatype = useMemo(() => {
    const metatypeId = state.selections.metatype as string;
    return metatypes.find((m) => m.id === metatypeId);
  }, [metatypes, state.selections.metatype]);

  // Get attributes from state
  const attributes = (state.selections.attributes || {}) as Record<string, number>;
  const selectedSkills = (state.selections.skills || {}) as Record<string, number>;
  const selectedSkillGroups = (state.selections.skillGroups || {}) as Record<string, number>;
  const selectedPositiveQualities = (state.selections.positiveQualities || []) as string[];
  const selectedNegativeQualities = (state.selections.negativeQualities || []) as string[];

  // Calculate totals
  const attrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
  const attrTotal = budgetValues["attribute-points"] || 0;
  const skillSpent = (state.budgets["skill-points-spent"] as number) || 0;
  const skillTotal = budgetValues["skill-points"] || 0;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;

  // Validation checks
  const validationIssues = useMemo(() => {
    const issues: { type: "error" | "warning"; message: string }[] = [];

    if (!characterName.trim()) {
      issues.push({ type: "warning", message: "Character name not set" });
    }

    if (Object.keys(state.priorities || {}).length < 5) {
      issues.push({ type: "error", message: "Priorities incomplete" });
    }

    if (!state.selections.metatype) {
      issues.push({ type: "error", message: "Metatype not selected" });
    }

    if (attrTotal > 0 && attrSpent < attrTotal - 5) {
      issues.push({ type: "warning", message: `${attrTotal - attrSpent} attribute points unspent` });
    }

    if (skillTotal > 0 && skillSpent < skillTotal * 0.5) {
      issues.push({ type: "warning", message: "Many skill points remaining" });
    }

    return issues;
  }, [characterName, state.priorities, state.selections.metatype, attrTotal, attrSpent, skillTotal, skillSpent]);

  const hasErrors = validationIssues.some((i) => i.type === "error");

  return (
    <div className="space-y-6">
      {/* Character Name Input */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Character Name</span>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter your character's name..."
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Priorities */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Priorities</h3>
          <div className="mt-3 space-y-2">
            {Object.entries(state.priorities || {}).map(([category, level]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize text-zinc-600 dark:text-zinc-400">{category}</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {String(level)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metatype & Magic */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Identity</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Metatype</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {selectedMetatype?.name || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Path</span>
              <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {typeof state.selections["magical-path"] === "string"
                  ? state.selections["magical-path"].replace("-", " ")
                  : "Mundane"}
              </span>
            </div>
          </div>
        </div>

        {/* Resource Summary */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Resources Used</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Attributes</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {attrSpent} / {attrTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Skills</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {skillSpent} / {skillTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Karma</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {(budgetValues["karma"] || 25) + karmaGainedNegative - karmaSpentPositive}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Nuyen</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                ¥{(budgetValues["nuyen"] || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      {Object.keys(attributes).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Attributes</h3>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {["body", "agility", "reaction", "strength", "willpower", "logic", "intuition", "charisma"].map((attr) => {
              const metatypeAttr = selectedMetatype?.attributes[attr];
              const minValue = metatypeAttr && "min" in metatypeAttr ? metatypeAttr.min : 1;
              return (
                <div key={attr} className="rounded bg-zinc-100 p-2 text-center dark:bg-zinc-700">
                  <div className="text-[10px] font-medium uppercase text-zinc-500 dark:text-zinc-400">
                    {attr.slice(0, 3)}
                  </div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {attributes[attr] || minValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {Object.keys(selectedSkills).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Skills ({Object.keys(selectedSkills).length})
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(selectedSkills)
              .sort(([, a], [, b]) => b - a)
              .map(([skillId, rating]) => {
                const skill = activeSkills.find((s) => s.id === skillId);
                return (
                  <div
                    key={skillId}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm dark:bg-emerald-900/50"
                  >
                    <span className="font-medium text-emerald-800 dark:text-emerald-200">
                      {skill?.name || skillId}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">{rating}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Skill Groups */}
      {Object.keys(selectedSkillGroups).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Skill Groups</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(selectedSkillGroups).map(([groupId, rating]) => {
              const group = skillGroups.find((g) => g.id === groupId);
              return (
                <div
                  key={groupId}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900/50"
                >
                  <span className="font-medium text-purple-800 dark:text-purple-200">
                    {group?.name || groupId}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400">{rating}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Qualities */}
      {(selectedPositiveQualities.length > 0 || selectedNegativeQualities.length > 0) && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Qualities</h3>
          <div className="mt-3 space-y-3">
            {selectedPositiveQualities.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">Positive</div>
                <div className="flex flex-wrap gap-2">
                  {selectedPositiveQualities.map((qId) => {
                    const quality = positiveQualities.find((q) => q.id === qId);
                    return (
                      <span
                        key={qId}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                      >
                        {quality?.name || qId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedNegativeQualities.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium text-amber-600 dark:text-amber-400">Negative</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNegativeQualities.map((qId) => {
                    const quality = negativeQualities.find((q) => q.id === qId);
                    return (
                      <span
                        key={qId}
                        className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                      >
                        {quality?.name || qId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Status */}
      <div
        className={`rounded-lg p-4 ${
          hasErrors
            ? "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            : validationIssues.length > 0
            ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
            : "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
        }`}
      >
        <h3
          className={`text-sm font-semibold ${
            hasErrors
              ? "text-red-800 dark:text-red-200"
              : validationIssues.length > 0
              ? "text-amber-800 dark:text-amber-200"
              : "text-emerald-800 dark:text-emerald-200"
          }`}
        >
          {hasErrors ? "Issues to Resolve" : validationIssues.length > 0 ? "Warnings" : "Ready to Create"}
        </h3>
        {validationIssues.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {validationIssues.map((issue, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 text-sm ${
                  issue.type === "error"
                    ? "text-red-700 dark:text-red-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {issue.type === "error" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {issue.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
            Your character is complete and ready to be created!
          </p>
        )}
      </div>
    </div>
  );
}
