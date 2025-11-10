package domain

import "time"

// User represents an authenticated account in the system.
type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"password_hash"`
	Roles        []string  `json:"roles"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Role constants.
const (
	RoleAdministrator = "administrator"
	RoleGamemaster    = "gamemaster"
	RolePlayer        = "player"
)

// DefaultRoles returns the canonical ordering of supported roles.
func DefaultRoles() []string {
	return []string{RoleAdministrator, RoleGamemaster, RolePlayer}
}
