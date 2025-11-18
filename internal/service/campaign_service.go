package service

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

// CampaignService encapsulates business logic for campaigns.
type CampaignService struct {
	campaignRepo repository.CampaignRepository
	editionRepo  repository.EditionDataRepository
	bookRepo     repository.BookRepository
}

// NewCampaignService constructs a CampaignService.
func NewCampaignService(campaignRepo repository.CampaignRepository, editionRepo repository.EditionDataRepository, bookRepo repository.BookRepository) *CampaignService {
	return &CampaignService{
		campaignRepo: campaignRepo,
		editionRepo:  editionRepo,
		bookRepo:     bookRepo,
	}
}

// CampaignCreateInput captures the fields needed to create a campaign.
type CampaignCreateInput struct {
	Name           string
	Description    string
	GroupID        string
	GMName         string
	GMUserID       string
	Edition        string
	CreationMethod string
	GameplayLevel  string
	Theme          string
	HouseRuleNotes string
	Automation     map[string]bool
	Factions       []domain.CampaignFaction
	Locations      []domain.CampaignLocation
	Placeholders   []domain.CampaignPlaceholder
	SessionSeed    *domain.CampaignSessionSeed
	Players        []domain.CampaignPlayer
	Status         string
	EnabledBooks   []string
}

// CampaignUpdateInput captures mutable campaign fields.
type CampaignUpdateInput struct {
	Name           *string
	Description    *string
	GMName         *string
	GMUserID       *string
	GameplayLevel  *string
	Theme          *string
	HouseRuleNotes *string
	Automation     *map[string]bool
	Factions       *[]domain.CampaignFaction
	Locations      *[]domain.CampaignLocation
	Placeholders   *[]domain.CampaignPlaceholder
	SessionSeed    **domain.CampaignSessionSeed
	Players        *[]domain.CampaignPlayer
	Status         *string
	CreationMethod *string
	Edition        *string
	EnabledBooks   *[]string
}

// ListCampaigns returns all campaigns.
func (s *CampaignService) ListCampaigns() ([]*domain.Campaign, error) {
	return s.campaignRepo.GetAll()
}

// GetCampaign fetches a campaign by ID.
func (s *CampaignService) GetCampaign(id string) (*domain.Campaign, error) {
	campaign, err := s.campaignRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}
	return campaign, nil
}

// CreateCampaign validates input and persists a new campaign.
func (s *CampaignService) CreateCampaign(input CampaignCreateInput) (*domain.Campaign, error) {
	edition := strings.ToLower(strings.TrimSpace(input.Edition))
	if edition == "" {
		return nil, ErrCampaignEditionRequired
	}

	creationMethod, err := s.normalizeCreationMethod(edition, strings.TrimSpace(input.CreationMethod))
	if err != nil {
		return nil, err
	}

	gameplayLevel, err := s.resolveGameplayLevel(edition, strings.TrimSpace(input.GameplayLevel))
	if err != nil {
		return nil, err
	}

	enabledBooks, err := s.validateEnabledBooks(edition, input.EnabledBooks)
	if err != nil {
		return nil, err
	}

	automation := cloneAutomation(input.Automation)
	factions := cloneFactions(input.Factions)
	locations := cloneLocations(input.Locations)
	placeholders := clonePlaceholders(input.Placeholders)
	sessionSeed := cloneSessionSeed(input.SessionSeed)
	players := clonePlayers(input.Players)

	campaign := &domain.Campaign{
		Name:           strings.TrimSpace(input.Name),
		Description:    strings.TrimSpace(input.Description),
		GroupID:        strings.TrimSpace(input.GroupID),
		GmName:         strings.TrimSpace(input.GMName),
		GmUserID:       strings.TrimSpace(input.GMUserID),
		Edition:        edition,
		CreationMethod: creationMethod,
		GameplayLevel:  gameplayLevel,
		Theme:          strings.TrimSpace(input.Theme),
		HouseRuleNotes: strings.TrimSpace(input.HouseRuleNotes),
		Automation:     automation,
		Factions:       factions,
		Locations:      locations,
		Placeholders:   placeholders,
		SessionSeed:    sessionSeed,
		Players:        players,
		Status:         campaignStatusOrDefault(input.Status, ""),
		EnabledBooks:   enabledBooks,
	}

	if err := s.campaignRepo.Create(campaign); err != nil {
		return nil, err
	}
	return campaign, nil
}

// UpdateCampaign applies allowed changes to an existing campaign.
func (s *CampaignService) UpdateCampaign(id string, input CampaignUpdateInput) (*domain.Campaign, error) {
	campaign, err := s.campaignRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	if input.Edition != nil && !strings.EqualFold(campaign.Edition, strings.TrimSpace(*input.Edition)) {
		return nil, ErrCampaignImmutableEdition
	}

	if input.CreationMethod != nil {
		normalized, err := s.normalizeCreationMethod(campaign.Edition, strings.TrimSpace(*input.CreationMethod))
		if err != nil {
			return nil, err
		}
		if normalized != campaign.CreationMethod {
			return nil, ErrCampaignImmutableCreation
		}
	}

	if input.Name != nil {
		campaign.Name = strings.TrimSpace(*input.Name)
	}
	if input.Description != nil {
		campaign.Description = strings.TrimSpace(*input.Description)
	}
	if input.GMName != nil {
		campaign.GmName = strings.TrimSpace(*input.GMName)
	}
	if input.GMUserID != nil {
		campaign.GmUserID = strings.TrimSpace(*input.GMUserID)
	}
	if input.Theme != nil {
		campaign.Theme = strings.TrimSpace(*input.Theme)
	}
	if input.HouseRuleNotes != nil {
		campaign.HouseRuleNotes = strings.TrimSpace(*input.HouseRuleNotes)
	}
	if input.Automation != nil {
		campaign.Automation = cloneAutomation(*input.Automation)
	}
	if input.Factions != nil {
		campaign.Factions = cloneFactions(*input.Factions)
	}
	if input.Locations != nil {
		campaign.Locations = cloneLocations(*input.Locations)
	}
	if input.Placeholders != nil {
		campaign.Placeholders = clonePlaceholders(*input.Placeholders)
	}
	if input.SessionSeed != nil {
		campaign.SessionSeed = cloneSessionSeed(*input.SessionSeed)
	}
	if input.Players != nil {
		campaign.Players = clonePlayers(*input.Players)
	}
	if input.Status != nil {
		campaign.Status = campaignStatusOrDefault(strings.TrimSpace(*input.Status), campaign.Status)
	}
	if input.GameplayLevel != nil {
		level, err := s.resolveGameplayLevel(campaign.Edition, strings.TrimSpace(*input.GameplayLevel))
		if err != nil {
			return nil, err
		}
		campaign.GameplayLevel = level
	}

	if input.EnabledBooks != nil {
		books, err := s.validateEnabledBooks(campaign.Edition, *input.EnabledBooks)
		if err != nil {
			return nil, err
		}
		campaign.EnabledBooks = books
	}

	if len(campaign.EnabledBooks) == 0 {
		defaults, _ := s.validateEnabledBooks(campaign.Edition, nil)
		campaign.EnabledBooks = defaults
	}

	if campaign.SetupLockedAt.IsZero() {
		campaign.SetupLockedAt = time.Now()
	}

	if err := s.campaignRepo.Update(campaign); err != nil {
		return nil, err
	}
	return campaign, nil
}

// DeleteCampaign removes a campaign.
func (s *CampaignService) DeleteCampaign(id string) error {
	return s.campaignRepo.Delete(id)
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

func clonePlayers(source []domain.CampaignPlayer) []domain.CampaignPlayer {
	if len(source) == 0 {
		return nil
	}
	seen := make(map[string]struct{}, len(source))
	result := make([]domain.CampaignPlayer, 0, len(source))
	for _, player := range source {
		id := strings.TrimSpace(player.ID)
		if id == "" {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, domain.CampaignPlayer{
			ID:          id,
			UserID:      strings.TrimSpace(player.UserID),
			Email:       strings.TrimSpace(strings.ToLower(player.Email)),
			Username:    strings.TrimSpace(player.Username),
			Status:      strings.TrimSpace(player.Status),
			InvitedBy:   strings.TrimSpace(player.InvitedBy),
			InvitedAt:   player.InvitedAt,
			RespondedAt: player.RespondedAt,
			JoinedAt:    player.JoinedAt,
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

func sanitizeMethod(method string) string {
	normalized := strings.ToLower(strings.TrimSpace(method))
	normalized = strings.ReplaceAll(normalized, "-", "_")
	normalized = strings.ReplaceAll(normalized, " ", "_")
	return normalized
}

func normalizeGameplayLevel(edition, level string) string {
	return strings.ToLower(level)
}

func campaignStatusOrDefault(requested, existing string) string {
	requested = strings.TrimSpace(requested)
	if requested == "" {
		if existing == "" {
			return "Active"
		}
		return existing
	}
	return requested
}

func (s *CampaignService) normalizeCreationMethod(edition, method string) (string, error) {
	edition = strings.ToLower(strings.TrimSpace(edition))
	requested := canonicalizeCreationMethod(sanitizeMethod(method))

	if s.editionRepo == nil {
		if requested != "" {
			return requested, nil
		}
		if def := defaultCreationMethodForEdition(nil, edition); def != "" {
			return def, nil
		}
		return "", ErrCampaignCreationMethodRequired
	}

	data, err := s.editionRepo.GetCharacterCreationData(edition)
	if err != nil {
		if requested != "" {
			return requested, nil
		}
		if def := defaultCreationMethodForEdition(nil, edition); def != "" {
			return def, nil
		}
		return "", ErrCampaignCreationMethodRequired
	}

	available := data.CreationMethods

	if requested != "" {
		if _, ok := available[requested]; ok {
			return requested, nil
		}
	}

	if requested == "" {
		if def := defaultCreationMethodForEdition(available, edition); def != "" {
			return def, nil
		}
		return "", ErrCampaignCreationMethodRequired
	}

	if def := defaultCreationMethodForEdition(available, edition); def != "" {
		return def, nil
	}

	if len(available) > 0 {
		for key := range available {
			return key, nil
		}
	}

	return "", ErrCampaignCreationMethodRequired
}

func canonicalizeCreationMethod(method string) string {
	switch method {
	case "priority", "":
		return method
	case "sum_to_ten", "sumtotten", "sum2ten", "sum_to10":
		return "sum_to_ten"
	case "karma", "point_buy", "pointbuy":
		return "karma"
	default:
		return method
	}
}

func defaultCreationMethodForEdition(available map[string]domain.CreationMethod, edition string) string {
	if len(available) > 0 {
		if _, ok := available["priority"]; ok {
			return "priority"
		}
		for key := range available {
			return key
		}
	}

	switch strings.ToLower(strings.TrimSpace(edition)) {
	case "sr5":
		return "priority"
	default:
		return "priority"
	}
}

// GameplayRules represents resolved gameplay level rules.
type GameplayRules struct {
	Key                    string                   `json:"key"`
	Label                  string                   `json:"label"`
	Description            string                   `json:"description,omitempty"`
	Resources              map[string]int           `json:"resources,omitempty"`
	StartingKarma          int                      `json:"starting_karma,omitempty"`
	MaxCustomKarma         int                      `json:"max_custom_karma,omitempty"`
	KarmaToNuyenLimit      int                      `json:"karma_to_nuyen_limit,omitempty"`
	ContactKarmaMultiplier int                      `json:"contact_karma_multiplier,omitempty"`
	GearRestrictions       domain.GearRestrictions  `json:"gear_restrictions,omitempty"`
	Advancement            *domain.AdvancementRules `json:"advancement,omitempty"`
}

func (s *CampaignService) resolveGameplayLevel(edition, requested string) (string, error) {
	edition = strings.ToLower(strings.TrimSpace(edition))
	requested = strings.ToLower(strings.TrimSpace(requested))

	if s.editionRepo == nil {
		if requested == "" {
			return requested, nil
		}
		return requested, nil
	}

	data, err := s.editionRepo.GetCharacterCreationData(edition)
	if err != nil || data == nil || len(data.GameplayLevels) == 0 {
		if requested == "" {
			return requested, nil
		}
		return requested, nil
	}

	if requested == "" {
		if _, ok := data.GameplayLevels["experienced"]; ok {
			return "experienced", nil
		}
		for key := range data.GameplayLevels {
			return key, nil
		}
	}

	if _, ok := data.GameplayLevels[requested]; !ok {
		return "", fmt.Errorf("%w: %s", ErrCampaignUnknownGameplayLevel, requested)
	}

	return requested, nil
}

// DescribeGameplayRules resolves full gameplay rules for a campaign.
func (s *CampaignService) DescribeGameplayRules(campaign *domain.Campaign) (*GameplayRules, error) {
	if campaign == nil || s.editionRepo == nil {
		return nil, nil
	}

	data, err := s.editionRepo.GetCharacterCreationData(campaign.Edition)
	if err != nil || data == nil || len(data.GameplayLevels) == 0 {
		return nil, nil
	}

	key := strings.ToLower(strings.TrimSpace(campaign.GameplayLevel))
	if key == "" {
		return nil, nil
	}

	level, ok := data.GameplayLevels[key]
	if !ok {
		return nil, nil
	}

	return &GameplayRules{
		Key:                    key,
		Label:                  level.Label,
		Description:            level.Description,
		Resources:              level.Resources,
		StartingKarma:          level.StartingKarma,
		MaxCustomKarma:         level.MaxCustomKarma,
		KarmaToNuyenLimit:      level.KarmaToNuyenLimit,
		ContactKarmaMultiplier: level.ContactKarmaMultiplier,
		GearRestrictions:       level.GearRestrictions,
		Advancement:            data.Advancement,
	}, nil
}

// ListSourceBooks returns available source books for an edition.
func (s *CampaignService) ListSourceBooks(edition string) ([]domain.SourceBook, error) {
	edition = strings.ToLower(strings.TrimSpace(edition))
	if edition == "" {
		return nil, fmt.Errorf("edition is required")
	}
	if s.bookRepo == nil {
		return []domain.SourceBook{{Code: "SR5", Name: "Shadowrun 5th Edition"}}, nil
	}
	books, err := s.bookRepo.ListBooks(edition)
	if err != nil {
		return nil, err
	}
	sort.SliceStable(books, func(i, j int) bool {
		if books[i].Code == books[j].Code {
			return books[i].Name < books[j].Name
		}
		return books[i].Code < books[j].Code
	})
	return books, nil
}

func (s *CampaignService) validateEnabledBooks(edition string, requested []string) ([]string, error) {
	codes := make(map[string]struct{})
	for _, raw := range requested {
		code := strings.ToUpper(strings.TrimSpace(raw))
		if code == "" {
			continue
		}
		codes[code] = struct{}{}
	}
	if strings.EqualFold(edition, "sr5") || edition == "" {
		codes["SR5"] = struct{}{}
	} else {
		codes[strings.ToUpper(edition)] = struct{}{}
	}

	allowed := make(map[string]struct{})
	if s.bookRepo != nil {
		if books, err := s.bookRepo.ListBooks(edition); err == nil {
			for _, book := range books {
				if book.Code != "" {
					allowed[strings.ToUpper(book.Code)] = struct{}{}
				}
			}
		}
	}

	if len(allowed) > 0 {
		for code := range codes {
			if _, ok := allowed[code]; !ok {
				return nil, fmt.Errorf("%w: %s", ErrCampaignUnknownBook, code)
			}
		}
	}

	result := make([]string, 0, len(codes))
	for code := range codes {
		result = append(result, code)
	}
	sort.Strings(result)
	return result, nil
}

// InvitePlayerInput contains data for inviting a player to a campaign.
type InvitePlayerInput struct {
	Email    string // Email for unregistered users
	UserID   string // User ID if user exists
	Username string // Username if user exists
	InvitedBy string // User ID of GM sending invite
}

// InvitePlayer creates an invitation for a player to join a campaign.
func (s *CampaignService) InvitePlayer(campaignID string, input InvitePlayerInput) (*domain.CampaignPlayer, error) {
	campaign, err := s.campaignRepo.GetByID(campaignID)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	// Validate that we have either email or user ID
	if input.Email == "" && input.UserID == "" {
		return nil, fmt.Errorf("either email or user_id is required")
	}

	// Check if user is already a player (accepted status)
	if input.UserID != "" {
		for _, player := range campaign.Players {
			if player.UserID == input.UserID && player.Status == "accepted" {
				return nil, fmt.Errorf("user is already a player in this campaign")
			}
		}
	}

	// Check if there's already a pending invitation
	for _, player := range campaign.Players {
		if player.Status == "invited" {
			if input.UserID != "" && player.UserID == input.UserID {
				return nil, fmt.Errorf("user already has a pending invitation")
			}
			if input.Email != "" && strings.ToLower(player.Email) == strings.ToLower(input.Email) {
				return nil, fmt.Errorf("email already has a pending invitation")
			}
		}
	}

	// Create new player entry with "invited" status
	newPlayer := domain.CampaignPlayer{
		ID:        fmt.Sprintf("player-%d", time.Now().UnixNano()), // Simple ID generation
		Email:     strings.TrimSpace(strings.ToLower(input.Email)),
		UserID:    input.UserID,
		Username:  input.Username,
		Status:    "invited",
		InvitedBy: input.InvitedBy,
		InvitedAt: time.Now(),
	}

	// Add to campaign
	if campaign.Players == nil {
		campaign.Players = []domain.CampaignPlayer{}
	}
	campaign.Players = append(campaign.Players, newPlayer)
	campaign.UpdatedAt = time.Now()

	if err := s.campaignRepo.Update(campaign); err != nil {
		return nil, fmt.Errorf("failed to save invitation: %w", err)
	}

	return &newPlayer, nil
}

// AcceptInvitation accepts a campaign invitation and updates the player status.
func (s *CampaignService) AcceptInvitation(campaignID, playerID, userID string) error {
	campaign, err := s.campaignRepo.GetByID(campaignID)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	// Find player entry
	var playerIndex = -1
	for i := range campaign.Players {
		if campaign.Players[i].ID == playerID {
			playerIndex = i
			break
		}
	}

	if playerIndex == -1 {
		return fmt.Errorf("invitation not found")
	}

	player := &campaign.Players[playerIndex]

	// Verify invitation is for this user
	if player.UserID != "" && player.UserID != userID {
		return fmt.Errorf("invitation is not for this user")
	}
	if player.Status != "invited" {
		return fmt.Errorf("invitation is not pending")
	}

	// Update player status to accepted
	player.Status = "accepted"
	player.RespondedAt = time.Now()
	player.JoinedAt = time.Now()
	
	// Update userID if it wasn't set (email-only invitation)
	if player.UserID == "" && userID != "" {
		player.UserID = userID
	}

	campaign.UpdatedAt = time.Now()
	if err := s.campaignRepo.Update(campaign); err != nil {
		return fmt.Errorf("failed to update campaign: %w", err)
	}

	return nil
}

// DeclineInvitation declines a campaign invitation.
func (s *CampaignService) DeclineInvitation(campaignID, playerID, userID string) error {
	campaign, err := s.campaignRepo.GetByID(campaignID)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	// Find player entry
	var playerIndex = -1
	for i := range campaign.Players {
		if campaign.Players[i].ID == playerID {
			playerIndex = i
			break
		}
	}

	if playerIndex == -1 {
		return fmt.Errorf("invitation not found")
	}

	player := &campaign.Players[playerIndex]

	// Verify invitation is for this user
	if player.UserID != "" && player.UserID != userID {
		return fmt.Errorf("invitation is not for this user")
	}
	if player.Status != "invited" {
		return fmt.Errorf("invitation is not pending")
	}

	// Update player status to declined
	player.Status = "declined"
	player.RespondedAt = time.Now()

	campaign.UpdatedAt = time.Now()
	if err := s.campaignRepo.Update(campaign); err != nil {
		return fmt.Errorf("failed to update campaign: %w", err)
	}

	return nil
}

// GetUserInvitations returns all pending invitations for a user.
func (s *CampaignService) GetUserInvitations(userID, email string) ([]struct {
	Campaign *domain.Campaign
	Player   domain.CampaignPlayer
}, error) {
	allCampaigns, err := s.campaignRepo.GetAll()
	if err != nil {
		return nil, err
	}

	var result []struct {
		Campaign *domain.Campaign
		Player   domain.CampaignPlayer
	}

	for _, campaign := range allCampaigns {
		for _, player := range campaign.Players {
			if player.Status == "invited" {
				matches := false
				if userID != "" && player.UserID == userID {
					matches = true
				}
				if email != "" && player.Email != "" && player.Email == strings.ToLower(strings.TrimSpace(email)) {
					matches = true
				}
				if matches {
					result = append(result, struct {
						Campaign *domain.Campaign
						Player   domain.CampaignPlayer
					}{
						Campaign: campaign,
						Player:   player,
					})
				}
			}
		}
	}

	return result, nil
}

// RemoveInvitation removes an invitation from a campaign.
// This is now just an alias for RemovePlayer since invitations are part of the unified Players list.
func (s *CampaignService) RemoveInvitation(campaignID, playerID string) error {
	return s.RemovePlayer(campaignID, playerID)
}

// RemovePlayer removes a player from a campaign.
// This removes the player entry entirely (for invited/declined) or sets status to "removed" (for accepted).
func (s *CampaignService) RemovePlayer(campaignID, playerID string) error {
	campaign, err := s.campaignRepo.GetByID(campaignID)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrCampaignNotFound, err)
	}

	// Find and remove player entry
	newPlayers := make([]domain.CampaignPlayer, 0, len(campaign.Players))
	found := false
	for _, player := range campaign.Players {
		if player.ID == playerID {
			found = true
			// For accepted players, we could set status to "removed" to keep history
			// For now, we'll just remove them entirely
			continue
		}
		newPlayers = append(newPlayers, player)
	}

	if !found {
		return fmt.Errorf("player not found")
	}

	campaign.Players = newPlayers
	campaign.UpdatedAt = time.Now()

	if err := s.campaignRepo.Update(campaign); err != nil {
		return fmt.Errorf("failed to update campaign: %w", err)
	}

	return nil
}
