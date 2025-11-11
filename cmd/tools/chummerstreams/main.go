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

type chummerStreamsFile struct {
	Traditions struct {
		Tradition map[string]interface{} `json:"tradition"`
	} `json:"traditions"`
	Spirits struct {
		Spirit []map[string]interface{} `json:"spirit"`
	} `json:"spirits"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type StreamTradition struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Slug    string   `json:"slug"`
	Drain   string   `json:"drain"`
	Spirits []string `json:"spirits"`
	Source  string   `json:"source,omitempty"`
	Page    string   `json:"page,omitempty"`
}

type StreamSprite struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Slug        string            `json:"slug"`
	Source      string            `json:"source,omitempty"`
	Page        string            `json:"page,omitempty"`
	Attributes  map[string]string `json:"attributes,omitempty"`
	Initiatives string            `json:"initiative,omitempty"`
	Powers      []string          `json:"powers,omitempty"`
	Skills      []string          `json:"skills,omitempty"`
}

type Output struct {
	Metadata struct {
		Source         SourceMetadata `json:"source"`
		GeneratedBy    string         `json:"generated_by"`
		TraditionCount int            `json:"tradition_count"`
		SpriteCount    int            `json:"sprite_count"`
	} `json:"metadata"`
	Traditions []StreamTradition `json:"traditions"`
	Sprites    []StreamSprite    `json:"sprites"`
}

const (
	inputPath  = "data/chummer/streams.json"
	outputPath = "data/editions/sr5/streams/all.json"
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

	var parsed chummerStreamsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	traditions := normalizeTraditions(parsed.Traditions.Tradition)
	sprites := normalizeSprites(parsed.Spirits.Spirit)

	if len(traditions) == 0 && len(sprites) == 0 {
		return errors.New("no streams data found")
	}

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Streams Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(traditions) + len(sprites),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerstreams (ShadowMaster)"
	output.Metadata.TraditionCount = len(traditions)
	output.Metadata.SpriteCount = len(sprites)
	output.Traditions = traditions
	output.Sprites = sprites

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

	fmt.Printf("Normalized %d traditions and %d sprites into %s\n", len(traditions), len(sprites), outputPath)
	return nil
}

func normalizeTraditions(raw map[string]interface{}) []StreamTradition {
	if len(raw) == 0 {
		return nil
	}
	tradition := StreamTradition{
		Spirits: make([]string, 0),
	}
	for key, val := range raw {
		switch key {
		case "id":
			tradition.ID = valueToString(val)
		case "name":
			tradition.Name = valueToString(val)
		case "drain":
			tradition.Drain = valueToString(val)
		case "source":
			tradition.Source = valueToString(val)
		case "page":
			tradition.Page = valueToString(val)
		case "spirits":
			tradition.Spirits = extractStringList(val, "spirit")
		}
	}
	if tradition.ID == "" {
		tradition.ID = makeSlug(tradition.Name)
	}
	if tradition.Name == "" {
		tradition.Name = "Default"
	}
	tradition.Slug = makeSlug(tradition.Name)
	sort.Strings(tradition.Spirits)
	return []StreamTradition{tradition}
}

func normalizeSprites(raw []map[string]interface{}) []StreamSprite {
	sprites := make([]StreamSprite, 0, len(raw))
	for _, entry := range raw {
		sprite := StreamSprite{
			Attributes: make(map[string]string),
		}
		for key, val := range entry {
			switch key {
			case "id":
				sprite.ID = valueToString(val)
			case "name":
				sprite.Name = valueToString(val)
			case "source":
				sprite.Source = valueToString(val)
			case "page":
				sprite.Page = valueToString(val)
			case "ini":
				sprite.Initiatives = valueToString(val)
			case "powers":
				sprite.Powers = extractStringList(val, "power")
			case "skills":
				sprite.Skills = extractStringList(val, "skill")
			default:
				if serialized := serializeValue(val); serialized != "" {
					sprite.Attributes[key] = serialized
				}
			}
		}
		if sprite.Name == "" {
			sprite.Name = "Unnamed Sprite"
		}
		sprite.Slug = makeSlug(sprite.Name)
		if len(sprite.Attributes) == 0 {
			sprite.Attributes = nil
		}
		sprites = append(sprites, sprite)
	}

	sort.Slice(sprites, func(i, j int) bool {
		return sprites[i].Name < sprites[j].Name
	})
	return sprites
}

func extractStringList(value interface{}, key string) []string {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if key != "" {
			if raw, ok := v[key]; ok {
				return extractStringList(raw, "")
			}
		}
		var list []string
		for _, val := range v {
			list = append(list, extractStringList(val, "")...)
		}
		return list
	case []interface{}:
		list := make([]string, 0, len(v))
		for _, item := range v {
			list = append(list, extractStringList(item, "")...)
		}
		return list
	case string:
		if v == "" {
			return nil
		}
		return []string{v}
	}
	return nil
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
