package v5

// ImprovementFields represents the fields for an improvement
type ImprovementFields struct {
	Field interface{} `json:"field,omitempty"` // Can be a single string or []string
}

// Improvement represents an improvement definition from Shadowrun 5th Edition
type Improvement struct {
	// Required fields
	Name     string             `json:"name"`     // Improvement name
	ID       string             `json:"id"`       // Unique identifier
	Internal string             `json:"internal"` // Internal identifier
	Page     string             `json:"page"`     // Description/help text

	// Optional fields
	Fields *ImprovementFields `json:"fields,omitempty"` // Fields required for this improvement
	XML    *string            `json:"xml,omitempty"`    // XML template (can be null)
}

