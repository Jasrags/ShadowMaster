package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPowerCostFormula_Calculate(t *testing.T) {
	tests := []struct {
		name      string
		formula   PowerCostFormula
		level     int
		expected  float64
		expectErr bool
		errMsg    string
	}{
		{
			name: "fixed cost",
			formula: PowerCostFormula{
				BaseCost:  floatPtr(0.5),
				IsVariable: false,
			},
			level:     3,
			expected:  0.5,
			expectErr: false,
		},
		{
			name: "cost per level",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
				IsVariable:   true,
			},
			level:     4,
			expected:  1.0,
			expectErr: false,
		},
		{
			name: "base cost plus cost per level",
			formula: PowerCostFormula{
				BaseCost:     floatPtr(0.5),
				CostPerLevel: floatPtr(0.25),
				IsVariable:   true,
			},
			level:     3,
			expected:  1.25,
			expectErr: false,
		},
		{
			name: "level exceeds max level",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
				MaxLevel:     intPtr(3),
				IsVariable:   true,
			},
			level:     5,
			expected:  0,
			expectErr: true,
			errMsg:    "exceeds maximum level",
		},
		{
			name: "cost per item",
			formula: PowerCostFormula{
				CostPerItem: floatPtr(0.25),
				IsVariable:  true,
			},
			level:     4,
			expected:  1.0,
			expectErr: false,
		},
		{
			name: "additional cost",
			formula: PowerCostFormula{
				BaseCost:      floatPtr(0.5),
				AdditionalCost: floatPtr(0.25),
				IsVariable:    true,
			},
			level:     3,
			expected:  0.75,
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := tt.formula.Calculate(tt.level)
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

func TestPowerCostFormula_RequiresLevel(t *testing.T) {
	tests := []struct {
		name     string
		formula  PowerCostFormula
		expected bool
	}{
		{
			name: "fixed cost does not require level",
			formula: PowerCostFormula{
				BaseCost:  floatPtr(0.5),
				IsVariable: false,
			},
			expected: false,
		},
		{
			name: "cost per level requires level",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
				IsVariable:   true,
			},
			expected: true,
		},
		{
			name: "cost per item requires level",
			formula: PowerCostFormula{
				CostPerItem: floatPtr(0.25),
				IsVariable:  true,
			},
			expected: true,
		},
		{
			name: "formula with level keyword requires level",
			formula: PowerCostFormula{
				Formula:    "Level * 0.25",
				IsVariable: true,
			},
			expected: true,
		},
		{
			name: "formula with rating keyword requires level",
			formula: PowerCostFormula{
				Formula:    "Rating * 0.25",
				IsVariable: true,
			},
			expected: true,
		},
		{
			name: "formula without level or rating",
			formula: PowerCostFormula{
				Formula:    "0.5",
				IsVariable: true,
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.RequiresLevel()
			assert.Equal(t, tt.expected, result, "RequiresLevel() should return expected value")
		})
	}
}

func TestPowerCostFormula_IsValid(t *testing.T) {
	tests := []struct {
		name      string
		formula   PowerCostFormula
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid fixed cost",
			formula: PowerCostFormula{
				BaseCost:  floatPtr(0.5),
				IsVariable: false,
			},
			expectErr: false,
		},
		{
			name: "negative base cost",
			formula: PowerCostFormula{
				BaseCost:  floatPtr(-0.5),
				IsVariable: false,
			},
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name: "valid variable cost with cost per level",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
				IsVariable:   true,
			},
			expectErr: false,
		},
		{
			name: "valid variable cost with formula",
			formula: PowerCostFormula{
				Formula:    "Level * 0.25",
				IsVariable: true,
			},
			expectErr: false,
		},
		{
			name: "variable cost without components",
			formula: PowerCostFormula{
				IsVariable: true,
			},
			expectErr: true,
			errMsg:    "variable cost formula must have at least one cost component",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.formula.IsValid()
			if tt.expectErr {
				assert.Error(t, err, "IsValid() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "IsValid() should not return an error")
			}
		})
	}
}

func TestPowerCostFormula_GetMaxLevel(t *testing.T) {
	tests := []struct {
		name     string
		formula  PowerCostFormula
		expected int
	}{
		{
			name: "no max level",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
			},
			expected: 0,
		},
		{
			name: "max level 3",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.25),
				MaxLevel:     intPtr(3),
			},
			expected: 3,
		},
		{
			name: "max level 6",
			formula: PowerCostFormula{
				CostPerLevel: floatPtr(0.5),
				MaxLevel:     intPtr(6),
			},
			expected: 6,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.GetMaxLevel()
			assert.Equal(t, tt.expected, result, "GetMaxLevel() should return expected value")
		})
	}
}

