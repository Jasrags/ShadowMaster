package v5

// VehicleModificationType represents the category of vehicle modification
type VehicleModificationType string

const (
	VehicleModificationTypeBaseMods          VehicleModificationType = "base_mods"
	VehicleModificationTypePowerTrain        VehicleModificationType = "power_train"
	VehicleModificationTypeProtection        VehicleModificationType = "protection"
	VehicleModificationTypeWeapon            VehicleModificationType = "weapon"
	VehicleModificationTypeBody              VehicleModificationType = "body"
	VehicleModificationTypeElectromagnetic   VehicleModificationType = "electromagnetic"
	VehicleModificationTypeCosmetic          VehicleModificationType = "cosmetic"
)

// ToolType represents the type of tools required for installation
type ToolType string

const (
	ToolTypeKit      ToolType = "kit"
	ToolTypeShop     ToolType = "shop"
	ToolTypeFacility ToolType = "facility"
)

// InstallationSkillType represents the skill required for installation
type InstallationSkillType string

const (
	InstallationSkillTypeHardware InstallationSkillType = "hardware"
	InstallationSkillTypeNone     InstallationSkillType = "none"
)

// CostFormula represents how the cost is calculated
type CostFormula struct {
	// BaseCost is the base cost in nuyen (if fixed)
	BaseCost *int `json:"base_cost,omitempty"`
	// Formula describes the cost formula (e.g., "Rating × 2,000¥", "Body × 500¥", "Accel × 10,000¥")
	Formula string `json:"formula,omitempty"`
	// IsVariable indicates if the cost is variable based on vehicle characteristics
	IsVariable bool `json:"is_variable,omitempty"`
}

// SlotsFormula represents how slots are calculated
type SlotsFormula struct {
	// FixedSlots is the fixed number of slots (if not variable)
	FixedSlots *int `json:"fixed_slots,omitempty"`
	// RatingBased indicates if slots are based on rating (e.g., "[Rating]")
	RatingBased bool `json:"rating_based,omitempty"`
	// IsVariable indicates if slots are variable
	IsVariable bool `json:"is_variable,omitempty"`
	// Description describes the slot requirement (e.g., "variable", "[Rating]")
	Description string `json:"description,omitempty"`
}

// ThresholdFormula represents how the threshold is calculated
type ThresholdFormula struct {
	// FixedThreshold is the fixed threshold (if not variable)
	FixedThreshold *int `json:"fixed_threshold,omitempty"`
	// Formula describes the threshold formula (e.g., "Rating × 3", "Rating × 4")
	Formula string `json:"formula,omitempty"`
	// IsVariable indicates if the threshold is variable
	IsVariable bool `json:"is_variable,omitempty"`
}

// AvailabilityModifier represents availability modifiers
type AvailabilityModifier struct {
	// Value is the base availability rating
	Value int `json:"value,omitempty"`
	// Restricted indicates if it's Restricted (R)
	Restricted bool `json:"restricted,omitempty"`
	// Forbidden indicates if it's Forbidden (F)
	Forbidden bool `json:"forbidden,omitempty"`
	// Formula describes availability formula (e.g., "R × 2", "R × 3", "(R × 3)F")
	Formula string `json:"formula,omitempty"`
	// IsVariable indicates if availability is variable based on rating
	IsVariable bool `json:"is_variable,omitempty"`
}

// VehicleModification represents a vehicle modification definition
type VehicleModification struct {
	// Name is the modification name
	Name string `json:"name,omitempty"`
	// Type indicates the category of modification
	Type VehicleModificationType `json:"type,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Slots describes the slot requirement (may be variable or rating-based)
	Slots SlotsFormula `json:"slots,omitempty"`
	// Threshold describes the installation test threshold
	Threshold ThresholdFormula `json:"threshold,omitempty"`
	// Tools indicates the required tools for installation
	Tools ToolType `json:"tools,omitempty"`
	// Skill indicates the required skill for installation
	Skill InstallationSkillType `json:"skill,omitempty"`
	// Availability describes the availability rating with restrictions
	Availability AvailabilityModifier `json:"availability,omitempty"`
	// Cost describes the cost (may be variable)
	Cost CostFormula `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// VehicleModificationData represents the complete vehicle modification data structure organized by category
type VehicleModificationData struct {
	BaseMods          []VehicleModification `json:"base_mods,omitempty"`
	PowerTrain        []VehicleModification `json:"power_train,omitempty"`
	Protection        []VehicleModification `json:"protection,omitempty"`
	Weapon            []VehicleModification `json:"weapon,omitempty"`
	Body              []VehicleModification `json:"body,omitempty"`
	Electromagnetic   []VehicleModification `json:"electromagnetic,omitempty"`
	Cosmetic          []VehicleModification `json:"cosmetic,omitempty"`
}

// dataVehicleModifications contains all vehicle modification definitions
// This is populated in vehical_modifications_data.go

// GetAllVehicleModifications returns all vehicle modifications
func GetAllVehicleModifications() []VehicleModification {
	modifications := make([]VehicleModification, 0, len(dataVehicleModifications))
	for _, m := range dataVehicleModifications {
		modifications = append(modifications, m)
	}
	return modifications
}

// GetVehicleModificationData returns the complete vehicle modification data structure organized by category
func GetVehicleModificationData() VehicleModificationData {
	data := VehicleModificationData{
		BaseMods:        []VehicleModification{},
		PowerTrain:      []VehicleModification{},
		Protection:      []VehicleModification{},
		Weapon:          []VehicleModification{},
		Body:            []VehicleModification{},
		Electromagnetic: []VehicleModification{},
		Cosmetic:        []VehicleModification{},
	}

	for _, mod := range dataVehicleModifications {
		switch mod.Type {
		case VehicleModificationTypeBaseMods:
			data.BaseMods = append(data.BaseMods, mod)
		case VehicleModificationTypePowerTrain:
			data.PowerTrain = append(data.PowerTrain, mod)
		case VehicleModificationTypeProtection:
			data.Protection = append(data.Protection, mod)
		case VehicleModificationTypeWeapon:
			data.Weapon = append(data.Weapon, mod)
		case VehicleModificationTypeBody:
			data.Body = append(data.Body, mod)
		case VehicleModificationTypeElectromagnetic:
			data.Electromagnetic = append(data.Electromagnetic, mod)
		case VehicleModificationTypeCosmetic:
			data.Cosmetic = append(data.Cosmetic, mod)
		}
	}

	return data
}

// GetVehicleModificationByName returns the vehicle modification definition with the given name, or nil if not found
func GetVehicleModificationByName(name string) *VehicleModification {
	for _, mod := range dataVehicleModifications {
		if mod.Name == name {
			return &mod
		}
	}
	return nil
}

// GetVehicleModificationByKey returns the vehicle modification definition with the given key, or nil if not found
func GetVehicleModificationByKey(key string) *VehicleModification {
	mod, ok := dataVehicleModifications[key]
	if !ok {
		return nil
	}
	return &mod
}

// GetVehicleModificationsByType returns all vehicle modifications in the specified type
func GetVehicleModificationsByType(modType VehicleModificationType) []VehicleModification {
	modifications := make([]VehicleModification, 0)
	for _, m := range dataVehicleModifications {
		if m.Type == modType {
			modifications = append(modifications, m)
		}
	}
	return modifications
}

