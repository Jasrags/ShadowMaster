package jsonrepo

import (
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"testing"
)

func TestCharacterRepositoryIndexes(t *testing.T) {
	dir := t.TempDir()

	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("failed to create store: %v", err)
	}

	index := NewIndex()
	repo := NewCharacterRepository(store, index)

	character := &domain.Character{
		Name:       "Night Runner",
		Edition:    "sr3",
		CampaignID: "campaign-1",
		UserID:     "user-1",
	}

	if err := repo.Create(character); err != nil {
		t.Fatalf("create character: %v", err)
	}

	if character.ID == "" {
		t.Fatal("expected character ID to be assigned")
	}

	if character.CreatedAt.IsZero() || character.UpdatedAt.IsZero() {
		t.Fatal("expected timestamps to be set on create")
	}

	campaignCharacters, err := repo.GetByCampaignID("campaign-1")
	if err != nil {
		t.Fatalf("get by campaign: %v", err)
	}
	if len(campaignCharacters) != 1 {
		t.Fatalf("expected 1 character for campaign, got %d", len(campaignCharacters))
	}

	userCharacters, err := repo.GetByUserID("user-1")
	if err != nil {
		t.Fatalf("get by user: %v", err)
	}
	if len(userCharacters) != 1 {
		t.Fatalf("expected 1 character for user, got %d", len(userCharacters))
	}

	createdAt := character.CreatedAt

	character.CampaignID = "campaign-2"
	character.UserID = ""
	character.IsNPC = true

	if err := repo.Update(character); err != nil {
		t.Fatalf("update character: %v", err)
	}

	reloaded, err := repo.GetByID(character.ID)
	if err != nil {
		t.Fatalf("get by id after update: %v", err)
	}
	if !reloaded.CreatedAt.Equal(createdAt) {
		t.Fatal("expected CreatedAt to remain unchanged after update")
	}

	if _, exists := index.CampaignCharacters["campaign-1"]; exists {
		t.Fatal("expected campaign-1 index entry to be removed after update")
	}

	campaignCharacters, err = repo.GetByCampaignID("campaign-2")
	if err != nil {
		t.Fatalf("get by campaign after update: %v", err)
	}
	if len(campaignCharacters) != 1 {
		t.Fatalf("expected 1 character for campaign-2, got %d", len(campaignCharacters))
	}

	userCharacters, err = repo.GetByUserID("user-1")
	if err != nil {
		t.Fatalf("get by user after update: %v", err)
	}
	if len(userCharacters) != 0 {
		t.Fatalf("expected 0 characters for user-1 after update, got %d", len(userCharacters))
	}

	if _, exists := index.UserCharacters["user-1"]; exists {
		t.Fatal("expected user-1 index entry to be removed after update")
	}

	// Ensure indexes rebuild correctly on repository initialization.
	freshIndex := NewIndex()
	_ = store.Write("index.json", freshIndex)
	repoReloaded := NewCharacterRepository(store, freshIndex)

	campaignCharacters, err = repoReloaded.GetByCampaignID("campaign-2")
	if err != nil {
		t.Fatalf("get by campaign on reloaded repo: %v", err)
	}
	if len(campaignCharacters) != 1 {
		t.Fatalf("expected 1 character for campaign-2 after rebuild, got %d", len(campaignCharacters))
	}

	if err := repo.Delete(character.ID); err != nil {
		t.Fatalf("delete character: %v", err)
	}

	campaignCharacters, err = repo.GetByCampaignID("campaign-2")
	if err != nil {
		t.Fatalf("get by campaign after delete: %v", err)
	}
	if len(campaignCharacters) != 0 {
		t.Fatalf("expected 0 characters for campaign-2 after delete, got %d", len(campaignCharacters))
	}
}
