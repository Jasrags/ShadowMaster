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

type chummerLifeModulesFile struct {
	Stages struct {
		Stage []map[string]interface{} `json:"stage"`
	} `json:"stages"`
	Modules struct {
		Module []map[string]interface{} `json:"module"`
	} `json:"modules"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedStage struct {
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Order string `json:"order,omitempty"`
}

type NormalizedModuleVersion struct {
	ID    string            `json:"id"`
	Name  string            `json:"name"`
	Story string            `json:"story,omitempty"`
	Bonus map[string]string `json:"bonus,omitempty"`
}

type NormalizedModule struct {
	ID        string                    `json:"id"`
	Stage     string                    `json:"stage"`
	StageSlug string                    `json:"stage_slug"`
	Category  string                    `json:"category,omitempty"`
	Name      string                    `json:"name"`
	Karma     string                    `json:"karma,omitempty"`
	Bonus     map[string]string         `json:"bonus,omitempty"`
	Versions  []NormalizedModuleVersion `json:"versions,omitempty"`
}

type Output struct {
	Metadata struct {
		Source      SourceMetadata `json:"source"`
		GeneratedBy string         `json:"generated_by"`
		StageCount  int            `json:"stage_count"`
		ModuleCount int            `json:"module_count"`
	} `json:"metadata"`
	Stages  []NormalizedStage  `json:"stages"`
	Modules []NormalizedModule `json:"modules"`
}

const (
	inputPath  = "data/chummer/lifemodules.json"
	outputPath = "data/editions/sr5/lifemodules/all.json"
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

	var parsed chummerLifeModulesFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Modules.Module) == 0 {
		return errors.New("no life modules found")
	}

	stages := normalizeStages(parsed.Stages.Stage)
	modules := normalizeModules(parsed.Modules.Module)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Life Modules Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(modules),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummerlifemodules (ShadowMaster)"
	output.Metadata.StageCount = len(stages)
	output.Metadata.ModuleCount = len(modules)
	output.Stages = stages
	output.Modules = modules

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

	fmt.Printf("Normalized %d life modules into %s\n", len(modules), outputPath)
	return nil
}

func normalizeStages(raw []map[string]interface{}) []NormalizedStage {
	if len(raw) == 0 {
		return nil
	}
	stages := make([]NormalizedStage, 0, len(raw))
	for _, entry := range raw {
		name := valueToString(entry["+content"])
		if name == "" {
			continue
		}
		stages = append(stages, NormalizedStage{
			Name:  name,
			Slug:  makeSlug(name),
			Order: valueToString(entry["+@order"]),
		})
	}
	sort.Slice(stages, func(i, j int) bool {
		return stages[i].Order < stages[j].Order
	})
	return stages
}

func normalizeModules(raw []map[string]interface{}) []NormalizedModule {
	var modules []NormalizedModule
	for _, entry := range raw {
		module := NormalizedModule{
			Bonus: make(map[string]string),
		}
		for key, value := range entry {
			switch key {
			case "id":
				module.ID = valueToString(value)
			case "stage":
				module.Stage = valueToString(value)
			case "category":
				module.Category = valueToString(value)
			case "name":
				module.Name = valueToString(value)
			case "karma":
				module.Karma = valueToString(value)
			case "bonus":
				if serialized := serializeValue(value); serialized != "" {
					module.Bonus["raw"] = serialized
				}
			case "versions":
				module.Versions = normalizeModuleVersions(value)
			default:
				if serialized := serializeValue(value); serialized != "" {
					module.Bonus[key] = serialized
				}
			}
		}
		if module.StageSlug == "" && module.Stage != "" {
			module.StageSlug = makeSlug(module.Stage)
		}

		if len(module.Bonus) == 0 {
			module.Bonus = nil
		}
		if len(module.Versions) == 0 {
			module.Versions = nil
		}
		if module.ID == "" {
			module.ID = makeSlug(module.Stage, module.Name)
		}
		if module.Name == "" {
			module.Name = "Unnamed Module"
		}
		modules = append(modules, module)
	}

	sort.Slice(modules, func(i, j int) bool {
		if modules[i].Stage == modules[j].Stage {
			return modules[i].Name < modules[j].Name
		}
		return modules[i].Stage < modules[j].Stage
	})
	return modules
}

func normalizeModuleVersions(value interface{}) []NormalizedModuleVersion {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if raw, ok := v["version"]; ok {
			return normalizeModuleVersions(raw)
		}
	case []interface{}:
		var versions []NormalizedModuleVersion
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				version := NormalizedModuleVersion{
					Bonus: make(map[string]string),
				}
				for key, val := range m {
					switch key {
					case "id":
						version.ID = valueToString(val)
					case "name":
						version.Name = valueToString(val)
					case "story":
						version.Story = valueToString(val)
					case "bonus":
						if serialized := serializeValue(val); serialized != "" {
							version.Bonus["raw"] = serialized
						}
					default:
						if serialized := serializeValue(val); serialized != "" {
							version.Bonus[key] = serialized
						}
					}
				}
				if len(version.Bonus) == 0 {
					version.Bonus = nil
				}
				if version.ID == "" {
					version.ID = makeSlug(version.Name)
				}
				if version.Name == "" {
					version.Name = "Unnamed Version"
				}
				versions = append(versions, version)
			}
		}
		return versions
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
