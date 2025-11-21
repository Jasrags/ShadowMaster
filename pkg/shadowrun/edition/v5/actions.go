package v5

// This file contains action structures generated from actions.xml

// ActionTest represents a test for an action
type ActionTest struct {
// Dice represents dice
// Usage: always present (100.0%)
// Unique Values: 143
// Examples: {REA} + {INT} + {Improvement Value: Dodge}, {REA} + {INT} + {Improvement Value: Dodge}, {REA} + {EDG} (and 7 more)
// Length: 4-216 characters
	Dice string `xml:"dice" json:"dice"`
}

// Action represents an action definition
type Action struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Type string `xml:"type" json:"type"`
	Test ActionTest `xml:"test" json:"test"`
	Source string `xml:"source" json:"source"`
// Page represents page
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 46
// Examples: 168, 186, 179 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: Yes
// Length: 2-3 characters
	Page string `xml:"page" json:"page"`
}

// Actions represents a collection of actions
type Actions struct {
	Action []Action `xml:"action" json:"action"`
}

// ActionsChummer represents the root chummer element for actions
type ActionsChummer struct {
// Version represents version
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 0
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Version string `xml:"version" json:"version"`
	Actions Actions `xml:"actions" json:"actions"`
}

