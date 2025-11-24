package v5

// This file contains license structures generated from licenses.xml

// Licenses represents a collection of license types
type Licenses struct {
	License []string `xml:"license" json:"license"`
}

// LicensesChummer represents the root chummer element for licenses
type LicensesChummer struct {
	Licenses Licenses `xml:"licenses" json:"licenses"`
}

