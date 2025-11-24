package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains tip structures generated from tips.xml

// Tip represents a tip definition
type Tip struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 16
// Examples: 528f605f-9994-46b5-8583-cafe006507e4, ccaae7df-40ba-4da9-837e-c0df92f07038, ff26b01d-1aa4-45ac-8685-0d199e115d1f (and 7 more)
// Enum Candidate: Yes
	ID string `xml:"id" json:"id"`
	Text string `xml:"text" json:"text"`
	ChargenOnly *bool `xml:"chargenonly,omitempty" json:"chargenonly,omitempty"`
	CareerOnly *bool `xml:"careeronly,omitempty" json:"careeronly,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
}

// Tips represents a collection of tips
type Tips struct {
	Tip []Tip `xml:"tip" json:"tip"`
}

// TipsChummer represents the root chummer element for tips
type TipsChummer struct {
	Tips Tips `xml:"tips" json:"tips"`
}

