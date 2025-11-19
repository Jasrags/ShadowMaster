package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Grade represents a bioware grade (Standard, Used, Alphaware, etc.)
type Grade struct {
	Name         string `json:"name"`
	Ess          string `json:"ess"`          // Essence multiplier like "1", "0.8", "1.25"
	Cost         string `json:"cost"`         // Cost multiplier like "1", "0.75", "1.2"
	DeviceRating string `json:"devicerating"` // Device rating (usually "0")
	Avail        string `json:"avail"`        // Availability modifier like "0", "-4", "+2"
	Source       string `json:"source"`       // Source book like "SR5", "CF", etc.
}

// BiowareCategory represents a bioware category with its black market classification
// Note: This is separate from armor.Category as they may have different structures in the future
type BiowareCategory struct {
	Name        string `json:"name"`         // Category name
	BlackMarket string `json:"black_market"` // Black market classification
}

// Bioware represents a piece of bioware from Shadowrun 5th Edition
type Bioware struct {
	// Required fields
	Name     string `json:"name"`
	Category string `json:"category"`
	Ess      string `json:"ess"`      // Essence cost like "0.1", "Rating * 0.2", etc.
	Capacity string `json:"capacity"` // Capacity cost (usually "0" for bioware)
	Avail    string `json:"avail"`    // Availability like "4", "(Rating * 6)F", etc.
	Cost     string `json:"cost"`     // Cost like "4000", "Rating * 55000", etc.
	Source   string `json:"source"`   // Source book like "SR5", "CF", etc.

	// Optional fields
	Rating          int              `json:"rating,omitempty"`          // Rating for variable rating items (always numeric)
	Limit           string           `json:"limit,omitempty"`           // Limit like "False", "{arm}", "{leg}", etc.
	Bonus           *BiowareBonus         `json:"bonus,omitempty"`           // Bonuses provided by this bioware
	Forbidden       *common.Forbidden     `json:"forbidden,omitempty"`       // Forbidden items/qualities
	BannedGrades    *common.BannedGrades  `json:"bannedgrades,omitempty"`    // Banned grades for this bioware
	Required        *BiowareRequired      `json:"required,omitempty"`        // Requirements for this bioware
	AllowGear       *common.AllowGear     `json:"allowgear,omitempty"`       // Allowed gear categories
	AllowSubsystems *common.AllowSubsystems `json:"allowsubsystems,omitempty"` // Allowed subsystem categories
	AddWeapon       string           `json:"addweapon,omitempty"`       // Weapon added by this bioware
	AddToParentEss  *bool            `json:"addtoparentess,omitempty"`  // Whether to add to parent essence
	RequireParent   *bool            `json:"requireparent,omitempty"`   // Whether a parent is required
	SelectSide      *bool            `json:"selectside,omitempty"`      // Whether to select side (left/right)
	BlocksMounts    string           `json:"blocksmounts,omitempty"`    // Mounts blocked by this bioware
	PairBonus       *common.PairBonus   `json:"pairbonus,omitempty"`       // Bonus when paired with matching item
	PairInclude     *common.PairInclude `json:"pairinclude,omitempty"`     // Item that pairs with this
	Notes           string           `json:"notes,omitempty"`           // Notes about this bioware
	ForceGrade      string           `json:"forcegrade,omitempty"`      // Force a specific grade (like "None")
	IsGeneware      *bool            `json:"isgeneware,omitempty"`      // Whether this is geneware
}

// BiowareBonus represents bonuses provided by bioware
// This is a very flexible structure with many possible bonus types
// Note: common.BaseBonus exists with all common fields - future migration could embed it
type BiowareBonus struct {
	// Limit modifiers
	LimitModifier interface{} `json:"limitmodifier,omitempty"` // Can be LimitModifier or []LimitModifier

	// Skill bonuses
	SkillCategory        interface{}                      `json:"skillcategory,omitempty"`        // Can be SkillCategoryBonus or []SkillCategoryBonus
	SpecificSkill        interface{}                      `json:"specificskill,omitempty"`        // Can be SpecificSkillBonus or []SpecificSkillBonus
	SkillGroup           interface{}                      `json:"skillgroup,omitempty"`           // Can be SkillGroupBonus or []SkillGroupBonus
	SelectSkill          *common.SelectSkill              `json:"selectskill,omitempty"`          // Selectable skill bonus
	SkillAttribute       *common.SkillAttributeBonus      `json:"skillattribute,omitempty"`       // Skill attribute bonus
	SkillLinkedAttribute *common.SkillLinkedAttributeBonus `json:"skilllinkedattribute,omitempty"` // Skill linked attribute bonus

	// Attribute bonuses
	SpecificAttribute  interface{}                    `json:"specificattribute,omitempty"`  // Can be SpecificAttributeBonus or []SpecificAttributeBonus
	AttributeKarmaCost *common.AttributeKarmaCostBonus `json:"attributekarmacost,omitempty"` // Attribute karma cost modifier

	// Limit bonuses
	PhysicalLimit string `json:"physicallimit,omitempty"` // Physical limit modifier
	MentalLimit   string `json:"mentallimit,omitempty"`   // Mental limit modifier
	SocialLimit   string `json:"sociallimit,omitempty"`   // Social limit modifier

	// Condition monitor bonuses
	ConditionMonitor *common.ConditionMonitorBonus `json:"conditionmonitor,omitempty"`

	// Initiative bonuses
	Initiative     *common.InitiativeBonus     `json:"initiative,omitempty"`     // Initiative bonus
	InitiativePass *common.InitiativePassBonus `json:"initiativepass,omitempty"` // Initiative pass bonus

	// Combat bonuses
	Dodge string `json:"dodge,omitempty"` // Dodge bonus

	// Damage bonuses
	DamageResistance  string               `json:"damageresistance,omitempty"`  // Damage resistance bonus
	UnarmedDV         string               `json:"unarmeddv,omitempty"`         // Unarmed damage value bonus
	UnarmedDVPhysical *bool                `json:"unarmeddvphysical,omitempty"` // Whether unarmed DV is physical
	UnarmedReach      string               `json:"unarmedreach,omitempty"`      // Unarmed reach bonus
	WeaponAccuracy    *common.WeaponAccuracyBonus `json:"weaponaccuracy,omitempty"`    // Weapon accuracy bonus

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
	DisableQuality             string                 `json:"disablequality,omitempty"`             // Quality to disable
	AddQualities               *common.AddQualities   `json:"addqualities,omitempty"`               // Qualities to add
	ReflexRecorderOptimization *bool                  `json:"reflexrecorderoptimization,omitempty"` // Reflex recorder optimization
	Ambidextrous               *bool                  `json:"ambidextrous,omitempty"`               // Ambidextrous bonus
	Adapsin                    *bool                  `json:"adapsin,omitempty"`                    // Adapsin bonus

	// Unique identifier
	Unique string `json:"+@unique,omitempty"`

	// Select text
	SelectText *common.SelectTextBonus `json:"selecttext,omitempty"`
}

// BiowareSkillCategoryBonus represents a skill category bonus for bioware
// Note: Bonus can be a string like "Rating" or an integer
type BiowareSkillCategoryBonus struct {
	Name  string `json:"name"`  // Skill category name like "Academic", "Interest", etc.
	Bonus string `json:"bonus"` // Bonus value like "Rating", "1", etc. (can be string or numeric)
}

// Type aliases for backward compatibility during migration
// These point to the common package types
type (
	SpecificAttributeBonus  = common.SpecificAttributeBonus
	SkillGroupBonus         = common.SkillGroupBonus
	SelectSkill             = common.SelectSkill
	SkillAttributeBonus     = common.SkillAttributeBonus
	SkillLinkedAttributeBonus = common.SkillLinkedAttributeBonus
	AttributeKarmaCostBonus = common.AttributeKarmaCostBonus
	ConditionMonitorBonus   = common.ConditionMonitorBonus
	InitiativeBonus         = common.InitiativeBonus
	InitiativePassBonus     = common.InitiativePassBonus
	ArmorBonus              = common.ArmorBonus
	WeaponAccuracyBonus     = common.WeaponAccuracyBonus
	AddQualities            = common.AddQualities
	SelectTextBonus         = common.SelectTextBonus
	Forbidden               = common.Forbidden
	ForbiddenOneOf          = common.ForbiddenOneOf
	BannedGrades            = common.BannedGrades
)

// BiowareRequired represents requirements for bioware
// Note: common.Requirement exists with unified structure - future migration could use it
type BiowareRequired struct {
	OneOf *BiowareRequiredOneOf `json:"oneof,omitempty"`
	AllOf *BiowareRequiredAllOf `json:"allof,omitempty"`
}

// BiowareRequiredOneOf represents a one-of requirement
// Note: common.RequirementOneOf exists with similar structure
type BiowareRequiredOneOf struct {
	Cyberware string      `json:"cyberware,omitempty"` // Required cyberware
	Bioware   interface{} `json:"bioware,omitempty"`   // Can be string or []string
	Metatype  string      `json:"metatype,omitempty"`  // Required metatype
	Quality   string      `json:"quality,omitempty"`   // Required quality
}

// BiowareRequiredAllOf represents an all-of requirement
// Note: common.RequirementAllOf exists with similar structure
type BiowareRequiredAllOf struct {
	Metatype string `json:"metatype,omitempty"` // Required metatype
}

// Additional type aliases
type (
	AllowGear       = common.AllowGear
	AllowSubsystems = common.AllowSubsystems
	PairBonus       = common.PairBonus
	WalkMultiplier  = common.WalkMultiplier
	ReachBonus      = common.ReachBonus
	PairInclude     = common.PairInclude
)
