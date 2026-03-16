/**
 * Skill Limit Constraint Validator
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate skill limits
 *
 * Rules enforced:
 * - Base skill rating cap at creation is 6 (configurable via params.max)
 * - Rating 7 is only allowed with Aptitude quality for that SPECIFIC skill
 * - Only one skill can reach rating 7 at creation (Aptitude can only be taken once)
 */
export function validateSkillLimit(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character } = context;
  const params = constraint.params as {
    max?: number;
    maxWithAptitude?: number;
  };

  // Find Aptitude quality and its specification
  const aptitudeQuality = character.positiveQualities?.find(
    (q) => (q.qualityId || q.id) === "aptitude"
  );
  const aptitudeSkill = aptitudeQuality?.specification?.toLowerCase();

  const campaignSkillCap = context.campaign?.advancementSettings?.skillRatingCap;
  const baseMax = params.max || 6;
  const aptitudeMax = params.maxWithAptitude || 7;

  let skillsAtAptitudeMax = 0;

  for (const [skillId, rating] of Object.entries(character.skills || {})) {
    // Determine if this skill is the Aptitude skill
    const isAptitudeSkill = aptitudeSkill && skillId.toLowerCase() === aptitudeSkill;

    // Calculate max rating for this specific skill
    let maxRating = isAptitudeSkill ? aptitudeMax : baseMax;

    // Apply campaign cap if defined
    if (campaignSkillCap !== undefined) {
      maxRating = Math.min(maxRating, campaignSkillCap);
    }

    if (rating > maxRating) {
      return {
        constraintId: constraint.id,
        field: skillId,
        message: isAptitudeSkill
          ? constraint.errorMessage || `Skill rating cannot exceed ${maxRating} at creation`
          : `Skill "${skillId}" exceeds max of ${maxRating}${aptitudeQuality ? ` (Aptitude is for "${aptitudeQuality.specification}")` : ""}`,
        severity: constraint.severity,
      };
    }

    // Track skills at aptitude max (7+)
    if (rating >= aptitudeMax) {
      skillsAtAptitudeMax++;
    }
  }

  // Only one skill can reach rating 7 at creation (even with Aptitude)
  if (skillsAtAptitudeMax > 1) {
    return {
      constraintId: constraint.id,
      field: "skills",
      message: "Only one skill can reach rating 7 at creation (even with Aptitude)",
      severity: constraint.severity,
    };
  }

  return null;
}
