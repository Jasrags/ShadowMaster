package v5

// VehicleCategory represents a vehicle category with its black market classification
type VehicleCategory struct {
	Name        string `json:"name"`         // Category name like "Bikes", "Cars", "Drones: Micro", etc.
	BlackMarket string `json:"black_market"` // Black market classification
}

// VehicleModCategory represents a vehicle modification category
type VehicleModCategory struct {
	Name        string `json:"name"`         // Category name like "Body", "Cosmetic", etc.
	BlackMarket string `json:"black_market"` // Black market classification
}

// VehicleWeaponMountCategory represents a weapon mount category
type VehicleWeaponMountCategory struct {
	Name        string `json:"name"`         // Category name (usually "Size")
	BlackMarket string `json:"black_market"` // Black market classification
}

// VehicleGear represents gear installed in a vehicle
type VehicleGear struct {
	Name      string `json:"name"`                // Gear name
	Rating    string `json:"rating,omitempty"`    // Rating (can be "1", "2", etc.)
	MaxRating string `json:"maxrating,omitempty"` // Maximum rating
}

// VehicleGears represents a collection of gears
type VehicleGears struct {
	Gear interface{} `json:"gear,omitempty"` // Can be single VehicleGear or []VehicleGear
}

// VehicleMod represents a vehicle modification (simple version for vehicle.mods field)
type VehicleMod struct {
	Name string `json:"name"` // Mod name
}

// VehicleMods represents a collection of vehicle modifications
type VehicleMods struct {
	Name interface{} `json:"name,omitempty"` // Can be string, []string, or complex structure
}

// VehicleWeaponMount represents a weapon mount on a vehicle
type VehicleWeaponMount struct {
	Control     string `json:"control,omitempty"`     // Control type like "Manual", "Remote", etc.
	Flexibility string `json:"flexibility,omitempty"` // Flexibility like "Fixed", "Flexible", etc.
	Size        string `json:"size,omitempty"`        // Size like "Standard", "Heavy", etc.
	Visibility  string `json:"visibility,omitempty"`  // Visibility like "External", "Internal", etc.
}

// VehicleWeaponMounts represents a collection of weapon mounts
type VehicleWeaponMounts struct {
	WeaponMount interface{} `json:"weaponmount,omitempty"` // Can be single or array
}

// VehicleWeapon represents a weapon on a vehicle
type VehicleWeapon struct {
	Name string `json:"name,omitempty"` // Weapon name
}

// VehicleWeapons represents a collection of weapons
type VehicleWeapons struct {
	Weapon interface{} `json:"weapon,omitempty"` // Can be single or array
}

// VehicleModification represents a vehicle modification from the mods list
type VehicleModification struct {
	// Required fields
	Name     string `json:"name"`
	Category string `json:"category"`
	Slots    string `json:"slots"`  // Slot cost like "0", "1", "Rating", etc.
	Avail    string `json:"avail"`  // Availability
	Cost     string `json:"cost"`   // Cost
	Source   string `json:"source"` // Source book

	// Optional fields
	Page     string      `json:"page,omitempty"`     // Page number
	Rating   string      `json:"rating,omitempty"`   // Rating
	Required interface{} `json:"required,omitempty"` // Requirements (can be complex)
	Hide     *bool       `json:"hide,omitempty"`     // Whether to hide this mod
}

// WeaponMount represents a weapon mount type
type WeaponMount struct {
	// Required fields
	Name     string `json:"name"`
	Category string `json:"category"`
	Slots    string `json:"slots"`  // Slot cost
	Avail    string `json:"avail"`  // Availability
	Cost     string `json:"cost"`   // Cost
	Source   string `json:"source"` // Source book

	// Optional fields
	Page string `json:"page,omitempty"` // Page number
	Hide *bool  `json:"hide,omitempty"` // Whether to hide this mount
}

// WeaponMountMod represents a weapon mount modification
type WeaponMountMod struct {
	// Required fields
	Name     string `json:"name"`
	Category string `json:"category"`
	Slots    string `json:"slots"`  // Slot cost
	Avail    string `json:"avail"`  // Availability
	Cost     string `json:"cost"`   // Cost
	Source   string `json:"source"` // Source book

	// Optional fields
	Page     string      `json:"page,omitempty"`     // Page number
	Rating   string      `json:"rating,omitempty"`   // Rating
	Required interface{} `json:"required,omitempty"` // Requirements (can be complex)
	Hide     *bool       `json:"hide,omitempty"`     // Whether to hide this mod
}

// Vehicle represents a vehicle from Shadowrun 5th Edition
type Vehicle struct {
	// Required fields
	Name     string `json:"name"`     // Vehicle name
	Category string `json:"category"` // Category like "Bikes", "Cars", etc.
	Source   string `json:"source"`   // Source book like "SR5", "R5", etc.

	// Vehicle stats
	Accel    string `json:"accel"`    // Acceleration like "1", "2", "1/2", etc.
	Armor    string `json:"armor"`    // Armor rating
	Avail    string `json:"avail"`    // Availability
	Body     string `json:"body"`     // Body rating
	Cost     string `json:"cost"`     // Cost
	Handling string `json:"handling"` // Handling like "4/3", "3/1", etc.
	Pilot    string `json:"pilot"`    // Pilot rating
	Sensor   string `json:"sensor"`   // Sensor rating
	Speed    string `json:"speed"`    // Speed like "3", "2/3", etc.
	Seats    string `json:"seats"`    // Number of seats

	// Optional fields
	Page                    string               `json:"page,omitempty"`                    // Page number
	Gears                   *VehicleGears        `json:"gears,omitempty"`                   // Installed gears
	Mods                    *VehicleMods         `json:"mods,omitempty"`                    // Installed modifications
	WeaponMounts            *VehicleWeaponMounts `json:"weaponmounts,omitempty"`            // Weapon mounts
	Weapons                 *VehicleWeapons      `json:"weapons,omitempty"`                 // Weapons
	BodyModSlots            string               `json:"bodymodslots,omitempty"`            // Body mod slots
	CosmeticModSlots        string               `json:"cosmeticmodslots,omitempty"`        // Cosmetic mod slots
	ElectromagneticModSlots string               `json:"electromagneticmodslots,omitempty"` // Electromagnetic mod slots
	ModSlots                string               `json:"modslots,omitempty"`                // General mod slots
	PowertrainModSlots      string               `json:"powertrainmodslots,omitempty"`      // Powertrain mod slots
	ProtectionModSlots      string               `json:"protectionmodslots,omitempty"`      // Protection mod slots
	WeaponModSlots          string               `json:"weaponmodslots,omitempty"`          // Weapon mod slots
	Hide                    *bool                `json:"hide,omitempty"`                    // Whether to hide this vehicle
}
