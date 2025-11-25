package v5

// dataVehicleModifications contains all vehicle modification definitions
var dataVehicleModifications = map[string]VehicleModification{
	// Base Mods
	"rigger_interface": {
		Name: "Rigger Interface",
		Type: VehicleModificationTypeBaseMods,
		Availability: AvailabilityModifier{
			Value: 4,
		},
		Cost: CostFormula{
			BaseCost: intPtr(1000),
			Formula:  "1,000¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
	"standard_weapon_mount": {
		Name: "Standard Weapon Mount",
		Type: VehicleModificationTypeBaseMods,
		Availability: AvailabilityModifier{
			Value:     8,
			Forbidden: true,
		},
		Cost: CostFormula{
			BaseCost: intPtr(2500),
			Formula:  "2,500¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
	"heavy_weapon_mount": {
		Name: "Heavy Weapon Mount",
		Type: VehicleModificationTypeBaseMods,
		Availability: AvailabilityModifier{
			Value:     14,
			Forbidden: true,
		},
		Cost: CostFormula{
			BaseCost: intPtr(5000),
			Formula:  "5,000¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
	"manual_operation": {
		Name: "Manual Operation",
		Type: VehicleModificationTypeBaseMods,
		Availability: AvailabilityModifier{
			Value: 1,
		},
		Cost: CostFormula{
			BaseCost: intPtr(500),
			Formula:  "+500¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
	// Weapon Modifications
	"standard_weapon_mount_weapon": {
		Name: "Standard Weapon Mount",
		Type: VehicleModificationTypeWeapon,
		Availability: AvailabilityModifier{
			Value:     8,
			Forbidden: true,
		},
		Cost: CostFormula{
			BaseCost: intPtr(2500),
			Formula:  "2,500¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
	"heavy_weapon_mount_weapon": {
		Name: "Heavy Weapon Mount",
		Type: VehicleModificationTypeWeapon,
		Availability: AvailabilityModifier{
			Value:     14,
			Forbidden: true,
		},
		Cost: CostFormula{
			BaseCost: intPtr(5000),
			Formula:  "5,000¥",
		},
		Source: &SourceReference{Source: "SR5"},
	},
}
