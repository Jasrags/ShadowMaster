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
