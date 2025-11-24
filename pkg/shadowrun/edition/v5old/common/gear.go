package common

// This file contains gear structures generated from gear.xsd

// Gear represents a gear element
// This is the main gear structure used in gear.xml files
type Gear struct {
	// Id represents id
	// Usage: always present (100.0%)
	// Unique Values: 1598
	Id string `xml:"id" json:"id"`
	// Name represents name
	// Usage: always present (100.0%)
	// Unique Values: 2
	Name string `xml:"name" json:"name"`
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	Category string `xml:"category" json:"category"`
	// Rating represents rating
	// Usage: always present (100.0%)
	// Unique Values: 3
	// May contain numeric values or formulas
	Rating string `xml:"rating" json:"rating"`
	// Source represents source
	// Usage: always present (100.0%)
	// Unique Values: 39
	Source string `xml:"source" json:"source"`
	// Page represents page
	// Usage: always present (100.0%)
	// Unique Values: 183
	Page string `xml:"page" json:"page"`
	// Avail represents avail
	// Usage: always present (100.0%)
	// Unique Values: 107
	// May contain formulas and availability modifiers (R, F)
	Avail string `xml:"avail" json:"avail"`
	// Addoncategory represents addoncategory
	// Usage: always present (100.0%)
	// Unique Values: 17
	Addoncategory []AddonCategory `xml:"addoncategory,omitempty" json:"addoncategory,omitempty"`
	// Addweapon represents addweapon
	// Usage: always present (100.0%)
	// Unique Values: 100
	// Examples: Throwing Syringe, Throwing Knife, Shuriken (and 7 more)
	// Length: 3-54 characters
	// Addweapon represents addweapon
	// Usage: always present (100.0%)
	// Unique Values: 100
	// Examples: Throwing Syringe, Throwing Knife, Shuriken (and 7 more)
	// Length: 3-54 characters
	Addweapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	// Armorcapacity represents armorcapacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: [2], [2], [2] (and 7 more)
	// Enum Candidate: 0, Rating/[1], [0], [1], [2], [3], [4], [5], [6], [Rating]
	// Length: 1-10 characters
	// Armorcapacity represents armorcapacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: [2], [2], [2] (and 7 more)
	// Enum Candidate: 0, Rating/[1], [0], [1], [2], [3], [4], [5], [6], [Rating]
	// Length: 1-10 characters
	Armorcapacity *string `xml:"armorcapacity,omitempty" json:"armorcapacity,omitempty"`
	// Attack represents attack
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	// Attack represents attack
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Attack *string `xml:"attack,omitempty" json:"attack,omitempty"`
	// Modattack represents modattack
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Note: 81.8% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	// Modattack represents modattack
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Note: 81.8% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	Modattack *string `xml:"modattack,omitempty" json:"modattack,omitempty"`
	// Attributearray represents attributearray
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 21
	// Examples: 4,3,2,1, 4,3,3,1, 5,4,3,2 (and 7 more)
	// Enum Candidate: Yes
	// Attributearray represents attributearray
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 21
	// Examples: 4,3,2,1, 4,3,3,1, 5,4,3,2 (and 7 more)
	// Enum Candidate: Yes
	Attributearray *string `xml:"attributearray,omitempty" json:"attributearray,omitempty"`
	// Modattributearray represents modattributearray
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 12
	// Examples: 1,-1,0,0, 1,0,-1,0, 1,0,0,-1 (and 7 more)
	// Enum Candidate: -1,0,0,1, -1,0,1,0, -1,1,0,0, 0,-1,0,1, 0,-1,1,0, 0,0,-1,1, 0,0,1,-1, 0,1,-1,0, 0,1,0,-1, 1,-1,0,0, 1,0,-1,0, 1,0,0,-1
	// Modattributearray represents modattributearray
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 12
	// Examples: 1,-1,0,0, 1,0,-1,0, 1,0,0,-1 (and 7 more)
	// Enum Candidate: -1,0,0,1, -1,0,1,0, -1,1,0,0, 0,-1,0,1, 0,-1,1,0, 0,0,-1,1, 0,0,1,-1, 0,1,-1,0, 0,1,0,-1, 1,-1,0,0, 1,0,-1,0, 1,0,0,-1
	Modattributearray *string `xml:"modattributearray,omitempty" json:"modattributearray,omitempty"`
	// Matrixcmbonus represents matrixcmbonus
	// Type: numeric_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: -3, -2, -2 (and 6 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -2, -3, 2
	// Length: 1-2 characters
	// Matrixcmbonus represents matrixcmbonus
	// Type: numeric_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: -3, -2, -2 (and 6 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -2, -3, 2
	// Length: 1-2 characters
	Matrixcmbonus *int       `xml:"matrixcmbonus,omitempty" json:"matrixcmbonus,omitempty"`
	Bonus         *BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	Capacity            *string `xml:"capacity,omitempty" json:"capacity,omitempty"`
	Childavailmodifier  *int    `xml:"childavailmodifier,omitempty" json:"childavailmodifier,omitempty"`
	Childcostmultiplier *int    `xml:"childcostmultiplier,omitempty" json:"childcostmultiplier,omitempty"`
	// Cost represents cost
	// Type: mixed_numeric, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 297
	// Examples: 40, 45, (Rating * 30) (and 7 more)
	// Length: 1-45 characters
	// Cost represents cost
	// Type: mixed_numeric, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 297
	// Examples: 40, 45, (Rating * 30) (and 7 more)
	// Length: 1-45 characters
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	// Costfor represents costfor
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: 1, 10, 100, 2, 20, 3, 4, 5, 50, 6
	// Length: 1-3 characters
	// Costfor represents costfor
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: 1, 10, 100, 2, 20, 3, 4, 5, 50, 6
	// Length: 1-3 characters
	Costfor         *string `xml:"costfor,omitempty" json:"costfor,omitempty"`
	Disablequantity *string `xml:"disablequantity,omitempty" json:"disablequantity,omitempty"`
	// Dataprocessing represents dataprocessing
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	// Dataprocessing represents dataprocessing
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Dataprocessing *string `xml:"dataprocessing,omitempty" json:"dataprocessing,omitempty"`
	// Moddataprocessing represents moddataprocessing
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, 1, -1 (and 6 more)
	// Note: 88.9% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	// Moddataprocessing represents moddataprocessing
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, 1, -1 (and 6 more)
	// Note: 88.9% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	Moddataprocessing *string `xml:"moddataprocessing,omitempty" json:"moddataprocessing,omitempty"`
	// Devicerating represents devicerating
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 12
	// Examples: {RES}, Rating, 1 (and 7 more)
	// Note: 94.7% of values are numeric strings
	// Enum Candidate: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {RES}, {Rating}
	// Length: 1-8 characters
	// Devicerating represents devicerating
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 12
	// Examples: {RES}, Rating, 1 (and 7 more)
	// Note: 94.7% of values are numeric strings
	// Enum Candidate: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {RES}, {Rating}
	// Length: 1-8 characters
	Devicerating *string `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	// Firewall represents firewall
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	// Firewall represents firewall
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Firewall *string `xml:"firewall,omitempty" json:"firewall,omitempty"`
	// Modfirewall represents modfirewall
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	// Modfirewall represents modfirewall
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	Modfirewall *string `xml:"modfirewall,omitempty" json:"modfirewall,omitempty"`
	// Canformpersona represents canformpersona
	// Usage: always present (100.0%)
	// Unique Values: 2
	Canformpersona       *CanFormPersona `xml:"canformpersona,omitempty" json:"canformpersona,omitempty"`
	Gears                *Gears          `xml:"gears,omitempty" json:"gears,omitempty"`
	Hide                 *string         `xml:"hide,omitempty" json:"hide,omitempty"`
	Ignoresourcedisabled *string         `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"`
	// Minrating represents minrating
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 7
	// Examples: 5, 3, 6 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: 1, 12, 2, 3, 4, 5, 6
	// Length: 1-2 characters
	// Minrating represents minrating
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 7
	// Examples: 5, 3, 6 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: 1, 12, 2, 3, 4, 5, 6
	// Length: 1-2 characters
	Minrating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	// Programs represents programs
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 9
	// Examples: 1, 1, 2 (and 7 more)
	// Note: 97.6% of values are numeric strings
	// Enum Candidate: 1, 2, 3, 4, 5, 6, 8, Rating, {Rating}+2
	// Length: 1-10 characters
	// Programs represents programs
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 9
	// Examples: 1, 1, 2 (and 7 more)
	// Note: 97.6% of values are numeric strings
	// Enum Candidate: 1, 2, 3, 4, 5, 6, 8, Rating, {Rating}+2
	// Length: 1-10 characters
	Programs *string   `xml:"programs,omitempty" json:"programs,omitempty"`
	Required *Required `xml:"required,omitempty" json:"required,omitempty"`
	Skill    *string   `xml:"skill,omitempty" json:"skill,omitempty"`
	// Sleaze represents sleaze
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	// Sleaze represents sleaze
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0, 0, 0 (and 3 more)
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Sleaze *string `xml:"sleaze,omitempty" json:"sleaze,omitempty"`
	// Modsleaze represents modsleaze
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Note: 81.8% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	// Modsleaze represents modsleaze
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: {Rating}, {Rating}, 1 (and 7 more)
	// Note: 81.8% of values are numeric strings
	// Enum Candidate: -1, 1, {Rating}
	// Length: 1-8 characters
	Modsleaze   *string     `xml:"modsleaze,omitempty" json:"modsleaze,omitempty"`
	Tags        Tags        `xml:"tags,omitempty" json:"tags,omitempty"`
	Weaponbonus Weaponbonus `xml:"weaponbonus,omitempty" json:"weaponbonus,omitempty"`
	// Isflechetteammo represents isflechetteammo
	// Usage: always present (100.0%)
	// Unique Values: 1
	Isflechetteammo      *bool                `xml:"isflechetteammo,omitempty" json:"isflechetteammo,omitempty"`
	Flechetteweaponbonus Flechetteweaponbonus `xml:"flechetteweaponbonus,omitempty" json:"flechetteweaponbonus,omitempty"`
	// Ammoforweapontype represents ammoforweapontype
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 32
	// Examples: bow, gun, gun (and 7 more)
	// Enum Candidate: Yes
	// Length: 3-25 characters
	// Ammoforweapontype represents ammoforweapontype
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 32
	// Examples: bow, gun, gun (and 7 more)
	// Enum Candidate: Yes
	// Length: 3-25 characters
	Ammoforweapontype Ammoforweapontype `xml:"ammoforweapontype,omitempty" json:"ammoforweapontype,omitempty"`
	Content           string            `xml:",chardata" json:"+content,omitempty"`
	Noextra           *string           `xml:"noextra,omitempty" json:"noextra,omitempty"`
}

// Tags represents a tags element
type Tags struct {
	Tag string `xml:"tag,omitempty" json:"tag,omitempty"`
}

// Weaponbonus represents a weaponbonus element
type Weaponbonus struct {
	// Accuracy represents accuracy
	// Type: numeric_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: -1, -1, -1 (and 5 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -1, -2
	// Accuracy represents accuracy
	// Type: numeric_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: -1, -1, -1 (and 5 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -1, -2
	Accuracy *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	// Accuracyreplace represents accuracyreplace
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 3, 3
	// Note: 100.0% of values are numeric strings
	// Accuracyreplace represents accuracyreplace
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 3, 3
	// Note: 100.0% of values are numeric strings
	Accuracyreplace *string `xml:"accuracyreplace,omitempty" json:"accuracyreplace,omitempty"`
	// Ap represents ap
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: -5
	// Note: 100.0% of values are numeric strings
	// Ap represents ap
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: -5
	// Note: 100.0% of values are numeric strings
	Ap *string `xml:"ap,omitempty" json:"ap,omitempty"`
	// Apreplace represents apreplace
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 5
	// Examples: -1, -5, -6 (and 2 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -1, -5, -6, -8, 0
	// Length: 1-2 characters
	// Apreplace represents apreplace
	// Type: numeric_string, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 5
	// Examples: -1, -5, -6 (and 2 more)
	// Note: 100.0% of values are numeric strings
	// Enum Candidate: -1, -5, -6, -8, 0
	// Length: 1-2 characters
	Apreplace *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
	// Damage represents damage
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: -2
	// Note: 100.0% of values are numeric strings
	// Damage represents damage
	// Type: numeric_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: -2
	// Note: 100.0% of values are numeric strings
	Damage *string `xml:"damage,omitempty" json:"damage,omitempty"`
	// Damagereplace represents damagereplace
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: 7P, 8P, 8S(e) (and 7 more)
	// Enum Candidate: 0S, 12S(e), 6P, 7P, 8P, 8S(e), 9P, As Drug/Toxin, As Narcoject, Special
	// Length: 2-13 characters
	// Damagereplace represents damagereplace
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 10
	// Examples: 7P, 8P, 8S(e) (and 7 more)
	// Enum Candidate: 0S, 12S(e), 6P, 7P, 8P, 8S(e), 9P, As Drug/Toxin, As Narcoject, Special
	// Length: 2-13 characters
	Damagereplace *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
	// Damagetype represents damagetype
	// Usage: always present (100.0%)
	// Unique Values: 2
	Damagetype *DamageType `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	Mode       *string     `xml:"mode,omitempty" json:"mode,omitempty"`
	// Modereplace represents modereplace
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: SS
	// Modereplace represents modereplace
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: SS
	Modereplace *string `xml:"modereplace,omitempty" json:"modereplace,omitempty"`
	Pool        *string `xml:"pool,omitempty" json:"pool,omitempty"`
	Rangebonus  *int    `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	Rc          *string `xml:"rc,omitempty" json:"rc,omitempty"`
	// Smartlinkpool represents smartlinkpool
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 1
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	// Smartlinkpool represents smartlinkpool
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 1
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Smartlinkpool *string `xml:"smartlinkpool,omitempty" json:"smartlinkpool,omitempty"`
	// Userange represents userange
	// Usage: always present (100.0%)
	// Unique Values: 2
	Userange *UseRange `xml:"userange,omitempty" json:"userange,omitempty"`
}

// Flechetteweaponbonus is an alias for Weaponbonus for backward compatibility
// Both structs have identical fields
type Flechetteweaponbonus = Weaponbonus

// Ammoforweapontype represents a ammoforweapontype element
type Ammoforweapontype struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Noextra *string `xml:"noextra,attr,omitempty" json:"+@noextra,omitempty"`
}

// UseGearName represents a usegear name element
type UseGearName struct {
	Content         string  `xml:",chardata" json:"+content,omitempty"`
	Select          *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
	CreateChildren  *string `xml:"createchildren,attr,omitempty" json:"+@createchildren,omitempty"`
	AddImprovements *string `xml:"addimprovements,attr,omitempty" json:"+@addimprovements,omitempty"`
	Qty             *string `xml:"qty,attr,omitempty" json:"+@qty,omitempty"`
}

// UseGear represents a usegear element within gears
type UseGear struct {
	// Name represents name
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: Internal Synthlink, External Synthlink, Internal Synthlink (and 5 more)
	// Enum Candidate: External Synthlink, Internal Synthlink
	// Name represents name
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: Internal Synthlink, External Synthlink, Internal Synthlink (and 5 more)
	// Enum Candidate: External Synthlink, Internal Synthlink
	Name UseGearName `xml:"name" json:"name"`
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	Category string `xml:"category" json:"category"`
	// Rating represents rating
	// Type: numeric_string, boolean_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Note: 89.3% of values are boolean strings
	// Enum Candidate: 1, 2, 3
	// Rating represents rating
	// Type: numeric_string, boolean_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Note: 89.3% of values are boolean strings
	// Enum Candidate: 1, 2, 3
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	Capacity *int `xml:"capacity,omitempty" json:"capacity,omitempty"`
	// Page represents page
	// Type: numeric_string, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 183
	// Examples: 183, 187, 187 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Length: 1-3 characters
	// Page represents page
	// Type: numeric_string, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 183
	// Examples: 183, 187, 187 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Length: 1-3 characters
	Page *int `xml:"page,omitempty" json:"page,omitempty"`
	// Source represents source
	// Type: mixed_numeric, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 39
	// Examples: HT, HT, HT (and 7 more)
	// Enum Candidate: Yes
	// Length: 2-8 characters
	// Source represents source
	// Type: mixed_numeric, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 39
	// Examples: HT, HT, HT (and 7 more)
	// Enum Candidate: Yes
	// Length: 2-8 characters
	Source *int   `xml:"source,omitempty" json:"source,omitempty"`
	Gears  *Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// ChooseGearUseGear represents a usegear element within choosegear
type ChooseGearUseGear struct {
	// Name represents name
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: Internal Synthlink, External Synthlink, Internal Synthlink (and 5 more)
	// Enum Candidate: External Synthlink, Internal Synthlink
	// Name represents name
	// Type: enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 2
	// Examples: Internal Synthlink, External Synthlink, Internal Synthlink (and 5 more)
	// Enum Candidate: External Synthlink, Internal Synthlink
	Name UseGearName `xml:"name" json:"name"`
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	Category string `xml:"category" json:"category"`
	// Rating represents rating
	// Type: numeric_string, boolean_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Note: 89.3% of values are boolean strings
	// Enum Candidate: 1, 2, 3
	// Rating represents rating
	// Type: numeric_string, boolean_string, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 3
	// Examples: 1, 1, 1 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Note: 89.3% of values are boolean strings
	// Enum Candidate: 1, 2, 3
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	// Capacity represents capacity
	// Type: mixed_numeric, mixed_boolean, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 29
	// Examples: 0, 0, 0 (and 7 more)
	// Enum Candidate: Yes
	// Length: 1-19 characters
	Capacity *int `xml:"capacity,omitempty" json:"capacity,omitempty"`
	// Page represents page
	// Type: numeric_string, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 183
	// Examples: 183, 187, 187 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Length: 1-3 characters
	// Page represents page
	// Type: numeric_string, mixed_boolean
	// Usage: always present (100.0%)
	// Unique Values: 183
	// Examples: 183, 187, 187 (and 7 more)
	// Note: 100.0% of values are numeric strings
	// Length: 1-3 characters
	Page *int `xml:"page,omitempty" json:"page,omitempty"`
	// Source represents source
	// Type: mixed_numeric, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 39
	// Examples: HT, HT, HT (and 7 more)
	// Enum Candidate: Yes
	// Length: 2-8 characters
	// Source represents source
	// Type: mixed_numeric, enum_candidate
	// Usage: always present (100.0%)
	// Unique Values: 39
	// Examples: HT, HT, HT (and 7 more)
	// Enum Candidate: Yes
	// Length: 2-8 characters
	Source *int   `xml:"source,omitempty" json:"source,omitempty"`
	Gears  *Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// ChooseGear represents a choosegear element within gears
type ChooseGear struct {
	UseGear  []ChooseGearUseGear `xml:"usegear,omitempty" json:"usegear,omitempty"`
	Required *string             `xml:"required,attr,omitempty" json:"+@required,omitempty"`
}

// Gears represents a gears container element
// This can contain gear, usegear, and choosegear elements
type Gears struct {
	Gear           []Gear       `xml:"gear,omitempty" json:"gear,omitempty"`
	UseGear        []UseGear    `xml:"usegear,omitempty" json:"usegear,omitempty"`
	ChooseGear     []ChooseGear `xml:"choosegear,omitempty" json:"choosegear,omitempty"`
	StartCollapsed *string      `xml:"startcollapsed,attr,omitempty" json:"+@startcollapsed,omitempty"`
}

// GearCategory represents a gear category
// This is an alias for CategoryWithShow for backward compatibility
type GearCategory = CategoryWithShow

// GearCategories represents a categories container
type GearCategories struct {
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	// Category represents category
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: Drugs, Drugs, Drugs
	Category []GearCategory `xml:"category,omitempty" json:"category,omitempty"`
}
