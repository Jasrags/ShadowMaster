package domain

import (
	"slices"
	"time"
)

type Role string

const (
	RoleAdministrator Role = "administrator"
	RoleGamemaster    Role = "gamemaster"
	RolePlayer        Role = "player"
)

type User struct {
	ID           string     `json:"id"`
	Email        string     `json:"email"`
	Username     string     `json:"username"`
	PasswordHash string     `json:"-"` // Never serialize password hash
	Roles        []Role     `json:"roles"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
}

func (u *User) HasRole(role Role) bool {
	return slices.Contains(u.Roles, role)
}
