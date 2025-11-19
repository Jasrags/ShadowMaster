package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// GearCategory represents a gear category with its black market classification
type GearCategory struct {
	Name        string `json:"name"`         // Category name
	BlackMarket string `json:"black_market"` // Black market classification
}

// GearBonus represents bonuses provided by gear
// This embeds BaseBonus which contains all common bonus fields
// Gear-specific fields are added here
type GearBonus struct {
	common.BaseBonus

	// Gear-specific bonus fields
	SelectTradition          interface{}             `json:"selecttradition,omitempty"`          // Selectable tradition bonus (can be complex)
	SelectText               *common.SelectTextBonus `json:"selecttext,omitempty"`               // Selectable text bonus
	SelectWeapon             interface{}             `json:"selectweapon,omitempty"`             // Selectable weapon bonus (can be complex)
	SelectPowers             interface{}             `json:"selectpowers,omitempty"`             // Selectable powers bonus (can be complex)
	SelectRestricted         interface{}             `json:"selectrestricted,omitempty"`         // Selectable restricted item bonus (can be complex)
	SpellCategory            interface{}             `json:"spellcategory,omitempty"`            // Spell category bonus (can be complex)
	SmartLink                interface{}             `json:"smartlink,omitempty"`                // Smartlink bonus (can be complex)
	WeaponSpecificDice       interface{}             `json:"weaponspecificdice,omitempty"`       // Weapon-specific dice bonus (can be complex)
	MatrixInitiativeDice     string                  `json:"matrixinitiativedice,omitempty"`     // Matrix initiative dice bonus
	EssencePenaltyT100       string                  `json:"essencepenaltyt100,omitempty"`       // Essence penalty to 100%
	SkillSoft                interface{}             `json:"skillsoft,omitempty"`                // Skillsoft bonus (can be complex)
	ActiveSoft               interface{}             `json:"activesoft,omitempty"`               // Active soft bonus (can be complex)
	ToxinContactImmune       string                  `json:"toxincontactimmune,omitempty"`       // Toxin contact immunity
	ToxinInhalationImmune    string                  `json:"toxininhalationimmune,omitempty"`    // Toxin inhalation immunity
	PathogenContactImmune    string                  `json:"pathogencontactimmune,omitempty"`    // Pathogen contact immunity
	PathogenInhalationImmune string                  `json:"pathogeninhalationimmune,omitempty"` // Pathogen inhalation immunity
	Unique                   string                  `json:"+@unique,omitempty"`                 // Unique identifier
}

// GearRequired represents requirements for gear
type GearRequired struct {
	OneOf       *common.RequirementOneOf `json:"oneof,omitempty"`         // One-of requirement
	AllOf       *common.RequirementAllOf `json:"allof,omitempty"`         // All-of requirement
	Parent      *common.ParentDetails    `json:"parentdetails,omitempty"` // Parent details requirement
	GearDetails interface{}              `json:"geardetails,omitempty"`   // Gear details requirement (can be complex)
}

// Gear represents a piece of gear from Shadowrun 5th Edition
type Gear struct {
	// Required fields
	Name     string `json:"name"`     // Gear name
	Category string `json:"category"` // Category
	Source   string `json:"source"`   // Source book

	// Optional fields
	Page                 string        `json:"page,omitempty"`                 // Page number
	Rating               string        `json:"rating,omitempty"`               // Rating (can be "0", "Rating", etc.)
	Avail                string        `json:"avail,omitempty"`                // Availability
	Cost                 string        `json:"cost,omitempty"`                 // Cost
	CostFor              string        `json:"costfor,omitempty"`              // Cost for (quantity)
	AddWeapon            string        `json:"addweapon,omitempty"`            // Weapon added by this gear
	AmmoForWeaponType    string        `json:"ammoforweapontype,omitempty"`    // Ammo for weapon type
	IsFlechetteAmmo      *bool         `json:"isflechetteammo,omitempty"`      // Is flechette ammo
	FlechetteWeaponBonus string        `json:"flechetteweaponbonus,omitempty"` // Flechette weapon bonus
	WeaponBonus          string        `json:"weaponbonus,omitempty"`          // Weapon bonus
	AddonCategory        interface{}   `json:"addoncategory,omitempty"`        // Addon category (can be string or []string)
	Required             *GearRequired `json:"required,omitempty"`             // Requirements
	RequireParent        *bool         `json:"requireparent,omitempty"`        // Require parent
	Bonus                *GearBonus    `json:"bonus,omitempty"`                // Bonuses
}
