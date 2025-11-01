package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
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
	return &CampaignRepositoryJSON{
		store: store,
		index: index,
	}
}

// Create creates a new campaign
func (r *CampaignRepositoryJSON) Create(campaign *domain.Campaign) error {
	if campaign.ID == "" {
		campaign.ID = uuid.New().String()
	}
	campaign.CreatedAt = time.Now()
	campaign.UpdatedAt = time.Now()
	if campaign.Status == "" {
		campaign.Status = "Active"
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
	r.index.mu.RLock()
	_, exists := r.index.Campaigns[campaign.ID]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("campaign not found: %s", campaign.ID)
	}

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
