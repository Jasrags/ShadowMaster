package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataDrugComponentCategories(t *testing.T) {
	assert.NotEmpty(t, DataDrugComponentCategories, "DataDrugComponentCategories should not be empty")
	assert.Contains(t, DataDrugComponentCategories, "Foundation")
	assert.Contains(t, DataDrugComponentCategories, "Block")
	assert.Contains(t, DataDrugComponentCategories, "Enhancer")
}

func TestDataDrugComponentGrades(t *testing.T) {
	assert.NotEmpty(t, DataDrugComponentGrades, "DataDrugComponentGrades should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Standard grade",
			id:           "standard",
			expectedName: "Standard",
			expectedSource: "CF",
		},
		{
			name:         "Pharmaceutical grade",
			id:           "pharmaceutical",
			expectedName: "Pharmaceutical",
			expectedSource: "CF",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			grade, ok := DataDrugComponentGrades[tt.id]
			require.True(t, ok, "Grade %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, grade.Name)
			assert.Equal(t, tt.expectedSource, grade.Source)
		})
	}
}

func TestDrugComponentGradeFields(t *testing.T) {
	grade, ok := DataDrugComponentGrades["standard"]
	require.True(t, ok, "Grade 'standard' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return grade.ID != "" }},
		{"Name", "Name", func() bool { return grade.Name != "" }},
		{"Cost", "Cost", func() bool { return grade.Cost != "" }},
		{"Source", "Source", func() bool { return grade.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestDataDrugs(t *testing.T) {
	assert.NotEmpty(t, DataDrugs, "DataDrugs should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Cram drug",
			id:           "cram",
			expectedName: "Cram",
			expectedSource: "SR5",
		},
		{
			name:         "Jazz drug",
			id:           "jazz",
			expectedName: "Jazz",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			drug, ok := DataDrugs[tt.id]
			require.True(t, ok, "Drug %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, drug.Name)
			assert.Equal(t, tt.expectedSource, drug.Source)
		})
	}
}

func TestDrugFields(t *testing.T) {
	drug, ok := DataDrugs["cram"]
	require.True(t, ok, "Drug 'cram' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return drug.ID != "" }},
		{"Name", "Name", func() bool { return drug.Name != "" }},
		{"Category", "Category", func() bool { return drug.Category != "" }},
		{"Source", "Source", func() bool { return drug.Source != "" }},
		{"Page", "Page", func() bool { return drug.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestDataDrugComponents(t *testing.T) {
	assert.NotEmpty(t, DataDrugComponents, "DataDrugComponents should not be empty")

	// Find any component to test
	var component *DrugComponent
	for _, c := range DataDrugComponents {
		component = &c
		break
	}
	
	require.NotNil(t, component, "Should have at least one drug component")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return component.ID != "" }},
		{"Name", "Name", func() bool { return component.Name != "" }},
		{"Category", "Category", func() bool { return component.Category != "" }},
		{"Source", "Source", func() bool { return component.Source != "" }},
		{"Page", "Page", func() bool { return component.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

