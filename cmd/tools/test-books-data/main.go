package main

import (
	"fmt"
	"shadowmaster/pkg/shadowrun/edition/v5"
)

func main() {
	// Test getting the data (now embedded in code)
	data := v5.GetBooksData()
	if data == nil {
		fmt.Printf("Error: data is nil\n")
		return
	}

	fmt.Printf("✓ Successfully loaded books data\n")
	if data.Version != nil {
		fmt.Printf("Version: %s\n", *data.Version)
	}

	allBooks := v5.GetAllBooks()
	fmt.Printf("Total Books: %d\n\n", len(allBooks))

	// Test helper functions
	fmt.Printf("GetAllBooks() returned %d books\n", len(allBooks))

	// Test GetBookByID
	if len(allBooks) > 0 {
		firstBook := allBooks[0]
		found := v5.GetBookByID(firstBook.ID)
		if found != nil {
			fmt.Printf("✓ GetBookByID found: %s (Code: %s)\n", found.Name, found.Code)
		}
	}

	// Test GetBookByCode
	sr5Book := v5.GetBookByCode("SR5")
	if sr5Book != nil {
		fmt.Printf("✓ GetBookByCode(\"SR5\") found: %s\n", sr5Book.Name)
		if sr5Book.Matches != nil {
			fmt.Printf("  Matches: %d language(s)\n", len(sr5Book.Matches.Match))
			for _, match := range sr5Book.Matches.Match {
				fmt.Printf("    - %s: page %d\n", match.Language, match.Page)
			}
		}
	}

	// Show a few sample books
	fmt.Printf("\n=== Sample Books (first 5) ===\n")
	max := 5
	if len(allBooks) < max {
		max = len(allBooks)
	}
	for i := 0; i < max; i++ {
		book := allBooks[i]
		fmt.Printf("\n%d. %s (Code: %s)\n", i+1, book.Name, book.Code)
		if book.Matches != nil {
			fmt.Printf("   Matches: %d language(s)\n", len(book.Matches.Match))
		}
		if book.Permanent != nil {
			fmt.Printf("   Permanent: true\n")
		}
	}
}

