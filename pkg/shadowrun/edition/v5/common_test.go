package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCostFormula_RequiresRating(t *testing.T) {
	tests := []struct {
		name     string
		formula  CostFormula
		expected bool
	}{
		{
			name: "fixed cost does not require rating",
			formula: CostFormula{
				BaseCost: intPtr(15000),
				IsFixed:  true,
			},
			expected: false,
		},
		{
			name: "formula with rating requires rating",
			formula: CostFormula{
				Formula:   "Rating * 20000",
				IsVariable: true,
			},
			expected: true,
		},
		{
			name: "formula without rating does not require rating",
			formula: CostFormula{
				Formula:   "5000",
				IsVariable: true,
			},
			expected: false,
		},
		{
			name: "empty formula does not require rating",
			formula: CostFormula{
				Formula:   "",
				IsVariable: true,
			},
			expected: false,
		},
		{
			name: "base cost with IsVariable false does not require rating",
			formula: CostFormula{
				BaseCost:  intPtr(10000),
				IsVariable: false,
			},
			expected: false,
		},
		{
			name: "case insensitive rating detection",
			formula: CostFormula{
				Formula:   "rating * 3000",
				IsVariable: true,
			},
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestCostFormula_Calculate(t *testing.T) {
	tests := []struct {
		name      string
		formula   CostFormula
		rating    int
		expected  int
		expectErr bool
		errMsg    string
	}{
		{
			name: "fixed cost returns base cost",
			formula: CostFormula{
				BaseCost: intPtr(15000),
				IsFixed:  true,
			},
			rating:    5,
			expected:  15000,
			expectErr: false,
		},
		{
			name: "formula-based cost with rating",
			formula: CostFormula{
				Formula:   "Rating * 20000",
				IsVariable: true,
			},
			rating:    3,
			expected:  60000,
			expectErr: false,
		},
		{
			name: "formula with rating 1",
			formula: CostFormula{
				Formula:   "Rating * 5000",
				IsVariable: true,
			},
			rating:    1,
			expected:  5000,
			expectErr: false,
		},
		{
			name: "error when fixed cost specified but BaseCost is nil",
			formula: CostFormula{
				BaseCost: nil,
				IsFixed:  true,
			},
			rating:    5,
			expected:  0,
			expectErr: true,
			errMsg:    "fixed cost specified but BaseCost is nil",
		},
		{
			name: "error when no formula or base cost",
			formula: CostFormula{
				Formula:   "",
				IsVariable: true,
			},
			rating:    5,
			expected:  0,
			expectErr: true,
			errMsg:    "no formula or base cost specified",
		},
		{
			name: "formula with spaces works",
			formula: CostFormula{
				Formula:   "Rating * 3000",
				IsVariable: true,
			},
			rating:    4,
			expected:  12000,
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := tt.formula.Calculate(tt.rating)
			if tt.expectErr {
				assert.Error(t, err, "Calculate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Calculate() should not return an error")
				assert.Equal(t, tt.expected, result, "Calculate() should return expected cost")
			}
		})
	}
}

func TestCostFormula_IsValid(t *testing.T) {
	tests := []struct {
		name     string
		formula  CostFormula
		expected bool
	}{
		{
			name: "valid fixed cost",
			formula: CostFormula{
				BaseCost: intPtr(15000),
				IsFixed:  true,
			},
			expected: true,
		},
		{
			name: "invalid fixed cost with nil BaseCost",
			formula: CostFormula{
				BaseCost: nil,
				IsFixed:  true,
			},
			expected: false,
		},
		{
			name: "valid variable cost with formula",
			formula: CostFormula{
				Formula:   "Rating * 20000",
				IsVariable: true,
			},
			expected: true,
		},
		{
			name: "invalid variable cost with empty formula",
			formula: CostFormula{
				Formula:   "",
				IsVariable: true,
			},
			expected: false,
		},
		{
			name: "valid formula without IsVariable set",
			formula: CostFormula{
				Formula: "Rating * 5000",
			},
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.IsValid()
			assert.Equal(t, tt.expected, result, "IsValid() should return expected value")
		})
	}
}

func TestRatingFormula_RequiresRating(t *testing.T) {
	tests := []struct {
		name     string
		formula  RatingFormula
		expected bool
	}{
		{
			name: "fixed value does not require rating",
			formula: RatingFormula{
				FixedValue: floatPtr(0.2),
				IsFixed:    true,
			},
			expected: false,
		},
		{
			name: "formula with rating requires rating",
			formula: RatingFormula{
				Formula: "Rating * 0.1",
			},
			expected: true,
		},
		{
			name: "formula without rating does not require rating",
			formula: RatingFormula{
				Formula: "0.5",
			},
			expected: false,
		},
		{
			name: "case insensitive rating detection",
			formula: RatingFormula{
				Formula: "rating * 0.3",
			},
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestRatingFormula_Calculate(t *testing.T) {
	tests := []struct {
		name      string
		formula   RatingFormula
		rating    int
		expected  float64
		expectErr bool
		errMsg    string
	}{
		{
			name: "fixed value returns fixed value",
			formula: RatingFormula{
				FixedValue: floatPtr(0.2),
				IsFixed:    true,
			},
			rating:    5,
			expected:  0.2,
			expectErr: false,
		},
		{
			name: "formula-based calculation",
			formula: RatingFormula{
				Formula: "Rating * 0.1",
			},
			rating:    3,
			expected:  0.3,
			expectErr: false,
		},
		{
			name: "formula with decimal multiplier",
			formula: RatingFormula{
				Formula: "Rating * 0.25",
			},
			rating:    4,
			expected:  1.0,
			expectErr: false,
		},
		{
			name: "error when fixed value specified but FixedValue is nil",
			formula: RatingFormula{
				FixedValue: nil,
				IsFixed:    true,
			},
			rating:    5,
			expected:  0,
			expectErr: true,
			errMsg:    "fixed value specified but FixedValue is nil",
		},
		{
			name: "error when no formula or fixed value",
			formula: RatingFormula{
				Formula: "",
			},
			rating:    5,
			expected:  0,
			expectErr: true,
			errMsg:    "no formula or fixed value specified",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := tt.formula.Calculate(tt.rating)
			if tt.expectErr {
				assert.Error(t, err, "Calculate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Calculate() should not return an error")
				assert.InDelta(t, tt.expected, result, 0.001, "Calculate() should return expected value")
			}
		})
	}
}

func TestRatingFormula_IsValid(t *testing.T) {
	tests := []struct {
		name     string
		formula  RatingFormula
		expected bool
	}{
		{
			name: "valid fixed value",
			formula: RatingFormula{
				FixedValue: floatPtr(0.2),
				IsFixed:    true,
			},
			expected: true,
		},
		{
			name: "invalid fixed value with nil FixedValue",
			formula: RatingFormula{
				FixedValue: nil,
				IsFixed:    true,
			},
			expected: false,
		},
		{
			name: "valid formula",
			formula: RatingFormula{
				Formula: "Rating * 0.1",
			},
			expected: true,
		},
		{
			name: "invalid empty formula",
			formula: RatingFormula{
				Formula: "",
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.IsValid()
			assert.Equal(t, tt.expected, result, "IsValid() should return expected value")
		})
	}
}

func TestNewSourceReferenceFromString(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected *SourceReference
	}{
		{
			name:     "simple source",
			input:    "SR5",
			expected: &SourceReference{Source: "SR5"},
		},
		{
			name:     "source with page",
			input:    "SR5:HT",
			expected: &SourceReference{Source: "SR5:HT"},
		},
		{
			name:     "empty string returns nil",
			input:    "",
			expected: nil,
		},
		{
			name:     "whitespace string returns source with whitespace",
			input:    "   ",
			expected: &SourceReference{Source: "   "},
		},
		{
			name:     "source with colon",
			input:    "SR5:R&G",
			expected: &SourceReference{Source: "SR5:R&G"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := NewSourceReferenceFromString(tt.input)
			if tt.expected == nil {
				assert.Nil(t, result, "NewSourceReferenceFromString() should return nil for empty input")
			} else {
				assert.NotNil(t, result, "NewSourceReferenceFromString() should return non-nil")
				assert.Equal(t, tt.expected.Source, result.Source, "Source should match")
				assert.Equal(t, tt.expected.Page, result.Page, "Page should match")
			}
		})
	}
}

