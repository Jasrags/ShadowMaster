package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
)

func TestValidateSumToTenSelection(t *testing.T) {
	baseData := func() *domain.CharacterCreationData {
		return &domain.CharacterCreationData{
			CreationMethods: map[string]domain.CreationMethod{
				"sum_to_ten": {
					PointBudget:   10,
					PriorityCosts: map[string]int{"A": 4, "B": 3, "C": 2, "D": 1, "E": 0},
				},
			},
		}
	}

	validSelection := SumToTenSelection{
		"magic":      "B",
		"metatype":   "A",
		"attributes": "C",
		"skills":     "D",
		"resources":  "E",
	}

	testCases := []struct {
		name      string
		data      func() *domain.CharacterCreationData
		selection SumToTenSelection
		wantErr   error
		expectErr bool
	}{
		{
			name:      "valid selection",
			data:      baseData,
			selection: validSelection,
		},
		{
			name: "missing category",
			data: baseData,
			selection: SumToTenSelection{
				"magic":      "A",
				"metatype":   "A",
				"attributes": "B",
				"skills":     "C",
			},
			wantErr:   ErrSumToTenMissingCategory,
			expectErr: true,
		},
		{
			name: "budget mismatch",
			data: baseData,
			selection: SumToTenSelection{
				"magic":      "A",
				"metatype":   "A",
				"attributes": "A",
				"skills":     "A",
				"resources":  "A",
			},
			wantErr:   ErrSumToTenBudgetMismatch,
			expectErr: true,
		},
		{
			name: "unknown priority code",
			data: baseData,
			selection: SumToTenSelection{
				"magic":      "Z",
				"metatype":   "A",
				"attributes": "B",
				"skills":     "C",
				"resources":  "D",
			},
			wantErr:   ErrSumToTenUnknownPriorityCode,
			expectErr: true,
		},
		{
			name: "unsupported method",
			data: func() *domain.CharacterCreationData {
				return &domain.CharacterCreationData{
					CreationMethods: map[string]domain.CreationMethod{
						"priority": {Label: "Priority"},
					},
				}
			},
			selection: validSelection,
			wantErr:   ErrCreationMethodUnsupported,
			expectErr: true,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			err := ValidateSumToTenSelection(tc.data(), tc.selection)
			if tc.expectErr {
				require.Error(t, err)
				assert.ErrorIs(t, err, tc.wantErr)
				return
			}

			require.NoError(t, err)
		})
	}
}
