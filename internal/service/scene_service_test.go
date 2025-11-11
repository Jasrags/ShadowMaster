package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	jsonrepo "shadowmaster/internal/repository/json"
	"shadowmaster/pkg/storage"
)

func TestSceneService_CreateScene(t *testing.T) {
	service, _, sessionRepo, campaignRepo := newSceneService(t)

	campaign := createSceneTestCampaign(t, campaignRepo)
	session := createSceneTestSession(t, sessionRepo, campaign.ID)

	scene := &domain.Scene{
		SessionID: session.ID,
		Name:      "Scene 1",
		Type:      "Combat",
	}

	created, err := service.CreateScene(scene)
	require.NoError(t, err)
	assert.Equal(t, "Planned", created.Status)
	assert.NotEmpty(t, created.ID)
	assert.Equal(t, session.ID, created.SessionID)
}

func TestSceneService_UpdateScene(t *testing.T) {
	service, sceneRepo, sessionRepo, campaignRepo := newSceneService(t)

	campaign := createSceneTestCampaign(t, campaignRepo)
	session := createSceneTestSession(t, sessionRepo, campaign.ID)

	scene := &domain.Scene{
		SessionID: session.ID,
		Name:      "Scene 1",
		Type:      "Combat",
	}
	created, err := service.CreateScene(scene)
	require.NoError(t, err)

	testCases := []struct {
		name    string
		mutate  func(s *domain.Scene)
		wantErr bool
		assert  func(t *testing.T, updated *domain.Scene)
	}{
		{
			name: "updates status",
			mutate: func(s *domain.Scene) {
				s.Status = "Active"
			},
			assert: func(t *testing.T, updated *domain.Scene) {
				assert.Equal(t, "Active", updated.Status)
				assert.Equal(t, session.ID, updated.SessionID)
			},
		},
		{
			name: "rejects session change",
			mutate: func(s *domain.Scene) {
				s.SessionID = "other"
			},
			wantErr: true,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			sceneCopy := *created
			tc.mutate(&sceneCopy)

			updated, err := service.UpdateScene(sceneCopy.ID, &sceneCopy)
			if tc.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			require.NotNil(t, updated)
			if tc.assert != nil {
				tc.assert(t, updated)
			}
		})
	}

	stored, err := sceneRepo.GetByID(created.ID)
	require.NoError(t, err)
	assert.Equal(t, "Active", stored.Status, "should persist last successful update")
}

func TestSceneServiceRequiresSession(t *testing.T) {
	service, _, _, _ := newSceneService(t)

	scene := &domain.Scene{Name: "Invalid Scene"}
	_, err := service.CreateScene(scene)
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrSceneSessionRequired)
}

func newSceneService(t *testing.T) (*SceneService, repository.SceneRepository, repository.SessionRepository, repository.CampaignRepository) {
	t.Helper()

	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err, "new store")

	index := jsonrepo.NewIndex()
	campaignRepo := jsonrepo.NewCampaignRepository(store, index)
	sessionRepo := jsonrepo.NewSessionRepository(store, index)
	sceneRepo := jsonrepo.NewSceneRepository(store, index)

	return NewSceneService(sceneRepo, sessionRepo), sceneRepo, sessionRepo, campaignRepo
}

func createSceneTestCampaign(t *testing.T, repo repository.CampaignRepository) *domain.Campaign {
	t.Helper()

	campaign := &domain.Campaign{
		Name:    "Campaign",
		Edition: "sr5",
	}
	require.NoError(t, repo.Create(campaign))
	return campaign
}

func createSceneTestSession(t *testing.T, repo repository.SessionRepository, campaignID string) *domain.Session {
	t.Helper()

	session := &domain.Session{CampaignID: campaignID, Name: "Session"}
	require.NoError(t, repo.Create(session))
	return session
}
