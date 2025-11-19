package common

// BaseBonus contains all common bonus fields that are shared across different bonus types
// This can be embedded in specific bonus structures like BiowareBonus, CyberwareBonus, etc.
type BaseBonus struct {
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

