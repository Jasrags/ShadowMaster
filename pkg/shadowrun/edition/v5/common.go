package v5

// SourceReference provides source book and page information
type SourceReference struct {
	Source string `json:"source,omitempty"`
	Page   string `json:"page,omitempty"`
}

// WirelessBonus represents wireless-enabled functionality
type WirelessBonus struct {
	// Description describes the wireless bonus effect
	Description string `json:"description,omitempty"`
	// ActionChange describes if an action type changes (e.g., "Free Action instead of Simple Action")
	ActionChange string `json:"action_change,omitempty"`
	// DicePoolBonus is a dice pool bonus provided
	DicePoolBonus int `json:"dice_pool_bonus,omitempty"`
	// LimitBonus is a limit bonus provided
	LimitBonus int `json:"limit_bonus,omitempty"`
	// SkillSubstitution describes if a skill can be substituted (e.g., "substitute Rating for Electronic Warfare skill")
	SkillSubstitution string `json:"skill_substitution,omitempty"`
	// RatingBonus is a rating bonus provided
	RatingBonus int `json:"rating_bonus,omitempty"`
	// RangeChange describes range changes (e.g., "range becomes worldwide", "effective radius is tripled")
	RangeChange string `json:"range_change,omitempty"`
	// OtherEffects describes any other wireless effects
	OtherEffects string `json:"other_effects,omitempty"`
}

