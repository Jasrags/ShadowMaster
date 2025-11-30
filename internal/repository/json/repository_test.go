package jsonrepo

import (
	"os"
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

func TestNewRepositoriesCreatesDirectories(t *testing.T) {
	dir := t.TempDir()

	repos, err := NewRepositories(dir)
	require.NoError(t, err)
	require.NotNil(t, repos)

	// Verify all required subdirectories were created
	subdirs := []string{"campaigns", "characters", "groups", "scenes", "sessions", "users"}
	for _, subdir := range subdirs {
		dirPath := filepath.Join(dir, subdir)
		info, err := os.Stat(dirPath)
		require.NoError(t, err, "directory %s should exist", subdir)
		assert.True(t, info.IsDir(), "%s should be a directory", subdir)
	}
}

func TestNewRepositoriesCreatesDirectoriesEvenIfTheyExist(t *testing.T) {
	dir := t.TempDir()

	// Pre-create one of the directories
	charactersDir := filepath.Join(dir, "characters")
	require.NoError(t, os.MkdirAll(charactersDir, 0755))

	repos, err := NewRepositories(dir)
	require.NoError(t, err)
	require.NotNil(t, repos)

	// Verify all directories still exist (MkdirAll is idempotent)
	subdirs := []string{"campaigns", "characters", "groups", "scenes", "sessions", "users"}
	for _, subdir := range subdirs {
		dirPath := filepath.Join(dir, subdir)
		info, err := os.Stat(dirPath)
		require.NoError(t, err, "directory %s should exist", subdir)
		assert.True(t, info.IsDir(), "%s should be a directory", subdir)
	}
}
