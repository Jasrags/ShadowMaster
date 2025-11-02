package v3

// Equipment represents a piece of equipment
type Equipment struct {
	Name string                 `json:"name"`
	Type string                 `json:"type"`
	Data map[string]interface{} `json:"data,omitempty"` // Additional properties
}

// Weapon represents a weapon in the database
type Weapon struct {
	Name           string `json:"name"`
	Type           string `json:"type"`   // Firearm, Melee, etc.
	Damage         string `json:"damage"` // Damage code (e.g., "8M")
	Accuracy       int    `json:"accuracy"`
	Concealability int    `json:"concealability"`
	Mode           string `json:"mode,omitempty"` // SS, SA, BF, FA
	Range          string `json:"range,omitempty"`
}

// Armor represents armor in the database
type Armor struct {
	Name   string `json:"name"`
	Type   string `json:"type"`   // Clothing, Armor Jacket, etc.
	Rating int    `json:"rating"` // Armor rating
}

// Cyberware represents cyberware in the database
type Cyberware struct {
	Name         string  `json:"name"`
	Rating       int     `json:"rating,omitempty"`
	EssenceCost  float64 `json:"essence_cost"`
	Availability int     `json:"availability,omitempty"`
}

// WeaponsDatabase contains official Shadowrun 3e weapons
var WeaponsDatabase = []Weapon{
	// Pistols
	{Name: "Ares Predator", Type: "Firearm", Damage: "8M", Accuracy: 6, Concealability: 2, Mode: "SA/BF", Range: "50m"},
	{Name: "Colt America L36", Type: "Firearm", Damage: "6M", Accuracy: 5, Concealability: 3, Mode: "SA", Range: "25m"},
	{Name: "Ruger Super Warhawk", Type: "Firearm", Damage: "9M", Accuracy: 5, Concealability: 1, Mode: "SS", Range: "50m"},
	{Name: "Ceska Black Scorpion", Type: "Firearm", Damage: "7M", Accuracy: 4, Concealability: 3, Mode: "SA/BF", Range: "50m"},
	{Name: "Ingram Smartgun", Type: "Firearm", Damage: "6M", Accuracy: 6, Concealability: 3, Mode: "SA/BF", Range: "25m"},

	// Submachine Guns
	{Name: "Ingram Valiant", Type: "Firearm", Damage: "6M", Accuracy: 4, Concealability: 4, Mode: "SA/BF/FA", Range: "50m"},
	{Name: "Uzi IV", Type: "Firearm", Damage: "6M", Accuracy: 4, Concealability: 4, Mode: "SA/BF/FA", Range: "50m"},

	// Assault Rifles
	{Name: "Ares Alpha", Type: "Firearm", Damage: "9M", Accuracy: 7, Concealability: -2, Mode: "SA/BF/FA", Range: "500m"},
	{Name: "AK-97", Type: "Firearm", Damage: "9M", Accuracy: 5, Concealability: -2, Mode: "SA/BF/FA", Range: "400m"},
	{Name: "FN HAR", Type: "Firearm", Damage: "11M", Accuracy: 6, Concealability: -3, Mode: "SA/BF", Range: "600m"},

	// Sniper Rifles
	{Name: "Remington 950", Type: "Firearm", Damage: "12M", Accuracy: 7, Concealability: -3, Mode: "SS", Range: "800m"},

	// Melee Weapons
	{Name: "Katana", Type: "Melee", Damage: "8M", Accuracy: 6, Concealability: -2, Range: "Reach"},
	{Name: "Knife", Type: "Melee", Damage: "4M", Accuracy: 4, Concealability: 5, Range: "Reach"},
	{Name: "Sword", Type: "Melee", Damage: "7M", Accuracy: 5, Concealability: -1, Range: "Reach"},
	{Name: "Combat Axe", Type: "Melee", Damage: "9M", Accuracy: 4, Concealability: -2, Range: "Reach"},
	{Name: "Club", Type: "Melee", Damage: "6M", Accuracy: 4, Concealability: 4, Range: "Reach"},
	{Name: "Stun Baton", Type: "Melee", Damage: "6S", Accuracy: 5, Concealability: 3, Range: "Reach"},

	// Throwing Weapons
	{Name: "Throwing Knife", Type: "Throwing", Damage: "4M", Accuracy: 5, Concealability: 4, Range: "10m"},
	{Name: "Shuriken", Type: "Throwing", Damage: "3M", Accuracy: 4, Concealability: 5, Range: "5m"},
}

// GetAllWeapons returns all weapons
func GetAllWeapons() []Weapon {
	return WeaponsDatabase
}

// GetWeaponsByType returns weapons filtered by type
func GetWeaponsByType(weaponType string) []Weapon {
	var result []Weapon
	for _, weapon := range WeaponsDatabase {
		if weapon.Type == weaponType {
			result = append(result, weapon)
		}
	}
	return result
}

// ArmorDatabase contains official Shadowrun 3e armor
var ArmorDatabase = []Armor{
	// Clothing
	{Name: "Armor Clothing", Type: "Clothing", Rating: 1},
	{Name: "Business Clothes", Type: "Clothing", Rating: 0},
	{Name: "Full Body Armor", Type: "Armor", Rating: 10},

	// Light Armor
	{Name: "Armor Jacket", Type: "Armor", Rating: 8},
	{Name: "Armor Vest", Type: "Armor", Rating: 6},
	{Name: "Chameleon Suit", Type: "Armor", Rating: 4},

	// Medium Armor
	{Name: "Security Armor", Type: "Armor", Rating: 10},
	{Name: "Form-Fitting Body Armor", Type: "Armor", Rating: 6},

	// Heavy Armor
	{Name: "Full Suit Armor", Type: "Armor", Rating: 12},
	{Name: "SecureTech Jacket", Type: "Armor", Rating: 9},

	// Specialty
	{Name: "Leather Jacket", Type: "Clothing", Rating: 2},
	{Name: "Dustoff Coat", Type: "Clothing", Rating: 3},
}

// GetAllArmor returns all armor
func GetAllArmor() []Armor {
	return ArmorDatabase
}

// GetArmorByType returns armor filtered by type
func GetArmorByType(armorType string) []Armor {
	var result []Armor
	for _, armor := range ArmorDatabase {
		if armor.Type == armorType {
			result = append(result, armor)
		}
	}
	return result
}

// CyberwareDatabase contains official Shadowrun 3e cyberware
var CyberwareDatabase = []Cyberware{
	// Cyberlimbs
	{Name: "Cyberarm", Rating: 0, EssenceCost: 0.75, Availability: 4},
	{Name: "Cyberleg", Rating: 0, EssenceCost: 0.75, Availability: 4},
	{Name: "Cyberlimb Enhancement (Strength)", Rating: 0, EssenceCost: 0.1, Availability: 4},

	// Eyes
	{Name: "Cybereyes", Rating: 0, EssenceCost: 0.5, Availability: 4},
	{Name: "Image Link", Rating: 0, EssenceCost: 0.1, Availability: 4},
	{Name: "Low-Light Vision", Rating: 0, EssenceCost: 0.1, Availability: 3},
	{Name: "Thermographic Vision", Rating: 0, EssenceCost: 0.1, Availability: 3},
	{Name: "Smartlink", Rating: 0, EssenceCost: 0.1, Availability: 5},

	// Ears
	{Name: "Cyberears", Rating: 0, EssenceCost: 0.3, Availability: 4},
	{Name: "Sound Link", Rating: 0, EssenceCost: 0.1, Availability: 4},
	{Name: "Audio Enhancement", Rating: 0, EssenceCost: 0.1, Availability: 3},

	// Body
	{Name: "Bone Lacing (Titanium)", Rating: 0, EssenceCost: 0.3, Availability: 4},
	{Name: "Bone Lacing (Aluminum)", Rating: 0, EssenceCost: 0.2, Availability: 3},
	{Name: "Dermal Plating", Rating: 1, EssenceCost: 0.1, Availability: 4},
	{Name: "Dermal Plating", Rating: 2, EssenceCost: 0.2, Availability: 5},
	{Name: "Dermal Plating", Rating: 3, EssenceCost: 0.3, Availability: 6},

	// Headware
	{Name: "Datajack", Rating: 0, EssenceCost: 0.1, Availability: 4},
	{Name: "Headware Memory", Rating: 1, EssenceCost: 0.1, Availability: 4},
	{Name: "Skillwires", Rating: 1, EssenceCost: 0.2, Availability: 5},
	{Name: "Skillwires", Rating: 2, EssenceCost: 0.3, Availability: 6},
	{Name: "Skillwires", Rating: 3, EssenceCost: 0.4, Availability: 7},

	// Internal
	{Name: "Reflex Trigger", Rating: 0, EssenceCost: 0.5, Availability: 6},
	{Name: "Wired Reflexes", Rating: 1, EssenceCost: 1.0, Availability: 8},
	{Name: "Wired Reflexes", Rating: 2, EssenceCost: 1.5, Availability: 9},
	{Name: "Wired Reflexes", Rating: 3, EssenceCost: 2.0, Availability: 10},
}

// GetAllCyberware returns all cyberware
func GetAllCyberware() []Cyberware {
	return CyberwareDatabase
}

// GetCyberwareByCategory returns cyberware filtered by category (rough grouping)
func GetCyberwareByCategory(category string) []Cyberware {
	// For now, return all. Can be enhanced later with categories
	return CyberwareDatabase
}
