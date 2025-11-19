package v5

// DrugComponentGrade represents a drug component grade
type DrugComponentGrade struct {
	ID                 string  `json:"id"`                           // Unique identifier (UUID)
	Name               string  `json:"name"`                         // Grade name
	Cost               string  `json:"cost"`                         // Cost modifier
	Source             string  `json:"source"`                       // Source book
	AddictionThreshold *string `json:"addictionthreshold,omitempty"` // Addiction threshold modifier (optional)
}

// DrugComponentEffect represents an effect from a drug component
type DrugComponentEffect struct {
	Level     string      `json:"level,omitempty"`     // Effect level
	Attribute interface{} `json:"attribute,omitempty"` // Attribute bonuses (can be single or list)
	Quality   interface{} `json:"quality,omitempty"`   // Quality bonuses (can be complex)
	Limit     interface{} `json:"limit,omitempty"`     // Limit bonuses (can be single or list)
	Speed     string      `json:"speed,omitempty"`     // Speed modifier
	Duration  string      `json:"duration,omitempty"`  // Duration modifier
}

// DrugComponentEffects represents effects for a drug component
type DrugComponentEffects struct {
	Effect interface{} `json:"effect,omitempty"` // Can be single DrugComponentEffect or []DrugComponentEffect
}

// DrugComponent represents a drug component from Shadowrun 5th Edition
type DrugComponent struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Component name
	Category string `json:"category"` // Category (Foundation, Block, Enhancer)
	Source   string `json:"source"`   // Source book
	Page     string `json:"page"`     // Page number

	// Optional fields
	Effects      *DrugComponentEffects `json:"effects,omitempty"`      // Effects provided by this component
	Availability string                `json:"availability,omitempty"` // Availability modifier
	Cost         string                `json:"cost,omitempty"`         // Cost
	Rating       string                `json:"rating,omitempty"`       // Rating
	Threshold    string                `json:"threshold,omitempty"`    // Threshold
	Limit        string                `json:"limit,omitempty"`        // Limit
}

// DrugBonus represents bonuses for a drug (similar to other bonus structures)
type DrugBonus struct {
	Attribute      interface{} `json:"attribute,omitempty"`      // Attribute bonuses (can be single or list)
	Limit          interface{} `json:"limit,omitempty"`          // Limit bonuses (can be single or list)
	InitiativeDice string      `json:"initiativedice,omitempty"` // Initiative dice bonus
	Quality        interface{} `json:"quality,omitempty"`        // Quality bonuses (can be complex)
	SpecificSkill  interface{} `json:"specificskill,omitempty"`  // Specific skill bonuses (can be complex)
}

// Drug represents a drug from Shadowrun 5th Edition
type Drug struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Drug name
	Category string `json:"category"` // Category (usually "Drugs")
	Source   string `json:"source"`   // Source book
	Page     string `json:"page"`     // Page number

	// Optional fields
	Rating   string     `json:"rating,omitempty"`   // Rating
	Avail    string     `json:"avail,omitempty"`    // Availability
	Cost     string     `json:"cost,omitempty"`     // Cost
	Speed    string     `json:"speed,omitempty"`    // Speed (time to take effect)
	Vectors  string     `json:"vectors,omitempty"`  // Vectors (how it's taken)
	Duration string     `json:"duration,omitempty"` // Duration
	Bonus    *DrugBonus `json:"bonus,omitempty"`    // Bonuses provided by this drug
}
