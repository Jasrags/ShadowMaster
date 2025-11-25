package v5

// ActionType represents the type of action
type ActionType string

const (
	ActionTypeUnclassified ActionType = "unclassified"
	ActionTypeFree         ActionType = "free"
	ActionTypeSimple       ActionType = "simple"
	ActionTypeComplex      ActionType = "complex"
	ActionTypeInterrupt    ActionType = "interrupt"
)

// Action represents a combat action definition
type Action struct {
	// Name is the action name (e.g., "Delaying Action", "Call a Shot", "Fire Weapon")
	Name string `json:"name,omitempty"`
	// Type indicates the action type
	Type ActionType `json:"type,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// InitiativeCost is the initiative cost for interrupt actions (e.g., -5, -10)
	InitiativeCost *int `json:"initiative_cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// ActionData represents the complete action data structure organized by type
type ActionData struct {
	Unclassified []Action `json:"unclassified,omitempty"`
	Free         []Action `json:"free,omitempty"`
	Simple       []Action `json:"simple,omitempty"`
	Complex      []Action `json:"complex,omitempty"`
	Interrupt    []Action `json:"interrupt,omitempty"`
}

// dataActions contains all action definitions
// This is populated in actions_data.go

// GetAllActions returns all actions
func GetAllActions() []Action {
	actions := make([]Action, 0, len(dataActions))
	for _, a := range dataActions {
		actions = append(actions, a)
	}
	return actions
}

// GetActionData returns the complete action data structure organized by type
func GetActionData() ActionData {
	data := ActionData{
		Unclassified: []Action{},
		Free:         []Action{},
		Simple:       []Action{},
		Complex:     []Action{},
		Interrupt:    []Action{},
	}

	for _, action := range dataActions {
		switch action.Type {
		case ActionTypeUnclassified:
			data.Unclassified = append(data.Unclassified, action)
		case ActionTypeFree:
			data.Free = append(data.Free, action)
		case ActionTypeSimple:
			data.Simple = append(data.Simple, action)
		case ActionTypeComplex:
			data.Complex = append(data.Complex, action)
		case ActionTypeInterrupt:
			data.Interrupt = append(data.Interrupt, action)
		}
	}

	return data
}

// GetActionByName returns the action definition with the given name, or nil if not found
func GetActionByName(name string) *Action {
	for _, action := range dataActions {
		if action.Name == name {
			return &action
		}
	}
	return nil
}

// GetActionByKey returns the action definition with the given key, or nil if not found
func GetActionByKey(key string) *Action {
	action, ok := dataActions[key]
	if !ok {
		return nil
	}
	return &action
}

// GetActionsByType returns all actions in the specified type
func GetActionsByType(actionType ActionType) []Action {
	actions := make([]Action, 0)
	for _, a := range dataActions {
		if a.Type == actionType {
			actions = append(actions, a)
		}
	}
	return actions
}

