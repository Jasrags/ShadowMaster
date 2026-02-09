"use client";

/**
 * SkillsModalsSection
 *
 * Renders all modal dialogs used by the SkillsCard component.
 * Includes skill/group add modals, customization, break confirmation,
 * karma purchase, specialization, and free skill designation modals.
 */

import {
  getGroupRating,
  calculateSkillRaiseKarmaCost,
  calculateSkillGroupRaiseKarmaCost,
} from "@/lib/rules/skills/group-utils";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import type { SkillGroupData, SkillData } from "@/lib/rules";
import { SkillModal } from "./SkillModal";
import { SkillGroupModal } from "./SkillGroupModal";
import { SkillCustomizeModal } from "./SkillCustomizeModal";
import { SkillGroupBreakModal } from "./SkillGroupBreakModal";
import { SkillKarmaConfirmModal } from "./SkillKarmaConfirmModal";
import { SkillGroupKarmaConfirmModal } from "./SkillGroupKarmaConfirmModal";
import { SkillSpecModal } from "./SkillSpecModal";
import { FreeSkillDesignationModal } from "./FreeSkillDesignationModal";
import type { UseSkillsCardHandlersResult } from "./useSkillsCardHandlers";
import { MAX_SKILL_RATING } from "./useSkillsCardHandlers";
import type { UseGroupBreakingResult } from "./useGroupBreaking";
import type { UseKarmaPurchaseResult } from "./useKarmaPurchase";
import type { FreeSkillDesignationModalState } from "./useSkillDesignations";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillsModalsSectionProps {
  /** Whether skill modal is open */
  isSkillModalOpen: boolean;
  /** Close skill modal */
  onCloseSkillModal: () => void;
  /** Whether group modal is open */
  isGroupModalOpen: boolean;
  /** Close group modal */
  onCloseGroupModal: () => void;
  /** Handler hook result */
  handlers: UseSkillsCardHandlersResult;
  /** Group breaking hook result */
  groupBreaking: UseGroupBreakingResult;
  /** Karma purchase hook result */
  karmaPurchase: UseKarmaPurchaseResult;
  /** Free skill designation modal state */
  freeSkillDesignationModal: FreeSkillDesignationModalState | null;
  /** Close free skill designation modal */
  onCloseFreeDesignationModal: () => void;
  /** Confirm free skill designations */
  onConfirmDesignations: (type: string, selectedIds: string[]) => void;
  /** Current individual skill values */
  skills: Record<string, number>;
  /** Current skill group selections */
  groups: Record<string, SkillGroupValue>;
  /** Skill IDs in non-broken groups */
  skillsInGroups: string[];
  /** Skill groups from ruleset */
  skillGroups: SkillGroupData[];
  /** Active skills from ruleset */
  activeSkills: SkillData[];
  /** Skill categories map */
  skillCategories: Record<string, string | undefined>;
  /** Whether character has magic */
  hasMagic: boolean;
  /** Whether character has resonance */
  hasResonance: boolean;
  /** Magic path selection */
  magicPath: string | undefined;
  /** Incompetent group ID from quality */
  incompetentGroupId: string | undefined;
  /** Aptitude skill ID from quality */
  aptitudeSkillId: string | undefined;
  /** Remaining skill points */
  skillPointsRemaining: number;
  /** Remaining group points */
  groupPointsRemaining: number;
  /** Remaining karma */
  karmaRemaining: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillsModalsSection({
  isSkillModalOpen,
  onCloseSkillModal,
  isGroupModalOpen,
  onCloseGroupModal,
  handlers,
  groupBreaking,
  karmaPurchase,
  freeSkillDesignationModal,
  onCloseFreeDesignationModal,
  onConfirmDesignations,
  skills,
  groups,
  skillsInGroups,
  skillGroups,
  activeSkills,
  skillCategories,
  hasMagic,
  hasResonance,
  magicPath,
  incompetentGroupId,
  aptitudeSkillId,
  skillPointsRemaining,
  groupPointsRemaining,
  karmaRemaining,
}: SkillsModalsSectionProps) {
  const {
    handleAddSkill,
    handleAddGroup,
    handleAddSpecFromModal,
    getSkillData,
    getGroupData,
    specModalTarget,
    setSpecModalTarget,
  } = handlers;
  const {
    customizeTarget,
    pendingChanges,
    isBreakModalOpen,
    handleCloseCustomize,
    handleCustomizeApply,
    handleConfirmBreak,
    handleCancelBreak,
  } = groupBreaking;
  const {
    karmaSkillPurchase,
    karmaGroupPurchase,
    handleConfirmKarmaPurchase,
    closeSkillKarmaConfirm,
    handleConfirmGroupKarmaPurchase,
    closeGroupKarmaConfirm,
  } = karmaPurchase;

  return (
    <>
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={onCloseSkillModal}
        onAdd={handleAddSkill}
        existingSkillIds={[...Object.keys(skills), ...skillsInGroups]}
        existingGroupIds={Object.keys(groups)}
        skillGroups={skillGroups}
        hasMagic={hasMagic}
        hasResonance={hasResonance}
        remainingPoints={skillPointsRemaining}
        karmaRemaining={karmaRemaining}
        incompetentGroupId={incompetentGroupId}
        aptitudeSkillId={aptitudeSkillId}
        magicalPath={magicPath}
      />

      <SkillGroupModal
        isOpen={isGroupModalOpen}
        onClose={onCloseGroupModal}
        onAdd={(groupId, rating) => {
          handleAddGroup(groupId, rating);
          onCloseGroupModal();
        }}
        existingGroupIds={Object.keys(groups)}
        existingSkillIds={Object.keys(skills)}
        hasMagic={hasMagic}
        hasResonance={hasResonance}
        remainingGroupPoints={groupPointsRemaining}
        incompetentGroupId={incompetentGroupId}
      />

      {/* Skill Customization Modal (for group skills) */}
      {customizeTarget &&
        (() => {
          const skillData = getSkillData(customizeTarget.skillId);
          const groupData = getGroupData(customizeTarget.groupId);
          const groupValue = groups[customizeTarget.groupId];

          if (!skillData || !groupData || !groupValue) return null;

          const groupRating = getGroupRating(groupValue);

          return (
            <SkillCustomizeModal
              isOpen={true}
              onClose={handleCloseCustomize}
              onApply={handleCustomizeApply}
              skillId={customizeTarget.skillId}
              skillName={skillData.name}
              currentRating={groupRating}
              maxRating={MAX_SKILL_RATING}
              suggestedSpecializations={skillData.suggestedSpecializations || []}
              availableKarma={karmaRemaining}
              availableSkillPoints={skillPointsRemaining}
              groupId={customizeTarget.groupId}
              groupName={groupData.name}
            />
          );
        })()}

      {/* Break Confirmation Modal */}
      {customizeTarget &&
        pendingChanges &&
        (() => {
          const skillData = getSkillData(customizeTarget.skillId);
          const groupData = getGroupData(customizeTarget.groupId);
          const groupValue = groups[customizeTarget.groupId];

          if (!skillData || !groupData || !groupValue) return null;

          const groupRating = getGroupRating(groupValue);
          const memberSkills = groupData.skills
            .map((id) => {
              const data = getSkillData(id);
              return data ? { id, name: data.name } : null;
            })
            .filter(Boolean) as Array<{ id: string; name: string }>;

          return (
            <SkillGroupBreakModal
              isOpen={isBreakModalOpen}
              onClose={handleCancelBreak}
              onConfirm={handleConfirmBreak}
              skillName={skillData.name}
              skillId={customizeTarget.skillId}
              groupName={groupData.name}
              groupId={customizeTarget.groupId}
              currentRating={groupRating}
              memberSkills={memberSkills}
              changes={pendingChanges}
              availableKarma={karmaRemaining}
            />
          );
        })()}

      {/* Karma Purchase Confirmation Modal (for individual skills) */}
      {karmaSkillPurchase && (
        <SkillKarmaConfirmModal
          isOpen={true}
          onClose={closeSkillKarmaConfirm}
          onConfirm={handleConfirmKarmaPurchase}
          skillName={karmaSkillPurchase.skillName}
          currentRating={karmaSkillPurchase.currentRating}
          newRating={karmaSkillPurchase.currentRating + 1}
          karmaCost={calculateSkillRaiseKarmaCost(
            karmaSkillPurchase.currentRating,
            karmaSkillPurchase.currentRating + 1
          )}
          karmaRemaining={karmaRemaining}
        />
      )}

      {/* Karma Purchase Confirmation Modal (for skill groups) */}
      {karmaGroupPurchase && (
        <SkillGroupKarmaConfirmModal
          isOpen={true}
          onClose={closeGroupKarmaConfirm}
          onConfirm={handleConfirmGroupKarmaPurchase}
          groupName={karmaGroupPurchase.groupName}
          skillCount={karmaGroupPurchase.skillCount}
          currentRating={karmaGroupPurchase.currentRating}
          newRating={karmaGroupPurchase.currentRating + 1}
          karmaCost={calculateSkillGroupRaiseKarmaCost(
            karmaGroupPurchase.currentRating,
            karmaGroupPurchase.currentRating + 1
          )}
          karmaRemaining={karmaRemaining}
        />
      )}

      {/* Specialization Modal (for individual skills) */}
      {specModalTarget &&
        (() => {
          const skillData = getSkillData(specModalTarget);
          if (!skillData) return null;

          return (
            <SkillSpecModal
              isOpen={true}
              onClose={() => setSpecModalTarget(null)}
              onAdd={(spec, karmaSpent) =>
                handleAddSpecFromModal(specModalTarget, spec, karmaSpent)
              }
              skillName={skillData.name}
              suggestedSpecializations={skillData.suggestedSpecializations || []}
              availableSkillPoints={skillPointsRemaining}
              availableKarma={karmaRemaining}
            />
          );
        })()}

      {/* Free Skill Designation Modal */}
      {freeSkillDesignationModal && (
        <FreeSkillDesignationModal
          isOpen={true}
          onClose={onCloseFreeDesignationModal}
          onConfirm={(selectedIds) =>
            onConfirmDesignations(freeSkillDesignationModal.type, selectedIds)
          }
          freeSkillType={freeSkillDesignationModal.type}
          typeLabel={freeSkillDesignationModal.label}
          freeRating={freeSkillDesignationModal.freeRating}
          totalSlots={freeSkillDesignationModal.totalSlots}
          currentDesignations={freeSkillDesignationModal.currentDesignations}
          availableSkills={activeSkills}
          skillCategories={skillCategories}
          currentSkillRatings={skills}
          hasMagic={hasMagic}
          hasResonance={hasResonance}
        />
      )}
    </>
  );
}
