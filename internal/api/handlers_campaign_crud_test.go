package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/api"
	"shadowmaster/internal/domain"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/internal/service"
	"shadowmaster/pkg/storage"
)

type campaignPayload struct {
	ID             string                           `json:"id"`
	Name           string                           `json:"name"`
	Edition        string                           `json:"edition"`
	CreationMethod string                           `json:"creation_method"`
	GameplayLevel  string                           `json:"gameplay_level"`
	Theme          string                           `json:"theme"`
	HouseRuleNotes string                           `json:"house_rule_notes"`
	Automation     map[string]bool                  `json:"automation"`
	Factions       []domain.CampaignFaction         `json:"factions"`
	Locations      []domain.CampaignLocation        `json:"locations"`
	Placeholders   []domain.CampaignPlaceholder     `json:"placeholders"`
	SessionSeed    *domain.CampaignSessionSeed      `json:"session_seed"`
	PlayerUserIDs  []string                         `json:"player_user_ids"`
	Players        []domain.CampaignPlayerReference `json:"players"`
	EnabledBooks   []string                         `json:"enabled_books"`
	Status         string                           `json:"status"`
	DeletedAt      *time.Time                       `json:"deleted_at,omitempty"`
	GmUserID       string                           `json:"gm_user_id,omitempty"`
	GMUsername     string                           `json:"gm_username,omitempty"`
	CanEdit        bool                             `json:"can_edit"`
	CanDelete      bool                             `json:"can_delete"`
	GameplayRules  struct {
		Key string `json:"key"`
	} `json:"gameplay_rules"`
}

func TestCampaignHandlersCRUD(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	// Create admin user for creating campaigns
	admin := &domain.User{
		ID:           "admin",
		Email:        "admin@example.com",
		Username:     "admin",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleAdministrator},
	}
	require.NoError(t, repos.User.Create(admin))

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	reqBody := map[string]interface{}{
		"name":             "Seattle Shadows",
		"description":      "Prime run",
		"edition":          "SR5",
		"creation_method":  "priority",
		"gameplay_level":   "experienced",
		"theme":            "Neon Nights",
		"house_rule_notes": "no dragons at the table",
		"automation": map[string]bool{
			"init_tracking": true,
			"recoil":        false,
		},
		"factions": []map[string]string{
			{"id": " f1 ", "name": "  Ares Macrotechnology ", "tags": "Corporate"},
		},
		"locations": []map[string]string{
			{"id": "l1", "name": "  Safehouse ", "descriptor": " Downtown "},
		},
		"placeholders": []map[string]string{
			{"id": "p1", "name": " Runner ", "role": " Face "},
		},
		"session_seed": map[string]interface{}{
			"title":          " Session Zero ",
			"objectives":     "Introductions",
			"scene_template": "social_meetup",
			"summary":        "Meet the fixer",
			"skip":           false,
		},
		"player_user_ids": []string{" gm-1 ", "gm-1"}, // duplicates to verify normalization
		"players": []map[string]string{
			{"id": "gm-1", "username": " GM "},
		},
		"status":        "Active",
		"gm_name":       gm.Username,
		"gm_user_id":    gm.ID,
		"enabled_books": []string{"SR5"},
	}

	body, err := json.Marshal(reqBody)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/campaigns", bytes.NewReader(body))
	attachSession(t, handlers, req, "admin", []string{domain.RoleAdministrator})

	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.CreateCampaign)).ServeHTTP(rr, req)

	require.Equal(t, http.StatusCreated, rr.Code)

	var created campaignPayload
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &created))
	assert.Equal(t, "Seattle Shadows", created.Name)
	assert.Equal(t, "sr5", created.Edition)
	// Verify GM user ID and username are set from the creating user (admin)
	assert.Equal(t, "admin", created.GmUserID)
	assert.Equal(t, "admin", created.GMUsername)
	assert.Equal(t, "experienced", created.GameplayLevel)
	assert.Equal(t, "Neon Nights", created.Theme)
	assert.Equal(t, "no dragons at the table", created.HouseRuleNotes)
	assert.Equal(t, map[string]bool{"init_tracking": true, "recoil": false}, created.Automation)
	require.Len(t, created.Factions, 1)
	assert.Equal(t, "f1", created.Factions[0].ID)
	require.Len(t, created.Locations, 1)
	assert.Equal(t, "Safehouse", created.Locations[0].Name)
	require.Len(t, created.Placeholders, 1)
	assert.Equal(t, "Runner", created.Placeholders[0].Name)
	require.NotNil(t, created.SessionSeed)
	assert.Equal(t, "Session Zero", created.SessionSeed.Title)
	assert.ElementsMatch(t, []string{"gm-1"}, created.PlayerUserIDs)
	require.Len(t, created.Players, 1)
	assert.Equal(t, "gm-1", created.Players[0].ID)
	assert.Equal(t, "GM", created.Players[0].Username)
	assert.True(t, created.CanEdit)
	assert.Equal(t, "experienced", created.GameplayRules.Key)

	// GET /api/campaigns
	listReq := httptest.NewRequest(http.MethodGet, "/api/campaigns", nil)
	attachSession(t, handlers, listReq, "admin", []string{domain.RoleAdministrator})
	listRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaigns)).ServeHTTP(listRR, listReq)
	require.Equal(t, http.StatusOK, listRR.Code)

	var campaigns []campaignPayload
	require.NoError(t, json.Unmarshal(listRR.Body.Bytes(), &campaigns))
	require.Len(t, campaigns, 1)
	assert.Equal(t, created.ID, campaigns[0].ID)

	// GET /api/campaigns/{id}
	getReq := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+created.ID, nil)
	getReq.SetPathValue("id", created.ID)
	attachSession(t, handlers, getReq, "admin", []string{domain.RoleAdministrator})
	getRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaign)).ServeHTTP(getRR, getReq)
	require.Equal(t, http.StatusOK, getRR.Code)

	var fetched campaignPayload
	require.NoError(t, json.Unmarshal(getRR.Body.Bytes(), &fetched))
	assert.Equal(t, created.ID, fetched.ID)
	assert.True(t, fetched.CanEdit)

	// PUT /api/campaigns/{id} - Update all editable fields
	updateBody, err := json.Marshal(map[string]interface{}{
		"name":          "Renamed Shadows",
		"status":        "Paused",
		"theme":         "Cyberpunk Noir",
		"enabled_books": []string{"SR5", "AP"},
		"automation": map[string]bool{
			"initiative_automation": true,
			"damage_tracking":       true,
			"matrix_trace":          false,
			"recoil_tracking":       false,
			"spell_cast":            true,
			"skill_test":            false,
		},
	})
	require.NoError(t, err)

	updateReq := httptest.NewRequest(http.MethodPut, "/api/campaigns/"+created.ID, bytes.NewReader(updateBody))
	updateReq.SetPathValue("id", created.ID)
	attachSession(t, handlers, updateReq, "admin", []string{domain.RoleAdministrator})
	updateRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(updateRR, updateReq)
	require.Equal(t, http.StatusOK, updateRR.Code)

	var updated campaignPayload
	require.NoError(t, json.Unmarshal(updateRR.Body.Bytes(), &updated))
	assert.Equal(t, "Renamed Shadows", updated.Name)
	assert.Equal(t, "Paused", updated.Status)
	assert.Equal(t, "Cyberpunk Noir", updated.Theme)
	assert.ElementsMatch(t, []string{"SR5", "AP"}, updated.EnabledBooks)
	assert.Equal(t, map[string]bool{
		"initiative_automation": true,
		"damage_tracking":       true,
		"matrix_trace":          false,
		"recoil_tracking":       false,
		"spell_cast":            true,
		"skill_test":            false,
	}, updated.Automation)

	// Verify persisted data
	reload, err := repos.Campaign.GetByID(created.ID)
	require.NoError(t, err)
	assert.Equal(t, "Renamed Shadows", reload.Name)
	assert.Equal(t, "Paused", reload.Status)
	assert.Equal(t, "Cyberpunk Noir", reload.Theme)
	assert.ElementsMatch(t, []string{"SR5", "AP"}, reload.EnabledBooks)
	assert.Equal(t, map[string]bool{
		"initiative_automation": true,
		"damage_tracking":       true,
		"matrix_trace":          false,
		"recoil_tracking":       false,
		"spell_cast":            true,
		"skill_test":            false,
	}, reload.Automation)
	// Verify immutable fields remain unchanged
	assert.Equal(t, "no dragons at the table", reload.HouseRuleNotes)
	require.Len(t, reload.Factions, 1)
	assert.Equal(t, "f1", reload.Factions[0].ID)

	// DELETE /api/campaigns/{id} - Soft delete
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/campaigns/"+created.ID, nil)
	deleteReq.SetPathValue("id", created.ID)
	attachSession(t, handlers, deleteReq, "admin", []string{domain.RoleAdministrator})
	deleteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.DeleteCampaign)).ServeHTTP(deleteRR, deleteReq)
	require.Equal(t, http.StatusNoContent, deleteRR.Code)

	// Verify campaign is soft-deleted (not in GetAll list)
	listAfterDeleteReq := httptest.NewRequest(http.MethodGet, "/api/campaigns", nil)
	attachSession(t, handlers, listAfterDeleteReq, "admin", []string{domain.RoleAdministrator})
	listAfterDeleteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaigns)).ServeHTTP(listAfterDeleteRR, listAfterDeleteReq)
	require.Equal(t, http.StatusOK, listAfterDeleteRR.Code)
	var campaignsAfterDelete []campaignPayload
	require.NoError(t, json.Unmarshal(listAfterDeleteRR.Body.Bytes(), &campaignsAfterDelete))
	// Campaign should not appear in the list (soft-deleted)
	found := false
	for _, c := range campaignsAfterDelete {
		if c.ID == created.ID {
			found = true
			break
		}
	}
	assert.False(t, found, "Deleted campaign should not appear in GetAll results")

	// Verify campaign still exists but is marked as deleted (can be retrieved by ID)
	deletedCampaignReq := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+created.ID, nil)
	deletedCampaignReq.SetPathValue("id", created.ID)
	attachSession(t, handlers, deletedCampaignReq, "admin", []string{domain.RoleAdministrator})
	deletedCampaignRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaign)).ServeHTTP(deletedCampaignRR, deletedCampaignReq)
	require.Equal(t, http.StatusOK, deletedCampaignRR.Code)
	var deletedCampaign campaignPayload
	require.NoError(t, json.Unmarshal(deletedCampaignRR.Body.Bytes(), &deletedCampaign))
	assert.NotNil(t, deletedCampaign.DeletedAt, "Campaign should have DeletedAt timestamp set")
	assert.False(t, deletedCampaign.DeletedAt.IsZero(), "Campaign DeletedAt should not be zero")
}

func TestUpdateCampaignRequiresPrivileges(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{ID: "gm-1", Email: "gm@example.com", Username: "GM", PasswordHash: "hash", Roles: []string{domain.RoleGamemaster}}
	require.NoError(t, repos.User.Create(gm))

	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Long Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	body, err := json.Marshal(map[string]string{"name": "Unauthorized Rename"})
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(body))
	req.SetPathValue("id", campaign.ID)
	// Session belongs to a different gamemaster without admin rights
	attachSession(t, handlers, req, "gm-2", []string{domain.RoleGamemaster})

	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusForbidden, rr.Code)
}

func TestUpdateCampaignAllFields(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	// Create initial campaign
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
		Theme:          "Original Theme",
		EnabledBooks:   []string{"SR5"},
		Automation: map[string]bool{
			"initiative_automation": false,
			"damage_tracking":       false,
		},
	})
	require.NoError(t, err)

	// Test updating name
	updateBody, _ := json.Marshal(map[string]interface{}{"name": "Updated Name"})
	req := httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.Equal(t, http.StatusOK, rr.Code)

	var result campaignPayload
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	assert.Equal(t, "Updated Name", result.Name)

	// Test updating status
	updateBody, _ = json.Marshal(map[string]interface{}{"status": "Completed"})
	req = httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr = httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	assert.Equal(t, "Completed", result.Status)

	// Test updating theme
	updateBody, _ = json.Marshal(map[string]interface{}{"theme": "New Theme"})
	req = httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr = httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	assert.Equal(t, "New Theme", result.Theme)

	// Test updating enabled_books
	updateBody, _ = json.Marshal(map[string]interface{}{"enabled_books": []string{"SR5", "AP"}})
	req = httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr = httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	assert.ElementsMatch(t, []string{"SR5", "AP"}, result.EnabledBooks)

	// Test updating automation
	updateBody, _ = json.Marshal(map[string]interface{}{
		"automation": map[string]bool{
			"initiative_automation": true,
			"damage_tracking":       true,
			"matrix_trace":          true,
			"recoil_tracking":       false,
			"spell_cast":            false,
			"skill_test":            true,
		},
	})
	req = httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr = httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	assert.Equal(t, map[string]bool{
		"initiative_automation": true,
		"damage_tracking":       true,
		"matrix_trace":          true,
		"recoil_tracking":       false,
		"spell_cast":            false,
		"skill_test":            true,
	}, result.Automation)

	// Verify final state in repository
	final, err := repos.Campaign.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, "Updated Name", final.Name)
	assert.Equal(t, "Completed", final.Status)
	assert.Equal(t, "New Theme", final.Theme)
	assert.ElementsMatch(t, []string{"SR5", "AP"}, final.EnabledBooks)
	assert.Equal(t, map[string]bool{
		"initiative_automation": true,
		"damage_tracking":       true,
		"matrix_trace":          true,
		"recoil_tracking":       false,
		"spell_cast":            false,
		"skill_test":            true,
	}, final.Automation)
}

func TestUpdateCampaignAutomationPartialUpdate(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	// Create campaign with initial automation
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Automation Test",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
		Automation: map[string]bool{
			"initiative_automation": true,
			"damage_tracking":       true,
			"matrix_trace":          false,
		},
	})
	require.NoError(t, err)

	// Update with partial automation (should replace entire map)
	updateBody, _ := json.Marshal(map[string]interface{}{
		"automation": map[string]bool{
			"recoil_tracking": true,
			"spell_cast":      true,
		},
	})
	req := httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, "gm-1", []string{domain.RoleGamemaster})
	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)
	require.Equal(t, http.StatusOK, rr.Code)

	var result campaignPayload
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &result))
	// Should only have the two keys we sent
	assert.Equal(t, map[string]bool{
		"recoil_tracking": true,
		"spell_cast":      true,
	}, result.Automation)

	// Verify in repository
	final, err := repos.Campaign.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, map[string]bool{
		"recoil_tracking": true,
		"spell_cast":      true,
	}, final.Automation)
}

func setupCampaignHandlers(t *testing.T) (*api.Handlers, *jsonrepo.Repositories) {
	dir := t.TempDir()

	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	writeSR5EditionData(t, store)
	writeSR5BooksData(t, store)

	repos, err := jsonrepo.NewRepositories(dir)
	require.NoError(t, err)

	campaignService := service.NewCampaignService(repos.Campaign, repos.Edition, repos.Books)
	sessionService := service.NewSessionService(repos.Session, repos.Campaign)
	sceneService := service.NewSceneService(repos.Scene, repos.Session)

	handlers := api.NewHandlers(
		repos,
		service.NewCharacterService(repos.Character),
		service.NewUserService(repos.User),
		api.NewSessionManager("", time.Hour, false),
		campaignService,
		sessionService,
		sceneService,
	)

	return handlers, repos
}

func attachSession(t *testing.T, handlers *api.Handlers, req *http.Request, userID string, roles []string) {
	t.Helper()
	tmp := httptest.NewRecorder()
	require.NoError(t, handlers.Sessions.Create(tmp, userID, roles))

	for _, cookie := range tmp.Result().Cookies() {
		req.AddCookie(cookie)
	}
}
