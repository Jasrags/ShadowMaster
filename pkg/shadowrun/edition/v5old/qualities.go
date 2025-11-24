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
	BaseCost int
	// PerRating indicates if cost is per rating level
	PerRating bool
	// MaxRating is the maximum rating if PerRating is true (0 means no max)
	MaxRating int
}

// SourceReference provides source book and page information
type SourceReference struct {
	Source string `json:"source"`
	Page   string `json:"page"`
}

// SkillDicePoolBonus represents a dice pool bonus to a specific skill or attribute test
type SkillDicePoolBonus struct {
	// Skill or attribute name (e.g., "Logic", "Sneaking")
	Target string
	// Bonus amount (e.g., 2 for +2 dice)
	Bonus int
	// Conditions describes when the bonus applies (e.g., ["pattern recognition", "evidence analysis"])
	Conditions []string
}

// SkillRatingModifier represents modifications to skill rating limits
type SkillRatingModifier struct {
	// SkillName is the name of the skill (empty means "one skill selected by player")
	SkillName string
	// MaxRatingAtChargen is the maximum rating allowed at character creation (0 = no change)
	MaxRatingAtChargen int
	// MaxRating is the maximum rating allowed (0 = no change)
	MaxRating int
}

// AttributeModifier represents modifications to attribute limits
type AttributeModifier struct {
	// AttributeName is the name of the attribute (empty means "one attribute selected by player")
	AttributeName string
	// MaxRatingIncrease is how much to increase the maximum rating (e.g., 1 for +1 above metatype max)
	MaxRatingIncrease int
}

// AstralSignatureModifier represents modifications to astral signature behavior
type AstralSignatureModifier struct {
	// SignatureDurationMultiplier multiplies how long signatures last (e.g., 0.5 for half duration)
	SignatureDurationMultiplier float64
	// AssensingPenalty is the dice pool penalty for others assensing the character's signatures
	AssensingPenalty int
}

// SustainedSpellModifier represents modifications to sustaining spells/complex forms
type SustainedSpellModifier struct {
	// PenaltyFreeSustainRating is the rating at which spells/complex forms can be sustained without penalty
	PenaltyFreeSustainRating int
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
	Type AddictionType
	// Severity is the severity level (mild, moderate, severe, burnout)
	Severity AddictionSeverity
	// DosageRequired is the number of doses or hours required to satisfy craving
	DosageRequired int
	// CravingsFrequency is how often cravings occur (e.g., "once a month", "once a week", "daily")
	CravingsFrequency string
	// WithdrawalPenalty is the dice pool penalty during withdrawal
	WithdrawalPenalty int
	// SocialTestPenalty is the dice pool penalty to Social Tests (0 if none)
	SocialTestPenalty int
	// SubstanceName is the name of the substance or activity (player-selected)
	SubstanceName string
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
	Rarity AllergyRarity
	// Severity is the severity of symptoms
	Severity AllergySeverity
	// ResistanceTestPenalty is dice lost from Resistance Tests (1 per severity stage)
	ResistanceTestPenalty int
	// AllergenName is the name of the substance or condition (player-selected)
	AllergenName string
}

// InitiativeModifier represents modifications to Initiative
type InitiativeModifier struct {
	// FirstTurnDivisor divides Initiative on first turn (e.g., 2 for half)
	FirstTurnDivisor int
}

// PrejudicedModifier represents prejudice effects
type PrejudicedModifier struct {
	// TargetGroup is the group the character is prejudiced against
	TargetGroup string
	// SeverityLevel is the severity level (affects karma value and penalties)
	SeverityLevel int
	// SocialTestPenaltyPerLevel is penalty per level to Social Tests
	SocialTestPenaltyPerLevel int
	// NegotiationBonusPerLevel is bonus per level to target's Negotiation
	NegotiationBonusPerLevel int
}

// ScorchedEffects represents Scorched quality effects
type ScorchedEffects struct {
	// EffectDescription is the specific effect chosen by player
	EffectDescription string
	// VRBTLTestThreshold is threshold for Body + Willpower test when entering VR/slotting BTL
	VRBTLTestThreshold int
	// EffectDurationHours is duration of effects on failed test
	EffectDurationHours int
	// CriticalGlitchDurationHours is duration on glitch/critical glitch
	CriticalGlitchDurationHours int
	// DamageResistancePenalty is penalty to Damage Resistance Tests vs Black/Psychotropic IC
	DamageResistancePenalty int
	// RequiresAddiction indicates if requires Mild Addiction to BTLs
	RequiresAddiction bool
}

// SensitiveSystemEffects represents Sensitive System effects
type SensitiveSystemEffects struct {
	// CyberwareEssenceMultiplier multiplies Essence loss from cyberware
	CyberwareEssenceMultiplier float64
	// BiowareRejected indicates if bioware is rejected
	BiowareRejected bool
	// DrainFadingTestThreshold is threshold for Willpower test before Drain/Fading
	DrainFadingTestThreshold int
	// DrainFadingValueIncrease is increase to Drain/Fading on failed test
	DrainFadingValueIncrease int
}

// KnowledgeSkillRestrictions represents restrictions on Knowledge skills
type KnowledgeSkillRestrictions struct {
	// AffectedCategories lists affected skill categories
	AffectedCategories []string
	// CostMultiplier multiplies karma cost to learn/improve
	CostMultiplier float64
	// CannotDefault indicates if cannot default on tests
	CannotDefault bool
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
	MetatypeRestrictions []string
	// MagicRequired indicates if a Magic rating is required
	MagicRequired bool
	// ResonanceRequired indicates if Resonance is required
	ResonanceRequired bool
	// ChargenOnly indicates if this can only be taken at character creation
	ChargenOnly bool
	// MaxTimes indicates how many times this quality can be taken (0 = unlimited, 1 = once)
	MaxTimes int
	// OtherRestrictions contains free-form restriction text
	OtherRestrictions []string
}

// Quality represents a Shadowrun 5th Edition quality
type Quality struct {
	// Name is the quality name (e.g., "Ambidextrous")
	Name string
	// Type indicates if this is a positive or negative quality
	Type QualityType
	// Cost defines the karma cost structure
	Cost CostStructure
	// Description is the full text description of the quality
	Description string
	// Bonus contains any mechanical bonuses/effects this quality provides
	Bonus *QualityBonus
	// Requirements contains any prerequisites or restrictions
	Requirements *QualityRequirements
	// Source contains source book reference information
	Source *SourceReference
}
