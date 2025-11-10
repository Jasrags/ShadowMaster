package service

import (
	"testing"

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
	data := karmaTestData()
	selection := KarmaPointBuySelection{
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

	if err := ValidateKarmaPointBuySelection(data, selection); err != nil {
		t.Fatalf("expected selection to be valid, got %v", err)
	}
}

func TestValidateKarmaPointBuySelectionBudgetMismatch(t *testing.T) {
	data := karmaTestData()
	selection := KarmaPointBuySelection{
		MetatypeID: "human",
		Entries: []KarmaLedgerEntry{
			{Category: "attributes", Karma: 300},
			{Category: "skills", Karma: 100},
		},
	}

	if err := ValidateKarmaPointBuySelection(data, selection); err == nil {
		t.Fatal("expected budget mismatch error")
	}
}

func TestValidateKarmaPointBuySelectionGearLimit(t *testing.T) {
	data := karmaTestData()
	selection := KarmaPointBuySelection{
		MetatypeID: "human",
		Entries: []KarmaLedgerEntry{
			{Category: "gear", Karma: 250},
			{Category: "attributes", Karma: 300},
			{Category: "skills", Karma: 250},
		},
	}

	if err := ValidateKarmaPointBuySelection(data, selection); err != ErrKarmaExceedsGearBudget {
		t.Fatalf("expected ErrKarmaExceedsGearBudget, got %v", err)
	}
}

func TestValidateKarmaPointBuySelectionAttributeMaxLimit(t *testing.T) {
	data := karmaTestData()
	selection := KarmaPointBuySelection{
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
	}

	if err := ValidateKarmaPointBuySelection(data, selection); err != ErrKarmaAttributeMaxLimit {
		t.Fatalf("expected ErrKarmaAttributeMaxLimit, got %v", err)
	}
}
