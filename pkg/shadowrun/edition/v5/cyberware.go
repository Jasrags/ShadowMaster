package v5

// CyberwareGrade represents a cyberware grade (Standard, Used, Alphaware, etc.)
// Note: This is the same structure as bioware Grade, but kept separate for clarity
type CyberwareGrade struct {
	Name         string      `json:"name"`
	Ess          string      `json:"ess"`             // Essence cost modifier like "1", "0.8", "1.25"
	Cost         string      `json:"cost"`            // Cost modifier like "1", "0.75", "1.2"
	DeviceRating string      `json:"devicerating"`    // Device rating (usually "2")
	Avail        string      `json:"avail"`           // Availability modifier like "0", "-4", "+2"
	Source       string      `json:"source"`          // Source book like "SR5", "CF", etc.
	Page         string      `json:"page,omitempty"`  // Page number
	Bonus        interface{} `json:"bonus,omitempty"` // Bonuses (can be complex structure)
}

// CyberwareCategory represents a cyberware category with its black market classification
type CyberwareCategory struct {
	Name        string `json:"name"`         // Category name
	BlackMarket string `json:"black_market"` // Black market classification
}

// Cyberware represents a piece of cyberware from Shadowrun 5th Edition
type Cyberware struct {
	// Required fields
	Name     string `json:"name"`
	Category string `json:"category"`
	Ess      string `json:"ess"`      // Essence cost like "Rating * 0.75", "0.1", "FixedValues(0.2,0.5)"
	Capacity string `json:"capacity"` // Capacity like "0", "Rating"
	Avail    string `json:"avail"`    // Availability like "(Rating * 6)F", "4", "FixedValues(8,12)"
	Cost     string `json:"cost"`     // Cost like "Rating * 55000", "4000", "Variable(50-500)"
	Source   string `json:"source"`   // Source book like "SR5", "CF", etc.

	// Optional fields
	Rating                   int                `json:"rating,omitempty"`                   // Rating for variable rating items (always numeric)
	Limit                    string             `json:"limit,omitempty"`                    // Limit like "False", "{arm}", "{leg}", etc.
	BannedGrades             *BannedGrades      `json:"bannedgrades,omitempty"`             // Grades that cannot be used
	BannedWareGrades         interface{}        `json:"bannedwaregrades,omitempty"`         // Banned ware grades
	Bonus                    *CyberwareBonus    `json:"bonus,omitempty"`                    // Bonuses provided by this cyberware
	WirelessBonus            *CyberwareBonus    `json:"wirelessbonus,omitempty"`            // Bonuses when wireless is enabled
	Forbidden                *Forbidden         `json:"forbidden,omitempty"`                // Forbidden items/qualities
	AllowGear                *AllowGear         `json:"allowgear,omitempty"`                // Allowed gear categories
	AllowSubsystems          *AllowSubsystems   `json:"allowsubsystems,omitempty"`          // Allowed subsystems
	Subsystems               interface{}        `json:"subsystems,omitempty"`               // Subsystems
	Notes                    string             `json:"notes,omitempty"`                    // Additional notes
	PairBonus                *PairBonus         `json:"pairbonus,omitempty"`                // Bonus when paired with another item
	WirelessPairBonus        *PairBonus         `json:"wirelesspairbonus,omitempty"`        // Wireless pair bonus
	PairInclude              *PairInclude       `json:"pairinclude,omitempty"`              // Item that pairs with this
	WirelessPairInclude      *PairInclude       `json:"wirelesspairinclude,omitempty"`      // Wireless pair include
	SelectSide               *bool              `json:"selectside,omitempty"`               // Whether a side can be selected
	AddWeapon                string             `json:"addweapon,omitempty"`                // Weapon added by this cyberware
	AddVehicle               string             `json:"addvehicle,omitempty"`               // Vehicle added by this cyberware
	Hide                     *bool              `json:"hide,omitempty"`                     // Whether to hide this cyberware
	Required                 *CyberwareRequired `json:"required,omitempty"`                 // Requirements for this cyberware
	ForceGrade               string             `json:"forcegrade,omitempty"`               // Force grade
	DeviceRating             string             `json:"devicerating,omitempty"`             // Device rating
	MinRating                string             `json:"minrating,omitempty"`                // Minimum rating
	RatingLabel              string             `json:"ratinglabel,omitempty"`              // Rating label
	RemovalCost              string             `json:"removalcost,omitempty"`              // Removal cost
	LimbSlot                 string             `json:"limbslot,omitempty"`                 // Limb slot
	LimbSlotCount            string             `json:"limbslotcount,omitempty"`            // Limb slot count
	ModularMount             string             `json:"modularmount,omitempty"`             // Modular mount
	MountsTo                 string             `json:"mountsto,omitempty"`                 // Mounts to
	InheritAttributes        *bool              `json:"inheritattributes,omitempty"`        // Inherit attributes
	AddToParentCapacity      string             `json:"addtoparentcapacity,omitempty"`      // Add to parent capacity
	AddParentWeaponAccessory string             `json:"addparentweaponaccessory,omitempty"` // Add parent weapon accessory
	RequireParent            *bool              `json:"requireparent,omitempty"`            // Whether a parent is required
	BlocksMounts             string             `json:"blocksmounts,omitempty"`             // Mounts blocked by this cyberware
	Gears                    interface{}        `json:"gears,omitempty"`                    // Gears that can be used with this cyberware
	Programs                 interface{}        `json:"programs,omitempty"`                 // Programs
	Page                     string             `json:"page,omitempty"`                     // Page number
}

// CyberwareBonus represents bonuses provided by cyberware
// This reuses many of the same bonus types as bioware
type CyberwareBonus struct {
	// Limit modifiers
	LimitModifier interface{} `json:"limitmodifier,omitempty"` // Can be LimitModifier or []LimitModifier

	// Skill bonuses
	SkillCategory        interface{}                `json:"skillcategory,omitempty"`        // Can be SkillCategoryBonus or []SkillCategoryBonus
	SpecificSkill        interface{}                `json:"specificskill,omitempty"`        // Can be SpecificSkillBonus or []SpecificSkillBonus
	SkillGroup           interface{}                `json:"skillgroup,omitempty"`           // Can be SkillGroupBonus or []SkillGroupBonus
	SelectSkill          *SelectSkill               `json:"selectskill,omitempty"`          // Selectable skill bonus
	SkillAttribute       *SkillAttributeBonus       `json:"skillattribute,omitempty"`       // Skill attribute bonus
	SkillLinkedAttribute *SkillLinkedAttributeBonus `json:"skilllinkedattribute,omitempty"` // Skill linked attribute bonus
	SkillSoftAccess      interface{}                `json:"skillsoftaccess,omitempty"`      // Skillsoft access bonus

	// Attribute bonuses
	SpecificAttribute  interface{}              `json:"specificattribute,omitempty"`  // Can be SpecificAttributeBonus or []SpecificAttributeBonus
	AttributeKarmaCost *AttributeKarmaCostBonus `json:"attributekarmacost,omitempty"` // Attribute karma cost modifier

	// Limit bonuses
	PhysicalLimit string `json:"physicallimit,omitempty"` // Physical limit modifier
	MentalLimit   string `json:"mentallimit,omitempty"`   // Mental limit modifier
	SocialLimit   string `json:"sociallimit,omitempty"`   // Social limit modifier

	// Condition monitor bonuses
	ConditionMonitor *ConditionMonitorBonus `json:"conditionmonitor,omitempty"`

	// Initiative bonuses
	Initiative     *InitiativeBonus     `json:"initiative,omitempty"`     // Initiative bonus
	InitiativePass *InitiativePassBonus `json:"initiativepass,omitempty"` // Initiative pass bonus

	// Combat bonuses
	Dodge string `json:"dodge,omitempty"` // Dodge bonus

	// Damage bonuses
	DamageResistance  string               `json:"damageresistance,omitempty"`  // Damage resistance bonus
	UnarmedDV         string               `json:"unarmeddv,omitempty"`         // Unarmed damage value bonus
	UnarmedDVPhysical *bool                `json:"unarmeddvphysical,omitempty"` // Whether unarmed DV is physical
	UnarmedReach      string               `json:"unarmedreach,omitempty"`      // Unarmed reach bonus
	WeaponAccuracy    *WeaponAccuracyBonus `json:"weaponaccuracy,omitempty"`    // Weapon accuracy bonus

	// Armor bonuses
	Armor            interface{} `json:"armor,omitempty"`            // Can be ArmorBonus or string
	FireArmor        string      `json:"firearmor,omitempty"`        // Fire armor bonus
	ColdArmor        string      `json:"coldarmor,omitempty"`        // Cold armor bonus
	ElectricityArmor string      `json:"electricityarmor,omitempty"` // Electricity armor bonus

	// Resistance/immunity bonuses
	ToxinContactResist       string `json:"toxincontactresist,omitempty"`
	ToxinIngestionResist     string `json:"toxiningestionresist,omitempty"`
	ToxinInhalationResist    string `json:"toxininhalationresist,omitempty"`
	ToxinInjectionResist     string `json:"toxininjectionresist,omitempty"`
	PathogenContactResist    string `json:"pathogencontactresist,omitempty"`
	PathogenIngestionResist  string `json:"pathogeningestionresist,omitempty"`
	PathogenInhalationResist string `json:"pathogeninhalationresist,omitempty"`
	PathogenInjectionResist  string `json:"pathogeninjectionresist,omitempty"`

	// Radiation resistance
	RadiationResist string `json:"radiationresist,omitempty"`

	// Fatigue resistance
	FatigueResist string `json:"fatigueresist,omitempty"`

	// Recovery bonuses
	StunCMRecovery     string `json:"stuncmrecovery,omitempty"`     // Stun condition monitor recovery
	PhysicalCMRecovery string `json:"physicalcmrecovery,omitempty"` // Physical condition monitor recovery

	// Memory bonus
	Memory string `json:"memory,omitempty"` // Memory bonus

	// Magic resistance bonuses
	DrainResist              string `json:"drainresist,omitempty"`
	FadingResist             string `json:"fadingresist,omitempty"`
	DirectManaSpellResist    string `json:"directmanaspellresist,omitempty"`
	DetectionSpellResist     string `json:"detectionspellresist,omitempty"`
	ManaIllusionResist       string `json:"manaillusionresist,omitempty"`
	MentalManipulationResist string `json:"mentalmanipulationresist,omitempty"`

	// Attribute decrease resistance
	DecreaseBODResist string `json:"decreasebodresist,omitempty"`
	DecreaseAGIResist string `json:"decreaseagiresist,omitempty"`
	DecreaseREAResist string `json:"decreaserearesist,omitempty"`
	DecreaseSTRResist string `json:"decreasestrresist,omitempty"`
	DecreaseCHAResist string `json:"decreasecharesist,omitempty"`
	DecreaseINTResist string `json:"decreaseintresist,omitempty"`
	DecreaseLOGResist string `json:"decreaselogresist,omitempty"`
	DecreaseWILResist string `json:"decreasewilresist,omitempty"`

	// Social bonuses
	Composure              string `json:"composure,omitempty"`
	JudgeIntentionsDefense string `json:"judgeintentionsdefense,omitempty"`

	// Lifestyle cost
	LifestyleCost string `json:"lifestylecost,omitempty"` // Lifestyle cost modifier

	// Addiction resistance
	PhysiologicalAddictionFirstTime       string `json:"physiologicaladdictionfirsttime,omitempty"`
	PsychologicalAddictionFirstTime       string `json:"psychologicaladdictionfirsttime,omitempty"`
	PhysiologicalAddictionAlreadyAddicted string `json:"physiologicaladdictionalreadyaddicted,omitempty"`
	PsychologicalAddictionAlreadyAddicted string `json:"psychologicaladdictionalreadyaddicted,omitempty"`

	// Special bonuses
	DisableQuality             string        `json:"disablequality,omitempty"`             // Quality to disable
	AddQualities               *AddQualities `json:"addqualities,omitempty"`               // Qualities to add
	ReflexRecorderOptimization *bool         `json:"reflexrecorderoptimization,omitempty"` // Reflex recorder optimization
	Ambidextrous               *bool         `json:"ambidextrous,omitempty"`               // Ambidextrous bonus
	Adapsin                    *bool         `json:"adapsin,omitempty"`                    // Adapsin bonus

	// Unique identifier
	Unique string `json:"+@unique,omitempty"`

	// Select text
	SelectText *SelectTextBonus `json:"selecttext,omitempty"`
}

// CyberwareRequired represents requirements for cyberware
type CyberwareRequired struct {
	ParentDetails interface{} `json:"parentdetails,omitempty"` // Parent details requirement
}

// Reuse structs from bioware.go for common structures
// BannedGrades, Forbidden, AllowGear, AllowSubsystems, PairBonus, PairInclude
// are already defined in bioware.go and can be reused
