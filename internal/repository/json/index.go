package jsonrepo

import (
	"encoding/json"
	"sync"
)

// Index maintains relationships and quick lookups
type Index struct {
	Characters map[string]string `json:"characters"` // ID -> filename
	Groups     map[string]string `json:"groups"`
	Campaigns  map[string]string `json:"campaigns"`
	Sessions   map[string]string `json:"sessions"`
	Scenes     map[string]string `json:"scenes"`
	Users      map[string]string `json:"users"`
	UserEmails map[string]string `json:"user_emails"`
	Usernames  map[string]string `json:"usernames"`
	mu         sync.RWMutex
}

// NewIndex creates a new empty index
func NewIndex() *Index {
	return &Index{
		Characters: make(map[string]string),
		Groups:     make(map[string]string),
		Campaigns:  make(map[string]string),
		Sessions:   make(map[string]string),
		Scenes:     make(map[string]string),
		Users:      make(map[string]string),
		UserEmails: make(map[string]string),
		Usernames:  make(map[string]string),
	}
}

// LoadIndex loads an index from JSON data
func LoadIndex(data []byte) (*Index, error) {
	var idx Index
	if err := json.Unmarshal(data, &idx); err != nil {
		return NewIndex(), nil // Return empty index if file doesn't exist or is invalid
	}
	if idx.Characters == nil {
		idx.Characters = make(map[string]string)
	}
	if idx.Groups == nil {
		idx.Groups = make(map[string]string)
	}
	if idx.Campaigns == nil {
		idx.Campaigns = make(map[string]string)
	}
	if idx.Sessions == nil {
		idx.Sessions = make(map[string]string)
	}
	if idx.Scenes == nil {
		idx.Scenes = make(map[string]string)
	}
	if idx.Users == nil {
		idx.Users = make(map[string]string)
	}
	if idx.UserEmails == nil {
		idx.UserEmails = make(map[string]string)
	}
	if idx.Usernames == nil {
		idx.Usernames = make(map[string]string)
	}
	return &idx, nil
}

// Marshal converts index to JSON
func (idx *Index) Marshal() ([]byte, error) {
	idx.mu.RLock()
	defer idx.mu.RUnlock()
	return json.MarshalIndent(idx, "", "  ")
}
