// Package v5 provides utility functions for Shadowrun 5th Edition.
//
// This file contains common utility functions used across multiple entity types:
// - Cost formatting (FormatCostWithCommas)
// - Availability parsing and formatting (ParseAvailability, FormatAvailability)
// - Source reference helpers (GetSourceString, GetSourceWithPage)
// - Validation helpers (ValidateRating, ValidateCost)
// - Formula calculation helpers (CalculateRatingFormula, CalculateCostFormula)
//
// These utilities promote code reuse and consistency across the package.
package v5

import (
	"fmt"
	"strconv"
	"strings"
)

// FormatCostWithCommas formats an integer cost with comma separators for readability.
// Example: 15000 -> "15,000"
func FormatCostWithCommas(cost int) string {
	costStr := strconv.Itoa(cost)
	n := len(costStr)
	if n <= 3 {
		return costStr
	}
	var parts []string
	for n > 3 {
		parts = append([]string{costStr[n-3:]}, parts...)
		costStr = costStr[:n-3]
		n = len(costStr)
	}
	if n > 0 {
		parts = append([]string{costStr}, parts...)
	}
	return strings.Join(parts, ",")
}

// ParseAvailability parses an availability string and returns the numeric value and restrictions.
// Examples: "5R" -> (5, true, false), "12F" -> (12, false, true), "8" -> (8, false, false)
func ParseAvailability(availStr string) (value int, restricted bool, forbidden bool, err error) {
	availStr = strings.TrimSpace(availStr)
	if availStr == "" || availStr == "-" {
		return 0, false, false, nil
	}

	// Check for restrictions
	if strings.HasSuffix(strings.ToUpper(availStr), "F") {
		forbidden = true
		availStr = strings.TrimSuffix(strings.ToUpper(availStr), "F")
	} else if strings.HasSuffix(strings.ToUpper(availStr), "R") {
		restricted = true
		availStr = strings.TrimSuffix(strings.ToUpper(availStr), "R")
	}

	// Handle parentheses in formulas like "(Rating * 3)F"
	availStr = strings.Trim(availStr, "()")

	// Extract numeric value (may be part of a formula)
	availStr = strings.TrimSpace(availStr)
	// Remove common formula patterns to get just the number
	if strings.Contains(strings.ToLower(availStr), "rating") {
		// This is a formula, return 0 for now (would need rating to calculate)
		return 0, restricted, forbidden, fmt.Errorf("availability contains formula, requires rating to calculate")
	}

	value, err = strconv.Atoi(availStr)
	if err != nil {
		return 0, false, false, fmt.Errorf("could not parse availability value: %w", err)
	}

	return value, restricted, forbidden, nil
}

// FormatAvailability formats an availability value with restrictions.
// Examples: (5, true, false) -> "5R", (12, false, true) -> "12F", (8, false, false) -> "8"
func FormatAvailability(value int, restricted bool, forbidden bool) string {
	result := strconv.Itoa(value)
	if forbidden {
		return result + "F"
	}
	if restricted {
		return result + "R"
	}
	return result
}

// GetSourceString extracts the source string from a SourceReference.
// Returns empty string if SourceReference is nil.
func GetSourceString(src *SourceReference) string {
	if src == nil {
		return ""
	}
	return src.Source
}

// GetSourceWithPage extracts the source string with page information from a SourceReference.
// Returns format "Source p. Page" or just "Source" if page is empty.
func GetSourceWithPage(src *SourceReference) string {
	if src == nil {
		return ""
	}
	if src.Page != "" {
		return fmt.Sprintf("%s p. %s", src.Source, src.Page)
	}
	return src.Source
}

// ValidateRating checks if a rating value is within valid bounds.
// Returns nil if valid, or an error describing the validation failure.
func ValidateRating(rating int, minRating int, maxRating int) error {
	if maxRating > 0 && rating > maxRating {
		return fmt.Errorf("rating %d exceeds maximum rating %d", rating, maxRating)
	}
	if minRating > 0 && rating < minRating {
		return fmt.Errorf("rating %d is below minimum rating %d", rating, minRating)
	}
	if rating < 0 {
		return fmt.Errorf("rating cannot be negative")
	}
	return nil
}

// ValidateCost checks if a cost value is valid (non-negative).
func ValidateCost(cost int) error {
	if cost < 0 {
		return fmt.Errorf("cost cannot be negative")
	}
	return nil
}

// CalculateRatingFormula is a convenience function to calculate a value from a rating formula string.
// This is a wrapper around the FormulaCalculator.
func CalculateRatingFormula(formula string, rating int) (float64, error) {
	calc := NewFormulaCalculator()
	return calc.EvaluateFormula(formula, map[string]interface{}{"Rating": rating})
}

// CalculateCostFormula calculates cost from a formula with the given rating.
// Returns the calculated cost as an integer.
func CalculateCostFormula(formula string, rating int) (int, error) {
	value, err := CalculateRatingFormula(formula, rating)
	if err != nil {
		return 0, err
	}
	return int(value), nil
}

