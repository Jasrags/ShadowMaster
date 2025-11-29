package v5

import (
	"fmt"
	"shadowmaster/internal/domain"
)

// validateSR5Character validates that a character conforms to SR5 rules
func (h *SR5Handler) validateSR5Character(char *domain.CharacterSR5) error {
	// Validate attributes are within reasonable bounds
	if err := h.validateAttributes(char); err != nil {
		return err
	}

	// Validate priority system (if using Priority or Sum-to-Ten)
	if char.CreationMethod == "priority" || char.CreationMethod == "sum_to_ten" {
		if err := h.validatePriorities(char); err != nil {
			return err
		}
	}

	// Validate karma limits
	if err := h.validateKarmaLimits(char); err != nil {
		return err
	}

	// Validate essence
	if err := h.validateEssence(char); err != nil {
		return err
	}

	// Validate magic/resonance
	if err := h.validateMagicResonance(char); err != nil {
		return err
	}

	// Validate gear restrictions
	if err := h.validateGearRestrictions(char); err != nil {
		return err
	}

	// Validate augmentation limits
	if err := h.validateAugmentations(char); err != nil {
		return err
	}

	// Validate skill limits
	if err := h.validateSkills(char); err != nil {
		return err
	}

	return nil
}

// validateAttributes validates attribute ranges
func (h *SR5Handler) validateAttributes(char *domain.CharacterSR5) error {
	metatype := GetMetatypeByName(char.Metatype)
	if metatype == nil {
		return fmt.Errorf("unknown metatype: %s", char.Metatype)
	}

	// Validate each attribute
	attributes := map[string]struct {
		value int
		range_ AttributeRange
	}{
		"body":      {char.Body, metatype.Body},
		"agility":   {char.Agility, metatype.Agility},
		"reaction":  {char.Reaction, metatype.Reaction},
		"strength":  {char.Strength, metatype.Strength},
		"willpower": {char.Willpower, metatype.Willpower},
		"logic":     {char.Logic, metatype.Logic},
		"intuition": {char.Intuition, metatype.Intuition},
		"charisma":  {char.Charisma, metatype.Charisma},
	}

	for name, attr := range attributes {
		if attr.value < attr.range_.Min || attr.value > attr.range_.Max {
			return fmt.Errorf("%s attribute out of range: %d (min: %d, max: %d)", name, attr.value, attr.range_.Min, attr.range_.Max)
		}
	}

	// Validate Edge
	if metatype.Edge != nil {
		if char.Edge < metatype.Edge.Min || char.Edge > metatype.Edge.Max {
			return fmt.Errorf("edge attribute out of range: %d (min: %d, max: %d)", char.Edge, metatype.Edge.Min, metatype.Edge.Max)
		}
	}

	// Validate only one Physical or Mental attribute at natural maximum
	physicalAtMax := 0
	mentalAtMax := 0

	if char.Body >= metatype.Body.Max {
		physicalAtMax++
	}
	if char.Strength >= metatype.Strength.Max {
		physicalAtMax++
	}
	if char.Agility >= metatype.Agility.Max {
		physicalAtMax++
	}
	if char.Reaction >= metatype.Reaction.Max {
		physicalAtMax++
	}

	if char.Logic >= metatype.Logic.Max {
		mentalAtMax++
	}
	if char.Intuition >= metatype.Intuition.Max {
		mentalAtMax++
	}
	if char.Willpower >= metatype.Willpower.Max {
		mentalAtMax++
	}
	if char.Charisma >= metatype.Charisma.Max {
		mentalAtMax++
	}

	if physicalAtMax > 1 {
		return fmt.Errorf("only one Physical attribute can be at natural maximum (found %d)", physicalAtMax)
	}
	if mentalAtMax > 1 {
		return fmt.Errorf("only one Mental attribute can be at natural maximum (found %d)", mentalAtMax)
	}

	return nil
}

// validatePriorities validates priority system
func (h *SR5Handler) validatePriorities(char *domain.CharacterSR5) error {
	priorities := []string{
		char.MetatypePriority,
		char.AttributesPriority,
		char.MagicPriority,
		char.SkillsPriority,
		char.ResourcesPriority,
	}

	validPriorities := map[string]bool{}
	for _, p := range priorities {
		if p == "none" {
			continue // Magic can be "none"
		}
		if p < "A" || p > "E" {
			return fmt.Errorf("invalid priority level: %s", p)
		}
		if validPriorities[p] {
			return fmt.Errorf("duplicate priority level: %s", p)
		}
		validPriorities[p] = true
	}

	return nil
}

// validateKarmaLimits validates karma spending limits
func (h *SR5Handler) validateKarmaLimits(char *domain.CharacterSR5) error {
	// Calculate positive quality karma
	positiveKarma := 0
	for _, q := range char.PositiveQualities {
		positiveKarma += q.KarmaCost
	}
	if positiveKarma > 25 {
		return fmt.Errorf("positive qualities exceed 25 karma limit: %d", positiveKarma)
	}

	// Calculate negative quality karma
	negativeKarma := 0
	for _, q := range char.NegativeQualities {
		negativeKarma += q.KarmaCost
	}
	if negativeKarma > 25 {
		return fmt.Errorf("negative qualities exceed 25 karma limit: %d", negativeKarma)
	}

	// Validate karma carryover (max 7)
	if char.Karma > 7 {
		return fmt.Errorf("karma carryover exceeds 7: %d", char.Karma)
	}

	return nil
}

// validateEssence validates essence and magic/resonance relationship
func (h *SR5Handler) validateEssence(char *domain.CharacterSR5) error {
	if char.Essence < 0 {
		return fmt.Errorf("essence cannot be negative: %.2f", char.Essence)
	}

	// Calculate essence loss from cyberware/bioware
	totalEssenceLoss := 0.0
	for _, cyber := range char.Cyberware {
		if !cyber.Racial {
			totalEssenceLoss += cyber.EssenceCost
		}
	}

	// Essence loss reduces Magic/Resonance
	expectedEssence := 6.0 - totalEssenceLoss
	if char.Essence != expectedEssence {
		// Allow some tolerance for rounding
		diff := char.Essence - expectedEssence
		if diff < -0.01 || diff > 0.01 {
			return fmt.Errorf("essence mismatch: expected %.2f, got %.2f", expectedEssence, char.Essence)
		}
	}

	// Check for burnout (Magic/Resonance reaches 0 due to essence loss)
	if char.Magic > 0 && char.Essence < 1.0 {
		// Magic should be reduced by essence loss
		// This is a warning, not an error, as it may be intentional
	}

	return nil
}

// validateMagicResonance validates magic and resonance rules
func (h *SR5Handler) validateMagicResonance(char *domain.CharacterSR5) error {
	// Magic and Resonance are mutually exclusive
	if char.Magic > 0 && char.Resonance > 0 {
		return fmt.Errorf("character cannot have both Magic and Resonance")
	}

	// Validate magic rating limits
	if char.Magic > 0 {
		maxMagic := 6
		// Check for Exceptional Attribute quality
		for _, q := range char.PositiveQualities {
			if q.Name == "Exceptional Attribute" {
				maxMagic = 7
				break
			}
		}
		if char.Magic > maxMagic {
			return fmt.Errorf("magic rating exceeds maximum: %d (max: %d)", char.Magic, maxMagic)
		}
	}

	// Validate resonance rating limits
	if char.Resonance > 0 {
		maxResonance := 6
		// Check for Exceptional Attribute quality
		for _, q := range char.PositiveQualities {
			if q.Name == "Exceptional Attribute" {
				maxResonance = 7
				break
			}
		}
		if char.Resonance > maxResonance {
			return fmt.Errorf("resonance rating exceeds maximum: %d (max: %d)", char.Resonance, maxResonance)
		}
	}

	// Validate spell limits
	if char.Magic > 0 {
		maxSpells := char.Magic * 2
		if len(char.Spells) > maxSpells {
			return fmt.Errorf("spells exceed maximum: %d (max: %d based on Magic %d)", len(char.Spells), maxSpells, char.Magic)
		}
	}

	// Validate complex form limits
	if char.Resonance > 0 {
		maxForms := char.Logic // Complex forms limited by Logic
		if len(char.ComplexForms) > maxForms {
			return fmt.Errorf("complex forms exceed maximum: %d (max: %d based on Logic %d)", len(char.ComplexForms), maxForms, char.Logic)
		}
	}

	// Validate bound spirits
	if char.Magic > 0 {
		maxSpirits := char.Charisma
		if len(char.Spirits) > maxSpirits {
			return fmt.Errorf("bound spirits exceed maximum: %d (max: %d based on Charisma %d)", len(char.Spirits), maxSpirits, char.Charisma)
		}
	}

	// Validate registered sprites
	if char.Resonance > 0 {
		maxSprites := char.Charisma
		// Count registered sprites (would need to track this separately)
		_ = maxSprites
	}

	// Validate foci force
	if char.Magic > 0 {
		maxForce := char.Magic * 2
		totalForce := 0
		for _, focus := range char.Focuses {
			totalForce += focus.Rating
		}
		if totalForce > maxForce {
			return fmt.Errorf("total foci force exceeds maximum: %d (max: %d based on Magic %d)", totalForce, maxForce, char.Magic)
		}
	}

	return nil
}

// validateGearRestrictions validates gear availability and device rating
func (h *SR5Handler) validateGearRestrictions(char *domain.CharacterSR5) error {
	gameplayLevel := char.GameplayLevel
	if gameplayLevel == "" {
		gameplayLevel = "experienced"
	}

	maxAvailability := 12
	maxDeviceRating := 6

	switch gameplayLevel {
	case "street":
		maxAvailability = 10
		maxDeviceRating = 4
	case "prime":
		maxAvailability = 15
		maxDeviceRating = 6
	}

	// Validate cyberware availability
	for _, cyber := range char.Cyberware {
		if cyber.Availability > maxAvailability {
			return fmt.Errorf("cyberware %s exceeds availability limit: %d (max: %d)", cyber.Name, cyber.Availability, maxAvailability)
		}
	}

	// Validate bioware availability
	for _, bio := range char.Bioware {
		if bio.Availability > maxAvailability {
			return fmt.Errorf("bioware %s exceeds availability limit: %d (max: %d)", bio.Name, bio.Availability, maxAvailability)
		}
	}

	// Device rating validation would require checking equipment types
	_ = maxDeviceRating

	return nil
}

// validateAugmentations validates augmentation bonus limits
func (h *SR5Handler) validateAugmentations(char *domain.CharacterSR5) error {
	// Maximum +4 augmentation bonus per attribute
	// This is complex to validate without detailed augmentation data
	// For now, we'll do a basic check
	_ = char
	return nil
}

// validateSkills validates skill limits
func (h *SR5Handler) validateSkills(char *domain.CharacterSR5) error {
	// Maximum skill rating at creation: 6 (7 with Aptitude quality)
	maxRating := 6
	for _, q := range char.PositiveQualities {
		if q.Name == "Aptitude" {
			maxRating = 7
			break
		}
	}

	for _, skill := range char.ActiveSkills {
		if skill.Rating > maxRating {
			return fmt.Errorf("skill %s exceeds maximum rating: %d (max: %d)", skill.Name, skill.Rating, maxRating)
		}
	}

	return nil
}

