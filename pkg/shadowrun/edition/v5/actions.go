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
