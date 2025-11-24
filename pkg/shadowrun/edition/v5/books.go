package v5

// Book represents a book definition
type Book struct {
	// ID is the unique identifier for the book
	ID string `json:"id,omitempty"`
	// Name is the book name (e.g., "Shadowrun 5th Edition", "Run and Gun")
	Name string `json:"name,omitempty"`
	// Code is the book code (e.g., "SR5", "RG", "AP")
	Code string `json:"code,omitempty"`
}

// dataBooks is declared in books_data.go

// GetAllBooks returns all book definitions
func GetAllBooks() []Book {
	books := make([]Book, 0, len(dataBooks))
	for _, b := range dataBooks {
		books = append(books, b)
	}
	return books
}

// GetBookByID returns the book definition with the given ID, or nil if not found
func GetBookByID(id string) *Book {
	for _, book := range dataBooks {
		if book.ID == id {
			return &book
		}
	}
	return nil
}

// GetBookByCode returns the book definition with the given code, or nil if not found
func GetBookByCode(code string) *Book {
	for _, book := range dataBooks {
		if book.Code == code {
			return &book
		}
	}
	return nil
}

// GetBookByKey returns the book definition with the given key, or nil if not found
func GetBookByKey(key string) *Book {
	book, ok := dataBooks[key]
	if !ok {
		return nil
	}
	return &book
}
