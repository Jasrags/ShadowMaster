package v5

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
	Bonus           *BiowareBonus    `json:"bonus,omitempty"`           // Bonuses provided by this bioware
	Forbidden       *Forbidden       `json:"forbidden,omitempty"`       // Forbidden items/qualities
	BannedGrades    *BannedGrades    `json:"bannedgrades,omitempty"`    // Banned grades for this bioware
	Required        *BiowareRequired `json:"required,omitempty"`        // Requirements for this bioware
	AllowGear       *AllowGear       `json:"allowgear,omitempty"`       // Allowed gear categories
	AllowSubsystems *AllowSubsystems `json:"allowsubsystems,omitempty"` // Allowed subsystem categories
	AddWeapon       string           `json:"addweapon,omitempty"`       // Weapon added by this bioware
	AddToParentEss  *bool            `json:"addtoparentess,omitempty"`  // Whether to add to parent essence
	RequireParent   *bool            `json:"requireparent,omitempty"`   // Whether a parent is required
	SelectSide      *bool            `json:"selectside,omitempty"`      // Whether to select side (left/right)
	BlocksMounts    string           `json:"blocksmounts,omitempty"`    // Mounts blocked by this bioware
	PairBonus       *PairBonus       `json:"pairbonus,omitempty"`       // Bonus when paired with matching item
	PairInclude     *PairInclude     `json:"pairinclude,omitempty"`     // Item that pairs with this
	Notes           string           `json:"notes,omitempty"`           // Notes about this bioware
	ForceGrade      string           `json:"forcegrade,omitempty"`      // Force a specific grade (like "None")
	IsGeneware      *bool            `json:"isgeneware,omitempty"`      // Whether this is geneware
}

// BiowareBonus represents bonuses provided by bioware
// This is a very flexible structure with many possible bonus types
type BiowareBonus struct {
	// Limit modifiers
	LimitModifier interface{} `json:"limitmodifier,omitempty"` // Can be LimitModifier or []LimitModifier

	// Skill bonuses
	SkillCategory        interface{}                `json:"skillcategory,omitempty"`        // Can be SkillCategoryBonus or []SkillCategoryBonus
	SpecificSkill        interface{}                `json:"specificskill,omitempty"`        // Can be SpecificSkillBonus or []SpecificSkillBonus
	SkillGroup           interface{}                `json:"skillgroup,omitempty"`           // Can be SkillGroupBonus or []SkillGroupBonus
	SelectSkill          *SelectSkill               `json:"selectskill,omitempty"`          // Selectable skill bonus
	SkillAttribute       *SkillAttributeBonus       `json:"skillattribute,omitempty"`       // Skill attribute bonus
	SkillLinkedAttribute *SkillLinkedAttributeBonus `json:"skilllinkedattribute,omitempty"` // Skill linked attribute bonus

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

// SpecificAttributeBonus represents a specific attribute bonus
type SpecificAttributeBonus struct {
	Name string `json:"name"`          // Attribute name like "STR", "AGI", "LOG", etc.
	Val  string `json:"val"`           // Value like "Rating", "1", etc.
	Max  string `json:"max,omitempty"` // Maximum value (for max attribute bonuses)
}

// BiowareSkillCategoryBonus represents a skill category bonus for bioware
// Note: Bonus can be a string like "Rating" or an integer
type BiowareSkillCategoryBonus struct {
	Name  string `json:"name"`  // Skill category name like "Academic", "Interest", etc.
	Bonus string `json:"bonus"` // Bonus value like "Rating", "1", etc. (can be string or numeric)
}

// SkillGroupBonus represents a skill group bonus
type SkillGroupBonus struct {
	Name      string `json:"name"`                // Skill group name like "Athletics", "Acting", etc.
	Bonus     string `json:"bonus"`               // Bonus value like "Rating", "1", etc.
	Condition string `json:"condition,omitempty"` // Condition like "People who can smell you"
}

// SelectSkill represents a selectable skill bonus
type SelectSkill struct {
	Val              string `json:"val,omitempty"`                // Bonus value
	Max              string `json:"max,omitempty"`                // Maximum value
	LimitToAttribute string `json:"+@limittoattribute,omitempty"` // Limit to attributes
	MaximumRating    string `json:"+@maximumrating,omitempty"`    // Maximum rating
	KnowledgeSkills  string `json:"+@knowledgeskills,omitempty"`  // Whether knowledge skills
	ApplyToRating    string `json:"applytorating,omitempty"`      // Whether to apply to rating
	ExcludeAttribute string `json:"excludeattribute,omitempty"`   // Exclude attribute
}

// SkillAttributeBonus represents a skill attribute bonus
type SkillAttributeBonus struct {
	Name      string `json:"name"`                // Attribute name
	Bonus     string `json:"bonus"`               // Bonus value
	Condition string `json:"condition,omitempty"` // Condition for the bonus
}

// SkillLinkedAttributeBonus represents a skill linked attribute bonus
type SkillLinkedAttributeBonus struct {
	Name  string `json:"name"`  // Attribute name
	Bonus string `json:"bonus"` // Bonus value
}

// AttributeKarmaCostBonus represents an attribute karma cost modifier
type AttributeKarmaCostBonus struct {
	Name string `json:"name"` // Attribute name
	Val  string `json:"val"`  // Karma cost modifier
}

// ConditionMonitorBonus represents a condition monitor bonus
type ConditionMonitorBonus struct {
	SharedThresholdOffset string `json:"sharedthresholdoffset,omitempty"` // Shared threshold offset
	ThresholdOffset       string `json:"thresholdoffset,omitempty"`       // Threshold offset
}

// InitiativeBonus represents an initiative bonus
type InitiativeBonus struct {
	Content    string `json:"+content,omitempty"`     // Bonus value
	Precedence string `json:"+@precedence,omitempty"` // Precedence
}

// InitiativePassBonus represents an initiative pass bonus
type InitiativePassBonus struct {
	Content    string `json:"+content,omitempty"`     // Bonus value
	Precedence string `json:"+@precedence,omitempty"` // Precedence
}

// ArmorBonus represents an armor bonus
type ArmorBonus struct {
	Content string `json:"+content,omitempty"` // Armor value
	Group   string `json:"+@group,omitempty"`  // Group
}

// WeaponAccuracyBonus represents a weapon accuracy bonus
type WeaponAccuracyBonus struct {
	Name  string `json:"name"`  // Weapon name pattern
	Value string `json:"value"` // Accuracy bonus value
}

// AddQualities represents qualities to add
type AddQualities struct {
	AddQuality string `json:"addquality,omitempty"` // Quality to add
}

// SelectTextBonus represents a selectable text bonus
type SelectTextBonus struct {
	XML       string `json:"+@xml,omitempty"`       // XML file reference
	XPath     string `json:"+@xpath,omitempty"`     // XPath expression
	AllowEdit string `json:"+@allowedit,omitempty"` // Whether editing is allowed
}

// Forbidden represents forbidden items or qualities
type Forbidden struct {
	OneOf *ForbiddenOneOf `json:"oneof,omitempty"`
}

// ForbiddenOneOf represents a one-of forbidden constraint
type ForbiddenOneOf struct {
	Cyberware interface{} `json:"cyberware,omitempty"` // Can be string or []string
	Bioware   interface{} `json:"bioware,omitempty"`   // Can be string or []string
	Quality   string      `json:"quality,omitempty"`   // Quality name
}

// BannedGrades represents banned grades for bioware
type BannedGrades struct {
	Grade []string `json:"grade"` // List of banned grade names
}

// BiowareRequired represents requirements for bioware
type BiowareRequired struct {
	OneOf *BiowareRequiredOneOf `json:"oneof,omitempty"`
	AllOf *BiowareRequiredAllOf `json:"allof,omitempty"`
}

// BiowareRequiredOneOf represents a one-of requirement
type BiowareRequiredOneOf struct {
	Cyberware string      `json:"cyberware,omitempty"` // Required cyberware
	Bioware   interface{} `json:"bioware,omitempty"`   // Can be string or []string
	Metatype  string      `json:"metatype,omitempty"`  // Required metatype
	Quality   string      `json:"quality,omitempty"`   // Required quality
}

// BiowareRequiredAllOf represents an all-of requirement
type BiowareRequiredAllOf struct {
	Metatype string `json:"metatype,omitempty"` // Required metatype
}

// AllowGear represents allowed gear categories
type AllowGear struct {
	GearCategory []string `json:"gearcategory"` // List of allowed gear categories
}

// AllowSubsystems represents allowed subsystem categories
type AllowSubsystems struct {
	Category string `json:"category"` // Allowed subsystem category
}

// PairBonus represents a bonus when paired with matching item
type PairBonus struct {
	UnarmedDV      string          `json:"unarmeddv,omitempty"`      // Unarmed damage value
	UnarmedReach   string          `json:"unarmedreach,omitempty"`   // Unarmed reach
	WalkMultiplier *WalkMultiplier `json:"walkmultiplier,omitempty"` // Walk multiplier
	Reach          *ReachBonus     `json:"reach,omitempty"`          // Reach bonus
}

// WalkMultiplier represents a walk multiplier bonus
type WalkMultiplier struct {
	Val      string `json:"val"`      // Multiplier value
	Category string `json:"category"` // Category like "Swim"
}

// ReachBonus represents a reach bonus
type ReachBonus struct {
	Content string `json:"+content,omitempty"` // Reach value
	Name    string `json:"+@name,omitempty"`   // Weapon name
}

// PairInclude represents an item that pairs with this bioware
type PairInclude struct {
	Name string `json:"name"` // Name of the paired item
}
