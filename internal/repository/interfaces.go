package repository

import "shadowmaster/internal/domain"

type UserRepository interface {
	Create(user *domain.User) error
	GetByID(id string) (*domain.User, error)
	GetByEmail(email string) (*domain.User, error)
	GetByUsername(username string) (*domain.User, error)
	GetAll() ([]*domain.User, error)
	Update(user *domain.User) error
	Delete(id string) error
	Count() (int, error) // For checking if first user
}

type CharacterRepository interface {
	Create(character *domain.Character) error
	GetByID(id string) (*domain.Character, error)
	GetByUserID(userID string) ([]*domain.Character, error)
	Update(character *domain.Character) error
	Delete(id string) error
}

