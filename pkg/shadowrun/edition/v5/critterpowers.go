package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// CritterPowerCategory represents a critter power category
// Categories can be simple strings or objects with content and whitelist
type CritterPowerCategory struct {
	Content   string `json:"+content,omitempty"`    // Category name (when it's an object)
	Whitelist string `json:"+@whitelist,omitempty"` // Whether this is a whitelist category
}

// CritterPowerDefinitionBonus represents bonuses for a critter power definition
// Note: Many bonus types are reused from other packages (SelectSkill, SelectTextBonus, etc.)
type CritterPowerDefinitionBonus struct {
	SelectSkill  *common.SelectSkill     `json:"selectskill,omitempty"`  // Selectable skill bonus
	SelectText   *common.SelectTextBonus `json:"selecttext,omitempty"`   // Selectable text bonus
	UnlockSkills interface{}      `json:"unlockskills,omitempty"` // Unlock skills (can be complex)
	// Add other bonus types as needed
}

// CritterPowerDefinition represents a critter power definition from Shadowrun 5th Edition
// Note: This is different from CritterPower in critters.go, which represents a power instance on a critter
type CritterPowerDefinition struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Power name
	Category string `json:"category"` // Category like "Paranormal", "Mundane", etc.
	Source   string `json:"source"`   // Source book like "SR5", "SG", etc.
	Page     string `json:"page"`     // Page number

	// Optional fields (can be null in JSON)
	Type     *string                      `json:"type,omitempty"`     // Type like "P", "M", etc.
	Action   *string                      `json:"action,omitempty"`   // Action type like "Simple", "Complex", "Auto", etc.
	Range    *string                      `json:"range,omitempty"`    // Range like "LOS", "Self", "MAG × 50", etc.
	Duration *string                      `json:"duration,omitempty"` // Duration like "Always", "Instant", "Sustained", etc.
	Karma    *string                      `json:"karma,omitempty"`    // Karma cost
	Toxic    *string                      `json:"toxic,omitempty"`    // Toxic flag (usually "True")
	Bonus    *CritterPowerDefinitionBonus `json:"bonus,omitempty"`    // Bonuses provided by this power
	Hide     *string                      `json:"hide,omitempty"`     // Whether to hide this power
}
