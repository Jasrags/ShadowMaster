package domain

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCharacter_GetSR3Data(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		character     *Character
		expectedError string
		validate      func(*testing.T, *CharacterSR3)
	}{
		{
			name: "valid SR3 character with pointer data",
			character: func() *Character {
				char := &Character{
					Edition: "sr3",
				}
				sr3Data := &CharacterSR3{
					Body:         4,
					Quickness:    5,
					Strength:     4,
					Charisma:     3,
					Intelligence: 4,
					Willpower:    3,
					Metatype:     "Human",
				}
				char.EditionData = sr3Data
				return char
			}(),
			validate: func(t *testing.T, data *CharacterSR3) {
				assert.Equal(t, 4, data.Body)
				assert.Equal(t, 5, data.Quickness)
				assert.Equal(t, "Human", data.Metatype)
			},
		},
		{
			name: "valid SR3 character with value data",
			character: func() *Character {
				char := &Character{
					Edition: "sr3",
				}
				sr3Data := CharacterSR3{
					Body:         4,
					Quickness:    5,
					Metatype:     "Elf",
				}
				char.EditionData = sr3Data
				return char
			}(),
			validate: func(t *testing.T, data *CharacterSR3) {
				assert.Equal(t, 4, data.Body)
				assert.Equal(t, 5, data.Quickness)
				assert.Equal(t, "Elf", data.Metatype)
			},
		},
		{
			name: "wrong edition",
			character: &Character{
				Edition: "sr5",
			},
			expectedError: "character is not SR3 edition",
		},
		{
			name: "nil edition data",
			character: &Character{
				Edition:     "sr3",
				EditionData: nil,
			},
			expectedError: "character edition data is nil",
		},
		{
			name: "invalid data type",
			character: &Character{
				Edition:     "sr3",
				EditionData: "not SR3 data",
			},
			expectedError: "invalid SR3 data type",
		},
		{
			name: "map data type (needs unmarshaling)",
			character: &Character{
				Edition:     "sr3",
				EditionData: map[string]interface{}{"body": 4},
			},
			expectedError: "edition data is a map, needs proper unmarshaling",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			data, err := tt.character.GetSR3Data()

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				assert.Nil(t, data)
			} else {
				require.NoError(t, err)
				require.NotNil(t, data)
				if tt.validate != nil {
					tt.validate(t, data)
				}
			}
		})
	}
}

func TestCharacter_SetSR3Data(t *testing.T) {
	t.Parallel()

	char := &Character{
		Name: "Test Character",
	}

	sr3Data := &CharacterSR3{
		Body:         4,
		Quickness:    5,
		Metatype:     "Human",
		MagicRating:  6,
	}

	char.SetSR3Data(sr3Data)

	assert.Equal(t, "sr3", char.Edition)
	assert.Equal(t, sr3Data, char.EditionData)

	// Verify we can retrieve it
	retrieved, err := char.GetSR3Data()
	require.NoError(t, err)
	assert.Equal(t, sr3Data, retrieved)
}

func TestCharacter_GetSR5Data(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		character     *Character
		expectedError string
	}{
		{
			name: "valid SR5 character",
			character: &Character{
				Edition:     "sr5",
				EditionData: map[string]interface{}{"test": "data"},
			},
		},
		{
			name: "wrong edition",
			character: &Character{
				Edition: "sr3",
			},
			expectedError: "character is not SR5 edition",
		},
		{
			name: "nil edition data",
			character: &Character{
				Edition:     "sr5",
				EditionData: nil,
			},
			expectedError: "character edition data is nil",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			data, err := tt.character.GetSR5Data()

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				assert.Nil(t, data)
			} else {
				require.NoError(t, err)
				assert.NotNil(t, data)
			}
		})
	}
}

func TestCharacter_SetSR5Data(t *testing.T) {
	t.Parallel()

	char := &Character{
		Name: "Test Character",
	}

	sr5Data := map[string]interface{}{
		"body": 4,
		"agility": 5,
	}

	char.SetSR5Data(sr5Data)

	assert.Equal(t, "sr5", char.Edition)
	assert.Equal(t, sr5Data, char.EditionData)

	// Verify we can retrieve it
	retrieved, err := char.GetSR5Data()
	require.NoError(t, err)
	assert.Equal(t, sr5Data, retrieved)
}

