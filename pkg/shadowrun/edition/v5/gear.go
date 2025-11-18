package v5

// GearCategory represents a gear category with its black market classification
type GearCategory struct {
	Name        string `json:"name"`         // Category name
	BlackMarket string `json:"black_market"` // Black market classification
}

// Gear represents a piece of gear from Shadowrun 5th Edition
type Gear struct {
	// Required fields
	Name     string `json:"name"`     // Gear name
	Category string `json:"category"` // Category
	Source   string `json:"source"`   // Source book

	// Optional fields
	Page                 string      `json:"page,omitempty"`                 // Page number
	Rating               string      `json:"rating,omitempty"`               // Rating (can be "0", "Rating", etc.)
	Avail                string      `json:"avail,omitempty"`                // Availability
	Cost                 string      `json:"cost,omitempty"`                 // Cost
	CostFor              string      `json:"costfor,omitempty"`              // Cost for (quantity)
	AddWeapon            string      `json:"addweapon,omitempty"`            // Weapon added by this gear
	AmmoForWeaponType    string      `json:"ammoforweapontype,omitempty"`    // Ammo for weapon type
	IsFlechetteAmmo      *bool       `json:"isflechetteammo,omitempty"`      // Is flechette ammo
	FlechetteWeaponBonus string      `json:"flechetteweaponbonus,omitempty"` // Flechette weapon bonus
	WeaponBonus          string      `json:"weaponbonus,omitempty"`          // Weapon bonus
	AddonCategory        interface{} `json:"addoncategory,omitempty"`        // Addon category (can be string or []string)
	Required             interface{} `json:"required,omitempty"`             // Requirements (can be complex)
	RequireParent        *bool       `json:"requireparent,omitempty"`        // Require parent
	Bonus                interface{} `json:"bonus,omitempty"`                // Bonuses (can be complex)
}
