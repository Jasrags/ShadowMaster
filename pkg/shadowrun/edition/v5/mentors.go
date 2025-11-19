package v5

// MentorChoice represents a choice option for a mentor
type MentorChoice struct {
	Name   string      `json:"name"`   // Choice name/description
	Set    string      `json:"+@set,omitempty"`    // Set value (optional)
	Bonus  interface{} `json:"bonus,omitempty"`    // Bonus (can be complex structure)
}

// MentorChoices represents a collection of choices for a mentor
type MentorChoices struct {
	Choice interface{} `json:"choice,omitempty"` // Can be single MentorChoice or []MentorChoice
}

// MentorBonus represents bonuses for a mentor
// Note: Many bonus types are reused from other packages
type MentorBonus struct {
	DamageResistance string      `json:"damageresistance,omitempty"` // Damage resistance bonus
	SelectSkill      *SelectSkill `json:"selectskill,omitempty"`      // Selectable skill bonus
	SpecificSkill    interface{} `json:"specificskill,omitempty"`     // Specific skill bonus (can be complex)
	AddQualities     interface{} `json:"addqualities,omitempty"`      // Add qualities (can be complex)
	// Add other bonus types as needed
}

// Mentor represents a mentor spirit from Shadowrun 5th Edition
type Mentor struct {
	// Required fields
	ID          string `json:"id"`          // Unique identifier (UUID)
	Name        string `json:"name"`        // Mentor name
	Advantage   string `json:"advantage"`   // Advantage description
	Disadvantage string `json:"disadvantage"` // Disadvantage description
	Source      string `json:"source"`      // Source book like "SR5", etc.
	Page        string `json:"page"`        // Page number

	// Optional fields
	Bonus   *MentorBonus   `json:"bonus,omitempty"`   // Bonuses provided by this mentor
	Choices *MentorChoices `json:"choices,omitempty"` // Choices available for this mentor
}

