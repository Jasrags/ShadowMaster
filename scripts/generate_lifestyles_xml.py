#!/usr/bin/env python3
"""Generate lifestyles.go, lifestyles_data.go, and lifestyles_test.go from lifestyles.xml using XSD schema"""

import xml.etree.ElementTree as ET
import re

def escape_go_string(s):
    """Escape string for Go code"""
    if s is None:
        return '""'
    # Replace " with \" and handle newlines
    s = str(s).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return f'"{s}"'

def to_go_identifier(name):
    """Convert XML element name to Go identifier"""
    # Capitalize first letter of each word after removing underscores/dashes
    parts = re.split(r'[-_]', name)
    return ''.join(word.capitalize() for word in parts)

def generate_structs_file():
    """Generate lifestyles.go with struct definitions based on XSD"""
    
    structs_code = '''package v5

// Note: Chummer root element is defined in books.go (shared across XML files)

// FreeGrid represents a free grid subscription
// XSD: freegrid element with select attribute (xs:string) and text content (xs:string)
type FreeGrid struct {
	Content string `xml:",chardata" json:"+content,omitempty"` // Content like "Grid Subscription"
	Select  string `xml:"select,attr,omitempty" json:"+@select,omitempty"` // Selection like "Public Grid", "Local Grid", "Global Grid"
}

// FreeGrids represents a collection of free grids
// XSD: freegrids element containing freegrid elements (maxOccurs="unbounded")
type FreeGrids struct {
	FreeGrid []FreeGrid `xml:"freegrid,omitempty" json:"freegrid,omitempty"` // Slice of free grids (XSD: maxOccurs="unbounded")
}

// Lifestyle represents a lifestyle from Shadowrun 5th Edition
// XSD: lifestyle element with required and optional fields
type Lifestyle struct {
	// Required fields (minOccurs="1")
	ID         string `xml:"id" json:"id"`         // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"
	Name       string `xml:"name" json:"name"`     // Lifestyle name - XSD: xs:string, minOccurs="1"
	Cost       string `xml:"cost" json:"cost"`     // Base cost - XSD: xs:string, minOccurs="1"
	Dice       string `xml:"dice" json:"dice"`     // Dice pool - XSD: xs:string, minOccurs="1"
	LP         string `xml:"lp" json:"lp"`         // Lifestyle points - XSD: xs:string, minOccurs="1"
	Multiplier string `xml:"multiplier" json:"multiplier"` // Cost multiplier - XSD: xs:string, minOccurs="1"
	Source     string `xml:"source" json:"source"` // Source book like "SR5", "RF", etc. - XSD: xs:string, minOccurs="1"
	Page       string `xml:"page" json:"page"`     // Page number - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Hide            *string     `xml:"hide,omitempty" json:"hide,omitempty"`            // Hide flag - XSD: xs:string, minOccurs="0"
	FreeGrids       *FreeGrids  `xml:"freegrids,omitempty" json:"freegrids,omitempty"`  // Free grid subscriptions - XSD: minOccurs="0"
	CostForArea     *int        `xml:"costforarea,omitempty" json:"costforarea,omitempty"`     // Cost for area - XSD: xs:integer, minOccurs="0"
	CostForComforts *int        `xml:"costforcomforts,omitempty" json:"costforcomforts,omitempty"` // Cost for comforts - XSD: xs:integer, minOccurs="0"
	CostForSecurity *int        `xml:"costforsecurity,omitempty" json:"costforsecurity,omitempty"` // Cost for security - XSD: xs:integer, minOccurs="0"
	Increment       *string     `xml:"increment,omitempty" json:"increment,omitempty"`       // Time increment like "day" - XSD: xs:string, minOccurs="0"
	AllowBonusLP    *string     `xml:"allowbonuslp,omitempty" json:"allowbonuslp,omitempty"`    // Whether to allow bonus LP - XSD: xs:string, minOccurs="0"
}

// Comfort represents a lifestyle comfort option
// XSD: comfort element with name (xs:string, minOccurs="1"), minimum (xs:integer, minOccurs="1"), limit (xs:integer, minOccurs="0")
type Comfort struct {
	Name    string `xml:"name" json:"name"`    // Comfort name - XSD: xs:string, minOccurs="1"
	Minimum int    `xml:"minimum" json:"minimum"` // Minimum rating - XSD: xs:integer, minOccurs="1"
	Limit   *int   `xml:"limit,omitempty" json:"limit,omitempty"`   // Maximum rating - XSD: xs:integer, minOccurs="0"
}

// Neighborhood represents a lifestyle neighborhood option
// XSD: neighborhood element with name (xs:string, minOccurs="1"), minimum (xs:integer, minOccurs="1"), limit (xs:integer, minOccurs="0")
type Neighborhood struct {
	Name    string `xml:"name" json:"name"`    // Neighborhood name - XSD: xs:string, minOccurs="1"
	Minimum int    `xml:"minimum" json:"minimum"` // Minimum rating - XSD: xs:integer, minOccurs="1"
	Limit   *int   `xml:"limit,omitempty" json:"limit,omitempty"`   // Maximum rating - XSD: xs:integer, minOccurs="0"
}

// Security represents a lifestyle security option
// XSD: security element with name (xs:string, minOccurs="1"), minimum (xs:integer, minOccurs="1"), limit (xs:integer, minOccurs="0")
type Security struct {
	Name    string `xml:"name" json:"name"`    // Security name - XSD: xs:string, minOccurs="1"
	Minimum int    `xml:"minimum" json:"minimum"` // Minimum rating - XSD: xs:integer, minOccurs="1"
	Limit   *int   `xml:"limit,omitempty" json:"limit,omitempty"`   // Maximum rating - XSD: xs:integer, minOccurs="0"
}

// LifestyleQualityBonus represents bonus elements for lifestyle qualities
// XSD: bonus element containing selecttext elements (maxOccurs="unbounded")
type LifestyleQualityBonus struct {
	SelectText []LifestyleQualitySelectText `xml:"selecttext,omitempty" json:"selecttext,omitempty"` // Select text options - XSD: maxOccurs="unbounded"
}

// LifestyleQualitySelectText represents a selecttext element with attributes
// XSD: selecttext element with xml, xpath, allowedit, select attributes (all optional)
type LifestyleQualitySelectText struct {
	Content   string `xml:",chardata" json:"+content,omitempty"` // Text content
	XML       string `xml:"xml,attr,omitempty" json:"+@xml,omitempty"` // XML attribute
	XPath     string `xml:"xpath,attr,omitempty" json:"+@xpath,omitempty"` // XPath attribute
	AllowEdit string `xml:"allowedit,attr,omitempty" json:"+@allowedit,omitempty"` // AllowEdit attribute
	Select    string `xml:"select,attr,omitempty" json:"+@select,omitempty"` // Select attribute
}

// LifestyleQualityRequired represents required elements (from conditions.xsd)
// This is a complex type that can contain various requirement checks
// For now, we'll use interface{} but document it properly
type LifestyleQualityRequired struct {
	// TODO: Implement proper struct based on conditions.xsd
	// This can contain oneof, allof, and various check elements
	// Keeping as interface{} for now due to complexity
	Data interface{} `xml:",innerxml" json:"data,omitempty"`
}

// LifestyleQualityForbidden represents forbidden elements (from conditions.xsd)
// Similar to Required, this is complex
type LifestyleQualityForbidden struct {
	// TODO: Implement proper struct based on conditions.xsd
	Data interface{} `xml:",innerxml" json:"data,omitempty"`
}

// LifestyleQuality represents a lifestyle quality
// XSD: quality element with many optional fields
type LifestyleQuality struct {
	// Required fields (minOccurs="1")
	ID       string `xml:"id" json:"id"`       // Unique identifier (UUID) - XSD: xs:string, minOccurs="1"
	Name     string `xml:"name" json:"name"`     // Quality name - XSD: xs:string, minOccurs="1"
	Category string `xml:"category" json:"category"` // Category like "Entertainment - Asset", etc. - XSD: xs:string, minOccurs="1"
	LP       int    `xml:"lp" json:"lp"`       // Lifestyle points cost - XSD: xs:integer, minOccurs="1"
	Source   string `xml:"source" json:"source"`   // Source book - XSD: xs:string, minOccurs="1"
	Page     string `xml:"page" json:"page"`     // Page number - XSD: xs:string, minOccurs="1"

	// Optional fields (minOccurs="0")
	Hide                *string                   `xml:"hide,omitempty" json:"hide,omitempty"`                // Hide flag - XSD: xs:string, minOccurs="0"
	Cost                *string                   `xml:"cost,omitempty" json:"cost,omitempty"`                // Cost - XSD: xs:string, minOccurs="0"
	Bonus               *LifestyleQualityBonus    `xml:"bonus,omitempty" json:"bonus,omitempty"`               // Bonus elements - XSD: minOccurs="0"
	Multiplier          *int                      `xml:"multiplier,omitempty" json:"multiplier,omitempty"`          // Multiplier - XSD: xs:integer, minOccurs="0"
	MultiplierBaseOnly  *int                      `xml:"multiplierbaseonly,omitempty" json:"multiplierbaseonly,omitempty"`  // Multiplier base only - XSD: xs:integer, minOccurs="0"
	AreaMaximum         *int                      `xml:"areamaximum,omitempty" json:"areamaximum,omitempty"`         // Area maximum - XSD: xs:integer, minOccurs="0"
	ComfortsMaximum     *int                      `xml:"comfortsmaximum,omitempty" json:"comfortsmaximum,omitempty"`     // Comforts maximum - XSD: xs:integer, minOccurs="0"
	SecurityMaximum     *int                      `xml:"securitymaximum,omitempty" json:"securitymaximum,omitempty"`     // Security maximum - XSD: xs:integer, minOccurs="0"
	AreaMinimum         *int                      `xml:"areaminimum,omitempty" json:"areaminimum,omitempty"`         // Area minimum - XSD: xs:integer, minOccurs="0"
	ComfortsMinimum     *int                      `xml:"comfortsminimum,omitempty" json:"comfortsminimum,omitempty"`     // Comforts minimum - XSD: xs:integer, minOccurs="0"
	SecurityMinimum     *int                      `xml:"securityminimum,omitempty" json:"securityminimum,omitempty"`     // Security minimum - XSD: xs:integer, minOccurs="0"
	Area                *int                      `xml:"area,omitempty" json:"area,omitempty"`                // Area - XSD: xs:integer, minOccurs="0"
	Comforts            *int                      `xml:"comforts,omitempty" json:"comforts,omitempty"`            // Comforts - XSD: xs:integer, minOccurs="0"
	Security            *int                      `xml:"security,omitempty" json:"security,omitempty"`            // Security - XSD: xs:integer, minOccurs="0"
	Allowed             *string                   `xml:"allowed,omitempty" json:"allowed,omitempty"`             // Allowed lifestyles (comma-separated) - XSD: xs:string, minOccurs="0"
	AllowMultiple       *string                   `xml:"allowmultiple,omitempty" json:"allowmultiple,omitempty"`       // Allow multiple flag (empty element) - XSD: minOccurs="0"
	Required            *LifestyleQualityRequired `xml:"required,omitempty" json:"required,omitempty"`            // Required elements - XSD: ref="required", minOccurs="0"
	Forbidden           *LifestyleQualityForbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`           // Forbidden elements - XSD: ref="forbidden", minOccurs="0"
}

// Borough represents a borough within a district
// XSD: borough element with name (xs:string, minOccurs="1") and secRating (xs:string, minOccurs="0")
type Borough struct {
	Name     string  `xml:"name" json:"name"`     // Borough name - XSD: xs:string, minOccurs="1"
	SecRating *string `xml:"secRating,omitempty" json:"secRating,omitempty"` // Security rating - XSD: xs:string, minOccurs="0"
}

// District represents a district within a city
// XSD: district element with name (xs:string, minOccurs="1") and borough elements (maxOccurs="unbounded")
type District struct {
	Name     string    `xml:"name" json:"name"`     // District name - XSD: xs:string, minOccurs="1"
	Boroughs []Borough `xml:"borough,omitempty" json:"borough,omitempty"` // Boroughs - XSD: maxOccurs="unbounded"
}

// City represents a city for lifestyles
// XSD: city element with name (xs:string, minOccurs="1") and district elements (maxOccurs="unbounded")
type City struct {
	Name      string     `xml:"name" json:"name"`      // City name - XSD: xs:string, minOccurs="1"
	Districts []District `xml:"district,omitempty" json:"district,omitempty"` // Districts - XSD: maxOccurs="unbounded"
}
'''
    return structs_code

def parse_int_or_none(text):
    """Parse text to int or return None"""
    if text is None or text.strip() == "":
        return None
    try:
        return int(text)
    except (ValueError, TypeError):
        return None

def parse_string_or_none(text):
    """Parse text to string or return None (empty string becomes None)"""
    if text is None or text.strip() == "":
        return None
    return text

def convert_freegrid_to_go(freegrid_elem):
    """Convert an XML freegrid element to Go struct literal"""
    content = freegrid_elem.text if freegrid_elem.text else ""
    select_attr = freegrid_elem.get('select', '')
    
    return f'FreeGrid{{Content: {escape_go_string(content)}, Select: {escape_go_string(select_attr)}}}'

def convert_freegrids_to_go(freegrids_elem):
    """Convert an XML freegrids element to Go struct literal"""
    if freegrids_elem is None:
        return "nil"
    
    freegrid_elems = freegrids_elem.findall('freegrid')
    if not freegrid_elems:
        return "nil"
    
    freegrid_strs = [convert_freegrid_to_go(fg) for fg in freegrid_elems]
    freegrid_list = ',\n\t\t\t\t'.join(freegrid_strs)
    
    return f"&FreeGrids{{FreeGrid: []FreeGrid{{\n\t\t\t\t{freegrid_list},\n\t\t\t}}}}"

def convert_lifestyle_to_go(lifestyle_elem, key_name):
    """Convert an XML lifestyle element to Go struct literal"""
    # Required fields
    id_val = lifestyle_elem.findtext('id', '')
    name_val = lifestyle_elem.findtext('name', '')
    cost_val = lifestyle_elem.findtext('cost', '')
    dice_val = lifestyle_elem.findtext('dice', '')
    lp_val = lifestyle_elem.findtext('lp', '')
    multiplier_val = lifestyle_elem.findtext('multiplier', '')
    source_val = lifestyle_elem.findtext('source', '')
    page_val = lifestyle_elem.findtext('page', '')
    
    # Optional fields
    hide_elem = lifestyle_elem.find('hide')
    hide_val = None
    if hide_elem is not None:
        # Hide is an empty element, so if it exists, we set it to empty string
        # But since it's *string, we only include it if present
        hide_val = ""
    
    freegrids_elem = lifestyle_elem.find('freegrids')
    freegrids_str = convert_freegrids_to_go(freegrids_elem)
    
    cost_for_area = parse_int_or_none(lifestyle_elem.findtext('costforarea'))
    cost_for_comforts = parse_int_or_none(lifestyle_elem.findtext('costforcomforts'))
    cost_for_security = parse_int_or_none(lifestyle_elem.findtext('costforsecurity'))
    increment = parse_string_or_none(lifestyle_elem.findtext('increment'))
    allow_bonus_lp = parse_string_or_none(lifestyle_elem.findtext('allowbonuslp'))
    
    # Format the struct
    result = f'\t"{key_name}": {{\n'
    result += f'\t\tID: {escape_go_string(id_val)},\n'
    result += f'\t\tName: {escape_go_string(name_val)},\n'
    result += f'\t\tCost: {escape_go_string(cost_val)},\n'
    result += f'\t\tDice: {escape_go_string(dice_val)},\n'
    result += f'\t\tLP: {escape_go_string(lp_val)},\n'
    result += f'\t\tMultiplier: {escape_go_string(multiplier_val)},\n'
    result += f'\t\tSource: {escape_go_string(source_val)},\n'
    result += f'\t\tPage: {escape_go_string(page_val)},'
    
    if hide_val is not None:
        result += f'\n\t\tHide: stringPtr({escape_go_string(hide_val)}),'
    
    if freegrids_str != "nil":
        result += f'\n\t\tFreeGrids: {freegrids_str},'
    
    if cost_for_area is not None:
        result += f'\n\t\tCostForArea: intPtr({cost_for_area}),'
    
    if cost_for_comforts is not None:
        result += f'\n\t\tCostForComforts: intPtr({cost_for_comforts}),'
    
    if cost_for_security is not None:
        result += f'\n\t\tCostForSecurity: intPtr({cost_for_security}),'
    
    if increment is not None:
        result += f'\n\t\tIncrement: stringPtr({escape_go_string(increment)}),'
    
    if allow_bonus_lp is not None:
        result += f'\n\t\tAllowBonusLP: stringPtr({escape_go_string(allow_bonus_lp)}),'
    
    result += '\n\t}'
    return result

def convert_comfort_to_go(comfort_elem):
    """Convert an XML comfort element to Go struct literal"""
    name = comfort_elem.findtext('name', '')
    minimum = parse_int_or_none(comfort_elem.findtext('minimum'))
    limit = parse_int_or_none(comfort_elem.findtext('limit'))
    
    if minimum is None:
        minimum = 0  # Required field, should have a value
    
    result = f'Comfort{{\n\t\tName: {escape_go_string(name)},\n\t\tMinimum: {minimum},'
    
    if limit is not None:
        result += f'\n\t\tLimit: intPtr({limit}),'
    
    result += '\n\t}'
    return result

def convert_neighborhood_to_go(neighborhood_elem):
    """Convert an XML neighborhood element to Go struct literal"""
    name = neighborhood_elem.findtext('name', '')
    minimum = parse_int_or_none(neighborhood_elem.findtext('minimum'))
    limit = parse_int_or_none(neighborhood_elem.findtext('limit'))
    
    if minimum is None:
        minimum = 0  # Required field
    
    result = f'Neighborhood{{\n\t\tName: {escape_go_string(name)},\n\t\tMinimum: {minimum},'
    
    if limit is not None:
        result += f'\n\t\tLimit: intPtr({limit}),'
    
    result += '\n\t}'
    return result

def convert_security_to_go(security_elem):
    """Convert an XML security element to Go struct literal"""
    name = security_elem.findtext('name', '')
    minimum = parse_int_or_none(security_elem.findtext('minimum'))
    limit = parse_int_or_none(security_elem.findtext('limit'))
    
    if minimum is None:
        minimum = 0  # Required field
    
    result = f'Security{{\n\t\tName: {escape_go_string(name)},\n\t\tMinimum: {minimum},'
    
    if limit is not None:
        result += f'\n\t\tLimit: intPtr({limit}),'
    
    result += '\n\t}'
    return result

def to_snake_case(name):
    """Convert name to snake_case for map keys"""
    # Replace spaces and special chars with underscores, lowercase
    name = re.sub(r'[^a-zA-Z0-9]+', '_', name)
    name = name.lower().strip('_')
    return name

def generate_data_file(xml_path):
    """Generate lifestyles_data.go from XML file"""
    
    # Parse XML
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Helper functions for pointers
    helpers = '''package v5

// Helper functions for pointer types
func intPtr(i int) *int { return &i }
func stringPtr(s string) *string { return &s }

'''
    
    # Categories
    categories_elem = root.find('categories')
    categories = []
    if categories_elem is not None:
        for cat_elem in categories_elem.findall('category'):
            cat_text = cat_elem.text if cat_elem.text else ""
            if cat_text:
                categories.append(cat_text)
    
    categories_code = '// DataLifestyleCategories contains lifestyle categories\n'
    categories_code += 'var DataLifestyleCategories = []string{\n'
    for cat in categories:
        categories_code += f'\t{escape_go_string(cat)},\n'
    categories_code += '}\n\n'
    
    # Lifestyles
    lifestyles_elem = root.find('lifestyles')
    lifestyles_code = '// DataLifestyles contains lifestyle records keyed by their ID (lowercase with underscores)\n'
    lifestyles_code += 'var DataLifestyles = map[string]Lifestyle{\n'
    
    if lifestyles_elem is not None:
        for lifestyle_elem in lifestyles_elem.findall('lifestyle'):
            name = lifestyle_elem.findtext('name', '')
            key_name = to_snake_case(name)
            lifestyle_go = convert_lifestyle_to_go(lifestyle_elem, key_name)
            lifestyles_code += lifestyle_go + ',\n'
    
    lifestyles_code += '}\n\n'
    
    # Comforts
    comforts_elem = root.find('comforts')
    comforts_code = '// DataComforts contains comfort records\n'
    comforts_code += 'var DataComforts = []Comfort{\n'
    
    if comforts_elem is not None:
        for comfort_elem in comforts_elem.findall('comfort'):
            comfort_go = convert_comfort_to_go(comfort_elem)
            comforts_code += '\t' + comfort_go + ',\n'
    
    comforts_code += '}\n\n'
    
    # Neighborhoods
    neighborhoods_elem = root.find('neighborhoods')
    neighborhoods_code = '// DataNeighborhoods contains neighborhood records\n'
    neighborhoods_code += 'var DataNeighborhoods = []Neighborhood{\n'
    
    if neighborhoods_elem is not None:
        for neighborhood_elem in neighborhoods_elem.findall('neighborhood'):
            neighborhood_go = convert_neighborhood_to_go(neighborhood_elem)
            neighborhoods_code += '\t' + neighborhood_go + ',\n'
    
    neighborhoods_code += '}\n\n'
    
    # Securities
    securities_elem = root.find('securities')
    securities_code = '// DataSecurities contains security records\n'
    securities_code += 'var DataSecurities = []Security{\n'
    
    if securities_elem is not None:
        for security_elem in securities_elem.findall('security'):
            security_go = convert_security_to_go(security_elem)
            securities_code += '\t' + security_go + ',\n'
    
    securities_code += '}\n\n'
    
    # Qualities - TODO: Implement full quality conversion (complex due to required/forbidden)
    qualities_code = '// DataLifestyleQualities contains lifestyle quality records\n'
    qualities_code += '// TODO: Implement full quality data generation (complex due to required/forbidden structures)\n'
    qualities_code += 'var DataLifestyleQualities = []LifestyleQuality{}\n\n'
    
    # Cities - TODO: Implement city conversion
    cities_code = '// DataCities contains city records\n'
    cities_code += '// TODO: Implement city data generation\n'
    cities_code += 'var DataCities = []City{}\n\n'
    
    data_code = helpers + categories_code + lifestyles_code + comforts_code + neighborhoods_code + securities_code + qualities_code + cities_code
    
    return data_code

def generate_test_file(xml_path):
    """Generate lifestyles_test.go with test cases"""
    
    # Parse XML to get counts
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    lifestyle_count = len(root.findall('.//lifestyle'))
    comfort_count = len(root.findall('.//comfort'))
    neighborhood_count = len(root.findall('.//neighborhood'))
    security_count = len(root.findall('.//security'))
    
    test_code = '''package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataLifestyleCategories(t *testing.T) {
	assert.NotEmpty(t, DataLifestyleCategories, "DataLifestyleCategories should not be empty")
	assert.GreaterOrEqual(t, len(DataLifestyleCategories), 6, "Should have at least 6 categories")
}

func TestDataLifestyles(t *testing.T) {
	assert.NotEmpty(t, DataLifestyles, "DataLifestyles should not be empty")
	assert.GreaterOrEqual(t, len(DataLifestyles), 10, "Should have many lifestyles")
	
	// Test that required fields are present
	for key, lifestyle := range DataLifestyles {
		assert.NotEmpty(t, lifestyle.ID, "Lifestyle %s should have ID", key)
		assert.NotEmpty(t, lifestyle.Name, "Lifestyle %s should have Name", key)
		assert.NotEmpty(t, lifestyle.Cost, "Lifestyle %s should have Cost", key)
		assert.NotEmpty(t, lifestyle.Dice, "Lifestyle %s should have Dice", key)
		assert.NotEmpty(t, lifestyle.LP, "Lifestyle %s should have LP", key)
		assert.NotEmpty(t, lifestyle.Multiplier, "Lifestyle %s should have Multiplier", key)
		assert.NotEmpty(t, lifestyle.Source, "Lifestyle %s should have Source", key)
		assert.NotEmpty(t, lifestyle.Page, "Lifestyle %s should have Page", key)
	}
}

func TestDataComforts(t *testing.T) {
	assert.NotEmpty(t, DataComforts, "DataComforts should not be empty")
	assert.GreaterOrEqual(t, len(DataComforts), 9, "Should have many comforts")
	
	// Test that required fields are present
	for i, comfort := range DataComforts {
		assert.NotEmpty(t, comfort.Name, "Comfort %d should have Name", i)
		assert.GreaterOrEqual(t, comfort.Minimum, 0, "Comfort %d should have Minimum >= 0", i)
	}
}

func TestDataNeighborhoods(t *testing.T) {
	assert.NotEmpty(t, DataNeighborhoods, "DataNeighborhoods should not be empty")
	assert.GreaterOrEqual(t, len(DataNeighborhoods), 9, "Should have many neighborhoods")
	
	// Test that required fields are present
	for i, neighborhood := range DataNeighborhoods {
		assert.NotEmpty(t, neighborhood.Name, "Neighborhood %d should have Name", i)
		assert.GreaterOrEqual(t, neighborhood.Minimum, 0, "Neighborhood %d should have Minimum >= 0", i)
	}
}

func TestDataSecurities(t *testing.T) {
	assert.NotEmpty(t, DataSecurities, "DataSecurities should not be empty")
	assert.GreaterOrEqual(t, len(DataSecurities), 9, "Should have many securities")
	
	// Test that required fields are present
	for i, security := range DataSecurities {
		assert.NotEmpty(t, security.Name, "Security %d should have Name", i)
		assert.GreaterOrEqual(t, security.Minimum, 0, "Security %d should have Minimum >= 0", i)
	}
}

func TestLifestyleFreeGrids(t *testing.T) {
	// Find a lifestyle with freegrids
	var lifestyle *Lifestyle
	for i := range DataLifestyles {
		l := DataLifestyles[i]
		if l.FreeGrids != nil && len(l.FreeGrids.FreeGrid) > 0 {
			lifestyle = &l
			break
		}
	}
	
	require.NotNil(t, lifestyle, "Should have at least one lifestyle with freegrids")
	assert.NotNil(t, lifestyle.FreeGrids, "FreeGrids should not be nil")
	assert.NotEmpty(t, lifestyle.FreeGrids.FreeGrid, "FreeGrid slice should not be empty")
	
	freegrid := lifestyle.FreeGrids.FreeGrid[0]
	assert.NotEmpty(t, freegrid.Content, "FreeGrid should have Content")
	assert.NotEmpty(t, freegrid.Select, "FreeGrid should have Select")
}
'''
    
    return test_code

def main():
    import sys
    import os
    
    # Paths
    xml_path = "data/chummerxml/lifestyles.xml"
    structs_output = "pkg/shadowrun/edition/v5/lifestyles.go"
    data_output = "pkg/shadowrun/edition/v5/lifestyles_data.go"
    test_output = "pkg/shadowrun/edition/v5/lifestyles_test.go"
    
    # Check if XML file exists
    if not os.path.exists(xml_path):
        print(f"Error: XML file not found: {xml_path}", file=sys.stderr)
        sys.exit(1)
    
    # Generate structs file
    print(f"Generating {structs_output}...")
    structs_code = generate_structs_file()
    with open(structs_output, 'w', encoding='utf-8') as f:
        f.write(structs_code)
    
    # Generate data file
    print(f"Generating {data_output}...")
    data_code = generate_data_file(xml_path)
    with open(data_output, 'w', encoding='utf-8') as f:
        f.write(data_code)
    
    # Generate test file
    print(f"Generating {test_output}...")
    test_code = generate_test_file(xml_path)
    with open(test_output, 'w', encoding='utf-8') as f:
        f.write(test_code)
    
    lifestyle_count = len(ET.parse(xml_path).getroot().findall('.//lifestyle'))
    print(f"Generated {lifestyle_count} lifestyles")
    print("Done!")

if __name__ == "__main__":
    main()

