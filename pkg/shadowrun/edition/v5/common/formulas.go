package common

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Formula represents a formula expression that can be evaluated
type Formula struct {
	Expression string
}

// NewFormula creates a new Formula from an expression string
func NewFormula(expr string) *Formula {
	return &Formula{Expression: expr}
}

// Evaluate evaluates the formula with the given variables
// Variables should be provided as a map[string]interface{} where values can be:
// - int, int64, float64 for numeric values
// - string for attribute references like "{STR}" which will be looked up in vars
func (f *Formula) Evaluate(vars map[string]interface{}) (float64, error) {
	if f.Expression == "" {
		return 0, fmt.Errorf("empty formula expression")
	}

	// Handle simple numeric values
	if val, err := strconv.ParseFloat(f.Expression, 64); err == nil {
		return val, nil
	}

	// Replace attribute references like {STR} with their values
	expr := f.Expression
	attrPattern := regexp.MustCompile(`\{([A-Z]+)\}`)
	expr = attrPattern.ReplaceAllStringFunc(expr, func(match string) string {
		attrName := strings.Trim(match, "{}")
		if val, ok := vars[attrName]; ok {
			return fmt.Sprintf("%v", val)
		}
		return match // Keep original if not found
	})

	// Handle "Rating" variable
	if strings.Contains(expr, "Rating") {
		if rating, ok := vars["Rating"]; ok {
			ratingStr := fmt.Sprintf("%v", rating)
			expr = strings.ReplaceAll(expr, "Rating", ratingStr)
		} else {
			return 0, fmt.Errorf("Rating variable not found in vars")
		}
	}

	// Simple arithmetic evaluation
	// This is a basic implementation - for production, consider using a proper expression parser
	result, err := evaluateSimpleExpression(expr)
	if err != nil {
		return 0, fmt.Errorf("error evaluating formula '%s': %w", f.Expression, err)
	}

	return result, nil
}

// evaluateSimpleExpression evaluates simple arithmetic expressions
// Supports: +, -, *, /, parentheses
// This is a simplified parser - for complex formulas, consider using a library like expr
func evaluateSimpleExpression(expr string) (float64, error) {
	// Remove whitespace
	expr = strings.ReplaceAll(expr, " ", "")
	
	// Handle parentheses first
	for strings.Contains(expr, "(") {
		re := regexp.MustCompile(`\(([^()]+)\)`)
		expr = re.ReplaceAllStringFunc(expr, func(match string) string {
			inner := strings.Trim(match, "()")
			val, err := evaluateSimpleExpression(inner)
			if err != nil {
				return match // Keep original on error
			}
			return fmt.Sprintf("%.2f", val)
		})
	}

	// Evaluate multiplication and division
	re := regexp.MustCompile(`([\d.]+)\s*([*/])\s*([\d.]+)`)
	for re.MatchString(expr) {
		expr = re.ReplaceAllStringFunc(expr, func(match string) string {
			parts := re.FindStringSubmatch(match)
			if len(parts) != 4 {
				return match
			}
			a, _ := strconv.ParseFloat(parts[1], 64)
			b, _ := strconv.ParseFloat(parts[3], 64)
			var result float64
			if parts[2] == "*" {
				result = a * b
			} else {
				if b == 0 {
					return match
				}
				result = a / b
			}
			return fmt.Sprintf("%.2f", result)
		})
	}

	// Evaluate addition and subtraction
	re = regexp.MustCompile(`([\d.]+)\s*([+-])\s*([\d.]+)`)
	for re.MatchString(expr) {
		expr = re.ReplaceAllStringFunc(expr, func(match string) string {
			parts := re.FindStringSubmatch(match)
			if len(parts) != 4 {
				return match
			}
			a, _ := strconv.ParseFloat(parts[1], 64)
			b, _ := strconv.ParseFloat(parts[3], 64)
			var result float64
			if parts[2] == "+" {
				result = a + b
			} else {
				result = a - b
			}
			return fmt.Sprintf("%.2f", result)
		})
	}

	// Final value
	result, err := strconv.ParseFloat(expr, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid expression: %s", expr)
	}

	return result, nil
}

// ParseAvailability parses an availability string like "4", "10R", "(Rating * 6)F"
// Returns the numeric value, whether it's restricted (R), forbidden (F), or neither
func ParseAvailability(avail string, vars map[string]interface{}) (value int, restricted bool, forbidden bool, err error) {
	if avail == "" {
		return 0, false, false, nil
	}

	// Check for restricted (R) or forbidden (F) flags
	restricted = strings.HasSuffix(avail, "R") || strings.Contains(avail, "R")
	forbidden = strings.HasSuffix(avail, "F") || strings.Contains(avail, "F")
	
	// Remove flags for parsing
	avail = strings.TrimSuffix(avail, "R")
	avail = strings.TrimSuffix(avail, "F")
	avail = strings.TrimSpace(avail)

	// Handle formulas
	if strings.Contains(avail, "Rating") || strings.Contains(avail, "*") || strings.Contains(avail, "+") {
		formula := NewFormula(avail)
		result, err := formula.Evaluate(vars)
		if err != nil {
			return 0, false, false, err
		}
		return int(result), restricted, forbidden, nil
	}

	// Handle simple numeric values
	if strings.HasPrefix(avail, "+") || strings.HasPrefix(avail, "-") {
		// Modifier like "+2" or "-4"
		val, err := strconv.Atoi(avail)
		if err != nil {
			return 0, false, false, fmt.Errorf("invalid availability modifier: %s", avail)
		}
		return val, restricted, forbidden, nil
	}

	// Regular numeric value
	val, err := strconv.Atoi(avail)
	if err != nil {
		return 0, false, false, fmt.Errorf("invalid availability value: %s", avail)
	}

	return val, restricted, forbidden, nil
}

