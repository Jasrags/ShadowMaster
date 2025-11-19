package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataProgramCategories(t *testing.T) {
	assert.NotEmpty(t, DataProgramCategories, "DataProgramCategories should not be empty")
	assert.GreaterOrEqual(t, len(DataProgramCategories), 5, "Should have at least 5 categories")
}

func TestDataPrograms(t *testing.T) {
	assert.NotEmpty(t, DataPrograms, "DataPrograms should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedCategory string
	}{
		{
			name:         "Browse program",
			id:           "browse",
			expectedName: "Browse",
			expectedCategory: "Common Programs",
		},
		{
			name:         "Armor program",
			id:           "armor",
			expectedName: "Armor",
			expectedCategory: "Hacking Programs",
		},
		{
			name:         "Baby Monitor program",
			id:           "baby_monitor",
			expectedName: "Baby Monitor",
			expectedCategory: "Hacking Programs",
		},
		{
			name:         "Decryption program",
			id:           "decryption",
			expectedName: "Decryption",
			expectedCategory: "Hacking Programs",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			program, ok := DataPrograms[tt.id]
			require.True(t, ok, "Program %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, program.Name)
			assert.Equal(t, tt.expectedCategory, program.Category)
		})
	}
}

func TestProgramFields(t *testing.T) {
	program, ok := DataPrograms["browse"]
	require.True(t, ok, "Program 'browse' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return program.ID != "" }},
		{"Name", "Name", func() bool { return program.Name != "" }},
		{"Category", "Category", func() bool { return program.Category != "" }},
		{"Avail", "Avail", func() bool { return program.Avail != "" }},
		{"Cost", "Cost", func() bool { return program.Cost != "" }},
		{"Source", "Source", func() bool { return program.Source != "" }},
		{"Page", "Page", func() bool { return program.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

