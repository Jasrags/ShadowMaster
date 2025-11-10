package service

import (
	"errors"
	"path/filepath"
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
	"testing"
)

func TestCampaignServiceCreateDefaults(t *testing.T) {
	dir := t.TempDir()

	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Neon Noir",
		Edition: "SR5",
	})
	if err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	if campaign.Edition != "sr5" {
		t.Fatalf("expected edition normalized to sr5, got %s", campaign.Edition)
	}
	if campaign.CreationMethod != "priority" {
		t.Fatalf("expected default creation method priority, got %s", campaign.CreationMethod)
	}
	if campaign.GameplayLevel != "experienced" {
		t.Fatalf("expected default gameplay level experienced, got %s", campaign.GameplayLevel)
	}

	rules, err := service.DescribeGameplayRules(campaign)
	if err != nil {
		t.Fatalf("describe gameplay rules: %v", err)
	}
	if rules == nil || rules.Key != "experienced" {
		t.Fatalf("expected experienced rules, got %+v", rules)
	}
}

func TestCampaignServiceCreateRequiresEdition(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	if _, err := service.CreateCampaign(CampaignCreateInput{}); err == nil {
		t.Fatal("expected error when edition is missing")
	}
}

func TestCampaignServiceCreationMethodFallback(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	for _, method := range []string{"Sum-to-Ten", "karma", "Priority"} {
		campaign, err := service.CreateCampaign(CampaignCreateInput{
			Name:           "Test " + method,
			Edition:        "sr5",
			CreationMethod: method,
		})
		if err != nil {
			t.Fatalf("create campaign (%s): %v", method, err)
		}
		if campaign.CreationMethod != "priority" {
			t.Fatalf("expected creation method to fallback to priority, got %s", campaign.CreationMethod)
		}
	}
}

func TestCampaignServiceImmutableFields(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Lockdown Run",
		Edition: "sr5",
	})
	if err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	newName := "Updated Run"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Name: &newName}); err != nil {
		t.Fatalf("update campaign: %v", err)
	}

	edition := "sr3"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Edition: &edition}); err == nil {
		t.Fatal("expected error when attempting to change edition")
	}

	method := "karma"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{CreationMethod: &method}); err != nil {
		t.Fatalf("expected creation method fallback to succeed, got %v", err)
	}

	invalidLevel := "legendary"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{GameplayLevel: &invalidLevel}); err == nil {
		t.Fatal("expected error when providing unknown gameplay level")
	} else if !errors.Is(err, ErrCampaignUnknownGameplayLevel) {
		t.Fatalf("expected ErrCampaignUnknownGameplayLevel, got %v", err)
	}
}

func TestCampaignServiceMigratesLegacyData(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}

	legacy := &domain.Campaign{
		ID:      "legacy",
		Name:    "Legacy Campaign",
		Edition: "sr5",
	}
	if err := store.Write(filepath.Join("campaigns", "legacy.json"), legacy); err != nil {
		t.Fatalf("write legacy campaign: %v", err)
	}

	index := jsonrepo.NewIndex()
	index.Campaigns["legacy"] = filepath.Join("campaigns", "legacy.json")
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	campaign, err := service.GetCampaign("legacy")
	if err != nil {
		t.Fatalf("get legacy campaign: %v", err)
	}

	if campaign.CreationMethod != "priority" {
		t.Fatalf("expected creation method priority after migration, got %s", campaign.CreationMethod)
	}
	if campaign.GameplayLevel != "experienced" {
		t.Fatalf("expected gameplay level experienced after migration, got %s", campaign.GameplayLevel)
	}
	if campaign.SetupLockedAt.IsZero() {
		t.Fatal("expected setup locked timestamp to be set")
	}
}

func TestCampaignServiceDescribeGameplayRulesUnknownEdition(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store))

	campaign := &domain.Campaign{Edition: "sr3"}
	if err := repo.Create(campaign); err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	rules, err := service.DescribeGameplayRules(campaign)
	if err != nil {
		t.Fatalf("describe gameplay rules: %v", err)
	}
	if rules != nil {
		t.Fatalf("expected no gameplay rules for sr3, got %+v", rules)
	}
}

func writeGameplayLevelData(t *testing.T, store *storage.JSONStore) {
	t.Helper()

	maxDeviceStreet := 4
	maxAvailStreet := 10
	maxDevicePrime := 6
	maxAvailPrime := 15

	data := domain.CharacterCreationData{
		GameplayLevels: map[string]domain.GameplayLevel{
			"experienced": {
				Label:         "Experienced",
				Resources:     map[string]int{"A": 450000},
				StartingKarma: 25,
				GearRestrictions: domain.GearRestrictions{
					MaxAvailability: nil,
					MaxDeviceRating: nil,
				},
			},
			"street": {
				Label:         "Street-Level",
				Resources:     map[string]int{"A": 75000},
				StartingKarma: 13,
				GearRestrictions: domain.GearRestrictions{
					MaxDeviceRating: &maxDeviceStreet,
					MaxAvailability: &maxAvailStreet,
				},
			},
			"prime": {
				Label:         "Prime Runner",
				Resources:     map[string]int{"A": 500000},
				StartingKarma: 35,
				GearRestrictions: domain.GearRestrictions{
					MaxDeviceRating: &maxDevicePrime,
					MaxAvailability: &maxAvailPrime,
				},
			},
		},
	}

	if err := store.Write(filepath.Join("editions", "sr5", "character_creation.json"), &data); err != nil {
		t.Fatalf("write gameplay level data: %v", err)
	}
}
