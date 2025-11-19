package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataComplexForms(t *testing.T) {
	assert.NotEmpty(t, DataComplexForms, "DataComplexForms should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedTarget string
	}{
		{
			name:         "Cleaner complex form",
			id:           "cleaner",
			expectedName: "Cleaner",
			expectedTarget: "Persona",
		},
		{
			name:         "Editor complex form",
			id:           "editor",
			expectedName: "Editor",
			expectedTarget: "File",
		},
		{
			name:         "Puppeteer complex form",
			id:           "puppeteer",
			expectedName: "Puppeteer",
			expectedTarget: "Device",
		},
		{
			name:         "Resonance Spike complex form",
			id:           "resonance_spike",
			expectedName: "Resonance Spike",
			expectedTarget: "Device",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cf, ok := DataComplexForms[tt.id]
			require.True(t, ok, "Complex form %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, cf.Name)
			assert.Equal(t, tt.expectedTarget, cf.Target)
		})
	}
}

func TestComplexFormFields(t *testing.T) {
	cf, ok := DataComplexForms["cleaner"]
	require.True(t, ok, "Complex form 'cleaner' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return cf.ID != "" }},
		{"Name", "Name", func() bool { return cf.Name != "" }},
		{"Target", "Target", func() bool { return cf.Target != "" }},
		{"Duration", "Duration", func() bool { return cf.Duration != "" }},
		{"FV", "FV", func() bool { return cf.FV != "" }},
		{"Source", "Source", func() bool { return cf.Source != "" }},
		{"Page", "Page", func() bool { return cf.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestComplexFormWithBonus(t *testing.T) {
	cf, ok := DataComplexForms["diffusion_of_matrix_attribute"]
	require.True(t, ok, "Complex form 'diffusion_of_matrix_attribute' should exist")

	if cf.Bonus != nil {
		assert.NotNil(t, cf.Bonus.SelectText, "SelectText should not be nil if Bonus is set")
		if cf.Bonus.SelectText != nil {
			assert.NotEmpty(t, cf.Bonus.SelectText.XML, "XML should not be empty")
			assert.NotEmpty(t, cf.Bonus.SelectText.XPath, "XPath should not be empty")
		}
	}
}

func TestComplexFormWithRequired(t *testing.T) {
	cf, ok := DataComplexForms["overdrive"]
	require.True(t, ok, "Complex form 'overdrive' should exist")

	if cf.Required != nil {
		assert.NotNil(t, cf.Required.OneOf, "OneOf should not be nil if Required is set")
		if cf.Required.OneOf != nil {
			assert.NotEmpty(t, cf.Required.OneOf.Quality, "Quality should not be empty")
		}
	}
}

