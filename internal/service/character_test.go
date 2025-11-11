package service

import (
	"errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
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

	repo := &stubCharacterRepository{}
	service := NewCharacterService(repo)

	priorities := PrioritySelection{
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

	sr3Data, ok := character.EditionData.(*domain.CharacterSR3)
	require.True(t, ok, "expected SR3 edition data")

	assert.Equal(t, "Elf", sr3Data.Metatype)
	assert.Equal(t, 6, sr3Data.MagicRating)
	assert.Equal(t, getResourcesPriority("B"), sr3Data.Nuyen)
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

func TestGetResourcesPriority(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		input    string
		expected int
	}{
		{"A", 1000000},
		{"B", 400000},
		{"C", 90000},
		{"D", 20000},
		{"E", 5000},
		{"unknown", 0},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.input, func(t *testing.T) {
			assert.Equal(t, tc.expected, getResourcesPriority(tc.input))
		})
	}
}

func TestGetMetatypeModifiers(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		name     string
		metatype string
		expected MetatypeModifiers
	}{
		{"human", "Human", MetatypeModifiers{}},
		{"dwarf", "Dwarf", MetatypeModifiers{Body: 1, Strength: 2, Willpower: 1}},
		{"elf", "Elf", MetatypeModifiers{Quickness: 1, Charisma: 2}},
		{"ork", "Ork", MetatypeModifiers{Body: 3, Strength: 2, Charisma: -1, Intelligence: -1}},
		{"troll", "Troll", MetatypeModifiers{Body: 5, Quickness: -1, Strength: 4, Intelligence: -2, Charisma: -2}},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.expected, GetMetatypeModifiers(tc.metatype))
		})
	}
}

func TestGetLanguageSkillPoints(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		intelligence int
		expected     int
	}{
		{0, 0},
		{4, 6},
		{5, 7},
		{10, 15},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(fmt.Sprintf("int_%d", tc.intelligence), func(t *testing.T) {
			assert.Equal(t, tc.expected, GetLanguageSkillPoints(tc.intelligence))
		})
	}
}
