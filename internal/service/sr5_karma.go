package service

import (
	"fmt"
	"strings"

	"shadowmaster/internal/domain"
)

// KarmaLedgerEntry represents a single karma expenditure in point-buy.
type KarmaLedgerEntry struct {
	Category string `json:"category"`
	Key      string `json:"key,omitempty"`
	Karma    int    `json:"karma"`
}

// KarmaPointBuySelection captures the data required to validate SR5 karma point-buy characters.
type KarmaPointBuySelection struct {
	MetatypeID string                       `json:"metatype_id"`
	Attributes map[string]int               `json:"attributes,omitempty"`
	Entries    []KarmaLedgerEntry           `json:"entries"`
	Notes      map[string]string            `json:"notes,omitempty"`
	Metadata   map[string]map[string]int    `json:"metadata,omitempty"`
	Tags       map[string]map[string]string `json:"tags,omitempty"`
}

var physicalAttributes = map[string]struct{}{
	"body":     {},
	"agility":  {},
	"reaction": {},
	"strength": {},
}

var mentalAttributes = map[string]struct{}{
	"willpower": {},
	"logic":     {},
	"intuition": {},
	"charisma":  {},
}

func normalizeAttributeKey(key string) string {
	return strings.ToLower(strings.TrimSpace(key))
}

// ValidateKarmaPointBuySelection ensures a karma point-buy selection respects edition metadata and budget rules.
func ValidateKarmaPointBuySelection(data *domain.CharacterCreationData, selection KarmaPointBuySelection) error {
	if data == nil {
		return fmt.Errorf("%w: character creation data is required", ErrKarmaInvalidSelection)
	}

	method, ok := data.CreationMethods["karma"]
	if !ok {
		return ErrCreationMethodUnsupported
	}

	budget := method.KarmaBudget
	if budget <= 0 {
		return fmt.Errorf("%w: invalid karma budget", ErrKarmaInvalidSelection)
	}

	if selection.MetatypeID == "" {
		return fmt.Errorf("%w: metatype selection is required", ErrKarmaInvalidSelection)
	}

	metatypeCost, ok := method.MetatypeCosts[strings.ToLower(selection.MetatypeID)]
	if !ok {
		return ErrKarmaUnknownMetatype
	}

	totalSpent := metatypeCost
	gearSpent := 0

	for _, entry := range selection.Entries {
		if entry.Karma <= 0 {
			return ErrKarmaNegativeExpenditure
		}
		totalSpent += entry.Karma

		if strings.EqualFold(entry.Category, "gear") {
			gearSpent += entry.Karma
		}
	}

	if limit := method.GearConversion; limit != nil && limit.MaxKarmaForGear > 0 && gearSpent > limit.MaxKarmaForGear {
		return ErrKarmaExceedsGearBudget
	}

	if totalSpent != budget {
		return fmt.Errorf("%w: spent %d of %d", ErrKarmaBudgetMismatch, totalSpent, budget)
	}

	if len(selection.Attributes) > 0 {
		if err := validateKarmaAttributeCaps(data, selection); err != nil {
			return err
		}
	}

	return nil
}

func validateKarmaAttributeCaps(data *domain.CharacterCreationData, selection KarmaPointBuySelection) error {
	var metatypeDef *domain.MetatypeDefinition
	for idx, def := range data.Metatypes {
		if strings.EqualFold(def.ID, selection.MetatypeID) {
			metatypeDef = &data.Metatypes[idx]
			break
		}
	}
	if metatypeDef == nil {
		return ErrKarmaUnknownMetatype
	}

	ranges := metatypeDef.AttributeRanges
	if len(ranges) == 0 {
		return nil
	}

	physicalMaxed := 0
	mentalMaxed := 0

	for attrRaw, value := range selection.Attributes {
		attr := normalizeAttributeKey(attrRaw)
		rangeDef, ok := ranges[attr]
		if !ok {
			continue
		}
		if value >= rangeDef.Max {
			if _, ok := physicalAttributes[attr]; ok {
				physicalMaxed++
			} else if _, ok := mentalAttributes[attr]; ok {
				mentalMaxed++
			}
		}
	}

	if physicalMaxed > 1 || mentalMaxed > 1 {
		return ErrKarmaAttributeMaxLimit
	}

	return nil
}
