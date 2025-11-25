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


