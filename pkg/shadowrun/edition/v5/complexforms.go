package v5

// ComplexFormTargetType represents the target type for a complex form
type ComplexFormTargetType string

const (
	ComplexFormTargetPersona ComplexFormTargetType = "persona"
	ComplexFormTargetDevice  ComplexFormTargetType = "device"
	ComplexFormTargetFile    ComplexFormTargetType = "file"
	ComplexFormTargetHost    ComplexFormTargetType = "host"
	ComplexFormTargetIC      ComplexFormTargetType = "ic"
	ComplexFormTargetSprite  ComplexFormTargetType = "sprite"
	ComplexFormTargetSelf    ComplexFormTargetType = "self"
)

// ComplexFormDurationType represents how long a complex form's effect lasts
type ComplexFormDurationType string

const (
	ComplexFormDurationInstantaneous ComplexFormDurationType = "instantaneous" // I
	ComplexFormDurationSustained     ComplexFormDurationType = "sustained"     // S
	ComplexFormDurationPermanent     ComplexFormDurationType = "permanent"     // P
	ComplexFormDurationExtended      ComplexFormDurationType = "extended"      // E
)

// FadingFormula represents how fading is calculated
type FadingFormula struct {
	// BaseModifier is the modifier to Level (e.g., -2, -1, +1, -3, -4, -5, -6)
	// For formulas like L-2, this would be -2
	// For formulas like L+1, this would be +1
	BaseModifier *int `json:"base_modifier,omitempty"`
	// Formula describes the fading formula as text (e.g., "L-2", "L-1", "L+1", "L-3")
	Formula string `json:"formula,omitempty"`
	// HasFading indicates if the complex form has a fading value (some may not, like Coriolis)
	HasFading bool `json:"has_fading,omitempty"`
}

// ComplexFormDuration represents the duration of a complex form
type ComplexFormDuration struct {
	// Type indicates the duration type
	Type ComplexFormDurationType `json:"type,omitempty"`
	// ExtendedParameters describes extended duration parameters (e.g., "5, 24 hours" for "E (5, 24 hours)")
	ExtendedParameters string `json:"extended_parameters,omitempty"`
	// Description describes the duration as text (e.g., "E (5, 24 hours)", "S", "I", "P")
	Description string `json:"description,omitempty"`
}

// ComplexForm represents a complex form definition
type ComplexForm struct {
	// Name is the complex form name (e.g., "Cleaner", "Diffusion of [Matrix Attribute]")
	Name string `json:"name,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Target indicates the target type for the complex form
	Target ComplexFormTargetType `json:"target,omitempty"`
	// Duration describes how long the complex form's effect lasts
	Duration ComplexFormDuration `json:"duration,omitempty"`
	// Fading describes the fading value formula
	Fading FadingFormula `json:"fading,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataComplexForms contains all complex form definitions
// This is populated in complexforms_data.go

// GetAllComplexForms returns all complex forms
func GetAllComplexForms() []ComplexForm {
	complexForms := make([]ComplexForm, 0, len(dataComplexForms))
	for _, cf := range dataComplexForms {
		complexForms = append(complexForms, cf)
	}
	return complexForms
}

// GetComplexFormByName returns the complex form definition with the given name, or nil if not found
func GetComplexFormByName(name string) *ComplexForm {
	for _, complexForm := range dataComplexForms {
		if complexForm.Name == name {
			return &complexForm
		}
	}
	return nil
}

// GetComplexFormByKey returns the complex form definition with the given key, or nil if not found
func GetComplexFormByKey(key string) *ComplexForm {
	complexForm, ok := dataComplexForms[key]
	if !ok {
		return nil
	}
	return &complexForm
}

// GetComplexFormsByTarget returns all complex forms with the specified target type
func GetComplexFormsByTarget(target ComplexFormTargetType) []ComplexForm {
	complexForms := make([]ComplexForm, 0)
	for _, cf := range dataComplexForms {
		if cf.Target == target {
			complexForms = append(complexForms, cf)
		}
	}
	return complexForms
}

// GetComplexFormsByDuration returns all complex forms with the specified duration type
func GetComplexFormsByDuration(duration ComplexFormDurationType) []ComplexForm {
	complexForms := make([]ComplexForm, 0)
	for _, cf := range dataComplexForms {
		if cf.Duration.Type == duration {
			complexForms = append(complexForms, cf)
		}
	}
	return complexForms
}
