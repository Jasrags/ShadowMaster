package v5

// Program represents a matrix program from Shadowrun 5th Edition
type Program struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Program name
	Category string `json:"category"` // Category like "Common Programs", "Hacking Programs", etc.
	Avail    string `json:"avail"`    // Availability like "0", "4R", etc.
	Cost     string `json:"cost"`     // Cost like "80", "250", etc.
	Source   string `json:"source"`   // Source book like "SR5", etc.
	Page     string `json:"page"`     // Page number
}

