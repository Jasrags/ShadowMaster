package v5

import (
	"math"
	"shadowmaster/internal/domain"
)

// calculateDerivedAttributes calculates all derived attributes for SR5
func (h *SR5Handler) calculateDerivedAttributes(char *domain.CharacterSR5) error {
	// Calculate Initiative
	if err := h.calculateInitiative(char); err != nil {
		return err
	}

	// Calculate Inherent Limits
	if err := h.calculateInherentLimits(char); err != nil {
		return err
	}

	// Calculate Condition Monitors
	if err := h.calculateConditionMonitors(char); err != nil {
		return err
	}

	// Calculate Living Persona (for Technomancers)
	if char.Resonance > 0 {
		h.calculateLivingPersona(char)
	}

	return nil
}

// calculateInitiative calculates all initiative types
func (h *SR5Handler) calculateInitiative(char *domain.CharacterSR5) error {
	// Physical Initiative: (Intuition + Reaction) + 1D6
	char.Initiative.Physical.Base = char.Intuition + char.Reaction
	char.Initiative.Physical.Augmented = char.Initiative.Physical.Base // Can be augmented
	char.Initiative.Physical.Dice = 1

	// Astral Initiative: (Intuition × 2) + 2D6
	char.Initiative.Astral.Base = char.Intuition * 2
	char.Initiative.Astral.Augmented = char.Initiative.Astral.Base
	char.Initiative.Astral.Dice = 2

	// Matrix AR Initiative: (Intuition + Reaction) + 1D6
	char.Initiative.MatrixAR.Base = char.Intuition + char.Reaction
	char.Initiative.MatrixAR.Augmented = char.Initiative.MatrixAR.Base
	char.Initiative.MatrixAR.Dice = 1

	// Matrix VR Cold Sim: (Data Processing + Intuition) + 3D6
	// Data Processing = Logic for Living Persona
	dataProcessing := char.Logic
	if char.LivingPersona != nil {
		dataProcessing = char.LivingPersona.DataProcessing
	}
	char.Initiative.MatrixVRCold.Base = dataProcessing + char.Intuition
	char.Initiative.MatrixVRCold.Augmented = char.Initiative.MatrixVRCold.Base
	char.Initiative.MatrixVRCold.Dice = 3

	// Matrix VR Hot Sim: (Data Processing + Intuition) + 4D6
	char.Initiative.MatrixVRHot.Base = dataProcessing + char.Intuition
	char.Initiative.MatrixVRHot.Augmented = char.Initiative.MatrixVRHot.Base
	char.Initiative.MatrixVRHot.Dice = 4

	return nil
}

// calculateInherentLimits calculates the three inherent limits
func (h *SR5Handler) calculateInherentLimits(char *domain.CharacterSR5) error {
	// Mental Limit: [(Logic × 2) + Intuition + Willpower] / 3 (round up)
	char.InherentLimits.Mental = int(math.Ceil(float64((char.Logic*2)+char.Intuition+char.Willpower) / 3.0))

	// Physical Limit: [(Strength × 2) + Body + Reaction] / 3 (round up)
	// Add augmentation bonuses to Body before calculating
	augmentedBody := char.Body
	// TODO: Add augmentation bonuses from cyberware/bioware
	char.InherentLimits.Physical = int(math.Ceil(float64((char.Strength*2)+augmentedBody+char.Reaction) / 3.0))

	// Social Limit: [(Charisma × 2) + Willpower + Essence] / 3 (round up)
	// Round Essence up to nearest whole number before calculating
	essenceRounded := int(math.Ceil(char.Essence))
	char.InherentLimits.Social = int(math.Ceil(float64((char.Charisma*2)+char.Willpower+essenceRounded) / 3.0))

	return nil
}

// calculateConditionMonitors calculates physical and stun condition monitors
func (h *SR5Handler) calculateConditionMonitors(char *domain.CharacterSR5) error {
	// Physical Condition Monitor: [Body / 2] + 8
	// Add augmentation bonuses to Body before calculating
	augmentedBody := char.Body
	// TODO: Add augmentation bonuses from cyberware/bioware
	char.ConditionMonitor.Physical = (augmentedBody / 2) + 8

	// Stun Condition Monitor: [Willpower / 2] + 8
	// Add augmentation bonuses to Willpower before calculating
	augmentedWillpower := char.Willpower
	// TODO: Add augmentation bonuses from cyberware/bioware
	char.ConditionMonitor.Stun = (augmentedWillpower / 2) + 8

	// Overflow: Body + Augmentation bonuses
	char.ConditionMonitor.Overflow = augmentedBody

	return nil
}

// calculateLivingPersona calculates Living Persona attributes for Technomancers
func (h *SR5Handler) calculateLivingPersona(char *domain.CharacterSR5) {
	if char.LivingPersona == nil {
		char.LivingPersona = &domain.LivingPersona{}
	}

	char.LivingPersona.Attack = char.Charisma        // Attack = Charisma
	char.LivingPersona.DataProcessing = char.Logic    // Data Processing = Logic
	char.LivingPersona.DeviceRating = char.Resonance // Device Rating = Resonance
	char.LivingPersona.Firewall = char.Willpower     // Firewall = Willpower
	char.LivingPersona.Sleaze = char.Intuition       // Sleaze = Intuition
}

