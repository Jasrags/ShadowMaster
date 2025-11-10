package jsonrepo

import (
	"path/filepath"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"testing"
)

func TestCampaignRepositoryDefaultsAndNormalization(t *testing.T) {
	dir := t.TempDir()

	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("failed to create store: %v", err)
	}

	index := NewIndex()
	repo := NewCampaignRepository(store, index)

	campaign := &domain.Campaign{
		Name:    "Emerald City Shadows",
		Edition: "sr5",
	}

	if err := repo.Create(campaign); err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	if campaign.CreationMethod != "priority" {
		t.Fatalf("expected default creation method 'priority', got %q", campaign.CreationMethod)
	}
	if campaign.GameplayLevel != "experienced" {
		t.Fatalf("expected default gameplay level 'experienced', got %q", campaign.GameplayLevel)
	}
	if campaign.SetupLockedAt.IsZero() {
		t.Fatal("expected setup lock timestamp to be set")
	}

	originalEdition := campaign.Edition
	originalMethod := campaign.CreationMethod
	lockedAt := campaign.SetupLockedAt

	campaign.Edition = "sr3"          // should be ignored
	campaign.CreationMethod = "karma" // should be ignored
	campaign.GameplayLevel = "Prime"  // should normalize to lowercase
	campaign.Status = "Paused"        // should persist
	if err := repo.Update(campaign); err != nil {
		t.Fatalf("update campaign: %v", err)
	}

	updated, err := repo.GetByID(campaign.ID)
	if err != nil {
		t.Fatalf("get by id: %v", err)
	}

	if updated.Edition != originalEdition {
		t.Fatalf("expected edition %q to remain unchanged, got %q", originalEdition, updated.Edition)
	}
	if updated.CreationMethod != originalMethod {
		t.Fatalf("expected creation method %q to remain unchanged, got %q", originalMethod, updated.CreationMethod)
	}
	if updated.GameplayLevel != "prime" {
		t.Fatalf("expected gameplay level to normalize to 'prime', got %q", updated.GameplayLevel)
	}
	if !updated.SetupLockedAt.Equal(lockedAt) {
		t.Fatal("expected setup lock timestamp to remain unchanged")
	}
	if updated.Status != "Paused" {
		t.Fatalf("expected status 'Paused', got %q", updated.Status)
	}

	// Verify normalization of pre-existing campaign data.
	legacyDir := t.TempDir()
	legacyStore, err := storage.NewJSONStore(legacyDir)
	if err != nil {
		t.Fatalf("failed to create legacy store: %v", err)
	}

	legacyCampaign := &domain.Campaign{
		ID:      "legacy",
		Name:    "Legacy Run",
		Edition: "sr5",
	}

	if err := legacyStore.Write(filepath.Join("campaigns", legacyCampaign.ID+".json"), legacyCampaign); err != nil {
		t.Fatalf("write legacy campaign file: %v", err)
	}

	legacyIndex := NewIndex()
	legacyIndex.Campaigns["legacy"] = filepath.Join("campaigns", "legacy.json")
	legacyRepo := NewCampaignRepository(legacyStore, legacyIndex)

	reloaded, err := legacyRepo.GetByID("legacy")
	if err != nil {
		t.Fatalf("get legacy campaign: %v", err)
	}

	if reloaded.CreationMethod != "priority" {
		t.Fatalf("expected migrated creation method to be 'priority', got %q", reloaded.CreationMethod)
	}
	if reloaded.GameplayLevel != "experienced" {
		t.Fatalf("expected migrated gameplay level to be 'experienced', got %q", reloaded.GameplayLevel)
	}
	if reloaded.SetupLockedAt.IsZero() {
		t.Fatal("expected migrated campaign to have setup lock timestamp")
	}
}
