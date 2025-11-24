package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains bioware structures generated from bioware.xsd

// BiowareGrade represents a bioware grade
type BiowareGrade struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 213
// Examples: ae0bb365-e40c-4aa2-9c30-0be902d992ac, b04871a1-6b7b-4a78-89fc-af8ec69bdd3d, f038260b-f2de-4a9a-9507-5602d0e64a22 (and 7 more)
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	DeviceRating *int `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
	common.SourceReference
}

// BiowareGrades represents a collection of bioware grades
type BiowareGrades struct {
	Grade []BiowareGrade `xml:"grade,omitempty" json:"grade,omitempty"`
}

// BiowareCategory represents a bioware category
// This is an alias for CategoryBase for backward compatibility
type BiowareCategory = common.CategoryBase

// BiowareCategories represents a collection of bioware categories
type BiowareCategories struct {
	Category []BiowareCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// BiowareBannedGrades represents banned grades
type BiowareBannedGrades struct {
	Grade []string `xml:"grade,omitempty" json:"grade,omitempty"`
}

// BiowareAllowSubsystems represents allowed subsystems
type BiowareAllowSubsystems struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Swim, Swim
	Category []string `xml:"category,omitempty" json:"category,omitempty"`
}

// BiowareIncludePair represents an include pair
type BiowareIncludePair struct {
	Name []string `xml:"name,omitempty" json:"name,omitempty"`
}

// BiowareSubsystemCyberware represents a cyberware subsystem within bioware subsystems
type BiowareSubsystemCyberware struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: LOG, INT
// Enum Candidate: INT, LOG
	Name string `xml:"name" json:"name"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Subsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// BiowareSubsystemBioware represents a bioware subsystem within bioware subsystems
type BiowareSubsystemBioware struct {
	Name string `xml:"name" json:"name"`
// Rating represents rating
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 3, 4, 3 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 12, 2, 20, 3, 4, 6
// Length: 1-2 characters
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Subsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// BiowareSubsystems represents bioware subsystems (recursive)
type BiowareSubsystems struct {
	Cyberware []BiowareSubsystemCyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
	Bioware []BiowareSubsystemBioware `xml:"bioware,omitempty" json:"bioware,omitempty"`
}

// BiowareItem represents a bioware item
type BiowareItem struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 213
// Examples: ae0bb365-e40c-4aa2-9c30-0be902d992ac, b04871a1-6b7b-4a78-89fc-af8ec69bdd3d, f038260b-f2de-4a9a-9507-5602d0e64a22 (and 7 more)
	ID string `xml:"id" json:"id"`
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	common.Visibility
	MountsTo *string `xml:"mountsto,omitempty" json:"mountsto,omitempty"`
	ModularMount *string `xml:"modularmount,omitempty" json:"modularmount,omitempty"`
	BlocksMounts *string `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`
	BannedGrades *BiowareBannedGrades `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`
	Name string `xml:"name" json:"name"`
	Category string `xml:"category" json:"category"`
	AddToParentCapacity *string `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"`
// Ess represents ess
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 27
// Examples: Rating * 0.75, Rating * 0.3, 0.1 (and 7 more)
// Enum Candidate: Yes
// Length: 1-24 characters
	Ess string `xml:"ess" json:"ess"`
	Capacity string `xml:"capacity" json:"capacity"`
	Avail string `xml:"avail" json:"avail"`
	Cost string `xml:"cost" json:"cost"`
	AddToParentEss *string `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`
	RequireParent string `xml:"requireparent" json:"requireparent"`
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	AllowSubsystems *BiowareAllowSubsystems `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`
	IncludePair *BiowareIncludePair `xml:"includepair,omitempty" json:"includepair,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
// ForceGrade represents forcegrade
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: None, None, None (and 7 more)
	ForceGrade *string `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`
	Notes *string `xml:"notes,omitempty" json:"notes,omitempty"`
	Rating *string `xml:"rating,omitempty" json:"rating,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Subsystems *BiowareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	common.SourceReference
}

// BiowareItems represents a collection of bioware items
type BiowareItems struct {
	Bioware []BiowareItem `xml:"bioware,omitempty" json:"bioware,omitempty"`
}

// BiowareChummer represents the root chummer element for bioware
type BiowareChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Grades []BiowareGrades `xml:"grades,omitempty" json:"grades,omitempty"`
	Categories []BiowareCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Biowares []BiowareItems `xml:"biowares,omitempty" json:"biowares,omitempty"`
}

