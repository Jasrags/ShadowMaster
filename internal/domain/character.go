package domain

import "time"

type CharacterState string

const (
	CharacterStateCreation    CharacterState = "creation"
	CharacterStateGMReview    CharacterState = "gm_review"
	CharacterStateAdvancement CharacterState = "advancement"
)

type Character struct {
	ID                 string              `json:"id"`
	Name               string              `json:"name"`
	Description        string              `json:"description"`
	Age                string              `json:"age"`
	Gender             string              `json:"gender"`
	Height             string              `json:"height"`
	Weight             string              `json:"weight"`
	State              CharacterState      `json:"state"`
	UserID             string              `json:"user_id"`
	Attributes         Attributes          `json:"attributes"`
	EditionData        EditionData         `json:"edition_data"`
	PriorityAssignment *PriorityAssignment `json:"priority_assignment,omitempty"`
	CreatedAt          time.Time           `json:"created_at"`
	UpdatedAt          time.Time           `json:"updated_at"`
	DeletedAt          *time.Time          `json:"deleted_at,omitempty"`
}

type PriorityAssignment struct {
	Metatype         string `json:"metatype"`                    // Priority level (A-E) for metatype category
	SelectedMetatype string `json:"selected_metatype,omitempty"` // Selected metatype ID (human, elf, etc.)
	Attributes       string `json:"attributes"`
	MagicResonance   string `json:"magic_resonance"`
	Skills           string `json:"skills"`
	Resources        string `json:"resources"`
}

type EditionData struct {
	Edition        string `json:"edition"`
	CreationMethod string `json:"creation_method"`
	PlayLevel      string `json:"play_level"`
}

// IntAttribute represents an integer attribute with min, max, and current value
type IntAttribute struct {
	Min   int `json:"min"`
	Max   int `json:"max"`
	Value int `json:"value"`
}

// FloatAttribute represents a float attribute with min, max, and current value
type FloatAttribute struct {
	Min   float32 `json:"min"`
	Max   float32 `json:"max"`
	Value float32 `json:"value"`
}

type Attributes struct {
	Body      IntAttribute   `json:"body"`
	Agility   IntAttribute   `json:"agility"`
	Reaction  IntAttribute   `json:"reaction"`
	Strength  IntAttribute   `json:"strength"`
	Willpower IntAttribute   `json:"willpower"`
	Logic     IntAttribute   `json:"logic"`
	Intuition IntAttribute   `json:"intuition"`
	Charisma  IntAttribute   `json:"charisma"`
	Magic     IntAttribute   `json:"magic"`
	Resonance IntAttribute   `json:"resonance"`
	Edge      IntAttribute   `json:"edge"`
	Essence   FloatAttribute `json:"essence"`
}
