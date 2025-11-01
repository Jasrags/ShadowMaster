package domain

import (
	"time"
)

// Group represents a collection of characters (party/organization)
type Group struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description,omitempty"`
	CharacterIDs []string  `json:"character_ids"` // References to character IDs
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Campaign represents a campaign linked to a group
type Campaign struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description,omitempty"`
	GroupID     string    `json:"group_id"` // Reference to group
	GmName      string    `json:"gm_name,omitempty"`
	Edition     string    `json:"edition"` // "sr3", "sr4", etc.
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Status      string    `json:"status"` // Active, Paused, Completed
}

// Session represents an individual play session within a campaign
type Session struct {
	ID          string    `json:"id"`
	CampaignID  string    `json:"campaign_id"` // Reference to campaign
	Name        string    `json:"name"`
	SessionDate time.Time `json:"session_date"`
	Description string    `json:"description,omitempty"`
	SceneIDs    []string  `json:"scene_ids"` // References to scenes
	Notes       string    `json:"notes,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Status      string    `json:"status"` // Planned, Active, Completed
}

// Scene represents a scene or encounter within a session
type Scene struct {
	ID          string           `json:"id"`
	SessionID   string           `json:"session_id"` // Reference to session
	Name        string           `json:"name"`
	Type        string           `json:"type"` // Combat, Social, Exploration, etc.
	Description string           `json:"description,omitempty"`
	Status      string           `json:"status"` // Planned, Active, Completed
	Initiative  *InitiativeOrder `json:"initiative,omitempty"`
	Notes       string           `json:"notes,omitempty"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

// InitiativeOrder tracks initiative for combat encounters
type InitiativeOrder struct {
	Entries     []InitiativeEntry `json:"entries"`
	CurrentTurn int               `json:"current_turn"`
	CurrentPass int               `json:"current_pass"`
	RoundNumber int               `json:"round_number"`
}

// InitiativeEntry represents a single entry in initiative order
type InitiativeEntry struct {
	CharacterID string `json:"character_id"`
	Name        string `json:"name"`
	Initiative  int    `json:"initiative"`
	Pass        int    `json:"pass"` // Which initiative pass (1, 2, 3, etc.)
	ActionsUsed int    `json:"actions_used"`
}
