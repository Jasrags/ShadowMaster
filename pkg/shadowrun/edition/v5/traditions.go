package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// TraditionSpirits represents the spirit types for a tradition
type TraditionSpirits struct {
	SpiritCombat        string `json:"spiritcombat,omitempty"`        // Spirit for combat
	SpiritDetection     string `json:"spiritdetection,omitempty"`     // Spirit for detection
	SpiritHealth        string `json:"spirithealth,omitempty"`        // Spirit for health
	SpiritIllusion      string `json:"spiritillusion,omitempty"`      // Spirit for illusion
	SpiritManipulation  string `json:"spiritmanipulation,omitempty"`  // Spirit for manipulation
}

// TraditionBonus represents bonuses for a tradition
// Note: Reuses AddQualities from common package
type TraditionBonus struct {
	AddQualities *common.AddQualities `json:"addqualities,omitempty"` // Qualities to add
}

// Tradition represents a magic tradition from Shadowrun 5th Edition
type Tradition struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Tradition name
	Source   string `json:"source"`   // Source book like "SR5", "SG", "FA", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields (can be null in JSON)
	Drain     *string          `json:"drain,omitempty"`     // Drain attribute formula like "{WIL} + {LOG}"
	Spirits   *TraditionSpirits `json:"spirits,omitempty"`   // Spirit types for this tradition
	SpiritForm *string          `json:"spiritform,omitempty"` // Spirit form like "Possession"
	Bonus     *TraditionBonus   `json:"bonus,omitempty"`     // Bonuses provided by this tradition
}

// DrainAttribute represents a drain attribute formula
type DrainAttribute struct {
	ID   string `json:"id"`   // Unique identifier (UUID)
	Name string `json:"name"` // Formula like "{WIL} + {LOG}"
}

