package v5

// Reference represents a reference entry from Shadowrun 5th Edition
// These are typically page references to rules, sections, or content in sourcebooks
type Reference struct {
	ID     string `json:"id"`     // Unique identifier (UUID)
	Name   string `json:"name"`   // Reference name (e.g., "Another Night, Another Run")
	Source string `json:"source"` // Source book (e.g., "SR5")
	Page   string `json:"page"`   // Page number
}
