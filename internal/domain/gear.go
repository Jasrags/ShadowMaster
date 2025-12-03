package domain

type Weapons []Weapon

type Weapon struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Armors []Armor

type Armor struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Cyberdecks []Cyberdeck

type Cyberdeck struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Augmentations []Augmentation

type Augmentation struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Vehicles []Vehicle

type Vehicle struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Gears []Gear

type Gear struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

