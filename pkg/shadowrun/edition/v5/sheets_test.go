package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataSheetsByLanguage(t *testing.T) {
	assert.NotEmpty(t, DataSheetsByLanguage, "DataSheetsByLanguage should not be empty")

	// Check that we have multiple languages
	assert.Greater(t, len(DataSheetsByLanguage), 1, "Should have multiple language groups")

	// Check that each language group has sheets
	for _, langGroup := range DataSheetsByLanguage {
		assert.NotEmpty(t, langGroup.Lang, "Language code should not be empty")
		assert.NotEmpty(t, langGroup.Sheet, "Each language group should have sheets")
	}
}

func TestDataSheets(t *testing.T) {
	assert.NotEmpty(t, DataSheets, "DataSheets should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Calendar sheet",
			id:           "8b16e238-18c6-40e0-85ca-a3a6c1854bd9",
			expectedName: "Calendar",
		},
		{
			name:         "Shadowrun 5 sheet",
			id:           "c4e73b93-8372-4d65-ac7c-b3e30218ef6f",
			expectedName: "Shadowrun 5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			sheet, ok := DataSheets[tt.id]
			require.True(t, ok, "Sheet %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, sheet.Name)
		})
	}
}

func TestSheetFields(t *testing.T) {
	sheet, ok := DataSheets["8b16e238-18c6-40e0-85ca-a3a6c1854bd9"]
	require.True(t, ok, "Sheet '8b16e238-18c6-40e0-85ca-a3a6c1854bd9' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return sheet.ID != "" }},
		{"Name", "Name", func() bool { return sheet.Name != "" }},
		{"Filename", "Filename", func() bool { return sheet.Filename != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestSheetCount(t *testing.T) {
	// Verify we have a reasonable number of sheets
	assert.Greater(t, len(DataSheets), 50, "Should have many sheets")
	assert.Less(t, len(DataSheets), 200, "Should not have too many sheets")
}

