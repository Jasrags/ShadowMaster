package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"time"

	"github.com/google/uuid"
)

// GroupRepositoryJSON implements GroupRepository using JSON files
type GroupRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewGroupRepository creates a new JSON-based group repository
func NewGroupRepository(store *storage.JSONStore, index *Index) *GroupRepositoryJSON {
	return &GroupRepositoryJSON{
		store: store,
		index: index,
	}
}

// Create creates a new group
func (r *GroupRepositoryJSON) Create(group *domain.Group) error {
	if group.ID == "" {
		group.ID = uuid.New().String()
	}
	group.CreatedAt = time.Now()
	group.UpdatedAt = time.Now()

	filename := fmt.Sprintf("groups/%s.json", group.ID)
	if err := r.store.Write(filename, group); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Groups[group.ID] = filename
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a group by ID
func (r *GroupRepositoryJSON) GetByID(id string) (*domain.Group, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Groups[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("group not found: %s", id)
	}

	var group domain.Group
	if err := r.store.Read(filename, &group); err != nil {
		return nil, err
	}

	return &group, nil
}

// GetAll retrieves all groups
func (r *GroupRepositoryJSON) GetAll() ([]*domain.Group, error) {
	r.index.mu.RLock()
	groupMap := make(map[string]string)
	for k, v := range r.index.Groups {
		groupMap[k] = v
	}
	r.index.mu.RUnlock()

	groups := make([]*domain.Group, 0) // Ensure non-nil empty slice
	for _, filename := range groupMap {
		var group domain.Group
		if err := r.store.Read(filename, &group); err != nil {
			continue
		}
		groups = append(groups, &group)
	}

	return groups, nil
}

// Update updates an existing group
func (r *GroupRepositoryJSON) Update(group *domain.Group) error {
	r.index.mu.RLock()
	_, exists := r.index.Groups[group.ID]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("group not found: %s", group.ID)
	}

	group.UpdatedAt = time.Now()
	filename := fmt.Sprintf("groups/%s.json", group.ID)
	return r.store.Write(filename, group)
}

// Delete deletes a group
func (r *GroupRepositoryJSON) Delete(id string) error {
	r.index.mu.RLock()
	filename, exists := r.index.Groups[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("group not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Groups, id)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *GroupRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}
