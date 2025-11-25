package v5

// ActivationType represents how a power is activated
type ActivationType string

const (
	ActivationTypeFreeAction   ActivationType = "free_action"
	ActivationTypeSimpleAction ActivationType = "simple_action"
	ActivationTypeInterrupt     ActivationType = "interrupt"
	ActivationTypePassive       ActivationType = "passive"
)

// PowerCostFormula represents how the power point cost is calculated
type PowerCostFormula struct {
	// BaseCost is the base cost in power points (if fixed)
	BaseCost *float64 `json:"base_cost,omitempty"`
	// CostPerLevel is the cost per level (e.g., 0.25 PP per level)
	CostPerLevel *float64 `json:"cost_per_level,omitempty"`
	// AdditionalCost is additional cost formula (e.g., "0.5 PP + level")
	AdditionalCost *float64 `json:"additional_cost,omitempty"`
	// MaxLevel is the maximum level allowed (e.g., "Max 3")
	MaxLevel *int `json:"max_level,omitempty"`
	// CostPerItem is the cost per item (e.g., "0.25 PP each")
	CostPerItem *float64 `json:"cost_per_item,omitempty"`
	// Formula describes the cost formula as text (e.g., "0.5 PP + level (Max 3)")
	Formula string `json:"formula,omitempty"`
	// IsVariable indicates if the cost is variable
	IsVariable bool `json:"is_variable,omitempty"`
}

// Power represents a power definition
type Power struct {
	// Name is the power name (e.g., "Adrenaline Boost", "Attribute Boost (Attribute)")
	Name string `json:"name,omitempty"`
	// Parameter describes the parameter type if applicable (e.g., "Attribute", "Skill", "Limit")
	Parameter string `json:"parameter,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Prerequisite lists prerequisites (if any)
	Prerequisite string `json:"prerequisite,omitempty"`
	// Activation describes how the power is activated
	Activation ActivationType `json:"activation,omitempty"`
	// ActivationDescription is the activation description as text (e.g., "Free Action", "Interrupt (-5 Initiative)")
	ActivationDescription string `json:"activation_description,omitempty"`
	// Cost describes the power point cost
	Cost PowerCostFormula `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataPowers contains all power definitions
// This is populated in powers_data.go

// GetAllPowers returns all powers
func GetAllPowers() []Power {
	powers := make([]Power, 0, len(dataPowers))
	for _, p := range dataPowers {
		powers = append(powers, p)
	}
	return powers
}

// GetPowerByName returns the power definition with the given name, or nil if not found
func GetPowerByName(name string) *Power {
	for _, power := range dataPowers {
		if power.Name == name {
			return &power
		}
	}
	return nil
}

// GetPowerByKey returns the power definition with the given key, or nil if not found
func GetPowerByKey(key string) *Power {
	power, ok := dataPowers[key]
	if !ok {
		return nil
	}
	return &power
}

// GetPowersByActivation returns all powers with the specified activation type
func GetPowersByActivation(activation ActivationType) []Power {
	powers := make([]Power, 0)
	for _, p := range dataPowers {
		if p.Activation == activation {
			powers = append(powers, p)
		}
	}
	return powers
}

