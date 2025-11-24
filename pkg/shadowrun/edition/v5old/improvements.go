package v5

// This file contains improvement structures generated from improvements.xml

// ImprovementFields represents a collection of field names for an improvement
type ImprovementFields struct {
	Field []string `xml:"field" json:"field"`
}

// ImprovementItem represents an improvement definition
type ImprovementItem struct {
	Name string `xml:"name" json:"name"`
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 85
// Examples: enableattribute, specificattribute, replaceattribute (and 7 more)
// Length: 5-27 characters
	ID string `xml:"id" json:"id"`
	Internal string `xml:"internal" json:"internal"`
	Fields *ImprovementFields `xml:"fields,omitempty" json:"fields,omitempty"`
	XML *string `xml:"xml,omitempty" json:"xml,omitempty"`
	Page string `xml:"page" json:"page"`
}

// ImprovementItems represents a collection of improvements
type ImprovementItems struct {
	Improvement []ImprovementItem `xml:"improvement" json:"improvement"`
}

// ImprovementsChummer represents the root chummer element for improvements
type ImprovementsChummer struct {
	Improvements ImprovementItems `xml:"improvements" json:"improvements"`
}

