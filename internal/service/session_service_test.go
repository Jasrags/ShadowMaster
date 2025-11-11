package service

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
)

func TestSessionService_CreateSession(t *testing.T) {
	service, campaignRepo := newTestSessionService(t)
	campaign := createCampaign(t, campaignRepo)

	now := time.Now()

	testCases := []struct {
		name    string
		session domain.Session
		wantErr bool
		assert  func(t *testing.T, created *domain.Session)
	}{
		{
			name: "sets default status when not provided",
			session: domain.Session{
				CampaignID:  campaign.ID,
				Name:        "Session One",
				SessionDate: now,
			},
			assert: func(t *testing.T, created *domain.Session) {
				assert.Equal(t, "Planned", created.Status)
				assert.NotEmpty(t, created.ID)
				assert.Equal(t, campaign.ID, created.CampaignID)
			},
		},
		{
			name: "requires campaign ID",
			session: domain.Session{
				Name: "Missing Campaign",
			},
			wantErr: true,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			session := tc.session
			created, err := service.CreateSession(&session)

			if tc.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			if tc.assert != nil {
				tc.assert(t, created)
			}
		})
	}
}

func TestSessionService_UpdateSession(t *testing.T) {
	service, campaignRepo := newTestSessionService(t)
	campaign := createCampaign(t, campaignRepo)

	baseSession := &domain.Session{
		CampaignID:  campaign.ID,
		Name:        "Session One",
		SessionDate: time.Now(),
	}

	created, err := service.CreateSession(baseSession)
	require.NoError(t, err)

	testCases := []struct {
		name    string
		mutate  func(session *domain.Session)
		wantErr bool
		assert  func(t *testing.T, updated *domain.Session)
	}{
		{
			name: "updates status when valid",
			mutate: func(session *domain.Session) {
				session.Status = "Active"
			},
			assert: func(t *testing.T, updated *domain.Session) {
				assert.Equal(t, "Active", updated.Status)
				assert.Equal(t, campaign.ID, updated.CampaignID)
			},
		},
		{
			name: "rejects campaign changes",
			mutate: func(session *domain.Session) {
				session.CampaignID = "other-campaign"
			},
			wantErr: true,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			sessionCopy := *created
			tc.mutate(&sessionCopy)

			updated, err := service.UpdateSession(sessionCopy.ID, &sessionCopy)

			if tc.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			if tc.assert != nil {
				tc.assert(t, updated)
			}
		})
	}
}

func newTestSessionService(t *testing.T) (*SessionService, repository.CampaignRepository) {
	t.Helper()

	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err, "new store")

	index := jsonrepo.NewIndex()
	campaignRepo := jsonrepo.NewCampaignRepository(store, index)
	sessionRepo := jsonrepo.NewSessionRepository(store, index)

	return NewSessionService(sessionRepo, campaignRepo), campaignRepo
}

func createCampaign(t *testing.T, repo repository.CampaignRepository) *domain.Campaign {
	t.Helper()

	campaign := &domain.Campaign{
		Name:    "Night Ops",
		Edition: "sr5",
	}

	require.NoError(t, repo.Create(campaign))
	return campaign
}
