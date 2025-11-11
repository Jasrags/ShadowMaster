package jsonrepo

import (
	"fmt"
	"path/filepath"
	"strings"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	"shadowmaster/pkg/storage"
)

const booksFilename = "books/all.json"

type booksRepository struct {
	store *storage.JSONStore
}

// NewBooksRepository creates a repository that reads source book metadata.
func NewBooksRepository(store *storage.JSONStore) repository.BookRepository {
	return &booksRepository{store: store}
}

func (r *booksRepository) ListBooks(edition string) ([]domain.SourceBook, error) {
	if edition == "" {
		return nil, fmt.Errorf("edition key is required")
	}

	path := filepath.Join("editions", strings.ToLower(edition), booksFilename)
	if !r.store.Exists(path) {
		return []domain.SourceBook{defaultSourceBook(edition)}, nil
	}

	var payload struct {
		Books []domain.SourceBook `json:"books"`
	}
	if err := r.store.Read(path, &payload); err != nil {
		return nil, fmt.Errorf("failed to load books for %s: %w", edition, err)
	}

	return payload.Books, nil
}

func defaultSourceBook(edition string) domain.SourceBook {
	code := strings.ToUpper(strings.TrimSpace(edition))
	id := strings.ToLower(code)

	name := "Shadowrun " + code
	switch code {
	case "SR5":
		name = "Shadowrun 5th Edition"
	case "SR3":
		name = "Shadowrun 3rd Edition"
	}

	return domain.SourceBook{
		ID:   id,
		Name: name,
		Code: code,
	}
}
