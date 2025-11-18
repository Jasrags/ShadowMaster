package service

import (
	"errors"
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
	"strings"
	"unicode"

	"golang.org/x/crypto/bcrypt"
)

// ErrInvalidCredentials is returned when authentication fails.
var ErrInvalidCredentials = errors.New("invalid email or password")

// UserService handles user registration, authentication, and profile updates.
type UserService struct {
	userRepo repository.UserRepository
}

// NewUserService creates a new user service.
func NewUserService(userRepo repository.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

// Register creates a new user account. Returns sanitized user data.
func (s *UserService) Register(email, username, password string) (*domain.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	username = strings.TrimSpace(username)

	if email == "" {
		return nil, errors.New("email is required")
	}
	if username == "" {
		return nil, errors.New("username is required")
	}
	if err := ValidatePassword(password, email, username); err != nil {
		return nil, err
	}

	users, err := s.userRepo.GetAll()
	if err != nil {
		return nil, err
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	roles := []string{domain.RolePlayer}
	if len(users) == 0 {
		roles = []string{domain.RoleAdministrator}
	}

	user := &domain.User{
		Email:        email,
		Username:     username,
		PasswordHash: string(hashed),
		Roles:        roles,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return sanitizeUser(user), nil
}

// Authenticate verifies email/password and returns sanitized user data.
func (s *UserService) Authenticate(email, password string) (*domain.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return sanitizeUser(user), nil
}

// ChangePassword updates the password for a user.
func (s *UserService) ChangePassword(userID, newPassword string) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	if err := ValidatePassword(newPassword, user.Email, user.Username); err != nil {
		return err
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	user.PasswordHash = string(hashed)
	return s.userRepo.Update(user)
}

// UpdateUsername updates a user's username while preserving uniqueness.
func (s *UserService) UpdateUsername(userID, newUsername string) (*domain.User, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	newUsername = strings.TrimSpace(newUsername)
	if newUsername == "" {
		return nil, errors.New("username is required")
	}

	if strings.EqualFold(user.Username, newUsername) {
		return sanitizeUser(user), nil
	}

	user.Username = newUsername
	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	updated, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	return sanitizeUser(updated), nil
}

// ChangePasswordWithCurrent verifies the current password before changing it.
func (s *UserService) ChangePasswordWithCurrent(userID, currentPassword, newPassword string) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword)); err != nil {
		return ErrInvalidCredentials
	}

	if err := ValidatePassword(newPassword, user.Email, user.Username); err != nil {
		return err
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	user.PasswordHash = string(hashed)
	return s.userRepo.Update(user)
}

// GetUserByID returns sanitized user data by ID.
func (s *UserService) GetUserByID(userID string) (*domain.User, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}
	return sanitizeUser(user), nil
}

// GetUserByUsername retrieves a user by username.
func (s *UserService) GetUserByUsername(username string) (*domain.User, error) {
	user, err := s.userRepo.GetByUsername(username)
	if err != nil {
		return nil, err
	}
	return sanitizeUser(user), nil
}

// ValidatePassword checks a password against policy rules.
func ValidatePassword(password string, disallowed ...string) error {
	password = strings.TrimSpace(password)
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	var hasUpper, hasLower, hasDigit bool
	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		}
	}

	if !hasUpper {
		return errors.New("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return errors.New("password must contain at least one lowercase letter")
	}
	if !hasDigit {
		return errors.New("password must contain at least one number")
	}

	lowerPass := strings.ToLower(password)
	for _, word := range disallowed {
		word = strings.TrimSpace(word)
		if word == "" {
			continue
		}
		if strings.Contains(lowerPass, strings.ToLower(word)) {
			return fmt.Errorf("password must not contain %q", word)
		}
	}

	return nil
}

func sanitizeUser(user *domain.User) *domain.User {
	if user == nil {
		return nil
	}
	safe := *user
	safe.PasswordHash = ""
	return &safe
}

// ListUsers returns sanitized users, optionally filtered by role (case-insensitive).
func (s *UserService) ListUsers(filterRoles ...string) ([]*domain.User, error) {
	users, err := s.userRepo.GetAll()
	if err != nil {
		return nil, err
	}

	roleFilters := make(map[string]struct{})
	for _, role := range filterRoles {
		role = strings.ToLower(strings.TrimSpace(role))
		if role != "" {
			roleFilters[role] = struct{}{}
		}
	}

	result := make([]*domain.User, 0, len(users))

	for _, user := range users {
		if len(roleFilters) > 0 {
			found := false
			for _, role := range user.Roles {
				if _, ok := roleFilters[strings.ToLower(role)]; ok {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}
		result = append(result, sanitizeUser(user))
	}

	return result, nil
}
