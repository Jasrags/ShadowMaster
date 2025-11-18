package v3

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"shadowmaster/internal/domain"
	"shadowmaster/internal/repository"
)

// mockEditionRepository is a test implementation of EditionDataRepository
type mockEditionRepository struct {
	creationData *domain.CharacterCreationData
	err          error
}

func (m *mockEditionRepository) GetCharacterCreationData(edition string) (*domain.CharacterCreationData, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.creationData, nil
}

func TestSR3Handler_Edition(t *testing.T) {
	t.Parallel()

	handler := NewSR3Handler(nil)
	assert.Equal(t, "sr3", handler.Edition())
}

func TestSR3Handler_CreateCharacter(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		creationData  interface{}
		expectedError string
		validate      func(*testing.T, *domain.Character)
	}{
		{
			name: "valid priority selection",
			creationData: PrioritySelection{
				Magic:      "A",
				Metatype:   "C",
				Attributes: "B",
				Skills:     "A",
				Resources:  "B",
			},
			validate: func(t *testing.T, char *domain.Character) {
				assert.Equal(t, "Test Character", char.Name)
				assert.Equal(t, "Test Player", char.PlayerName)
				assert.Equal(t, "sr3", char.Edition)

				sr3Data, err := char.GetSR3Data()
				require.NoError(t, err)
				assert.Equal(t, "A", sr3Data.MagicPriority)
				assert.Equal(t, "C", sr3Data.MetatypePriority)
				assert.Equal(t, "B", sr3Data.AttrPriority)
				assert.Equal(t, "A", sr3Data.SkillsPriority)
				assert.Equal(t, "B", sr3Data.ResourcesPriority)
				assert.Equal(t, 6, sr3Data.MagicRating)
				assert.Equal(t, 400000, sr3Data.Nuyen) // Priority B resources
				assert.Equal(t, 6.0, sr3Data.Essence)
			},
		},
		{
			name: "priority selection from map",
			creationData: map[string]interface{}{
				"magic_priority":      "B",
				"metatype_priority":   "A",
				"attr_priority":       "C",
				"skills_priority":     "D",
				"resources_priority":  "E",
			},
			validate: func(t *testing.T, char *domain.Character) {
				sr3Data, err := char.GetSR3Data()
				require.NoError(t, err)
				assert.Equal(t, "B", sr3Data.MagicPriority)
				assert.Equal(t, "A", sr3Data.MetatypePriority)
				assert.Equal(t, 4, sr3Data.MagicRating) // Priority B magic
				assert.Equal(t, 5000, sr3Data.Nuyen)    // Priority E resources
			},
		},
		{
			name: "missing priorities",
			creationData: PrioritySelection{
				Magic:      "A",
				Metatype:   "",
				Attributes: "B",
				Skills:     "A",
				Resources:  "B",
			},
			expectedError: "all priorities (A-E) must be assigned",
		},
		{
			name:          "invalid creation data type",
			creationData:  "not a valid type",
			expectedError: "invalid creation data type for SR3",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			handler := NewSR3Handler(nil)
			character, err := handler.CreateCharacter("Test Character", "Test Player", tt.creationData)

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				assert.Nil(t, character)
			} else {
				require.NoError(t, err)
				require.NotNil(t, character)
				if tt.validate != nil {
					tt.validate(t, character)
				}
			}
		})
	}
}

func TestSR3Handler_CreateCharacter_AppliesDefaults(t *testing.T) {
	t.Parallel()

	handler := NewSR3Handler(nil)
	priorities := PrioritySelection{
		Magic:      "A",
		Metatype:   "C",
		Attributes: "B",
		Skills:     "A",
		Resources:  "B",
	}

	character, err := handler.CreateCharacter("Test", "Player", priorities)
	require.NoError(t, err)

	sr3Data, err := character.GetSR3Data()
	require.NoError(t, err)

	// Verify default language skill
	english, exists := sr3Data.LanguageSkills["English"]
	require.True(t, exists)
	assert.Equal(t, 6, english.Rating)

	// Verify default contacts
	require.Len(t, sr3Data.Contacts, 2)
	assert.Equal(t, "Contact 1", sr3Data.Contacts[0].Name)
	assert.Equal(t, "Contact 2", sr3Data.Contacts[1].Name)

	// Verify reaction is calculated
	assert.Equal(t, sr3Data.Quickness+sr3Data.Intelligence, sr3Data.Reaction)
}

func TestSR3Handler_ValidateCharacter(t *testing.T) {
	t.Parallel()

	handler := NewSR3Handler(nil)

	tests := []struct {
		name          string
		character     *domain.Character
		expectedError string
	}{
		{
			name: "valid SR3 character",
			character: func() *domain.Character {
				char := &domain.Character{
					Edition: "sr3",
				}
				sr3Data := &domain.CharacterSR3{
					Body:         4,
					Quickness:    5,
					Strength:     4,
					Charisma:     3,
					Intelligence: 4,
					Willpower:    3,
					Reaction:     9, // Quickness + Intelligence
					Essence:      6.0,
				}
				char.SetSR3Data(sr3Data)
				return char
			}(),
		},
		{
			name: "wrong edition",
			character: &domain.Character{
				Edition: "sr5",
			},
			expectedError: "character is not SR3 edition",
		},
		{
			name: "invalid SR3 data type",
			character: &domain.Character{
				Edition:     "sr3",
				EditionData: "not SR3 data",
			},
			expectedError: "invalid SR3 character data",
		},
		{
			name: "body out of range",
			character: func() *domain.Character {
				char := &domain.Character{
					Edition: "sr3",
				}
				sr3Data := &domain.CharacterSR3{
					Body:         25, // Out of range
					Quickness:    5,
					Strength:     4,
					Charisma:     3,
					Intelligence: 4,
					Willpower:    3,
					Reaction:     9,
					Essence:      6.0,
				}
				char.SetSR3Data(sr3Data)
				return char
			}(),
			expectedError: "Body attribute out of range",
		},
		{
			name: "negative essence",
			character: func() *domain.Character {
				char := &domain.Character{
					Edition: "sr3",
				}
				sr3Data := &domain.CharacterSR3{
					Body:         4,
					Quickness:    5,
					Strength:     4,
					Charisma:     3,
					Intelligence: 4,
					Willpower:    3,
					Reaction:     9,
					Essence:      -1.0, // Invalid
				}
				char.SetSR3Data(sr3Data)
				return char
			}(),
			expectedError: "Essence cannot be negative",
		},
		{
			name: "reaction mismatch",
			character: func() *domain.Character {
				char := &domain.Character{
					Edition: "sr3",
				}
				sr3Data := &domain.CharacterSR3{
					Body:         4,
					Quickness:    5,
					Strength:     4,
					Charisma:     3,
					Intelligence: 4,
					Willpower:    3,
					Reaction:     5, // Wrong: should be 9
					Essence:      6.0,
				}
				char.SetSR3Data(sr3Data)
				return char
			}(),
			expectedError: "Reaction mismatch",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			err := handler.ValidateCharacter(tt.character)

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
			} else {
				require.NoError(t, err)
			}
		})
	}
}

func TestSR3Handler_GetCharacterCreationData(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		repo          repository.EditionDataRepository
		expectedError string
	}{
		{
			name: "successful retrieval",
			repo: &mockEditionRepository{
				creationData: &domain.CharacterCreationData{
					Priorities: make(map[string]map[string]domain.PriorityOption),
					Metatypes:  []domain.MetatypeDefinition{},
				},
			},
		},
		{
			name:          "no repository",
			repo:          nil,
			expectedError: "edition repository not available",
		},
		{
			name: "repository error",
			repo: &mockEditionRepository{
				err: errors.New("repository error"),
			},
			expectedError: "repository error",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			handler := NewSR3Handler(tt.repo)
			data, err := handler.GetCharacterCreationData()

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				assert.Nil(t, data)
			} else {
				require.NoError(t, err)
				require.NotNil(t, data)
			}
		})
	}
}

func TestGetMetatypeModifiers(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		metatype string
		expected MetatypeModifiers
	}{
		{
			name:     "human",
			metatype: "Human",
			expected: MetatypeModifiers{},
		},
		{
			name:     "dwarf",
			metatype: "Dwarf",
			expected: MetatypeModifiers{
				Body:      1,
				Strength:  2,
				Willpower: 1,
			},
		},
		{
			name:     "elf",
			metatype: "Elf",
			expected: MetatypeModifiers{
				Quickness: 1,
				Charisma:  2,
			},
		},
		{
			name:     "ork",
			metatype: "Ork",
			expected: MetatypeModifiers{
				Body:         3,
				Strength:     2,
				Charisma:     -1,
				Intelligence: -1,
			},
		},
		{
			name:     "troll",
			metatype: "Troll",
			expected: MetatypeModifiers{
				Body:         5,
				Quickness:    -1,
				Strength:     4,
				Intelligence: -2,
				Charisma:     -2,
			},
		},
		{
			name:     "unknown metatype",
			metatype: "Unknown",
			expected: MetatypeModifiers{},
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			result := GetMetatypeModifiers(tt.metatype)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestGetLanguageSkillPoints(t *testing.T) {
	t.Parallel()

	tests := []struct {
		intelligence int
		expected     int
	}{
		{0, 0},
		{1, 1},
		{4, 6},
		{5, 7},
		{6, 9},
		{10, 15},
	}

	for _, tt := range tests {
		tt := tt
		t.Run("", func(t *testing.T) {
			t.Parallel()

			result := GetLanguageSkillPoints(tt.intelligence)
			assert.Equal(t, tt.expected, result)
		})
	}
}

