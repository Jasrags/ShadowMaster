// Package v5 provides specialized formula types for domain-specific calculations.
//
// This file contains PowerCostFormula, which is specialized for power point costs.
// Unlike CostFormula (which handles nuyen costs), PowerCostFormula:
// - Uses levels instead of ratings
// - Works with power points (PP) instead of nuyen
// - Supports multiple cost components (BaseCost, CostPerLevel, AdditionalCost, CostPerItem)
// - Has domain-specific fields like MaxLevel for power limitations
//
// This specialization allows for the complex power cost structures in Shadowrun 5th Edition
// while maintaining consistency with common patterns (Calculate, RequiresLevel, IsValid methods).
package v5

import (
	"errors"
	"fmt"
	"strings"
)

// ActivationType represents how a power is activated
type ActivationType string

const (
	ActivationTypeFreeAction   ActivationType = "free_action"
	ActivationTypeSimpleAction ActivationType = "simple_action"
	ActivationTypeInterrupt     ActivationType = "interrupt"
	ActivationTypePassive       ActivationType = "passive"
)

// PowerCostFormula represents how the power point cost is calculated.
// This is a specialized formula type for power points (PP), which differs from CostFormula
// (which handles nuyen costs). Power costs often use levels rather than ratings.
//
// Usage:
//   Fixed cost:
//     PowerCostFormula{BaseCost: floatPtr(0.5), IsVariable: false}
//
//   Cost per level:
//     PowerCostFormula{CostPerLevel: floatPtr(0.25), IsVariable: true}
//
//   Formula-based:
//     PowerCostFormula{Formula: "0.5 PP + level (Max 3)", IsVariable: true}
//
// Methods:
//   Calculate(level int) - calculates the power point cost for a given level
//   RequiresLevel() - checks if formula needs a level parameter
//   IsValid() - validates the formula structure
//   GetMaxLevel() - extracts max level if specified
type PowerCostFormula struct {
	// BaseCost is the base cost in power points (if fixed)
	BaseCost *float64 `json:"base_cost,omitempty"`
	// CostPerLevel is the cost per level (e.g., 0.25 PP per level)
	CostPerLevel *float64 `json:"cost_per_level,omitempty"`
	// AdditionalCost is additional cost formula (e.g., "0.5 PP + level")
	AdditionalCost *float64 `json:"additional_cost,omitempty"`
	// MaxLevel is the maximum level allowed (e.g., "Max 3")
	MaxLevel *int `json:"max_level,omitempty"`
	// CostPerItem is the cost per item (e.g., "0.25 PP each")
	CostPerItem *float64 `json:"cost_per_item,omitempty"`
	// Formula describes the cost formula as text (e.g., "0.5 PP + level (Max 3)")
	Formula string `json:"formula,omitempty"`
	// IsVariable indicates if the cost is variable
	IsVariable bool `json:"is_variable,omitempty"`
}

// RequiresLevel returns true if the power cost formula requires a level to calculate.
func (pcf *PowerCostFormula) RequiresLevel() bool {
	if !pcf.IsVariable && pcf.BaseCost != nil {
		return false
	}
	if pcf.CostPerLevel != nil || pcf.CostPerItem != nil {
		return true
	}
	if pcf.Formula != "" {
		calc := NewFormulaCalculator()
		// Check for both "level" and "rating" keywords (powers can use either)
		formulaLower := strings.ToLower(pcf.Formula)
		return strings.Contains(formulaLower, "level") || calc.RequiresRating(pcf.Formula)
	}
	return false
}

// Calculate calculates the power point cost for a given level.
// Returns the calculated cost and any error.
func (pcf *PowerCostFormula) Calculate(level int) (float64, error) {
	if !pcf.IsVariable && pcf.BaseCost != nil {
		return *pcf.BaseCost, nil
	}

	// Check max level
	if pcf.MaxLevel != nil && level > *pcf.MaxLevel {
		return 0, fmt.Errorf("level %d exceeds maximum level %d", level, *pcf.MaxLevel)
	}

	var cost float64

	// Base cost if present
	if pcf.BaseCost != nil {
		cost += *pcf.BaseCost
	}

	// Cost per level
	if pcf.CostPerLevel != nil {
		cost += *pcf.CostPerLevel * float64(level)
	}

	// Additional cost
	if pcf.AdditionalCost != nil {
		cost += *pcf.AdditionalCost
	}

	// Cost per item (assumes level is number of items)
	if pcf.CostPerItem != nil {
		cost += *pcf.CostPerItem * float64(level)
	}

	// If formula is provided and no structured fields, try to parse formula using FormulaCalculator
	if pcf.Formula != "" && cost == 0 && pcf.BaseCost == nil && pcf.CostPerLevel == nil && pcf.CostPerItem == nil {
		calc := NewFormulaCalculator()
		// Use "Level" or "Rating" as variable name depending on formula
		vars := map[string]interface{}{"Level": level, "Rating": level}
		formulaCost, err := calc.EvaluateFormula(pcf.Formula, vars)
		if err != nil {
			return 0, fmt.Errorf("could not evaluate formula %s: %w", pcf.Formula, err)
		}
		return formulaCost, nil
	}

	return cost, nil
}

// GetMaxLevel returns the maximum level allowed, or 0 if not specified.
func (pcf *PowerCostFormula) GetMaxLevel() int {
	if pcf.MaxLevel == nil {
		return 0
	}
	return *pcf.MaxLevel
}

// IsValid validates that the power cost formula is well-formed.
func (pcf *PowerCostFormula) IsValid() error {
	if !pcf.IsVariable && pcf.BaseCost != nil {
		if *pcf.BaseCost < 0 {
			return errors.New("base cost cannot be negative")
		}
		return nil
	}

	// If variable, should have at least one cost component
	if pcf.IsVariable {
		if pcf.BaseCost == nil && pcf.CostPerLevel == nil && pcf.CostPerItem == nil && pcf.Formula == "" {
			return errors.New("variable cost formula must have at least one cost component")
		}
	}

	// Validate cost components are non-negative
	if pcf.BaseCost != nil && *pcf.BaseCost < 0 {
		return errors.New("base cost cannot be negative")
	}
	if pcf.CostPerLevel != nil && *pcf.CostPerLevel < 0 {
		return errors.New("cost per level cannot be negative")
	}
	if pcf.CostPerItem != nil && *pcf.CostPerItem < 0 {
		return errors.New("cost per item cannot be negative")
	}
	if pcf.AdditionalCost != nil && *pcf.AdditionalCost < 0 {
		return errors.New("additional cost cannot be negative")
	}

	// Validate max level is positive if set
	if pcf.MaxLevel != nil && *pcf.MaxLevel <= 0 {
		return errors.New("max level must be positive")
	}

	return nil
}

// Power represents a power definition
type Power struct {
	// Name is the power name (e.g., "Adrenaline Boost", "Attribute Boost (Attribute)")
	Name string `json:"name,omitempty"`
	// Parameter describes the parameter type if applicable (e.g., "Attribute", "Skill", "Limit")
	Parameter string `json:"parameter,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Prerequisite lists prerequisites (if any)
	Prerequisite string `json:"prerequisite,omitempty"`
	// Activation describes how the power is activated
	Activation ActivationType `json:"activation,omitempty"`
	// ActivationDescription is the activation description as text (e.g., "Free Action", "Interrupt (-5 Initiative)")
	ActivationDescription string `json:"activation_description,omitempty"`
	// Cost describes the power point cost
	Cost PowerCostFormula `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataPowers contains all power definitions
// This is populated in powers_data.go

// GetAllPowers returns all powers
func GetAllPowers() []Power {
	powers := make([]Power, 0, len(dataPowers))
	for _, p := range dataPowers {
		powers = append(powers, p)
	}
	return powers
}

// GetPowerByName returns the power definition with the given name, or nil if not found
func GetPowerByName(name string) *Power {
	for _, power := range dataPowers {
		if power.Name == name {
			return &power
		}
	}
	return nil
}

// Validate validates that the Power struct has all required fields and valid data.
func (p *Power) Validate() error {
	if p.Name == "" {
		return errors.New("power name is required")
	}

	// Validate cost formula
	if err := p.Cost.IsValid(); err != nil {
		return fmt.Errorf("invalid cost formula: %w", err)
	}

	// Validate activation type if set
	if p.Activation != "" {
		validTypes := []ActivationType{
			ActivationTypeFreeAction,
			ActivationTypeSimpleAction,
			ActivationTypeInterrupt,
			ActivationTypePassive,
		}
		valid := false
		for _, vt := range validTypes {
			if p.Activation == vt {
				valid = true
				break
			}
		}
		if !valid {
			return fmt.Errorf("invalid activation type: %s", p.Activation)
		}
	}

	return nil
}

// GetPowerByKey returns the power definition with the given key, or nil if not found
func GetPowerByKey(key string) *Power {
	power, ok := dataPowers[key]
	if !ok {
		return nil
	}
	return &power
}

// GetPowersByActivation returns all powers with the specified activation type
func GetPowersByActivation(activation ActivationType) []Power {
	powers := make([]Power, 0)
	for _, p := range dataPowers {
		if p.Activation == activation {
			powers = append(powers, p)
		}
	}
	return powers
}

