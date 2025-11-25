package v5

// ProgramType represents the category of Matrix program
type ProgramType string

const (
	ProgramTypeAgent         ProgramType = "agent"
	ProgramTypeCommlinkApp   ProgramType = "commlink_app"
	ProgramTypeCommon        ProgramType = "common"
	ProgramTypeHacking       ProgramType = "hacking"
)

// AgentRatingRange represents the rating range for agents
type AgentRatingRange struct {
	// MinRating is the minimum rating
	MinRating int `json:"min_rating,omitempty"`
	// MaxRating is the maximum rating
	MaxRating int `json:"max_rating,omitempty"`
}

// AgentCostFormula represents how agent cost is calculated
type AgentCostFormula struct {
	// CostPerRating is the cost per rating point (e.g., 1000¥ for rating 1-3, 2000¥ for rating 4-6)
	CostPerRating int `json:"cost_per_rating,omitempty"`
	// Formula describes the cost formula as text (e.g., "Rating × 1000¥")
	Formula string `json:"formula,omitempty"`
}

// AgentAvailabilityFormula represents how agent availability is calculated
type AgentAvailabilityFormula struct {
	// AvailabilityPerRating is the availability per rating point (e.g., Rating × 3)
	AvailabilityPerRating int `json:"availability_per_rating,omitempty"`
	// Formula describes the availability formula as text (e.g., "Rating × 3")
	Formula string `json:"formula,omitempty"`
}

// ProgramEffect represents the mechanical effect of a program
type ProgramEffect struct {
	// Action describes the Matrix action affected (e.g., "Format Device", "Matrix Search Action")
	Action string `json:"action,omitempty"`
	// Effect describes the effect (e.g., "Halve Time", "+2 to Attack attribute")
	Effect string `json:"effect,omitempty"`
	// AttributeBonus describes attribute bonuses (e.g., "+2 to Sleaze", "+1 to Firewall")
	AttributeBonus string `json:"attribute_bonus,omitempty"`
	// DicePoolBonus describes dice pool bonuses (e.g., "+2 dice pool modifier")
	DicePoolBonus string `json:"dice_pool_bonus,omitempty"`
	// DamageBonus describes damage bonuses (e.g., "+2 DV Matrix Damage", "+1 DV per mark")
	DamageBonus string `json:"damage_bonus,omitempty"`
	// OtherEffects describes other effects
	OtherEffects string `json:"other_effects,omitempty"`
}

// Program represents a Matrix program definition
type Program struct {
	// Name is the program name (e.g., "Bootstrap", "Armor", "Agent")
	Name string `json:"name,omitempty"`
	// Type indicates the category of program
	Type ProgramType `json:"type,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// RatingRange is the rating range for agents (1-3, 4-6, etc.)
	RatingRange *AgentRatingRange `json:"rating_range,omitempty"`
	// Availability describes availability for agents
	Availability *AgentAvailabilityFormula `json:"availability,omitempty"`
	// Cost describes the cost for agents
	Cost *AgentCostFormula `json:"cost,omitempty"`
	// ActionEffect describes the action/effect for common and hacking programs
	ActionEffect string `json:"action_effect,omitempty"`
	// Effects describes the mechanical effects of the program
	Effects []ProgramEffect `json:"effects,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// ProgramData represents the complete program data structure organized by category
type ProgramData struct {
	Agents       []Program `json:"agents,omitempty"`
	CommlinkApps []Program `json:"commlink_apps,omitempty"`
	Common       []Program `json:"common,omitempty"`
	Hacking      []Program `json:"hacking,omitempty"`
}

// dataPrograms contains all Matrix program definitions
// This is populated in programs_data.go

// GetAllPrograms returns all Matrix programs
func GetAllPrograms() []Program {
	programs := make([]Program, 0, len(dataPrograms))
	for _, p := range dataPrograms {
		programs = append(programs, p)
	}
	return programs
}

// GetProgramData returns the complete program data structure organized by category
func GetProgramData() ProgramData {
	data := ProgramData{
		Agents:       []Program{},
		CommlinkApps: []Program{},
		Common:       []Program{},
		Hacking:      []Program{},
	}

	for _, program := range dataPrograms {
		switch program.Type {
		case ProgramTypeAgent:
			data.Agents = append(data.Agents, program)
		case ProgramTypeCommlinkApp:
			data.CommlinkApps = append(data.CommlinkApps, program)
		case ProgramTypeCommon:
			data.Common = append(data.Common, program)
		case ProgramTypeHacking:
			data.Hacking = append(data.Hacking, program)
		}
	}

	return data
}

// GetProgramByName returns the program definition with the given name, or nil if not found
func GetProgramByName(name string) *Program {
	for _, program := range dataPrograms {
		if program.Name == name {
			return &program
		}
	}
	return nil
}

// GetProgramByKey returns the program definition with the given key, or nil if not found
func GetProgramByKey(key string) *Program {
	program, ok := dataPrograms[key]
	if !ok {
		return nil
	}
	return &program
}

// GetProgramsByType returns all programs in the specified type
func GetProgramsByType(programType ProgramType) []Program {
	programs := make([]Program, 0)
	for _, p := range dataPrograms {
		if p.Type == programType {
			programs = append(programs, p)
		}
	}
	return programs
}

