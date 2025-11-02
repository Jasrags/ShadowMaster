package v3

// AdeptPowerDefinition represents the definition of an adept power
type AdeptPowerDefinition struct {
	Name           string  `json:"name"`
	Cost           float64 `json:"cost"`           // Fixed cost or per-level cost
	PerLevel       bool    `json:"per_level"`      // True if cost is per level (e.g., 0.25 per level)
	RequiresSpec   string  `json:"requires_spec,omitempty"` // What needs to be specified (e.g., "attribute" for Attribute Boost)
	Description    string  `json:"description,omitempty"`
	MaxLevel       int     `json:"max_level,omitempty"` // Maximum level for per-level powers (0 = no limit)
}

// AdeptPowersDatabase contains available adept powers for Shadowrun 3rd Edition
var AdeptPowersDatabase = []AdeptPowerDefinition{
	{
		Name:        "Astral Perception",
		Cost:        2.0,
		PerLevel:    false,
		Description: "Can perceive the astral plane",
	},
	{
		Name:         "Attribute Boost",
		Cost:         0.25,
		PerLevel:     true,
		RequiresSpec: "attribute", // Must specify which attribute (Body, Quickness, Strength, etc.)
		Description:  "Boosts a physical or mental attribute",
		MaxLevel:     0, // No specified maximum (may be limited by Magic Rating or other rules)
	},
	// More adept powers can be added here as they are provided
}

// GetAllAdeptPowers returns all available adept powers
func GetAllAdeptPowers() []AdeptPowerDefinition {
	return AdeptPowersDatabase
}

// GetAdeptPowerByName returns an adept power definition by name
func GetAdeptPowerByName(name string) *AdeptPowerDefinition {
	for _, power := range AdeptPowersDatabase {
		if power.Name == name {
			return &power
		}
	}
	return nil
}

// CalculateAdeptPowerCost calculates the Power Point cost for an adept power
// For fixed-cost powers, returns the cost
// For per-level powers, returns cost * level
func CalculateAdeptPowerCost(powerName string, level int) (float64, error) {
	power := GetAdeptPowerByName(powerName)
	if power == nil {
		return 0, nil // Unknown power
	}

	if power.PerLevel {
		return power.Cost * float64(level), nil
	}

	return power.Cost, nil
}

