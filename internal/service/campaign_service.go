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
	HouseRules     string
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
	HouseRules     *string
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

	campaign := &domain.Campaign{
		Name:           strings.TrimSpace(input.Name),
		Description:    strings.TrimSpace(input.Description),
		GroupID:        strings.TrimSpace(input.GroupID),
		GmName:         strings.TrimSpace(input.GMName),
		GmUserID:       strings.TrimSpace(input.GMUserID),
		Edition:        edition,
		CreationMethod: creationMethod,
		GameplayLevel:  gameplayLevel,
		HouseRules:     strings.TrimSpace(input.HouseRules),
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
	if input.HouseRules != nil {
		campaign.HouseRules = strings.TrimSpace(*input.HouseRules)
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
