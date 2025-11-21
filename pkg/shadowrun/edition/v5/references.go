package v5

// This file contains reference structures generated from references.xsd

// Rule represents a reference rule
type Rule struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Source string `xml:"source" json:"source"`
	Page uint16 `xml:"page" json:"page"`
}

// Rules represents a collection of reference rules
type Rules struct {
	Rule []Rule `xml:"rule" json:"rule"`
}

// ReferencesChummer represents the root chummer element for references
type ReferencesChummer struct {
	Rules Rules `xml:"rules" json:"rules"`
}

