package v5

import (
	"errors"
	"fmt"
)

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

// AgentCostFormula represents how agent cost is calculated.
// This is a specialized formula type for agent costs in nuyen, similar to CostFormula
// but simplified for the agent rating-based cost structure.
//
// Usage:
//   Fixed cost per rating:
//     AgentCostFormula{CostPerRating: 1000, Formula: "Rating × 1000¥"}
//
// Methods:
//   Calculate(rating int) - calculates the cost for a given rating
//   RequiresRating() - checks if formula requires a rating
//   IsValid() - validates the formula structure
type AgentCostFormula struct {
	// CostPerRating is the cost per rating point (e.g., 1000¥ for rating 1-3, 2000¥ for rating 4-6)
	CostPerRating int `json:"cost_per_rating,omitempty"`
	// Formula describes the cost formula as text (e.g., "Rating × 1000¥")
	Formula string `json:"formula,omitempty"`
}

// RequiresRating returns true if the agent cost formula requires a rating to calculate.
func (acf *AgentCostFormula) RequiresRating() bool {
	if acf.CostPerRating > 0 {
		return true
	}
	if acf.Formula != "" {
		calc := NewFormulaCalculator()
		return calc.RequiresRating(acf.Formula)
	}
	return false
}

// Calculate calculates the cost for a given rating.
// Returns the calculated cost and any error.
func (acf *AgentCostFormula) Calculate(rating int) (int, error) {
	if rating < 0 {
		return 0, errors.New("rating cannot be negative")
	}
	if acf.CostPerRating > 0 {
		return acf.CostPerRating * rating, nil
	}
	if acf.Formula != "" {
		// Try to parse formula if structured field not present
		calc := NewFormulaCalculator()
		cost, err := calc.EvaluateFormula(acf.Formula, map[string]interface{}{"Rating": rating})
		if err != nil {
			return 0, fmt.Errorf("could not evaluate formula %s: %w", acf.Formula, err)
		}
		return int(cost), nil
	}
	return 0, errors.New("no cost formula specified")
}

// IsValid validates that the agent cost formula is well-formed.
func (acf *AgentCostFormula) IsValid() error {
	if acf.CostPerRating < 0 {
		return errors.New("cost per rating cannot be negative")
	}
	if acf.CostPerRating == 0 && acf.Formula == "" {
		return errors.New("agent cost formula must specify either CostPerRating or Formula")
	}
	return nil
}

// AgentAvailabilityFormula represents how agent availability is calculated.
// This is a specialized formula type for agent availability, similar to RatingFormula
// but simplified for the agent rating-based availability structure.
//
// Usage:
//   Availability per rating:
//     AgentAvailabilityFormula{AvailabilityPerRating: 3, Formula: "Rating × 3"}
//
// Methods:
//   Calculate(rating int) - calculates the availability for a given rating
//   RequiresRating() - checks if formula requires a rating
//   IsValid() - validates the formula structure
type AgentAvailabilityFormula struct {
	// AvailabilityPerRating is the availability per rating point (e.g., Rating × 3)
	AvailabilityPerRating int `json:"availability_per_rating,omitempty"`
	// Formula describes the availability formula as text (e.g., "Rating × 3")
	Formula string `json:"formula,omitempty"`
}

// RequiresRating returns true if the availability formula requires a rating to calculate.
func (aaf *AgentAvailabilityFormula) RequiresRating() bool {
	if aaf.AvailabilityPerRating > 0 {
		return true
	}
	if aaf.Formula != "" {
		calc := NewFormulaCalculator()
		return calc.RequiresRating(aaf.Formula)
	}
	return false
}

// Calculate calculates the availability for a given rating.
// Returns the calculated availability and any error.
func (aaf *AgentAvailabilityFormula) Calculate(rating int) (int, error) {
	if rating < 0 {
		return 0, errors.New("rating cannot be negative")
	}
	if aaf.AvailabilityPerRating > 0 {
		return aaf.AvailabilityPerRating * rating, nil
	}
	if aaf.Formula != "" {
		// Try to parse formula if structured field not present
		calc := NewFormulaCalculator()
		avail, err := calc.EvaluateFormula(aaf.Formula, map[string]interface{}{"Rating": rating})
		if err != nil {
			return 0, fmt.Errorf("could not evaluate formula %s: %w", aaf.Formula, err)
		}
		return int(avail), nil
	}
	return 0, errors.New("no availability formula specified")
}

// IsValid validates that the availability formula is well-formed.
func (aaf *AgentAvailabilityFormula) IsValid() error {
	if aaf.AvailabilityPerRating < 0 {
		return errors.New("availability per rating cannot be negative")
	}
	if aaf.AvailabilityPerRating == 0 && aaf.Formula == "" {
		return errors.New("agent availability formula must specify either AvailabilityPerRating or Formula")
	}
	return nil
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

// Validate validates that the Program struct has all required fields and valid data.
func (p *Program) Validate() error {
	if p.Name == "" {
		return errors.New("program name is required")
	}

	// Validate program type if set
	if p.Type != "" {
		validTypes := []ProgramType{
			ProgramTypeAgent,
			ProgramTypeCommlinkApp,
			ProgramTypeCommon,
			ProgramTypeHacking,
		}
		valid := false
		for _, vt := range validTypes {
			if p.Type == vt {
				valid = true
				break
			}
		}
		if !valid {
			return fmt.Errorf("invalid program type: %s", p.Type)
		}
	}

	// Validate cost formula if present (for agents)
	if p.Cost != nil {
		if err := p.Cost.IsValid(); err != nil {
			return fmt.Errorf("invalid cost formula: %w", err)
		}
	}

	// Validate availability formula if present (for agents)
	if p.Availability != nil {
		if err := p.Availability.IsValid(); err != nil {
			return fmt.Errorf("invalid availability formula: %w", err)
		}
	}

	// Validate rating range if present (for agents) using common utility
	if p.RatingRange != nil {
		if err := ValidateRating(p.RatingRange.MinRating, 0, 0); err != nil {
			return fmt.Errorf("invalid minimum rating: %w", err)
		}
		if p.RatingRange.MaxRating < p.RatingRange.MinRating {
			return errors.New("maximum rating cannot be less than minimum rating")
		}
		if err := ValidateRating(p.RatingRange.MaxRating, 0, 0); err != nil {
			return fmt.Errorf("invalid maximum rating: %w", err)
		}
	}

	return nil
}

