package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"time"

	"github.com/google/uuid"
)

// SessionRepositoryJSON implements SessionRepository using JSON files
type SessionRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewSessionRepository creates a new JSON-based session repository
func NewSessionRepository(store *storage.JSONStore, index *Index) *SessionRepositoryJSON {
	return &SessionRepositoryJSON{
		store: store,
		index: index,
	}
}

// Create creates a new session
func (r *SessionRepositoryJSON) Create(session *domain.Session) error {
	if session.ID == "" {
		session.ID = uuid.New().String()
	}
	session.CreatedAt = time.Now()
	session.UpdatedAt = time.Now()
	if session.Status == "" {
		session.Status = "Planned"
	}

	filename := fmt.Sprintf("sessions/%s.json", session.ID)
	if err := r.store.Write(filename, session); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Sessions[session.ID] = filename
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a session by ID
func (r *SessionRepositoryJSON) GetByID(id string) (*domain.Session, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Sessions[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("session not found: %s", id)
	}

	var session domain.Session
	if err := r.store.Read(filename, &session); err != nil {
		return nil, err
	}

	return &session, nil
}

// GetAll retrieves all sessions
func (r *SessionRepositoryJSON) GetAll() ([]*domain.Session, error) {
	r.index.mu.RLock()
	sessionMap := make(map[string]string)
	for k, v := range r.index.Sessions {
		sessionMap[k] = v
	}
	r.index.mu.RUnlock()

	sessions := make([]*domain.Session, 0) // Ensure non-nil empty slice
	for _, filename := range sessionMap {
		var session domain.Session
		if err := r.store.Read(filename, &session); err != nil {
			continue
		}
		sessions = append(sessions, &session)
	}

	return sessions, nil
}

// GetByCampaignID retrieves all sessions for a specific campaign
func (r *SessionRepositoryJSON) GetByCampaignID(campaignID string) ([]*domain.Session, error) {
	allSessions, err := r.GetAll()
	if err != nil {
		return nil, err
	}

	sessions := make([]*domain.Session, 0) // Ensure non-nil empty slice
	for _, session := range allSessions {
		if session.CampaignID == campaignID {
			sessions = append(sessions, session)
		}
	}

	return sessions, nil
}

// Update updates an existing session
func (r *SessionRepositoryJSON) Update(session *domain.Session) error {
	r.index.mu.RLock()
	_, exists := r.index.Sessions[session.ID]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("session not found: %s", session.ID)
	}

	session.UpdatedAt = time.Now()
	filename := fmt.Sprintf("sessions/%s.json", session.ID)
	return r.store.Write(filename, session)
}

// Delete deletes a session
func (r *SessionRepositoryJSON) Delete(id string) error {
	r.index.mu.RLock()
	filename, exists := r.index.Sessions[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("session not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Sessions, id)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *SessionRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}
