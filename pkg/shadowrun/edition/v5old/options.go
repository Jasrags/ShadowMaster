package v5

// This file contains option structures generated from options.xml

// Limb represents a limb count definition
type Limb struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: Web Browser, Acrobat-style, Acrobat-style - New instance (and 3 more)
// Enum Candidate: Acrobat-style, Acrobat-style - New instance, Sumatra, Sumatra - Re-use instance, Unix-style, Web Browser
// Length: 7-28 characters
	Name string `xml:"name" json:"name"`
	LimbCount int `xml:"limbcount" json:"limbcount"`
	Exclude string `xml:"exclude" json:"exclude"`
}

// LimbCounts represents a collection of limb counts
type LimbCounts struct {
	Limb []Limb `xml:"limb" json:"limb"`
}

// PDFAppNames represents a collection of PDF application names
type PDFAppNames struct {
	AppName []string `xml:"appname" json:"appname"`
}

// PDFArgument represents a PDF argument definition
type PDFArgument struct {
	Name string `xml:"name" json:"name"`
// Value represents value
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 100.0, 1000.0, 10000.0 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 100.0, 1000.0, 10000.0, 100000.0, 79228162514264337593543950335
// Length: 5-29 characters
	Value string `xml:"value" json:"value"`
	AppNames *PDFAppNames `xml:"appnames,omitempty" json:"appnames,omitempty"`
}

// PDFArguments represents a collection of PDF arguments
type PDFArguments struct {
	PDFArgument []PDFArgument `xml:"pdfargument" json:"pdfargument"`
}

// BlackMarketPipelineCategories represents a collection of black market pipeline categories
type BlackMarketPipelineCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 11
// Examples: Armor, Bioware, Cyberware (and 7 more)
// Enum Candidate: Armor, Bioware, Cyberware, Drugs, Electronics, Geneware, Magic, Nanoware, Software, Vehicles, Weapons
// Length: 5-11 characters
	Category []string `xml:"category" json:"category"`
}

// Avail represents an availability mapping
type Avail struct {
	ID string `xml:"id" json:"id"`
	Value float64 `xml:"value" json:"value"`
	Duration int `xml:"duration" json:"duration"`
	Interval string `xml:"interval" json:"interval"`
}

// AvailMap represents a collection of availability mappings
type AvailMap struct {
	Avail []Avail `xml:"avail" json:"avail"`
}

// OptionsChummer represents the root chummer element for options
type OptionsChummer struct {
	LimbCounts LimbCounts `xml:"limbcounts" json:"limbcounts"`
	PDFArguments PDFArguments `xml:"pdfarguments" json:"pdfarguments"`
	BlackMarketPipelineCategories BlackMarketPipelineCategories `xml:"blackmarketpipelinecategories" json:"blackmarketpipelinecategories"`
	AvailMap AvailMap `xml:"availmap" json:"availmap"`
}

