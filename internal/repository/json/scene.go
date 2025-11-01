package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"time"

	"github.com/google/uuid"
)

// SceneRepositoryJSON implements SceneRepository using JSON files
type SceneRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewSceneRepository creates a new JSON-based scene repository
func NewSceneRepository(store *storage.JSONStore, index *Index) *SceneRepositoryJSON {
	return &SceneRepositoryJSON{
		store: store,
		index: index,
	}
}

// Create creates a new scene
func (r *SceneRepositoryJSON) Create(scene *domain.Scene) error {
	if scene.ID == "" {
		scene.ID = uuid.New().String()
	}
	scene.CreatedAt = time.Now()
	scene.UpdatedAt = time.Now()
	if scene.Status == "" {
		scene.Status = "Planned"
	}

	filename := fmt.Sprintf("scenes/%s.json", scene.ID)
	if err := r.store.Write(filename, scene); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Scenes[scene.ID] = filename
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a scene by ID
func (r *SceneRepositoryJSON) GetByID(id string) (*domain.Scene, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Scenes[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("scene not found: %s", id)
	}

	var scene domain.Scene
	if err := r.store.Read(filename, &scene); err != nil {
		return nil, err
	}

	return &scene, nil
}

// GetAll retrieves all scenes
func (r *SceneRepositoryJSON) GetAll() ([]*domain.Scene, error) {
	r.index.mu.RLock()
	sceneMap := make(map[string]string)
	for k, v := range r.index.Scenes {
		sceneMap[k] = v
	}
	r.index.mu.RUnlock()

	scenes := make([]*domain.Scene, 0) // Ensure non-nil empty slice
	for _, filename := range sceneMap {
		var scene domain.Scene
		if err := r.store.Read(filename, &scene); err != nil {
			continue
		}
		scenes = append(scenes, &scene)
	}

	return scenes, nil
}

// GetBySessionID retrieves all scenes for a specific session
func (r *SceneRepositoryJSON) GetBySessionID(sessionID string) ([]*domain.Scene, error) {
	allScenes, err := r.GetAll()
	if err != nil {
		return nil, err
	}

	scenes := make([]*domain.Scene, 0) // Ensure non-nil empty slice
	for _, scene := range allScenes {
		if scene.SessionID == sessionID {
			scenes = append(scenes, scene)
		}
	}

	return scenes, nil
}

// Update updates an existing scene
func (r *SceneRepositoryJSON) Update(scene *domain.Scene) error {
	r.index.mu.RLock()
	_, exists := r.index.Scenes[scene.ID]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("scene not found: %s", scene.ID)
	}

	scene.UpdatedAt = time.Now()
	filename := fmt.Sprintf("scenes/%s.json", scene.ID)
	return r.store.Write(filename, scene)
}

// Delete deletes a scene
func (r *SceneRepositoryJSON) Delete(id string) error {
	r.index.mu.RLock()
	filename, exists := r.index.Scenes[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("scene not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Scenes, id)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *SceneRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}
