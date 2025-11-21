package common

// This file contains gear structures generated from gear.xsd

// Gear represents a gear element
// This is the main gear structure used in gear.xml files
type Gear struct {
	Id                   string                `xml:"id" json:"id"`
	Name                 string                `xml:"name" json:"name"`
	Category             string                `xml:"category" json:"category"`
	Rating               string                `xml:"rating" json:"rating"`
	Source               string                `xml:"source" json:"source"`
	Page                 string                `xml:"page" json:"page"`
	Avail                string                `xml:"avail" json:"avail"`
	Addoncategory        []string              `xml:"addoncategory,omitempty" json:"addoncategory,omitempty"`
	Addweapon            []string              `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	Armorcapacity        *string               `xml:"armorcapacity,omitempty" json:"armorcapacity,omitempty"`
	Attack               *string               `xml:"attack,omitempty" json:"attack,omitempty"`
	Modattack            *string               `xml:"modattack,omitempty" json:"modattack,omitempty"`
	Attributearray       *string               `xml:"attributearray,omitempty" json:"attributearray,omitempty"`
	Modattributearray    *string               `xml:"modattributearray,omitempty" json:"modattributearray,omitempty"`
	Matrixcmbonus        *int                  `xml:"matrixcmbonus,omitempty" json:"matrixcmbonus,omitempty"`
	Bonus                *BaseBonus            `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Capacity             *string               `xml:"capacity,omitempty" json:"capacity,omitempty"`
	Childavailmodifier   *int                  `xml:"childavailmodifier,omitempty" json:"childavailmodifier,omitempty"`
	Childcostmultiplier  *int                  `xml:"childcostmultiplier,omitempty" json:"childcostmultiplier,omitempty"`
	Cost                 *string               `xml:"cost,omitempty" json:"cost,omitempty"`
	Costfor              *string               `xml:"costfor,omitempty" json:"costfor,omitempty"`
	Disablequantity      *string               `xml:"disablequantity,omitempty" json:"disablequantity,omitempty"`
	Dataprocessing       *string               `xml:"dataprocessing,omitempty" json:"dataprocessing,omitempty"`
	Moddataprocessing    *string               `xml:"moddataprocessing,omitempty" json:"moddataprocessing,omitempty"`
	Devicerating         *string               `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	Firewall             *string               `xml:"firewall,omitempty" json:"firewall,omitempty"`
	Modfirewall          *string               `xml:"modfirewall,omitempty" json:"modfirewall,omitempty"`
	Canformpersona       *string               `xml:"canformpersona,omitempty" json:"canformpersona,omitempty"`
	Gears                *Gears                `xml:"gears,omitempty" json:"gears,omitempty"`
	Hide                 *string               `xml:"hide,omitempty" json:"hide,omitempty"`
	Ignoresourcedisabled *string               `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"`
	Minrating            *string               `xml:"minrating,omitempty" json:"minrating,omitempty"`
	Programs             *string               `xml:"programs,omitempty" json:"programs,omitempty"`
	Required             *Required             `xml:"required,omitempty" json:"required,omitempty"`
	Skill                *string               `xml:"skill,omitempty" json:"skill,omitempty"`
	Sleaze               *string               `xml:"sleaze,omitempty" json:"sleaze,omitempty"`
	Modsleaze            *string               `xml:"modsleaze,omitempty" json:"modsleaze,omitempty"`
	Tags                 *Tags                 `xml:"tags,omitempty" json:"tags,omitempty"`
	Weaponbonus          *Weaponbonus          `xml:"weaponbonus,omitempty" json:"weaponbonus,omitempty"`
	Isflechetteammo      *string               `xml:"isflechetteammo,omitempty" json:"isflechetteammo,omitempty"`
	Flechetteweaponbonus *Flechetteweaponbonus `xml:"flechetteweaponbonus,omitempty" json:"flechetteweaponbonus,omitempty"`
	Ammoforweapontype    Ammoforweapontype     `xml:"ammoforweapontype,omitempty" json:"ammoforweapontype,omitempty"`
	Content              string                `xml:",chardata" json:"+content,omitempty"`
	Noextra              *string               `xml:"noextra,omitempty" json:"noextra,omitempty"`
}

// Tags represents a tags element
type Tags struct {
	Tag []string `xml:"tag,omitempty" json:"tag,omitempty"`
}

// Weaponbonus represents a weaponbonus element
type Weaponbonus struct {
	Accuracy        *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	Accuracyreplace *string `xml:"accuracyreplace,omitempty" json:"accuracyreplace,omitempty"`
	Ap              *string `xml:"ap,omitempty" json:"ap,omitempty"`
	Apreplace       *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
	Damage          *string `xml:"damage,omitempty" json:"damage,omitempty"`
	Damagereplace   *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
	Damagetype      *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	Mode            *string `xml:"mode,omitempty" json:"mode,omitempty"`
	Modereplace     *string `xml:"modereplace,omitempty" json:"modereplace,omitempty"`
	Pool            *string `xml:"pool,omitempty" json:"pool,omitempty"`
	Rangebonus      *int    `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	Rc              *string `xml:"rc,omitempty" json:"rc,omitempty"`
	Smartlinkpool   *string `xml:"smartlinkpool,omitempty" json:"smartlinkpool,omitempty"`
	Userange        *string `xml:"userange,omitempty" json:"userange,omitempty"`
}

// Flechetteweaponbonus represents a flechetteweaponbonus element
type Flechetteweaponbonus struct {
	Accuracy        *string `xml:"accuracy,omitempty" json:"accuracy,omitempty"`
	Accuracyreplace *string `xml:"accuracyreplace,omitempty" json:"accuracyreplace,omitempty"`
	Ap              *string `xml:"ap,omitempty" json:"ap,omitempty"`
	Apreplace       *string `xml:"apreplace,omitempty" json:"apreplace,omitempty"`
	Damage          *string `xml:"damage,omitempty" json:"damage,omitempty"`
	Damagereplace   *string `xml:"damagereplace,omitempty" json:"damagereplace,omitempty"`
	Damagetype      *string `xml:"damagetype,omitempty" json:"damagetype,omitempty"`
	Mode            *string `xml:"mode,omitempty" json:"mode,omitempty"`
	Modereplace     *string `xml:"modereplace,omitempty" json:"modereplace,omitempty"`
	Pool            *string `xml:"pool,omitempty" json:"pool,omitempty"`
	Rangebonus      *int    `xml:"rangebonus,omitempty" json:"rangebonus,omitempty"`
	Rc              *string `xml:"rc,omitempty" json:"rc,omitempty"`
	Smartlinkpool   *string `xml:"smartlinkpool,omitempty" json:"smartlinkpool,omitempty"`
	Userange        *string `xml:"userange,omitempty" json:"userange,omitempty"`
}

// Ammoforweapontype represents a ammoforweapontype element
type Ammoforweapontype struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Noextra *string `xml:"noextra,attr,omitempty" json:"+@noextra,omitempty"`
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
type GearCategory struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Show    *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`
}

// GearCategories represents a categories container
type GearCategories struct {
	Category []GearCategory `xml:"category,omitempty" json:"category,omitempty"`
}
