package domain

type Spells []Spell

type Spell struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Rating      int    `json:"rating"`
}

type Powers []Power

type Power struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Rating      int    `json:"rating"`
}

