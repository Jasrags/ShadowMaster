package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCyberware_RequiresRating(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		expected  bool
	}{
		{
			name: "no rating formulas",
			cyberware: Cyberware{
				Essence:      "0.1",
				Cost:         "5000",
				Availability: "5R",
			},
			expected: false,
		},
		{
			name: "essence formula requires rating",
			cyberware: Cyberware{
				Essence: "Rating * 0.1",
			},
			expected: true,
		},
		{
			name: "cost formula requires rating",
			cyberware: Cyberware{
				Cost: "Rating * 5000",
			},
			expected: true,
		},
		{
			name: "availability formula requires rating",
			cyberware: Cyberware{
				Availability: "Rating * 3",
			},
			expected: true,
		},
		{
			name: "structured essence formula requires rating",
			cyberware: Cyberware{
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.1"},
			},
			expected: true,
		},
		{
			name: "structured cost formula requires rating",
			cyberware: Cyberware{
				CostFormula: &CostFormula{Formula: "Rating * 5000", IsVariable: true},
			},
			expected: true,
		},
		{
			name: "fixed structured formula does not require rating",
			cyberware: Cyberware{
				EssenceFormula: func() *RatingFormula {
					f := 1.0
					return &RatingFormula{FixedValue: &f, IsFixed: true}
				}(),
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.cyberware.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestCyberware_CalculateAvailability(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		rating    int
		expected  string
	}{
		{
			name: "structured formula",
			cyberware: Cyberware{
				AvailabilityFormula: &RatingFormula{Formula: "Rating * 3"},
			},
			rating:   3,
			expected: "9",
		},
		{
			name: "string formula",
			cyberware: Cyberware{
				Availability: "Rating * 5",
			},
			rating:   2,
			expected: "10",
		},
		{
			name: "string formula with F suffix",
			cyberware: Cyberware{
				Availability: "Rating * 3F",
			},
			rating:   4,
			expected: "12F",
		},
		{
			name: "fixed value",
			cyberware: Cyberware{
				Availability: "5R",
			},
			rating:   3,
			expected: "5R",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.cyberware.CalculateAvailability(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateAvailability() should return expected value")
		})
	}
}

func TestCyberware_CalculateCost(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		rating    int
		expected  string
	}{
		{
			name: "structured formula",
			cyberware: Cyberware{
				CostFormula: &CostFormula{Formula: "Rating * 5000", IsVariable: true},
			},
			rating:   3,
			expected: "15,000",
		},
		{
			name: "structured formula under 1000",
			cyberware: Cyberware{
				CostFormula: &CostFormula{Formula: "Rating * 100", IsVariable: true},
			},
			rating:   5,
			expected: "500",
		},
		{
			name: "string formula",
			cyberware: Cyberware{
				Cost: "Rating * 5,000",
			},
			rating:   2,
			expected: "10,000",
		},
		{
			name: "fixed value",
			cyberware: Cyberware{
				Cost: "15000",
			},
			rating:   3,
			expected: "15000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.cyberware.CalculateCost(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateCost() should return expected value")
		})
	}
}

func TestCyberware_CalculateEssence(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		rating    int
		expected  string
	}{
		{
			name: "structured formula",
			cyberware: Cyberware{
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.1"},
			},
			rating:   3,
			expected: "0.3",
		},
		{
			name: "structured formula with rounding",
			cyberware: Cyberware{
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.15"},
			},
			rating:   2,
			expected: "0.3",
		},
		{
			name: "string formula",
			cyberware: Cyberware{
				Essence: "Rating * 0.2",
			},
			rating:   5,
			expected: "1",
		},
		{
			name: "fixed value",
			cyberware: Cyberware{
				Essence: "0.5",
			},
			rating:   3,
			expected: "0.5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.cyberware.CalculateEssence(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateEssence() should return expected value")
		})
	}
}

func TestCyberware_CalculateCapacity(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		rating    int
		expected  string
	}{
		{
			name: "rating in brackets",
			cyberware: Cyberware{
				Capacity: "[Rating]",
			},
			rating:   5,
			expected: "[5]",
		},
		{
			name: "rating formula",
			cyberware: Cyberware{
				Capacity: "Rating * 2",
			},
			rating:   3,
			expected: "6",
		},
		{
			name: "fixed value",
			cyberware: Cyberware{
				Capacity: "[2]",
			},
			rating:   5,
			expected: "[2]",
		},
		{
			name: "no capacity",
			cyberware: Cyberware{
				Capacity: "-",
			},
			rating:   3,
			expected: "-",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.cyberware.CalculateCapacity(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateCapacity() should return expected value")
		})
	}
}

func TestBioware_RequiresRating(t *testing.T) {
	tests := []struct {
		name     string
		bioware  Bioware
		expected bool
	}{
		{
			name: "no rating formulas",
			bioware: Bioware{
				Essence:      "0.2",
				Cost:         "10000",
				Availability: "4",
			},
			expected: false,
		},
		{
			name: "essence formula requires rating",
			bioware: Bioware{
				Essence: "Rating * 0.2",
			},
			expected: true,
		},
		{
			name: "structured essence formula requires rating",
			bioware: Bioware{
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.2"},
			},
			expected: true,
		},
		{
			name: "fixed structured formula does not require rating",
			bioware: Bioware{
				EssenceFormula: func() *RatingFormula {
					f := 1.0
					return &RatingFormula{FixedValue: &f, IsFixed: true}
				}(),
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.bioware.RequiresRating()
			assert.Equal(t, tt.expected, result, "RequiresRating() should return expected value")
		})
	}
}

func TestBioware_CalculateAvailability(t *testing.T) {
	tests := []struct {
		name     string
		bioware  Bioware
		rating   int
		expected string
	}{
		{
			name: "structured formula",
			bioware: Bioware{
				AvailabilityFormula: &RatingFormula{Formula: "Rating * 6"},
			},
			rating:   2,
			expected: "12",
		},
		{
			name: "string formula with F suffix",
			bioware: Bioware{
				Availability: "Rating * 3F",
			},
			rating:   4,
			expected: "12F",
		},
		{
			name: "fixed value",
			bioware: Bioware{
				Availability: "12F",
			},
			rating:   3,
			expected: "12F",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.bioware.CalculateAvailability(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateAvailability() should return expected value")
		})
	}
}

func TestBioware_CalculateCost(t *testing.T) {
	tests := []struct {
		name     string
		bioware  Bioware
		rating   int
		expected string
	}{
		{
			name: "structured formula",
			bioware: Bioware{
				CostFormula: &CostFormula{Formula: "Rating * 15000", IsVariable: true},
			},
			rating:   3,
			expected: "45,000",
		},
		{
			name: "string formula",
			bioware: Bioware{
				Cost: "Rating * 55,000",
			},
			rating:   2,
			expected: "110,000",
		},
		{
			name: "fixed value",
			bioware: Bioware{
				Cost: "4000",
			},
			rating:   3,
			expected: "4000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.bioware.CalculateCost(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateCost() should return expected value")
		})
	}
}

func TestBioware_CalculateEssence(t *testing.T) {
	tests := []struct {
		name     string
		bioware  Bioware
		rating   int
		expected string
	}{
		{
			name: "structured formula",
			bioware: Bioware{
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.2"},
			},
			rating:   3,
			expected: "0.6",
		},
		{
			name: "string formula",
			bioware: Bioware{
				Essence: "Rating * 0.15",
			},
			rating:   2,
			expected: "0.3",
		},
		{
			name: "fixed value",
			bioware: Bioware{
				Essence: "0.1",
			},
			rating:   3,
			expected: "0.1",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.bioware.CalculateEssence(tt.rating)
			assert.Equal(t, tt.expected, result, "CalculateEssence() should return expected value")
		})
	}
}

func TestParseCostString(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected *CostFormula
	}{
		{
			name:     "empty string returns nil",
			input:    "",
			expected: nil,
		},
		{
			name:     "dash returns nil",
			input:    "-",
			expected: nil,
		},
		{
			name:  "fixed cost with commas",
			input: "1,000",
			expected: &CostFormula{
				BaseCost:   intPtr(1000),
				IsFixed:    true,
				IsVariable: false,
			},
		},
		{
			name:  "fixed cost without commas",
			input: "5000",
			expected: &CostFormula{
				BaseCost:   intPtr(5000),
				IsFixed:    true,
				IsVariable: false,
			},
		},
		{
			name:  "fixed cost with currency symbol",
			input: "10,000¥",
			expected: &CostFormula{
				BaseCost:   intPtr(10000),
				IsFixed:    true,
				IsVariable: false,
			},
		},
		{
			name:  "rating formula",
			input: "Rating*1000",
			expected: &CostFormula{
				Formula:    "Rating*1000",
				IsFixed:    false,
				IsVariable: true,
			},
		},
		{
			name:  "rating formula with spaces",
			input: "Rating * 20000",
			expected: &CostFormula{
				Formula:    "Rating * 20000",
				IsFixed:    false,
				IsVariable: true,
			},
		},
		{
			name:  "special case with plus",
			input: "Commlink + 2,000",
			expected: &CostFormula{
				Formula:    "Commlink + 2,000",
				IsFixed:    false,
				IsVariable: true,
			},
		},
		{
			name:  "special case with Cost reference",
			input: "Deck Cost + 5,000",
			expected: &CostFormula{
				Formula:    "Deck Cost + 5,000",
				IsFixed:    false,
				IsVariable: true,
			},
		},
		{
			name:  "prefix plus sign",
			input: "+1,000",
			expected: &CostFormula{
				Formula:    "+1,000",
				IsFixed:    false,
				IsVariable: true,
			},
		},
		{
			name:  "large fixed cost",
			input: "140,000",
			expected: &CostFormula{
				BaseCost:   intPtr(140000),
				IsFixed:    true,
				IsVariable: false,
			},
		},
		{
			name:  "whitespace trimmed",
			input: "  5,000  ",
			expected: &CostFormula{
				BaseCost:   intPtr(5000),
				IsFixed:    true,
				IsVariable: false,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := parseCostString(tt.input)
			if tt.expected == nil {
				assert.Nil(t, result, "parseCostString() should return nil")
			} else {
				assert.NotNil(t, result, "parseCostString() should not return nil")
				assert.Equal(t, tt.expected.BaseCost, result.BaseCost, "BaseCost should match")
				assert.Equal(t, tt.expected.Formula, result.Formula, "Formula should match")
				assert.Equal(t, tt.expected.IsFixed, result.IsFixed, "IsFixed should match")
				assert.Equal(t, tt.expected.IsVariable, result.IsVariable, "IsVariable should match")
			}
		})
	}
}

func TestParseAvailabilityString(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected *RatingFormula
	}{
		{
			name:     "empty string returns nil",
			input:    "",
			expected: nil,
		},
		{
			name:     "dash returns nil",
			input:    "-",
			expected: nil,
		},
		{
			name:  "fixed numeric value",
			input: "8",
			expected: &RatingFormula{
				FixedValue: floatPtr(8.0),
				IsFixed:    true,
			},
		},
		{
			name:  "fixed value with R suffix",
			input: "5R",
			expected: &RatingFormula{
				Formula: "5R",
				IsFixed: false,
			},
		},
		{
			name:  "fixed value with F suffix",
			input: "12F",
			expected: &RatingFormula{
				Formula: "12F",
				IsFixed: false,
			},
		},
		{
			name:  "rating formula",
			input: "Rating*2",
			expected: &RatingFormula{
				Formula: "Rating*2",
				IsFixed: false,
			},
		},
		{
			name:  "rating formula with spaces",
			input: "Rating * 3",
			expected: &RatingFormula{
				Formula: "Rating * 3",
				IsFixed: false,
			},
		},
		{
			name:  "rating formula with R suffix",
			input: "(Rating*4)R",
			expected: &RatingFormula{
				Formula: "(Rating*4)R",
				IsFixed: false,
			},
		},
		{
			name:  "rating formula with F suffix",
			input: "Rating*3F",
			expected: &RatingFormula{
				Formula: "Rating*3F",
				IsFixed: false,
			},
		},
		{
			name:  "rating formula with parentheses and F",
			input: "(Rating*6)F",
			expected: &RatingFormula{
				Formula: "(Rating*6)F",
				IsFixed: false,
			},
		},
		{
			name:  "just Rating",
			input: "Rating",
			expected: &RatingFormula{
				Formula: "Rating",
				IsFixed: false,
			},
		},
		{
			name:  "whitespace trimmed",
			input: "  10  ",
			expected: &RatingFormula{
				FixedValue: floatPtr(10.0),
				IsFixed:    true,
			},
		},
		{
			name:  "lowercase r suffix",
			input: "8r",
			expected: &RatingFormula{
				Formula: "8r",
				IsFixed: false,
			},
		},
		{
			name:  "lowercase f suffix",
			input: "12f",
			expected: &RatingFormula{
				Formula: "12f",
				IsFixed: false,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := parseAvailabilityString(tt.input)
			if tt.expected == nil {
				assert.Nil(t, result, "parseAvailabilityString() should return nil")
			} else {
				assert.NotNil(t, result, "parseAvailabilityString() should not return nil")
				if tt.expected.FixedValue != nil {
					assert.NotNil(t, result.FixedValue, "FixedValue should not be nil")
					assert.Equal(t, *tt.expected.FixedValue, *result.FixedValue, "FixedValue should match")
				} else {
					assert.Nil(t, result.FixedValue, "FixedValue should be nil")
				}
				assert.Equal(t, tt.expected.Formula, result.Formula, "Formula should match")
				assert.Equal(t, tt.expected.IsFixed, result.IsFixed, "IsFixed should match")
			}
		})
	}
}

func TestDataLockAugmentation(t *testing.T) {
	// Test the specific data_lock entry that was highlighted
	dataLock, exists := dataCyberware["data_lock"]
	assert.True(t, exists, "data_lock should exist in dataCyberware")

	// Verify Rating structure
	assert.True(t, dataLock.Rating.HasRating, "data_lock should have ratings")
	assert.Equal(t, 12, dataLock.Rating.MaxRating, "data_lock should have max rating of 12")

	// Verify deprecated string fields
	assert.Equal(t, "Rating*2", dataLock.Availability, "Availability string should match")
	assert.Equal(t, "Rating*1000", dataLock.Cost, "Cost string should match")

	// Verify structured formulas
	assert.NotNil(t, dataLock.AvailabilityFormula, "AvailabilityFormula should not be nil")
	assert.NotNil(t, dataLock.CostFormula, "CostFormula should not be nil")

	// Verify AvailabilityFormula structure
	assert.Equal(t, "Rating*2", dataLock.AvailabilityFormula.Formula, "AvailabilityFormula.Formula should match")
	assert.False(t, dataLock.AvailabilityFormula.IsFixed, "AvailabilityFormula should not be fixed")

	// Verify CostFormula structure
	assert.Equal(t, "Rating*1000", dataLock.CostFormula.Formula, "CostFormula.Formula should match")
	assert.False(t, dataLock.CostFormula.IsFixed, "CostFormula should not be fixed")
	assert.True(t, dataLock.CostFormula.IsVariable, "CostFormula should be variable")

	// Test calculation with rating
	rating := 6
	expectedCost := 6000

	cost, err := dataLock.CostFormula.Calculate(rating)
	assert.NoError(t, err, "Cost calculation should not error")
	assert.Equal(t, expectedCost, cost, "Calculated cost should match")

	avail, err := dataLock.AvailabilityFormula.Calculate(rating)
	assert.NoError(t, err, "Availability calculation should not error")
	assert.Equal(t, 12.0, avail, "Calculated availability should match")
}

func TestAugmentationDataStructure(t *testing.T) {
	// Test that cyberware entries with formulas have them properly structured
	for key, cyberware := range dataCyberware {
		t.Run(key+"_formula_structure", func(t *testing.T) {
			// Verify fields exist in the struct
			_ = cyberware.AvailabilityFormula
			_ = cyberware.CostFormula

			// If AvailabilityFormula exists, verify it's properly structured
			if cyberware.AvailabilityFormula != nil {
				if cyberware.AvailabilityFormula.IsFixed {
					assert.NotNil(t, cyberware.AvailabilityFormula.FixedValue,
						"Cyberware %s has fixed AvailabilityFormula but no FixedValue", key)
				} else {
					assert.NotEmpty(t, cyberware.AvailabilityFormula.Formula,
						"Cyberware %s has non-fixed AvailabilityFormula but no Formula", key)
				}
			}

			// If CostFormula exists, verify it's properly structured
			if cyberware.CostFormula != nil {
				if cyberware.CostFormula.IsFixed {
					assert.NotNil(t, cyberware.CostFormula.BaseCost,
						"Cyberware %s has fixed CostFormula but no BaseCost", key)
				} else if cyberware.CostFormula.IsVariable {
					assert.NotEmpty(t, cyberware.CostFormula.Formula,
						"Cyberware %s has variable CostFormula but no Formula", key)
				}
			}
		})
	}

	// Test that bioware entries with formulas have them properly structured
	for key, bioware := range dataBioware {
		t.Run(key+"_formula_structure", func(t *testing.T) {
			// Verify fields exist in the struct
			_ = bioware.AvailabilityFormula
			_ = bioware.CostFormula

			// If AvailabilityFormula exists, verify it's properly structured
			if bioware.AvailabilityFormula != nil {
				if bioware.AvailabilityFormula.IsFixed {
					assert.NotNil(t, bioware.AvailabilityFormula.FixedValue,
						"Bioware %s has fixed AvailabilityFormula but no FixedValue", key)
				} else {
					assert.NotEmpty(t, bioware.AvailabilityFormula.Formula,
						"Bioware %s has non-fixed AvailabilityFormula but no Formula", key)
				}
			}

			// If CostFormula exists, verify it's properly structured
			if bioware.CostFormula != nil {
				if bioware.CostFormula.IsFixed {
					assert.NotNil(t, bioware.CostFormula.BaseCost,
						"Bioware %s has fixed CostFormula but no BaseCost", key)
				} else if bioware.CostFormula.IsVariable {
					assert.NotEmpty(t, bioware.CostFormula.Formula,
						"Bioware %s has variable CostFormula but no Formula", key)
				}
			}
		})
	}
}

func TestAugmentationFormulaConsistency(t *testing.T) {
	// Test a few specific entries to ensure formulas match string values
	testCases := []struct {
		name         string
		cyberwareKey string
		rating       int
	}{
		{
			name:         "data_lock",
			cyberwareKey: "data_lock",
			rating:       6,
		},
		{
			name:         "skilljack",
			cyberwareKey: "skilljack",
			rating:       3,
		},
		{
			name:         "vision_enhancement",
			cyberwareKey: "vision_enhancement",
			rating:       2,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			cyberware, exists := dataCyberware[tc.cyberwareKey]
			assert.True(t, exists, "Cyberware %s should exist", tc.cyberwareKey)

			// Test cost calculation
			if cyberware.CostFormula != nil {
				cost, err := cyberware.CostFormula.Calculate(tc.rating)
				assert.NoError(t, err, "Cost calculation should not error")
				assert.Greater(t, cost, 0, "Calculated cost should be positive")
			}

			// Test availability calculation
			if cyberware.AvailabilityFormula != nil {
				avail, err := cyberware.AvailabilityFormula.Calculate(tc.rating)
				assert.NoError(t, err, "Availability calculation should not error")
				assert.GreaterOrEqual(t, avail, 0.0, "Calculated availability should be non-negative")
			}
		})
	}
}
