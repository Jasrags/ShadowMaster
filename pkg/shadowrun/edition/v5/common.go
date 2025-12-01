// Package v5 provides Shadowrun 5th Edition data models and utilities.
//
// This package defines struct types for all Shadowrun 5th Edition game entities including:
// - Equipment: Weapons, Armor, Gear, Augmentations (Cyberware/Bioware)
// - Character Elements: Qualities, Skills, Metatypes, Powers
// - Vehicles: Vehicles, Drones, Vehicle Modifications
// - Matrix: Programs, Complex Forms
// - Magic: Spells, Traditions, Mentors
// - Game Elements: Actions, Lifestyles, Contacts, Books
//
// All entities use consistent patterns:
// - Source references via *SourceReference type
// - Structured formula types (CostFormula, RatingFormula) for calculations
// - Validation methods (Validate()) for data integrity
// - Common interfaces (SourceReferenced, Costed, Ratable, Validator)
//
// The package maintains backward compatibility by keeping deprecated fields
// alongside new structured types, allowing gradual migration.
package v5

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type LegalityType string

const (
	LegalityTypeNone       LegalityType = ""
	LegalityTypeRestricted LegalityType = "Restricted"
	LegalityTypeForbidden  LegalityType = "Forbidden"
)

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
	ActionChange ActionType `json:"action_change,omitempty"`
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

// CostFormula represents how a nuyen cost is calculated.
// It can represent either a fixed cost or a formula-based cost.
// This is the common cost formula type used across multiple entity types.
//
// Usage:
//
//	Fixed cost:
//	  CostFormula{BaseCost: intPtr(15000), IsFixed: true}
//
//	Formula-based cost:
//	  CostFormula{Formula: "Rating * 20000", IsVariable: true}
//
// Methods:
//
//	RequiresRating() - checks if formula needs a rating value
//	Calculate(rating int) - calculates the cost for a given rating
//	IsValid() - validates the formula is well-formed
//
// Note: For domain-specific cost calculations, see:
// - PowerCostFormula (powers.go) - for power point costs using levels
// - AgentCostFormula (programs.go) - for agent costs with simplified structure
type CostFormula struct {
	// BaseCost is the fixed cost in nuyen if not formula-based.
	// Use when IsFixed is true or IsVariable is false.
	BaseCost *int `json:"base_cost,omitempty"`
	// Formula is the formula string for calculating cost.
	// Examples: "Rating * 20000", "Capacity*50", "Body * 500"
	Formula string `json:"formula,omitempty"`
	// IsFixed indicates whether this represents a fixed cost (true) or a formula (false).
	IsFixed bool `json:"is_fixed,omitempty"`
	// IsVariable indicates if the cost is variable based on characteristics.
	// Used by VehicleModifications. Note: IsVariable = !IsFixed for consistency.
	IsVariable bool `json:"is_variable,omitempty"`
}

// RequiresRating returns true if the cost formula requires a rating to calculate.
func (cf *CostFormula) RequiresRating() bool {
	if cf.IsFixed || (!cf.IsVariable && cf.BaseCost != nil) {
		return false
	}
	if cf.Formula == "" {
		return false
	}
	return strings.Contains(strings.ToLower(cf.Formula), "rating")
}

// Calculate calculates the cost given a rating value.
// If the formula is fixed, returns the base cost.
// If the formula requires a rating, the rating parameter is used.
// Returns an error if the formula cannot be parsed or calculated.
func (cf *CostFormula) Calculate(rating int) (int, error) {
	if cf.IsFixed || (!cf.IsVariable && cf.BaseCost != nil) {
		if cf.BaseCost == nil {
			return 0, errors.New("fixed cost specified but BaseCost is nil")
		}
		return *cf.BaseCost, nil
	}
	if cf.Formula == "" {
		return 0, errors.New("no formula or base cost specified")
	}
	return calculateRatingFormulaInt(cf.Formula, rating)
}

// IsValid validates that the cost formula is well-formed.
func (cf *CostFormula) IsValid() bool {
	if cf.IsFixed || (!cf.IsVariable && cf.BaseCost != nil) {
		return cf.BaseCost != nil
	}
	// If IsVariable is true, we should have a formula
	if cf.IsVariable && cf.Formula == "" {
		return false
	}
	// Basic validation: formula should not be empty and should be parseable
	if cf.Formula == "" {
		return false
	}
	// Try to parse the formula to see if it's valid
	_, err := parseRatingFormula(cf.Formula)
	return err == nil || !cf.RequiresRating()
}

// RatingFormula represents a formula-based calculation that may depend on a rating.
// It can represent either a fixed value or a formula.
//
// Usage:
//
//	Fixed value:
//	  RatingFormula{FixedValue: floatPtr(0.2), IsFixed: true}
//
//	Formula-based:
//	  RatingFormula{Formula: "Rating * 0.1"}
//
// Methods:
//
//	RequiresRating() - checks if formula needs a rating value
//	Calculate(rating int) - calculates the value for a given rating
//	IsValid() - validates the formula is well-formed
type RatingFormula struct {
	// FixedValue is the fixed value if not formula-based.
	// Use when IsFixed is true.
	FixedValue *float64 `json:"fixed_value,omitempty"`
	// Formula is the formula string.
	// Examples: "Rating * 0.1", "Rating * 3", "Rating * 5000"
	Formula string `json:"formula,omitempty"`
	// IsFixed indicates whether this represents a fixed value (true) or a formula (false).
	IsFixed bool `json:"is_fixed,omitempty"`
}

// RequiresRating returns true if the formula requires a rating to calculate.
func (rf *RatingFormula) RequiresRating() bool {
	if rf.IsFixed || rf.FixedValue != nil {
		return false
	}
	return strings.Contains(strings.ToLower(rf.Formula), "rating")
}

// Calculate calculates the value given a rating.
// Returns a float64 result.
func (rf *RatingFormula) Calculate(rating int) (float64, error) {
	if rf.IsFixed || rf.FixedValue != nil {
		if rf.FixedValue == nil {
			return 0, errors.New("fixed value specified but FixedValue is nil")
		}
		return *rf.FixedValue, nil
	}
	if rf.Formula == "" {
		return 0, errors.New("no formula or fixed value specified")
	}
	return calculateRatingFormulaFloat(rf.Formula, rating)
}

// IsValid validates that the rating formula is well-formed.
func (rf *RatingFormula) IsValid() bool {
	if rf.IsFixed || rf.FixedValue != nil {
		return rf.FixedValue != nil
	}
	if rf.Formula == "" {
		return false
	}
	_, err := parseRatingFormula(rf.Formula)
	return err == nil || !rf.RequiresRating()
}

// parseRatingFormula parses a formula string containing "Rating" and extracts the multiplier.
// Returns the multiplier value and any error.
// Supports formats like "Rating * 3", "Rating*3", "(Rating*4)R", "Rating * 0.1", etc.
func parseRatingFormula(formula string) (float64, error) {
	ratingRegex := regexp.MustCompile(`(?i)rating\s*\*\s*([\d,]+\.?\d*)`)
	if !strings.Contains(strings.ToLower(formula), "rating") {
		return 0, fmt.Errorf("formula does not contain 'rating'")
	}
	matches := ratingRegex.FindStringSubmatch(formula)
	if len(matches) < 2 {
		return 0, fmt.Errorf("could not parse rating formula: %s", formula)
	}
	multiplierStr := strings.ReplaceAll(matches[1], ",", "")
	multiplier, err := strconv.ParseFloat(multiplierStr, 64)
	if err != nil {
		return 0, fmt.Errorf("could not parse multiplier in formula %s: %w", formula, err)
	}
	return multiplier, nil
}

// calculateRatingFormulaInt calculates an integer result from a rating formula string.
func calculateRatingFormulaInt(formula string, rating int) (int, error) {
	if !strings.Contains(strings.ToLower(formula), "rating") {
		// Try to parse as a fixed integer value
		formula = strings.TrimSpace(formula)
		formula = strings.ReplaceAll(formula, ",", "")
		formula = strings.TrimRight(formula, "¥")
		value, err := strconv.Atoi(formula)
		if err != nil {
			return 0, fmt.Errorf("formula does not contain rating and is not a valid integer: %s", formula)
		}
		return value, nil
	}
	multiplier, err := parseRatingFormula(formula)
	if err != nil {
		return 0, err
	}
	result := float64(rating) * multiplier
	return int(result), nil
}

// calculateRatingFormulaFloat calculates a float64 result from a rating formula string.
func calculateRatingFormulaFloat(formula string, rating int) (float64, error) {
	if !strings.Contains(strings.ToLower(formula), "rating") {
		// Try to parse as a fixed float value
		formula = strings.TrimSpace(formula)
		formula = strings.ReplaceAll(formula, ",", "")
		value, err := strconv.ParseFloat(formula, 64)
		if err != nil {
			return 0, fmt.Errorf("formula does not contain rating and is not a valid number: %s", formula)
		}
		return value, nil
	}
	multiplier, err := parseRatingFormula(formula)
	if err != nil {
		return 0, err
	}
	return float64(rating) * multiplier, nil
}

// SourceReferenced is an interface for entities that have a source reference.
// Entities implementing this interface can get and set their source book information.
type SourceReferenced interface {
	GetSource() *SourceReference
	SetSource(*SourceReference)
}

// Costed is an interface for entities that have a cost.
// Entities implementing this interface can provide their cost formula
// and calculate the actual cost given a rating.
type Costed interface {
	GetCost() CostFormula
	CalculateCost(rating int) (int, error)
}

// Ratable is an interface for entities that may require a rating to calculate values.
// Entities implementing this interface can indicate if they need a rating
// and perform calculations with that rating.
type Ratable interface {
	RequiresRating() bool
	CalculateWithRating(rating int) error
}

// Validator is an interface for entities that can validate their data.
// Entities implementing this interface can check if their data is well-formed
// and return an error describing any validation failures.
//
// Example:
//
//	if err := entity.Validate(); err != nil {
//	    // Handle validation error
//	}
type Validator interface {
	Validate() error
}

// NewSourceReferenceFromString creates a SourceReference from a string source code.
// This helper is useful for converting old string-format sources to the new SourceReference format.
// The page field will be left empty.
func NewSourceReferenceFromString(source string) *SourceReference {
	if source == "" {
		return nil
	}
	return &SourceReference{
		Source: source,
		Page:   "",
	}
}

// intPtr returns a pointer to an int.
// This helper is useful for creating pointer values for optional int fields.
func intPtr(i int) *int {
	return &i
}

// floatPtr returns a pointer to a float64.
// This helper is useful for creating pointer values for optional float64 fields.
func floatPtr(f float64) *float64 {
	return &f
}
