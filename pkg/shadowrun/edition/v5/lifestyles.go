package v5

// FreeGrid represents a free grid subscription
type FreeGrid struct {
	Content string `json:"+content,omitempty"` // Content like "Grid Subscription"
	Select  string `json:"+@select,omitempty"` // Selection like "Public Grid", "Local Grid", "Global Grid"
}

// FreeGrids represents a collection of free grids
type FreeGrids struct {
	FreeGrid interface{} `json:"freegrid,omitempty"` // Can be single FreeGrid or []FreeGrid
}

// Lifestyle represents a lifestyle from Shadowrun 5th Edition
type Lifestyle struct {
	// Required fields
	ID         string `json:"id"`         // Unique identifier (UUID)
	Name       string `json:"name"`       // Lifestyle name
	Cost       string `json:"cost"`       // Base cost
	Dice       string `json:"dice"`       // Dice pool
	LP         string `json:"lp"`         // Lifestyle points
	Multiplier string `json:"multiplier"` // Cost multiplier
	Source     string `json:"source"`     // Source book like "SR5", "RF", etc.
	Page       string `json:"page"`       // Page number

	// Optional fields
	Hide            *string    `json:"hide,omitempty"`            // Whether to hide this lifestyle
	FreeGrids       *FreeGrids `json:"freegrids,omitempty"`       // Free grid subscriptions
	CostForArea     string     `json:"costforarea,omitempty"`     // Cost for area
	CostForComforts string     `json:"costforcomforts,omitempty"` // Cost for comforts
	CostForSecurity string     `json:"costforsecurity,omitempty"` // Cost for security
	Increment       string     `json:"increment,omitempty"`       // Time increment like "day"
	AllowBonusLP    string     `json:"allowbonuslp,omitempty"`    // Whether to allow bonus LP
}

// Comfort represents a lifestyle comfort option
type Comfort struct {
	Name    string `json:"name"`    // Comfort name
	Minimum string `json:"minimum"` // Minimum rating
	Limit   string `json:"limit"`   // Maximum rating
}

// Neighborhood represents a lifestyle neighborhood option
type Neighborhood struct {
	Name    string `json:"name"`    // Neighborhood name
	Minimum string `json:"minimum"` // Minimum rating
	Limit   string `json:"limit"`   // Maximum rating
}

// Security represents a lifestyle security option
type Security struct {
	Name    string `json:"name"`    // Security name
	Minimum string `json:"minimum"` // Minimum rating
	Limit   string `json:"limit"`   // Maximum rating
}

// LifestyleQuality represents a lifestyle quality
type LifestyleQuality struct {
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Quality name
	Category string `json:"category"` // Category like "Entertainment - Asset", etc.
	LP       string `json:"lp"`       // Lifestyle points cost
	Cost     string `json:"cost"`     // Cost
	Allowed  string `json:"allowed"`  // Allowed lifestyles (comma-separated)
	Source   string `json:"source"`   // Source book
	Page     string `json:"page"`     // Page number
}

// City represents a city for lifestyles
type City struct {
	Name   string `json:"name"`   // City name
	Source string `json:"source"` // Source book (empty for now, cities have district instead)
	Page   string `json:"page"`   // Page number (empty for now)
}
