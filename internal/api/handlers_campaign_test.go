package api_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"shadowmaster/internal/api"
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
	"shadowmaster/pkg/storage"
	"testing"
	"time"
)

func TestGetCampaignCharacterCreationData(t *testing.T) {
	dir := t.TempDir()

	repos, err := jsonrepo.NewRepositories(dir)
	if err != nil {
		t.Fatalf("new repositories: %v", err)
	}

	store, err := storage.NewJSONStore(dir)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}

	writeSR5EditionData(t, store)

	campaignService := service.NewCampaignService(repos.Campaign, repos.Edition)
	sessionService := service.NewSessionService(repos.Session, repos.Campaign)
	sceneService := service.NewSceneService(repos.Scene, repos.Session)

	campaign, err := campaignService.CreateCampaign(service.CampaignCreateInput{
		Name:    "Prime Run",
		Edition: "sr5",
		Status:  "Active",
	})
	if err != nil {
		t.Fatalf("create campaign: %v", err)
	}

	sessionManager := api.NewSessionManager("", time.Hour, false)
	handlers := api.NewHandlers(
		repos,
		service.NewCharacterService(repos.Character),
		service.NewUserService(repos.User),
		sessionManager,
		campaignService,
		sessionService,
		sceneService,
	)

	req := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID+"/character-creation", nil)
	req.SetPathValue("id", campaign.ID)
	rr := httptest.NewRecorder()

	handlers.GetCampaignCharacterCreationData(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var payload struct {
		CampaignID    string                       `json:"campaign_id"`
		Edition       string                       `json:"edition"`
		GameplayRules *service.GameplayRules       `json:"gameplay_rules"`
		EditionData   domain.CharacterCreationData `json:"edition_data"`
	}
	if err := json.Unmarshal(rr.Body.Bytes(), &payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.CampaignID != campaign.ID {
		t.Fatalf("expected campaign id %s, got %s", campaign.ID, payload.CampaignID)
	}
	if payload.Edition != "sr5" {
		t.Fatalf("expected edition sr5, got %s", payload.Edition)
	}
	if payload.GameplayRules == nil {
		t.Fatal("expected gameplay rules to be present")
	}
	if payload.GameplayRules.Key != "experienced" {
		t.Fatalf("expected gameplay rules key experienced, got %s", payload.GameplayRules.Key)
	}
	if payload.GameplayRules.Resources["A"] != 450000 {
		t.Fatalf("expected resource override for priority A, got %d", payload.GameplayRules.Resources["A"])
	}
}

func writeSR5EditionData(t *testing.T, store *storage.JSONStore) {
	t.Helper()

	data := domain.CharacterCreationData{
		Priorities: map[string]map[string]domain.PriorityOption{
			"resources": {
				"A": {Label: "450,000¥"},
				"B": {Label: "275,000¥"},
				"C": {Label: "140,000¥"},
				"D": {Label: "50,000¥"},
				"E": {Label: "6,000¥"},
			},
		},
		Metatypes: []domain.MetatypeDefinition{},
		GameplayLevels: map[string]domain.GameplayLevel{
			"experienced": {
				Label:         "Experienced",
				Resources:     map[string]int{"A": 450000},
				StartingKarma: 25,
			},
		},
	}

	if err := store.Write(filepath.Join("editions", "sr5", "character_creation.json"), &data); err != nil {
		t.Fatalf("write edition data: %v", err)
	}
}
