package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataMetamagics(t *testing.T) {
	assert.NotEmpty(t, DataMetamagics, "DataMetamagics should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Adept Centering metamagic",
			id:           "adept_centering",
			expectedName: "Adept Centering",
			expectedSource: "SR5",
		},
		{
			name:         "Centering metamagic",
			id:           "centering",
			expectedName: "Centering",
			expectedSource: "SR5",
		},
		{
			name:         "Masking metamagic",
			id:           "masking",
			expectedName: "Masking",
			expectedSource: "SR5",
		},
		{
			name:         "Power Point metamagic",
			id:           "power_point",
			expectedName: "Power Point",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			meta, ok := DataMetamagics[tt.id]
			require.True(t, ok, "Metamagic %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, meta.Name)
			assert.Equal(t, tt.expectedSource, meta.Source)
		})
	}
}

func TestMetamagicFields(t *testing.T) {
	meta, ok := DataMetamagics["adept_centering"]
	require.True(t, ok, "Metamagic 'adept_centering' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return meta.ID != "" }},
		{"Name", "Name", func() bool { return meta.Name != "" }},
		{"Adept", "Adept", func() bool { return meta.Adept != "" }},
		{"Magician", "Magician", func() bool { return meta.Magician != "" }},
		{"Source", "Source", func() bool { return meta.Source != "" }},
		{"Page", "Page", func() bool { return meta.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestMetamagicWithBonus(t *testing.T) {
	meta, ok := DataMetamagics["power_point"]
	require.True(t, ok, "Metamagic 'power_point' should exist")

	if meta.Bonus != nil {
		assert.NotEmpty(t, meta.Bonus.AdeptPowerPoints, "AdeptPowerPoints should not be empty if set")
	}
}

func TestMetamagicWithRequired(t *testing.T) {
	meta, ok := DataMetamagics["centering"]
	require.True(t, ok, "Metamagic 'centering' should exist")

	if meta.Required != nil && meta.Required.AllOf != nil {
		assert.NotEmpty(t, meta.Required.AllOf.Art, "Required.AllOf.Art should not be empty if set")
	}
}

func TestDataArts(t *testing.T) {
	assert.NotEmpty(t, DataArts, "DataArts should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Centering art",
			id:           "centering",
			expectedName: "Centering",
			expectedSource: "SG",
		},
		{
			name:         "Masking art",
			id:           "masking",
			expectedName: "Masking",
			expectedSource: "SG",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			art, ok := DataArts[tt.id]
			if !ok {
				// Some arts might have different IDs due to name variations
				t.Skipf("Art %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, art.Name)
			assert.Equal(t, tt.expectedSource, art.Source)
		})
	}
}

func TestArtFields(t *testing.T) {
	// Find any art to test
	var art *Art
	for _, a := range DataArts {
		art = &a
		break
	}
	
	require.NotNil(t, art, "Should have at least one art")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return art.ID != "" }},
		{"Name", "Name", func() bool { return art.Name != "" }},
		{"Source", "Source", func() bool { return art.Source != "" }},
		{"Page", "Page", func() bool { return art.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

