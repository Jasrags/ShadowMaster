package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"strings"
	"time"

	"github.com/google/uuid"
)

// CampaignRepositoryJSON implements CampaignRepository using JSON files
type CampaignRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewCampaignRepository creates a new JSON-based campaign repository
func NewCampaignRepository(store *storage.JSONStore, index *Index) *CampaignRepositoryJSON {
	repo := &CampaignRepositoryJSON{
		store: store,
		index: index,
	}

	repo.normalizeExistingCampaigns()

	return repo
}

// Create creates a new campaign
func (r *CampaignRepositoryJSON) Create(campaign *domain.Campaign) error {
	if campaign.ID == "" {
		campaign.ID = uuid.New().String()
	}
	now := time.Now()
	if campaign.CreatedAt.IsZero() {
		campaign.CreatedAt = now
	}
	campaign.UpdatedAt = now
	if campaign.Status == "" {
		campaign.Status = "Active"
	}
	campaign.CreationMethod = normalizeCreationMethod(campaign.Edition, campaign.CreationMethod)
	campaign.GameplayLevel = normalizeGameplayLevel(campaign.Edition, campaign.GameplayLevel)
	if campaign.SetupLockedAt.IsZero() {
		campaign.SetupLockedAt = campaign.CreatedAt
	}

	filename := fmt.Sprintf("campaigns/%s.json", campaign.ID)
	if err := r.store.Write(filename, campaign); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Campaigns[campaign.ID] = filename
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a campaign by ID
func (r *CampaignRepositoryJSON) GetByID(id string) (*domain.Campaign, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Campaigns[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("campaign not found: %s", id)
	}

	var campaign domain.Campaign
	if err := r.store.Read(filename, &campaign); err != nil {
		return nil, err
	}

	return &campaign, nil
}

// GetAll retrieves all campaigns
func (r *CampaignRepositoryJSON) GetAll() ([]*domain.Campaign, error) {
	r.index.mu.RLock()
	campaignMap := make(map[string]string)
	for k, v := range r.index.Campaigns {
		campaignMap[k] = v
	}
	r.index.mu.RUnlock()

	campaigns := make([]*domain.Campaign, 0) // Ensure non-nil empty slice
	for _, filename := range campaignMap {
		var campaign domain.Campaign
		if err := r.store.Read(filename, &campaign); err != nil {
			continue
		}
		campaigns = append(campaigns, &campaign)
	}

	return campaigns, nil
}

// GetByGroupID retrieves all campaigns for a specific group
func (r *CampaignRepositoryJSON) GetByGroupID(groupID string) ([]*domain.Campaign, error) {
	allCampaigns, err := r.GetAll()
	if err != nil {
		return nil, err
	}

	campaigns := make([]*domain.Campaign, 0) // Ensure non-nil empty slice
	for _, campaign := range allCampaigns {
		if campaign.GroupID == groupID {
			campaigns = append(campaigns, campaign)
		}
	}

	return campaigns, nil
}

// Update updates an existing campaign
func (r *CampaignRepositoryJSON) Update(campaign *domain.Campaign) error {
	existing, err := r.GetByID(campaign.ID)
	if err != nil {
		return err
	}

	campaign.CreatedAt = existing.CreatedAt
	campaign.Status = campaignStatusOrDefault(campaign.Status, existing.Status)
	campaign.Edition = existing.Edition
	campaign.CreationMethod = normalizeCreationMethod(existing.Edition, existing.CreationMethod)
	requestedGameplay := campaign.GameplayLevel
	if requestedGameplay == "" {
		requestedGameplay = existing.GameplayLevel
	}
	campaign.GameplayLevel = normalizeGameplayLevel(existing.Edition, requestedGameplay)
	campaign.SetupLockedAt = existing.SetupLockedAt
	campaign.UpdatedAt = time.Now()

	filename := fmt.Sprintf("campaigns/%s.json", campaign.ID)
	return r.store.Write(filename, campaign)
}

// Delete deletes a campaign
func (r *CampaignRepositoryJSON) Delete(id string) error {
	r.index.mu.RLock()
	filename, exists := r.index.Campaigns[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("campaign not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Campaigns, id)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *CampaignRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}

func (r *CampaignRepositoryJSON) normalizeExistingCampaigns() {
	files, err := r.store.List("campaigns")
	if err != nil {
		return
	}

	now := time.Now()

	for _, file := range files {
		if !strings.HasSuffix(file, ".json") {
			continue
		}

		filename := fmt.Sprintf("campaigns/%s", file)
		var campaign domain.Campaign
		if err := r.store.Read(filename, &campaign); err != nil {
			continue
		}

		changed := false

		defaultMethod := normalizeCreationMethod(campaign.Edition, campaign.CreationMethod)
		if campaign.CreationMethod != defaultMethod {
			campaign.CreationMethod = defaultMethod
			changed = true
		}

		defaultGameplay := normalizeGameplayLevel(campaign.Edition, campaign.GameplayLevel)
		if campaign.GameplayLevel != defaultGameplay {
			campaign.GameplayLevel = defaultGameplay
			changed = true
		}

		if campaign.SetupLockedAt.IsZero() {
			if campaign.CreatedAt.IsZero() {
				campaign.CreatedAt = now
			}
			campaign.SetupLockedAt = campaign.CreatedAt
			changed = true
		}

		if changed {
			campaign.UpdatedAt = time.Now()
			_ = r.store.Write(filename, &campaign)
		}
	}
}

func normalizeCreationMethod(edition string, creationMethod string) string {
	if creationMethod != "" {
		return strings.ToLower(creationMethod)
	}

	switch strings.ToLower(edition) {
	case "sr5":
		return "priority"
	default:
		return "priority"
	}
}

func normalizeGameplayLevel(edition string, gameplayLevel string) string {
	gameplayLevel = strings.ToLower(gameplayLevel)
	if strings.ToLower(edition) != "sr5" {
		return gameplayLevel
	}

	if gameplayLevel == "" {
		return "experienced"
	}

	switch gameplayLevel {
	case "street", "experienced", "prime":
		return gameplayLevel
	default:
		return "experienced"
	}
}

func campaignStatusOrDefault(requested string, existing string) string {
	if requested == "" {
		if existing == "" {
			return "Active"
		}
		return existing
	}
	return requested
}
