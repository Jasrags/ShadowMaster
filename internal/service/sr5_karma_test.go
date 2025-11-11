package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
)

func karmaTestData() *domain.CharacterCreationData {
	return &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"karma": {
				Label:       "Karma Point-Buy",
				KarmaBudget: 800,
				MetatypeCosts: map[string]int{
					"human": 0,
					"elf":   40,
				},
				GearConversion: &domain.CreationMethodGearConversion{
					MaxKarmaForGear: 200,
				},
			},
		},
		Metatypes: []domain.MetatypeDefinition{
			{
				ID:   "human",
				Name: "Human",
				AttributeRanges: map[string]domain.AttributeRange{
					"body":       {Min: 1, Max: 6},
					"agility":    {Min: 1, Max: 6},
					"reaction":   {Min: 1, Max: 6},
					"strength":   {Min: 1, Max: 6},
					"charisma":   {Min: 1, Max: 6},
					"logic":      {Min: 1, Max: 6},
					"intuition":  {Min: 1, Max: 6},
					"willpower":  {Min: 1, Max: 6},
					"edge":       {Min: 2, Max: 7},
					"magic":      {Min: 0, Max: 6},
					"resonance":  {Min: 0, Max: 6},
					"initiative": {Min: 0, Max: 0},
				},
			},
		},
	}
}

func TestValidateKarmaPointBuySelection(t *testing.T) {
	validSelection := KarmaPointBuySelection{
		MetatypeID: "human",
		Entries: []KarmaLedgerEntry{
			{Category: "attributes", Karma: 300},
			{Category: "skills", Karma: 200},
			{Category: "qualities", Karma: 100},
			{Category: "gear", Karma: 150},
			{Category: "contacts", Karma: 50},
		},
		Attributes: map[string]int{
			"body":      5,
			"agility":   6,
			"strength":  5,
			"reaction":  5,
			"charisma":  4,
			"logic":     4,
			"intuition": 4,
			"willpower": 5,
		},
	}

	testCases := []struct {
		name      string
		data      func() *domain.CharacterCreationData
		selection KarmaPointBuySelection
		wantErr   error
		expectErr bool
	}{
		{
			name:      "valid selection",
			data:      karmaTestData,
			selection: validSelection,
		},
		{
			name: "budget mismatch",
			data: karmaTestData,
			selection: KarmaPointBuySelection{
				MetatypeID: "human",
				Entries: []KarmaLedgerEntry{
					{Category: "attributes", Karma: 300},
					{Category: "skills", Karma: 100},
				},
			},
			wantErr:   ErrKarmaBudgetMismatch,
			expectErr: true,
		},
		{
			name: "gear limit exceeded",
			data: karmaTestData,
			selection: KarmaPointBuySelection{
				MetatypeID: "human",
				Entries: []KarmaLedgerEntry{
					{Category: "gear", Karma: 250},
					{Category: "attributes", Karma: 300},
					{Category: "skills", Karma: 250},
				},
			},
			wantErr:   ErrKarmaExceedsGearBudget,
			expectErr: true,
		},
		{
			name: "attribute max limit",
			data: karmaTestData,
			selection: KarmaPointBuySelection{
				MetatypeID: "human",
				Entries: []KarmaLedgerEntry{
					{Category: "attributes", Karma: 400},
					{Category: "skills", Karma: 200},
					{Category: "gear", Karma: 150},
					{Category: "qualities", Karma: 50},
				},
				Attributes: map[string]int{
					"body":     6,
					"agility":  6,
					"strength": 5,
					"reaction": 4,
				},
			},
			wantErr:   ErrKarmaAttributeMaxLimit,
			expectErr: true,
		},
		{
			name: "unsupported creation method",
			data: func() *domain.CharacterCreationData {
				return &domain.CharacterCreationData{
					CreationMethods: map[string]domain.CreationMethod{
						"priority": {Label: "Priority"},
					},
				}
			},
			selection: KarmaPointBuySelection{
				MetatypeID: "human",
				Entries: []KarmaLedgerEntry{
					{Category: "attributes", Karma: 300},
					{Category: "skills", Karma: 200},
					{Category: "qualities", Karma: 100},
					{Category: "gear", Karma: 150},
					{Category: "contacts", Karma: 50},
				},
			},
			wantErr:   ErrCreationMethodUnsupported,
			expectErr: true,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			err := ValidateKarmaPointBuySelection(tc.data(), tc.selection)
			if tc.expectErr {
				require.Error(t, err)
				if tc.wantErr != nil {
					assert.ErrorIs(t, err, tc.wantErr)
				}
				return
			}

			require.NoError(t, err)
		})
	}
}
