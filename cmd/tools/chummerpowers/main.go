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

type chummerPowersFile struct {
	Powers struct {
		Power []map[string]interface{} `json:"power"`
	} `json:"powers"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedPower struct {
	ID               string            `json:"id"`
	Name             string            `json:"name"`
	Slug             string            `json:"slug"`
	PowerPoints      string            `json:"power_points,omitempty"`
	Levels           bool              `json:"levels"`
	MaxLevels        string            `json:"max_levels,omitempty"`
	Action           string            `json:"action,omitempty"`
	Source           string            `json:"source,omitempty"`
	Page             string            `json:"page,omitempty"`
	AdeptWayCost     string            `json:"adept_way_cost,omitempty"`
	AdeptWayRequires map[string]string `json:"adept_way_requires,omitempty"`
	Bonus            map[string]string `json:"bonus,omitempty"`
	Attributes       map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		PowerCount  int            `json:"power_count"`
	} `json:"metadata"`
	Powers []NormalizedPower `json:"powers"`
}

const (
	inputPath  = "data/chummer/powers.json"
	outputPath = "data/editions/sr5/powers/all.json"
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

	var parsed chummerPowersFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Powers.Power) == 0 {
		return errors.New("no powers found")
	}

	powers := normalizePowers(parsed.Powers.Power)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Adept Powers Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(powers),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerpowers (ShadowMaster)"
	output.Metadata.PowerCount = len(powers)
	output.Powers = powers

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

	fmt.Printf("Normalized %d powers into %s\n", len(powers), outputPath)
	return nil
}

func normalizePowers(raw []map[string]interface{}) []NormalizedPower {
	powers := make([]NormalizedPower, 0, len(raw))
	for _, entry := range raw {
		power := NormalizedPower{
			AdeptWayRequires: make(map[string]string),
			Bonus:            make(map[string]string),
			Attributes:       make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				power.ID = valueToString(val)
			case "name":
				power.Name = valueToString(val)
			case "points":
				power.PowerPoints = valueToString(val)
			case "levels":
				power.Levels = parseBool(val)
			case "limit":
				power.MaxLevels = valueToString(val)
			case "action":
				power.Action = valueToString(val)
			case "source":
				power.Source = valueToString(val)
			case "page":
				power.Page = valueToString(val)
			case "adeptway":
				power.AdeptWayCost = valueToString(val)
			case "adeptwayrequires":
				if serialized := serializeValue(val); serialized != "" {
					power.AdeptWayRequires["raw"] = serialized
				}
			case "bonus":
				if serialized := serializeValue(val); serialized != "" {
					power.Bonus["raw"] = serialized
				}
			default:
				if serialized := serializeValue(val); serialized != "" {
					power.Attributes[key] = serialized
				}
			}
		}
		if power.ID == "" {
			power.ID = makeSlug(power.Name)
		}
		if power.Name == "" {
			power.Name = "Unnamed Power"
		}
		power.Slug = makeSlug(power.Name)
		if len(power.AdeptWayRequires) == 0 {
			power.AdeptWayRequires = nil
		}
		if len(power.Bonus) == 0 {
			power.Bonus = nil
		}
		if len(power.Attributes) == 0 {
			power.Attributes = nil
		}
		powers = append(powers, power)
	}

	sort.Slice(powers, func(i, j int) bool {
		return powers[i].Name < powers[j].Name
	})
	return powers
}

func parseBool(value interface{}) bool {
	switch v := value.(type) {
	case bool:
		return v
	case string:
		lower := strings.ToLower(strings.TrimSpace(v))
		return lower == "true" || lower == "1" || lower == "yes"
	case float64:
		return v != 0
	}
	return false
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
