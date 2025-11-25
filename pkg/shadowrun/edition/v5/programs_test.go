package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAgentCostFormula_Calculate(t *testing.T) {
	tests := []struct {
		name      string
		formula   AgentCostFormula
		rating    int
		expected  int
		expectErr bool
		errMsg    string
	}{
		{
			name: "cost per rating",
			formula: AgentCostFormula{
				CostPerRating: 1000,
			},
			rating:    3,
			expected:  3000,
			expectErr: false,
		},
		{
			name: "cost per rating rating 1",
			formula: AgentCostFormula{
				CostPerRating: 1000,
			},
			rating:    1,
			expected:  1000,
			expectErr: false,
		},
		{
			name: "cost per rating rating 6",
			formula: AgentCostFormula{
				CostPerRating: 2000,
			},
			rating:    6,
			expected:  12000,
			expectErr: false,
		},
		{
			name: "formula-based cost",
			formula: AgentCostFormula{
				Formula: "Rating * 1000",
			},
			rating:    3,
			expected:  3000,
			expectErr: false,
		},
		{
			name: "negative rating",
			formula: AgentCostFormula{
				CostPerRating: 1000,
			},
			rating:    -1,
			expected:  0,
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name: "no formula specified",
			formula: AgentCostFormula{},
			rating:    3,
			expected:  0,
			expectErr: true,
			errMsg:    "no cost formula specified",
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
				assert.Equal(t, tt.expected, result, "Calculate() should return expected value")
			}
		})
	}
}

func TestAgentCostFormula_RequiresRating(t *testing.T) {
	tests := []struct {
		name     string
		formula  AgentCostFormula
		expected bool
	}{
		{
			name: "cost per rating requires rating",
			formula: AgentCostFormula{
				CostPerRating: 1000,
			},
			expected: true,
		},
		{
			name: "formula with rating requires rating",
			formula: AgentCostFormula{
				Formula: "Rating * 1000",
			},
			expected: true,
		},
		{
			name: "formula without rating",
			formula: AgentCostFormula{
				Formula: "5000",
			},
			expected: false,
		},
		{
			name: "no formula",
			formula: AgentCostFormula{},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestAgentCostFormula_IsValid(t *testing.T) {
	tests := []struct {
		name      string
		formula   AgentCostFormula
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid cost per rating",
			formula: AgentCostFormula{
				CostPerRating: 1000,
			},
			expectErr: false,
		},
		{
			name: "valid formula",
			formula: AgentCostFormula{
				Formula: "Rating * 1000",
			},
			expectErr: false,
		},
		{
			name: "negative cost per rating",
			formula: AgentCostFormula{
				CostPerRating: -1000,
			},
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name: "no formula specified",
			formula: AgentCostFormula{},
			expectErr: true,
			errMsg:    "must specify either CostPerRating or Formula",
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

func TestAgentAvailabilityFormula_Calculate(t *testing.T) {
	tests := []struct {
		name      string
		formula   AgentAvailabilityFormula
		rating    int
		expected  int
		expectErr bool
		errMsg    string
	}{
		{
			name: "availability per rating",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			rating:    3,
			expected:  9,
			expectErr: false,
		},
		{
			name: "availability per rating rating 1",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			rating:    1,
			expected:  3,
			expectErr: false,
		},
		{
			name: "availability per rating rating 6",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			rating:    6,
			expected:  18,
			expectErr: false,
		},
		{
			name: "formula-based availability",
			formula: AgentAvailabilityFormula{
				Formula: "Rating * 3",
			},
			rating:    4,
			expected:  12,
			expectErr: false,
		},
		{
			name: "negative rating",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			rating:    -1,
			expected:  0,
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name: "no formula specified",
			formula: AgentAvailabilityFormula{},
			rating:    3,
			expected:  0,
			expectErr: true,
			errMsg:    "no availability formula specified",
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
				assert.Equal(t, tt.expected, result, "Calculate() should return expected value")
			}
		})
	}
}

func TestAgentAvailabilityFormula_RequiresRating(t *testing.T) {
	tests := []struct {
		name     string
		formula  AgentAvailabilityFormula
		expected bool
	}{
		{
			name: "availability per rating requires rating",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			expected: true,
		},
		{
			name: "formula with rating requires rating",
			formula: AgentAvailabilityFormula{
				Formula: "Rating * 3",
			},
			expected: true,
		},
		{
			name: "formula without rating",
			formula: AgentAvailabilityFormula{
				Formula: "12",
			},
			expected: false,
		},
		{
			name: "no formula",
			formula: AgentAvailabilityFormula{},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.formula.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestAgentAvailabilityFormula_IsValid(t *testing.T) {
	tests := []struct {
		name      string
		formula   AgentAvailabilityFormula
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid availability per rating",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: 3,
			},
			expectErr: false,
		},
		{
			name: "valid formula",
			formula: AgentAvailabilityFormula{
				Formula: "Rating * 3",
			},
			expectErr: false,
		},
		{
			name: "negative availability per rating",
			formula: AgentAvailabilityFormula{
				AvailabilityPerRating: -3,
			},
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name: "no formula specified",
			formula: AgentAvailabilityFormula{},
			expectErr: true,
			errMsg:    "must specify either AvailabilityPerRating or Formula",
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

