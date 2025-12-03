package domain

type Contacts []Contact

type Contact struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Loyalty     int    `json:"loyalty"`
	Connection  int    `json:"connection"`
}

