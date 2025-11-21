package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains power structures generated from powers.xsd

// PowerIncludeInLimit represents include in limit for powers
type PowerIncludeInLimit struct {
	Name []string `xml:"name,omitempty" json:"name,omitempty"`
}

// AdeptWayRequires represents adept way requirements
type AdeptWayRequires struct {
	MagiciansWayForbids *string `xml:"magicianswayforbids,omitempty" json:"magicianswayforbids,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// PowerItem represents a power definition
type PowerItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Points float64 `xml:"points" json:"points"`
	Levels string `xml:"levels" json:"levels"`
	Limit int `xml:"limit" json:"limit"`
	Source string `xml:"source" json:"source"`
	Page int `xml:"page" json:"page"`
	common.Visibility
	IncludeInLimit *PowerIncludeInLimit `xml:"includeinlimit,omitempty" json:"includeinlimit,omitempty"`
	Action *string `xml:"action,omitempty" json:"action,omitempty"`
	AdeptWay *float64 `xml:"adeptway,omitempty" json:"adeptway,omitempty"`
	AdeptWayRequires *AdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	DoubleCost *string `xml:"doublecost,omitempty" json:"doublecost,omitempty"`
	ExtraPointCost *float64 `xml:"extrapointcost,omitempty" json:"extrapointcost,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	MaxLevels *int `xml:"maxlevels,omitempty" json:"maxlevels,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// PowerItems represents a collection of powers
type PowerItems struct {
	Power []PowerItem `xml:"power" json:"power"`
}

// EnhancementAdeptWayRequires represents adept way requirements for enhancements
type EnhancementAdeptWayRequires struct {
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Enhancement represents an enhancement definition
type Enhancement struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Power string `xml:"power" json:"power"`
	Source string `xml:"source" json:"source"`
	Page int `xml:"page" json:"page"`
	common.Visibility
	AdeptWayRequires *EnhancementAdeptWayRequires `xml:"adeptwayrequires,omitempty" json:"adeptwayrequires,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
}

// Enhancements represents a collection of enhancements
type Enhancements struct {
	Enhancement []Enhancement `xml:"enhancement" json:"enhancement"`
}

// PowersChummer represents the root chummer element for powers
type PowersChummer struct {
	Version int `xml:"version" json:"version"`
	Powers PowerItems `xml:"powers" json:"powers"`
	Enhancements Enhancements `xml:"enhancements" json:"enhancements"`
}

