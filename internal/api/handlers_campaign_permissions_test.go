package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/service"
)

// TestCampaignPermissionsMatrix tests the can_edit and can_delete permissions
// for all role combinations (admin, GM, non-GM, etc.)
func TestCampaignPermissionsMatrix(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	// Create users with different roles
	admin := &domain.User{
		ID:           "admin-1",
		Email:        "admin@example.com",
		Username:     "admin",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleAdministrator},
	}
	require.NoError(t, repos.User.Create(admin))

	gm1 := &domain.User{
		ID:           "gm-1",
		Email:        "gm1@example.com",
		Username:     "GM1",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm1))

	gm2 := &domain.User{
		ID:           "gm-2",
		Email:        "gm2@example.com",
		Username:     "GM2",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm2))

	player := &domain.User{
		ID:           "player-1",
		Email:        "player@example.com",
		Username:     "player",
		PasswordHash: "hash",
		Roles:        []string{}, // No special roles
	}
	require.NoError(t, repos.User.Create(player))

	// Create a campaign owned by gm1
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "GM1's Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm1.Username,
		GMUserID:       gm1.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Test cases: (user, expectedCanEdit, expectedCanDelete, description)
	testCases := []struct {
		userID            string
		roles             []string
		expectedCanEdit   bool
		expectedCanDelete bool
		description       string
	}{
		{
			userID:            admin.ID,
			roles:             []string{domain.RoleAdministrator},
			expectedCanEdit:   true,
			expectedCanDelete: true,
			description:       "Administrator can edit/delete any campaign",
		},
		{
			userID:            gm1.ID,
			roles:             []string{domain.RoleGamemaster},
			expectedCanEdit:   true,
			expectedCanDelete: true,
			description:       "GM can edit/delete their own campaign",
		},
		{
			userID:            gm2.ID,
			roles:             []string{domain.RoleGamemaster},
			expectedCanEdit:   false,
			expectedCanDelete: false,
			description:       "GM cannot edit/delete another GM's campaign",
		},
		{
			userID:            player.ID,
			roles:             []string{},
			expectedCanEdit:   false,
			expectedCanDelete: false,
			description:       "Regular player cannot edit/delete any campaign",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.description, func(t *testing.T) {
			// GET /api/campaigns/{id} to check permissions
			req := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID, nil)
			req.SetPathValue("id", campaign.ID)
			attachSession(t, handlers, req, tc.userID, tc.roles)

			rr := httptest.NewRecorder()
			handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaign)).ServeHTTP(rr, req)

			require.Equal(t, http.StatusOK, rr.Code)

			var response campaignPayload
			require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &response))

			assert.Equal(t, tc.expectedCanEdit, response.CanEdit,
				"can_edit mismatch for %s", tc.description)
			assert.Equal(t, tc.expectedCanDelete, response.CanDelete,
				"can_delete mismatch for %s", tc.description)
		})
	}
}

// TestCampaignPermissionsInList tests that permissions are correctly set
// when listing campaigns
func TestCampaignPermissionsInList(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	admin := &domain.User{
		ID:           "admin-1",
		Email:        "admin@example.com",
		Username:     "admin",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleAdministrator},
	}
	require.NoError(t, repos.User.Create(admin))

	gm1 := &domain.User{
		ID:           "gm-1",
		Email:        "gm1@example.com",
		Username:     "GM1",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm1))

	gm2 := &domain.User{
		ID:           "gm-2",
		Email:        "gm2@example.com",
		Username:     "GM2",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm2))

	// Create two campaigns: one by gm1, one by gm2
	campaign1, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "GM1's Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm1.Username,
		GMUserID:       gm1.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	campaign2, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "GM2's Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm2.Username,
		GMUserID:       gm2.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Test admin sees all campaigns with edit/delete permissions
	req := httptest.NewRequest(http.MethodGet, "/api/campaigns", nil)
	attachSession(t, handlers, req, admin.ID, []string{domain.RoleAdministrator})

	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaigns)).ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var campaigns []campaignPayload
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &campaigns))
	require.Len(t, campaigns, 2)

	// Find campaigns by ID
	var c1, c2 *campaignPayload
	for i := range campaigns {
		if campaigns[i].ID == campaign1.ID {
			c1 = &campaigns[i]
		}
		if campaigns[i].ID == campaign2.ID {
			c2 = &campaigns[i]
		}
	}
	require.NotNil(t, c1, "Campaign 1 should be in list")
	require.NotNil(t, c2, "Campaign 2 should be in list")

	// Admin should be able to edit/delete both
	assert.True(t, c1.CanEdit, "Admin should be able to edit campaign 1")
	assert.True(t, c1.CanDelete, "Admin should be able to delete campaign 1")
	assert.True(t, c2.CanEdit, "Admin should be able to edit campaign 2")
	assert.True(t, c2.CanDelete, "Admin should be able to delete campaign 2")

	// Test gm1 only sees their own campaign (filtered by role)
	req = httptest.NewRequest(http.MethodGet, "/api/campaigns", nil)
	attachSession(t, handlers, req, gm1.ID, []string{domain.RoleGamemaster})

	rr = httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaigns)).ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	campaigns = []campaignPayload{}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &campaigns))
	// GM1 should only see their own campaign (filtered by role)
	require.Len(t, campaigns, 1, "GM1 should only see their own campaign")

	// Find campaign
	var gm1Campaign *campaignPayload
	for i := range campaigns {
		if campaigns[i].ID == campaign1.ID {
			gm1Campaign = &campaigns[i]
			break
		}
	}
	require.NotNil(t, gm1Campaign, "GM1 should see their own campaign")

	// GM1 should be able to edit/delete their own campaign
	assert.True(t, gm1Campaign.CanEdit, "GM1 should be able to edit their own campaign")
	assert.True(t, gm1Campaign.CanDelete, "GM1 should be able to delete their own campaign")

	// Verify GM1 does NOT see GM2's campaign at all
	foundCampaign2 := false
	for i := range campaigns {
		if campaigns[i].ID == campaign2.ID {
			foundCampaign2 = true
			break
		}
	}
	assert.False(t, foundCampaign2, "GM1 should NOT see GM2's campaign in the list")
}

// TestCampaignWithoutGMHasNoPermissions tests that campaigns without a GM
// cannot be managed by anyone (except admin)
func TestCampaignWithoutGMHasNoPermissions(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	// Create a campaign without a GM (empty GmUserID)
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Orphan Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         "",
		GMUserID:       "", // No GM assigned
		Status:         "Active",
	})
	require.NoError(t, err)

	// Verify the campaign has no GM
	require.Empty(t, campaign.GmUserID)

	// Even the GM role should not be able to manage it
	req := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID, nil)
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, gm.ID, []string{domain.RoleGamemaster})

	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaign)).ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var response campaignPayload
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &response))

	// GM should not be able to edit/delete campaign without GM assignment
	assert.False(t, response.CanEdit, "GM should not be able to edit campaign without GM")
	assert.False(t, response.CanDelete, "GM should not be able to delete campaign without GM")
}

// TestCampaignUpdateDeleteEnforcesPermissions tests that the backend
// actually enforces permissions on update/delete operations
func TestCampaignUpdateDeleteEnforcesPermissions(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm1 := &domain.User{
		ID:           "gm-1",
		Email:        "gm1@example.com",
		Username:     "GM1",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm1))

	gm2 := &domain.User{
		ID:           "gm-2",
		Email:        "gm2@example.com",
		Username:     "GM2",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm2))

	// Create campaign owned by gm1
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "GM1's Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm1.Username,
		GMUserID:       gm1.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Test: GM2 tries to update GM1's campaign (should fail)
	updateBody, _ := json.Marshal(map[string]string{"name": "Hacked Name"})
	req := httptest.NewRequest(http.MethodPut, "/api/campaigns/"+campaign.ID, bytes.NewReader(updateBody))
	req.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, req, gm2.ID, []string{domain.RoleGamemaster})

	rr := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.UpdateCampaign)).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusForbidden, rr.Code, "GM2 should not be able to update GM1's campaign")

	// Test: GM2 tries to delete GM1's campaign (should fail)
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/campaigns/"+campaign.ID, nil)
	deleteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, deleteReq, gm2.ID, []string{domain.RoleGamemaster})

	deleteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.DeleteCampaign)).ServeHTTP(deleteRR, deleteReq)

	assert.Equal(t, http.StatusForbidden, deleteRR.Code, "GM2 should not be able to delete GM1's campaign")

	// Verify campaign is still intact
	reload, err := repos.Campaign.GetByID(campaign.ID)
	require.NoError(t, err)
	assert.Equal(t, "GM1's Campaign", reload.Name, "Campaign should not have been modified")
}
