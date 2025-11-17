package service

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
)

func TestCampaignServiceCreateDefaults(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:     "Neon Noir",
		Edition:  "SR5",
		GMName:   "GM Name",
		GMUserID: "user-1",
	})
	require.NoError(t, err)

	assert.Equal(t, "sr5", campaign.Edition)
	assert.Equal(t, "priority", campaign.CreationMethod)
	assert.Equal(t, "experienced", campaign.GameplayLevel)
	assert.Equal(t, []string{"SR5"}, campaign.EnabledBooks)

	rules, err := service.DescribeGameplayRules(campaign)
	require.NoError(t, err)
	require.NotNil(t, rules)
	assert.Equal(t, "experienced", rules.Key)
	require.NotNil(t, rules.Advancement)
	assert.Equal(t, 5, rules.Advancement.KarmaCosts.AttributeMultiplier)
	require.Len(t, rules.Advancement.FocusBonding, 7)

	// sanity check repo stores normalized data
	stored, err := repo.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, "sr5", stored.Edition)
}

func TestCampaignServiceCreateRequiresEdition(t *testing.T) {
	service, _ := newCampaignService(t)

	_, err := service.CreateCampaign(CampaignCreateInput{})
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrCampaignEditionRequired)
}

func TestCampaignServiceCreationMethodNormalization(t *testing.T) {
	service, _ := newCampaignService(t)

	testCases := []struct {
		name     string
		input    string
		expected string
	}{
		{name: "sum to ten label", input: "Sum-to-Ten", expected: "sum_to_ten"},
		{name: "typo sumtotten", input: "sumtotten", expected: "sum_to_ten"},
		{name: "karma lower", input: "karma", expected: "karma"},
		{name: "priority title case", input: "Priority", expected: "priority"},
		{name: "empty defaults to priority", input: "", expected: "priority"},
	}

	for _, tc := range testCases {
		tc := tc
		campaign, err := service.CreateCampaign(CampaignCreateInput{
			Name:           "Test " + tc.name,
			Edition:        "sr5",
			CreationMethod: tc.input,
		})
		require.NoError(t, err, tc.name)
		assert.Equal(t, tc.expected, campaign.CreationMethod, tc.name)
	}
}

func TestCampaignServiceRejectsUnknownBook(t *testing.T) {
	service, _ := newCampaignService(t)

	_, err := service.CreateCampaign(CampaignCreateInput{
		Name:         "Bad Books",
		Edition:      "sr5",
		EnabledBooks: []string{"ZZZ"},
	})
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrCampaignUnknownBook)
}

func TestCampaignServiceListSourceBooksFallback(t *testing.T) {
	service, _ := newCampaignService(t)

	books, err := service.ListSourceBooks("sr3")
	require.NoError(t, err)
	require.Len(t, books, 1)
	assert.Equal(t, "SR3", books[0].Code)
	assert.NotEmpty(t, books[0].Name)
}

func TestCampaignServiceImmutableFields(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Lockdown Run",
		Edition: "sr5",
	})
	require.NoError(t, err)

	newName := "Updated Run"
	updated, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Name: &newName})
	require.NoError(t, err)
	assert.Equal(t, newName, updated.Name)

	edition := "sr3"
	_, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Edition: &edition})
	require.Error(t, err)

	method := "karma"
	_, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{CreationMethod: &method})
	require.Error(t, err)

	newGM := "user-2"
	updated, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{GMUserID: &newGM})
	require.NoError(t, err)
	assert.Equal(t, newGM, updated.GmUserID)

	invalidLevel := "legendary"
	_, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{GameplayLevel: &invalidLevel})
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrCampaignUnknownGameplayLevel)

	newBooks := []string{"SR5", "AP"}
	updated, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{EnabledBooks: &newBooks})
	require.NoError(t, err)
	assert.ElementsMatch(t, newBooks, updated.EnabledBooks)

	invalidBook := []string{"XYZ"}
	_, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{EnabledBooks: &invalidBook})
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrCampaignUnknownBook)

	// verify persisted data remains consistent
	stored, err := repo.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, updated.EnabledBooks, stored.EnabledBooks)
}

func TestCampaignServiceUpdateAutomation(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Automation Test",
		Edition: "sr5",
	})
	require.NoError(t, err)

	// Test setting automation
	automation := map[string]bool{
		"initiative_automation": true,
		"damage_tracking":       true,
		"matrix_trace":          false,
		"recoil_tracking":       true,
		"spell_cast":            false,
		"skill_test":            true,
	}
	updated, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Automation: &automation})
	require.NoError(t, err)
	assert.Equal(t, automation, updated.Automation)

	// Test updating automation (partial replacement)
	newAutomation := map[string]bool{
		"initiative_automation": false,
		"damage_tracking":       false,
	}
	updated, err = service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Automation: &newAutomation})
	require.NoError(t, err)
	assert.Equal(t, newAutomation, updated.Automation)

	// Verify persisted
	stored, err := repo.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, newAutomation, stored.Automation)
}

func TestCampaignServiceUpdateStatus(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Status Test",
		Edition: "sr5",
		Status:  "Active",
	})
	require.NoError(t, err)
	assert.Equal(t, "Active", campaign.Status)

	// Test status transitions
	statuses := []string{"Paused", "Completed", "Active"}
	for _, status := range statuses {
		updated, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Status: &status})
		require.NoError(t, err)
		assert.Equal(t, status, updated.Status)

		stored, err := repo.GetByID(campaign.ID)
		require.NoError(t, err)
		assert.Equal(t, status, stored.Status)
	}
}

func TestCampaignServiceUpdateTheme(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign, err := service.CreateCampaign(CampaignCreateInput{
		Name:    "Theme Test",
		Edition: "sr5",
		Theme:   "Original Theme",
	})
	require.NoError(t, err)
	assert.Equal(t, "Original Theme", campaign.Theme)

	newTheme := "Updated Theme"
	updated, err := service.UpdateCampaign(campaign.ID, CampaignUpdateInput{Theme: &newTheme})
	require.NoError(t, err)
	assert.Equal(t, newTheme, updated.Theme)

	stored, err := repo.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, newTheme, stored.Theme)
}

func TestCampaignServiceMigratesLegacyData(t *testing.T) {
	store, index := newCampaignStore(t)

	legacy := &domain.Campaign{
		ID:      "legacy",
		Name:    "Legacy Campaign",
		Edition: "sr5",
	}
	require.NoError(t, store.Write(filepath.Join("campaigns", "legacy.json"), legacy))

	index.Campaigns["legacy"] = filepath.Join("campaigns", "legacy.json")

	service, repo := newCampaignServiceWithStore(t, store, index)

	campaign, err := service.GetCampaign("legacy")
	require.NoError(t, err)

	assert.Equal(t, "priority", campaign.CreationMethod)
	assert.Equal(t, "experienced", campaign.GameplayLevel)
	assert.False(t, campaign.SetupLockedAt.IsZero(), "expected setup locked timestamp to be set")

	// ensure repo persisted migration changes
	stored, err := repo.GetByID("legacy")
	require.NoError(t, err)
	assert.Equal(t, campaign.CreationMethod, stored.CreationMethod)
	assert.Equal(t, campaign.GameplayLevel, stored.GameplayLevel)
	assert.Equal(t, campaign.SetupLockedAt, stored.SetupLockedAt)
}

func TestCampaignServiceDescribeGameplayRulesUnknownEdition(t *testing.T) {
	service, repo := newCampaignService(t)

	campaign := &domain.Campaign{Edition: "sr3", EnabledBooks: []string{"SR5"}}
	require.NoError(t, repo.Create(campaign))

	rules, err := service.DescribeGameplayRules(campaign)
	require.NoError(t, err)
	assert.Nil(t, rules)
}

func TestSanitizeMethod(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		name     string
		input    string
		expected string
	}{
		{name: "trim and lower", input: "  Priority  ", expected: "priority"},
		{name: "replace dash", input: "sum-to-ten", expected: "sum_to_ten"},
		{name: "replace spaces", input: "sum to ten", expected: "sum_to_ten"},
		{name: "mixed case", input: "SUM_To_TEN", expected: "sum_to_ten"},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.expected, sanitizeMethod(tc.input))
		})
	}
}

func TestCanonicalizeCreationMethod(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		input    string
		expected string
	}{
		{"", ""},
		{"priority", "priority"},
		{"sumtotten", "sum_to_ten"},
		{"sum_to10", "sum_to_ten"},
		{"karma", "karma"},
		{"point_buy", "karma"},
		{"unknown", "unknown"},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.input, func(t *testing.T) {
			assert.Equal(t, tc.expected, canonicalizeCreationMethod(tc.input))
		})
	}
}

func TestDefaultCreationMethodForEdition(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		name      string
		available map[string]domain.CreationMethod
		edition   string
		expected  string
	}{
		{
			name:      "priority available",
			available: map[string]domain.CreationMethod{"priority": {}},
			edition:   "sr5",
			expected:  "priority",
		},
		{
			name:      "first available when priority missing",
			available: map[string]domain.CreationMethod{"karma": {}},
			edition:   "sr5",
			expected:  "karma",
		},
		{
			name:     "fall back to edition default",
			edition:  "sr5",
			expected: "priority",
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.expected, defaultCreationMethodForEdition(tc.available, tc.edition))
		})
	}
}

func TestNormalizeGameplayLevel(t *testing.T) {
	t.Parallel()

	assert.Equal(t, "street", normalizeGameplayLevel("SR5", "Street"))
	assert.Equal(t, "", normalizeGameplayLevel("SR5", ""))
}

func TestCampaignServiceValidateEnabledBooks(t *testing.T) {
	t.Parallel()

	books := []domain.SourceBook{
		{Code: "SR5"},
		{Code: "AP"},
	}

	service := &CampaignService{
		bookRepo: &stubBookRepo{books: books},
	}

	t.Run("adds default sr5 book", func(t *testing.T) {
		actual, err := service.validateEnabledBooks("sr5", nil)
		require.NoError(t, err)
		assert.Equal(t, []string{"SR5"}, actual)
	})

	t.Run("preserves requested valid books", func(t *testing.T) {
		actual, err := service.validateEnabledBooks("sr5", []string{"AP"})
		require.NoError(t, err)
		assert.ElementsMatch(t, []string{"AP", "SR5"}, actual)
	})

	t.Run("errors on unknown book when repo has list", func(t *testing.T) {
		_, err := service.validateEnabledBooks("sr5", []string{"XYZ"})
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrCampaignUnknownBook)
	})
}

func newCampaignStore(t *testing.T) (*storage.JSONStore, *jsonrepo.Index) {
	t.Helper()

	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err, "new store")
	return store, jsonrepo.NewIndex()
}

func newCampaignService(t *testing.T) (*CampaignService, repository.CampaignRepository) {
	store, index := newCampaignStore(t)
	return newCampaignServiceWithStore(t, store, index)
}

func newCampaignServiceWithStore(t *testing.T, store *storage.JSONStore, index *jsonrepo.Index) (*CampaignService, repository.CampaignRepository) {
	t.Helper()

	writeGameplayLevelData(t, store)
	writeBooksData(t, store)
	repo := jsonrepo.NewCampaignRepository(store, index)
	service := NewCampaignService(repo, jsonrepo.NewEditionRepository(store), jsonrepo.NewBooksRepository(store))
	return service, repo
}

type stubBookRepo struct {
	books []domain.SourceBook
	err   error
}

func (s *stubBookRepo) ListBooks(string) ([]domain.SourceBook, error) {
	if s.err != nil {
		return nil, s.err
	}
	return s.books, nil
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
		Advancement: &domain.AdvancementRules{
			KarmaCosts: domain.AdvancementKarmaCosts{
				AttributeMultiplier:              5,
				ActiveSkillMultiplier:            2,
				KnowledgeSkillMultiplier:         1,
				SkillGroupMultiplier:             5,
				Specialization:                   7,
				NewKnowledgeSkill:                1,
				NewComplexForm:                   4,
				NewSpell:                         5,
				InitiationBase:                   10,
				InitiationPerGrade:               3,
				PositiveQualityMultiplier:        2,
				NegativeQualityRemovalMultiplier: 2,
			},
			Training: domain.AdvancementTraining{
				AttributePerRatingWeeks:    1,
				EdgeRequiresDowntime:       false,
				InstructorReductionPercent: 25,
				ActiveSkillBrackets: []domain.SkillTrainingBracket{
					{MinRating: 1, MaxRating: 4, PerRating: 1, Unit: "day"},
				},
				SkillGroupPerRatingWeeks: 2,
				SpecializationMonths:     1,
			},
			Limits: domain.AdvancementLimits{
				AttributeIncreasePerDowntime:        2,
				SkillIncreasePerDowntime:            3,
				SkillGroupIncreasePerDowntime:       1,
				AllowsSimultaneousAttributeAndSkill: true,
				AllowsSimultaneousPhysicalAndMental: true,
				RequiresAugmentationRecoveryPause:   true,
			},
			FocusBonding: []domain.FocusBondingRule{
				{Type: "enchanting_focus", Label: "Enchanting Focus", KarmaPerForce: 3},
				{Type: "metamagic_focus", Label: "Metamagic Focus", KarmaPerForce: 3},
				{Type: "weapon_focus", Label: "Weapon Focus", KarmaPerForce: 3},
				{Type: "power_focus", Label: "Power Focus", KarmaPerForce: 6},
				{Type: "qi_focus", Label: "Qi Focus", KarmaPerForce: 2},
				{Type: "spell_focus", Label: "Spell Focus", KarmaPerForce: 2},
				{Type: "spirit_focus", Label: "Spirit Focus", KarmaPerForce: 2},
			},
		},
	}

	require.NoError(t, store.Write(filepath.Join("editions", "sr5", "character_creation.json"), &data))
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

	require.NoError(t, store.Write(filepath.Join("editions", "sr5", "books", "all.json"), &data))
}
