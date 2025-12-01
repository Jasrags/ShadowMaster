package v5

import "fmt"

// GearCategory represents the category of gear item
type GearCategory string

const (
	GearCategoryElectronics         GearCategory = "electronics"
	GearCategoryRFIDTags            GearCategory = "rfid_tags"
	GearCategoryCommunications      GearCategory = "communications"
	GearCategorySoftware            GearCategory = "software"
	GearCategorySkillsofts          GearCategory = "skillsofts"
	GearCategoryIDAndCredit         GearCategory = "id_and_credit"
	GearCategoryTools               GearCategory = "tools"
	GearCategoryOpticalAndImaging   GearCategory = "optical_and_imaging"
	GearCategoryVisionEnhancements  GearCategory = "vision_enhancements"
	GearCategoryAudioDevices        GearCategory = "audio_devices"
	GearCategoryAudioEnhancements   GearCategory = "audio_enhancements"
	GearCategorySensors             GearCategory = "sensors"
	GearCategorySecurityDevices     GearCategory = "security_devices"
	GearCategoryBreakingAndEntering GearCategory = "breaking_and_entering"
	GearCategoryIndustrialChemicals GearCategory = "industrial_chemicals"
	GearCategorySurvivalGear        GearCategory = "survival_gear"
	GearCategoryGrappleGun          GearCategory = "grapple_gun"
	GearCategoryBiotech             GearCategory = "biotech"
	GearCategorySlapPatches         GearCategory = "slap_patches"
)

// GearMechanicalEffect represents mechanical effects of gear items
type GearMechanicalEffect struct {
	// DicePoolBonus adds to dice pool on specific tests
	DicePoolBonus int `json:"dice_pool_bonus,omitempty"`
	// LimitBonus adds to limit on specific tests
	LimitBonus int `json:"limit_bonus,omitempty"`
	// RatingBonus adds to rating for specific purposes
	RatingBonus int `json:"rating_bonus,omitempty"`
	// TestType describes what type of test is affected (e.g., "First Aid", "Perception", "Electronic Warfare")
	TestType string `json:"test_type,omitempty"`
	// SkillSubstitution describes if a skill can be substituted
	SkillSubstitution string `json:"skill_substitution,omitempty"`
	// PerceptionPenalty is a penalty to Perception Tests (negative value)
	PerceptionPenalty int `json:"perception_penalty,omitempty"`
	// NoiseReduction reduces Noise by this amount
	NoiseReduction int `json:"noise_reduction,omitempty"`
	// DamageValue is damage dealt (for items like thermite burning bar, miniwelder)
	DamageValue string `json:"damage_value,omitempty"`
	// ArmorValue is armor rating (for items like restraints)
	ArmorValue int `json:"armor_value,omitempty"`
	// StructureValue is structure rating (for items like restraints)
	StructureValue int `json:"structure_value,omitempty"`
	// StrengthMultiplier multiplies effective Strength (e.g., 2 for chisel/crowbar)
	StrengthMultiplier int `json:"strength_multiplier,omitempty"`
	// WeightCapacity is weight capacity in kilograms (for ropes)
	WeightCapacity int `json:"weight_capacity,omitempty"`
	// Range describes range or maximum range (e.g., "20 meters", "100 meters", "1 kilometer")
	Range string `json:"range,omitempty"`
	// AreaEffect describes area of effect (e.g., "spherical area", "conical area with 30-degree spread")
	AreaEffect string `json:"area_effect,omitempty"`
	// Duration describes duration of effects (e.g., "20 minutes", "Rating x 10 minutes")
	Duration string `json:"duration,omitempty"`
	// Charges describes charge capacity and recharge rate
	Charges string `json:"charges,omitempty"`
	// OperatingTime describes operating time (e.g., "30 minutes", "2 hours")
	OperatingTime string `json:"operating_time,omitempty"`
	// OtherEffects describes any other mechanical effects
	OtherEffects string `json:"other_effects,omitempty"`
}

// GearSpecialProperty represents special properties of gear
type GearSpecialProperty struct {
	// ConcealabilityModifier modifies concealability (negative = easier to conceal)
	ConcealabilityModifier int `json:"concealability_modifier,omitempty"`
	// Capacity describes capacity for modifications/accessories
	Capacity int `json:"capacity,omitempty"`
	// MaxRating is the maximum rating available
	MaxRating int `json:"max_rating,omitempty"`
	// RequiresCapacity describes capacity requirements when installed in other items
	RequiresCapacity int `json:"requires_capacity,omitempty"`
	// Size describes size/portability (e.g., "fits in pocket", "handheld case", "portable", "transportable")
	Size string `json:"size,omitempty"`
	// RestockingRequirement describes restocking needs (e.g., "after every Rating uses")
	RestockingRequirement string `json:"restocking_requirement,omitempty"`
	// CompatibleWith lists what this item is compatible with
	CompatibleWith []string `json:"compatible_with,omitempty"`
	// Requires lists prerequisites (e.g., "direct neural interface", "skilljack", "skillwire system")
	Requires []string `json:"requires,omitempty"`
	// CannotCombineWith lists items this cannot be combined with
	CannotCombineWith []string `json:"cannot_combine_with,omitempty"`
	// OpticalOnly indicates if this is an optical device (not electronic)
	OpticalOnly bool `json:"optical_only,omitempty"`
	// WirelessRequired indicates if wireless capability is required
	WirelessRequired bool `json:"wireless_required,omitempty"`
	// NoWirelessCapability indicates if the item has no wireless capability
	NoWirelessCapability bool `json:"no_wireless_capability,omitempty"`
	// AlwaysRunsSilent indicates if the item always runs silent
	AlwaysRunsSilent bool `json:"always_runs_silent,omitempty"`
	// EMPHardened indicates if the item is EMP hardened
	EMPHardened bool `json:"emp_hardened,omitempty"`
	// CanChangeOwner indicates if the owner can be changed (for RFID tags)
	CanChangeOwner bool `json:"can_change_owner,omitempty"`
	// OtherProperties describes any other special properties
	OtherProperties string `json:"other_properties,omitempty"`
}

// Gear represents a gear item definition
type Gear struct {
	// Name is the item name (e.g., "Commlink", "AR gloves", "Medkit")
	Name string `json:"name,omitempty"`
	// Category indicates the category of gear item
	Category GearCategory `json:"category,omitempty"`
	// Subcategory is a more specific subcategory (e.g., "Commlinks", "RFID Tags", "Vision Enhancements")
	Subcategory string `json:"subcategory,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Cost is the cost in nuyen (0 if cost varies by rating/model)
	// Deprecated: Use CostFormula instead for structured cost handling
	Cost int `json:"cost,omitempty"`
	// CostPerRating indicates if cost is per rating level
	// Deprecated: Use CostFormula instead for structured cost handling
	CostPerRating bool `json:"cost_per_rating,omitempty"`
	// CostFormulaString is a formula for calculating cost (e.g., "Capacity*50", "Rating*100")
	// Deprecated: Use CostFormula instead for structured cost handling
	CostFormulaString string `json:"cost_formula_string,omitempty"`
	// CostFormula is the structured cost formula (new format)
	CostFormula *CostFormula `json:"cost_formula,omitempty"`
	// Availability is the availability code (e.g., "2", "4R", "8F")
	Availability string `json:"availability,omitempty"`
	// Rating is the rating for the item (1-6 typically, or varies)
	Rating int `json:"rating,omitempty"`
	// DeviceType is the device type (for devices with device ratings)
	DeviceType DeviceType `json:"device_type,omitempty"`
	// DeviceRating is the device rating (if different from Rating)
	DeviceRating int `json:"device_rating,omitempty"`
	// MechanicalEffects describes the mechanical effects of the gear
	MechanicalEffects *GearMechanicalEffect `json:"mechanical_effects,omitempty"`
	// SpecialProperties describes special properties of the gear
	SpecialProperties *GearSpecialProperty `json:"special_properties,omitempty"`
	// WirelessBonus describes wireless-enabled functionality
	WirelessBonus *WirelessBonus `json:"wireless_bonus,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// GearsData represents the complete gear data structure
type GearsData struct {
	Electronics         []Gear `json:"electronics,omitempty"`
	RFIDTags            []Gear `json:"rfid_tags,omitempty"`
	Communications      []Gear `json:"communications,omitempty"`
	Software            []Gear `json:"software,omitempty"`
	Skillsofts          []Gear `json:"skillsofts,omitempty"`
	IDAndCredit         []Gear `json:"id_and_credit,omitempty"`
	Tools               []Gear `json:"tools,omitempty"`
	OpticalAndImaging   []Gear `json:"optical_and_imaging,omitempty"`
	VisionEnhancements  []Gear `json:"vision_enhancements,omitempty"`
	AudioDevices        []Gear `json:"audio_devices,omitempty"`
	AudioEnhancements   []Gear `json:"audio_enhancements,omitempty"`
	Sensors             []Gear `json:"sensors,omitempty"`
	SecurityDevices     []Gear `json:"security_devices,omitempty"`
	BreakingAndEntering []Gear `json:"breaking_and_entering,omitempty"`
	IndustrialChemicals []Gear `json:"industrial_chemicals,omitempty"`
	SurvivalGear        []Gear `json:"survival_gear,omitempty"`
	GrappleGun          []Gear `json:"grapple_gun,omitempty"`
	Biotech             []Gear `json:"biotech,omitempty"`
	SlapPatches         []Gear `json:"slap_patches,omitempty"`
}

// GetAllGear returns all gear items
func GetAllGear() []Gear {
	gear := make([]Gear, 0, len(dataGear))
	for _, g := range dataGear {
		gear = append(gear, g)
	}
	return gear
}

// GetGearsData returns the complete gear data structure organized by category
func GetGearsData() GearsData {
	data := GearsData{
		Electronics:         []Gear{},
		RFIDTags:            []Gear{},
		Communications:      []Gear{},
		Software:            []Gear{},
		Skillsofts:          []Gear{},
		IDAndCredit:         []Gear{},
		Tools:               []Gear{},
		OpticalAndImaging:   []Gear{},
		VisionEnhancements:  []Gear{},
		AudioDevices:        []Gear{},
		AudioEnhancements:   []Gear{},
		Sensors:             []Gear{},
		SecurityDevices:     []Gear{},
		BreakingAndEntering: []Gear{},
		IndustrialChemicals: []Gear{},
		SurvivalGear:        []Gear{},
		GrappleGun:          []Gear{},
		Biotech:             []Gear{},
		SlapPatches:         []Gear{},
	}

	for _, gear := range dataGear {
		switch gear.Category {
		case GearCategoryElectronics:
			data.Electronics = append(data.Electronics, gear)
		case GearCategoryRFIDTags:
			data.RFIDTags = append(data.RFIDTags, gear)
		case GearCategoryCommunications:
			data.Communications = append(data.Communications, gear)
		case GearCategorySoftware:
			data.Software = append(data.Software, gear)
		case GearCategorySkillsofts:
			data.Skillsofts = append(data.Skillsofts, gear)
		case GearCategoryIDAndCredit:
			data.IDAndCredit = append(data.IDAndCredit, gear)
		case GearCategoryTools:
			data.Tools = append(data.Tools, gear)
		case GearCategoryOpticalAndImaging:
			data.OpticalAndImaging = append(data.OpticalAndImaging, gear)
		case GearCategoryVisionEnhancements:
			data.VisionEnhancements = append(data.VisionEnhancements, gear)
		case GearCategoryAudioDevices:
			data.AudioDevices = append(data.AudioDevices, gear)
		case GearCategoryAudioEnhancements:
			data.AudioEnhancements = append(data.AudioEnhancements, gear)
		case GearCategorySensors:
			data.Sensors = append(data.Sensors, gear)
		case GearCategorySecurityDevices:
			data.SecurityDevices = append(data.SecurityDevices, gear)
		case GearCategoryBreakingAndEntering:
			data.BreakingAndEntering = append(data.BreakingAndEntering, gear)
		case GearCategoryIndustrialChemicals:
			data.IndustrialChemicals = append(data.IndustrialChemicals, gear)
		case GearCategorySurvivalGear:
			data.SurvivalGear = append(data.SurvivalGear, gear)
		case GearCategoryGrappleGun:
			data.GrappleGun = append(data.GrappleGun, gear)
		case GearCategoryBiotech:
			data.Biotech = append(data.Biotech, gear)
		case GearCategorySlapPatches:
			data.SlapPatches = append(data.SlapPatches, gear)
		}
	}

	return data
}

// GetGearByName returns the gear definition with the given name, or nil if not found
func GetGearByName(name string) *Gear {
	for _, gear := range dataGear {
		if gear.Name == name {
			return &gear
		}
	}
	return nil
}

// GetGearByKey returns the gear definition with the given key, or nil if not found
func GetGearByKey(key string) *Gear {
	gear, ok := dataGear[key]
	if !ok {
		return nil
	}
	return &gear
}

// GetGearByCategory returns all gear items in the specified category
func GetGearByCategory(category GearCategory) []Gear {
	gear := make([]Gear, 0)
	for _, g := range dataGear {
		if g.Category == category {
			gear = append(gear, g)
		}
	}
	return gear
}

// DeliveryTimeEntry represents a single entry in the delivery times table
type DeliveryTimeEntry struct {
	// CostRange describes the cost range (e.g., "Up to 100¥", "101¥ to 1,000¥")
	CostRange string `json:"cost_range,omitempty"`
	// DeliveryTime describes the delivery time (e.g., "6 hours", "1 day", "1 week")
	DeliveryTime string `json:"delivery_time,omitempty"`
	// MinCost is the minimum cost in the range (0 for "Up to X")
	MinCost int `json:"min_cost,omitempty"`
	// MaxCost is the maximum cost in the range (0 means no maximum)
	MaxCost int `json:"max_cost,omitempty"`
}

// DeviceType represents the type of device
type DeviceType string

const (
	DeviceTypeSimple       DeviceType = "Simple"
	DeviceTypeAverage      DeviceType = "Average"
	DeviceTypeSmart        DeviceType = "Smart"
	DeviceTypeAdvanced     DeviceType = "Advanced"
	DeviceTypeCuttingEdge  DeviceType = "Cutting Edge"
	DeviceTypeBleedingEdge DeviceType = "Bleeding Edge"
)

// DeviceRatingEntry represents a device type and its rating
type DeviceRatingEntry struct {
	// Type is the device type
	Type DeviceType `json:"type,omitempty"`
	// Rating is the device rating (1-6)
	Rating int `json:"rating,omitempty"`
}

// ConcealabilityModifierEntry represents a concealability modifier and example items
type ConcealabilityModifierEntry struct {
	// Modifier is the concealability modifier value (e.g., -6, -4, 0, +2, +10)
	Modifier int `json:"modifier,omitempty"`
	// Description is the modifier description (e.g., "+10/Forget about it")
	Description string `json:"description,omitempty"`
	// ExampleItems lists example items for this modifier level
	ExampleItems []string `json:"example_items,omitempty"`
}

// GetDeliveryTimes returns the delivery times table data
func GetDeliveryTimes() []DeliveryTimeEntry {
	return []DeliveryTimeEntry{
		{
			CostRange:    "Up to 100¥",
			DeliveryTime: "6 hours",
			MinCost:      0,
			MaxCost:      100,
		},
		{
			CostRange:    "101¥ to 1,000¥",
			DeliveryTime: "1 day",
			MinCost:      101,
			MaxCost:      1000,
		},
		{
			CostRange:    "1,000¥ to 10,000¥",
			DeliveryTime: "2 days",
			MinCost:      1000,
			MaxCost:      10000,
		},
		{
			CostRange:    "10,001 to 100,000¥",
			DeliveryTime: "1 week",
			MinCost:      10001,
			MaxCost:      100000,
		},
		{
			CostRange:    "More than 100,000¥",
			DeliveryTime: "1 month",
			MinCost:      100001,
			MaxCost:      0, // 0 means no maximum
		},
	}
}

// GetDeviceRatings returns the device ratings table data
func GetDeviceRatings() []DeviceRatingEntry {
	return []DeviceRatingEntry{
		{Type: DeviceTypeSimple, Rating: 1},
		{Type: DeviceTypeAverage, Rating: 2},
		{Type: DeviceTypeSmart, Rating: 3},
		{Type: DeviceTypeAdvanced, Rating: 4},
		{Type: DeviceTypeCuttingEdge, Rating: 5},
		{Type: DeviceTypeBleedingEdge, Rating: 6},
	}
}

// GetDeviceRatingByType returns the rating for a given device type, or 0 if not found
func GetDeviceRatingByType(deviceType DeviceType) int {
	ratings := GetDeviceRatings()
	for _, entry := range ratings {
		if entry.Type == deviceType {
			return entry.Rating
		}
	}
	return 0
}

// GetConcealabilityModifiers returns the concealability modifiers table data
func GetConcealabilityModifiers() []ConcealabilityModifierEntry {
	return []ConcealabilityModifierEntry{
		{
			Modifier:     -6,
			Description:  "-6",
			ExampleItems: []string{"RFID tag", "bug slap patch", "microdrone", "contact lenses"},
		},
		{
			Modifier:     -4,
			Description:  "-4",
			ExampleItems: []string{"Hold-out pistol", "monowhip", "ammo clip", "credstick", "chips/softs", "sequencer/passkey", "autopicker", "lockpick set", "commlink", "glasses"},
		},
		{
			Modifier:     -2,
			Description:  "-2",
			ExampleItems: []string{"Light pistol", "knife", "sap", "minidrone", "microgrenade", "flash-pak", "jammer", "cyberdeck", "rigger command console"},
		},
		{
			Modifier:     0,
			Description:  "0",
			ExampleItems: []string{"Heavy pistol", "machine pistol with folding stock collapsed", "grenade", "goggles", "ammo belt/drum", "club", "extendable baton (collapsed)"},
		},
		{
			Modifier:     2,
			Description:  "+2",
			ExampleItems: []string{"SMG", "machine pistol with folding stock extended", "medkit", "small drone", "extendable baton (extended)", "stun baton"},
		},
		{
			Modifier:     4,
			Description:  "+4",
			ExampleItems: []string{"Sword", "sawed-off shotgun", "bullpup assault rifle"},
		},
		{
			Modifier:     6,
			Description:  "+6",
			ExampleItems: []string{"Katana", "monosword", "shotgun", "assault rifle", "sport rifle", "crossbow"},
		},
		{
			Modifier:     8,
			Description:  "+8",
			ExampleItems: []string{"Sniper rifle", "bow", "grenade launcher", "medium drone"},
		},
		{
			Modifier:     10,
			Description:  "+10/Forget about it",
			ExampleItems: []string{"Machine gun", "rocket launcher", "missile launcher", "staff", "claymore", "metahuman body"},
		},
	}
}

// GetConcealabilityModifierByValue returns the concealability modifier entry for a given modifier value, or nil if not found
func GetConcealabilityModifierByValue(modifier int) *ConcealabilityModifierEntry {
	modifiers := GetConcealabilityModifiers()
	for i := range modifiers {
		if modifiers[i].Modifier == modifier {
			return &modifiers[i]
		}
	}
	return nil
}

// GetDeliveryTimeForCost returns the delivery time for a given cost in nuyen, or empty string if not found
func GetDeliveryTimeForCost(cost int) string {
	deliveryTimes := GetDeliveryTimes()
	for _, entry := range deliveryTimes {
		if entry.MaxCost == 0 {
			// No maximum (last entry)
			if cost >= entry.MinCost {
				return entry.DeliveryTime
			}
		} else {
			if cost >= entry.MinCost && cost <= entry.MaxCost {
				return entry.DeliveryTime
			}
		}
	}
	return ""
}

// Validate validates that the gear definition is well-formed
func (g *Gear) Validate() error {
	if g.Name == "" {
		return fmt.Errorf("gear name is required")
	}
	if g.Category == "" {
		return fmt.Errorf("gear category is required")
	}
	// Validate rating if MaxRating is set
	if g.SpecialProperties != nil && g.SpecialProperties.MaxRating > 0 && g.Rating > 0 && g.Rating > g.SpecialProperties.MaxRating {
		return fmt.Errorf("rating %d exceeds maximum rating %d", g.Rating, g.SpecialProperties.MaxRating)
	}
	// Validate structured cost formula if present
	if g.CostFormula != nil && !g.CostFormula.IsValid() {
		return fmt.Errorf("invalid cost formula")
	}
	return nil
}
