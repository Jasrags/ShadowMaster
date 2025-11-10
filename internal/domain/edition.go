package domain

// PriorityOption describes a single priority choice (A-E) for a category.
type PriorityOption struct {
	Label       string `json:"label"`
	Summary     string `json:"summary,omitempty"`
	Description string `json:"description,omitempty"`
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
	Priorities     map[string]map[string]PriorityOption `json:"priorities"`
	Metatypes      []MetatypeDefinition                 `json:"metatypes"`
	GameplayLevels map[string]GameplayLevel             `json:"gameplay_levels,omitempty"`
	CreationMethods map[string]CreationMethod           `json:"creation_methods,omitempty"`
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
	Label                              string                               `json:"label"`
	Description                        string                               `json:"description,omitempty"`
	SupportsMultipleColumnSelection    bool                                 `json:"supports_multiple_column_selection,omitempty"`
	PointBudget                        int                                  `json:"point_budget,omitempty"`
	PriorityCosts                      map[string]int                       `json:"priority_costs,omitempty"`
	SupportsMultipleA                  bool                                 `json:"supports_multiple_A,omitempty"`
	KarmaBudget                        int                                  `json:"karma_budget,omitempty"`
	MetatypeCosts                      map[string]int                       `json:"metatype_costs,omitempty"`
	GearConversion                     *CreationMethodGearConversion        `json:"gear_conversion,omitempty"`
	MagicQualities                     []CreationMethodMagicQuality         `json:"magic_qualities,omitempty"`
	Notes                              []string                             `json:"notes,omitempty"`
	References                         []string                             `json:"references,omitempty"`
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
	Attribute        string  `json:"attribute,omitempty"`
	Base             int     `json:"base,omitempty"`
	FreePowerPoints  string  `json:"free_power_points,omitempty"`
	PowerPointCost   int     `json:"power_point_cost,omitempty"`
	AdditionalNotes  string  `json:"notes,omitempty"`
}
