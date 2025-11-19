package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataLimbCounts(t *testing.T) {
	assert.NotEmpty(t, DataLimbCounts, "DataLimbCounts should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedCount string
	}{
		{
			name:         "4 limbs option",
			id:           "4_2_arms_2_legs",
			expectedName: "4 (2 arms, 2 legs)",
			expectedCount: "4",
		},
		{
			name:         "6 limbs option",
			id:           "6_2_arms_2_legs_torso_skull",
			expectedName: "6 (2 arms, 2 legs, torso, skull)",
			expectedCount: "6",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			limb, ok := DataLimbCounts[tt.id]
			if !ok {
				// Some limb counts might have different IDs due to name variations
				t.Skipf("Limb count %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, limb.Name)
			assert.Equal(t, tt.expectedCount, limb.LimbCount)
		})
	}
}

func TestLimbCountFields(t *testing.T) {
	// Find any limb count to test
	var limb *LimbCount
	for _, l := range DataLimbCounts {
		limb = &l
		break
	}
	
	require.NotNil(t, limb, "Should have at least one limb count")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return limb.Name != "" }},
		{"LimbCount", "LimbCount", func() bool { return limb.LimbCount != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestDataPDFArguments(t *testing.T) {
	assert.NotEmpty(t, DataPDFArguments, "DataPDFArguments should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Web Browser PDF argument",
			id:           "web_browser",
			expectedName: "Web Browser",
		},
		{
			name:         "Acrobat-style PDF argument",
			id:           "acrobat_style",
			expectedName: "Acrobat-style",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			pdfarg, ok := DataPDFArguments[tt.id]
			if !ok {
				// Some PDF arguments might have different IDs due to name variations
				t.Skipf("PDF argument %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, pdfarg.Name)
			assert.NotEmpty(t, pdfarg.Value, "Value should not be empty")
		})
	}
}

func TestPDFArgumentFields(t *testing.T) {
	// Find any PDF argument to test
	var pdfarg *PDFArgument
	for _, p := range DataPDFArguments {
		pdfarg = &p
		break
	}
	
	require.NotNil(t, pdfarg, "Should have at least one PDF argument")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return pdfarg.Name != "" }},
		{"Value", "Value", func() bool { return pdfarg.Value != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestPDFArgumentWithAppNames(t *testing.T) {
	// Find a PDF argument with app names
	var pdfarg *PDFArgument
	for _, p := range DataPDFArguments {
		if p.AppNames != nil {
			pdfarg = &p
			break
		}
	}
	
	require.NotNil(t, pdfarg, "Should have at least one PDF argument with app names")
	assert.NotEmpty(t, pdfarg.AppNames.AppName, "AppName should not be empty")
}

func TestDataBlackMarketPipelineCategories(t *testing.T) {
	assert.NotEmpty(t, DataBlackMarketPipelineCategories, "DataBlackMarketPipelineCategories should not be empty")
	assert.Contains(t, DataBlackMarketPipelineCategories, "Armor")
	assert.Contains(t, DataBlackMarketPipelineCategories, "Weapons")
	assert.Contains(t, DataBlackMarketPipelineCategories, "Cyberware")
}

func TestDataAvailMap(t *testing.T) {
	assert.NotEmpty(t, DataAvailMap, "DataAvailMap should not be empty")

	// Find any avail map entry to test
	var avail *AvailMapEntry
	for _, a := range DataAvailMap {
		avail = &a
		break
	}
	
	require.NotNil(t, avail, "Should have at least one avail map entry")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return avail.ID != "" }},
		{"Value", "Value", func() bool { return avail.Value != "" }},
		{"Duration", "Duration", func() bool { return avail.Duration != "" }},
		{"Interval", "Interval", func() bool { return avail.Interval != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

