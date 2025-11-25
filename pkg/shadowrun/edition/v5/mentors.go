package v5

// Mentor represents a mentor spirit definition
type Mentor struct {
	// Name is the mentor spirit name (e.g., "Bear", "Cat", "Dog")
	Name string `json:"name,omitempty"`
	// SimilarArchetypes lists similar archetypes associated with this mentor (e.g., ["Strength", "Protection"])
	SimilarArchetypes []string `json:"similar_archetypes,omitempty"`
	// Description is the full text description (if available)
	Description string `json:"description,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataMentors contains all mentor spirit definitions
// This is populated in mentors_data.go

// GetAllMentors returns all mentor spirits
func GetAllMentors() []Mentor {
	mentors := make([]Mentor, 0, len(dataMentors))
	for _, m := range dataMentors {
		mentors = append(mentors, m)
	}
	return mentors
}

// GetMentorByName returns the mentor spirit definition with the given name, or nil if not found
func GetMentorByName(name string) *Mentor {
	for _, mentor := range dataMentors {
		if mentor.Name == name {
			return &mentor
		}
	}
	return nil
}

// GetMentorByKey returns the mentor spirit definition with the given key, or nil if not found
func GetMentorByKey(key string) *Mentor {
	mentor, ok := dataMentors[key]
	if !ok {
		return nil
	}
	return &mentor
}

