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
	}
}

// LoadIndex loads an index from JSON data
func LoadIndex(data []byte) (*Index, error) {
	var idx Index
	if err := json.Unmarshal(data, &idx); err != nil {
		return NewIndex(), nil // Return empty index if file doesn't exist or is invalid
	}
	return &idx, nil
}

// Marshal converts index to JSON
func (idx *Index) Marshal() ([]byte, error) {
	idx.mu.RLock()
	defer idx.mu.RUnlock()
	return json.MarshalIndent(idx, "", "  ")
}
