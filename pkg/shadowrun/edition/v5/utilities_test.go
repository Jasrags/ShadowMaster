package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatCostWithCommas(t *testing.T) {
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
			name:     "small number under 1000",
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
			result := FormatCostWithCommas(tt.cost)
			assert.Equal(t, tt.expected, result, "FormatCostWithCommas() should return expected formatted string")
		})
	}
}

func TestParseAvailability(t *testing.T) {
	tests := []struct {
		name          string
		availStr      string
		expectedValue int
		expectedR     bool
		expectedF     bool
		expectErr     bool
		errMsg        string
	}{
		{
			name:          "simple availability",
			availStr:      "5",
			expectedValue: 5,
			expectedR:     false,
			expectedF:     false,
			expectErr:     false,
		},
		{
			name:          "availability with R suffix",
			availStr:      "5R",
			expectedValue: 5,
			expectedR:     true,
			expectedF:     false,
			expectErr:     false,
		},
		{
			name:          "availability with F suffix",
			availStr:      "12F",
			expectedValue: 12,
			expectedR:     false,
			expectedF:     true,
			expectErr:     false,
		},
		{
			name:          "availability with lowercase r",
			availStr:      "8r",
			expectedValue: 8,
			expectedR:     true,
			expectedF:     false,
			expectErr:     false,
		},
		{
			name:          "availability with lowercase f",
			availStr:      "10f",
			expectedValue: 10,
			expectedR:     false,
			expectedF:     true,
			expectErr:     false,
		},
		{
			name:          "empty string",
			availStr:      "",
			expectedValue: 0,
			expectedR:     false,
			expectedF:     false,
			expectErr:     false,
		},
		{
			name:          "dash",
			availStr:      "-",
			expectedValue: 0,
			expectedR:     false,
			expectedF:     false,
			expectErr:     false,
		},
		{
			name:          "formula with F suffix",
			availStr:      "(Rating * 3)F",
			expectedValue: 0,
			expectedR:     false,
			expectedF:     true,
			expectErr:     true,
			errMsg:        "availability contains formula",
		},
		{
			name:          "invalid format",
			availStr:      "invalid",
			expectedValue: 0,
			expectedR:     false,
			expectedF:     false,
			expectErr:     true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			value, restricted, forbidden, err := ParseAvailability(tt.availStr)
			if tt.expectErr {
				assert.Error(t, err, "ParseAvailability() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "ParseAvailability() should not return an error")
			}
			assert.Equal(t, tt.expectedValue, value, "Value should match expected")
			assert.Equal(t, tt.expectedR, restricted, "Restricted flag should match expected")
			assert.Equal(t, tt.expectedF, forbidden, "Forbidden flag should match expected")
		})
	}
}

func TestFormatAvailability(t *testing.T) {
	tests := []struct {
		name       string
		value      int
		restricted bool
		forbidden  bool
		expected   string
	}{
		{
			name:       "simple availability",
			value:      8,
			restricted: false,
			forbidden:  false,
			expected:   "8",
		},
		{
			name:       "availability with R",
			value:      5,
			restricted: true,
			forbidden:  false,
			expected:   "5R",
		},
		{
			name:       "availability with F",
			value:      12,
			restricted: false,
			forbidden:  true,
			expected:   "12F",
		},
		{
			name:       "forbidden takes precedence",
			value:      10,
			restricted: true,
			forbidden:  true,
			expected:   "10F",
		},
		{
			name:       "zero value",
			value:      0,
			restricted: false,
			forbidden:  false,
			expected:   "0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := FormatAvailability(tt.value, tt.restricted, tt.forbidden)
			assert.Equal(t, tt.expected, result, "FormatAvailability() should return expected formatted string")
		})
	}
}

func TestGetSourceString(t *testing.T) {
	tests := []struct {
		name     string
		source   *SourceReference
		expected string
	}{
		{
			name:     "nil SourceReference",
			source:   nil,
			expected: "",
		},
		{
			name: "valid SourceReference",
			source: &SourceReference{
				Source: "SR5",
			},
			expected: "SR5",
		},
		{
			name: "SourceReference with page",
			source: &SourceReference{
				Source: "SR5",
				Page:   "123",
			},
			expected: "SR5",
		},
		{
			name: "empty source",
			source: &SourceReference{
				Source: "",
			},
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetSourceString(tt.source)
			assert.Equal(t, tt.expected, result, "GetSourceString() should return expected string")
		})
	}
}

func TestGetSourceWithPage(t *testing.T) {
	tests := []struct {
		name     string
		source   *SourceReference
		expected string
	}{
		{
			name:     "nil SourceReference",
			source:   nil,
			expected: "",
		},
		{
			name: "SourceReference without page",
			source: &SourceReference{
				Source: "SR5",
			},
			expected: "SR5",
		},
		{
			name: "SourceReference with page",
			source: &SourceReference{
				Source: "SR5",
				Page:   "123",
			},
			expected: "SR5 p. 123",
		},
		{
			name: "empty source",
			source: &SourceReference{
				Source: "",
			},
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetSourceWithPage(tt.source)
			assert.Equal(t, tt.expected, result, "GetSourceWithPage() should return expected string")
		})
	}
}

func TestValidateRating(t *testing.T) {
	tests := []struct {
		name      string
		rating    int
		minRating int
		maxRating int
		expectErr bool
		errMsg    string
	}{
		{
			name:      "valid rating within range",
			rating:    5,
			minRating: 1,
			maxRating: 10,
			expectErr: false,
		},
		{
			name:      "rating at minimum",
			rating:    1,
			minRating: 1,
			maxRating: 10,
			expectErr: false,
		},
		{
			name:      "rating at maximum",
			rating:    10,
			minRating: 1,
			maxRating: 10,
			expectErr: false,
		},
		{
			name:      "rating exceeds maximum",
			rating:    11,
			minRating: 1,
			maxRating: 10,
			expectErr: true,
			errMsg:    "exceeds maximum rating",
		},
		{
			name:      "rating below minimum",
			rating:    0,
			minRating: 1,
			maxRating: 10,
			expectErr: true,
			errMsg:    "below minimum rating",
		},
		{
			name:      "negative rating",
			rating:    -1,
			minRating: 0,
			maxRating: 10,
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name:      "no max rating limit",
			rating:    100,
			minRating: 1,
			maxRating: 0,
			expectErr: false,
		},
		{
			name:      "zero rating with no minimum",
			rating:    0,
			minRating: 0,
			maxRating: 0,
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateRating(tt.rating, tt.minRating, tt.maxRating)
			if tt.expectErr {
				assert.Error(t, err, "ValidateRating() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "ValidateRating() should not return an error")
			}
		})
	}
}

func TestValidateCost(t *testing.T) {
	tests := []struct {
		name      string
		cost      int
		expectErr bool
		errMsg    string
	}{
		{
			name:      "valid positive cost",
			cost:      1000,
			expectErr: false,
		},
		{
			name:      "zero cost",
			cost:      0,
			expectErr: false,
		},
		{
			name:      "negative cost",
			cost:      -100,
			expectErr: true,
			errMsg:    "cannot be negative",
		},
		{
			name:      "large positive cost",
			cost:      1000000,
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateCost(tt.cost)
			if tt.expectErr {
				assert.Error(t, err, "ValidateCost() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "ValidateCost() should not return an error")
			}
		})
	}
}

func TestCalculateRatingFormula(t *testing.T) {
	tests := []struct {
		name      string
		formula   string
		rating    int
		expected  float64
		expectErr bool
	}{
		{
			name:      "Rating * 3",
			formula:   "Rating * 3",
			rating:    5,
			expected:  15.0,
			expectErr: false,
		},
		{
			name:      "Rating * 0.1",
			formula:   "Rating * 0.1",
			rating:    3,
			expected:  0.3,
			expectErr: false,
		},
		{
			name:      "invalid formula",
			formula:   "invalid",
			rating:    5,
			expected:  0,
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := CalculateRatingFormula(tt.formula, tt.rating)
			if tt.expectErr {
				assert.Error(t, err, "CalculateRatingFormula() should return an error")
			} else {
				assert.NoError(t, err, "CalculateRatingFormula() should not return an error")
				assert.InDelta(t, tt.expected, result, 0.001, "CalculateRatingFormula() should return expected value")
			}
		})
	}
}

func TestCalculateCostFormula(t *testing.T) {
	tests := []struct {
		name      string
		formula   string
		rating    int
		expected  int
		expectErr bool
	}{
		{
			name:      "Rating * 20000",
			formula:   "Rating * 20000",
			rating:    3,
			expected:  60000,
			expectErr: false,
		},
		{
			name:      "Rating * 5000",
			formula:   "Rating * 5000",
			rating:    1,
			expected:  5000,
			expectErr: false,
		},
		{
			name:      "invalid formula",
			formula:   "invalid",
			rating:    5,
			expected:  0,
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := CalculateCostFormula(tt.formula, tt.rating)
			if tt.expectErr {
				assert.Error(t, err, "CalculateCostFormula() should return an error")
			} else {
				assert.NoError(t, err, "CalculateCostFormula() should not return an error")
				assert.Equal(t, tt.expected, result, "CalculateCostFormula() should return expected cost")
			}
		})
	}
}

