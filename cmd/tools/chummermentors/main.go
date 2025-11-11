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

type chummerMentorsFile struct {
	Mentors struct {
		Mentor []map[string]interface{} `json:"mentor"`
	} `json:"mentors"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedMentorChoice struct {
	Name       string            `json:"name"`
	Set        string            `json:"set,omitempty"`
	Bonus      map[string]string `json:"bonus,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
}

type NormalizedMentor struct {
	ID           string                   `json:"id"`
	Name         string                   `json:"name"`
	Slug         string                   `json:"slug"`
	Advantage    string                   `json:"advantage,omitempty"`
	Disadvantage string                   `json:"disadvantage,omitempty"`
	Source       string                   `json:"source,omitempty"`
	Page         string                   `json:"page,omitempty"`
	Bonus        map[string]string        `json:"bonus,omitempty"`
	Choices      []NormalizedMentorChoice `json:"choices,omitempty"`
	Attributes   map[string]string        `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		MentorCount int            `json:"mentor_count"`
	} `json:"metadata"`
	Mentors []NormalizedMentor `json:"mentors"`
}

const (
	inputPath  = "data/chummer/mentors.json"
	outputPath = "data/editions/sr5/mentors/all.json"
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

	var parsed chummerMentorsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Mentors.Mentor) == 0 {
		return errors.New("no mentors found")
	}

	mentors := normalizeMentors(parsed.Mentors.Mentor)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Mentors Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(mentors),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummermentors (ShadowMaster)"
	output.Metadata.MentorCount = len(mentors)
	output.Mentors = mentors

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

	fmt.Printf("Normalized %d mentors into %s\n", len(mentors), outputPath)
	return nil
}

func normalizeMentors(raw []map[string]interface{}) []NormalizedMentor {
	mentors := make([]NormalizedMentor, 0, len(raw))
	for _, entry := range raw {
		mentor := NormalizedMentor{
			Bonus:      make(map[string]string),
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				mentor.ID = valueToString(val)
			case "name":
				mentor.Name = valueToString(val)
			case "advantage":
				mentor.Advantage = valueToString(val)
			case "disadvantage":
				mentor.Disadvantage = valueToString(val)
			case "source":
				mentor.Source = valueToString(val)
			case "page":
				mentor.Page = valueToString(val)
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					mentor.Bonus["raw"] = serialized
				}
			case "choices":
				mentor.Choices = normalizeMentorChoices(val)
			default:
				if serialized := serializeValue(val); serialized != "" {
					mentor.Attributes[key] = serialized
				}
			}
		}
		if mentor.ID == "" {
			mentor.ID = makeSlug(mentor.Name)
		}
		if mentor.Name == "" {
			mentor.Name = "Unnamed Mentor"
		}
		mentor.Slug = makeSlug(mentor.Name)
		if len(mentor.Bonus) == 0 {
			mentor.Bonus = nil
		}
		if len(mentor.Attributes) == 0 {
			mentor.Attributes = nil
		}
		if len(mentor.Choices) == 0 {
			mentor.Choices = nil
		}
		mentors = append(mentors, mentor)
	}

	sort.Slice(mentors, func(i, j int) bool {
		return mentors[i].Name < mentors[j].Name
	})
	return mentors
}

func normalizeMentorChoices(value interface{}) []NormalizedMentorChoice {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["choice"]; ok {
			return normalizeMentorChoices(raw)
		}
	case []interface{}:
		choices := make([]NormalizedMentorChoice, 0, len(v))
		for _, item := range v {
			if choice := parseMentorChoice(item); choice != nil {
				choices = append(choices, *choice)
			}
		}
		return choices
	default:
		if choice := parseMentorChoice(v); choice != nil {
			return []NormalizedMentorChoice{*choice}
		}
	}
	return nil
}

func parseMentorChoice(value interface{}) *NormalizedMentorChoice {
	entry, ok := value.(map[string]interface{})
	if !ok {
		return nil
	}
	choice := NormalizedMentorChoice{
		Bonus:      make(map[string]string),
		Attributes: make(map[string]string),
	}
	for key, val := range entry {
		switch key {
		case "name":
			choice.Name = valueToString(val)
		case "+@set":
			choice.Set = valueToString(val)
		case "bonus":
			if serialized := serializeValue(val); serialized != "" {
				choice.Bonus["raw"] = serialized
			}
		default:
			if serialized := serializeValue(val); serialized != "" {
				choice.Attributes[key] = serialized
			}
		}
	}
	if choice.Name == "" && len(choice.Attributes) == 0 && len(choice.Bonus) == 0 {
		return nil
	}
	if len(choice.Bonus) == 0 {
		choice.Bonus = nil
	}
	if len(choice.Attributes) == 0 {
		choice.Attributes = nil
	}
	return &choice
}

func serializeValue(value interface{}) string {
	switch value.(type) {
	case map[string]interface{}, []interface{}:
		data, err := json.Marshal(value)
		if err != nil {
			return ""
		}
		return string(data)
	default:
		return valueToString(value)
	}
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
		return strings.Trim(string(b), "\"")
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
