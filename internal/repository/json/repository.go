package jsonrepo

import (
	"fmt"
	"os"
	"path/filepath"

	"shadowmaster/internal/repository"
	"shadowmaster/pkg/storage"
)

// Repositories holds all repository instances
type Repositories struct {
	Character repository.CharacterRepository
	Group     repository.GroupRepository
	Campaign  repository.CampaignRepository
	Session   repository.SessionRepository
	Scene     repository.SceneRepository
	Edition   repository.EditionDataRepository
	Books     repository.BookRepository
	User      repository.UserRepository
}

// NewRepositories creates all repository instances with shared index
func NewRepositories(dataPath string) (*Repositories, error) {
	store, err := storage.NewJSONStore(dataPath)
	if err != nil {
		return nil, err
	}

	// Ensure all required subdirectories exist
	subdirs := []string{"campaigns", "characters", "groups", "scenes", "sessions", "users"}
	for _, subdir := range subdirs {
		dirPath := filepath.Join(dataPath, subdir)
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			return nil, fmt.Errorf("failed to create directory %s: %w", dirPath, err)
		}
	}

	// Load or create index
	index := NewIndex()
	if store.Exists("index.json") {
		idxData, err := store.ReadRaw("index.json")
		if err == nil {
			loadedIndex, err := LoadIndex(idxData)
			if err == nil {
				index = loadedIndex
			}
		}
	}

	return &Repositories{
		Character: NewCharacterRepository(store, index),
		Group:     NewGroupRepository(store, index),
		Campaign:  NewCampaignRepository(store, index),
		Session:   NewSessionRepository(store, index),
		Scene:     NewSceneRepository(store, index),
		Edition:   NewEditionRepository(store),
		Books:     NewBooksRepository(store),
		User:      NewUserRepository(store, index),
	}, nil
}
