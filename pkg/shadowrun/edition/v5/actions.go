package v5

// This file contains action structures generated from actions.xml

// ActionTest represents a test for an action
// This structure is used when an action has a test element
type ActionTest struct {
	// Dice represents dice - required when test element is present
	// Usage: always present when test element exists (100.0%)
	// Unique Values: 143
	// Examples: {REA} + {INT} + {Improvement Value: Dodge}, None, Variable
	// Length: 4-216 characters
	Dice string `xml:"dice" json:"dice"`

	// Limit represents limit - optional
	// Examples: {Weapon: Accuracy}, {Physical}, {Astral}
	Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`

	// BonusString represents bonusstring - optional descriptive text
	// Examples: "On success, target must resist...", "Activate a focus..."
	BonusString *string `xml:"bonusstring,omitempty" json:"bonusstring,omitempty"`

	// DefenseLimit represents defenselimit - optional
	// Examples: {Mental}, {Max: {Physical} or {Mental}}
	DefenseLimit *string `xml:"defenselimit,omitempty" json:"defenselimit,omitempty"`
}

// ActionBoost represents a single boost within a boosts element
// Used for defensive/interrupt actions that modify other actions
type ActionBoost struct {
	// Name represents the name of the action being boosted
	// Examples: "Melee Defense", "Ranged Defense", "LOG Attack Defense"
	Name string `xml:"name" json:"name"`

	// Duration represents how long the boost lasts
	// Examples: "One Attack", "Rest of Turn"
	Duration string `xml:"duration" json:"duration"`

	// DiceBonus represents the dice bonus formula
	// Examples: "{Unarmed Combat}", "{Gymnastics}", "{WIL}"
	DiceBonus string `xml:"dicebonus" json:"dicebonus"`

	// AddLimit represents an additional limit - optional
	// Examples: "{Physical}", "{Weapon: Accuracy}"
	AddLimit *string `xml:"addlimit,omitempty" json:"addlimit,omitempty"`
}

// ActionBoosts represents a collection of boosts
type ActionBoosts struct {
	Boost []ActionBoost `xml:"boost" json:"boost"`
}

// Action represents an action definition
type Action struct {
	// ID represents id - required
	ID string `xml:"id" json:"id"`

	// Name represents name - required
	Name string `xml:"name" json:"name"`

	// Type represents type - required
	// Examples: "No", "Free", "Simple", "Complex", "Interrupt", "Extended"
	Type string `xml:"type" json:"type"`

	// Category represents category - optional
	// Examples: "Matrix"
	Category *string `xml:"category,omitempty" json:"category,omitempty"`

	// SpecName represents specname - optional specialization name
	// Examples: "Blocking", "Dodging", "Parrying", "Sprinting"
	SpecName *string `xml:"specname,omitempty" json:"specname,omitempty"`

	// InitiativeCost represents initiativecost - optional
	// Used for interrupt actions
	InitiativeCost *int `xml:"initiativecost,omitempty" json:"initiativecost,omitempty"`

	// EdgeCost represents edgecost - optional
	// Used for actions that cost edge points
	EdgeCost *int `xml:"edgecost,omitempty" json:"edgecost,omitempty"`

	// RequireUnlock represents requireunlock - optional empty element
	// Indicates the action requires an unlock (martial arts technique, etc.)
	// Empty element: <requireunlock /> - presence indicates true
	RequireUnlock *string `xml:"requireunlock,omitempty" json:"requireunlock,omitempty"`

	// Test represents test element - optional (mutually exclusive with Boosts)
	// Used for actions that have dice tests
	Test *ActionTest `xml:"test,omitempty" json:"test,omitempty"`

	// Boosts represents boosts element - optional (mutually exclusive with Test)
	// Used for defensive/interrupt actions that modify other actions
	Boosts *ActionBoosts `xml:"boosts,omitempty" json:"boosts,omitempty"`

	// Source represents source book - required
	Source string `xml:"source" json:"source"`

	// Page represents page reference - required
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
	// Version represents version - required
	// Type: numeric_string, boolean_string
	// Usage: always present (100.0%)
	// Unique Values: 1
	// Examples: 0
	// Note: 100.0% of values are numeric strings
	// Note: 100.0% of values are boolean strings
	Version string  `xml:"version" json:"version"`
	Actions Actions `xml:"actions" json:"actions"`
}
