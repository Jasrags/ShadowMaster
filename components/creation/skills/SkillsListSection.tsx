"use client";

/**
 * SkillsListSection
 *
 * Renders the skill groups list and individual skills list within the SkillsCard.
 * Includes add buttons, empty states, and rating controls.
 */

import { Plus } from "lucide-react";
import { getGroupRating, isGroupBroken } from "@/lib/rules/skills/group-utils";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import { SkillListItem } from "./SkillListItem";
import { SkillGroupCard } from "./SkillGroupCard";
import type { UseSkillsCardHandlersResult, SkillListEntry } from "./useSkillsCardHandlers";
import { MAX_GROUP_RATING } from "./useSkillsCardHandlers";
import type { UseGroupBreakingResult } from "./useGroupBreaking";
import type { UseKarmaPurchaseResult } from "./useKarmaPurchase";
import type { UseSkillDesignationsResult } from "./useSkillDesignations";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillsListSectionProps {
  /** Total skill group points from priority */
  skillGroupPoints: number;
  /** Current skill group selections */
  groups: Record<string, SkillGroupValue>;
  /** Merged and sorted list of all skills */
  allSkillsSorted: SkillListEntry[];
  /** Handler hook result */
  handlers: UseSkillsCardHandlersResult;
  /** Group breaking hook result */
  groupBreaking: UseGroupBreakingResult;
  /** Karma purchase hook result */
  karmaPurchase: UseKarmaPurchaseResult;
  /** Skill designations hook result */
  designations: UseSkillDesignationsResult;
  /** Remaining skill points */
  skillPointsRemaining: number;
  /** Remaining karma points */
  karmaRemaining: number;
  /** Open group modal callback */
  onOpenGroupModal: () => void;
  /** Open skill modal callback */
  onOpenSkillModal: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillsListSection({
  skillGroupPoints,
  groups,
  allSkillsSorted,
  handlers,
  groupBreaking,
  karmaPurchase,
  designations,
  skillPointsRemaining,
  karmaRemaining,
  onOpenGroupModal,
  onOpenSkillModal,
}: SkillsListSectionProps) {
  const {
    getGroupData,
    getSkillData,
    getMaxRating,
    handleGroupRatingChange,
    handleRemoveGroup,
    handleSkillRatingChange,
    handleRemoveSkill,
    handleRemoveSpecialization,
    handleOpenSpecModal,
  } = handlers;

  const { restorableGroups, handleRestoreGroup, handleOpenCustomize } = groupBreaking;
  const {
    getGroupPurchaseMode,
    getPurchaseMode,
    handleOpenKarmaConfirm,
    handleOpenGroupKarmaConfirm,
  } = karmaPurchase;
  const {
    designatedSkillIds,
    freeSkillIds,
    freeSkillAllocationStatuses,
    hasFreeSkillConfigs,
    canSkillBeDesignated,
    handleDesignateSkillFromList,
    handleUndesignateSkill,
    getSkillFreeRating,
  } = designations;

  const hasSelectedGroups = Object.keys(groups).length > 0;

  return (
    <>
      {/* Skill Groups Section */}
      {skillGroupPoints > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Skill Groups
            </h4>
            <button
              onClick={onOpenGroupModal}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Group
            </button>
          </div>
          {hasSelectedGroups ? (
            <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
              {Object.entries(groups).map(([groupId, groupValue]) => {
                const groupData = getGroupData(groupId);
                if (!groupData) return null;

                const broken = isGroupBroken(groupValue);
                const rating = getGroupRating(groupValue);
                const skillsInGroup = groupData.skills
                  .map((skillId) => getSkillData(skillId))
                  .filter(Boolean) as {
                  id: string;
                  name: string;
                  linkedAttribute: string;
                }[];

                // Check if this broken group can be restored
                const canRestore = broken && restorableGroups.some((g) => g.groupId === groupId);

                // Determine purchase mode for this group
                const groupPurchaseInfo = getGroupPurchaseMode(rating, rating >= MAX_GROUP_RATING);

                return (
                  <SkillGroupCard
                    key={groupId}
                    groupName={groupData.name}
                    skills={skillsInGroup}
                    rating={rating}
                    maxRating={MAX_GROUP_RATING}
                    canIncrease={groupPurchaseInfo.mode === "group-points"}
                    canIncreaseWithKarma={groupPurchaseInfo.mode === "karma"}
                    isBroken={broken}
                    canRestore={canRestore}
                    onRatingChange={(delta) => handleGroupRatingChange(groupId, delta)}
                    onKarmaIncrease={() => handleOpenGroupKarmaConfirm(groupId)}
                    onRemove={() => handleRemoveGroup(groupId)}
                    onRestore={canRestore ? () => handleRestoreGroup(groupId) : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No skill groups added</p>
            </div>
          )}
        </div>
      )}

      {/* Skills Section (Individual + Group Skills) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Skills
          </h4>
          <button
            onClick={onOpenSkillModal}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Skill
          </button>
        </div>
        {allSkillsSorted.length > 0 ? (
          <div className="max-h-80 divide-y divide-zinc-100 overflow-y-auto rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
            {allSkillsSorted.map((entry) => {
              const skillData = getSkillData(entry.skillId);
              if (!skillData) return null;

              const isGroupSkill = entry.source.type === "group";
              const skillMaxRating = getMaxRating(entry.skillId);
              const isAtMax = entry.rating >= skillMaxRating;

              // Determine purchase mode for individual skills
              const purchaseInfo = isGroupSkill
                ? { mode: "disabled" as const, disabledReason: undefined }
                : getPurchaseMode(entry.rating, isAtMax);

              // Check if this skill is designated for free allocation
              const isDesignated = designatedSkillIds.has(entry.skillId);
              const freeRating = isDesignated ? getSkillFreeRating(entry.skillId) : undefined;
              const canDesignate =
                !isGroupSkill && hasFreeSkillConfigs && canSkillBeDesignated(entry.skillId);

              return (
                <SkillListItem
                  key={entry.skillId}
                  skillName={skillData.name}
                  linkedAttribute={skillData.linkedAttribute}
                  rating={entry.rating}
                  maxRating={skillMaxRating}
                  specializations={entry.specializations}
                  isGroupSkill={isGroupSkill}
                  groupName={entry.source.type === "group" ? entry.source.groupName : undefined}
                  canIncrease={!isGroupSkill && purchaseInfo.mode === "skill-points"}
                  canIncreaseWithKarma={!isGroupSkill && purchaseInfo.mode === "karma"}
                  disabledReason={purchaseInfo.disabledReason}
                  isFreeAllocation={
                    !isGroupSkill && !isDesignated && freeSkillIds.has(entry.skillId)
                  }
                  isDesignated={isDesignated}
                  freeRating={freeRating}
                  canDesignate={canDesignate}
                  onDesignate={
                    canDesignate ? () => handleDesignateSkillFromList(entry.skillId) : undefined
                  }
                  onUndesignate={
                    isDesignated
                      ? () => {
                          // Find which type this skill is designated under
                          for (const status of freeSkillAllocationStatuses) {
                            if (status.designatedSkillIds.includes(entry.skillId)) {
                              handleUndesignateSkill(entry.skillId, status.type);
                              break;
                            }
                          }
                        }
                      : undefined
                  }
                  onRatingChange={
                    isGroupSkill
                      ? undefined
                      : (delta) => handleSkillRatingChange(entry.skillId, delta)
                  }
                  onKarmaIncrease={
                    isGroupSkill ? undefined : () => handleOpenKarmaConfirm(entry.skillId)
                  }
                  onRemove={isGroupSkill ? undefined : () => handleRemoveSkill(entry.skillId)}
                  onRemoveSpecialization={(spec) => handleRemoveSpecialization(entry.skillId, spec)}
                  // Specialization props for individual skills without specs
                  onAddSpecialization={
                    !isGroupSkill && entry.specializations.length === 0
                      ? () => handleOpenSpecModal(entry.skillId)
                      : undefined
                  }
                  canAddSpecialization={
                    !isGroupSkill &&
                    entry.specializations.length === 0 &&
                    (skillPointsRemaining > 0 || karmaRemaining >= 7)
                  }
                  specRequiresKarma={
                    !isGroupSkill &&
                    entry.specializations.length === 0 &&
                    skillPointsRemaining <= 0 &&
                    karmaRemaining >= 7
                  }
                  // Customization props for group skills
                  onCustomize={
                    isGroupSkill && entry.source.type === "group"
                      ? () => {
                          const source = entry.source as {
                            type: "group";
                            groupId: string;
                            groupName: string;
                          };
                          handleOpenCustomize(entry.skillId, source.groupId);
                        }
                      : undefined
                  }
                  canCustomize={isGroupSkill && karmaRemaining > 0}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">No skills added</p>
          </div>
        )}
      </div>
    </>
  );
}
