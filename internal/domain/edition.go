package domain

// PriorityOption describes a single priority choice (A-E) for a category.
type PriorityOption struct {
	Label         string   `json:"label"`
	Summary       string   `json:"summary,omitempty"`
	Description   string   `json:"description,omitempty"`
	AvailableTypes []string `json:"available_types,omitempty"` // For magic/resonance priorities
	MagicRating   int      `json:"magic_rating,omitempty"`     // For magic/resonance priorities (0 for mundane)
	FreeSpells    int      `json:"free_spells,omitempty"`       // Number of free spells for Magicians/Mystic Adepts
}

// AttributeRange captures minimum and maximum natural ratings for an attribute.
type AttributeRange struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

// MetatypeDefinition captures metatype metadata used by character creation.
type MetatypeDefinition struct {
	ID                     string                    `json:"id"`
	Name                   string                    `json:"name"`
	PriorityTiers          []string                  `json:"priority_tiers"`
	AttributeModifiers     map[string]int            `json:"attribute_modifiers,omitempty"`
	AttributeRanges        map[string]AttributeRange `json:"attribute_ranges,omitempty"`
	SpecialAttributePoints map[string]int            `json:"special_attribute_points,omitempty"`
	Abilities              []string                  `json:"abilities"`
	Notes                  string                    `json:"notes,omitempty"`
}

// CharacterCreationData aggregates data required by the multi-step wizard.
type CharacterCreationData struct {
	Priorities      map[string]map[string]PriorityOption `json:"priorities"`
	Metatypes       []MetatypeDefinition                 `json:"metatypes"`
	GameplayLevels  map[string]GameplayLevel             `json:"gameplay_levels,omitempty"`
	CreationMethods map[string]CreationMethod            `json:"creation_methods,omitempty"`
	Advancement     *AdvancementRules                    `json:"advancement,omitempty"`
	CampaignSupport *CampaignSupport                     `json:"campaign_support,omitempty"`
}

// CampaignSupport aggregates reusable campaign planning presets.
type CampaignSupport struct {
	Factions     []CampaignFactionPreset     `json:"factions,omitempty"`
	Locations    []CampaignLocationPreset   `json:"locations,omitempty"`
	Placeholders []CampaignPlaceholderPreset `json:"placeholders,omitempty"`
	SessionSeeds []CampaignSessionSeedPreset `json:"session_seeds,omitempty"`
}

// CampaignFactionPreset represents a prebuilt faction entry.
type CampaignFactionPreset struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Tags  string `json:"tags,omitempty"`
	Notes string `json:"notes,omitempty"`
}

// CampaignLocationPreset represents a prebuilt location entry.
type CampaignLocationPreset struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Descriptor string `json:"descriptor,omitempty"`
}

// CampaignPlaceholderPreset represents a suggested runner placeholder template.
type CampaignPlaceholderPreset struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role,omitempty"`
}

// CampaignSessionSeedPreset represents a reusable session planning template.
type CampaignSessionSeedPreset struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Objectives    string `json:"objectives,omitempty"`
	SceneTemplate string `json:"scene_template,omitempty"`
	Summary       string `json:"summary,omitempty"`
}

// GameplayLevel captures SR5 gameplay-level adjustments.
type GameplayLevel struct {
	Label                  string           `json:"label"`
	Description            string           `json:"description,omitempty"`
	Resources              map[string]int   `json:"resources,omitempty"`
	StartingKarma          int              `json:"starting_karma,omitempty"`
	MaxCustomKarma         int              `json:"max_custom_karma,omitempty"`
	KarmaToNuyenLimit      int              `json:"karma_to_nuyen_limit,omitempty"`
	ContactKarmaMultiplier int              `json:"contact_karma_multiplier,omitempty"`
	GearRestrictions       GearRestrictions `json:"gear_restrictions,omitempty"`
}

// GearRestrictions captures device/availability caps.
type GearRestrictions struct {
	MaxDeviceRating *int `json:"max_device_rating,omitempty"`
	MaxAvailability *int `json:"max_availability,omitempty"`
}

// CreationMethod describes an available character creation strategy for an edition.
type CreationMethod struct {
	Label                           string                        `json:"label"`
	Description                     string                        `json:"description,omitempty"`
	SupportsMultipleColumnSelection bool                          `json:"supports_multiple_column_selection,omitempty"`
	PointBudget                     int                           `json:"point_budget,omitempty"`
	PriorityCosts                   map[string]int                `json:"priority_costs,omitempty"`
	SupportsMultipleA               bool                          `json:"supports_multiple_A,omitempty"`
	KarmaBudget                     int                           `json:"karma_budget,omitempty"`
	MetatypeCosts                   map[string]int                `json:"metatype_costs,omitempty"`
	GearConversion                  *CreationMethodGearConversion `json:"gear_conversion,omitempty"`
	MagicQualities                  []CreationMethodMagicQuality  `json:"magic_qualities,omitempty"`
	Notes                           []string                      `json:"notes,omitempty"`
	References                      []string                      `json:"references,omitempty"`
}

// CreationMethodGearConversion captures Karma↔¥ conversion limits.
type CreationMethodGearConversion struct {
	KarmaPerNuyen    float64 `json:"karma_per_nuyen,omitempty"`
	MaxKarmaForGear  int     `json:"max_karma_for_gear,omitempty"`
	MaxStartingNuyen int     `json:"max_starting_nuyen,omitempty"`
}

// CreationMethodMagicQuality represents a quality that unlocks magical abilities in Karma creation.
type CreationMethodMagicQuality struct {
	Name   string                          `json:"name"`
	Cost   int                             `json:"cost"`
	Grants CreationMethodMagicQualityGrant `json:"grants,omitempty"`
	Notes  string                          `json:"notes,omitempty"`
}

// CreationMethodMagicQualityGrant captures benefits from selecting a magic quality.
type CreationMethodMagicQualityGrant struct {
	Attribute       string `json:"attribute,omitempty"`
	Base            int    `json:"base,omitempty"`
	FreePowerPoints string `json:"free_power_points,omitempty"`
	PowerPointCost  int    `json:"power_point_cost,omitempty"`
	AdditionalNotes string `json:"notes,omitempty"`
}

// AdvancementRules captures post-creation progression defaults.
type AdvancementRules struct {
	KarmaCosts     AdvancementKarmaCosts `json:"karma_costs"`
	Training       AdvancementTraining   `json:"training"`
	Limits         AdvancementLimits     `json:"limits"`
	FocusBonding   []FocusBondingRule    `json:"focus_bonding"`
	Notes          []string              `json:"notes,omitempty"`
	FutureFeatures []string              `json:"future_features,omitempty"`
}

// AdvancementKarmaCosts represents the karma formulas for common improvements.
type AdvancementKarmaCosts struct {
	AttributeMultiplier              int `json:"attribute_multiplier"`
	ActiveSkillMultiplier            int `json:"active_skill_multiplier"`
	KnowledgeSkillMultiplier         int `json:"knowledge_skill_multiplier"`
	SkillGroupMultiplier             int `json:"skill_group_multiplier"`
	Specialization                   int `json:"specialization"`
	NewKnowledgeSkill                int `json:"new_knowledge_skill"`
	NewComplexForm                   int `json:"new_complex_form"`
	NewSpell                         int `json:"new_spell"`
	InitiationBase                   int `json:"initiation_base"`
	InitiationPerGrade               int `json:"initiation_per_grade"`
	PositiveQualityMultiplier        int `json:"positive_quality_multiplier"`
	NegativeQualityRemovalMultiplier int `json:"negative_quality_removal_multiplier"`
}

// AdvancementTraining captures downtime expectations for advancement.
type AdvancementTraining struct {
	AttributePerRatingWeeks    int                    `json:"attribute_per_rating_weeks"`
	EdgeRequiresDowntime       bool                   `json:"edge_requires_downtime"`
	InstructorReductionPercent int                    `json:"instructor_reduction_percent,omitempty"`
	ActiveSkillBrackets        []SkillTrainingBracket `json:"active_skill_brackets,omitempty"`
	SkillGroupPerRatingWeeks   int                    `json:"skill_group_per_rating_weeks,omitempty"`
	SpecializationMonths       int                    `json:"specialization_months,omitempty"`
}

// SkillTrainingBracket expresses the time required to raise a skill within a rating band.
type SkillTrainingBracket struct {
	MinRating int    `json:"min_rating"`
	MaxRating int    `json:"max_rating"`
	PerRating int    `json:"per_rating"`
	Unit      string `json:"unit"`
}

// AdvancementLimits captures per-downtime restrictions and concurrency rules.
type AdvancementLimits struct {
	AttributeIncreasePerDowntime        int  `json:"attribute_increase_per_downtime"`
	SkillIncreasePerDowntime            int  `json:"skill_increase_per_downtime"`
	SkillGroupIncreasePerDowntime       int  `json:"skill_group_increase_per_downtime"`
	AllowsSimultaneousAttributeAndSkill bool `json:"allows_simultaneous_attribute_and_skill"`
	AllowsSimultaneousPhysicalAndMental bool `json:"allows_simultaneous_physical_and_mental"`
	RequiresAugmentationRecoveryPause   bool `json:"requires_augmentation_recovery_pause"`
}

// FocusBondingRule represents karma costs for binding magical foci.
type FocusBondingRule struct {
	Type          string `json:"type"`
	Label         string `json:"label"`
	KarmaPerForce int    `json:"karma_per_force"`
}
