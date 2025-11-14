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

func TestSceneRepositoryCRUD(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	index := NewIndex()
	repo := NewSceneRepository(store, index)

	scene := &domain.Scene{SessionID: "session-1", Name: "Matrix Heist"}
	require.NoError(t, repo.Create(scene))
	assert.NotEmpty(t, scene.ID)
	assert.Equal(t, "Planned", scene.Status)

	loaded, err := repo.GetByID(scene.ID)
	require.NoError(t, err)
	assert.Equal(t, scene.ID, loaded.ID)
	assert.WithinDuration(t, time.Now(), loaded.CreatedAt, time.Second)

	restored := &domain.Scene{}
	require.NoError(t, store.Read(filepath.Join("scenes", scene.ID+".json"), restored))
	assert.Equal(t, "Matrix Heist", restored.Name)

	scenes, err := repo.GetAll()
	require.NoError(t, err)
	require.Len(t, scenes, 1)

	related, err := repo.GetBySessionID("session-1")
	require.NoError(t, err)
	require.Len(t, related, 1)

	scene.Status = "Completed"
	scene.Type = "Matrix"
	require.NoError(t, repo.Update(scene))

	updated, err := repo.GetByID(scene.ID)
	require.NoError(t, err)
	assert.Equal(t, "Completed", updated.Status)
	assert.Equal(t, "Matrix", updated.Type)

	require.NoError(t, repo.Delete(scene.ID))
	_, err = repo.GetByID(scene.ID)
	assert.Error(t, err)
}
