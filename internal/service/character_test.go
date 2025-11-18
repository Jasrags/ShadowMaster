package service

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	edition "shadowmaster/pkg/shadowrun/edition"
	v3 "shadowmaster/pkg/shadowrun/edition/v3"
)

type stubCharacterRepository struct {
	created []*domain.Character
}

func (s *stubCharacterRepository) Create(character *domain.Character) error {
	s.created = append(s.created, character)
	return nil
}

func (s *stubCharacterRepository) GetByID(string) (*domain.Character, error) {
	return nil, errors.New("not implemented")
}

func (s *stubCharacterRepository) GetAll() ([]*domain.Character, error) {
	return nil, errors.New("not implemented")
}

func (s *stubCharacterRepository) GetByCampaignID(string) ([]*domain.Character, error) {
	return nil, errors.New("not implemented")
}

func (s *stubCharacterRepository) GetByUserID(string) ([]*domain.Character, error) {
	return nil, errors.New("not implemented")
}

func (s *stubCharacterRepository) Update(*domain.Character) error {
	return errors.New("not implemented")
}

func (s *stubCharacterRepository) Delete(string) error {
	return errors.New("not implemented")
}

func TestCharacterServiceCreateSR3Character(t *testing.T) {
	t.Parallel()

	// Register SR3 handler for testing
	mockRepo := &mockEditionRepository{}
	sr3Handler := v3.NewSR3Handler(mockRepo)
	edition.Register(sr3Handler)

	repo := &stubCharacterRepository{}
	service := NewCharacterService(repo)

	priorities := v3.PrioritySelection{
		Magic:      "A",
		Metatype:   "C",
		Attributes: "B",
		Skills:     "A",
		Resources:  "B",
	}

	character, err := service.CreateSR3Character("Ghost", "Player One", priorities)
	require.NoError(t, err)

	require.Len(t, repo.created, 1)
	assert.Equal(t, character, repo.created[0])
	assert.Equal(t, "Ghost", character.Name)
	assert.Equal(t, "Player One", character.PlayerName)
	assert.Equal(t, "sr3", character.Edition)

	sr3Data, err := character.GetSR3Data()
	require.NoError(t, err)

	assert.Equal(t, "Elf", sr3Data.Metatype)
	assert.Equal(t, 6, sr3Data.MagicRating)
	assert.Equal(t, 400000, sr3Data.Nuyen) // Priority B resources
	assert.Equal(t, 5, sr3Data.Quickness)
	assert.Equal(t, 4, sr3Data.Intelligence)
	assert.Equal(t, 9, sr3Data.Reaction)
	assert.Equal(t, 6, sr3Data.Charisma)

	english, exists := sr3Data.LanguageSkills["English"]
	require.True(t, exists)
	assert.Equal(t, 6, english.Rating)

	require.Len(t, sr3Data.Contacts, 2)
	assert.Equal(t, "Contact 1", sr3Data.Contacts[0].Name)
	assert.Equal(t, "Contact 2", sr3Data.Contacts[1].Name)
}

// mockEditionRepository is a test implementation of EditionDataRepository
type mockEditionRepository struct{}

func (m *mockEditionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	return &domain.CharacterCreationData{
		Priorities: make(map[string]map[string]domain.PriorityOption),
		Metatypes:  []domain.MetatypeDefinition{},
	}, nil
}

func TestCharacterServiceCreateCharacter(t *testing.T) {
	t.Parallel()

	// Register SR3 handler for testing
	mockRepo := &mockEditionRepository{}
	sr3Handler := v3.NewSR3Handler(mockRepo)
	edition.Register(sr3Handler)

	repo := &stubCharacterRepository{}
	service := NewCharacterService(repo)

	priorities := v3.PrioritySelection{
		Magic:      "A",
		Metatype:   "C",
		Attributes: "B",
		Skills:     "A",
		Resources:  "B",
	}

	character, err := service.CreateCharacter("sr3", "Test Character", "Test Player", priorities)
	require.NoError(t, err)

	require.Len(t, repo.created, 1)
	assert.Equal(t, "Test Character", character.Name)
	assert.Equal(t, "Test Player", character.PlayerName)
	assert.Equal(t, "sr3", character.Edition)

	// Test unsupported edition
	_, err = service.CreateCharacter("sr4", "Test", "Player", nil)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "unsupported edition")
}
