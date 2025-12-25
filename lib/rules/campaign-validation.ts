/**
 * Campaign Validation Service
 * 
 * Enforces Ruleset Integrity between a Character and a Campaign.
 * Satisfies the guarantee: "A campaign MUST enforce a singular, 
 * immutable ruleset foundation for all associated entities."
 */

import type { Character, Campaign, ValidationError } from "../types";
import type { ValidationResult } from "./constraint-validation";

/**
 * Validates that a character is compliant with a campaign's ruleset configuration.
 * 
 * Checks:
 * 1. Edition matching
 * 2. Book availability
 * 3. Creation method availability
 * 4. Advancement settings (rating caps)
 */
export function validateCharacterCampaignCompliance(
    character: Character,
    campaign: Campaign
): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 1. Edition Matching
    if (character.editionCode !== campaign.editionCode) {
        errors.push({
            constraintId: "campaign-edition-mismatch",
            field: "editionCode",
            message: `Character edition (${character.editionCode}) does not match campaign edition (${campaign.editionCode})`,
            severity: "error",
        });
    }

    // 2. Book Availability
    // If the campaign restricts books, ensure the character only uses enabled ones.
    if (campaign.enabledBookIds && campaign.enabledBookIds.length > 0) {
        const characterBooks = character.attachedBookIds || [];
        const unauthorizedBooks = characterBooks.filter(
            (bookId) => !campaign.enabledBookIds.includes(bookId)
        );

        if (unauthorizedBooks.length > 0) {
            errors.push({
                constraintId: "campaign-book-restriction",
                field: "attachedBookIds",
                message: `Character uses books not enabled in this campaign: ${unauthorizedBooks.join(", ")}`,
                severity: "error",
            });
        }
    }

    // 3. Creation Method Availability
    if (campaign.enabledCreationMethodIds && campaign.enabledCreationMethodIds.length > 0) {
        if (!campaign.enabledCreationMethodIds.includes(character.creationMethodId)) {
            errors.push({
                constraintId: "campaign-creation-method-restriction",
                field: "creationMethodId",
                message: `Character creation method is not permitted in this campaign`,
                severity: "error",
            });
        }
    }

    // 4. Rating Caps (from Campaign Advancement Settings)
    const { advancementSettings } = campaign;
    if (advancementSettings) {
        // Attribute Rating Cap
        if (advancementSettings.attributeRatingCap) {
            for (const [attr, value] of Object.entries(character.attributes)) {
                if (value > advancementSettings.attributeRatingCap) {
                    errors.push({
                        constraintId: "campaign-attribute-cap",
                        field: `attributes.${attr}`,
                        message: `${attr} exceeds campaign attribute rating cap of ${advancementSettings.attributeRatingCap}`,
                        severity: "error",
                    });
                }
            }
        }

        // Skill Rating Cap
        if (advancementSettings.skillRatingCap) {
            for (const [skillId, rating] of Object.entries(character.skills)) {
                if (rating > advancementSettings.skillRatingCap) {
                    errors.push({
                        constraintId: "campaign-skill-cap",
                        field: `skills.${skillId}`,
                        message: `Skill ${skillId} exceeds campaign skill rating cap of ${advancementSettings.skillRatingCap}`,
                        severity: "error",
                    });
                }
            }
        }
    }

    // 5. Optional Rules Compliance
    // Satisfies: "Any attempt to use content or mechanics from a disabled
    // or incompatible bundle MUST be rejected."
    // @see docs/capabilities/ruleset.integrity.md
    if (campaign.optionalRules) {
        const { disabledRuleIds } = campaign.optionalRules;
        
        // Check if character uses content that requires disabled optional rules
        // This is a foundational check - specific content validation would be
        // implemented by the content modules (qualities, gear, etc.) checking
        // their requiredOptionalRuleId against the campaign's active rules.
        
        // For now, we validate that character metadata doesn't reference
        // any explicitly disabled rules
        const characterOptionalRules = (character as { optionalRuleIds?: string[] }).optionalRuleIds;
        if (characterOptionalRules && characterOptionalRules.length > 0) {
            const violatingRules = characterOptionalRules.filter(
                (ruleId) => disabledRuleIds.includes(ruleId)
            );
            
            if (violatingRules.length > 0) {
                errors.push({
                    constraintId: "campaign-optional-rule-violation",
                    field: "optionalRuleIds",
                    message: `Character uses optional rules disabled in this campaign: ${violatingRules.join(", ")}`,
                    severity: "error",
                });
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
