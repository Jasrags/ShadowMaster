package jsonrepo

import (
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
)

func TestSessionRepositoryCRUD(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	index := NewIndex()
	repo := NewSessionRepository(store, index)

	session := &domain.Session{CampaignID: "campaign-1", Name: "Debut"}
	require.NoError(t, repo.Create(session))
	assert.NotEmpty(t, session.ID)
	assert.Equal(t, "Planned", session.Status)

	loaded, err := repo.GetByID(session.ID)
	require.NoError(t, err)
	assert.Equal(t, session.ID, loaded.ID)
	assert.WithinDuration(t, time.Now(), loaded.CreatedAt, time.Second)

	reloaded := &domain.Session{}
	require.NoError(t, store.Read(filepath.Join("sessions", session.ID+".json"), reloaded))
	assert.Equal(t, "Debut", reloaded.Name)

	sessions, err := repo.GetAll()
	require.NoError(t, err)
	require.Len(t, sessions, 1)

	sameCampaign, err := repo.GetByCampaignID("campaign-1")
	require.NoError(t, err)
	require.Len(t, sameCampaign, 1)

	session.Description = "Shadow meet"
	session.Status = "Completed"
	require.NoError(t, repo.Update(session))

	updated, err := repo.GetByID(session.ID)
	require.NoError(t, err)
	assert.Equal(t, "Shadow meet", updated.Description)
	assert.Equal(t, "Completed", updated.Status)

	require.NoError(t, repo.Delete(session.ID))
	_, err = repo.GetByID(session.ID)
	assert.Error(t, err)
}
