package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataRangeModifiers(t *testing.T) {
	assert.NotEmpty(t, DataRangeModifiers, "DataRangeModifiers should not be empty")

	tests := []struct {
		name         string
		key          string
		expectedValue string
	}{
		{
			name:         "Short range modifier",
			key:          "short",
			expectedValue: "0",
		},
		{
			name:         "Medium range modifier",
			key:          "medium",
			expectedValue: "-1",
		},
		{
			name:         "Long range modifier",
			key:          "long",
			expectedValue: "-3",
		},
		{
			name:         "Extreme range modifier",
			key:          "extreme",
			expectedValue: "-6",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			value, ok := DataRangeModifiers[tt.key]
			require.True(t, ok, "Range modifier %s should exist", tt.key)
			assert.Equal(t, tt.expectedValue, value)
		})
	}
}

func TestDataRanges(t *testing.T) {
	assert.NotEmpty(t, DataRanges, "DataRanges should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Tasers range",
			id:           "tasers",
			expectedName: "Tasers",
		},
		{
			name:         "Assault Rifles range",
			id:           "assault_rifles",
			expectedName: "Assault Rifles",
		},
		{
			name:         "Bows range",
			id:           "bows",
			expectedName: "Bows",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r, ok := DataRanges[tt.id]
			require.True(t, ok, "Range %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, r.Name)
		})
	}
}

func TestRangeFields(t *testing.T) {
	r, ok := DataRanges["tasers"]
	require.True(t, ok, "Range 'tasers' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return r.Name != "" }},
		{"Min", "Min", func() bool { return r.Min != "" }},
		{"Short", "Short", func() bool { return r.Short != "" }},
		{"Medium", "Medium", func() bool { return r.Medium != "" }},
		{"Long", "Long", func() bool { return r.Long != "" }},
		{"Extreme", "Extreme", func() bool { return r.Extreme != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestRangeWithFormulas(t *testing.T) {
	// Bows use formulas with {STR}
	r, ok := DataRanges["bows"]
	require.True(t, ok, "Range 'bows' should exist")

	assert.Contains(t, r.Short, "{STR}", "Bows short range should contain formula")
	assert.Contains(t, r.Medium, "{STR}", "Bows medium range should contain formula")
}

