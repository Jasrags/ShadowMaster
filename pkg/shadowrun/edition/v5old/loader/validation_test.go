package loader

import (
	"testing"
)

func TestValidateUUID(t *testing.T) {
	tests := []struct {
		name    string
		id      string
		want    bool
	}{
		{"valid UUID", "9ee8e6ad-2472-485d-ae42-d1978749b456", true},
		{"valid UUID uppercase", "9EE8E6AD-2472-485D-AE42-D1978749B456", true},
		{"invalid UUID - missing dashes", "9ee8e6ad2472485dae42d1978749b456", false},
		{"invalid UUID - wrong format", "not-a-uuid", false},
		{"invalid UUID - too short", "9ee8e6ad-2472-485d-ae42-d197", false},
		{"empty string", "", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := ValidateUUID(tt.id); got != tt.want {
				t.Errorf("ValidateUUID() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestValidateRequired(t *testing.T) {
	result := NewValidationResult()
	ValidateRequired("testField", "", result)
	if !result.HasErrors() {
		t.Error("Expected error for empty required field")
	}
	if len(result.Errors) != 1 {
		t.Errorf("Expected 1 error, got %d", len(result.Errors))
	}

	result2 := NewValidationResult()
	ValidateRequired("testField", "value", result2)
	if result2.HasErrors() {
		t.Error("Should not have error for non-empty field")
	}
}

func TestValidateID(t *testing.T) {
	result := NewValidationResult()
	ValidateID("testID", "", result)
	if !result.HasErrors() {
		t.Error("Expected error for empty ID")
	}

	result2 := NewValidationResult()
	ValidateID("testID", "9ee8e6ad-2472-485d-ae42-d1978749b456", result2)
	if result2.HasErrors() {
		t.Error("Should not have error for valid UUID")
	}

	result3 := NewValidationResult()
	ValidateID("testID", "invalid-id", result3)
	if !result3.HasIssues() {
		t.Error("Expected warning for invalid UUID format")
	}
}

func TestValidateEnum(t *testing.T) {
	allowed := []string{"Value1", "Value2", "Value3"}
	
	result := NewValidationResult()
	ValidateEnum("testEnum", "Value1", allowed, true, result)
	if result.HasIssues() {
		t.Error("Should not have issues for valid enum value")
	}

	result2 := NewValidationResult()
	ValidateEnum("testEnum", "InvalidValue", allowed, true, result2)
	if !result2.HasIssues() {
		t.Error("Expected warning for invalid enum value")
	}

	// Test case insensitive
	result3 := NewValidationResult()
	ValidateEnum("testEnum", "value1", allowed, false, result3)
	if result3.HasIssues() {
		t.Error("Should not have issues for valid enum value (case insensitive)")
	}
}

func TestCheckDuplicateIDs(t *testing.T) {
	result := NewValidationResult()
	ids := []string{"id1", "id2", "id1", "id3"}
	CheckDuplicateIDs(ids, result)
	if !result.HasErrors() {
		t.Error("Expected error for duplicate IDs")
	}
	if len(result.Errors) == 0 {
		t.Error("Expected at least one error for duplicate ID")
	}

	result2 := NewValidationResult()
	ids2 := []string{"id1", "id2", "id3"}
	CheckDuplicateIDs(ids2, result2)
	if result2.HasErrors() {
		t.Error("Should not have errors for unique IDs")
	}
}

func TestValidationResult(t *testing.T) {
	result := NewValidationResult()
	
	result.AddError("field1", "value1", "error message")
	result.AddWarning("field2", "value2", "warning message")
	result.AddInfo("field3", "value3", "info message")

	if !result.HasErrors() {
		t.Error("Expected HasErrors() to return true")
	}
	if !result.HasIssues() {
		t.Error("Expected HasIssues() to return true")
	}
	if len(result.Errors) != 1 {
		t.Errorf("Expected 1 error, got %d", len(result.Errors))
	}
	if len(result.Warnings) != 1 {
		t.Errorf("Expected 1 warning, got %d", len(result.Warnings))
	}
	if len(result.Info) != 1 {
		t.Errorf("Expected 1 info, got %d", len(result.Info))
	}

	summary := result.Summary()
	if summary == "" {
		t.Error("Expected non-empty summary")
	}
}

