package v5

// Lifestyle represents a base lifestyle definition
type Lifestyle struct {
	// ID is the unique identifier for the lifestyle (derived from the map key)
	ID string `json:"id,omitempty"`
	// Name is the lifestyle name (e.g., "Luxury", "High", "Middle")
	Name string `json:"name,omitempty"`
	// Description is the full text description of the lifestyle
	Description string `json:"description,omitempty"`
	// Cost describes the cost of the lifestyle (e.g., "10,000 nuyen a month", "500 nuyen a day for basic care")
	Cost string `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// LifestyleOption represents a lifestyle option/modifier definition
type LifestyleOption struct {
	// ID is the unique identifier for the lifestyle option (derived from the map key)
	ID string `json:"id,omitempty"`
	// Name is the option name (e.g., "Special Work Area", "Extra Secure")
	Name string `json:"name,omitempty"`
	// Description is the full text description of the option
	Description string `json:"description,omitempty"`
	// Cost describes the cost modifier (e.g., "+1,000 nuyen a month", "+20 percent of the lifestyle")
	Cost string `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// LifestylesData represents the lifestyles data structure (legacy format for backward compatibility)
type LifestylesData struct {
	Lifestyles *LifestylesGroup
}

// LifestylesGroup represents a group of lifestyle items (legacy format)
type LifestylesGroup struct {
	Lifestyle []LifestyleItem
}

// LifestyleItem represents a lifestyle item (legacy format)
type LifestyleItem struct {
	// Add fields as needed for legacy compatibility
}

// dataLifestyles and dataLifestyleOptions are declared in lifestyles_data.go

// GetAllLifestyles returns all lifestyle definitions
func GetAllLifestyles() []Lifestyle {
	lifestyles := make([]Lifestyle, 0, len(dataLifestyles))
	for key, l := range dataLifestyles {
		l.ID = key
		lifestyles = append(lifestyles, l)
	}
	return lifestyles
}

// GetLifestyleByName returns the lifestyle definition with the given name, or nil if not found
func GetLifestyleByName(name string) *Lifestyle {
	for key, lifestyle := range dataLifestyles {
		if lifestyle.Name == name {
			lifestyle.ID = key
			return &lifestyle
		}
	}
	return nil
}

// GetLifestyleByKey returns the lifestyle definition with the given key, or nil if not found
func GetLifestyleByKey(key string) *Lifestyle {
	lifestyle, ok := dataLifestyles[key]
	if !ok {
		return nil
	}
	lifestyle.ID = key
	return &lifestyle
}

// GetAllLifestyleOptions returns all lifestyle option definitions
func GetAllLifestyleOptions() []LifestyleOption {
	options := make([]LifestyleOption, 0, len(dataLifestyleOptions))
	for key, o := range dataLifestyleOptions {
		o.ID = key
		options = append(options, o)
	}
	return options
}

// GetLifestyleOptionByName returns the lifestyle option definition with the given name, or nil if not found
func GetLifestyleOptionByName(name string) *LifestyleOption {
	for key, option := range dataLifestyleOptions {
		if option.Name == name {
			option.ID = key
			return &option
		}
	}
	return nil
}

// GetLifestyleOptionByKey returns the lifestyle option definition with the given key, or nil if not found
func GetLifestyleOptionByKey(key string) *LifestyleOption {
	option, ok := dataLifestyleOptions[key]
	if !ok {
		return nil
	}
	option.ID = key
	return &option
}

// GetLifestylesData returns lifestyles data (legacy format for backward compatibility)
func GetLifestylesData() LifestylesData {
	return LifestylesData{
		Lifestyles: nil,
	}
}
