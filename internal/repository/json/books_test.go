package jsonrepo

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
)

func TestBooksRepositoryListBooks(t *testing.T) {
	dir := t.TempDir()
	store, err := storage.NewJSONStore(dir)
	require.NoError(t, err)

	repo := NewBooksRepository(store)

	t.Run("requires edition", func(t *testing.T) {
		books, err := repo.ListBooks("")
		assert.Error(t, err)
		assert.Nil(t, books)
	})

	t.Run("returns default when catalog missing", func(t *testing.T) {
		books, err := repo.ListBooks("SR5")
		require.NoError(t, err)
		require.Len(t, books, 1)
		assert.Equal(t, "Shadowrun 5th Edition", books[0].Name)
		assert.Equal(t, "SR5", books[0].Code)
		assert.Equal(t, "sr5", books[0].ID)
	})

	t.Run("loads books from catalog", func(t *testing.T) {
		payload := struct {
			Books []domain.SourceBook `json:"books"`
		}{
			Books: []domain.SourceBook{
				{ID: "sr5-core", Name: "Core", Code: "SR5"},
				{ID: "sr5-runner", Name: "Runner's Companion", Code: "RC"},
			},
		}

		path := filepath.Join("editions", "sr5", booksFilename)
		require.NoError(t, store.Write(path, payload))

		books, err := repo.ListBooks("SR5")
		require.NoError(t, err)
		require.Len(t, books, 2)
		assert.Equal(t, "sr5-core", books[0].ID)
		assert.Equal(t, "RC", books[1].Code)
	})
}
