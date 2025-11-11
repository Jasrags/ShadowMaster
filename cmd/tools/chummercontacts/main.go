package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type chummerContactsFile struct {
	Contacts struct {
		Contact []interface{} `json:"contact"`
	} `json:"contacts"`
	Genders struct {
		Gender []string `json:"gender"`
	} `json:"genders"`
	Ages struct {
		Age []string `json:"age"`
	} `json:"ages"`
	PersonalLives struct {
		PersonalLife []string `json:"personallife"`
	} `json:"personallives"`
	Types struct {
		Type []string `json:"type"`
	} `json:"types"`
	PreferredPayments struct {
		PreferredPayment []string `json:"preferredpayment"`
	} `json:"preferredpayments"`
	HobbiesVices struct {
		HobbyVice []string `json:"hobbyvice"`
	} `json:"hobbiesvices"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedContact struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Output struct {
	Metadata struct {
		Source                SourceMetadata `json:"source"`
		GeneratedBy           string         `json:"generated_by"`
		ContactCount          int            `json:"contact_count"`
		GenderCount           int            `json:"gender_count"`
		AgeCount              int            `json:"age_count"`
		PersonalLifeCount     int            `json:"personal_life_count"`
		TypeCount             int            `json:"type_count"`
		PreferredPaymentCount int            `json:"preferred_payment_count"`
		HobbyViceCount        int            `json:"hobby_vice_count"`
	} `json:"metadata"`
	Contacts          []NormalizedContact `json:"contacts"`
	Genders           []string            `json:"genders"`
	Ages              []string            `json:"ages"`
	PersonalLives     []string            `json:"personal_lives"`
	Types             []string            `json:"types"`
	PreferredPayments []string            `json:"preferred_payments"`
	HobbiesVices      []string            `json:"hobbies_vices"`
}

const (
	inputPath  = "data/chummer/contacts.json"
	outputPath = "data/editions/sr5/contacts/all.json"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	raw, err := os.ReadFile(inputPath)
	if err != nil {
		return fmt.Errorf("read input: %w", err)
	}

	var parsed chummerContactsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Contacts.Contact) == 0 {
		return errors.New("no contacts found")
	}

	contacts := normalizeContacts(parsed.Contacts.Contact)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Contacts Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(contacts),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummercontacts (ShadowMaster)"
	output.Metadata.ContactCount = len(contacts)
	output.Metadata.GenderCount = len(parsed.Genders.Gender)
	output.Metadata.AgeCount = len(parsed.Ages.Age)
	output.Metadata.PersonalLifeCount = len(parsed.PersonalLives.PersonalLife)
	output.Metadata.TypeCount = len(parsed.Types.Type)
	output.Metadata.PreferredPaymentCount = len(parsed.PreferredPayments.PreferredPayment)
	output.Metadata.HobbyViceCount = len(parsed.HobbiesVices.HobbyVice)

	output.Contacts = contacts
	output.Genders = copyStrings(parsed.Genders.Gender)
	output.Ages = copyStrings(parsed.Ages.Age)
	output.PersonalLives = copyStrings(parsed.PersonalLives.PersonalLife)
	output.Types = copyStrings(parsed.Types.Type)
	output.PreferredPayments = copyStrings(parsed.PreferredPayments.PreferredPayment)
	output.HobbiesVices = copyStrings(parsed.HobbiesVices.HobbyVice)

	data, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		return fmt.Errorf("encode output: %w", err)
	}

	if err := ensureDir(filepath.Dir(outputPath)); err != nil {
		return err
	}

	if err := os.WriteFile(outputPath, data, 0o644); err != nil {
		return fmt.Errorf("write output: %w", err)
	}

	fmt.Printf("Normalized %d contacts into %s\n", len(contacts), outputPath)
	return nil
}

func normalizeContacts(raw []interface{}) []NormalizedContact {
	var contacts []NormalizedContact
	for _, entry := range raw {
		switch v := entry.(type) {
		case string:
			name := strings.TrimSpace(v)
			if name == "" {
				continue
			}
			slug := makeSlug(name)
			contacts = append(contacts, NormalizedContact{
				ID:   slug,
				Name: name,
				Slug: slug,
			})
		case map[string]interface{}:
			name := valueToString(v["name"])
			if name == "" {
				name = "Unnamed Contact"
			}
			id := valueToString(v["id"])
			if id == "" {
				id = makeSlug(name)
			}
			contacts = append(contacts, NormalizedContact{
				ID:   id,
				Name: name,
				Slug: makeSlug(name),
			})
		}
	}

	sort.Slice(contacts, func(i, j int) bool {
		return contacts[i].Name < contacts[j].Name
	})

	return contacts
}

func copyStrings(input []string) []string {
	if len(input) == 0 {
		return nil
	}
	out := make([]string, len(input))
	for i, val := range input {
		out[i] = strings.TrimSpace(val)
	}
	return out
}

func valueToString(val interface{}) string {
	switch v := val.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(v)
	case float64:
		if float64(int64(v)) == v {
			return fmt.Sprintf("%d", int64(v))
		}
		return fmt.Sprintf("%f", v)
	default:
		b, err := json.Marshal(v)
		if err != nil {
			return fmt.Sprintf("%v", v)
		}
		return string(b)
	}
}

func makeSlug(parts ...string) string {
	combined := strings.Join(parts, "-")
	combined = strings.ToLower(combined)
	var b strings.Builder
	lastDash := false
	for _, r := range combined {
		switch {
		case r >= 'a' && r <= 'z':
			b.WriteRune(r)
			lastDash = false
		case r >= '0' && r <= '9':
			b.WriteRune(r)
			lastDash = false
		default:
			if !lastDash {
				b.WriteRune('-')
				lastDash = true
			}
		}
	}
	slug := strings.Trim(b.String(), "-")
	if slug == "" {
		return "item"
	}
	return slug
}

func ensureDir(path string) error {
	if path == "" || path == "." {
		return nil
	}
	if err := os.MkdirAll(path, 0o755); err != nil {
		if !errors.Is(err, fs.ErrExist) {
			return fmt.Errorf("mkdir %s: %w", path, err)
		}
	}
	return nil
}
