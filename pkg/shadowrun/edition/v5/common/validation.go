package common

import (
	"fmt"
	"strconv"
	"strings"
)

// ValidateRating validates that a rating is within the specified min/max range
func ValidateRating(rating, min, max int) error {
	if rating < min {
		return fmt.Errorf("rating %d is below minimum %d", rating, min)
	}
	if rating > max {
		return fmt.Errorf("rating %d is above maximum %d", rating, max)
	}
	return nil
}

// ValidateAvailability validates an availability string format
// Returns an error if the format is invalid, nil otherwise
// This does not evaluate formulas, just checks the format
func ValidateAvailability(avail string) error {
	if avail == "" {
		return nil // Empty is valid (optional field)
	}

	// Check for valid modifiers
	if strings.HasPrefix(avail, "+") || strings.HasPrefix(avail, "-") {
		// Modifier format like "+2" or "-4"
		rest := avail[1:]
		if rest == "" {
			return fmt.Errorf("invalid availability modifier: %s", avail)
		}
		// Remove R/F flags
		rest = strings.TrimSuffix(rest, "R")
		rest = strings.TrimSuffix(rest, "F")
		if _, err := strconv.Atoi(rest); err != nil {
			return fmt.Errorf("invalid availability modifier value: %s", avail)
		}
		return nil
	}

	// Remove flags for validation
	testAvail := strings.TrimSuffix(avail, "R")
	testAvail = strings.TrimSuffix(testAvail, "F")
	testAvail = strings.TrimSpace(testAvail)

	// Check if it's a formula (contains operators or Rating)
	if strings.Contains(testAvail, "Rating") || 
	   strings.Contains(testAvail, "*") || 
	   strings.Contains(testAvail, "+") ||
	   strings.Contains(testAvail, "-") ||
	   strings.Contains(testAvail, "/") ||
	   strings.Contains(testAvail, "(") {
		// Formula format - basic validation
		if testAvail == "" {
			return fmt.Errorf("empty formula in availability: %s", avail)
		}
		return nil
	}

	// Should be a numeric value
	if _, err := strconv.Atoi(testAvail); err != nil {
		return fmt.Errorf("invalid availability format: %s", avail)
	}

	return nil
}

// ValidateCost validates a cost string format
// Returns an error if the format is invalid, nil otherwise
func ValidateCost(cost string) error {
	if cost == "" {
		return nil // Empty is valid (optional field)
	}

	// Check for "Variable" format
	if strings.HasPrefix(cost, "Variable(") {
		// Format: "Variable(20-100000)"
		if !strings.HasSuffix(cost, ")") {
			return fmt.Errorf("invalid Variable cost format: %s", cost)
		}
		return nil
	}

	// Check for formula format
	if strings.Contains(cost, "Rating") || 
	   strings.Contains(cost, "*") || 
	   strings.Contains(cost, "+") {
		return nil // Formula is valid
	}

	// Should be a numeric value
	if _, err := strconv.Atoi(cost); err != nil {
		return fmt.Errorf("invalid cost format: %s", cost)
	}

	return nil
}

// ValidateEssence validates an essence cost string format
func ValidateEssence(ess string) error {
	if ess == "" {
		return nil // Empty is valid (optional field)
	}

	// Check for formula format
	if strings.Contains(ess, "Rating") || 
	   strings.Contains(ess, "*") || 
	   strings.Contains(ess, "+") ||
	   strings.Contains(ess, "FixedValues") {
		return nil // Formula is valid
	}

	// Should be a numeric value (can be decimal)
	if _, err := strconv.ParseFloat(ess, 64); err != nil {
		return fmt.Errorf("invalid essence format: %s", ess)
	}

	return nil
}

