package v5

// QualityType represents whether a quality is positive or negative
type QualityType string

const (
	QualityTypePositive QualityType = "positive"
	QualityTypeNegative QualityType = "negative"
)

// CostStructure represents how the karma cost is structured
type CostStructure struct {
	// BaseCost is the base karma cost (required)
	BaseCost int `json:"base_cost,omitempty"`
	// PerRating indicates if cost is per rating level
	PerRating bool `json:"per_rating,omitempty"`
	// MaxRating is the maximum rating if PerRating is true (0 means no max)
	MaxRating int `json:"max_rating,omitempty"`
}

// SkillDicePoolBonus represents a dice pool bonus to a specific skill or attribute test
type SkillDicePoolBonus struct {
	// Skill or attribute name (e.g., "Logic", "Sneaking")
	Target string `json:"target,omitempty"`
	// Bonus amount (e.g., 2 for +2 dice)
	Bonus int `json:"bonus,omitempty"`
	// Conditions describes when the bonus applies (e.g., ["pattern recognition", "evidence analysis"])
	Conditions []string `json:"conditions,omitempty"`
}

// SkillRatingModifier represents modifications to skill rating limits
type SkillRatingModifier struct {
	// SkillName is the name of the skill (empty means "one skill selected by player")
	SkillName string `json:"skill_name,omitempty"`
	// MaxRatingAtChargen is the maximum rating allowed at character creation (0 = no change)
	MaxRatingAtChargen int `json:"max_rating_at_chargen,omitempty"`
	// MaxRating is the maximum rating allowed (0 = no change)
	MaxRating int `json:"max_rating,omitempty"`
}

// AttributeModifier represents modifications to attribute limits
type AttributeModifier struct {
	// AttributeName is the name of the attribute (empty means "one attribute selected by player")
	AttributeName string `json:"attribute_name,omitempty"`
	// MaxRatingIncrease is how much to increase the maximum rating (e.g., 1 for +1 above metatype max)
	MaxRatingIncrease int `json:"max_rating_increase,omitempty"`
}

// AstralSignatureModifier represents modifications to astral signature behavior
type AstralSignatureModifier struct {
	// SignatureDurationMultiplier multiplies how long signatures last (e.g., 0.5 for half duration)
	SignatureDurationMultiplier float64 `json:"signature_duration_multiplier,omitempty"`
	// AssensingPenalty is the dice pool penalty for others assensing the character's signatures
	AssensingPenalty int `json:"assensing_penalty,omitempty"`
}

// SustainedSpellModifier represents modifications to sustaining spells/complex forms
type SustainedSpellModifier struct {
	// PenaltyFreeSustainRating is the rating at which spells/complex forms can be sustained without penalty
	PenaltyFreeSustainRating int `json:"penalty_free_sustain_rating,omitempty"`
}

// AddictionType represents whether an addiction is physiological or psychological
type AddictionType string

const (
	AddictionTypePhysiological AddictionType = "physiological"
	AddictionTypePsychological AddictionType = "psychological"
)

// AddictionSeverity represents the severity level of an addiction
type AddictionSeverity string

const (
	AddictionSeverityMild     AddictionSeverity = "mild"
	AddictionSeverityModerate AddictionSeverity = "moderate"
	AddictionSeveritySevere   AddictionSeverity = "severe"
	AddictionSeverityBurnout  AddictionSeverity = "burnout"
)

// AddictionModifier represents addiction effects
type AddictionModifier struct {
	// Type is whether the addiction is physiological or psychological
	Type AddictionType `json:"type,omitempty"`
	// Severity is the severity level (mild, moderate, severe, burnout)
	Severity AddictionSeverity `json:"severity,omitempty"`
	// DosageRequired is the number of doses or hours required to satisfy craving
	DosageRequired int `json:"dosage_required,omitempty"`
	// CravingsFrequency is how often cravings occur (e.g., "once a month", "once a week", "daily")
	CravingsFrequency string `json:"cravings_frequency,omitempty"`
	// WithdrawalPenalty is the dice pool penalty during withdrawal
	WithdrawalPenalty int `json:"withdrawal_penalty,omitempty"`
	// SocialTestPenalty is the dice pool penalty to Social Tests (0 if none)
	SocialTestPenalty int `json:"social_test_penalty,omitempty"`
	// SubstanceName is the name of the substance or activity (player-selected)
	SubstanceName string `json:"substance_name,omitempty"`
}

// AllergyRarity represents whether an allergy is uncommon or common
type AllergyRarity string

const (
	AllergyRarityUncommon AllergyRarity = "uncommon"
	AllergyRarityCommon   AllergyRarity = "common"
)

// AllergySeverity represents the severity of allergy symptoms
type AllergySeverity string

const (
	AllergySeverityMild     AllergySeverity = "mild"
	AllergySeverityModerate AllergySeverity = "moderate"
	AllergySeveritySevere   AllergySeverity = "severe"
	AllergySeverityExtreme  AllergySeverity = "extreme"
)

// AllergyModifier represents allergy effects
type AllergyModifier struct {
	// Rarity is whether the allergen is uncommon or common
	Rarity AllergyRarity `json:"rarity,omitempty"`
	// Severity is the severity of symptoms
	Severity AllergySeverity `json:"severity,omitempty"`
	// ResistanceTestPenalty is dice lost from Resistance Tests (1 per severity stage)
	ResistanceTestPenalty int `json:"resistance_test_penalty,omitempty"`
	// AllergenName is the name of the substance or condition (player-selected)
	AllergenName string `json:"allergen_name,omitempty"`
}

// InitiativeModifier represents modifications to Initiative
type InitiativeModifier struct {
	// FirstTurnDivisor divides Initiative on first turn (e.g., 2 for half)
	FirstTurnDivisor int `json:"first_turn_divisor,omitempty"`
}

// PrejudicedModifier represents prejudice effects
type PrejudicedModifier struct {
	// TargetGroup is the group the character is prejudiced against
	TargetGroup string `json:"target_group,omitempty"`
	// SeverityLevel is the severity level (affects karma value and penalties)
	SeverityLevel int `json:"severity_level,omitempty"`
	// SocialTestPenaltyPerLevel is penalty per level to Social Tests
	SocialTestPenaltyPerLevel int `json:"social_test_penalty_per_level,omitempty"`
	// NegotiationBonusPerLevel is bonus per level to target's Negotiation
	NegotiationBonusPerLevel int `json:"negotiation_bonus_per_level,omitempty"`
}

// ScorchedEffects represents Scorched quality effects
type ScorchedEffects struct {
	// EffectDescription is the specific effect chosen by player
	EffectDescription string `json:"effect_description,omitempty"`
	// VRBTLTestThreshold is threshold for Body + Willpower test when entering VR/slotting BTL
	VRBTLTestThreshold int `json:"vrbtl_test_threshold,omitempty"`
	// EffectDurationHours is duration of effects on failed test
	EffectDurationHours int `json:"effect_duration_hours,omitempty"`
	// CriticalGlitchDurationHours is duration on glitch/critical glitch
	CriticalGlitchDurationHours int `json:"critical_glitch_duration_hours,omitempty"`
	// DamageResistancePenalty is penalty to Damage Resistance Tests vs Black/Psychotropic IC
	DamageResistancePenalty int `json:"damage_resistance_penalty,omitempty"`
	// RequiresAddiction indicates if requires Mild Addiction to BTLs
	RequiresAddiction bool `json:"requires_addiction,omitempty"`
}

// SensitiveSystemEffects represents Sensitive System effects
type SensitiveSystemEffects struct {
	// CyberwareEssenceMultiplier multiplies Essence loss from cyberware
	CyberwareEssenceMultiplier float64 `json:"cyberware_essence_multiplier,omitempty"`
	// BiowareRejected indicates if bioware is rejected
	BiowareRejected bool `json:"bioware_rejected,omitempty"`
	// DrainFadingTestThreshold is threshold for Willpower test before Drain/Fading
	DrainFadingTestThreshold int `json:"drain_fading_test_threshold,omitempty"`
	// DrainFadingValueIncrease is increase to Drain/Fading on failed test
	DrainFadingValueIncrease int `json:"drain_fading_value_increase,omitempty"`
}

// KnowledgeSkillRestrictions represents restrictions on Knowledge skills
type KnowledgeSkillRestrictions struct {
	// AffectedCategories lists affected skill categories
	AffectedCategories []string `json:"affected_categories,omitempty"`
	// CostMultiplier multiplies karma cost to learn/improve
	CostMultiplier float64 `json:"cost_multiplier,omitempty"`
	// CannotDefault indicates if cannot default on tests
	CannotDefault bool `json:"cannot_default,omitempty"`
}

// QualityBonus contains mechanical bonuses/effects that a quality provides
// We'll add fields as we encounter them in the quality definitions
type QualityBonus struct {
	// Ambidextrous removes the -2 dice pool modifier for off-hand actions
	Ambidextrous []bool `json:"ambidextrous,omitempty"`
	// SkillDicePoolBonuses provides dice pool modifiers to specific skills/attributes
	SkillDicePoolBonuses []SkillDicePoolBonus `json:"skill_dice_pool_bonuses,omitempty"`
	// SkillRatingModifiers modifies skill rating limits
	SkillRatingModifiers []SkillRatingModifier `json:"skill_rating_modifiers,omitempty"`
	// AttributeModifiers modifies attribute maximum limits
	AttributeModifiers []AttributeModifier `json:"attribute_modifiers,omitempty"`
	// AstralSignatureModifiers modifies astral signature behavior
	AstralSignatureModifiers []AstralSignatureModifier `json:"astral_signature_modifiers,omitempty"`
	// FreeLanguageSkills is the number of free language skills granted
	FreeLanguageSkills int `json:"free_language_skills,omitempty"`
	// MemoryTestThresholdIncrease increases the threshold for memory tests about the character
	MemoryTestThresholdIncrease int `json:"memory_test_threshold_increase,omitempty"`
	// ShadowingPenalty is the dice pool penalty for shadowing/locating the character
	ShadowingPenalty int `json:"shadowing_penalty,omitempty"`
	// MatrixActionBonus provides a bonus to a selected Matrix action
	MatrixActionBonus *SkillDicePoolBonus `json:"matrix_action_bonus,omitempty"`
	// SocialTestBonus provides a bonus to social tests (with conditions)
	SocialTestBonus *SkillDicePoolBonus `json:"social_test_bonus,omitempty"`
	// SustainedSpellModifier modifies how spells/complex forms can be sustained
	SustainedSpellModifier *SustainedSpellModifier `json:"sustained_spell_modifier,omitempty"`
	// FearResistanceBonus provides a bonus to resist fear and intimidation
	FearResistanceBonus int `json:"fear_resistance_bonus,omitempty"`
	// WoundModifierIgnore is the number of damage boxes that can be ignored for wound modifier calculation
	WoundModifierIgnore int `json:"wound_modifier_ignore,omitempty"`
	// AddictionModifiers represents addiction effects
	AddictionModifiers []AddictionModifier `json:"addiction_modifiers,omitempty"`
	// AllergyModifiers represents allergy effects
	AllergyModifiers []AllergyModifier `json:"allergy_modifiers,omitempty"`
	// BadLuckEdgePenalty affects Edge usage (1D6 roll, 1 = opposite effect)
	BadLuckEdgePenalty bool `json:"bad_luck_edge_penalty,omitempty"`
	// NotorietyBonus is starting Notoriety points
	NotorietyBonus int `json:"notoriety_bonus,omitempty"`
	// CodeOfHonorProtectedGroups lists groups the character won't kill
	CodeOfHonorProtectedGroups []string `json:"code_of_honor_protected_groups,omitempty"`
	// MatrixActionPenalty provides a penalty to a selected Matrix action
	MatrixActionPenalty *SkillDicePoolBonus `json:"matrix_action_penalty,omitempty"`
	// InitiativeModifier affects Initiative (e.g., divide by 2 on first turn)
	InitiativeModifier *InitiativeModifier `json:"initiative_modifier,omitempty"`
	// SurpriseTestPenalty is penalty to Surprise Tests
	SurpriseTestPenalty int `json:"surprise_test_penalty,omitempty"`
	// ComposureTestThresholdModifier modifies Composure Test thresholds
	ComposureTestThresholdModifier int `json:"composure_test_threshold_modifier,omitempty"`
	// DependentsLevel affects lifestyle cost and skill advancement time
	DependentsLevel int `json:"dependents_level,omitempty"` // 3, 6, or 9 karma
	// LifestyleCostIncreasePercent increases lifestyle cost by percentage
	LifestyleCostIncreasePercent int `json:"lifestyle_cost_increase_percent,omitempty"`
	// SkillAdvancementTimeMultiplier multiplies time to learn/improve skills
	SkillAdvancementTimeMultiplier float64 `json:"skill_advancement_time_multiplier,omitempty"`
	// MemoryTestThresholdDecrease decreases threshold for memory tests about character
	MemoryTestThresholdDecrease int `json:"memory_test_threshold_decrease,omitempty"`
	// IdentificationBonus provides bonus to identify/trace/locate character
	IdentificationBonus int `json:"identification_bonus,omitempty"`
	// GlitchReductionPerLevel reduces number of 1s needed for glitch (Gremlins)
	GlitchReductionPerLevel int `json:"glitch_reduction_per_level,omitempty"`
	// IncompetentSkillGroups lists skill groups character is incompetent in
	IncompetentSkillGroups []string `json:"incompetent_skill_groups,omitempty"`
	// InsomniaLevel affects Stun recovery (10 or 15 karma)
	InsomniaLevel int `json:"insomnia_level,omitempty"`
	// LossOfConfidenceSkill is the skill affected by loss of confidence
	LossOfConfidenceSkill string `json:"loss_of_confidence_skill,omitempty"`
	// WoundModifierFrequency is boxes of damage per wound modifier (default 3)
	WoundModifierFrequency int `json:"wound_modifier_frequency,omitempty"`
	// PrejudicedModifiers represents prejudice effects
	PrejudicedModifiers []PrejudicedModifier `json:"prejudiced_modifiers,omitempty"`
	// ScorchedEffects represents Scorched quality effects
	ScorchedEffects *ScorchedEffects `json:"scorched_effects,omitempty"`
	// SensitiveSystemEffects represents Sensitive System effects
	SensitiveSystemEffects *SensitiveSystemEffects `json:"sensitive_system_effects,omitempty"`
	// SimsenseVertigoPenalty is penalty to AR/VR/simsense tests
	SimsenseVertigoPenalty int `json:"simsense_vertigo_penalty,omitempty"`
	// SINType represents the type of SIN (National, Criminal, Corporate Limited, Corporate Born)
	SINType string `json:"sin_type,omitempty"`
	// SocialStressAffectedSkills lists skills affected by Social Stress
	SocialStressAffectedSkills []string `json:"social_stress_affected_skills,omitempty"`
	// SpiritBaneSpiritType is the type of spirit affected
	SpiritBaneSpiritType string `json:"spirit_bane_spirit_type,omitempty"`
	// SocialSkillCostMultiplier multiplies cost to learn Social skills
	SocialSkillCostMultiplier float64 `json:"social_skill_cost_multiplier,omitempty"`
	// KnowledgeSkillRestrictions affects Knowledge skill costs and defaults
	KnowledgeSkillRestrictions *KnowledgeSkillRestrictions `json:"knowledge_skill_restrictions,omitempty"`
	// AgilityTestPenalty is penalty to Agility-based tests
	AgilityTestPenalty int `json:"agility_test_penalty,omitempty"`
	// DiseasePowerIncrease increases disease Power for Resistance Tests
	DiseasePowerIncrease int `json:"disease_power_increase,omitempty"`
}

// QualityRequirements represents prerequisites or restrictions for a quality
type QualityRequirements struct {
	// MetatypeRestrictions lists allowed metatypes (empty means all)
	MetatypeRestrictions []string `json:"metatype_restrictions,omitempty"`
	// MagicRequired indicates if a Magic rating is required
	MagicRequired bool `json:"magic_required,omitempty"`
	// ResonanceRequired indicates if Resonance is required
	ResonanceRequired bool `json:"resonance_required,omitempty"`
	// ChargenOnly indicates if this can only be taken at character creation
	ChargenOnly bool `json:"chargen_only,omitempty"`
	// MaxTimes indicates how many times this quality can be taken (0 = unlimited, 1 = once)
	MaxTimes int `json:"max_times,omitempty"`
	// OtherRestrictions contains free-form restriction text
	OtherRestrictions []string `json:"other_restrictions,omitempty"`
}

// Quality represents a Shadowrun 5th Edition quality
type Quality struct {
	// Name is the quality name (e.g., "Ambidextrous")
	Name string `json:"name,omitempty"`
	// Type indicates if this is a positive or negative quality
	Type QualityType `json:"type,omitempty"`
	// Cost defines the karma cost structure
	Cost CostStructure `json:"cost,omitempty"`
	// Description is the full text description of the quality
	Description string `json:"description,omitempty"`
	// Bonus contains any mechanical bonuses/effects this quality provides
	Bonus *QualityBonus `json:"bonus,omitempty"`
	// Requirements contains any prerequisites or restrictions
	Requirements *QualityRequirements `json:"requirements,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// GetAllQualities returns all quality definitions.
func GetAllQualities() []Quality {
	qualities := make([]Quality, 0, len(dataQualities))
	for _, q := range dataQualities {
		qualities = append(qualities, q)
	}
	return qualities
}

// GetQualityByName returns the quality definition with the given name, or nil if not found.
func GetQualityByName(name string) *Quality {
	for _, q := range dataQualities {
		if q.Name == name {
			return &q
		}
	}
	return nil
}

// GetQualityByKey returns the quality definition with the given key, or nil if not found.
func GetQualityByKey(key string) *Quality {
	q, ok := dataQualities[key]
	if !ok {
		return nil
	}
	return &q
}
