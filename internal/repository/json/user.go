package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"strings"
	"time"

	"github.com/google/uuid"
)

// UserRepositoryJSON implements UserRepository using JSON files.
type UserRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewUserRepository creates a new JSON-based user repository.
func NewUserRepository(store *storage.JSONStore, index *Index) *UserRepositoryJSON {
	return &UserRepositoryJSON{
		store: store,
		index: index,
	}
}

func normalizeIdentity(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

// Create persists a new user ensuring unique email and username.
func (r *UserRepositoryJSON) Create(user *domain.User) error {
	if user.ID == "" {
		user.ID = uuid.NewString()
	}

	emailKey := normalizeIdentity(user.Email)
	usernameKey := normalizeIdentity(user.Username)

	r.index.mu.Lock()
	defer r.index.mu.Unlock()

	if _, exists := r.index.Users[user.ID]; exists {
		return fmt.Errorf("user already exists: %s", user.ID)
	}
	if emailKey != "" {
		if existingID, exists := r.index.UserEmails[emailKey]; exists {
			return fmt.Errorf("email already in use: %s (id=%s)", user.Email, existingID)
		}
	}
	if usernameKey != "" {
		if existingID, exists := r.index.Usernames[usernameKey]; exists {
			return fmt.Errorf("username already in use: %s (id=%s)", user.Username, existingID)
		}
	}

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	filename := fmt.Sprintf("users/%s.json", user.ID)
	if err := r.store.Write(filename, user); err != nil {
		return err
	}

	r.index.Users[user.ID] = filename
	if emailKey != "" {
		r.index.UserEmails[emailKey] = user.ID
	}
	if usernameKey != "" {
		r.index.Usernames[usernameKey] = user.ID
	}

	return r.saveIndexLocked()
}

// GetByID fetches a user by ID.
func (r *UserRepositoryJSON) GetByID(id string) (*domain.User, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Users[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("user not found: %s", id)
	}

	var user domain.User
	if err := r.store.Read(filename, &user); err != nil {
		return nil, err
	}
	return &user, nil
}

// GetByEmail fetches a user by email (case insensitive).
func (r *UserRepositoryJSON) GetByEmail(email string) (*domain.User, error) {
	emailKey := normalizeIdentity(email)
	r.index.mu.RLock()
	id, exists := r.index.UserEmails[emailKey]
	r.index.mu.RUnlock()
	if !exists {
		return nil, fmt.Errorf("user not found for email: %s", email)
	}
	return r.GetByID(id)
}

// GetByUsername fetches a user by username (case insensitive).
func (r *UserRepositoryJSON) GetByUsername(username string) (*domain.User, error) {
	usernameKey := normalizeIdentity(username)
	r.index.mu.RLock()
	id, exists := r.index.Usernames[usernameKey]
	r.index.mu.RUnlock()
	if !exists {
		return nil, fmt.Errorf("user not found for username: %s", username)
	}
	return r.GetByID(id)
}

// GetAll returns all users.
func (r *UserRepositoryJSON) GetAll() ([]*domain.User, error) {
	r.index.mu.RLock()
	userFiles := make(map[string]string, len(r.index.Users))
	for id, filename := range r.index.Users {
		userFiles[id] = filename
	}
	r.index.mu.RUnlock()

	users := make([]*domain.User, 0)
	for _, filename := range userFiles {
		var user domain.User
		if err := r.store.Read(filename, &user); err != nil {
			continue
		}
		users = append(users, &user)
	}
	return users, nil
}

// Update persists changes to an existing user while keeping indexes in sync.
func (r *UserRepositoryJSON) Update(user *domain.User) error {
	emailKey := normalizeIdentity(user.Email)
	usernameKey := normalizeIdentity(user.Username)

	r.index.mu.Lock()
	defer r.index.mu.Unlock()

	filename, exists := r.index.Users[user.ID]
	if !exists {
		return fmt.Errorf("user not found: %s", user.ID)
	}

	// Check email uniqueness if changed
	for existingEmail, existingID := range r.index.UserEmails {
		if existingID == user.ID {
			if existingEmail != emailKey {
				delete(r.index.UserEmails, existingEmail)
			}
			break
		}
	}
	if emailKey != "" {
		if otherID, exists := r.index.UserEmails[emailKey]; exists && otherID != user.ID {
			return fmt.Errorf("email already in use: %s", user.Email)
		}
		r.index.UserEmails[emailKey] = user.ID
	}

	// Check username uniqueness if changed
	for existingUsername, existingID := range r.index.Usernames {
		if existingID == user.ID {
			if existingUsername != usernameKey {
				delete(r.index.Usernames, existingUsername)
			}
			break
		}
	}
	if usernameKey != "" {
		if otherID, exists := r.index.Usernames[usernameKey]; exists && otherID != user.ID {
			return fmt.Errorf("username already in use: %s", user.Username)
		}
		r.index.Usernames[usernameKey] = user.ID
	}

	user.UpdatedAt = time.Now()
	if err := r.store.Write(filename, user); err != nil {
		return err
	}
	return r.saveIndexLocked()
}

// Delete removes a user and associated index entries.
func (r *UserRepositoryJSON) Delete(id string) error {
	r.index.mu.Lock()
	defer r.index.mu.Unlock()

	filename, exists := r.index.Users[id]
	if !exists {
		return fmt.Errorf("user not found: %s", id)
	}

	// Remove from secondary indexes
	for email, userID := range r.index.UserEmails {
		if userID == id {
			delete(r.index.UserEmails, email)
			break
		}
	}
	for username, userID := range r.index.Usernames {
		if userID == id {
			delete(r.index.Usernames, username)
			break
		}
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	delete(r.index.Users, id)
	return r.saveIndexLocked()
}

func (r *UserRepositoryJSON) saveIndexLocked() error {
	// index mutex must already be held by caller.
	return r.store.Write("index.json", r.index)
}
