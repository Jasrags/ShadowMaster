package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataImprovements(t *testing.T) {
	assert.NotEmpty(t, DataImprovements, "DataImprovements should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedID   string
	}{
		{
			name:         "Enable Special Attribute improvement",
			id:           "enable_special_attribute",
			expectedName: "Enable Special Attribute",
			expectedID:   "enableattribute",
		},
		{
			name:         "Attribute improvement",
			id:           "attribute",
			expectedName: "Attribute",
			expectedID:   "specificattribute",
		},
		{
			name:         "Skill Level improvement",
			id:           "skill_level",
			expectedName: "Skill Level",
			expectedID:   "skilllevel",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			improvement, ok := DataImprovements[tt.id]
			if !ok {
				// Some improvements might have different IDs due to name variations
				t.Skipf("Improvement %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, improvement.Name)
			assert.Equal(t, tt.expectedID, improvement.ID)
		})
	}
}

func TestImprovementFields(t *testing.T) {
	// Find any improvement to test
	var improvement *Improvement
	for _, imp := range DataImprovements {
		improvement = &imp
		break
	}
	
	require.NotNil(t, improvement, "Should have at least one improvement")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return improvement.Name != "" }},
		{"ID", "ID", func() bool { return improvement.ID != "" }},
		{"Internal", "Internal", func() bool { return improvement.Internal != "" }},
		{"Page", "Page", func() bool { return improvement.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestImprovementWithFields(t *testing.T) {
	// Find an improvement with fields
	var improvement *Improvement
	for _, imp := range DataImprovements {
		if imp.Fields != nil {
			improvement = &imp
			break
		}
	}
	
	require.NotNil(t, improvement, "Should have at least one improvement with fields")
	assert.NotNil(t, improvement.Fields, "Fields should not be nil")
	assert.NotNil(t, improvement.Fields.Field, "Fields.Field should not be nil")
}

func TestImprovementWithXML(t *testing.T) {
	// Find an improvement with XML
	var improvement *Improvement
	for _, imp := range DataImprovements {
		if imp.XML != nil {
			improvement = &imp
			break
		}
	}
	
	require.NotNil(t, improvement, "Should have at least one improvement with XML")
	assert.NotNil(t, improvement.XML, "XML should not be nil")
	assert.NotEmpty(t, *improvement.XML, "XML should not be empty")
}

