package loader

import (
	"fmt"
	"regexp"
	"strings"
)

// ValidationError represents a validation error with context
type ValidationError struct {
	Field   string
	Value   interface{}
	Message string
	Severity string // "critical", "warning", "info"
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("[%s] %s: %v - %s", e.Severity, e.Field, e.Value, e.Message)
}

// ValidationResult collects all validation errors
type ValidationResult struct {
	Errors   []ValidationError
	Warnings []ValidationError
	Info     []ValidationError
}

func NewValidationResult() *ValidationResult {
	return &ValidationResult{
		Errors:   make([]ValidationError, 0),
		Warnings: make([]ValidationError, 0),
		Info:     make([]ValidationError, 0),
	}
}

func (r *ValidationResult) AddError(field string, value interface{}, message string) {
	r.Errors = append(r.Errors, ValidationError{
		Field:    field,
		Value:    value,
		Message:  message,
		Severity: "critical",
	})
}

func (r *ValidationResult) AddWarning(field string, value interface{}, message string) {
	r.Warnings = append(r.Warnings, ValidationError{
		Field:    field,
		Value:    value,
		Message:  message,
		Severity: "warning",
	})
}

func (r *ValidationResult) AddInfo(field string, value interface{}, message string) {
	r.Info = append(r.Info, ValidationError{
		Field:    field,
		Value:    value,
		Message:  message,
		Severity: "info",
	})
}

func (r *ValidationResult) HasErrors() bool {
	return len(r.Errors) > 0
}

func (r *ValidationResult) HasIssues() bool {
	return len(r.Errors) > 0 || len(r.Warnings) > 0
}

func (r *ValidationResult) Summary() string {
	return fmt.Sprintf("Errors: %d, Warnings: %d, Info: %d", len(r.Errors), len(r.Warnings), len(r.Info))
}

// UUID regex pattern
var uuidRegex = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)

// ValidateUUID validates that a string is a valid UUID format
func ValidateUUID(id string) bool {
	return uuidRegex.MatchString(strings.ToLower(id))
}

// ValidateRequired checks if a required field is empty
func ValidateRequired(field string, value string, result *ValidationResult) {
	if strings.TrimSpace(value) == "" {
		result.AddError(field, value, "required field is empty")
	}
}

// ValidateID validates that an ID field is present and is a valid UUID
func ValidateID(field string, id string, result *ValidationResult) {
	if strings.TrimSpace(id) == "" {
		result.AddError(field, id, "ID field is empty")
		return
	}
	if !ValidateUUID(id) {
		result.AddWarning(field, id, "ID is not a valid UUID format")
	}
}

// ValidateEnum checks if a value is in the allowed enum values
func ValidateEnum(field string, value string, allowedValues []string, caseSensitive bool, result *ValidationResult) {
	if value == "" {
		return // Empty values are handled by ValidateRequired
	}

	if !caseSensitive {
		value = strings.ToLower(value)
		for i, v := range allowedValues {
			allowedValues[i] = strings.ToLower(v)
		}
	}

	for _, allowed := range allowedValues {
		if value == allowed {
			return
		}
	}

	result.AddWarning(field, value, fmt.Sprintf("value not in allowed enum values: %v", allowedValues))
}

// ValidateNumeric checks if a string represents a valid number
func ValidateNumeric(field string, value string, result *ValidationResult) {
	if value == "" {
		return
	}

	// Check for common numeric patterns (integers, decimals, formulas)
	// Allow formulas like {Rating}, [Rating], Rating+1, etc.
	numericPattern := regexp.MustCompile(`^(\d+(\.\d+)?|{[A-Za-z_]+}|\[[A-Za-z_]+\]|[A-Za-z_]+(\+|-|\*|/)\d+)$`)
	if !numericPattern.MatchString(value) {
		// Also check for complex formulas
		if !strings.ContainsAny(value, "()+-*/[]{}") {
			result.AddWarning(field, value, "value does not appear to be numeric or a valid formula")
		}
	}
}

// ValidateSourceReference validates that source and page fields are present when expected
func ValidateSourceReference(source string, page string, result *ValidationResult) {
	if strings.TrimSpace(source) == "" {
		result.AddWarning("source", source, "source book reference is missing")
	}
	if strings.TrimSpace(page) == "" {
		result.AddWarning("page", page, "page reference is missing")
	}
}

// CheckDuplicateIDs checks for duplicate IDs in a slice of ID strings
func CheckDuplicateIDs(ids []string, result *ValidationResult) {
	seen := make(map[string]int)
	for i, id := range ids {
		if id == "" {
			continue
		}
		if idx, exists := seen[id]; exists {
			result.AddError("id", id, fmt.Sprintf("duplicate ID found at index %d (first seen at index %d)", i, idx))
		} else {
			seen[id] = i
		}
	}
}

