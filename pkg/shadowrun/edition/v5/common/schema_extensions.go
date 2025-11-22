package common

// Boolean represents the SchemaExtensions boolean type
// XSD: boolean simpleType with enumeration values "True" and "False"
// This is used in XSD schemas that reference SchemaExtensions.xsd
// In Go, we use bool, but this type helps with XML unmarshaling
type Boolean string

const (
	BooleanTrue  Boolean = "True"
	BooleanFalse Boolean = "False"
)

// ToBool converts Boolean to Go bool
func (b Boolean) ToBool() bool {
	return b == BooleanTrue
}

// FromBool converts Go bool to Boolean
func FromBool(b bool) Boolean {
	if b {
		return BooleanTrue
	}
	return BooleanFalse
}

// GetAllBooleanValues returns all valid Boolean enum values
func GetAllBooleanValues() []Boolean {
	return []Boolean{
		BooleanTrue,
		BooleanFalse,
	}
}

// GetAllBooleanStrings returns all valid Boolean enum values as strings
func GetAllBooleanStrings() []string {
	return []string{
		string(BooleanTrue),
		string(BooleanFalse),
	}
}
