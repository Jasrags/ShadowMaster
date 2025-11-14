package jsonrepo

import (
	"encoding/json"
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"strings"
	"time"

	"github.com/google/uuid"
	"sort"
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

	ensureCampaignEnabledBooks(campaign)

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

	// Backfill structured fields from legacy house rules JSON if needed.
	backfilled := backfillHouseRulesFromFile(r.store, filename, &campaign)
	if backfilled {
		if err := r.store.Write(filename, &campaign); err != nil {
			return nil, err
		}
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
		if backfillHouseRulesFromFile(r.store, filename, &campaign) {
			_ = r.store.Write(filename, &campaign)
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

	ensureCampaignEnabledBooks(campaign)

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

		if backfillHouseRulesFromFile(r.store, filename, &campaign) {
			changed = true
		}

		if changed {
			campaign.UpdatedAt = time.Now()
			ensureCampaignEnabledBooks(&campaign)
			_ = r.store.Write(filename, &campaign)
		}
	}
}

// backfillHouseRulesFromFile migrates legacy house_rules JSON blob to structured fields.
// It reads the raw JSON file to check for legacy house_rules field since it's no longer in the domain model.
func backfillHouseRulesFromFile(store *storage.JSONStore, filename string, campaign *domain.Campaign) bool {
	if campaign == nil {
		return false
	}

	changed := false

	// If structured fields already exist, nothing to do.
	if campaign.Theme != "" || campaign.HouseRuleNotes != "" || len(campaign.Automation) > 0 ||
		len(campaign.Factions) > 0 || len(campaign.Locations) > 0 || len(campaign.Placeholders) > 0 ||
		campaign.SessionSeed != nil || len(campaign.PlayerUserIDs) > 0 || len(campaign.Players) > 0 {
		return changed
	}

	// Read raw JSON to check for legacy house_rules field
	rawData, err := store.ReadRaw(filename)
	if err != nil {
		return changed
	}

	// Parse as map to check for house_rules field
	var rawMap map[string]interface{}
	if err := json.Unmarshal(rawData, &rawMap); err != nil {
		return changed
	}

	// Check if house_rules exists and has data
	houseRulesRaw, exists := rawMap["house_rules"]
	if !exists {
		return changed
	}

	houseRulesStr, ok := houseRulesRaw.(string)
	if !ok || strings.TrimSpace(houseRulesStr) == "" {
		return changed
	}

	type legacyHouseRules struct {
		Automation   map[string]bool                  `json:"automation"`
		Notes        string                           `json:"notes"`
		Theme        string                           `json:"theme"`
		Factions     []domain.CampaignFaction         `json:"factions"`
		Locations    []domain.CampaignLocation        `json:"locations"`
		Placeholders []domain.CampaignPlaceholder     `json:"placeholders"`
		SessionSeed  *domain.CampaignSessionSeed      `json:"session_seed"`
		Players      []domain.CampaignPlayerReference `json:"players"`
	}

	var payload legacyHouseRules
	if err := json.Unmarshal([]byte(houseRulesStr), &payload); err != nil {
		return changed
	}

	if campaign.Theme == "" && payload.Theme != "" {
		campaign.Theme = strings.TrimSpace(payload.Theme)
		changed = true
	}
	if campaign.HouseRuleNotes == "" && payload.Notes != "" {
		campaign.HouseRuleNotes = strings.TrimSpace(payload.Notes)
		changed = true
	}
	if len(campaign.Automation) == 0 && len(payload.Automation) > 0 {
		campaign.Automation = cloneAutomation(payload.Automation)
		changed = true
	}
	if len(campaign.Factions) == 0 && len(payload.Factions) > 0 {
		campaign.Factions = cloneFactions(payload.Factions)
		changed = true
	}
	if len(campaign.Locations) == 0 && len(payload.Locations) > 0 {
		campaign.Locations = cloneLocations(payload.Locations)
		changed = true
	}
	if len(campaign.Placeholders) == 0 && len(payload.Placeholders) > 0 {
		campaign.Placeholders = clonePlaceholders(payload.Placeholders)
		changed = true
	}
	if campaign.SessionSeed == nil && payload.SessionSeed != nil {
		campaign.SessionSeed = cloneSessionSeed(payload.SessionSeed)
		if campaign.SessionSeed != nil {
			changed = true
		}
	}

	if len(campaign.PlayerUserIDs) == 0 && len(payload.Players) > 0 {
		ids := make([]string, 0, len(payload.Players))
		for _, player := range payload.Players {
			if trimmed := strings.TrimSpace(player.ID); trimmed != "" {
				ids = append(ids, trimmed)
			}
		}
		campaign.PlayerUserIDs = normalizePlayerUserIDs(ids)
		campaign.Players = clonePlayerReferences(payload.Players)
		if len(campaign.PlayerUserIDs) > 0 {
			changed = true
		}
	}

	return changed
}

func cloneAutomation(source map[string]bool) map[string]bool {
	if len(source) == 0 {
		return nil
	}
	result := make(map[string]bool, len(source))
	for key, value := range source {
		trimmed := strings.TrimSpace(key)
		if trimmed == "" {
			continue
		}
		result[trimmed] = value
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func cloneFactions(source []domain.CampaignFaction) []domain.CampaignFaction {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignFaction, 0, len(source))
	for _, faction := range source {
		id := strings.TrimSpace(faction.ID)
		name := strings.TrimSpace(faction.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignFaction{
			ID:    id,
			Name:  name,
			Tags:  strings.TrimSpace(faction.Tags),
			Notes: strings.TrimSpace(faction.Notes),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func cloneLocations(source []domain.CampaignLocation) []domain.CampaignLocation {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignLocation, 0, len(source))
	for _, location := range source {
		id := strings.TrimSpace(location.ID)
		name := strings.TrimSpace(location.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignLocation{
			ID:         id,
			Name:       name,
			Descriptor: strings.TrimSpace(location.Descriptor),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func clonePlaceholders(source []domain.CampaignPlaceholder) []domain.CampaignPlaceholder {
	if len(source) == 0 {
		return nil
	}
	result := make([]domain.CampaignPlaceholder, 0, len(source))
	for _, placeholder := range source {
		id := strings.TrimSpace(placeholder.ID)
		name := strings.TrimSpace(placeholder.Name)
		if id == "" && name == "" {
			continue
		}
		result = append(result, domain.CampaignPlaceholder{
			ID:   id,
			Name: name,
			Role: strings.TrimSpace(placeholder.Role),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func cloneSessionSeed(seed *domain.CampaignSessionSeed) *domain.CampaignSessionSeed {
	if seed == nil {
		return nil
	}
	copy := &domain.CampaignSessionSeed{
		Title:         strings.TrimSpace(seed.Title),
		Objectives:    strings.TrimSpace(seed.Objectives),
		SceneTemplate: strings.TrimSpace(seed.SceneTemplate),
		Summary:       strings.TrimSpace(seed.Summary),
		Skip:          seed.Skip,
	}
	if copy.Title == "" && copy.Objectives == "" && copy.SceneTemplate == "" && copy.Summary == "" && !copy.Skip {
		return nil
	}
	return copy
}

func normalizePlayerUserIDs(source []string) []string {
	if len(source) == 0 {
		return nil
	}
	seen := make(map[string]struct{}, len(source))
	result := make([]string, 0, len(source))
	for _, id := range source {
		trimmed := strings.TrimSpace(id)
		if trimmed == "" {
			continue
		}
		if _, exists := seen[trimmed]; exists {
			continue
		}
		seen[trimmed] = struct{}{}
		result = append(result, trimmed)
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func clonePlayerReferences(source []domain.CampaignPlayerReference) []domain.CampaignPlayerReference {
	if len(source) == 0 {
		return nil
	}
	seen := make(map[string]struct{}, len(source))
	result := make([]domain.CampaignPlayerReference, 0, len(source))
	for _, player := range source {
		id := strings.TrimSpace(player.ID)
		if id == "" {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, domain.CampaignPlayerReference{
			ID:       id,
			Username: strings.TrimSpace(player.Username),
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
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

func ensureCampaignEnabledBooks(campaign *domain.Campaign) {
	if campaign == nil {
		return
	}
	seen := make(map[string]struct{})
	for _, code := range campaign.EnabledBooks {
		code = strings.ToUpper(strings.TrimSpace(code))
		if code == "" {
			continue
		}
		seen[code] = struct{}{}
	}
	seen["SR5"] = struct{}{}

	campaign.EnabledBooks = campaign.EnabledBooks[:0]
	for code := range seen {
		campaign.EnabledBooks = append(campaign.EnabledBooks, code)
	}
	sort.Strings(campaign.EnabledBooks)
}
