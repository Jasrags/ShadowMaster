package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrEmailExists        = errors.New("email already exists")
	ErrUsernameExists     = errors.New("username already exists")
	ErrWeakPassword       = errors.New("password does not meet requirements")
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// Password requirements: min 12 chars, at least one uppercase, one lowercase, one number, one special char
func validatePassword(password string) error {
	if len(password) < 12 {
		return errors.New("password must be at least 12 characters")
	}

	var hasUpper, hasLower, hasNumber, hasSpecial bool
	for _, char := range password {
		switch {
		case 'A' <= char && char <= 'Z':
			hasUpper = true
		case 'a' <= char && char <= 'z':
			hasLower = true
		case '0' <= char && char <= '9':
			hasNumber = true
		default:
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return errors.New("password must contain uppercase, lowercase, number, and special character")
	}

	return nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (s *UserService) Register(email, username, password string) (*domain.User, error) {
	// Validate password
	if err := validatePassword(password); err != nil {
		return nil, ErrWeakPassword
	}

	// Check if first user (becomes admin)
	count, err := s.repo.Count()
	if err != nil {
		return nil, err
	}

	// Check if email exists
	_, err = s.repo.GetByEmail(email)
	if err == nil {
		return nil, ErrEmailExists
	}

	// Check if username exists
	_, err = s.repo.GetByUsername(username)
	if err == nil {
		return nil, ErrUsernameExists
	}

	// Hash password
	passwordHash, err := hashPassword(password)
	if err != nil {
		return nil, err
	}

	// Determine roles
	roles := []domain.Role{domain.RolePlayer}
	if count == 0 {
		roles = []domain.Role{domain.RoleAdministrator}
	}

	// Create user
	now := time.Now()
	user := &domain.User{
		ID:           generateID(),
		Email:        email,
		Username:     username,
		PasswordHash: passwordHash,
		Roles:        roles,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) Authenticate(email, password string) (*domain.User, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	user.UpdatedAt = now
	if err := s.repo.Update(user); err != nil {
		// Log error but don't fail authentication
		// The user was successfully authenticated, just failed to update login time
	}

	return user, nil
}

func (s *UserService) ChangePassword(userID, currentPassword, newPassword string) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return ErrUserNotFound
	}

	// Verify current password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword))
	if err != nil {
		return ErrInvalidCredentials
	}

	// Validate new password
	if err := validatePassword(newPassword); err != nil {
		return ErrWeakPassword
	}

	// Hash new password
	passwordHash, err := hashPassword(newPassword)
	if err != nil {
		return err
	}

	// Update user
	user.PasswordHash = passwordHash
	user.UpdatedAt = time.Now()

	return s.repo.Update(user)
}

func (s *UserService) GetUser(id string) (*domain.User, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) GetAllUsers() ([]*domain.User, error) {
	allUsers, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	// Filter out deleted users
	users := make([]*domain.User, 0, len(allUsers))
	for _, user := range allUsers {
		if user.DeletedAt == nil {
			users = append(users, user)
		}
	}

	return users, nil
}

func (s *UserService) DeleteUser(userID string) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return ErrUserNotFound
	}

	// Soft delete: set deleted_at timestamp
	now := time.Now()
	user.DeletedAt = &now
	user.UpdatedAt = now

	return s.repo.Update(user)
}

func (s *UserService) UpdateUser(userID string, username *string, roles []domain.Role) (*domain.User, error) {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	// Validate and update username if provided
	if username != nil {
		trimmedUsername := strings.TrimSpace(*username)
		if trimmedUsername == "" {
			return nil, errors.New("username cannot be empty")
		}

		// Check if username is taken by another user
		existingUser, err := s.repo.GetByUsername(trimmedUsername)
		if err == nil && existingUser.ID != userID {
			return nil, ErrUsernameExists
		}

		user.Username = trimmedUsername
	}

	// Validate and update roles if provided
	if roles != nil {
		if len(roles) == 0 {
			return nil, errors.New("user must have at least one role")
		}

		// Validate all roles are valid
		validRoles := map[domain.Role]bool{
			domain.RoleAdministrator: true,
			domain.RoleGamemaster:    true,
			domain.RolePlayer:        true,
		}

		for _, role := range roles {
			if !validRoles[role] {
				return nil, errors.New("invalid role: " + string(role))
			}
		}

		user.Roles = roles
	}

	// Update timestamp
	user.UpdatedAt = time.Now()

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

// generateID creates a simple unique ID
func generateID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

