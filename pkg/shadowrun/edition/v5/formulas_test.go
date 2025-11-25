package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormulaCalculator_ParseRatingFormula(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name      string
		formula   string
		rating    int
		expected  float64
		expectErr bool
		errMsg    string
	}{
		{
			name:      "Rating * 3",
			formula:   "Rating * 3",
			rating:    5,
			expected:  15.0,
			expectErr: false,
		},
		{
			name:      "Rating*5000 (no spaces)",
			formula:   "Rating*5000",
			rating:    3,
			expected:  15000.0,
			expectErr: false,
		},
		{
			name:      "(Rating*4)R (with parentheses and suffix)",
			formula:   "(Rating*4)R",
			rating:    2,
			expected:  8.0,
			expectErr: false,
		},
		{
			name:      "Rating * 0.1 (decimal multiplier)",
			formula:   "Rating * 0.1",
			rating:    5,
			expected:  0.5,
			expectErr: false,
		},
		{
			name:      "Rating*0.25 (decimal, no spaces)",
			formula:   "Rating*0.25",
			rating:    4,
			expected:  1.0,
			expectErr: false,
		},
		{
			name:      "fixed value without rating",
			formula:   "15000",
			rating:    5,
			expected:  15000.0,
			expectErr: false,
		},
		{
			name:      "fixed value with comma",
			formula:   "15,000",
			rating:    5,
			expected:  15000.0,
			expectErr: false,
		},
		{
			name:      "fixed value with currency symbol",
			formula:   "15000¥",
			rating:    5,
			expected:  15000.0,
			expectErr: false,
		},
		{
			name:      "invalid formula",
			formula:   "invalid formula",
			rating:    5,
			expected:  0,
			expectErr: true,
		},
		{
			name:      "empty formula",
			formula:   "",
			rating:    5,
			expected:  0,
			expectErr: true,
		},
		{
			name:      "Rating with comma in multiplier",
			formula:   "Rating * 5,000",
			rating:    2,
			expected:  10000.0,
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			fn, err := calc.ParseRatingFormula(tt.formula)
			if tt.expectErr {
				assert.Error(t, err, "ParseRatingFormula() should return an error")
			} else {
				assert.NoError(t, err, "ParseRatingFormula() should not return an error")
				if err == nil {
					result := fn(tt.rating)
					assert.InDelta(t, tt.expected, result, 0.001, "Parsed function should return expected value")
				}
			}
		})
	}
}

func TestFormulaCalculator_EvaluateFormula(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name      string
		formula   string
		vars      map[string]interface{}
		expected  float64
		expectErr bool
		errMsg    string
	}{
		{
			name:      "Rating variable",
			formula:   "Rating * 3",
			vars:      map[string]interface{}{"Rating": 5},
			expected:  15.0,
			expectErr: false,
		},
		{
			name:      "Rating variable with decimal",
			formula:   "Rating * 0.5",
			vars:      map[string]interface{}{"Rating": 4},
			expected:  2.0,
			expectErr: false,
		},
		{
			name:      "Level variable not supported",
			formula:   "Level * 1000",
			vars:      map[string]interface{}{"Level": 3},
			expected:  0,
			expectErr: true,
		},
		{
			name:      "multiple variables not supported",
			formula:   "Rating * Level",
			vars:      map[string]interface{}{"Rating": 2, "Level": 5},
			expected:  0,
			expectErr: true,
		},
		{
			name:      "missing variable",
			formula:   "Rating * 3",
			vars:      map[string]interface{}{},
			expected:  0,
			expectErr: true,
		},
		{
			name:      "invalid formula",
			formula:   "invalid * formula",
			vars:      map[string]interface{}{"Rating": 5},
			expected:  0,
			expectErr: true,
		},
		{
			name:      "empty formula",
			formula:   "",
			vars:      map[string]interface{}{"Rating": 5},
			expected:  0,
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := calc.EvaluateFormula(tt.formula, tt.vars)
			if tt.expectErr {
				assert.Error(t, err, "EvaluateFormula() should return an error")
			} else {
				assert.NoError(t, err, "EvaluateFormula() should not return an error")
				if err == nil {
					assert.InDelta(t, tt.expected, result, 0.001, "EvaluateFormula() should return expected value")
				}
			}
		})
	}
}

func TestFormulaCalculator_FormatCost(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name     string
		cost     int
		expected string
	}{
		{
			name:     "zero",
			cost:     0,
			expected: "0",
		},
		{
			name:     "small number",
			cost:     999,
			expected: "999",
		},
		{
			name:     "exactly 1000",
			cost:     1000,
			expected: "1,000",
		},
		{
			name:     "15000",
			cost:     15000,
			expected: "15,000",
		},
		{
			name:     "1000000",
			cost:     1000000,
			expected: "1,000,000",
		},
		{
			name:     "1234567",
			cost:     1234567,
			expected: "1,234,567",
		},
		{
			name:     "negative cost",
			cost:     -1000,
			expected: "-1,000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := calc.FormatCost(tt.cost)
			assert.Equal(t, tt.expected, result, "FormatCost() should return expected formatted string")
		})
	}
}

func TestFormulaCalculator_FormatCostFloat(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name      string
		cost      float64
		precision int
		expected  string
	}{
		{
			name:      "integer cost with precision 0",
			cost:      15000.0,
			precision: 0,
			expected:  "15,000",
		},
		{
			name:      "cost with decimals, precision 1",
			cost:      15000.5,
			precision: 1,
			expected:  "15,000.5",
		},
		{
			name:      "cost with decimals, precision 2",
			cost:      15000.55,
			precision: 2,
			expected:  "15,000.55",
		},
		{
			name:      "small decimal cost",
			cost:      0.5,
			precision: 1,
			expected:  "0.5",
		},
		{
			name:      "cost with many decimals",
			cost:      1234.567,
			precision: 3,
			expected:  "1,234.567",
		},
		{
			name:      "zero cost",
			cost:      0.0,
			precision: 0,
			expected:  "0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := calc.FormatCostFloat(tt.cost, tt.precision)
			assert.Equal(t, tt.expected, result, "FormatCostFloat() should return expected formatted string")
		})
	}
}

func TestFormulaCalculator_NormalizeFormula(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name     string
		formula  string
		expected string
	}{
		{
			name:     "formula with spaces",
			formula:  "Rating * 3",
			expected: "Rating*3",
		},
		{
			name:     "formula already normalized",
			formula:  "Rating*3",
			expected: "Rating*3",
		},
		{
			name:     "formula with commas",
			formula:  "Rating * 5,000",
			expected: "Rating*5000",
		},
		{
			name:     "formula with parentheses",
			formula:  "(Rating * 4)R",
			expected: "(Rating*4)R",
		},
		{
			name:     "formula without rating",
			formula:  "15000",
			expected: "15000",
		},
		{
			name:     "empty formula",
			formula:  "",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := calc.NormalizeFormula(tt.formula)
			assert.Equal(t, tt.expected, result, "NormalizeFormula() should return expected normalized string")
		})
	}
}

func TestFormulaCalculator_RequiresRating(t *testing.T) {
	calc := NewFormulaCalculator()

	tests := []struct {
		name     string
		formula  string
		expected bool
	}{
		{
			name:     "formula with Rating",
			formula:  "Rating * 3",
			expected: true,
		},
		{
			name:     "formula with rating (lowercase)",
			formula:  "rating * 3",
			expected: true,
		},
		{
			name:     "formula with RATING (uppercase)",
			formula:  "RATING * 3",
			expected: true,
		},
		{
			name:     "formula without rating",
			formula:  "15000",
			expected: false,
		},
		{
			name:     "formula with word containing rating",
			formula:  "ratingValue * 3",
			expected: true,
		},
		{
			name:     "empty formula",
			formula:  "",
			expected: false,
		},
		{
			name:     "formula with level instead of rating",
			formula:  "Level * 3",
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := calc.RequiresRating(tt.formula)
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

