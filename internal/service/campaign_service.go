package service

import (
	"fmt"
	"strings"
	"time"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

// CampaignService encapsulates business logic for campaigns.
type CampaignService struct {
	campaignRepo repository.CampaignRepository
	editionRepo  repository.EditionDataRepository
}

// NewCampaignService constructs a CampaignService.
func NewCampaignService(campaignRepo repository.CampaignRepository, editionRepo repository.EditionDataRepository) *CampaignService {
	return &CampaignService{
		campaignRepo: campaignRepo,
		editionRepo:  editionRepo,
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

	creationMethod := normalizeCreationMethod(edition, strings.TrimSpace(input.CreationMethod))
	if creationMethod == "" {
		return nil, ErrCampaignCreationMethodRequired
	}

	gameplayLevel, err := s.resolveGameplayLevel(edition, strings.TrimSpace(input.GameplayLevel))
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
		normalized := normalizeCreationMethod(campaign.Edition, strings.TrimSpace(*input.CreationMethod))
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

func normalizeCreationMethod(edition, method string) string {
	if method != "" {
		normalized := sanitizeMethod(method)
		switch normalized {
		case "priority":
			return "priority"
		case "sum_to_ten", "sumtotten", "sum2ten":
			return "priority"
		case "karma":
			return "priority"
		default:
			if normalized != "" {
				return normalized
			}
		}
	}

	switch strings.ToLower(edition) {
	case "sr5":
		return "priority"
	default:
		return "priority"
	}
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

// GameplayRules represents resolved gameplay level rules.
type GameplayRules struct {
	Key                    string                  `json:"key"`
	Label                  string                  `json:"label"`
	Description            string                  `json:"description,omitempty"`
	Resources              map[string]int          `json:"resources,omitempty"`
	StartingKarma          int                     `json:"starting_karma,omitempty"`
	MaxCustomKarma         int                     `json:"max_custom_karma,omitempty"`
	KarmaToNuyenLimit      int                     `json:"karma_to_nuyen_limit,omitempty"`
	ContactKarmaMultiplier int                     `json:"contact_karma_multiplier,omitempty"`
	GearRestrictions       domain.GearRestrictions `json:"gear_restrictions,omitempty"`
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
	}, nil
}
