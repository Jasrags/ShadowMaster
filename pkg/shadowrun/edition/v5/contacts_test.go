package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestContactsData(t *testing.T) {
	t.Parallel()

	// Test that ContactsData is populated
	assert.NotEmpty(t, ContactsData.Contacts)
	assert.NotEmpty(t, ContactsData.Genders)
	assert.NotEmpty(t, ContactsData.Ages)
	assert.NotEmpty(t, ContactsData.PersonalLives)
	assert.NotEmpty(t, ContactsData.Types)
	assert.NotEmpty(t, ContactsData.PreferredPayments)
	assert.NotEmpty(t, ContactsData.HobbiesVices)

	// Verify some expected values
	assert.Contains(t, ContactsData.Contacts, "Fixer")
	assert.Contains(t, ContactsData.Contacts, "Street Doc")
	assert.Contains(t, ContactsData.Genders, "Male")
	assert.Contains(t, ContactsData.Genders, "Female")
}

func TestGetContactTypes(t *testing.T) {
	t.Parallel()

	types := GetContactTypes()
	assert.NotEmpty(t, types)
	assert.Contains(t, types, "Fixer")
	assert.Contains(t, types, "Street Doc")
	assert.Contains(t, types, "Armorer")
}

func TestGetGenders(t *testing.T) {
	t.Parallel()

	genders := GetGenders()
	assert.NotEmpty(t, genders)
	assert.Contains(t, genders, "Male")
	assert.Contains(t, genders, "Female")
	assert.Contains(t, genders, "Unknown")
}

func TestIsValidContactType(t *testing.T) {
	t.Parallel()

	assert.True(t, IsValidContactType("Fixer"))
	assert.True(t, IsValidContactType("Street Doc"))
	assert.False(t, IsValidContactType("Invalid Type"))
}

func TestCreateContact(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		contactType   string
		level         int
		loyalty       int
		expectedError string
		validate      func(*testing.T, *Contact)
	}{
		{
			name:        "valid contact with all fields",
			contactType: "Fixer",
			level:       3,
			loyalty:     2,
			validate: func(t *testing.T, contact *Contact) {
				assert.Equal(t, "Fixer", contact.Name) // Defaults to type
				assert.Equal(t, "Fixer", contact.Type)
				assert.Equal(t, 3, contact.Level)
				assert.Equal(t, 2, contact.Loyalty)
				assert.NotEmpty(t, contact.Gender)
				assert.NotEmpty(t, contact.Age)
				assert.NotEmpty(t, contact.PersonalLife)
				assert.NotEmpty(t, contact.TypeCategory)
				assert.NotEmpty(t, contact.PreferredPayment)
			},
		},
		{
			name:        "valid contact with custom name",
			contactType: "Street Doc",
			level:       4,
			loyalty:     3,
			validate: func(t *testing.T, contact *Contact) {
				assert.Equal(t, "Dr. Smith", contact.Name)
				assert.Equal(t, "Street Doc", contact.Type)
				assert.Equal(t, 4, contact.Level)
				assert.Equal(t, 3, contact.Loyalty)
			},
		},
		{
			name:          "invalid contact type",
			contactType:   "Invalid Type",
			level:         3,
			loyalty:       2,
			expectedError: "invalid contact type",
		},
		{
			name:          "level too high",
			contactType:   "Fixer",
			level:         7,
			loyalty:       2,
			expectedError: "connection level must be between 1 and 6",
		},
		{
			name:          "level too low",
			contactType:   "Fixer",
			level:         0,
			loyalty:       2,
			expectedError: "connection level must be between 1 and 6",
		},
		{
			name:          "loyalty too high",
			contactType:   "Fixer",
			level:         3,
			loyalty:       7,
			expectedError: "loyalty must be between 1 and 6",
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			var name string
			if tt.name == "valid contact with custom name" {
				name = "Dr. Smith"
			}

			contact, err := CreateContact(tt.contactType, tt.level, tt.loyalty, name, "", "", "", "", "", "")

			if tt.expectedError != "" {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				assert.Nil(t, contact)
			} else {
				require.NoError(t, err)
				require.NotNil(t, contact)
				if tt.validate != nil {
					tt.validate(t, contact)
				}
			}
		})
	}
}

func TestCreateRandomContact(t *testing.T) {
	t.Parallel()

	// Test fully random contact
	contact, err := CreateRandomContact("", 0, 0)
	require.NoError(t, err)
	require.NotNil(t, contact)
	assert.NotEmpty(t, contact.Type)
	assert.GreaterOrEqual(t, contact.Level, 1)
	assert.LessOrEqual(t, contact.Level, 6)
	assert.GreaterOrEqual(t, contact.Loyalty, 1)
	assert.LessOrEqual(t, contact.Loyalty, 6)
	assert.NotEmpty(t, contact.Gender)
	assert.NotEmpty(t, contact.Age)

	// Test with specified type but random level/loyalty
	contact2, err := CreateRandomContact("Fixer", 0, 0)
	require.NoError(t, err)
	require.NotNil(t, contact2)
	assert.Equal(t, "Fixer", contact2.Type)
	assert.GreaterOrEqual(t, contact2.Level, 1)
	assert.LessOrEqual(t, contact2.Level, 6)

	// Test with specified type and level but random loyalty
	contact3, err := CreateRandomContact("Street Doc", 4, 0)
	require.NoError(t, err)
	require.NotNil(t, contact3)
	assert.Equal(t, "Street Doc", contact3.Type)
	assert.Equal(t, 4, contact3.Level)
	assert.GreaterOrEqual(t, contact3.Loyalty, 1)
	assert.LessOrEqual(t, contact3.Loyalty, 6)
}
