package common

// SelectSkill represents a selectable skill bonus
type SelectSkill struct {
	Val              string `json:"val,omitempty"`                // Bonus value
	Max              string `json:"max,omitempty"`                // Maximum value
	SkillCategory    string `json:"+@skillcategory,omitempty"`    // Skill category (used in critter powers)
	LimitToAttribute string `json:"+@limittoattribute,omitempty"` // Limit to attributes
	MaximumRating    string `json:"+@maximumrating,omitempty"`    // Maximum rating
	KnowledgeSkills  string `json:"+@knowledgeskills,omitempty"`  // Whether knowledge skills
	ApplyToRating    string `json:"applytorating,omitempty"`      // Whether to apply to rating
	ExcludeAttribute string `json:"excludeattribute,omitempty"`   // Exclude attribute
}

// SelectAttribute represents a selectable attribute bonus
type SelectAttribute struct {
	Val string `json:"val,omitempty"` // Bonus value
	Max string `json:"max,omitempty"` // Maximum value
}

// SelectTextBonus represents a selectable text bonus
type SelectTextBonus struct {
	XML       string `json:"+@xml,omitempty"`       // XML file reference
	XPath     string `json:"+@xpath,omitempty"`     // XPath expression
	AllowEdit string `json:"+@allowedit,omitempty"` // Whether editing is allowed
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

// SkillGroupBonus represents a skill group bonus
type SkillGroupBonus struct {
	Name      string `json:"name"`                // Skill group name like "Athletics", "Acting", etc.
	Bonus     string `json:"bonus"`               // Bonus value like "Rating", "1", etc.
	Condition string `json:"condition,omitempty"` // Condition like "People who can smell you"
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

// SpecificAttributeBonus represents a specific attribute bonus
type SpecificAttributeBonus struct {
	Name string `json:"name"`          // Attribute name like "STR", "AGI", "LOG", etc.
	Val  string `json:"val"`           // Value like "Rating", "1", etc.
	Max  string `json:"max,omitempty"` // Maximum value (for max attribute bonuses)
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

// LimitModifier represents a limit modifier bonus
type LimitModifier struct {
	Limit     string `json:"limit"`     // "Physical", "Social", "Mental", etc.
	Value     string `json:"value"`     // Modifier value like "2", "-1", "Rating", etc.
	Condition string `json:"condition"` // Condition like "LimitCondition_Visible", etc.
}

// AddQualities represents qualities to add
type AddQualities struct {
	AddQuality string `json:"addquality,omitempty"` // Quality to add
}

// BannedGrades represents banned grades for bioware/cyberware
type BannedGrades struct {
	Grade []string `json:"grade"` // List of banned grade names
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

// PairInclude represents an item that pairs with another item
type PairInclude struct {
	Name string `json:"name"` // Name of the paired item
}

// AllowGear represents allowed gear categories
type AllowGear struct {
	GearCategory []string `json:"gearcategory"` // List of allowed gear categories
}

// AllowSubsystems represents allowed subsystem categories
type AllowSubsystems struct {
	Category string `json:"category"` // Allowed subsystem category
}

