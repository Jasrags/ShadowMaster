package v5

import (
	"fmt"
	"math/rand"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// Action represents a character action with its dice test formula
type Action struct {
	Name   string `json:"name"`
	Type   string `json:"type"` // Free, Simple, Complex, No
	Test   Test   `json:"test"`
	Source string `json:"source"`
}

// Test represents the dice test for an action
type Test struct {
	Dice        string `json:"dice"`                  // Dice formula like "{REA} + {INT} + {Improvement Value: Dodge}"
	BonusString string `json:"bonusstring,omitempty"` // Optional description
}

// DiceRollResult represents the result of a dice roll
type DiceRollResult struct {
	ActionName       string
	DicePool         int   // Total dice pool size
	Rolls            []int // Individual die results
	Hits             int   // Number of hits (5s and 6s)
	Glitches         int   // Number of 1s
	IsGlitch         bool  // True if more than half the dice are 1s
	IsCriticalGlitch bool  // True if glitch and no hits
}

// AttributeResolver is a function that resolves attribute values from placeholders
// It should return the value for attributes like {REA}, {INT}, {BOD}, etc.
type AttributeResolver func(attr string) (int, error)

// ImprovementValueResolver is a function that resolves improvement values
// It should return the value for things like {Improvement Value: Dodge}
type ImprovementValueResolver func(improvement string) (int, error)

// ActionsData contains all actions from the Chummer actions.json file.
// This data is embedded directly in the code for performance and reliability.
var ActionsData = struct {
	Actions []Action
}{
	Actions: []Action{
		// Total actions: 260
		{
			Name: "Melee Defense",
			Type: "No",
			Test: Test{
				Dice: "{REA} + {INT} + {Improvement Value: Dodge}",
			},
			Source: "SR5",
		},
		{
			Name: "Ranged Defense",
			Type: "No",
			Test: Test{
				Dice: "{REA} + {INT} + {Improvement Value: Dodge}",
			},
			Source: "SR5",
		},
		{
			Name: "Suppressive Fire Defense",
			Type: "No",
			Test: Test{
				Dice: "{REA} + {EDG}",
			},
			Source: "SR5",
		},
		{
			Name: "Resist Surprise",
			Type: "No",
			Test: Test{
				Dice: "{INT} + {REA} + {Improvement Value: SurpriseResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Direct, Physical Combat Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{BOD} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Direct, Mana Combat Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Detection Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {WIL} + {Improvement Value: SpellResistance} + {Improvement Value: DetectionSpellResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Physical Illusion Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {INT} + {Improvement Value: SpellResistance} + {Improvement Value: PhysicalIllusionResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Mana Illusion Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {WIL} + {Improvement Value: SpellResistance} + {Improvement Value: MentalManipulationResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Physical Manipulation Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{BOD} + {STR} + {Improvement Value: SpellResistance} + {Improvement Value: PhysicalManipulationResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Mental Manipulation Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {WIL} + {Improvement Value: SpellResistance} + {Improvement Value: ManaIllusionResist}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {BOD} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{BOD} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {AGI} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{AGI} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {REA} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{REA} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {STR} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{STR} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {CHA} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{CHA} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {INT} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{INT} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {LOG} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Decrease {WIL} Spell Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {WIL} + {Improvement Value: SpellResistance}",
			},
			Source: "SR5",
		},
		{
			Name: "Change Linked Device Mode",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Activate, deactivate, or switch the mode of any device to which the character has a direct neural interface connection.",
			},
			Source: "SR5",
		},
		{
			Name: "Change Gun Mode (Linked Smartgun)",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Change the firing mode of a readied firearm with a linked smartgun system.",
			},
			Source: "SR5",
		},
		{
			Name: "Drop Object",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Drop one object held in the character's hand(s).",
			},
			Source: "SR5",
		},
		{
			Name: "Drop Prone",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Drop to prone.",
			},
			Source: "SR5",
		},
		{
			Name: "Eject Clip (Smartgun)",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Eject the detachable magazine of a smartgun.",
			},
			Source: "SR5",
		},
		{
			Name: "Gesture",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Make a few quick gestures. Targets unfamiliar with the gestures may roll {INT} v. {Threshold: 2} to understand them.",
			},
			Source: "SR5",
		},
		{
			Name: "Multiple Attacks",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Attack multiple targets in a single action, splitting the character's dicepool. Must be combined with {Action: Fire Single-Shot}, {Action: Fire Semi-Auto}, {Action: Fire Burst Fire}, {Action: Fire Full-Auto Simple}, {Action: Fire Semi-Auto Burst}, {Action: Fire Long Burst}, {Action: Fire Full-Auto Complex}, {Action: Throw Weapon (Non-Grenade)}, {Action: Throw Weapon (Grenade)}, {Action: Melee Attack}, {Action: Reckless Spellcasting}, or {Action: Cast Spell}.",
			},
			Source: "SR5",
		},
		{
			Name: "Run",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Inflicts Running movement modifiers, and can move up to Running Movement Rate for the rest of the combat turn.",
			},
			Source: "SR5",
		},
		{
			Name: "Speak/Text/Transmit Phrase",
			Type: "Free",
			Test: Test{
				Dice:        "None",
				BonusString: "Send or speak a short message.",
			},
			Source: "SR5",
		},
		{
			Name: "Activate Focus",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Activate a focus the character is carrying.",
			},
			Source: "SR5",
		},
		{
			Name: "Call Spirit",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Call a spirit that has already been summoned and placed on standby.",
			},
			Source: "SR5",
		},
		{
			Name: "Change Device Mode",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Activate, deactivate, or change the mode of any device with a simple switch, virtual button, or command from a commlink or other control device.",
			},
			Source: "SR5",
		},
		{
			Name: "Change Gun Mode (Not Linked Smartgun)",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Change the firing mode of a readied firearm that is either not a smartgun or does not have its system linked.",
			},
			Source: "SR5",
		},
		{
			Name: "Command Spirit",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Issue a command to a single spirit or group of spirits under the character's control.",
			},
			Source: "SR5",
		},
		{
			Name: "Dismiss Spirit",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Free a spirit from under the character's control. The spirit is not immediately sent back, but instead is freed to do as it chooses.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Bow",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense}",
				BonusString: "On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Single-Shot",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense}",
				BonusString: "Fires 1 shot without recoil penalties. Can use {Action: Multiple Attacks} if using two weapons. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Semi-Auto",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense}",
				BonusString: "Fires 1 shot. Can only use {Action: Multiple Attacks} if using two weapons. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Burst Fire",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense} - 2",
				BonusString: "Fires 3 shots. Can use {Action: Multiple Attacks}. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Full-Auto Simple",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense} - 5",
				BonusString: "Fires 6 shots. Can use {Action: Multiple Attacks}. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Insert Clip",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Insert a fresh detachable magazine into a readied firearm, but only if the previous magazine has been removed.",
			},
			Source: "SR5",
		},
		{
			Name: "Nock Arrow",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Loads a bow with an arrow.",
			},
			Source: "SR5",
		},
		{
			Name: "Observe in Detail",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Make a Perception test. At the GM's discretion, immediately obvious things do not need a test.",
			},
			Source: "SR5",
		},
		{
			Name: "Pick Up / Put Down",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Pick up an object in reach or put it down (gently).",
			},
			Source: "SR5",
		},
		{
			Name: "Quick Draw",
			Type: "Simple",
			Test: Test{
				Dice:        "{REA} + {Weapon: Skill} v. {Threshold: {Weapon: Quick Draw Threshold}}",
				BonusString: "Weapon must be properly holstered. On success, the weapon is readied and immediately make a Simple Action attack. On fail, the weapon is readied. On glitch, the weapon is not readied and the character's action phase ends. On a critical glitch, bad things happen.",
			},
			Source: "SR5",
		},
		{
			Name: "Ready Weapon",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Weapon is readied for attacks. Weapons not in traditional holsters may require a Complex action at the GM's discretion. Small throwing weapons can be readied {{AGI} / 2} at a time per action.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Direct, Physical Combat)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Direct, Physical Combat Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Direct, Mana Combat)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Direct, Mana Combat Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Indirect, Single-target Combat)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Ranged Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Indirect, AoE Combat)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Threshold: 3}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Detection)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Detection Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Physical Illusion)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Physical Illusion Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Mana Illusion)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Mana Illusion Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Physical Manipulation)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Physical Manipulation Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Mental Manipulation)",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Mental Manipulation Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {BOD})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {BOD} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {AGI})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {AGI} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {REA})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {REA} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {STR})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {STR} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {CHA})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {CHA} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {INT})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {INT} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {LOG})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {LOG} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Reckless Spellcasting (Decrease {WIL})",
			Type: "Simple",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {WIL} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} + 3} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Remove Clip",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Remove a detachable magazine from a weapon.",
			},
			Source: "SR5",
		},
		{
			Name: "Shift Perception",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Shift to or from Astral Perception.",
			},
			Source: "SR5",
		},
		{
			Name: "Stand Up",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Stand up from being prone. If wounded, must make {{BOD} + {WIL}} v. {Threshold: 2} test to succeed.",
			},
			Source: "SR5",
		},
		{
			Name: "Take Aim",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Add +1 dice or +1 Accuracy to the character's next attack test. If using a smartgun, apply both bonuses. If using Vision Magnification, apply its effects instead. Bonuses are cumulative for up to {{{WIL} / 2} + {Improvement Value: TakeAimCount}} times. All bonuses are lost if any other action is taken, including a Free action.",
			},
			Source: "SR5",
		},
		{
			Name: "Take Cover",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Move behind cover. Must not be surprised.",
			},
			Source: "SR5",
		},
		{
			Name: "Throw Weapon (Grenade)",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Throwing Weapons} v. {Threshold: 3}",
				BonusString: "Throw a readied grenade. Can use {Action: Multiple Attacks} if multiple grenades are readied.",
			},
			Source: "SR5",
		},
		{
			Name: "Throw Weapon (Non-Grenade)",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Throwing Weapons} v. {Action: Ranged Defense}",
				BonusString: "Throw a readied weapon that is not a grenade. Can use {Action: Multiple Attacks} if multiple weapons are readied. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Use Simple Device",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Use a simple device, like those activated by a simple movement, e.g. a thumb trigger, pressing a single key, or tapping a single icon.",
			},
			Source: "SR5",
		},
		{
			Name: "Astral Projection",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "If capable of Astral Projection, shift consciousness to the Astral Plane.",
			},
			Source: "SR5",
		},
		{
			Name: "Banish Spirit",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Banishing} v. {Spirit: Force}",
				BonusString: "On success, reduce target spirit's services by net hits. After action, take drain equal to twice the spirit's total hits with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Direct, Physical Combat)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Direct, Physical Combat Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Direct, Mana Combat)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Direct, Mana Combat Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Indirect, Single-target Combat)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Ranged Defense}",
				BonusString: "Cast a spell. After action, resist {{Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Indirect, AoE Combat)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Threshold: 3}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Detection)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Detection Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Physical Illusion)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Physical Illusion Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Mana Illusion)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Mana Illusion Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Physical Manipulation)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Physical Manipulation Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Mental Manipulation)",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Action: Mental Manipulation Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {BOD})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {BOD} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {AGI})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {AGI} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {REA})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {REA} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {STR})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {STR} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {CHA})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {CHA} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {INT})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {INT} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {LOG})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {LOG} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Cast Spell (Decrease {WIL})",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spell: Spellcasting} v. {Decrease {WIL} Spell Defense}",
				BonusString: "Cast a spell. After action, resist {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Semi-Auto Burst",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense} - 2",
				BonusString: "Fires 3 shots. Can use {Action: Multiple Attacks}. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Long Burst",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense} - 5",
				BonusString: "Fires 6 shots. Can use {Action: Multiple Attacks}. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Full-Auto Complex",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense} - 9",
				BonusString: "Fires 10 shots. Can use {Action: Multiple Attacks}. On success, target must resist {Weapon: DV} + net hits damage with an armor modifier of {Weapon: AP}.",
			},
			Source: "SR5",
		},
		{
			Name: "Suppressive Fire",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Suppressive Fire Defense}",
				BonusString: "Fires 20 shots without recoil penalties. Select a 10m x 2m cross-section within weapon range to suppress. Suppression zone remains until the end of the combat turn unless the shooter moves or takes another action. On success, everyone in the zone must always resist {Weapon: DV} damage with an armor modifier of {Weapon: AP}, and they get a penalty to all actions equal to net hits.",
			},
			Source: "SR5",
		},
		{
			Name: "Fire Mounted or Vehicle Weapon",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill}",
				BonusString: "Fires a vehicle-mounted weapon.",
			},
			Source: "SR5",
		},
		{
			Name: "Load and Fire Bow",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Ranged Defense}",
				BonusString: "Either load and fire or fire and load a readied bow.",
			},
			Source: "SR5",
		},
		{
			Name: "Melee Attack",
			Type: "Complex",
			Test: Test{
				Dice: "{AGI} + {Weapon: Skill} v. {Action: Melee Defense}",
			},
			Source: "SR5",
		},
		{
			Name: "Reload Firearm",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "Reload a weapon that is belt-fed (belt), break-action (b), or muzzle loaded (ml), has a cylinder (cy), drum (d), or internal magazine (m), or uses a Speed Loader.",
			},
			Source: "SR5",
		},
		{
			Name: "Rigger Jump In",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "Jump into a vehicle with a rigger adaptation. Must have a Control Rig or equivalent.",
			},
			Source: "SR5",
		},
		{
			Name: "Sprint",
			Type: "Complex",
			Test: Test{
				Dice:        "{STR} + {Running}",
				BonusString: "Increase run speed by 2m/hit or 1m/hit depending on metatype.",
			},
			Source: "SR5",
		},
		{
			Name: "Summoning",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Spirit: Summoning} v. {Spirit: Force}",
				BonusString: "On success, spirit is summoned with a number of services equal to net hits. After action, take drain equal to twice the spirit's total hits with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Use Skill",
			Type: "Complex",
			Test: Test{
				Dice:        "Variable",
				BonusString: "Use a skill with the appropriate dicepool and limit.",
			},
			Source: "SR5",
		},
		{
			Name: "Block",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "SR5",
		},
		{
			Name: "Dodge",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "SR5",
		},
		{
			Name: "Hit the Dirt",
			Type: "Interrupt",
			Test: Test{
				Dice:        "None",
				BonusString: "Drop prone where the character is, usually to avoid {Action: Suppressive Fire}.",
			},
			Source: "SR5",
		},
		{
			Name: "Intercept",
			Type: "Interrupt",
			Test: Test{
				Dice:        "None",
				BonusString: "Intercept a target attempting to move past the character within {1 + {Weapon: Reach}} meters and perform {Action: Melee Attack} against them.",
			},
			Source: "SR5",
		},
		{
			Name: "Parry",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "SR5",
		},
		{
			Name: "Full Defense",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "SR5",
		},
		{
			Name: "Evade",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Gymnastics} v. {Threshold: 1}",
				BonusString: "On success, can move past one character per net hit; they cannot use {Action: Intercept} to stop the character unless it is {Action: Shadow Block v. Evade}.",
			},
			Source: "SR5",
		},
		{
			Name: "Escape (Subduing)",
			Type: "Complex",
			Test: Test{
				Dice:        "{STR} + {Unarmed Combat} v. {Threshold: {Action: Subduing}}",
				BonusString: "On success, break out of Subduing.",
			},
			Source: "SR5",
		},
		{
			Name: "Subduing",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "On success, if {STR} + net hits exceeds {Target: {Physical}}, target is grappled and subdued. Causes no damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Use Sensors (Detect or Active Targeting) v. Living Beings",
			Type: "Simple",
			Test: Test{
				Dice:        "{INT} + {Perception} + {Target: {Improvement Value: DetectionModifier}} - 3 v. {AGI} + {Sneaking}",
				BonusString: "On success, if this is an active targeting, apply net hits as negative dicepool modifier to target's {Action: Ranged Defense} and {Action: Melee Defense}.",
			},
			Source: "SR5",
		},
		{
			Name: "Use Sensors (Detect or Active Targeting) v. Vehicles",
			Type: "Simple",
			Test: Test{
				Dice:        "{INT} + {Perception} + {Target: {Improvement Value: DetectionModifier}} v. {REA} + {Min: {Sneaking}, {Vehicle: Skill}}",
				BonusString: "On success, if this is an active targeting, apply net hits as negative dicepool modifier to target's {Action: Ranged Defense} and {Action: Melee Defense}.",
			},
			Source: "SR5",
		},
		{
			Name: "Control Vehicle",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "Vehicle is considered under control for the remainder of the combat turn.",
			},
			Source: "SR5",
		},
		{
			Name: "Make Vehicle Test",
			Type: "Complex",
			Test: Test{
				Dice:        "Variable",
				BonusString: "Attempt to make a vehicle action.",
			},
			Source: "SR5",
		},
		{
			Name: "Ramming",
			Type: "Complex",
			Test: Test{
				Dice:        "{REA} + {Vehicle: Skill} v. {Action: Melee Defense}",
				BonusString: "On success, vehicle rams target. Target cannot use {Action: Block} or {Action: Parry} against this action.",
			},
			Source: "SR5",
		},
		{
			Name: "WIL Attack Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {Icon: Attack}",
			},
			Source: "SR5",
		},
		{
			Name: "WIL Sleaze Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {Icon: Sleaze}",
			},
			Source: "SR5",
		},
		{
			Name: "WIL Data Processing Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {Icon: Data Processing}",
			},
			Source: "SR5",
		},
		{
			Name: "WIL Firewall Defense",
			Type: "No",
			Test: Test{
				Dice: "{WIL} + {Icon: Firewall}",
			},
			Source: "SR5",
		},
		{
			Name: "INT Firewall Defense",
			Type: "No",
			Test: Test{
				Dice: "{INT} + {Icon: Firewall}",
			},
			Source: "SR5",
		},
		{
			Name: "INT Data Processing Defense",
			Type: "No",
			Test: Test{
				Dice: "{INT} + {Icon: Data Processing}",
			},
			Source: "SR5",
		},
		{
			Name: "LOG Firewall Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {Icon: Firewall}",
			},
			Source: "SR5",
		},
		{
			Name: "LOG Sleaze Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {Icon: Sleaze}",
			},
			Source: "SR5",
		},
		{
			Name: "LOG Attack Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {Icon: Attack}",
			},
			Source: "SR5",
		},
		{
			Name: "LOG Data Processing Defense",
			Type: "No",
			Test: Test{
				Dice: "{LOG} + {Icon: Sleaze}",
			},
			Source: "SR5",
		},
		{
			Name: "Brute Force (1 Mark)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} v. {Action: WIL Firewall Defense}",
				BonusString: "On success, gain mark on target. Every 2 net hits can be used to inflict 1 DV Matrix damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Brute Force (2 Marks)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} - 4 v. {Action: WIL Firewall Defense}",
				BonusString: "On success, gain two marks on target. Every 2 net hits can be used to inflict 1 DV Matrix damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Brute Force (3 Marks)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} - 10 v. {Action: WIL Firewall Defense}",
				BonusString: "On success, gain three marks on target. Every 2 net hits can be used to inflict 1 DV Matrix damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Change Icon",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Requires Owner marks on target. Changes the Matrix sculpt of an Icon.",
			},
			Source: "SR5",
		},
		{
			Name: "Check Overwatch Score",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. 6",
				BonusString: "On success, the character knows their OS. OS from opposed hits added after this.",
			},
			Source: "SR5",
		},
		{
			Name: "Control Device (Free)",
			Type: "Free",
			Test: Test{
				Dice:        "Variable",
				BonusString: "Requires 1 mark on target device. If there is no eligible test, it is {{INT} + {Electronic Warfare}} [{Icon: Sleaze}] v. {Target: {Action: INT Firewall Defense}}. On success, the character performs a Free Action with the device.",
			},
			Source: "SR5",
		},
		{
			Name: "Control Device (Simple)",
			Type: "Simple",
			Test: Test{
				Dice:        "Variable",
				BonusString: "Requires 2 marks on target device. If there is no eligible test, it is {{INT} + {Electronic Warfare}} [{Icon: Sleaze}] v. {Target: {Action: INT Firewall Defense}}. On success, the character performs a Simple Action with the device.",
			},
			Source: "SR5",
		},
		{
			Name: "Control Device (Complex)",
			Type: "Complex",
			Test: Test{
				Dice:        "Variable",
				BonusString: "Requires 3 marks on target device. If there is no eligible test, it is {{INT} + {Electronic Warfare}} [{Icon: Sleaze}] v. {Target: {Action: INT Firewall Defense}}. On success, the character performs a Complex Action with the device.",
			},
			Source: "SR5",
		},
		{
			Name: "Crack File",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Hacking} v. 2 * {Icon: Rating}",
				BonusString: "Requires 1 mark on target file. On success, target file's protection is removed.",
			},
			Source: "SR5",
		},
		{
			Name: "Crash Program",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} v. {Action: INT Firewall Defense}",
				BonusString: "Requires 1 mark on target persona. On success, the specified running program is crashed on the target persona.",
			},
			Source: "SR5",
		},
		{
			Name: "Data Spike",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} v. {Action: INT Firewall Defense}",
				BonusString: "On success, target icon must resist {Icon: Attack} + net hits Matrix damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Disarm Data Bomb",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Software} v. 2 * {Icon: Rating}",
				BonusString: "On success, target data bomb is disarmed. On fail, the data bomb detonates.",
			},
			Source: "SR5",
		},
		{
			Name: "Edit File",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Action: INT Firewall Defense}",
				BonusString: "Requires 1 mark on target file. On success, the character can edit the target file, though any data bombs on it will detonate. The character cannot edit files that are protected. The character may use this test to protect a file as well, in which case hits become the file's protection rating.",
			},
			Source: "SR5",
		},
		{
			Name: "Enter/Exit Host",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "The character enters or exits the target host. When the character leaves a host, they return to the grid from which they entered.",
			},
			Source: "SR5",
		},
		{
			Name: "Erase Mark (1 Mark)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on target icon. On success, the character removes one mark of a chosen persona from the target. The character does not need marks on the owner of the mark that they remove.",
			},
			Source: "SR5",
		},
		{
			Name: "Erase Mark (2 Marks)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} - 4 v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on target icon. On success, the character removes two marks of a chosen persona from the target. The character does not need marks on the owner of the mark that they remove.",
			},
			Source: "SR5",
		},
		{
			Name: "Erase Mark (3 Marks)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} - 10 v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on target icon. On success, the character removes three marks of a chosen persona from the target. The character does not need marks on the owner of the mark that they remove.",
			},
			Source: "SR5",
		},
		{
			Name: "Erase Matrix Signature",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Computer} v. 2 * {Icon: Rating}",
				BonusString: "On success, the target Resonance signature is removed.",
			},
			Source: "SR5",
		},
		{
			Name: "Format Device",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on target device. On success, the device will shut down for good on its next reboot and require a Software test to replace.",
			},
			Source: "SR5",
		},
		{
			Name: "Full Matrix Defense",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "SR5",
		},
		{
			Name: "Grid Hop",
			Type: "Complex",
			Test: Test{
				Dice:        "None",
				BonusString: "The character hops to the target grid. If the character does not have access to the target grid through their lifestyle, they must gain 1 mark on it to perform this action.",
			},
			Source: "SR5",
		},
		{
			Name: "Hack on the Fly (1 Mark)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Hacking} v. {Action: INT Firewall Defense}",
				BonusString: "On success, gain 1 mark on target icon. Every 2 net hits can be used as one net hit on a {Action: Matrix Perception} test.",
			},
			Source: "SR5",
		},
		{
			Name: "Hack on the Fly (2 Marks)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Hacking} - 4 v. {Action: INT Firewall Defense}",
				BonusString: "On success, gain 2 marks on target icon. Every 2 net hits can be used as one net hit on a {Action: Matrix Perception} test.",
			},
			Source: "SR5",
		},
		{
			Name: "Hack on the Fly (3 Mark)",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Hacking} - 10 v. {Action: INT Firewall Defense}",
				BonusString: "On success, gain 3 marks on target icon. Every 2 net hits can be used as one net hit on a {Action: Matrix Perception} test.",
			},
			Source: "SR5",
		},
		{
			Name: "Hide",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Electronic Warfare} v. {Action: INT Data Processing Defense}",
				BonusString: "On success, if the target persona does not have a mark on the character, it is no longer spotting them.",
			},
			Source: "SR5",
		},
		{
			Name: "Invite Mark",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Requires Owner marks on the target icon. Choose a number of marks between 1 and 3 and send an invitation to an invitee persona. The invitee persona may gain the chosen amount of marks on the target icon with a single Free Action. The character may rescind the invitation before the invitee gains the marks, but not after.",
			},
			Source: "SR5",
		},
		{
			Name: "Jack Out",
			Type: "Simple",
			Test: Test{
				Dice:        "{WIL} + {Hardware} v. {Action: LOG Attack Defense}",
				BonusString: "Can only target the character's own persona. Defense test only applies if the character is link-locked, and if they are link-locked by multiple personas, each one rolls a defense test. On success, the character's persona and its device are instantly rebooted, and if the character is in VR, they suffer Dumpshock.",
			},
			Source: "SR5",
		},
		{
			Name: "Jam Signals",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare}",
				BonusString: "Requires Owner marks on the target device. On success, the device increases the ambient noise penalty of all devices within a 100m radius by net hits.",
			},
			Source: "SR5",
		},
		{
			Name: "Jump into Rigged Device",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on the target device. Requires VR and a Control Rig or equivalent. Requires target device to have rigger adaptation and to not currently be jumped into by someone else. No test is needed if the character has Owner marks on the target device or the target device's owner has given the character permission. On success, jump into target device.",
			},
			Source: "SR5",
		},
		{
			Name: "Matrix Perception",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Computer} v. {Action: LOG Sleaze Defense}",
				BonusString: "On success, spot target icon and gain one piece of information about target icon per net hit (see SR5 235). Target only defends if it is running silent. No test is needed to spot icons of devices within 100m that are not running silent. This test can be used to determine if there are running silent icons nearby. If the character does not know a specific feature of a running silent icon, they must randomly select a running silent icon in range to spot (remember, there are literally quadrillions of running silent icons on grids that are always in range).",
			},
			Source: "SR5",
		},
		{
			Name: "Matrix Search",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Computer}",
				BonusString: "On success, use net hits to find pieces of information on the Matrix (see SR5 241) and/or to speed up the amount of time it takes to complete the search.",
			},
			Source: "SR5",
		},
		{
			Name: "Reboot Device",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 3 marks on the target device. Requires target to not be link-locked. On success, target device immediately goes offline and will come back online at the end of the next combat turn. The exact delay can be chosen to be longer, but this can be overriden with physical access to the target. If target is running a persona, the persona's OS and marks are reset, and all marks others have on the persona are cleared; if the persona was in VR, they suffer dumpshock.",
			},
			Source: "SR5",
		},
		{
			Name: "Send Message",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Send a text or audio message the length of a short sentence, an image, or a file to a target persona whose commcode the character has. If the character has a direct neural interface, they can send longer and more complicated messages (about a paragraph's worth), even in AR. The character can also use this action to open a live feed to one or more recipients using any digital devices they have.",
			},
			Source: "SR5",
		},
		{
			Name: "Set Data Bomb",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Software} v. 2 * {Icon: Rating}",
				BonusString: "Requires 1 mark on target file. On success, select a Data Bomb rating up to net hits, select a passcode for the Data Bomb, and select whether the Data Bomb deletes the file when it detonates. A file can only have one Data Bomb at a time, and if the target file already has a Data Bomb, it immediately detonates. The Data Bomb is triggered if someone attempts to read, edit, copy, protect, delete, or put a Data Bomb on the target file without using the already-in-place Data Bomb's passcode. When a Data Bomb detonates, the persona who detonated it must resist (Data Bomb Rating)D6 Matrix damage, and then the Data Bomb deletes itself. Data Bombs can be detected with Matrix Perception.",
			},
			Source: "SR5",
		},
		{
			Name: "Snoop",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Electronic Warfare} v. {Action: LOG Firewall Defense}",
				BonusString: "Requires 1 mark on target icon. On success, intercept all Matrix traffic sent to and from the target as long as the character has a mark on the target. The character can listen to, view, and/or read this data live and/or save it for later playback/viewing on a device.",
			},
			Source: "SR5",
		},
		{
			Name: "Spoof Command",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Hacking} v. {Action: LOG Firewall Defense}",
				BonusString: "Requires 1 mark on the persona of the owner of the target device or agent. On success, the target device or agent believes that a Matrix action command the character sent to it is legitimately from its owner.",
			},
			Source: "SR5",
		},
		{
			Name: "Switch Interface Mode",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Requires that the character's persona not be link-locked. If the character is in VR, they switch their persona to AR. If they are in AR, they switch their persona to VR. If the character switches from VR to AR, they immediately lose the effect of any bonus initiative dice.",
			},
			Source: "SR5",
		},
		{
			Name: "Trace Icon",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Computer} v. {Action: WIL Sleaze Defense}",
				BonusString: "Requires 2 marks on the target device or persona. On success, obtain the precise physical location of the target device or the device that is running the target persona. The target's physical location is known for as long as the character has at least 1 mark on the target.",
			},
			Source: "SR5",
		},
		{
			Name: "Acid IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Firewall Defense}",
				BonusString: "On success, reduce target persona's Firewall by 1 until they reboot. If they are at 0 Firewall, target persona must resist 1 DV Matrix damage per net hit.",
			},
			Source: "SR5",
		},
		{
			Name: "Binder IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Data Processing Defense}",
				BonusString: "On success, reduce target persona's Data Processing by 1 until they reboot. If they are at 0 Data Processing, target persona must resist 1 DV Matrix damage per net hit.",
			},
			Source: "SR5",
		},
		{
			Name: "Black IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: INT Firewall Defense}",
				BonusString: "On success, link-lock target persona and they must resist {Icon: Attack} + net hits + 2 per mark Matrix DV and an equal amount of biofeedback damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Blaster IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: LOG Firewall Defense}",
				BonusString: "On success, link-lock target persona and they must resist {Icon: Attack} + net hits + 2 per mark Matrix DV and an equal amount of biofeedback damage. Biofeedback damage taken this way can only be Stun damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Crash IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: INT Firewall Defense}",
				BonusString: "On success, a running cyberprogram on the target persona crashes and cannot be run again until the target persona reboots.",
			},
			Source: "SR5",
		},
		{
			Name: "Jammer IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Attack Defense}",
				BonusString: "On success, reduce target persona's Attack by 1 until they reboot. If they are at 0 Attack, target persona must resist 1 DV Matrix damage per net hit.",
			},
			Source: "SR5",
		},
		{
			Name: "Killer IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: INT Firewall Defense}",
				BonusString: "On success, target persona must resist {Icon: Attack} + net hits + 2 per mark Matrix DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Marker IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Sleaze Defense}",
				BonusString: "On success, reduce target persona's Sleaze by 1 until they reboot. If they are at 0 Sleaze, target persona must resist 1 DV Matrix damage per net hit.",
			},
			Source: "SR5",
		},
		{
			Name: "Patrol IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: LOG Sleaze Defense}",
				BonusString: "On success, the host spots the target persona.",
			},
			Source: "SR5",
		},
		{
			Name: "Probe IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: INT Firewall Defense}",
				BonusString: "On success, the host and all its IC gain a mark on the target persona.",
			},
			Source: "SR5",
		},
		{
			Name: "Scramble IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Firewall Defense}",
				BonusString: "On success, if the host has 3 marks on the target persona, the target persona is forced to reboot; if they are in VR, they suffer dumpshock.",
			},
			Source: "SR5",
		},
		{
			Name: "Sparky IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: INT Firewall Defense}",
				BonusString: "On success, target persona must resist {Icon: Attack} + net hits + 2 per mark Matrix DV. The attack itself is laced with biofeedback.",
			},
			Source: "SR5",
		},
		{
			Name: "Tar Baby IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: LOG Firewall Defense}",
				BonusString: "On success, target persona is link-locked. If the target persona is already link-locked by the host, the host and all its IC gain a mark on the target persona.",
			},
			Source: "SR5",
		},
		{
			Name: "Track IC",
			Type: "Complex",
			Test: Test{
				Dice:        "2 * {Icon: Rating} v. {Action: WIL Sleaze Defense}",
				BonusString: "On success, if the host has 2 on the target persona, the target persona's real-world location is discovered and usually reported to real-world authorities immediately.",
			},
			Source: "SR5",
		},
		{
			Name: "Call/Dismiss Sprite",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Call a registered sprite that is waiting in the Resonance, who will appear at the start of the next combat turn. The action can also be used to send a sprite of the characters back to the Resonance, releasing it from any tasks it still owes.",
			},
			Source: "SR5",
		},
		{
			Name: "Command Sprite",
			Type: "Simple",
			Test: Test{
				Dice:        "None",
				BonusString: "Command a sprite to do something for the character, using up a task.",
			},
			Source: "SR5",
		},
		{
			Name: "Compile Sprite",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Compiling} v. {Icon: Rating}",
				BonusString: "On success, a sprite is compiled with tasks equal to net hits. After action, resist fading equal to twice the sprite's total hits with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Decompile Sprite",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Decompiling} v. {Icon: Rating}",
				BonusString: "On success, reduce the target sprite's tasks by 1 for each net hit. After action, resist fading equal to twice the sprite's total hits with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Kill Complex Form",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Software} v. {Spell: Force} + {RES}",
				BonusString: "On success, reduce the number of hits on the target complex form by 1 for each net hit. After action, resist {Target: {Spell: Drain}} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Register Sprite",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Registering} v. 2 * {Icon: Rating}",
				BonusString: "On success, target sprite is registered and its OS erase, and target sprite gains 1 extra task per net hit. After action, resist fading equal to twice the sprite's total hits with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Thread Complex Form (No Opposed Test)",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Software}",
				BonusString: "On success, complex form is threaded. After action, resist fading equal to {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Thread Complex Form (v. INT Data Processing)",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Software} v. {Action: INT Data Processing Defense}",
				BonusString: "On success, complex form is threaded. After action, resist fading equal to {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Thread Complex Form (v. WIL Firewall)",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Software} v. {Action: WIL Firewall Defense}",
				BonusString: "On success, complex form is threaded. After action, resist fading equal to {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Thread Complex Form (v. LOG Data Processing)",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Software} v. {Action: LOG Data Processing Defense}",
				BonusString: "On success, complex form is threaded. After action, resist fading equal to {Spell: Drain} with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Sprite Power: Cookie",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Hacking} v. {Action: INT Firewall Defense}",
				BonusString: "On success, sprite power succeeds against target persona. Cookie file remains until its pre-programmed duration expires, after which it returns to its sprite if it is online, but otherwise disappears.",
			},
			Source: "SR5",
		},
		{
			Name: "Sprite Power: Diagnostics",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Hardware}",
				BonusString: "On success, sprite power succeeds against target device. The power consumes the sprite's complete attention while active.",
			},
			Source: "SR5",
		},
		{
			Name: "Sprite Power: Electron Storm",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Cybercombat} v. {Action: INT Firewall Defense}",
				BonusString: "On success, sprite power succeeds against target persona. The power remains until the sprite takes any Matrix damage.",
			},
			Source: "SR5",
		},
		{
			Name: "Sprite Power: Gremlins",
			Type: "Complex",
			Test: Test{
				Dice:        "{RES} + {Hardware} v. {Icon}",
				BonusString: "On success, sprite power succeeds against target device and immediately causes it to suffer a glitch; if 4 or more net hits were obtained, this is upgraded to a critical glitch.",
			},
			Source: "SR5",
		},
		{
			Name: "Compensate for Noise",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare}",
				BonusString: "On success, add 1 noise reduction per net hit until the end of the combat turn.",
			},
			Source: "SR5",
		},
		{
			Name: "Dispelling",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {Counterspelling} v. {Spell: Force} + {MAG}",
				BonusString: "On success, reduce the hits on the target spell by 1 for each net hit. After action, resist drain equal to {Target: {Spell: Drain}}, with a minimum of 2 DV.",
			},
			Source: "SR5",
		},
		{
			Name: "Assense",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Assensing}",
				BonusString: "On success, consult the appropriate table to see what information is revealed.",
			},
			Source: "SR5",
		},
		{
			Name: "Press through Mana Barrier",
			Type: "Complex",
			Test: Test{
				Dice:        "{MAG} + {CHA} v. 2 * {Spell: Force}",
				BonusString: "On success, pass through the barrier, and the character may bring one magically-active entity with them per net hit.",
			},
			Source: "SR5",
		},
		{
			Name: "Hide Gear (No Pat-Down)",
			Type: "Complex",
			Test: Test{
				Dice: "{AGI} + {Palming} v. {INT} + {Max: {Perception} or {Palming}} + {Target: {Gear: Concealability}}",
			},
			Source: "SR5",
		},
		{
			Name: "Hide Gear (Pat-Down)",
			Type: "Complex",
			Test: Test{
				Dice: "{AGI} + {Palming} v. {Max: {INT} or {AGI}} + {Max: {Perception} or {Palming}} + {If: {Target: {Gear: Concealability}} gte 0; Then: {2 * {Target: {Gear: Concealability}}}; Else: {{Target: {Gear: Concealability}} / 2}}",
			},
			Source: "SR5",
		},
		{
			Name: "Aimed Burst",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Fire Long Burst} v. {Ranged Defense}",
				BonusString: "+1 DV. Fires 3 shots instead of 6.",
			},
			Source: "RG",
		},
		{
			Name: "Ballestra",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "+1 Reach. After action, -1 to all Defense tests until next action phase and cannot use Active Defense techniques until next action phase.",
			},
			Source: "RG",
		},
		{
			Name: "Brain Blaster",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Fire Full-Auto Complex} v. {Ranged Defense}",
				BonusString: "+2 DV. Fires 6 shots instead of 10.",
			},
			Source: "RG",
		},
		{
			Name: "Clinch",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Gymnastics} v. {REA} + {INT}",
				BonusString: "On success, gain Superior Position and cannot move far away from target.",
			},
			Source: "RG",
		},
		{
			Name: "Double Tap",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Fire Semi-Auto Burst} v. {Ranged Defense}",
				BonusString: "+1 DV. Fires 2 shots instead of 3.",
			},
			Source: "RG",
		},
		{
			Name: "Escape (Clinch)",
			Type: "Complex",
			Test: Test{
				Dice:        "{STR} + {Unarmed Combat} v. {Threshold: {Action: Clinch}}",
				BonusString: "On success, break out of Clinch.",
			},
			Source: "RG",
		},
		{
			Name: "Enhanced Suppression",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Suppressive Fire Defense}",
				BonusString: "Identical to {Action: Suppressive Fire} with a narrower AoE, but targets cannot use {Action: Drop Prone} or {Action: Hit the Dirt}.",
			},
			Source: "RG",
		},
		{
			Name: "Finishing Move",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} + 2 v. {Action: Melee Defense}",
				BonusString: "Can only be performed once per Combat Turn.",
			},
			Source: "RG",
		},
		{
			Name: "Flechette Suppressive Fire",
			Type: "Complex",
			Test: Test{
				Dice:        "{AGI} + {Weapon: Skill} v. {Action: Suppressive Fire Defense}",
				BonusString: "Requires flechette ammo type. Identical to {Action: Enhanced Suppression}, but also get modifiers per tables on RG 121.",
			},
			Source: "RG",
		},
		{
			Name: "Flying Kick",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} + 1 v. {Action: Melee Defense}",
				BonusString: "+1 Reach. On fail, -1 to all Defense tests until next action phase.",
			},
			Source: "RG",
		},
		{
			Name: "Full Offense",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} + 2 v. {Action: Melee Defense}",
				BonusString: "After action, cannot use any Defensive Interrupt actions until next action phase.",
			},
			Source: "RG",
		},
		{
			Name: "Half Sword",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "Extra AP -2. On fail, -2 to next action (not Defense tests) and cannot use {Action: Parry} or {Action: Block} until next action phase. Requires Ready Weapon before next attack. Requires both hands.",
			},
			Source: "RG",
		},
		{
			Name: "Haymaker",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense} + 2",
				BonusString: "+1 DV.",
			},
			Source: "RG",
		},
		{
			Name: "Herding",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense} + 2",
				BonusString: "Moves opponent 1m/hit instead of dealing damage, up to maximum walking rate.",
			},
			Source: "RG",
		},
		{
			Name: "Iaijutsu",
			Type: "Simple",
			Test: Test{
				Dice:        "{REA} + {Weapon: Skill} v. {Threshold: {Weapon: Quick Draw Threshold}}",
				BonusString: "On success, can make {Action: Melee Attack} with a Simple Action for that action phase.",
			},
			Source: "RG",
		},
		{
			Name: "Kip-Up",
			Type: "Simple",
			Test: Test{
				Dice:        "{AGI} + {Gymnastics} v. {Threshold: 3}",
				BonusString: "On success, can immediately make {Action: Melee Attack} against a nearby target. On fail, remain prone.",
			},
			Source: "RG",
		},
		{
			Name: "Playing Possum (Con)",
			Type: "Simple",
			Test: Test{
				Dice:        "{CHA} + {Con} v. {CHA} + {Con}",
				BonusString: "Wound penalties act as bonus instead of penalty for this action. Net hits become {Perception} threshold for target to avoid being caught unaware.",
			},
			Source: "RG",
		},
		{
			Name: "Playing Possum (Performance)",
			Type: "Simple",
			Test: Test{
				Dice:        "{CHA} + {Performance} v. {CHA} + {WIL}",
				BonusString: "Wound penalties act as bonus instead of penalty for this action. Net hits become {Perception} threshold for target to avoid being caught unaware.",
			},
			Source: "RG",
		},
		{
			Name: "Pouncing Dragon",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "+2 DV. Requires Superior Position. After action, lose Superior Position.",
			},
			Source: "RG",
		},
		{
			Name: "Pre-Emptive Block",
			Type: "Free",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Pre-Emptive Dodge",
			Type: "Free",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Pre-Emptive Parry",
			Type: "Free",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Push (Simple)",
			Type: "Simple",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "On success, target pushed out of reach. Cannot be in Grapple or Clinch.",
			},
			Source: "RG",
		},
		{
			Name: "Push (Intercept)",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "On success, target pushed out of reach. Cannot be in Grapple or Clinch.",
			},
			Source: "RG",
		},
		{
			Name: "Shove",
			Type: "Simple",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "On success, if {STR} + net hits exceeds {Target: {Physical}}, target can be pushed. On fail, fall prone. Must be running at target.",
			},
			Source: "RG",
		},
		{
			Name: "Sacrifice Move",
			Type: "Complex",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "On success, if {{STR} + {BOD}} + net hits exceeds {Target: {Physical}}, fall prone, and target is pushed and falls prone. On fail, fall prone. Must be running at target.",
			},
			Source: "RG",
		},
		{
			Name: "Reading the Defense",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Weapon: Skill} v. {Threshold: 3}",
				BonusString: "On success, +3 dice to next {Action: Melee Attack} against target. On fail, -1 die to next {Action: Melee Attack} against target.",
			},
			Source: "RG",
		},
		{
			Name: "Throw Person (Simple)",
			Type: "Simple",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "Require Clinch or Subduing against target. On success, if {STR} + net hits exceeds {Target: {Physical}}, target can be thrown. On fail, target escapes Clinch or Subduing.",
			},
			Source: "RG",
		},
		{
			Name: "Throw Person (Interrupt)",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "Require Clinch or Subduing against target. On success, if {STR} + net hits exceeds {Target: {Physical}}, target can be thrown. On fail, target escapes Clinch or Subduing.",
			},
			Source: "RG",
		},
		{
			Name: "Counterstrike",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{REA} + {Unarmed Combat} v. {Action: Melee Attack}",
				BonusString: "On success, avoid attack and target takes damage. On fail, take damage as normal.",
			},
			Source: "RG",
		},
		{
			Name: "Dive For Cover",
			Type: "Interrupt",
			Test: Test{
				Dice:        "None",
				BonusString: "Go prone behind any nearby cover within 4m.",
			},
			Source: "RG",
		},
		{
			Name: "Reversal (Clinch)",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Threshold: {Action: Clinch}}",
				BonusString: "Requires being in Clinch from target. On success, reverse positions in Clinch.",
			},
			Source: "RG",
		},
		{
			Name: "Reversal (Subduing)",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Threshold: {Action: Subduing}}",
				BonusString: "Requires being in Subduing from target. On success, reverse positions in Subduing.",
			},
			Source: "RG",
		},
		{
			Name: "Right Back at Ya!",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{AGI} v. {Threshold: 2}",
				BonusString: "On success, perform {Action: Throw Weapon (Grenade)} at -2 penalty to throw grenade back. Bad things happen if grenade triggers before throw.",
			},
			Source: "RG",
		},
		{
			Name: "Run for Your Life / Dive on the Grenade",
			Type: "Interrupt",
			Test: Test{
				Dice:        "None",
				BonusString: "Can immediately move away from grenade or indirect, combat, AoE spell.",
			},
			Source: "RG",
		},
		{
			Name: "Sacrifice Throw",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{Action: Melee Attack} v. {Action: Melee Defense}",
				BonusString: "Require Clinch or Subduing against target. On success, if {{STR} + {BOD}} + net hits exceeds {Target: {Physical}}, become prone and target can be thrown. On fail, take damage and become prone.",
			},
			Source: "RG",
		},
		{
			Name: "Riposte",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{REA} + {Weapon: Skill} v. {Action: Melee Attack}",
				BonusString: "On success, avoid attack and target takes damage. On fail, take damage with +2 DV extra.",
			},
			Source: "RG",
		},
		{
			Name: "Protecting the Principle",
			Type: "Interrupt",
			Test: Test{
				Dice:        "None",
				BonusString: "Move up to 2m and take damage from an attack intended at a target. Can only be used once per combat turn.",
			},
			Source: "RG",
		},
		{
			Name: "Shadow Block v. Dodge",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{AGI} + {Gymnastics} v. {Action: Dodge}",
				BonusString: "On success, negate hits on target's {Action: Dodge} by net hits.",
			},
			Source: "RG",
		},
		{
			Name: "Shadow Block v. Evade",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{AGI} + {Gymnastics} v. {Action: Evade}",
				BonusString: "On success, negate hits on target's {Action: Evade} by net hits.",
			},
			Source: "RG",
		},
		{
			Name: "Acrobatic Defender",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Agile Defender",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Perceptive Defender",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Too Pretty to Hit",
			Type: "Interrupt",
			Test: Test{
				Dice: "None",
			},
			Source: "RG",
		},
		{
			Name: "Break Target Lock",
			Type: "Simple",
			Test: Test{
				Dice:        "{INT} + {Electronic Warfare} v. {LOG} + {Target: Sensors}",
				BonusString: "For every net hit, reduce the target's lock on the character by one hit. The character's RCC's Noise Reduction rating is added as a dice pool bonus for this action.",
			},
			Source: "R5",
		},
		{
			Name: "Confuse Pilot",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. {Target: Pilot} + {Target: {Icon: Firewall}}",
				BonusString: "On success, target makes an immediate Simple Pilot * 2 test to figure out what it's going to do next with a threshold equal to half of the net hits. The character's RCC's Noise Reduction rating is added as a dice pool bonus for this action.",
			},
			Source: "R5",
		},
		{
			Name: "Detect Target Lock",
			Type: "Free",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Threshold: 2}",
				BonusString: "Requires Owner marks on target. The device the character is using must have wireless enabled. The character's RCC's Noise Reduction rating is added as a dice pool bonus for this action.",
			},
			Source: "R5",
		},
		{
			Name: "Suppress Noise",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare}",
				BonusString: "Requires Owner marks on target. On success, reduce noise by hits on this test for one Combat Turn. The character's RCC's Noise Reduction rating is added as a dice pool bonus for this action.",
			},
			Source: "R5",
		},
		{
			Name: "Target Device",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. {Action: WIL Firewall Defense}",
				BonusString: "For the rest of the combat turn, any slaved devices targeting the target of this action receive a dice pool bonus equal to the net hits on this action. The character's RCC's Noise Reduction rating is added as a dice pool bonus for this action.",
			},
			Source: "R5",
		},
		{
			Name: "Garbage In/Garbage Out",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Software} v. {Action: LOG Firewall Defense}",
				BonusString: "Requires 3 marks on target icon. On success, reprogram a single input action to a single output action.",
			},
			Source: "DT",
		},
		{
			Name: "Trackback",
			Type: "Extended",
			Test: Test{
				Dice:        "{INT} + {Computer} v. 10 + {Target: {Icon: Sleaze}}",
				BonusString: "Requires Owner marks on target icon. 30 minute interval. On success if the target persona is running silent, the trail ends in the vicinity of the icon, letting the character know that there are silent icons nearby.",
			},
			Source: "DT",
		},
		{
			Name: "Calibration",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare}",
				BonusString: "Requires 1 mark on target icons. On success, increase the initiative score of all marked personas by 1 for every 2 hits. The number of affected personas cannot exceed {Icon: Data Processing}.",
			},
			Source: "KC",
		},
		{
			Name: "Denial of Service",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} v. {Action: WIL Firewall Defense}",
				BonusString: "On success, all tests made with the target device suffer a negative dice pool modifier equal to net hits * 2 until the beginning of the next Combat Turn. For every mark  the character has on the target PAN, they may apply this effect to two additional devices slaved to the PAN.",
			},
			Source: "KC",
		},
		{
			Name: "I Am the Firewall (Complex)",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Computer}",
				BonusString: "On success, give a defense test bonus equal to hits to all characters with an AR feed from the user until the user's next initiative pass.",
			},
			Source: "KC",
		},
		{
			Name: "I Am the Firewall (Interrupt)",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{INT} + {Computer}",
				BonusString: "On success, give a defense test bonus equal to hits to all characters with an AR feed from the user until the user's next initiative pass.",
			},
			Source: "KC",
		},
		{
			Name: "Haywire",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Cybercombat} v. {Action: WIL Firewall Defense}",
				BonusString: "Target must be a persona not running in VR. On success, all PAN and wireless functionality on the target is disabled until the target passes a {LOG} + {Computer} [Data Processing] v. {Threshold: Net Hits} Simple action.",
			},
			Source: "KC",
		},
		{
			Name: "Intervene",
			Type: "Interrupt",
			Test: Test{
				Dice:        "{INT} + {Computer}",
				BonusString: "On success, increase the number of hits on the target icon's Matrix defense test by net hits from this action.",
			},
			Source: "KC",
		},
		{
			Name: "Masquerade",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Hacking} v. {Action: LOG Firewall Defense}",
				BonusString: "Requires 2 marks on target icon and 2 marks on masquerading persona. On success, the target icon is convinced the character is the masquerading persona for 1 minute per net hit. If the masquerading persona logs off, the masquerade drops immediately. Masquerade cannot be used to act as if the character has Owner marks on the target icon.",
			},
			Source: "KC",
		},
		{
			Name: "Popup",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Max: {Hacking} or {Cybercombat}} v. {Action: WIL Firewall Defense}",
				BonusString: "Requires 1 mark on target icon. Target must be a persona not running in VR. On success, if the target is in wirelessly-enabled AR, the target persona's character takes a dice pool penalty to all actions equal to net hits until the start of the attacker's next Combat Turn. If using {Hacking}, net hits are also treated as if they were net hits on {Action: Matrix Perception}. If using {Cybercombat}, also deal Matrix damage equal to net hits.",
			},
			Source: "KC",
		},
		{
			Name: "Squelch",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. {Action: INT Sleaze Defense}",
				BonusString: "On success, target icon cannot make calls or send messages for a number of minutes equal to net hits.",
			},
			Source: "KC",
		},
		{
			Name: "Subvert Infrastructure",
			Type: "Complex",
			Test: Test{
				Dice:        "{INT} + {Electronic Warfare} v. {Action: INT Firewall Defense}",
				BonusString: "Requires 1 mark on target icon. Must target hosts. On success, character gains control over one simple device slaved to the target per net hit. No attacks can be made with this action. The control can be maintained by spending one Complex Action per Combat Turn.",
			},
			Source: "KC",
		},
		{
			Name: "Tag",
			Type: "Simple",
			Test: Test{
				Dice:        "{LOG} + {Computer} v. {Action: INT Sleaze Defense}",
				BonusString: "On success, a number of targets on a single PAN equal to net hits are \"tagged\". \"Tagged\" targets must be within line of sight of the character, and \"tags\" can be relayed wirelessly to allies. \"Tagging\" negates up to 2 dice in penalties from Visibility and Light/Glare to ranged attack rolls, including Blind Fire. Characters can take an additional {Action: Take Aim} at \"tagged\" targets as a Free Action each initiative pass. \"Tags\" can be maintained by spending one Simple Action per Combat Turn. When using a PI-Tac, the character may add the PI-Tac's level to the number of targets that can be \"tagged\".",
			},
			Source: "KC",
		},
		{
			Name: "Watchdog",
			Type: "Complex",
			Test: Test{
				Dice:        "{LOG} + {Electronic Warfare} v. {Action: LOG Firewall Defense}",
				BonusString: "Target must be a persona or device. On success, place a mark on the target. The character is now aware of the Matrix actions the target is going to use before they use them. The character can use {Action: Haywire} and {Action: Popup} as Interrupt Actions for -10 initiative and {Action: Squelch} as an Interrupt Action for -5 initiative against the target. This ability lasts as long as the target is marked by the character.",
			},
			Source: "KC",
		},
	},
}

// GetActionByName finds an action by its name (case-insensitive)
func GetActionByName(name string) (*Action, error) {
	for i := range ActionsData.Actions {
		if strings.EqualFold(ActionsData.Actions[i].Name, name) {
			return &ActionsData.Actions[i], nil
		}
	}
	return nil, fmt.Errorf("action not found: %s", name)
}

// GetAllActions returns all available actions
func GetAllActions() []Action {
	return ActionsData.Actions
}

// EvaluateDiceFormula evaluates a dice formula string and returns the dice pool size.
// It uses the provided resolvers to substitute attribute and improvement values.
func EvaluateDiceFormula(
	formula string,
	attrResolver AttributeResolver,
	improvementResolver ImprovementValueResolver,
) (int, error) {
	if formula == "None" {
		return 0, nil
	}

	// Replace attribute placeholders like {REA}, {INT}, {BOD}
	attrPattern := regexp.MustCompile(`\{([A-Z]+)\}`)
	formula = attrPattern.ReplaceAllStringFunc(formula, func(match string) string {
		attr := strings.Trim(match, "{}")
		if attrResolver != nil {
			val, err := attrResolver(attr)
			if err == nil {
				return strconv.Itoa(val)
			}
		}
		return "0"
	})

	// Replace improvement value placeholders like {Improvement Value: Dodge}
	improvementPattern := regexp.MustCompile(`\{Improvement Value: ([^}]+)\}`)
	formula = improvementPattern.ReplaceAllStringFunc(formula, func(match string) string {
		parts := strings.Split(match, ":")
		if len(parts) == 2 {
			improvement := strings.TrimSpace(strings.Trim(parts[1], "{}"))
			if improvementResolver != nil {
				val, err := improvementResolver(improvement)
				if err == nil {
					return strconv.Itoa(val)
				}
			}
		}
		return "0"
	})

	// Evaluate the formula (simple addition/subtraction for now)
	// Split by + and - and sum the values
	result := 0
	parts := regexp.MustCompile(`\s*[+\-]\s*`).Split(formula, -1)
	operators := regexp.MustCompile(`[+\-]`).FindAllString(formula, -1)

	for i, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		val, err := strconv.Atoi(part)
		if err != nil {
			return 0, fmt.Errorf("invalid formula component: %s", part)
		}

		if i == 0 {
			result = val
		} else {
			op := operators[i-1]
			switch op {
			case "+":
				result += val
			case "-":
				result -= val
			}
		}
	}

	return result, nil
}

// RollDice rolls a number of dice and returns the results.
// In Shadowrun, each die is a d6, and hits are 5s and 6s.
func RollDice(dicePool int, rng *rand.Rand) DiceRollResult {
	if rng == nil {
		rng = rand.New(rand.NewSource(time.Now().UnixNano()))
	}

	result := DiceRollResult{
		DicePool: dicePool,
		Rolls:    make([]int, dicePool),
	}

	for i := 0; i < dicePool; i++ {
		roll := rng.Intn(6) + 1
		result.Rolls[i] = roll

		if roll >= 5 {
			result.Hits++
		}
		if roll == 1 {
			result.Glitches++
		}
	}

	// Glitch: more than half the dice show 1
	if result.Glitches > dicePool/2 {
		result.IsGlitch = true
		// Critical glitch: glitch with no hits
		if result.Hits == 0 {
			result.IsCriticalGlitch = true
		}
	}

	return result
}

// RollAction rolls dice for a specific action using the provided resolvers.
func RollAction(
	action *Action,
	attrResolver AttributeResolver,
	improvementResolver ImprovementValueResolver,
	rng *rand.Rand,
) (DiceRollResult, error) {
	if action == nil {
		return DiceRollResult{}, fmt.Errorf("action is nil")
	}

	if action.Test.Dice == "None" {
		return DiceRollResult{
			ActionName: action.Name,
			DicePool:   0,
		}, nil
	}

	dicePool, err := EvaluateDiceFormula(action.Test.Dice, attrResolver, improvementResolver)
	if err != nil {
		return DiceRollResult{}, fmt.Errorf("failed to evaluate dice formula: %w", err)
	}

	result := RollDice(dicePool, rng)
	result.ActionName = action.Name

	return result, nil
}

// RollActionByName rolls dice for an action by name.
func RollActionByName(
	actionName string,
	attrResolver AttributeResolver,
	improvementResolver ImprovementValueResolver,
	rng *rand.Rand,
) (DiceRollResult, error) {
	action, err := GetActionByName(actionName)
	if err != nil {
		return DiceRollResult{}, err
	}

	return RollAction(action, attrResolver, improvementResolver, rng)
}
