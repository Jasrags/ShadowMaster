package v5

// StreamTraditionSpirits represents the spirits available to a stream tradition
type StreamTraditionSpirits struct {
	Spirit interface{} `json:"spirit,omitempty"` // Can be string or []string
}

// StreamTradition represents a stream tradition (technomancer tradition)
type StreamTradition struct {
	ID      string                  `json:"id"`                // Unique identifier (UUID)
	Name    string                  `json:"name"`              // Tradition name
	Drain   string                  `json:"drain"`             // Drain formula (e.g., "{WIL} + {RES}")
	Spirits *StreamTraditionSpirits `json:"spirits,omitempty"` // Available spirits
	Source  string                  `json:"source"`            // Source book
	Page    string                  `json:"page"`              // Page number
}

// StreamSpiritPowers represents powers for a stream spirit
type StreamSpiritPowers struct {
	Power interface{} `json:"power,omitempty"` // Can be string or []string
}

// StreamSpiritOptionalPowers represents optional powers for a stream spirit
type StreamSpiritOptionalPowers struct {
	Power interface{} `json:"power,omitempty"` // Can be string or []string
}

// StreamSpiritSkills represents skills for a stream spirit
type StreamSpiritSkills struct {
	Skill interface{} `json:"skill,omitempty"` // Can be string or []string
}

// StreamSpirit represents a stream spirit (sprite) from Shadowrun 5th Edition
type StreamSpirit struct {
	ID             string                      `json:"id"`                       // Unique identifier (UUID)
	Name           string                      `json:"name"`                     // Spirit name
	Page           string                      `json:"page"`                     // Page number
	Source         string                      `json:"source"`                   // Source book
	BOD            string                      `json:"bod"`                      // Body attribute
	AGI            string                      `json:"agi"`                      // Agility attribute
	REA            string                      `json:"rea"`                      // Reaction attribute
	STR            string                      `json:"str"`                      // Strength attribute
	CHA            string                      `json:"cha"`                      // Charisma attribute
	INT            string                      `json:"int"`                      // Intuition attribute
	LOG            string                      `json:"log"`                      // Logic attribute
	WIL            string                      `json:"wil"`                      // Willpower attribute
	INI            string                      `json:"ini"`                      // Initiative formula
	Powers         *StreamSpiritPowers         `json:"powers,omitempty"`         // Powers
	OptionalPowers *StreamSpiritOptionalPowers `json:"optionalpowers,omitempty"` // Optional powers
	Skills         *StreamSpiritSkills         `json:"skills,omitempty"`         // Skills
}
