package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	// Load the XML data
	data, err := loader.LoadBooksFromXML("data/chummerxml/books.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	// Generate Go code
	code := generateBooksDataCode(data)

	// Write to file
	outputPath := "pkg/shadowrun/edition/v5/books_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalBooks := 0
	for _, books := range data.Books {
		totalBooks += len(books.Book)
	}
	fmt.Printf("  Total books: %d\n", totalBooks)
}

func generateBooksDataCode(data *v5.BooksChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from books.xml. DO NOT EDIT.\n\n")
	b.WriteString("var booksData = &BooksChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	b.WriteString("\tBooks: []Books{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tBook: []Book{\n")

	// Flatten all books from all Books entries
	allBooks := make([]v5.Book, 0)
	for _, books := range data.Books {
		allBooks = append(allBooks, books.Book...)
	}

	for i, book := range allBooks {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", book.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", book.Name))

		if book.Hide != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *book.Hide))
		}

		b.WriteString(fmt.Sprintf("\t\t\t\t\tCode: %q,\n", book.Code))

		if book.Permanent != nil {
			b.WriteString("\t\t\t\t\tPermanent: stringPtr(\"\"),\n")
		}

		if book.Matches != nil && len(book.Matches.Match) > 0 {
			b.WriteString("\t\t\t\t\tMatches: &Matches{\n")
			b.WriteString("\t\t\t\t\t\tMatch: []Match{\n")
			for _, match := range book.Matches.Match {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tLanguage: %q,\n", match.Language))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tText: %q,\n", escapeString(match.Text)))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tPage: %d,\n", match.Page))
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t\t},\n")
		_ = i // Avoid unused variable warning
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	// Add helper functions (only if not already present)
	b.WriteString("// Helper functions for pointer creation\n")
	b.WriteString("// stringPtr and intPtr are defined in actions_data.go\n\n")

	// Add accessor functions
	b.WriteString("// GetBooksData returns the loaded books data.\n")
	b.WriteString("func GetBooksData() *BooksChummer {\n")
	b.WriteString("\treturn booksData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllBooks returns the list of all books.\n")
	b.WriteString("func GetAllBooks() []Book {\n")
	b.WriteString("\tif len(booksData.Books) == 0 {\n")
	b.WriteString("\t\treturn []Book{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn booksData.Books[0].Book\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetBookByID returns the book with the given ID, or nil if not found.\n")
	b.WriteString("func GetBookByID(id string) *Book {\n")
	b.WriteString("\tbooks := GetAllBooks()\n")
	b.WriteString("\tfor i := range books {\n")
	b.WriteString("\t\tif books[i].ID == id {\n")
	b.WriteString("\t\t\treturn &books[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetBookByCode returns the book with the given code, or nil if not found.\n")
	b.WriteString("func GetBookByCode(code string) *Book {\n")
	b.WriteString("\tbooks := GetAllBooks()\n")
	b.WriteString("\tfor i := range books {\n")
	b.WriteString("\t\tif books[i].Code == code {\n")
	b.WriteString("\t\t\treturn &books[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

func escapeString(s string) string {
	// Escape backticks and other special characters that might break Go string literals
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "\"", "\\\"")
	s = strings.ReplaceAll(s, "\n", "\\n")
	s = strings.ReplaceAll(s, "\r", "\\r")
	s = strings.ReplaceAll(s, "\t", "\\t")
	return s
}

