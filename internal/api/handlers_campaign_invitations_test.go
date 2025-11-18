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

// TestPlayerInvitationFlow tests the complete flow of inviting a player,
// them accepting, and verifying access
func TestPlayerInvitationFlow(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	// Create GM
	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	// Create player
	player := &domain.User{
		ID:           "player-1",
		Email:        "player@example.com",
		Username:     "player",
		PasswordHash: "hash",
		Roles:        []string{},
	}
	require.NoError(t, repos.User.Create(player))

	// Create campaign
	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Step 1: GM invites player by username
	inviteBody, _ := json.Marshal(map[string]interface{}{
		"username": player.Username,
	})
	inviteReq := httptest.NewRequest(http.MethodPost, "/api/campaigns/"+campaign.ID+"/invitations", bytes.NewReader(inviteBody))
	inviteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, inviteReq, gm.ID, []string{domain.RoleGamemaster})

	inviteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.InvitePlayer)).ServeHTTP(inviteRR, inviteReq)

	require.Equal(t, http.StatusCreated, inviteRR.Code)

	var invitation domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(inviteRR.Body.Bytes(), &invitation))

	assert.Equal(t, player.ID, invitation.UserID)
	assert.Equal(t, player.Username, invitation.Username)
	assert.Equal(t, "invited", invitation.Status)
	assert.Equal(t, gm.ID, invitation.InvitedBy)
	assert.False(t, invitation.InvitedAt.IsZero())

	// Step 2: Verify invitation appears in campaign's player list
	getPlayersReq := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID+"/invitations", nil)
	getPlayersReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, getPlayersReq, gm.ID, []string{domain.RoleGamemaster})

	getPlayersRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaignInvitations)).ServeHTTP(getPlayersRR, getPlayersReq)

	require.Equal(t, http.StatusOK, getPlayersRR.Code)

	var players []domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(getPlayersRR.Body.Bytes(), &players))
	require.Len(t, players, 1)
	assert.Equal(t, invitation.ID, players[0].ID)
	assert.Equal(t, "invited", players[0].Status)

	// Step 3: Player gets their invitations
	getUserInvitesReq := httptest.NewRequest(http.MethodGet, "/api/invitations", nil)
	attachSession(t, handlers, getUserInvitesReq, player.ID, []string{})

	getUserInvitesRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetUserInvitations)).ServeHTTP(getUserInvitesRR, getUserInvitesReq)

	require.Equal(t, http.StatusOK, getUserInvitesRR.Code)

	var userInvitations []struct {
		CampaignID   string                `json:"campaign_id"`
		CampaignName string                `json:"campaign_name"`
		Player       domain.CampaignPlayer `json:"player"`
	}
	require.NoError(t, json.Unmarshal(getUserInvitesRR.Body.Bytes(), &userInvitations))
	require.Len(t, userInvitations, 1)
	assert.Equal(t, campaign.ID, userInvitations[0].CampaignID)
	assert.Equal(t, campaign.Name, userInvitations[0].CampaignName)
	assert.Equal(t, "invited", userInvitations[0].Player.Status)

	// Step 4: Player accepts invitation
	acceptBody, _ := json.Marshal(map[string]interface{}{})
	acceptReq := httptest.NewRequest(http.MethodPost, "/api/invitations/"+invitation.ID+"/accept", bytes.NewReader(acceptBody))
	acceptReq.SetPathValue("id", invitation.ID)
	attachSession(t, handlers, acceptReq, player.ID, []string{})

	acceptRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.AcceptInvitation)).ServeHTTP(acceptRR, acceptReq)

	require.Equal(t, http.StatusNoContent, acceptRR.Code, "AcceptInvitation should return 204 No Content")

	// Step 5: Verify player no longer appears in pending invitations
	getUserInvitesReq2 := httptest.NewRequest(http.MethodGet, "/api/invitations", nil)
	attachSession(t, handlers, getUserInvitesReq2, player.ID, []string{})

	getUserInvitesRR2 := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetUserInvitations)).ServeHTTP(getUserInvitesRR2, getUserInvitesReq2)

	require.Equal(t, http.StatusOK, getUserInvitesRR2.Code)

	userInvitations = []struct {
		CampaignID   string                `json:"campaign_id"`
		CampaignName string                `json:"campaign_name"`
		Player       domain.CampaignPlayer `json:"player"`
	}{}
	require.NoError(t, json.Unmarshal(getUserInvitesRR2.Body.Bytes(), &userInvitations))
	assert.Len(t, userInvitations, 0, "Accepted invitation should not appear in pending list")

	// Step 6: Verify player appears in campaign's player list with accepted status
	getPlayersReq2 := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID+"/invitations", nil)
	getPlayersReq2.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, getPlayersReq2, gm.ID, []string{domain.RoleGamemaster})

	getPlayersRR2 := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaignInvitations)).ServeHTTP(getPlayersRR2, getPlayersReq2)

	require.Equal(t, http.StatusOK, getPlayersRR2.Code)

	players = []domain.CampaignPlayer{}
	require.NoError(t, json.Unmarshal(getPlayersRR2.Body.Bytes(), &players))
	require.Len(t, players, 1)
	assert.Equal(t, "accepted", players[0].Status)
	assert.Equal(t, player.ID, players[0].UserID)
	assert.Equal(t, player.Username, players[0].Username)
}

// TestPlayerInvitationByEmail tests inviting a player by email
// (for users not yet registered)
func TestPlayerInvitationByEmail(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Invite by email
	inviteBody, _ := json.Marshal(map[string]interface{}{
		"email": "newplayer@example.com",
	})
	inviteReq := httptest.NewRequest(http.MethodPost, "/api/campaigns/"+campaign.ID+"/invitations", bytes.NewReader(inviteBody))
	inviteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, inviteReq, gm.ID, []string{domain.RoleGamemaster})

	inviteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.InvitePlayer)).ServeHTTP(inviteRR, inviteReq)

	require.Equal(t, http.StatusCreated, inviteRR.Code)

	var invitation domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(inviteRR.Body.Bytes(), &invitation))

	assert.Equal(t, "newplayer@example.com", invitation.Email)
	assert.Empty(t, invitation.UserID, "Email-only invite should not have UserID")
	assert.Equal(t, "invited", invitation.Status)
	assert.Equal(t, gm.ID, invitation.InvitedBy)
}

// TestPlayerDeclineInvitation tests declining an invitation
func TestPlayerDeclineInvitation(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	player := &domain.User{
		ID:           "player-1",
		Email:        "player@example.com",
		Username:     "player",
		PasswordHash: "hash",
		Roles:        []string{},
	}
	require.NoError(t, repos.User.Create(player))

	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Invite player
	inviteBody, _ := json.Marshal(map[string]interface{}{
		"username": player.Username,
	})
	inviteReq := httptest.NewRequest(http.MethodPost, "/api/campaigns/"+campaign.ID+"/invitations", bytes.NewReader(inviteBody))
	inviteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, inviteReq, gm.ID, []string{domain.RoleGamemaster})

	inviteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.InvitePlayer)).ServeHTTP(inviteRR, inviteReq)

	require.Equal(t, http.StatusCreated, inviteRR.Code)

	var invitation domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(inviteRR.Body.Bytes(), &invitation))

	// Decline invitation
	declineBody, _ := json.Marshal(map[string]interface{}{})
	declineReq := httptest.NewRequest(http.MethodPost, "/api/invitations/"+invitation.ID+"/decline", bytes.NewReader(declineBody))
	declineReq.SetPathValue("id", invitation.ID)
	attachSession(t, handlers, declineReq, player.ID, []string{})

	declineRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.DeclineInvitation)).ServeHTTP(declineRR, declineReq)

	require.Equal(t, http.StatusNoContent, declineRR.Code, "DeclineInvitation should return 204 No Content")

	// Verify invitation no longer appears in pending list
	getUserInvitesReq := httptest.NewRequest(http.MethodGet, "/api/invitations", nil)
	attachSession(t, handlers, getUserInvitesReq, player.ID, []string{})

	getUserInvitesRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetUserInvitations)).ServeHTTP(getUserInvitesRR, getUserInvitesReq)

	require.Equal(t, http.StatusOK, getUserInvitesRR.Code)

	var userInvitations []struct {
		CampaignID   string                `json:"campaign_id"`
		CampaignName string                `json:"campaign_name"`
		Player       domain.CampaignPlayer `json:"player"`
	}
	require.NoError(t, json.Unmarshal(getUserInvitesRR.Body.Bytes(), &userInvitations))
	assert.Len(t, userInvitations, 0, "Declined invitation should not appear in pending list")
}

// TestRemovePlayer tests removing a player from a campaign
func TestRemovePlayer(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	player := &domain.User{
		ID:           "player-1",
		Email:        "player@example.com",
		Username:     "player",
		PasswordHash: "hash",
		Roles:        []string{},
	}
	require.NoError(t, repos.User.Create(player))

	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Invite and accept
	inviteBody, _ := json.Marshal(map[string]interface{}{
		"username": player.Username,
	})
	inviteReq := httptest.NewRequest(http.MethodPost, "/api/campaigns/"+campaign.ID+"/invitations", bytes.NewReader(inviteBody))
	inviteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, inviteReq, gm.ID, []string{domain.RoleGamemaster})

	inviteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.InvitePlayer)).ServeHTTP(inviteRR, inviteReq)

	require.Equal(t, http.StatusCreated, inviteRR.Code)

	var invitation domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(inviteRR.Body.Bytes(), &invitation))

	// Accept
	acceptBody, _ := json.Marshal(map[string]interface{}{})
	acceptReq := httptest.NewRequest(http.MethodPost, "/api/invitations/"+invitation.ID+"/accept", bytes.NewReader(acceptBody))
	acceptReq.SetPathValue("id", invitation.ID)
	attachSession(t, handlers, acceptReq, player.ID, []string{})

	acceptRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.AcceptInvitation)).ServeHTTP(acceptRR, acceptReq)
	require.Equal(t, http.StatusNoContent, acceptRR.Code)

	// Remove player
	removeReq := httptest.NewRequest(http.MethodDelete, "/api/campaigns/"+campaign.ID+"/players/"+invitation.ID, nil)
	removeReq.SetPathValue("id", campaign.ID)
	removeReq.SetPathValue("playerId", invitation.ID)
	attachSession(t, handlers, removeReq, gm.ID, []string{domain.RoleGamemaster})

	removeRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.RemovePlayer)).ServeHTTP(removeRR, removeReq)

	require.Equal(t, http.StatusNoContent, removeRR.Code)

	// Verify player is removed
	getPlayersReq := httptest.NewRequest(http.MethodGet, "/api/campaigns/"+campaign.ID+"/invitations", nil)
	getPlayersReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, getPlayersReq, gm.ID, []string{domain.RoleGamemaster})

	getPlayersRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.GetCampaignInvitations)).ServeHTTP(getPlayersRR, getPlayersReq)

	require.Equal(t, http.StatusOK, getPlayersRR.Code)

	var players []domain.CampaignPlayer
	require.NoError(t, json.Unmarshal(getPlayersRR.Body.Bytes(), &players))
	assert.Len(t, players, 0, "Player should be removed from campaign")
}

// TestInvitePlayerRequiresGM tests that only GMs can invite players
func TestInvitePlayerRequiresGM(t *testing.T) {
	handlers, repos := setupCampaignHandlers(t)

	gm := &domain.User{
		ID:           "gm-1",
		Email:        "gm@example.com",
		Username:     "GM",
		PasswordHash: "hash",
		Roles:        []string{domain.RoleGamemaster},
	}
	require.NoError(t, repos.User.Create(gm))

	player := &domain.User{
		ID:           "player-1",
		Email:        "player@example.com",
		Username:     "player",
		PasswordHash: "hash",
		Roles:        []string{},
	}
	require.NoError(t, repos.User.Create(player))

	campaign, err := handlers.CampaignService.CreateCampaign(service.CampaignCreateInput{
		Name:           "Test Campaign",
		Edition:        "sr5",
		CreationMethod: "priority",
		GameplayLevel:  "experienced",
		GMName:         gm.Username,
		GMUserID:       gm.ID,
		Status:         "Active",
	})
	require.NoError(t, err)

	// Regular player tries to invite someone (should fail)
	inviteBody, _ := json.Marshal(map[string]interface{}{
		"username": "another-player",
	})
	inviteReq := httptest.NewRequest(http.MethodPost, "/api/campaigns/"+campaign.ID+"/invitations", bytes.NewReader(inviteBody))
	inviteReq.SetPathValue("id", campaign.ID)
	attachSession(t, handlers, inviteReq, player.ID, []string{})

	inviteRR := httptest.NewRecorder()
	handlers.Sessions.WithSession(http.HandlerFunc(handlers.InvitePlayer)).ServeHTTP(inviteRR, inviteReq)

	assert.Equal(t, http.StatusForbidden, inviteRR.Code, "Regular player should not be able to invite others")
}

