package v5

// This file contains reference structures generated from references.xsd

// Rule represents a reference rule
type Rule struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 921
// Examples: 72B79189-AB4F-4D90-A701-0F35606DE541, 2BA1D635-A856-48F0-B533-A6792B3BF094, 7ED94B84-A981-45B1-B029-180098151271 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 866
// Examples: Another Night, Another Run, Introduction, The Battle Fought (and 7 more)
// Length: 3-52 characters
	Name string `xml:"name" json:"name"`
// Source represents source
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SR5, SR5, SR5 (and 7 more)
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 274
// Examples: 8, 14, 16 (and 7 more)
// Note: 100.0% of values are numeric strings
// Length: 1-3 characters
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

