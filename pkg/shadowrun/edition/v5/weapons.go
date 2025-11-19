package v5

// WeaponCategory represents a weapon category with its type and black market classification
type WeaponCategory struct {
	Name        string `json:"name"`                   // Category name like "Blades", "Assault Rifles", etc.
	Type        string `json:"type"`                   // Weapon type like "melee", "gun", "bow", etc.
	BlackMarket string `json:"black_market"`           // Black market classification
	GunnerySpec string `json:"gunnery_spec,omitempty"` // Gunnery specialization like "Ballistic", "Energy", etc.
}

// WeaponAccessory represents a weapon accessory
type WeaponAccessory struct {
	Name     interface{}     `json:"name"`               // Accessory name (can be string or []string)
	Mount    string          `json:"mount,omitempty"`    // Mount location like "Barrel", "Stock", etc.
	Avail    string          `json:"avail,omitempty"`    // Availability
	Cost     string          `json:"cost,omitempty"`     // Cost
	Source   string          `json:"source,omitempty"`   // Source book
	Page     string          `json:"page,omitempty"`     // Page number
	Rating   string          `json:"rating,omitempty"`   // Rating (can be "0" or other values)
	Required *WeaponRequired `json:"required,omitempty"` // Requirements
}

// WeaponRequired represents requirements for a weapon or accessory
// Note: common.Requirement exists with unified structure including WeaponDetails - future migration could use it
type WeaponRequired struct {
	WeaponDetails interface{} `json:"weapondetails,omitempty"` // Complex weapon details requirement (can use common.WeaponDetails)
}

// WeaponAccessories represents a collection of accessories
type WeaponAccessories struct {
	Accessory interface{} `json:"accessory,omitempty"` // Can be single WeaponAccessory or []WeaponAccessory
}

// WeaponAccessoryMounts represents available accessory mounts
type WeaponAccessoryMounts struct {
	Mount interface{} `json:"mount,omitempty"` // Can be single string or []string
}

// Weapon represents a weapon from Shadowrun 5th Edition
type Weapon struct {
	// Required fields
	Name     string `json:"name"`     // Weapon name
	Category string `json:"category"` // Category like "Blades", "Assault Rifles", etc.
	Type     string `json:"type"`     // "Melee" or "Ranged"
	Source   string `json:"source"`   // Source book like "SR5", "RG", etc.

	// Weapon stats
	Conceal  string `json:"conceal,omitempty"`  // Concealability like "0", "10", etc.
	Accuracy string `json:"accuracy,omitempty"` // Accuracy like "5", "7", etc.
	Reach    string `json:"reach,omitempty"`    // Reach (for melee) like "0", "1", etc.
	Damage   string `json:"damage,omitempty"`   // Damage like "6P", "10S", "({STR}+2)P", etc.
	AP       string `json:"ap,omitempty"`       // Armor penetration like "-1", "-2", etc.
	Mode     string `json:"mode,omitempty"`     // Firing mode like "SA", "BF", "FA", "SS", etc.
	RC       string `json:"rc,omitempty"`       // Recoil compensation like "0", "1", etc.
	Ammo     string `json:"ammo,omitempty"`     // Ammunition like "10(c)", "6(m)", etc.
	Range    string `json:"range,omitempty"`    // Range like "50/150/350", etc.

	// Optional fields
	Avail                     string                 `json:"avail,omitempty"`                      // Availability like "2", "10R", etc.
	Cost                      string                 `json:"cost,omitempty"`                       // Cost like "500", "Variable(20-100000)", etc.
	Page                      string                 `json:"page,omitempty"`                       // Page number in source book
	Accessories               *WeaponAccessories     `json:"accessories,omitempty"`                // Pre-installed accessories
	AccessoryMounts           *WeaponAccessoryMounts `json:"accessorymounts,omitempty"`            // Available accessory mounts
	AddWeapon                 interface{}            `json:"addweapon,omitempty"`                  // Additional weapon (can be string or []string)
	AllowAccessory            string                 `json:"allowaccessory,omitempty"`             // Allowed accessories
	AllowGear                 interface{}            `json:"allowgear,omitempty"`                  // Allowed gear
	AlternateRange            string                 `json:"alternaterange,omitempty"`             // Alternate range
	AmmoCategory              string                 `json:"ammocategory,omitempty"`               // Ammo category
	AmmoSlots                 string                 `json:"ammoslots,omitempty"`                  // Ammo slots
	Cyberware                 string                 `json:"cyberware,omitempty"`                  // Cyberware flag
	DoubleCostAccessoryMounts *bool                  `json:"doubledcostaccessorymounts,omitempty"` // Double cost for accessory mounts
	ExtraMount                string                 `json:"extramount,omitempty"`                 // Extra mount
	Hide                      *bool                  `json:"hide,omitempty"`                       // Whether to hide this weapon
	MaxRating                 string                 `json:"maxrating,omitempty"`                  // Maximum rating
	Mount                     string                 `json:"mount,omitempty"`                      // Mount location
	RequireAmmo               string                 `json:"requireammo,omitempty"`                // Require ammo flag
	Required                  *WeaponRequired        `json:"required,omitempty"`                   // Requirements
	ShortBurst                string                 `json:"shortburst,omitempty"`                 // Short burst mode
	SingleShot                string                 `json:"singleshot,omitempty"`                 // Single shot mode
	SizeCategory              string                 `json:"sizecategory,omitempty"`               // Size category
	Spec                      string                 `json:"spec,omitempty"`                       // Specialization
	Spec2                     string                 `json:"spec2,omitempty"`                      // Second specialization
	Underbarrels              interface{}            `json:"underbarrels,omitempty"`               // Underbarrel weapons
	UseSkill                  string                 `json:"useskill,omitempty"`                   // Skill to use like "Blades", "Pistols", etc.
	UseSkillSpec              string                 `json:"useskillspec,omitempty"`               // Skill specialization
	WeaponType                string                 `json:"weapontype,omitempty"`                 // Weapon type
}
