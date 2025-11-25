package v5

// Contact represents a contact type available to shadowrunners
type Contact struct {
	// ID is the unique identifier for the contact (derived from the map key)
	ID string `json:"id,omitempty"`
	// Name is the contact name (e.g., "Bartender", "Fixer", "Street Doc")
	Name string `json:"name,omitempty"`
	// Uses is a list of what the contact can be used for (e.g., "Information", "Gear", "Additional contacts")
	Uses []string `json:"uses,omitempty"`
	// PlacesToMeet describes where you can typically find this contact
	PlacesToMeet string `json:"places_to_meet,omitempty"`
	// SimilarContacts lists other contact types that serve similar purposes
	SimilarContacts []string `json:"similar_contacts,omitempty"`
	// Description is the full text description of the contact
	Description string `json:"description,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataContacts is declared in contacts_data.go

// GetAllContacts returns all contact definitions
func GetAllContacts() []Contact {
	contacts := make([]Contact, 0, len(dataContacts))
	for key, c := range dataContacts {
		c.ID = key
		contacts = append(contacts, c)
	}
	return contacts
}

// GetContactByName returns the contact definition with the given name, or nil if not found
func GetContactByName(name string) *Contact {
	for key, contact := range dataContacts {
		if contact.Name == name {
			contact.ID = key
			return &contact
		}
	}
	return nil
}

// GetContactByKey returns the contact definition with the given key, or nil if not found
func GetContactByKey(key string) *Contact {
	contact, ok := dataContacts[key]
	if !ok {
		return nil
	}
	contact.ID = key
	return &contact
}
