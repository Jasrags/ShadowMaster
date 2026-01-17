"use client";

/**
 * SkillGroupBreakModal
 *
 * Warning modal displayed before breaking a skill group.
 * Shows the consequences of breaking and the action being applied.
 *
 * SR5 Rules:
 * - Skill groups can only be broken using karma (not skill points)
 * - When broken, all member skills become individual skills at the group rating
 * - Groups can be restored when all member skills reach equal ratings
 */

import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { AlertTriangle, Users, Sparkles } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillGroupBreakChanges {
  /** New rating for the triggering skill (if raising) */
  newRating?: number;
  /** Specializations being added (if any) */
  specializations?: string[];
  /** Total karma cost for the changes */
  karmaCost: number;
}

interface SkillGroupBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Name of the skill being customized */
  skillName: string;
  /** ID of the skill being customized */
  skillId: string;
  /** Name of the group being broken */
  groupName: string;
  /** ID of the group being broken */
  groupId: string;
  /** Current rating of the group */
  currentRating: number;
  /** All skills in the group (id and name) */
  memberSkills: Array<{ id: string; name: string }>;
  /** Changes being applied */
  changes: SkillGroupBreakChanges;
  /** Available karma for validation display */
  availableKarma: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillGroupBreakModal({
  isOpen,
  onClose,
  onConfirm,
  skillName,
  skillId,
  groupName,
  currentRating,
  memberSkills,
  changes,
  availableKarma,
}: SkillGroupBreakModalProps) {
  const isOverBudget = changes.karmaCost > availableKarma;

  // Build description of what's being applied
  const changeDescriptions: string[] = [];
  if (changes.newRating && changes.newRating > currentRating) {
    changeDescriptions.push(`Raising ${skillName} from ${currentRating} to ${changes.newRating}`);
  }
  if (changes.specializations && changes.specializations.length > 0) {
    changeDescriptions.push(
      `Adding specialization${changes.specializations.length > 1 ? "s" : ""}: ${changes.specializations.join(", ")}`
    );
  }

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="md">
      {({ close }) => (
        <>
          <ModalHeader title="Breaking Skill Group" onClose={close} showCloseButton>
            <AlertTriangle className="ml-2 h-5 w-5 text-amber-500" />
          </ModalHeader>

          <ModalBody className="p-6">
            <div className="space-y-4">
              {/* Explanation */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Customizing <strong>{skillName}</strong> will break the{" "}
                  <strong>{groupName}</strong> skill group.
                </p>
              </div>

              {/* What happens section */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  What happens when you break a group:
                </h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>
                    All skills in this group will become individual skills at rating{" "}
                    <strong className="text-zinc-900 dark:text-zinc-100">{currentRating}</strong>
                  </li>
                  <li>
                    The group can be restored later if all member skills reach the same rating
                  </li>
                  <li>Skill group points already spent remain spent</li>
                </ul>
              </div>

              {/* Member skills list */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Skills in {groupName}:
                </h3>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="flex flex-wrap gap-1.5">
                    {memberSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                          skill.id === skillId
                            ? "bg-purple-100 font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {skill.id === skillId && <Sparkles className="h-3 w-3" />}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action being applied */}
              {changeDescriptions.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Changes being applied:
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {changeDescriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cost summary */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Karma Cost
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isOverBudget
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {changes.karmaCost} karma
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Available</span>
                  <span
                    className={
                      isOverBudget
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-600 dark:text-zinc-300"
                    }
                  >
                    {availableKarma} karma
                  </span>
                </div>
                {isOverBudget && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Not enough karma to make these changes.
                  </p>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end gap-2">
              <button
                onClick={close}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isOverBudget}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isOverBudget
                    ? "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                <Users className="h-4 w-4" />
                Break Group & Apply
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
