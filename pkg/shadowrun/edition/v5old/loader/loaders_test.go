package loader

import (
	"os"
	"path/filepath"
	"testing"
)

const testDataDir = "../../../../data/chummerxml"

func TestLoadContacts(t *testing.T) {
	filePath := filepath.Join(testDataDir, "contacts.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadContactsFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load contacts.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}

	// Basic validation
	if len(data.Contacts.Contact) == 0 {
		t.Error("No contacts found in file")
	}

	if len(data.Genders.Gender) == 0 {
		t.Error("No genders found in file")
	}

	if len(data.PersonalLives.PersonalLife) == 0 {
		t.Error("No personal lives found in file")
	}
}

func TestLoadActions(t *testing.T) {
	filePath := filepath.Join(testDataDir, "actions.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadActionsFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load actions.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}

	if len(data.Actions.Action) == 0 {
		t.Error("No actions found in file")
	}
}

func TestLoadBooks(t *testing.T) {
	filePath := filepath.Join(testDataDir, "books.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadBooksFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load books.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}

	if len(data.Books) == 0 {
		t.Error("No books found in file")
	}
}

func TestLoadStrings(t *testing.T) {
	filePath := filepath.Join(testDataDir, "strings.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadStringsFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load strings.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}
}

func TestLoadSheets(t *testing.T) {
	filePath := filepath.Join(testDataDir, "sheets.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadSheetsFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load sheets.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}

	if len(data.Sheets) == 0 {
		t.Error("No sheets found in file")
	}
}

func TestLoadArmor(t *testing.T) {
	filePath := filepath.Join(testDataDir, "armor.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadArmorFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load armor.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}
}

func TestLoadGear(t *testing.T) {
	filePath := filepath.Join(testDataDir, "gear.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Skipf("Test file not found: %s", filePath)
	}

	data, err := LoadGearFromXML(filePath)
	if err != nil {
		t.Fatalf("Failed to load gear.xml: %v", err)
	}

	if data == nil {
		t.Fatal("Loaded data is nil")
	}
}

