package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataCyberwareGrades(t *testing.T) {
	assert.NotEmpty(t, DataCyberwareGrades, "DataCyberwareGrades should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "None grade",
			id:           "none",
			expectedName: "None",
		},
		{
			name:         "Standard grade",
			id:           "standard",
			expectedName: "Standard",
		},
		{
			name:         "Alphaware grade",
			id:           "alphaware",
			expectedName: "Alphaware",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			grade, ok := DataCyberwareGrades[tt.id]
			require.True(t, ok, "Grade %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, grade.Name)
		})
	}
}

func TestDataCyberwareCategories(t *testing.T) {
	assert.NotEmpty(t, DataCyberwareCategories, "DataCyberwareCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Bodyware category",
			id:           "bodyware",
			expectedName: "Bodyware",
		},
		{
			name:         "Headware category",
			id:           "headware",
			expectedName: "Headware",
		},
		{
			name:         "Cyberlimb category",
			id:           "cyberlimb",
			expectedName: "Cyberlimb",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataCyberwareCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
		})
	}
}

func TestDataCyberwares(t *testing.T) {
	assert.NotEmpty(t, DataCyberwares, "DataCyberwares should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Essence Hole",
			id:           "essence_hole",
			expectedName: "Essence Hole",
		},
		{
			name:         "Datajack",
			id:           "datajack",
			expectedName: "Datajack",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cyberware, ok := DataCyberwares[tt.id]
			require.True(t, ok, "Cyberware %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, cyberware.Name)
		})
	}
}

func TestCyberwareGradeFields(t *testing.T) {
	grade, ok := DataCyberwareGrades["standard"]
	require.True(t, ok, "Grade 'standard' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Ess", "Ess", func() bool { return grade.Ess != "" }},
		{"Cost", "Cost", func() bool { return grade.Cost != "" }},
		{"DeviceRating", "DeviceRating", func() bool { return grade.DeviceRating != "" }},
		{"Source", "Source", func() bool { return grade.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestCyberwareFields(t *testing.T) {
	cyberware, ok := DataCyberwares["essence_hole"]
	require.True(t, ok, "Cyberware 'essence_hole' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return cyberware.Name != "" }},
		{"Category", "Category", func() bool { return cyberware.Category != "" }},
		{"Ess", "Ess", func() bool { return cyberware.Ess != "" }},
		{"Source", "Source", func() bool { return cyberware.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
