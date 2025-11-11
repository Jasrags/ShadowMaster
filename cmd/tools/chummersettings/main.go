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

type chummerSettingsFile struct {
	Settings struct {
		Setting []map[string]interface{} `json:"setting"`
	} `json:"settings"`
}

type SourceMetadata struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	ExtractedAt string `json:"extracted_at"`
	RecordCount int    `json:"record_count"`
}

type NormalizedSetting struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Slug          string            `json:"slug"`
	BuildMethod   string            `json:"build_method,omitempty"`
	BuildPoints   string            `json:"build_points,omitempty"`
	PriorityTable string            `json:"priority_table,omitempty"`
	SumToTen      string            `json:"sum_to_ten,omitempty"`
	NuyenMaxBP    string            `json:"nuyen_max_bp,omitempty"`
	Availability  string            `json:"availability,omitempty"`
	KarmaLimits   map[string]string `json:"karma_limits,omitempty"`
	Books         []string          `json:"books,omitempty"`
	Flags         map[string]string `json:"flags,omitempty"`
	Expressions   map[string]string `json:"expressions,omitempty"`
	Attributes    map[string]string `json:"attributes,omitempty"`
}

type Output struct {
	Metadata struct {
		Source       SourceMetadata `json:"source"`
		GeneratedBy  string         `json:"generated_by"`
		SettingCount int            `json:"setting_count"`
	} `json:"metadata"`
	Settings []NormalizedSetting `json:"settings"`
}

const (
	inputPath  = "data/chummer/settings.json"
	outputPath = "data/editions/sr5/settings/all.json"
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

	var parsed chummerSettingsFile
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}

	if len(parsed.Settings.Setting) == 0 {
		return errors.New("no settings found")
	}

	settings := normalizeSettings(parsed.Settings.Setting)

	var output Output
	output.Metadata.Source = SourceMetadata{
		Name:        "Chummer5 Settings Dataset",
		Version:     "unknown",
		ExtractedAt: time.Now().UTC().Format(time.RFC3339),
		RecordCount: len(settings),
	}
	output.Metadata.GeneratedBy = "cmd/tools/chummersettings (ShadowMaster)"
	output.Metadata.SettingCount = len(settings)
	output.Settings = settings

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

	fmt.Printf("Normalized %d settings into %s\n", len(settings), outputPath)
	return nil
}

func normalizeSettings(raw []map[string]interface{}) []NormalizedSetting {
	settings := make([]NormalizedSetting, 0, len(raw))
	for _, entry := range raw {
		setting := NormalizedSetting{
			Flags:       make(map[string]string),
			Expressions: make(map[string]string),
			Attributes:  make(map[string]string),
		}
		for key, val := range entry {
			switch strings.ToLower(key) {
			case "id":
				setting.ID = valueToString(val)
			case "name":
				setting.Name = valueToString(val)
			case "buildmethod":
				setting.BuildMethod = valueToString(val)
			case "buildpoints":
				setting.BuildPoints = valueToString(val)
			case "prioritytable":
				setting.PriorityTable = valueToString(val)
			case "sumtoten":
				setting.SumToTen = valueToString(val)
			case "nuyenmaxbp":
				setting.NuyenMaxBP = valueToString(val)
			case "availability":
				setting.Availability = valueToString(val)
			case "qualitykarmalimit":
				if setting.KarmaLimits == nil {
					setting.KarmaLimits = make(map[string]string)
				}
				setting.KarmaLimits["qualities"] = valueToString(val)
			case "books":
				setting.Books = extractBooks(val)
			case "contactpointsexpression", "knowledgepointsexpression", "chargenkarmatonuyenexpression", "boundspiritexpression", "compiledspiritexpression":
				setting.Expressions[key] = valueToString(val)
			case "karmacost":
				setting.Expressions[key] = serializeValue(val)
			default:
				if isBooleanField(key) {
					setting.Flags[key] = strconvBool(val)
				} else if serialized := serializeValue(val); serialized != "" {
					setting.Attributes[key] = serialized
				}
			}
		}
		if setting.ID == "" {
			setting.ID = makeSlug(setting.Name)
		}
		if setting.Name == "" {
			setting.Name = "Unnamed Setting"
		}
		setting.Slug = makeSlug(setting.Name)
		if len(setting.Flags) == 0 {
			setting.Flags = nil
		}
		if len(setting.Expressions) == 0 {
			setting.Expressions = nil
		}
		if len(setting.Attributes) == 0 {
			setting.Attributes = nil
		}
		settings = append(settings, setting)
	}

	sort.Slice(settings, func(i, j int) bool {
		return settings[i].Name < settings[j].Name
	})
	return settings
}

func extractBooks(value interface{}) []string {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]interface{}:
		if book, ok := v["book"]; ok {
			return extractBooks(book)
		}
	case []interface{}:
		books := make([]string, 0, len(v))
		for _, item := range v {
			books = append(books, extractBooks(item)...)
		}
		return books
	case string:
		if v != "" {
			return []string{v}
		}
	}
	return nil
}

func isBooleanField(key string) bool {
	booleanKeys := map[string]struct{}{
		"licenserestricted":                         {},
		"morelethalgameplay":                        {},
		"spiritforcebasedontotalmag":                {},
		"unarmedimprovementsapplytoweapons":         {},
		"allowinitiationincreatemode":               {},
		"usepointsonbrokengroups":                   {},
		"dontdoublequalities":                       {},
		"dontdoublequalityrefunds":                  {},
		"ignoreart":                                 {},
		"cyberlegmovement":                          {},
		"allow2ndmaxattribute":                      {},
		"dronearmormultiplierenabled":               {},
		"nosinglearmorencumbrance":                  {},
		"ignorecomplexformlimit":                    {},
		"noarmorencumbrance":                        {},
		"uncappedarmoraccessorybonuses":             {},
		"esslossreducesmaximumonly":                 {},
		"allowskillregrouping":                      {},
		"metatypecostskarma":                        {},
		"allowcyberwareessdiscounts":                {},
		"maximumarmormodifications":                 {},
		"armordegredation":                          {},
		"specialkarmacostbasedonshownvalue":         {},
		"exceedpositivequalities":                   {},
		"exceedpositivequalitiescostdoubled":        {},
		"mysaddppcareer":                            {},
		"mysadeptsecondmagattribute":                {},
		"exceednegativequalities":                   {},
		"exceednegativequalitiesnobonus":            {},
		"multiplyrestrictedcost":                    {},
		"multiplyforbiddencost":                     {},
		"donotroundessenceinternally":               {},
		"enableenemytracking":                       {},
		"enemykarmaqualitylimit":                    {},
		"enforcecapacity":                           {},
		"restrictrecoil":                            {},
		"unrestrictednuyen":                         {},
		"allowhigherstackedfoci":                    {},
		"alloweditpartofbaseweapon":                 {},
		"breakskillgroupsincreatemode":              {},
		"allowpointbuyspecializationsonkarmaskills": {},
		"extendanydetectionspell":                   {},
		"allowskilldicerolling":                     {},
		"dontusecyberlimbcalculation":               {},
		"alternatemetatypeattributekarma":           {},
		"reverseattributepriorityorder":             {},
		"allowobsolescentupgrade":                   {},
		"allowbiowaresuites":                        {},
		"freespiritpowerpointsmag":                  {},
		"compensateskillgroupkarmadifference":       {},
		"autobackstory":                             {},
		"freemartialartspecialization":              {},
		"priorityspellsasadeptpowers":               {},
		"usecalculatedpublicawareness":              {},
		"increasedimprovedabilitymodifier":          {},
		"allowfreegrids":                            {},
		"allowtechnomancerschooling":                {},
		"unclampattributeminimum":                   {},
		"dronemods":                                 {},
		"dronemodsmaximumpilot":                     {},
	}
	_, ok := booleanKeys[strings.ToLower(key)]
	return ok
}

func strconvBool(value interface{}) string {
	if parseBool(value) {
		return "true"
	}
	return "false"
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
