package v5

import (
	"fmt"
	"math/rand"
	"time"

	"shadowmaster/internal/domain"
)

// Contact represents a Shadowrun 5th Edition contact with all the details
// from the Chummer data structure.
type Contact struct {
	// Basic information
	Name    string `json:"name"`
	Type    string `json:"type"`    // Contact type (e.g., "Fixer", "Street Doc", "Armorer")
	Level   int    `json:"level"`   // Connection rating (1-6 in SR5)
	Loyalty int    `json:"loyalty"` // Loyalty rating (1-6 in SR5)

	// Demographics (from Chummer data)
	Gender       string `json:"gender,omitempty"`        // Female, Male, Unknown
	Age          string `json:"age,omitempty"`           // Young, Middle-Aged, Old, Unknown
	PersonalLife string `json:"personal_life,omitempty"` // Single, In Relationship, etc.

	// Contact details
	TypeCategory     string `json:"type_category,omitempty"`     // Legwork, Networking, Swag, etc.
	PreferredPayment string `json:"preferred_payment,omitempty"` // Payment method preference
	HobbyVice        string `json:"hobby_vice,omitempty"`        // Hobby or vice

	// Additional notes
	Notes string `json:"notes,omitempty"`
}

// GetContactTypes returns all available contact types from the Chummer data.
func GetContactTypes() []string {
	return ContactsData.Contacts
}

// GetGenders returns all available gender options.
func GetGenders() []string {
	return ContactsData.Genders
}

// GetAges returns all available age categories.
func GetAges() []string {
	return ContactsData.Ages
}

// GetPersonalLives returns all available personal life statuses.
func GetPersonalLives() []string {
	return ContactsData.PersonalLives
}

// GetContactTypeCategories returns all available contact type categories
// (Legwork, Networking, Swag, etc.).
func GetContactTypeCategories() []string {
	return ContactsData.Types
}

// GetPreferredPayments returns all available preferred payment methods.
func GetPreferredPayments() []string {
	return ContactsData.PreferredPayments
}

// GetHobbiesVices returns all available hobbies and vices.
func GetHobbiesVices() []string {
	return ContactsData.HobbiesVices
}

// IsValidContactType checks if the given contact type exists in the data.
func IsValidContactType(contactType string) bool {
	for _, t := range ContactsData.Contacts {
		if t == contactType {
			return true
		}
	}
	return false
}

// IsValidGender checks if the given gender is valid.
func IsValidGender(gender string) bool {
	for _, g := range ContactsData.Genders {
		if g == gender {
			return true
		}
	}
	return false
}

// IsValidAge checks if the given age category is valid.
func IsValidAge(age string) bool {
	for _, a := range ContactsData.Ages {
		if a == age {
			return true
		}
	}
	return false
}

// CreateContact creates a new contact with the specified type and connection/loyalty ratings.
// If optional fields are empty strings, they will be randomly selected from the Chummer data.
func CreateContact(contactType string, level, loyalty int, name, gender, age, personalLife, typeCategory, preferredPayment, hobbyVice string) (*Contact, error) {
	// Validate contact type
	if !IsValidContactType(contactType) {
		return nil, fmt.Errorf("invalid contact type: %s", contactType)
	}

	// Validate level and loyalty (SR5 uses 1-6)
	if level < 1 || level > 6 {
		return nil, fmt.Errorf("connection level must be between 1 and 6, got %d", level)
	}
	if loyalty < 1 || loyalty > 6 {
		return nil, fmt.Errorf("loyalty must be between 1 and 6, got %d", loyalty)
	}

	// Generate random values for empty fields
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	if name == "" {
		name = contactType // Default to contact type as name
	}

	if gender == "" {
		genders := ContactsData.Genders
		gender = genders[rng.Intn(len(genders))]
	}

	if age == "" {
		ages := ContactsData.Ages
		age = ages[rng.Intn(len(ages))]
	}

	if personalLife == "" {
		lives := ContactsData.PersonalLives
		personalLife = lives[rng.Intn(len(lives))]
	}

	if typeCategory == "" {
		categories := ContactsData.Types
		typeCategory = categories[rng.Intn(len(categories))]
	}

	if preferredPayment == "" {
		payments := ContactsData.PreferredPayments
		preferredPayment = payments[rng.Intn(len(payments))]
	}

	if hobbyVice == "" {
		hobbies := ContactsData.HobbiesVices
		// Allow "Nothing of Interest" or a random hobby
		if rng.Float32() < 0.3 { // 30% chance of no hobby
			hobbyVice = "Nothing of Interest"
		} else {
			hobbyVice = hobbies[rng.Intn(len(hobbies))]
		}
	}

	return &Contact{
		Name:             name,
		Type:             contactType,
		Level:            level,
		Loyalty:          loyalty,
		Gender:           gender,
		Age:              age,
		PersonalLife:     personalLife,
		TypeCategory:     typeCategory,
		PreferredPayment: preferredPayment,
		HobbyVice:        hobbyVice,
	}, nil
}

// CreateRandomContact creates a contact with random values from the Chummer data.
// The contact type, level, and loyalty can be specified, or left as 0 for random selection.
func CreateRandomContact(contactType string, level, loyalty int) (*Contact, error) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	// Random contact type if not specified
	if contactType == "" {
		types := ContactsData.Contacts
		contactType = types[rng.Intn(len(types))]
	}

	// Random level if not specified (1-6 for SR5)
	if level == 0 {
		level = rng.Intn(6) + 1
	}

	// Random loyalty if not specified (1-6 for SR5)
	if loyalty == 0 {
		loyalty = rng.Intn(6) + 1
	}

	return CreateContact(contactType, level, loyalty, "", "", "", "", "", "", "")
}

// GetAllContactTypes returns all available contact types.
// This is a convenience wrapper around GetContactTypes().
func GetAllContactTypes() []string {
	return GetContactTypes()
}

// GetAllContactTypeCategories returns all contact type categories.
// This is a convenience wrapper around GetContactTypeCategories().
func GetAllContactTypeCategories() []string {
	return GetContactTypeCategories()
}

// ToDomainContact converts a v5 Contact to the domain Contact format.
// This is useful for storing contacts in characters that use the domain model.
func (c *Contact) ToDomainContact() domain.Contact {
	return domain.Contact{
		Name:    c.Name,
		Type:    c.Type,
		Level:   c.Level,
		Loyalty: c.Loyalty,
		Notes:   c.Notes,
	}
}
