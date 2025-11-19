package v5

// TipRequired represents requirements for a tip
// Note: This is a complex structure that can have allof, oneof, grouponeof, and various nested conditions
type TipRequired struct {
	AllOf      interface{} `json:"allof,omitempty"`      // All-of requirement (can be complex)
	OneOf      interface{} `json:"oneof,omitempty"`      // One-of requirement (can be complex)
	GroupOneOf interface{} `json:"grouponeof,omitempty"` // Group one-of requirement (can be complex)
}

// TipForbidden represents forbidden conditions for a tip
// Note: This is a complex structure that can have allof, oneof, and various nested conditions
type TipForbidden struct {
	AllOf interface{} `json:"allof,omitempty"` // All-of forbidden (can be complex)
	OneOf interface{} `json:"oneof,omitempty"` // One-of forbidden (can be complex)
}

// Tip represents a character creation tip from Shadowrun 5th Edition
type Tip struct {
	ID          string        `json:"id"`                    // Unique identifier (UUID)
	Text        string        `json:"text"`                  // Tip text
	ChargenOnly *string       `json:"chargenonly,omitempty"` // Whether only available at character creation
	CareerOnly  *string       `json:"careeronly,omitempty"`  // Whether only available during career
	Required    *TipRequired  `json:"required,omitempty"`    // Requirements for this tip
	Forbidden   *TipForbidden `json:"forbidden,omitempty"`   // Forbidden conditions for this tip
}
