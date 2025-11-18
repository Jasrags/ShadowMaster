package v5

// Category represents an armor or mod category with its black market classification
type Category struct {
	Name        string `json:"name"`         // Category name
	BlackMarket string `json:"black_market"` // Black market classification
}

// Armor represents a piece of armor from Shadowrun 5th Edition
type Armor struct {
	// Required fields
	Name          string `json:"name"`
	Category      string `json:"category"`
	Armor         string `json:"armor"`         // Can be "12", "+2", "0", "Rating", etc.
	ArmorCapacity string `json:"armorcapacity"` // Can be "12", "0", "Rating", "FixedValues(...)", etc.
	Avail         string `json:"avail"`         // Availability like "2", "10R", "14R", "+2", etc.
	Cost          string `json:"cost"`          // Cost like "1500", "Variable(20-100000)", "100 * Rating", etc.
	Source        string `json:"source"`        // Source book like "SR5", "RG", etc.

	// Optional fields
	ArmorOverride          string              `json:"armoroverride,omitempty"`          // Override armor value like "+3"
	Rating                 int                 `json:"rating,omitempty"`                 // Rating for variable rating items (always numeric)
	AddModCategory         string              `json:"addmodcategory,omitempty"`         // Category of mods that can be added
	SelectModsFromCategory *SelectModsCategory `json:"selectmodsfromcategory,omitempty"` // Category to select mods from
	Gears                  *Gears              `json:"gears,omitempty"`                  // Gears that can be used with this armor
	AddWeapon              string              `json:"addweapon,omitempty"`              // Weapon added by this armor
	Bonus                  *Bonus              `json:"bonus,omitempty"`                  // Bonuses provided by this armor
	WirelessBonus          *Bonus              `json:"wirelessbonus,omitempty"`          // Bonuses when wireless is enabled
	Mods                   *Mods               `json:"mods,omitempty"`                   // Pre-installed mods
}

// ArmorMod represents an armor modification from Shadowrun 5th Edition
type ArmorMod struct {
	// Required fields
	Name          string `json:"name"`
	Category      string `json:"category"`
	Armor         string `json:"armor"`         // Can be "0", "+2", "+3", etc.
	MaxRating     int    `json:"maxrating"`     // Maximum rating (always numeric: 0, 1, 6, etc.)
	ArmorCapacity string `json:"armorcapacity"` // Capacity cost like "[0]", "[2]", "FixedValues([1],[2],[3],[4],[5],[6])", etc.
	Avail         string `json:"avail"`         // Availability like "0", "+2", "6", "10R", etc.
	Cost          string `json:"cost"`          // Cost like "0", "500", "Rating * 250", etc.
	Source        string `json:"source"`        // Source book like "SR5", "RG", etc.

	// Optional fields
	GearCapacity  *int      `json:"gearcapacity,omitempty"`  // Gear capacity (always numeric when present)
	Hide          *bool     `json:"hide,omitempty"`          // Whether to hide this mod
	Required      *Required `json:"required,omitempty"`      // Requirements for this mod
	AddonCategory []string  `json:"addoncategory,omitempty"` // Categories of addons that can be added
	Bonus         *Bonus    `json:"bonus,omitempty"`         // Bonuses provided by this mod
	WirelessBonus *Bonus    `json:"wirelessbonus,omitempty"` // Bonuses when wireless is enabled
}

// SelectModsCategory represents a category to select mods from
type SelectModsCategory struct {
	Category string `json:"category"`
}

// Gears represents gears that can be used with armor
type Gears struct {
	UseGear interface{} `json:"usegear"` // Can be string or []string
}

// Mods represents pre-installed mods on armor
type Mods struct {
	Name interface{} `json:"name"` // Can be string, []string, or []ModNameEntry
}

// ModNameEntry represents a mod name entry that can have additional attributes
type ModNameEntry struct {
	Content string `json:"+content,omitempty"`
	Rating  string `json:"+@rating,omitempty"` // Can be numeric string or formula
}

// Required represents requirements for an armor mod
type Required struct {
	ParentDetails *ParentDetails `json:"parentdetails,omitempty"`
	OneOf         *OneOf         `json:"oneof,omitempty"`
}

// ParentDetails represents parent armor details requirement
type ParentDetails struct {
	Name string `json:"name"`
}

// OneOf represents a one-of requirement
type OneOf struct {
	ArmorMod *ArmorModRef `json:"armormod,omitempty"`
}

// ArmorModRef represents a reference to an armor mod
type ArmorModRef struct {
	Content    string `json:"+content,omitempty"`
	SameParent string `json:"+@sameparent,omitempty"`
}

// Bonus represents bonuses provided by armor or mods
// This is a flexible structure that can contain various bonus types
type Bonus struct {
	// Limit modifiers
	LimitModifier interface{} `json:"limitmodifier,omitempty"` // Can be LimitModifier or []LimitModifier

	// Skill bonuses
	SkillCategory interface{} `json:"skillcategory,omitempty"` // Can be SkillCategoryBonus or []SkillCategoryBonus
	SpecificSkill interface{} `json:"specificskill,omitempty"` // Can be SpecificSkillBonus or []SpecificSkillBonus

	// Social limit
	SocialLimit string `json:"sociallimit,omitempty"` // Can be numeric string or formula

	// Resistance/immunity bonuses
	ToxinContactResist       string `json:"toxincontactresist,omitempty"` // Can be numeric string or "Rating"
	ToxinContactImmune       *bool  `json:"toxincontactimmune,omitempty"`
	ToxinInhalationImmune    *bool  `json:"toxininhalationimmune,omitempty"`
	PathogenContactResist    string `json:"pathogencontactresist,omitempty"` // Can be numeric string or "Rating"
	PathogenContactImmune    *bool  `json:"pathogencontactimmune,omitempty"`
	PathogenInhalationImmune *bool  `json:"pathogeninhalationimmune,omitempty"`

	// Armor bonuses
	FireArmor        string `json:"firearmor,omitempty"`        // Can be numeric string or "Rating"
	ColdArmor        string `json:"coldarmor,omitempty"`        // Can be numeric string or "Rating"
	ElectricityArmor string `json:"electricityarmor,omitempty"` // Can be numeric string or "Rating"

	// Radiation resistance
	RadiationResist string `json:"radiationresist,omitempty"` // Can be numeric string or "Rating"

	// Fatigue resistance
	FatigueResist string `json:"fatigueresist,omitempty"` // Can be numeric string or formula

	// Select armor
	SelectArmor *bool `json:"selectarmor,omitempty"`

	// Unique identifier
	Unique string `json:"+@unique,omitempty"`

	// Select text
	SelectText *bool `json:"selecttext,omitempty"`
}

// LimitModifier represents a limit modifier bonus
type LimitModifier struct {
	Limit     string `json:"limit"`     // "Physical", "Social", "Mental", etc.
	Value     string `json:"value"`     // Modifier value like "2", "-1", "Rating", etc.
	Condition string `json:"condition"` // Condition like "LimitCondition_Visible", etc.
}

// SkillCategoryBonus represents a skill category bonus
type SkillCategoryBonus struct {
	Name  string `json:"name"`  // Skill category name like "Social Active"
	Bonus int    `json:"bonus"` // Bonus value (always numeric)
}

// SpecificSkillBonus represents a specific skill bonus
type SpecificSkillBonus struct {
	Name  string `json:"name"`  // Skill name like "Survival", "Etiquette"
	Bonus int    `json:"bonus"` // Bonus value (always numeric)
}
