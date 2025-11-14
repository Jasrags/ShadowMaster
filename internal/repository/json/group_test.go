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

func TestGroupRepositoryCRUD(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	index := NewIndex()
	repo := NewGroupRepository(store, index)

	group := &domain.Group{Name: "Runner Team"}
	require.NoError(t, repo.Create(group))
	assert.NotEmpty(t, group.ID)

	// ensure file exists
	reloaded := &domain.Group{}
	require.NoError(t, store.Read(filepath.Join("groups", group.ID+".json"), reloaded))
	assert.Equal(t, group.Name, reloaded.Name)

	loaded, err := repo.GetByID(group.ID)
	require.NoError(t, err)
	assert.Equal(t, group.ID, loaded.ID)
	assert.WithinDuration(t, time.Now(), loaded.CreatedAt, time.Second)

	nonExistent, err := repo.GetByID("missing")
	assert.Error(t, err)
	assert.Nil(t, nonExistent)

	group.Description = "Shadow ops"
	require.NoError(t, repo.Update(group))

	updated, err := repo.GetByID(group.ID)
	require.NoError(t, err)
	assert.Equal(t, "Shadow ops", updated.Description)

	groups, err := repo.GetAll()
	require.NoError(t, err)
	require.Len(t, groups, 1)

	require.NoError(t, repo.Delete(group.ID))
	_, err = repo.GetByID(group.ID)
	assert.Error(t, err)
}
