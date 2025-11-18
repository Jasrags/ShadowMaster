package edition

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
)

// mockHandler is a test implementation of EditionHandler
type mockHandler struct {
	editionID string
}

func (m *mockHandler) Edition() string {
	return m.editionID
}

func (m *mockHandler) CreateCharacter(name, playerName string, creationData interface{}) (*domain.Character, error) {
	return nil, nil
}

func (m *mockHandler) ValidateCharacter(character *domain.Character) error {
	return nil
}

func (m *mockHandler) GetCharacterCreationData() (*domain.CharacterCreationData, error) {
	return nil, nil
}

func TestRegister(t *testing.T) {
	t.Parallel()

	// Clear registry before test
	registry = make(map[string]EditionHandler)

	handler1 := &mockHandler{editionID: "sr3"}
	handler2 := &mockHandler{editionID: "sr5"}

	Register(handler1)
	Register(handler2)

	// Verify both are registered
	assert.True(t, IsRegistered("sr3"))
	assert.True(t, IsRegistered("sr5"))
}

func TestGetHandler(t *testing.T) {
	t.Parallel()

	// Clear registry before test
	registry = make(map[string]EditionHandler)

	handler := &mockHandler{editionID: "sr3"}
	Register(handler)

	// Test successful retrieval
	retrieved, err := GetHandler("sr3")
	require.NoError(t, err)
	assert.Equal(t, handler, retrieved)
	assert.Equal(t, "sr3", retrieved.Edition())

	// Test non-existent edition
	_, err = GetHandler("sr4")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "unsupported edition")
}

func TestListEditions(t *testing.T) {
	t.Parallel()

	// Clear registry before test
	registry = make(map[string]EditionHandler)

	Register(&mockHandler{editionID: "sr3"})
	Register(&mockHandler{editionID: "sr5"})
	Register(&mockHandler{editionID: "sr4"})

	editions := ListEditions()
	require.Len(t, editions, 3)
	
	// Verify all editions are present (order may vary)
	editionMap := make(map[string]bool)
	for _, e := range editions {
		editionMap[e] = true
	}
	assert.True(t, editionMap["sr3"])
	assert.True(t, editionMap["sr4"])
	assert.True(t, editionMap["sr5"])
}

func TestIsRegistered(t *testing.T) {
	t.Parallel()

	// Clear registry before test
	registry = make(map[string]EditionHandler)

	assert.False(t, IsRegistered("sr3"))

	Register(&mockHandler{editionID: "sr3"})
	assert.True(t, IsRegistered("sr3"))
	assert.False(t, IsRegistered("sr5"))
}

func TestRegisterOverwrites(t *testing.T) {
	t.Parallel()

	// Clear registry before test
	registry = make(map[string]EditionHandler)

	handler1 := &mockHandler{editionID: "sr3"}
	handler2 := &mockHandler{editionID: "sr3"}

	Register(handler1)
	Register(handler2) // Should overwrite handler1

	retrieved, err := GetHandler("sr3")
	require.NoError(t, err)
	assert.Equal(t, handler2, retrieved) // Should be handler2, not handler1
}

