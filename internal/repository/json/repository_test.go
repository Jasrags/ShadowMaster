package jsonrepo

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/pkg/storage"
)

func TestNewRepositoriesInitializesIndex(t *testing.T) {
	dir := t.TempDir()

	idx := NewIndex()
	idx.Users["u1"] = filepath.Join("users", "u1.json")

	repoStore, err := storage.NewJSONStore(dir)
	require.NoError(t, err)
	require.NoError(t, repoStore.Write("index.json", idx))

	repos, err := NewRepositories(dir)
	require.NoError(t, err)
	require.NotNil(t, repos)

	_, ok := repos.User.(*UserRepositoryJSON)
	assert.True(t, ok)
}
