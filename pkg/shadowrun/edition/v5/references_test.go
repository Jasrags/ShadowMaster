package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataReferences(t *testing.T) {
	assert.NotEmpty(t, DataReferences, "DataReferences should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Another Night, Another Run reference",
			id:           "another_night_another_run",
			expectedName: "Another Night, Another Run",
			expectedSource: "SR5",
		},
		{
			name:         "Introduction reference",
			id:           "introduction",
			expectedName: "Introduction",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ref, ok := DataReferences[tt.id]
			require.True(t, ok, "Reference %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, ref.Name)
			assert.Equal(t, tt.expectedSource, ref.Source)
		})
	}
}

func TestReferenceFields(t *testing.T) {
	ref, ok := DataReferences["another_night_another_run"]
	require.True(t, ok, "Reference 'another_night_another_run' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return ref.ID != "" }},
		{"Name", "Name", func() bool { return ref.Name != "" }},
		{"Source", "Source", func() bool { return ref.Source != "" }},
		{"Page", "Page", func() bool { return ref.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestReferenceCount(t *testing.T) {
	// Verify we have a reasonable number of references
	assert.Greater(t, len(DataReferences), 900, "Should have many references")
	assert.Less(t, len(DataReferences), 1000, "Should not have too many references")
}

