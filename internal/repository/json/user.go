package json

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"shadowmaster/internal/domain"
)

type UserRepository struct {
	dataPath string
	mu       sync.RWMutex
	index    *indexData
}

type indexData struct {
	Users       map[string]string `json:"users"`
	UserEmails  map[string]string `json:"user_emails"`
	Usernames   map[string]string `json:"usernames"`
}

type storedUser struct {
	ID           string         `json:"id"`
	Email        string         `json:"email"`
	Username     string         `json:"username"`
	PasswordHash string         `json:"password_hash"`
	Roles        []domain.Role  `json:"roles"`
	CreatedAt    string         `json:"created_at"`
	UpdatedAt    string         `json:"updated_at"`
	DeletedAt    *string        `json:"deleted_at,omitempty"`
	LastLoginAt  *string        `json:"last_login_at,omitempty"`
}

func NewUserRepository(dataPath string) (*UserRepository, error) {
	repo := &UserRepository{
		dataPath: dataPath,
		index: &indexData{
			Users:      make(map[string]string),
			UserEmails: make(map[string]string),
			Usernames:  make(map[string]string),
		},
	}

	// Ensure data directory exists
	if err := os.MkdirAll(filepath.Join(dataPath, "users"), 0755); err != nil {
		return nil, fmt.Errorf("failed to create users directory: %w", err)
	}

	// Load index
	if err := repo.loadIndex(); err != nil {
		return nil, fmt.Errorf("failed to load index: %w", err)
	}

	return repo, nil
}

func (r *UserRepository) loadIndex() error {
	indexPath := filepath.Join(r.dataPath, "index.json")
	
	data, err := os.ReadFile(indexPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Index doesn't exist yet, start with empty index
			return nil
		}
		return err
	}

	if err := json.Unmarshal(data, r.index); err != nil {
		return err
	}

	// Initialize maps if they don't exist
	if r.index.Users == nil {
		r.index.Users = make(map[string]string)
	}
	if r.index.UserEmails == nil {
		r.index.UserEmails = make(map[string]string)
	}
	if r.index.Usernames == nil {
		r.index.Usernames = make(map[string]string)
	}

	return nil
}

func (r *UserRepository) saveIndex() error {
	indexPath := filepath.Join(r.dataPath, "index.json")
	
	// Read existing index to preserve other data
	var fullIndex map[string]interface{}
	data, err := os.ReadFile(indexPath)
	if err == nil {
		json.Unmarshal(data, &fullIndex)
	}
	if fullIndex == nil {
		fullIndex = make(map[string]interface{})
	}

	// Update user-related fields
	fullIndex["users"] = r.index.Users
	fullIndex["user_emails"] = r.index.UserEmails
	fullIndex["usernames"] = r.index.Usernames

	// Write back
	data, err = json.MarshalIndent(fullIndex, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(indexPath, data, 0644)
}

func (r *UserRepository) Create(user *domain.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if email exists
	if id, exists := r.index.UserEmails[user.Email]; exists {
		return fmt.Errorf("email already exists: %s", id)
	}

	// Check if username exists
	if id, exists := r.index.Usernames[user.Username]; exists {
		return fmt.Errorf("username already exists: %s", id)
	}

	// Store user file
	userPath := filepath.Join(r.dataPath, "users", user.ID+".json")
	stored := storedUser{
		ID:           user.ID,
		Email:        user.Email,
		Username:     user.Username,
		PasswordHash: user.PasswordHash,
		Roles:        user.Roles,
		CreatedAt:    user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:    user.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
	if user.DeletedAt != nil {
		deletedAtStr := user.DeletedAt.Format("2006-01-02T15:04:05Z07:00")
		stored.DeletedAt = &deletedAtStr
	}
	if user.LastLoginAt != nil {
		lastLoginAtStr := user.LastLoginAt.Format("2006-01-02T15:04:05Z07:00")
		stored.LastLoginAt = &lastLoginAtStr
	}

	data, err := json.MarshalIndent(stored, "", "  ")
	if err != nil {
		return err
	}

	if err := os.WriteFile(userPath, data, 0644); err != nil {
		return err
	}

	// Update index
	r.index.Users[user.ID] = "users/" + user.ID + ".json"
	r.index.UserEmails[user.Email] = user.ID
	r.index.Usernames[user.Username] = user.ID

	return r.saveIndex()
}

func (r *UserRepository) GetByID(id string) (*domain.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	userPath, exists := r.index.Users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return r.loadUser(filepath.Join(r.dataPath, userPath))
}

func (r *UserRepository) GetByEmail(email string) (*domain.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	id, exists := r.index.UserEmails[email]
	if !exists {
		return nil, errors.New("user not found")
	}

	userPath, exists := r.index.Users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return r.loadUser(filepath.Join(r.dataPath, userPath))
}

func (r *UserRepository) GetByUsername(username string) (*domain.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	id, exists := r.index.Usernames[username]
	if !exists {
		return nil, errors.New("user not found")
	}

	userPath, exists := r.index.Users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return r.loadUser(filepath.Join(r.dataPath, userPath))
}

func (r *UserRepository) GetAll() ([]*domain.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	users := make([]*domain.User, 0, len(r.index.Users))
	for id := range r.index.Users {
		userPath := r.index.Users[id]
		user, err := r.loadUser(filepath.Join(r.dataPath, userPath))
		if err != nil {
			continue // Skip corrupted files
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) Update(user *domain.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	userPath, exists := r.index.Users[user.ID]
	if !exists {
		return errors.New("user not found")
	}

	// Load existing user to check for email/username changes
	existing, err := r.loadUser(filepath.Join(r.dataPath, userPath))
	if err != nil {
		return err
	}

	// Check if email changed and if new email exists
	if existing.Email != user.Email {
		if id, exists := r.index.UserEmails[user.Email]; exists && id != user.ID {
			return fmt.Errorf("email already exists: %s", id)
		}
		// Update email mapping
		delete(r.index.UserEmails, existing.Email)
		r.index.UserEmails[user.Email] = user.ID
	}

	// Check if username changed and if new username exists
	if existing.Username != user.Username {
		if id, exists := r.index.Usernames[user.Username]; exists && id != user.ID {
			return fmt.Errorf("username already exists: %s", id)
		}
		// Update username mapping
		delete(r.index.Usernames, existing.Username)
		r.index.Usernames[user.Username] = user.ID
	}

	// Save updated user
	stored := storedUser{
		ID:           user.ID,
		Email:        user.Email,
		Username:     user.Username,
		PasswordHash: user.PasswordHash,
		Roles:        user.Roles,
		CreatedAt:    user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:    user.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
	if user.DeletedAt != nil {
		deletedAtStr := user.DeletedAt.Format("2006-01-02T15:04:05Z07:00")
		stored.DeletedAt = &deletedAtStr
	}
	if user.LastLoginAt != nil {
		lastLoginAtStr := user.LastLoginAt.Format("2006-01-02T15:04:05Z07:00")
		stored.LastLoginAt = &lastLoginAtStr
	}

	data, err := json.MarshalIndent(stored, "", "  ")
	if err != nil {
		return err
	}

	if err := os.WriteFile(filepath.Join(r.dataPath, userPath), data, 0644); err != nil {
		return err
	}

	return r.saveIndex()
}

func (r *UserRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	userPath, exists := r.index.Users[id]
	if !exists {
		return errors.New("user not found")
	}

	// Load user to get email and username for index cleanup
	user, err := r.loadUser(filepath.Join(r.dataPath, userPath))
	if err != nil {
		return err
	}

	// Delete file
	if err := os.Remove(filepath.Join(r.dataPath, userPath)); err != nil {
		return err
	}

	// Update index
	delete(r.index.Users, id)
	delete(r.index.UserEmails, user.Email)
	delete(r.index.Usernames, user.Username)

	return r.saveIndex()
}

func (r *UserRepository) Count() (int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.index.Users), nil
}

func (r *UserRepository) loadUser(path string) (*domain.User, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var stored storedUser
	if err := json.Unmarshal(data, &stored); err != nil {
		return nil, err
	}

	createdAt, err := parseTime(stored.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("invalid created_at: %w", err)
	}

	updatedAt, err := parseTime(stored.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("invalid updated_at: %w", err)
	}

	var deletedAt *time.Time
	if stored.DeletedAt != nil {
		parsed, err := parseTime(*stored.DeletedAt)
		if err != nil {
			return nil, fmt.Errorf("invalid deleted_at: %w", err)
		}
		deletedAt = &parsed
	}

	var lastLoginAt *time.Time
	if stored.LastLoginAt != nil {
		parsed, err := parseTime(*stored.LastLoginAt)
		if err != nil {
			return nil, fmt.Errorf("invalid last_login_at: %w", err)
		}
		lastLoginAt = &parsed
	}

	return &domain.User{
		ID:           stored.ID,
		Email:        stored.Email,
		Username:     stored.Username,
		PasswordHash: stored.PasswordHash,
		Roles:        stored.Roles,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
		LastLoginAt:  lastLoginAt,
	}, nil
}

func parseTime(s string) (time.Time, error) {
	// Try RFC3339 format first
	t, err := time.Parse(time.RFC3339, s)
	if err == nil {
		return t, nil
	}
	// Try RFC3339Nano
	t, err = time.Parse(time.RFC3339Nano, s)
	if err == nil {
		return t, nil
	}
	// Try ISO8601 format
	t, err = time.Parse("2006-01-02T15:04:05Z07:00", s)
	if err == nil {
		return t, nil
	}
	return time.Time{}, fmt.Errorf("unable to parse time: %s", s)
}

