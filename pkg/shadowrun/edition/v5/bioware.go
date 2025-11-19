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
// This embeds BaseBonus which contains all common bonus fields
// Bioware-specific fields can be added here if needed in the future
type BiowareBonus struct {
	common.BaseBonus
	// Bioware-specific bonus fields can be added here
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
