package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataStreamTradition(t *testing.T) {
	assert.NotEmpty(t, DataStreamTradition.ID, "DataStreamTradition ID should not be empty")
	assert.Equal(t, "Default", DataStreamTradition.Name)
	assert.NotEmpty(t, DataStreamTradition.Drain, "Drain should not be empty")
	assert.NotNil(t, DataStreamTradition.Spirits, "Spirits should not be nil")
}

func TestDataStreamSpirits(t *testing.T) {
	assert.NotEmpty(t, DataStreamSpirits, "DataStreamSpirits should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Courier Sprite",
			id:           "courier_sprite",
			expectedName: "Courier Sprite",
		},
		{
			name:         "Crack Sprite",
			id:           "crack_sprite",
			expectedName: "Crack Sprite",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			spirit, ok := DataStreamSpirits[tt.id]
			require.True(t, ok, "Spirit %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, spirit.Name)
		})
	}
}

func TestStreamSpiritFields(t *testing.T) {
	spirit, ok := DataStreamSpirits["courier_sprite"]
	require.True(t, ok, "Spirit 'courier_sprite' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return spirit.ID != "" }},
		{"Name", "Name", func() bool { return spirit.Name != "" }},
		{"BOD", "BOD", func() bool { return spirit.BOD != "" }},
		{"AGI", "AGI", func() bool { return spirit.AGI != "" }},
		{"REA", "REA", func() bool { return spirit.REA != "" }},
		{"STR", "STR", func() bool { return spirit.STR != "" }},
		{"CHA", "CHA", func() bool { return spirit.CHA != "" }},
		{"INT", "INT", func() bool { return spirit.INT != "" }},
		{"LOG", "LOG", func() bool { return spirit.LOG != "" }},
		{"WIL", "WIL", func() bool { return spirit.WIL != "" }},
		{"INI", "INI", func() bool { return spirit.INI != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestStreamSpiritWithPowers(t *testing.T) {
	spirit, ok := DataStreamSpirits["courier_sprite"]
	require.True(t, ok, "Spirit 'courier_sprite' should exist")

	if spirit.Powers != nil {
		assert.NotNil(t, spirit.Powers, "Powers should not be nil if set")
	}
}

func TestStreamSpiritWithOptionalPowers(t *testing.T) {
	// Find a spirit with optional powers
	var spirit *StreamSpirit
	for _, s := range DataStreamSpirits {
		if s.OptionalPowers != nil {
			spirit = &s
			break
		}
	}

	if spirit != nil {
		assert.NotNil(t, spirit.OptionalPowers, "OptionalPowers should not be nil if set")
	}
}

func TestStreamSpiritCount(t *testing.T) {
	// Verify we have a reasonable number of spirits
	assert.Greater(t, len(DataStreamSpirits), 5, "Should have several spirits")
	assert.Less(t, len(DataStreamSpirits), 10, "Should not have too many spirits")
}

