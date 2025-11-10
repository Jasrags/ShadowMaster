package jsonrepo

import (
	"fmt"
	"shadowmaster/internal/domain"
	"shadowmaster/pkg/storage"
	"strings"
	"time"

	"github.com/google/uuid"
)

// CharacterRepositoryJSON implements CharacterRepository using JSON files
type CharacterRepositoryJSON struct {
	store *storage.JSONStore
	index *Index
}

// NewCharacterRepository creates a new JSON-based character repository
func NewCharacterRepository(store *storage.JSONStore, index *Index) *CharacterRepositoryJSON {
	repo := &CharacterRepositoryJSON{
		store: store,
		index: index,
	}

	repo.ensureIndexCollections()
	repo.rebuildDerivedIndexes()

	return repo
}

// Create creates a new character
func (r *CharacterRepositoryJSON) Create(character *domain.Character) error {
	if character.ID == "" {
		character.ID = uuid.New().String()
	}
	character.CreatedAt = time.Now()
	character.UpdatedAt = time.Now()

	filename := fmt.Sprintf("characters/%s.json", character.ID)
	if err := r.store.Write(filename, character); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Characters[character.ID] = filename
	r.ensureIndexCollectionsLocked()
	r.addCharacterToIndexesLocked(character)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// GetByID retrieves a character by ID
func (r *CharacterRepositoryJSON) GetByID(id string) (*domain.Character, error) {
	r.index.mu.RLock()
	filename, exists := r.index.Characters[id]
	r.index.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("character not found: %s", id)
	}

	var character domain.Character
	if err := r.store.Read(filename, &character); err != nil {
		return nil, err
	}

	return &character, nil
}

// GetAll retrieves all characters
func (r *CharacterRepositoryJSON) GetAll() ([]*domain.Character, error) {
	r.index.mu.RLock()
	characterMap := copyStringMap(r.index.Characters)
	r.index.mu.RUnlock()

	characters := make([]*domain.Character, 0) // Ensure non-nil empty slice
	for _, filename := range characterMap {
		var character domain.Character
		if err := r.store.Read(filename, &character); err != nil {
			continue // Skip files that can't be read
		}
		characters = append(characters, &character)
	}

	return characters, nil
}

// GetByCampaignID fetches all characters assigned to a campaign.
func (r *CharacterRepositoryJSON) GetByCampaignID(campaignID string) ([]*domain.Character, error) {
	r.index.mu.RLock()
	ids := append([]string(nil), r.index.CampaignCharacters[campaignID]...)
	r.index.mu.RUnlock()

	result := make([]*domain.Character, 0, len(ids))
	for _, id := range ids {
		character, err := r.GetByID(id)
		if err != nil {
			continue
		}
		result = append(result, character)
	}
	return result, nil
}

// GetByUserID fetches all characters owned by a user.
func (r *CharacterRepositoryJSON) GetByUserID(userID string) ([]*domain.Character, error) {
	r.index.mu.RLock()
	ids := append([]string(nil), r.index.UserCharacters[userID]...)
	r.index.mu.RUnlock()

	result := make([]*domain.Character, 0, len(ids))
	for _, id := range ids {
		character, err := r.GetByID(id)
		if err != nil {
			continue
		}
		result = append(result, character)
	}
	return result, nil
}

// Update updates an existing character
func (r *CharacterRepositoryJSON) Update(character *domain.Character) error {
	existing, err := r.GetByID(character.ID)
	if err != nil {
		return err
	}

	character.CreatedAt = existing.CreatedAt
	character.UpdatedAt = time.Now()
	filename := fmt.Sprintf("characters/%s.json", character.ID)
	if err := r.store.Write(filename, character); err != nil {
		return err
	}

	r.index.mu.Lock()
	r.index.Characters[character.ID] = filename
	r.ensureIndexCollectionsLocked()
	r.removeCharacterFromIndexesLocked(existing)
	r.addCharacterToIndexesLocked(character)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// Delete deletes a character
func (r *CharacterRepositoryJSON) Delete(id string) error {
	existing, err := r.GetByID(id)
	if err != nil {
		return err
	}

	r.index.mu.RLock()
	filename, exists := r.index.Characters[id]
	r.index.mu.RUnlock()

	if !exists {
		return fmt.Errorf("character not found: %s", id)
	}

	if err := r.store.Delete(filename); err != nil {
		return err
	}

	r.index.mu.Lock()
	delete(r.index.Characters, id)
	r.removeCharacterFromIndexesLocked(existing)
	r.index.mu.Unlock()

	return r.saveIndex()
}

// saveIndex saves the index file
func (r *CharacterRepositoryJSON) saveIndex() error {
	return r.store.Write("index.json", r.index)
}

func (r *CharacterRepositoryJSON) ensureIndexCollections() {
	r.index.mu.Lock()
	r.ensureIndexCollectionsLocked()
	r.index.mu.Unlock()
}

func (r *CharacterRepositoryJSON) ensureIndexCollectionsLocked() {
	if r.index.CampaignCharacters == nil {
		r.index.CampaignCharacters = make(map[string][]string)
	}
	if r.index.UserCharacters == nil {
		r.index.UserCharacters = make(map[string][]string)
	}
}

func (r *CharacterRepositoryJSON) addCharacterToIndexesLocked(character *domain.Character) {
	if character.CampaignID != "" {
		r.index.CampaignCharacters[character.CampaignID] = appendUnique(
			r.index.CampaignCharacters[character.CampaignID], character.ID)
	}
	if character.UserID != "" && !character.IsNPC {
		r.index.UserCharacters[character.UserID] = appendUnique(
			r.index.UserCharacters[character.UserID], character.ID)
	}
}

func (r *CharacterRepositoryJSON) removeCharacterFromIndexesLocked(character *domain.Character) {
	if character.CampaignID != "" {
		if list, ok := r.index.CampaignCharacters[character.CampaignID]; ok {
			updated := removeValue(list, character.ID)
			if len(updated) == 0 {
				delete(r.index.CampaignCharacters, character.CampaignID)
			} else {
				r.index.CampaignCharacters[character.CampaignID] = updated
			}
		}
	}
	if character.UserID != "" {
		if list, ok := r.index.UserCharacters[character.UserID]; ok {
			updated := removeValue(list, character.ID)
			if len(updated) == 0 {
				delete(r.index.UserCharacters, character.UserID)
			} else {
				r.index.UserCharacters[character.UserID] = updated
			}
		}
	}
}

func (r *CharacterRepositoryJSON) rebuildDerivedIndexes() {
	files, err := r.store.List("characters")
	if err != nil {
		return
	}

	characterFiles := make(map[string]string)
	campaignCharacters := make(map[string][]string)
	userCharacters := make(map[string][]string)

	for _, file := range files {
		if !strings.HasSuffix(file, ".json") {
			continue
		}

		filename := fmt.Sprintf("characters/%s", file)
		var character domain.Character
		if err := r.store.Read(filename, &character); err != nil {
			continue
		}

		charID := character.ID
		if charID == "" {
			charID = strings.TrimSuffix(file, ".json")
		}

		characterFiles[charID] = filename

		if character.CampaignID != "" {
			campaignCharacters[character.CampaignID] = append(
				campaignCharacters[character.CampaignID], charID,
			)
		}
		if character.UserID != "" && !character.IsNPC {
			userCharacters[character.UserID] = append(
				userCharacters[character.UserID], charID,
			)
		}
	}

	// Deduplicate entries
	for campaignID, ids := range campaignCharacters {
		campaignCharacters[campaignID] = unique(ids)
	}
	for userID, ids := range userCharacters {
		userCharacters[userID] = unique(ids)
	}

	r.index.mu.Lock()
	r.index.Characters = characterFiles
	r.index.CampaignCharacters = campaignCharacters
	r.index.UserCharacters = userCharacters
	r.ensureIndexCollectionsLocked()
	r.index.mu.Unlock()

	_ = r.saveIndex()
}

func appendUnique(list []string, value string) []string {
	for _, existing := range list {
		if existing == value {
			return list
		}
	}
	return append(list, value)
}

func removeValue(list []string, value string) []string {
	if len(list) == 0 {
		return list
	}
	result := make([]string, 0, len(list))
	for _, existing := range list {
		if existing != value {
			result = append(result, existing)
		}
	}
	return result
}

func unique(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func copyStringMap(src map[string]string) map[string]string {
	dst := make(map[string]string, len(src))
	for k, v := range src {
		dst[k] = v
	}
	return dst
}
