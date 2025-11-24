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
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Commlinks, Commlinks, Commlinks (and 6 more)
	Category []CyberwareCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// CyberwareGrade represents a cyberware grade
type CyberwareGrade struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 362
// Examples: b57eadaa-7c3b-4b80-8d79-cbbd922c1196, 961eac53-0c43-4b19-8741-2872177a3a4c, 6b219dfa-310a-45ab-98af-40a62e2431cf (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
// Ess represents ess
// Type: numeric_string, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 54
// Examples: Rating * 0.01, Rating * -0.01, 0.2 (and 7 more)
// Note: 91.2% of values are numeric strings
// Length: 1-32 characters
	Ess *string `xml:"ess,omitempty" json:"ess,omitempty"`
// Cost represents cost
// Type: mixed_numeric, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 122
// Examples: 0, 0, 2000 (and 7 more)
// Length: 1-63 characters
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
// DeviceRating represents devicerating
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: {Rating}
	DeviceRating *int `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 65
// Examples: 0, 0, 0 (and 7 more)
// Length: 1-24 characters
	Avail *string `xml:"avail,omitempty" json:"avail,omitempty"`
// Bonus represents bonus
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	common.SourceReference
}

// CyberwareGrades represents a collection of cyberware grades
type CyberwareGrades struct {
	Grade []CyberwareGrade `xml:"grade,omitempty" json:"grade,omitempty"`
}

// CyberwareAllowGear represents allowed gear categories for cyberware
type CyberwareAllowGear struct {
// GearCategory represents gearcategory
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 10
// Examples: Commlinks, Cyberdecks, Custom (and 7 more)
// Enum Candidate: Ammunition, Commlinks, Common Programs, Custom, Cyberdecks, Drugs, Hacking Programs, Hard Nanoware, Sensors, Toxins
// Length: 5-16 characters
	GearCategory []string `xml:"gearcategory,omitempty" json:"gearcategory,omitempty"`
}

// AllowSubsystems represents allowed subsystems
type AllowSubsystems struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Commlinks, Commlinks, Commlinks (and 6 more)
	Category []string `xml:"category,omitempty" json:"category,omitempty"`
}

// IncludePair represents an include pair
type IncludePair struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name []string `xml:"name,omitempty" json:"name,omitempty"`
}

// BannedGrades represents banned grades
type BannedGrades struct {
	Grade []string `xml:"grade,omitempty" json:"grade,omitempty"`
}

// CyberwareSubsystem represents a subsystem within cyberware
type CyberwareSubsystem struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name string `xml:"name" json:"name"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2, 2 (and 1 more)
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
// Forced represents forced
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Locksmith, Pistols, Automatics (and 3 more)
// Enum Candidate: Automatics, Locksmith, Pistols, Unarmed Combat
// Length: 7-14 characters
	Forced *string `xml:"forced,omitempty" json:"forced,omitempty"`
	Subsystems *CyberwareSubsystems `xml:"subsystems,omitempty" json:"subsystems,omitempty"`
	Gears *common.Gears `xml:"gears,omitempty" json:"gears,omitempty"`
}

// BiowareSubsystem represents a bioware subsystem within cyberware subsystems
type BiowareSubsystem struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name string `xml:"name" json:"name"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2, 2 (and 1 more)
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
// Forced represents forced
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Locksmith, Pistols, Automatics (and 3 more)
// Enum Candidate: Automatics, Locksmith, Pistols, Unarmed Combat
// Length: 7-14 characters
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
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name CyberwareItemName `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2, 2 (and 1 more)
// Note: 100.0% of values are numeric strings
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Cyberwares *CyberwaresContainer `xml:"cyberwares,omitempty" json:"cyberwares,omitempty"`
}

// CyberwaresContainer represents a recursive cyberwares container
type CyberwaresContainer struct {
	Cyberware []CyberwareItem `xml:"cyberware" json:"cyberware"`
}

// Cyberware represents a cyberware definition
type Cyberware struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 362
// Examples: b57eadaa-7c3b-4b80-8d79-cbbd922c1196, 961eac53-0c43-4b19-8741-2872177a3a4c, 6b219dfa-310a-45ab-98af-40a62e2431cf (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Commlinks, Commlinks, Commlinks (and 6 more)
	Category string `xml:"category" json:"category"`
// Ess represents ess
// Type: numeric_string, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 54
// Examples: Rating * 0.01, Rating * -0.01, 0.2 (and 7 more)
// Note: 91.2% of values are numeric strings
// Length: 1-32 characters
	Ess string `xml:"ess" json:"ess"`
// Capacity represents capacity
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 35
// Examples: 0, 0, [2] (and 7 more)
// Enum Candidate: Yes
// Length: 1-12 characters
	Capacity string `xml:"capacity" json:"capacity"`
// Avail represents avail
// Type: mixed_numeric, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 65
// Examples: 0, 0, 0 (and 7 more)
// Length: 1-24 characters
	Avail string `xml:"avail" json:"avail"`
// Cost represents cost
// Type: mixed_numeric, mixed_boolean
// Usage: always present (100.0%)
// Unique Values: 122
// Examples: 0, 0, 2000 (and 7 more)
// Length: 1-63 characters
	Cost string `xml:"cost" json:"cost"`
	RequireParent string `xml:"requireparent" json:"requireparent"`
	common.SourceReference
// Limit represents limit
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Physical, Physical, Physical
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
	AddToParentCapacity *string `xml:"addtoparentcapacity,omitempty" json:"addtoparentcapacity,omitempty"`
// AddVehicle represents addvehicle
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: Ocular Drone, Remote Cyberhand
// Enum Candidate: Ocular Drone, Remote Cyberhand
// Length: 12-16 characters
	AddVehicle []string `xml:"addvehicle,omitempty" json:"addvehicle,omitempty"`
// AddWeapon represents addweapon
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 31
// Examples: Cyber Microgrenade Launcher, Hand Blade, Hand Razors (and 7 more)
// Enum Candidate: Yes
// Length: 5-31 characters
	AddWeapon []string `xml:"addweapon,omitempty" json:"addweapon,omitempty"`
	AllowGear *CyberwareAllowGear `xml:"allowgear,omitempty" json:"allowgear,omitempty"`
	AllowSubsystems *AllowSubsystems `xml:"allowsubsystems,omitempty" json:"allowsubsystems,omitempty"`
	IncludePair *IncludePair `xml:"includepair,omitempty" json:"includepair,omitempty"`
// Bonus represents bonus
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
// ForceGrade represents forcegrade
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: None, None, None (and 7 more)
// Enum Candidate: None, Standard
// Length: 4-8 characters
	ForceGrade *string `xml:"forcegrade,omitempty" json:"forcegrade,omitempty"`
	common.Visibility
// MountsTo represents mountsto
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: ankle, wrist, ankle (and 7 more)
// Enum Candidate: ankle, elbow, hip, knee, shoulder, wrist
// Length: 3-8 characters
	MountsTo *string `xml:"mountsto,omitempty" json:"mountsto,omitempty"`
// ModularMount represents modularmount
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: wrist, ankle, elbow (and 3 more)
// Enum Candidate: ankle, elbow, hip, knee, shoulder, wrist
// Length: 3-8 characters
	ModularMount *string `xml:"modularmount,omitempty" json:"modularmount,omitempty"`
// BlocksMounts represents blocksmounts
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: wrist,elbow,shoulder, ankle,knee,hip, ankle,knee,hip (and 7 more)
// Enum Candidate: ankle,knee,hip, ankle,knee,wrist,elbow,hip,shoulder, elbow, knee, elbow,shoulder, knee,hip, wrist,elbow,shoulder, wrist,elbow,shoulder,ankle,knee,hip
// Length: 8-35 characters
	BlocksMounts *string `xml:"blocksmounts,omitempty" json:"blocksmounts,omitempty"`
	AddToParentEss *string `xml:"addtoparentess,omitempty" json:"addtoparentess,omitempty"`
	BannedGrades *BannedGrades `xml:"bannedgrades,omitempty" json:"bannedgrades,omitempty"`
	InheritAttributes *string `xml:"inheritattributes,omitempty" json:"inheritattributes,omitempty"`
// LimbSlot represents limbslot
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: leg
	LimbSlot *string `xml:"limbslot,omitempty" json:"limbslot,omitempty"`
// LimbSlotCount represents limbslotcount
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: all, all, all
	LimbSlotCount *string `xml:"limbslotcount,omitempty" json:"limbslotcount,omitempty"`
	MinAgility *int `xml:"minagility,omitempty" json:"minagility,omitempty"`
	MinStrength *int `xml:"minstrength,omitempty" json:"minstrength,omitempty"`
// MinRating represents minrating
// Type: mixed_numeric, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: 1, 1, 1 (and 7 more)
// Enum Candidate: 1, {AGIMinimum}+1, {STRMinimum}+1
// Length: 1-14 characters
	MinRating *string `xml:"minrating,omitempty" json:"minrating,omitempty"`
// Notes represents notes
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Bone Lacing does not increase your BOD score, only tests for resisting damage., Bone Lacing does not increase your BOD score, only tests for resisting damage., Bone Lacing does not increase your BOD score, only tests for resisting damage.
	Notes *string `xml:"notes,omitempty" json:"notes,omitempty"`
// Rating represents rating
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2, 2, 2 (and 1 more)
// Note: 100.0% of values are numeric strings
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
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: Flare Compensation, Thermographic Vision, Low-Light Vision (and 7 more)
// Enum Candidate: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement
// Length: 9-20 characters
	Name string `xml:"name" json:"name"`
// Grade represents grade
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Greyware, Greyware (Adapsin), Greyware (and 7 more)
// Enum Candidate: Greyware, Greyware (Adapsin), Used, Used (Adapsin)
// Length: 4-18 characters
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

