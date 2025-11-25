// Package v5 provides formula calculation utilities for Shadowrun 5th Edition.
//
// This file contains the FormulaCalculator utility for parsing and evaluating
// formulas, particularly rating-based formulas used throughout the game system.
//
// Formula Syntax:
// - Rating-based: "Rating * 3", "Rating*5000", "(Rating * 4)R"
// - Fixed values: "15000", "0.2"
// - Supports multipliers with decimals: "Rating * 0.1"
//
// Example usage:
//   calc := NewFormulaCalculator()
//   fn, err := calc.ParseRatingFormula("Rating * 2000")
//   if err == nil {
//       cost := fn(3) // Returns 6000.0 for rating 3
//   }
package v5

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// FormulaCalculator provides utilities for parsing and evaluating formulas
type FormulaCalculator struct{}

// NewFormulaCalculator creates a new FormulaCalculator instance
func NewFormulaCalculator() *FormulaCalculator {
	return &FormulaCalculator{}
}

// ParseRatingFormula parses a formula string containing "Rating" and returns a calculation function.
// Supports formats like "Rating * 3", "Rating*3", "(Rating*4)R", "Rating * 0.1", etc.
// Returns a function that takes a rating and returns the calculated value, and any error.
func (fc *FormulaCalculator) ParseRatingFormula(formula string) (func(int) float64, error) {
	if !strings.Contains(strings.ToLower(formula), "rating") {
		// Try to parse as a fixed value
		formula = strings.TrimSpace(formula)
		formula = strings.ReplaceAll(formula, ",", "")
		formula = strings.TrimRight(formula, "¥")
		value, err := strconv.ParseFloat(formula, 64)
		if err != nil {
			return nil, fmt.Errorf("formula does not contain rating and is not a valid number: %s", formula)
		}
		return func(int) float64 { return value }, nil
	}

	ratingRegex := regexp.MustCompile(`(?i)rating\s*\*\s*([\d,]+\.?\d*)`)
	matches := ratingRegex.FindStringSubmatch(formula)
	if len(matches) < 2 {
		return nil, fmt.Errorf("could not parse rating formula: %s", formula)
	}

	multiplierStr := strings.ReplaceAll(matches[1], ",", "")
	multiplier, err := strconv.ParseFloat(multiplierStr, 64)
	if err != nil {
		return nil, fmt.Errorf("could not parse multiplier in formula %s: %w", formula, err)
	}

	return func(rating int) float64 {
		return float64(rating) * multiplier
	}, nil
}

// EvaluateFormula evaluates a formula string with the given variables.
// Currently supports "Rating" variable. Returns the calculated value and any error.
func (fc *FormulaCalculator) EvaluateFormula(formula string, vars map[string]interface{}) (float64, error) {
	// Check if formula contains Rating
	if strings.Contains(strings.ToLower(formula), "rating") {
		rating, ok := vars["Rating"]
		if !ok {
			return 0, fmt.Errorf("variable 'Rating' required but not provided")
		}
		ratingInt, ok := rating.(int)
		if !ok {
			return 0, fmt.Errorf("variable 'Rating' must be an int")
		}
		calcFunc, err := fc.ParseRatingFormula(formula)
		if err != nil {
			return 0, err
		}
		return calcFunc(ratingInt), nil
	}

	// Try to parse as a fixed value
	formula = strings.TrimSpace(formula)
	formula = strings.ReplaceAll(formula, ",", "")
	value, err := strconv.ParseFloat(formula, 64)
	if err != nil {
		return 0, fmt.Errorf("formula does not contain supported variables and is not a valid number: %s", formula)
	}
	return value, nil
}

// FormatCost formats an integer cost with comma separators for readability.
// Example: 15000 -> "15,000"
func (fc *FormulaCalculator) FormatCost(cost int) string {
	return FormatCostWithCommas(cost)
}

// FormatCostFloat formats a float64 cost with comma separators and optional decimal precision.
// Example: 15000.5 -> "15,000.5"
func (fc *FormulaCalculator) FormatCostFloat(cost float64, precision int) string {
	costInt := int(cost)
	formatted := FormatCostWithCommas(costInt)
	
	// Add decimal part if needed
	if cost != float64(costInt) && precision > 0 {
		decimalPart := cost - float64(costInt)
		decimalStr := fmt.Sprintf("%."+strconv.Itoa(precision)+"f", decimalPart)
		decimalStr = strings.TrimPrefix(decimalStr, "0.")
		formatted += "." + decimalStr
	}
	return formatted
}

// NormalizeFormula converts a formula string to a standard format.
// Removes spaces around operators and normalizes multiplier formatting.
func (fc *FormulaCalculator) NormalizeFormula(formula string) string {
	return NormalizeFormula(formula)
}

// RequiresRating checks if a formula requires a rating value to be calculated.
func (fc *FormulaCalculator) RequiresRating(formula string) bool {
	return strings.Contains(strings.ToLower(formula), "rating")
}

// Global FormulaCalculator instance for convenience
var defaultFormulaCalculator = NewFormulaCalculator()

// ParseRatingFormula is a convenience function using the default calculator
func ParseRatingFormula(formula string) (func(int) float64, error) {
	return defaultFormulaCalculator.ParseRatingFormula(formula)
}

// EvaluateFormula is a convenience function using the default calculator
func EvaluateFormula(formula string, vars map[string]interface{}) (float64, error) {
	return defaultFormulaCalculator.EvaluateFormula(formula, vars)
}

// FormatCost is a convenience function using the default calculator
func FormatCost(cost int) string {
	return defaultFormulaCalculator.FormatCost(cost)
}

