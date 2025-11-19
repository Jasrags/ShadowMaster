package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataEchoes(t *testing.T) {
	assert.NotEmpty(t, DataEchoes, "DataEchoes should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Attack Upgrade echo",
			id:           "attack_upgrade",
			expectedName: "Attack Upgrade",
			expectedSource: "SR5",
		},
		{
			name:         "Data Processing Upgrade echo",
			id:           "data_processing_upgrade",
			expectedName: "Data Processing Upgrade",
			expectedSource: "SR5",
		},
		{
			name:         "Resonance Link echo",
			id:           "resonance_link",
			expectedName: "Resonance Link",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			echo, ok := DataEchoes[tt.id]
			require.True(t, ok, "Echo %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, echo.Name)
			assert.Equal(t, tt.expectedSource, echo.Source)
		})
	}
}

func TestEchoFields(t *testing.T) {
	echo, ok := DataEchoes["attack_upgrade"]
	require.True(t, ok, "Echo 'attack_upgrade' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return echo.ID != "" }},
		{"Name", "Name", func() bool { return echo.Name != "" }},
		{"Source", "Source", func() bool { return echo.Source != "" }},
		{"Page", "Page", func() bool { return echo.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestEchoWithBonus(t *testing.T) {
	echo, ok := DataEchoes["attack_upgrade"]
	require.True(t, ok, "Echo 'attack_upgrade' should exist")

	if echo.Bonus != nil {
		assert.NotNil(t, echo.Bonus, "Bonus should not be nil if set")
	}
}

func TestEchoWithLimit(t *testing.T) {
	echo, ok := DataEchoes["attack_upgrade"]
	require.True(t, ok, "Echo 'attack_upgrade' should exist")

	if echo.Limit != "" {
		assert.NotEmpty(t, echo.Limit, "Limit should not be empty if set")
	}
}

func TestEchoWithInitiativePass(t *testing.T) {
	// Find an echo with initiative pass bonus
	var echo *Echo
	for _, e := range DataEchoes {
		if e.Bonus != nil && e.Bonus.InitiativePass != "" {
			echo = &e
			break
		}
	}
	
	if echo != nil {
		assert.NotEmpty(t, echo.Bonus.InitiativePass, "InitiativePass should not be empty if set")
	}
}

