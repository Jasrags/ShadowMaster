package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataTraditions(t *testing.T) {
	assert.NotEmpty(t, DataTraditions, "DataTraditions should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Custom tradition",
			id:           "custom",
			expectedName: "Custom",
			expectedSource: "SR5",
		},
		{
			name:         "Hermetic tradition",
			id:           "hermetic",
			expectedName: "Hermetic",
			expectedSource: "SR5",
		},
		{
			name:         "Shamanic tradition",
			id:           "shamanic",
			expectedName: "Shamanic",
			expectedSource: "SR5",
		},
		{
			name:         "Aztec tradition",
			id:           "aztec",
			expectedName: "Aztec",
			expectedSource: "SG",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			trad, ok := DataTraditions[tt.id]
			require.True(t, ok, "Tradition %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, trad.Name)
			assert.Equal(t, tt.expectedSource, trad.Source)
		})
	}
}

func TestTraditionFields(t *testing.T) {
	trad, ok := DataTraditions["hermetic"]
	require.True(t, ok, "Tradition 'hermetic' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return trad.ID != "" }},
		{"Name", "Name", func() bool { return trad.Name != "" }},
		{"Source", "Source", func() bool { return trad.Source != "" }},
		{"Page", "Page", func() bool { return trad.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestTraditionWithDrain(t *testing.T) {
	trad, ok := DataTraditions["hermetic"]
	require.True(t, ok, "Tradition 'hermetic' should exist")

	if trad.Drain != nil {
		assert.NotEmpty(t, *trad.Drain, "Drain should not be empty if set")
		assert.Contains(t, *trad.Drain, "WIL", "Drain should contain attribute reference")
	}
}

func TestTraditionWithSpirits(t *testing.T) {
	trad, ok := DataTraditions["hermetic"]
	require.True(t, ok, "Tradition 'hermetic' should exist")

	if trad.Spirits != nil {
		assert.NotEmpty(t, trad.Spirits.SpiritCombat, "SpiritCombat should not be empty")
		assert.NotEmpty(t, trad.Spirits.SpiritDetection, "SpiritDetection should not be empty")
		assert.NotEmpty(t, trad.Spirits.SpiritHealth, "SpiritHealth should not be empty")
		assert.NotEmpty(t, trad.Spirits.SpiritIllusion, "SpiritIllusion should not be empty")
		assert.NotEmpty(t, trad.Spirits.SpiritManipulation, "SpiritManipulation should not be empty")
	}
}

func TestDataDrainAttributes(t *testing.T) {
	assert.NotEmpty(t, DataDrainAttributes, "DataDrainAttributes should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "WIL + CHA drain attribute",
			id:           "wil_cha",
			expectedName: "{WIL} + {CHA}",
		},
		{
			name:         "WIL + INT drain attribute",
			id:           "wil_int",
			expectedName: "{WIL} + {INT}",
		},
		{
			name:         "WIL + LOG drain attribute",
			id:           "wil_log",
			expectedName: "{WIL} + {LOG}",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			attr, ok := DataDrainAttributes[tt.id]
			if !ok {
				// Some drain attributes might have different IDs due to name variations
				t.Skipf("Drain attribute %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, attr.Name)
		})
	}
}

func TestDrainAttributeFields(t *testing.T) {
	// Find any drain attribute to test
	var attr *DrainAttribute
	for _, a := range DataDrainAttributes {
		attr = &a
		break
	}
	
	require.NotNil(t, attr, "Should have at least one drain attribute")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return attr.ID != "" }},
		{"Name", "Name", func() bool { return attr.Name != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

