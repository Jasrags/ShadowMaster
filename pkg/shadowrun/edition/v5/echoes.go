package v5

// EchoBonus represents bonuses for an echo
// Note: Many bonus types are reused from other packages or can be complex structures
type EchoBonus struct {
	LivingPersona           interface{} `json:"livingpersona,omitempty"`           // Living persona bonuses (can be complex)
	MatrixInitiativeDiceAdd string      `json:"matrixinitiativediceadd,omitempty"` // Matrix initiative dice bonus
	SelectText              interface{} `json:"selecttext,omitempty"`              // Selectable text bonus (can be complex)
	LimitModifier           interface{} `json:"limitmodifier,omitempty"`           // Limit modifier (can be complex)
	SpecificAttribute       interface{} `json:"specificattribute,omitempty"`       // Specific attribute bonus (can be complex)
	InitiativePass          string      `json:"initiativepass,omitempty"`          // Initiative pass bonus
	PenaltyFreeSustain      interface{} `json:"penaltyfreesustain,omitempty"`      // Penalty-free sustain (can be complex)
}

// Echo represents a technomancer echo from Shadowrun 5th Edition
type Echo struct {
	// Required fields
	ID     string `json:"id"`     // Unique identifier (UUID)
	Name   string `json:"name"`   // Echo name
	Source string `json:"source"` // Source book like "SR5", "DT", "KC", etc.
	Page   string `json:"page"`   // Page number

	// Optional fields
	Bonus *EchoBonus `json:"bonus,omitempty"` // Bonuses provided by this echo
	Limit string     `json:"limit,omitempty"` // Limit like "2", "3", "False", etc.
	Hide  *bool      `json:"hide,omitempty"`  // Whether to hide this echo
}
