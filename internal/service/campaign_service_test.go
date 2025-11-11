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
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:     "Neon Noir",
		Edition:  "SR5",
		GMName:   "GM Name",
		GMUserID: "user-1",
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
	if len(campaign.EnabledBooks) != 1 || campaign.EnabledBooks[0] != "SR5" {
		t.Fatalf("expected enabled books to contain SR5, got %v", campaign.EnabledBooks)
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
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	if _, err := service.CreateCampaign(CampaignCreateInput{}); err == nil {
		t.Fatal("expected error when edition is missing")
	}
}

func TestCampaignServiceCreationMethodNormalization(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	tests := map[string]string{
		"Sum-to-Ten": "sum_to_ten",
		"sumtotten":  "sum_to_ten",
		"karma":      "karma",
		"Priority":   "priority",
		"":           "priority",
	}

	for input, expected := range tests {
		campaign, err := service.CreateCampaign(CampaignCreateInput{
			Name:           "Test " + input,
			Edition:        "sr5",
			CreationMethod: input,
		})
		if err != nil {
			t.Fatalf("create campaign (%s): %v", input, err)
		}
		if campaign.CreationMethod != expected {
			t.Fatalf("expected creation method %s, got %s", expected, campaign.CreationMethod)
		}
	}
}

func TestCampaignServiceRejectsUnknownBook(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	_, err = service.CreateCampaign(CampaignCreateInput{
		Name:         "Bad Books",
		Edition:      "sr5",
		EnabledBooks: []string{"ZZZ"},
	})
	if err == nil {
		t.Fatal("expected error for unknown book code")
	}
	if !errors.Is(err, ErrCampaignUnknownBook) {
		t.Fatalf("expected ErrCampaignUnknownBook, got %v", err)
	}
}

func TestCampaignServiceListSourceBooksFallback(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	books, err := service.ListSourceBooks("sr3")
	if err != nil {
		t.Fatalf("list source books: %v", err)
	}
	if len(books) != 1 {
		t.Fatalf("expected fallback book entry, got %d", len(books))
	}
	if books[0].Code != "SR3" {
		t.Fatalf("expected fallback SR3 code, got %s", books[0].Code)
	}
	if books[0].Name == "" {
		t.Fatal("expected fallback book name to be set")
	}
}

func TestCampaignServiceImmutableFields(t *testing.T) {
	dir := t.TempDir()
	store, _ := storage.NewJSONStore(dir)
	index := jsonrepo.NewIndex()
	repo := jsonrepo.NewCampaignRepository(store, index)
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

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
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{CreationMethod: &method}); err == nil {
		t.Fatal("expected error when attempting to mutate creation method")
	}

	newGM := "user-2"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{GMUserID: &newGM}); err != nil {
		t.Fatalf("update GM user id: %v", err)
	}

	invalidLevel := "legendary"
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{GameplayLevel: &invalidLevel}); err == nil {
		t.Fatal("expected error when providing unknown gameplay level")
	} else if !errors.Is(err, ErrCampaignUnknownGameplayLevel) {
		t.Fatalf("expected ErrCampaignUnknownGameplayLevel, got %v", err)
	}

	newBooks := []string{"SR5", "AP"}
	updated, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{EnabledBooks: &newBooks})
	if err != nil {
		t.Fatalf("update enabled books: %v", err)
	}
	campaign = updated
	if len(campaign.EnabledBooks) != 2 {
		t.Fatalf("expected two enabled books, got %v", campaign.EnabledBooks)
	}

	invalidBook := []string{"XYZ"}
	if _, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{EnabledBooks: &invalidBook}); err == nil {
		t.Fatal("expected error when enabling unknown book")
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
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

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
	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))

	campaign := &domain.Campaign{Edition: "sr3", EnabledBooks: []string{"SR5"}}
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
		CreationMethods: map[string]domain.CreationMethod{
			"priority": {
				Label: "Priority",
			},
			"sum_to_ten": {
				Label:       "Sum-to-Ten",
				PointBudget: 10,
				PriorityCosts: map[string]int{
					"A": 4,
					"B": 3,
					"C": 2,
					"D": 1,
					"E": 0,
				},
			},
			"karma": {
				Label:       "Karma Point-Buy",
				KarmaBudget: 800,
				MetatypeCosts: map[string]int{
					"human": 0,
				},
			},
		},
	}

	if err := store.Write(filepath.Join("editions", "sr5", "character_creation.json"), &data); err != nil {
		t.Fatalf("write gameplay level data: %v", err)
	}
}

func writeBooksData(t *testing.T, store *storage.JSONStore) {
	t.Helper()

	data := struct {
		Books []domain.SourceBook `json:"books"`
	}{
		Books: []domain.SourceBook{
			{ID: "sr5", Name: "Shadowrun 5th Edition", Code: "SR5"},
			{ID: "ap", Name: "Assassin's Primer", Code: "AP"},
		},
	}

	if err := store.Write(filepath.Join("editions", "sr5", "books", "all.json"), &data); err != nil {
		t.Fatalf("write books data: %v", err)
	}
}
