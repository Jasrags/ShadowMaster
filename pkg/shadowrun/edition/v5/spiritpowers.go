package v5

// SpiritPower represents a spirit power from Shadowrun 5th Edition
type SpiritPower struct {
	// Required fields
	Name   string `json:"name"`   // Power name
	Source string `json:"source"` // Source book like "SR5", "SG", "KC", etc.
	Page   string `json:"page"`   // Page number
}

