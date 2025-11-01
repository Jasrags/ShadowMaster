package repository

import (
	"shadowmaster/internal/domain"
)

// CharacterRepository defines operations for character storage
type CharacterRepository interface {
	Create(character *domain.Character) error
	GetByID(id string) (*domain.Character, error)
	GetAll() ([]*domain.Character, error)
	Update(character *domain.Character) error
	Delete(id string) error
}

// GroupRepository defines operations for group storage
type GroupRepository interface {
	Create(group *domain.Group) error
	GetByID(id string) (*domain.Group, error)
	GetAll() ([]*domain.Group, error)
	Update(group *domain.Group) error
	Delete(id string) error
}

// CampaignRepository defines operations for campaign storage
type CampaignRepository interface {
	Create(campaign *domain.Campaign) error
	GetByID(id string) (*domain.Campaign, error)
	GetAll() ([]*domain.Campaign, error)
	GetByGroupID(groupID string) ([]*domain.Campaign, error)
	Update(campaign *domain.Campaign) error
	Delete(id string) error
}

// SessionRepository defines operations for session storage
type SessionRepository interface {
	Create(session *domain.Session) error
	GetByID(id string) (*domain.Session, error)
	GetAll() ([]*domain.Session, error)
	GetByCampaignID(campaignID string) ([]*domain.Session, error)
	Update(session *domain.Session) error
	Delete(id string) error
}

// SceneRepository defines operations for scene storage
type SceneRepository interface {
	Create(scene *domain.Scene) error
	GetByID(id string) (*domain.Scene, error)
	GetAll() ([]*domain.Scene, error)
	GetBySessionID(sessionID string) ([]*domain.Scene, error)
	Update(scene *domain.Scene) error
	Delete(id string) error
}
