package v5

// PackGear represents a gear item in a pack (can have nested gears)
type PackGear struct {
	Name     interface{} `json:"name"`               // Gear name (can be string or complex object with +content and +@select)
	Category string      `json:"category,omitempty"` // Category
	Rating   string      `json:"rating,omitempty"`   // Rating
	Qty      string      `json:"qty,omitempty"`      // Quantity
	Gears    *PackGears  `json:"gears,omitempty"`    // Nested gears
}

// PackGears represents a collection of gears in a pack
type PackGears struct {
	Gear interface{} `json:"gear,omitempty"` // Can be single PackGear or []PackGear
}

// PackArmor represents an armor item in a pack
type PackArmor struct {
	Name string `json:"name"` // Armor name
}

// PackArmors represents a collection of armors in a pack
type PackArmors struct {
	Armor interface{} `json:"armor,omitempty"` // Can be single PackArmor or []PackArmor
}

// PackWeaponAccessory represents a weapon accessory in a pack
type PackWeaponAccessory struct {
	Name  string  `json:"name"`            // Accessory name
	Mount *string `json:"mount,omitempty"` // Mount location
}

// PackWeaponAccessories represents a collection of weapon accessories
type PackWeaponAccessories struct {
	Accessory interface{} `json:"accessory,omitempty"` // Can be single PackWeaponAccessory or []PackWeaponAccessory
}

// PackWeapon represents a weapon item in a pack
type PackWeapon struct {
	Name        string                 `json:"name"`                  // Weapon name
	Accessories *PackWeaponAccessories `json:"accessories,omitempty"` // Accessories
}

// PackWeapons represents a collection of weapons in a pack
type PackWeapons struct {
	Weapon interface{} `json:"weapon,omitempty"` // Can be single PackWeapon or []PackWeapon
}

// Pack represents a pack from Shadowrun 5th Edition
type Pack struct {
	// Required fields
	Name     string `json:"name"`     // Pack name
	Category string `json:"category"` // Category
	NuyenBP  string `json:"nuyenbp"`  // Nuyen build points cost

	// Optional fields
	Armors  *PackArmors  `json:"armors,omitempty"`  // Armors included in the pack
	Gears   *PackGears   `json:"gears,omitempty"`   // Gears included in the pack
	Weapons *PackWeapons `json:"weapons,omitempty"` // Weapons included in the pack
}
