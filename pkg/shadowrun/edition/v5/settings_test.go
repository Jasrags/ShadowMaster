package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataSettings(t *testing.T) {
	assert.NotEmpty(t, DataSettings, "DataSettings should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Standard setting",
			id:           "standard",
			expectedName: "Standard",
		},
		{
			name:         "Street Level setting",
			id:           "street_level",
			expectedName: "Street Level",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			setting, ok := DataSettings[tt.id]
			require.True(t, ok, "Setting %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, setting.Name)
		})
	}
}

func TestSettingFields(t *testing.T) {
	setting, ok := DataSettings["standard"]
	require.True(t, ok, "Setting 'standard' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return setting.ID != "" }},
		{"Name", "Name", func() bool { return setting.Name != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestSettingWithKarmaCost(t *testing.T) {
	// Find a setting with karma cost
	var setting *Setting
	for _, s := range DataSettings {
		if s.KarmaCost != nil {
			setting = &s
			break
		}
	}

	require.NotNil(t, setting, "Should have at least one setting with karma cost")
	assert.NotNil(t, setting.KarmaCost, "KarmaCost should not be nil")
	assert.NotEmpty(t, setting.KarmaCost.KarmaAttribute, "KarmaAttribute should not be empty")
}

func TestSettingCount(t *testing.T) {
	// Verify we have a reasonable number of settings
	assert.Greater(t, len(DataSettings), 30, "Should have many settings")
	assert.Less(t, len(DataSettings), 40, "Should not have too many settings")
}

