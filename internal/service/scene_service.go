package service

import (
	"fmt"
	"strings"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

// SceneService manages scenes nested under sessions.
type SceneService struct {
	sceneRepo   repository.SceneRepository
	sessionRepo repository.SessionRepository
}

// NewSceneService constructs a SceneService.
func NewSceneService(sceneRepo repository.SceneRepository, sessionRepo repository.SessionRepository) *SceneService {
	return &SceneService{
		sceneRepo:   sceneRepo,
		sessionRepo: sessionRepo,
	}
}

// ListScenes returns all scenes.
func (s *SceneService) ListScenes() ([]*domain.Scene, error) {
	return s.sceneRepo.GetAll()
}

// GetScene fetches a single scene.
func (s *SceneService) GetScene(id string) (*domain.Scene, error) {
	scene, err := s.sceneRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSceneNotFound, err)
	}
	return scene, nil
}

// CreateScene validates and persists a scene.
func (s *SceneService) CreateScene(scene *domain.Scene) (*domain.Scene, error) {
	if strings.TrimSpace(scene.SessionID) == "" {
		return nil, ErrSceneSessionRequired
	}

	if _, err := s.sessionRepo.GetByID(scene.SessionID); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSessionNotFound, err)
	}

	if scene.Status == "" {
		scene.Status = "Planned"
	}

	if err := s.sceneRepo.Create(scene); err != nil {
		return nil, err
	}
	return scene, nil
}

// UpdateScene allows limited updates to scene metadata.
func (s *SceneService) UpdateScene(id string, scene *domain.Scene) (*domain.Scene, error) {
	existing, err := s.sceneRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSceneNotFound, err)
	}

	if existing.SessionID != "" && scene.SessionID != "" && existing.SessionID != scene.SessionID {
		return nil, ErrSceneImmutableSession
	}

	scene.ID = existing.ID
	scene.SessionID = existing.SessionID
	scene.CreatedAt = existing.CreatedAt
	if scene.Status == "" {
		scene.Status = existing.Status
	}

	if err := s.sceneRepo.Update(scene); err != nil {
		return nil, err
	}
	return scene, nil
}

// DeleteScene removes a scene.
func (s *SceneService) DeleteScene(id string) error {
	return s.sceneRepo.Delete(id)
}
