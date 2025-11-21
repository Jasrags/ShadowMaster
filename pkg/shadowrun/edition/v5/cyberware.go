package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains cyberware structures generated from cyberware.xsd

// CyberwareCategory represents a cyberware category
type CyberwareCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Show *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`
}

// CyberwareCategories represents a collection of cyberware categories
type CyberwareCategories struct {
	Category []CyberwareCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// CyberwareGrade represents a cyberware grade
type CyberwareGrade struct {
	ID string `xml:"id" json:"id"`
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	DeviceRating *int `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	common.SourceReference
}

// CyberwareGrades represents a collection of cyberware grades
type CyberwareGrades struct {
	Grade []CyberwareGrade `xml:"grade,omitempty" json:"grade,omitempty"`
}

// CyberwareAllowGear represents allowed gear categories for cyberware
type CyberwareAllowGear struct {
	GearCategory []string `xml:"gearcategory,omitempty" json:"gearcategory,omitempty"`
}

// AllowSubsystems represents allowed subsystems
type AllowSubsystems struct {
	Category []string `xml:"category,omitempty" json:"category,omitempty"`
}

// IncludePair represents an include pair
type IncludePair struct {
	Name []string `xml:"name,omitempty" json:"name,omitempty"`
}

// BannedGrades represents banned grades
type BannedGrades struct {
	Grade []string `xml:"grade,omitempty" json:"grade,omitempty"`
}

// CyberwareSubsystem represents a subsystem within cyberware
type CyberwareSubsystem struct {
	Name string `xml:"name" json:"name"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Subsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// BiowareSubsystem represents a bioware subsystem within cyberware subsystems
type BiowareSubsystem struct {
	Name string `xml:"name" json:"name"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Subsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// CyberwareSubsystems represents subsystems (can contain cyberware or bioware)
type CyberwareSubsystems struct {
	Cyberware []CyberwareSubsystem `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
	Bioware []BiowareSubsystem `xml:"bioware,omitempty" json:"bioware,omitempty"`
}

// CyberwareItemName represents a cyberware name with optional attributes
type CyberwareItemName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// CyberwareItem represents a cyberware item within a cyberwares container
type CyberwareItem struct {
	Name CyberwareItemName `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Cyberwares *CyberwaresContainer `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
}

// CyberwaresContainer represents a recursive cyberwares container
type CyberwaresContainer struct {
	Cyberware []CyberwareItem `xml:"cyberware" json:"cyberware"`
}

// Cyberware represents a cyberware definition
type Cyberware struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	Ess string `xml:"ess" json:"ess"`
	Capacity string `xml:"capacity" json:"capacity"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	RequireParent string `xml:"requireparent" json:"requireparent"`
	common.SourceReference
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	AddToParentCapacity *string `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"`
	AddVehicle []string `xml:"addvehicle,omitempty" json:"addvehicle,omitempty"`
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	AllowGear *CyberwareAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	AllowSubsystems *AllowSubsystems `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`
	IncludePair *IncludePair `xml:"includepair,omitempty" json:"includepair,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	ForceGrade *string `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`
	common.Visibility
	MountsTo *string `xml:"mountsto,omitempty" json:"mountsto,omitempty"`
	ModularMount *string `xml:"modularmount,omitempty" json:"modularmount,omitempty"`
	BlocksMounts *string `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`
	AddToParentEss *string `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`
	BannedGrades *BannedGrades `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`
	InheritAttributes *string `xml:"inheritattributes,omitempty" json:"inheritattributes,omitempty"`
	LimbSlot *string `xml:"limbslot,omitempty" json:"limbslot,omitempty"`
	LimbSlotCount *string `xml:"limbslotcount,omitempty" json:"limbslotcount,omitempty"`
	MinAgility *int `xml:"minagility,omitempty" json:"minagility,omitempty"`
	MinStrength *int `xml:"minstrength,omitempty" json:"minstrength,omitempty"`
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
	Notes *string `xml:"notes,omitempty" json:"notes,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Subsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// Cyberwares represents a collection of cyberware
type Cyberwares struct {
	Cyberware []Cyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
}

// Suite represents a cyberware suite
type Suite struct {
	Name string `xml:"name" json:"name"`
	Grade string `xml:"grade" json:"grade"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	Cyberwares CyberwaresContainer `xml:"cyberwares" json:"cyberwares"`
}

// Suites represents a collection of cyberware suites
type Suites struct {
	Suite []Suite `xml:"suite" json:"suite"`
}

// CyberwareChummer represents the root chummer element for cyberware
type CyberwareChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Grades []CyberwareGrades `xml:"grades,omitempty" json:"grades,omitempty"`
	Categories []CyberwareCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Cyberwares *Cyberwares `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
	Suites *Suites `xml:"suites,omitempty" json:"suites,omitempty"`
}

