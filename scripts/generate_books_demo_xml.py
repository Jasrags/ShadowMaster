#!/usr/bin/env python3
"""Generate books.go, books_data.go, and books_test.go from books.xml using XSD schema"""

import xml.etree.ElementTree as ET
import json
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
    """Generate books.go with struct definitions based on XSD"""
    
    structs_code = '''package v5

// Chummer represents the root element of the books XML file
type Chummer struct {
	Version string     `xml:"version,omitempty" json:"version,omitempty"`
	Books   BookList   `xml:"books,omitempty" json:"books,omitempty"`
}

// BookList represents the collection of book elements
type BookList struct {
	Book []Book `xml:"book,omitempty" json:"book,omitempty"`
}

// Book represents a sourcebook from Shadowrun 5th Edition
// This supports both XML parsing (from chummerxml) and JSON marshaling
type Book struct {
	// Required fields (minOccurs="1")
	ID   string `xml:"id" json:"id"`         // Unique identifier (UUID)
	Name string `xml:"name" json:"name"`     // Book name
	Code string `xml:"code" json:"code"`     // Book code like "SR5", "RG", "SG", etc.

	// Optional fields
	Hide      string       `xml:"hide,omitempty" json:"hide,omitempty"`           // Hide flag (if present)
	Permanent string       `xml:"permanent,omitempty" json:"permanent,omitempty"` // Permanent flag (empty element = present, absent = not present)
	Matches   *BookMatches `xml:"matches,omitempty" json:"matches,omitempty"`     // Text matches for book identification
}

// BookMatches represents a collection of match elements
type BookMatches struct {
	Match []BookMatch `xml:"match,omitempty" json:"match,omitempty"`
}

// BookMatch represents a match entry for a book (used for identifying books by text)
type BookMatch struct {
	Language string `xml:"language" json:"language"` // Language code like "en-us", "de-de", "fr-fr"
	Text     string `xml:"text" json:"text"`         // Matching text snippet
	Page     int    `xml:"page" json:"page"`         // Page number where the text appears (xs:int in XSD)
}
'''
    return structs_code

def convert_match_to_go(match_elem):
    """Convert an XML match element to Go struct literal"""
    language = match_elem.find('language')
    text = match_elem.find('text')
    page = match_elem.find('page')
    
    lang_val = language.text if language is not None and language.text else ""
    text_val = text.text if text is not None and text.text else ""
    try:
        page_val = int(page.text) if page is not None and page.text else 0
    except (ValueError, TypeError):
        page_val = 0
    
    return f'BookMatch{{Language: {escape_go_string(lang_val)}, Text: {escape_go_string(text_val)}, Page: {page_val}}}'

def convert_book_to_go(book_elem, index):
    """Convert an XML book element to Go struct literal"""
    # Required fields
    id_elem = book_elem.find('id')
    name_elem = book_elem.find('name')
    code_elem = book_elem.find('code')
    
    id_val = id_elem.text if id_elem is not None and id_elem.text else ""
    name_val = name_elem.text if name_elem is not None and name_elem.text else ""
    code_val = code_elem.text if code_elem is not None and code_elem.text else ""
    
    # Optional fields
    hide_elem = book_elem.find('hide')
    hide_val = hide_elem.text if hide_elem is not None and hide_elem.text else ""
    
    # Permanent is tricky - empty element means present, absent means not present
    permanent_elem = book_elem.find('permanent')
    permanent_present = permanent_elem is not None
    permanent_val = "1" if permanent_present else ""  # Use "1" as indicator, empty string for absent
    
    # Matches
    matches_elem = book_elem.find('matches')
    matches_str = "nil"
    if matches_elem is not None:
        match_elems = matches_elem.findall('match')
        if match_elems:
            match_strs = [convert_match_to_go(m) + ',' for m in match_elems]
            matches_list = '\n\t\t\t' + '\n\t\t\t'.join(match_strs)
            matches_str = f"&BookMatches{{Match: []BookMatch{{{matches_list}\n\t\t}}}}"
    
    # Format the struct
    result = f'''\t{{
\t\tID: {escape_go_string(id_val)},
\t\tName: {escape_go_string(name_val)},
\t\tCode: {escape_go_string(code_val)},'''
    
    if hide_val:
        result += f'\n\t\tHide: {escape_go_string(hide_val)},'
    
    if permanent_present:
        result += f'\n\t\tPermanent: {escape_go_string(permanent_val)},'
    
    if matches_str != "nil":
        result += f'\n\t\tMatches: {matches_str},'
    
    result += '\n\t}'
    return result

def generate_data_file(xml_path):
    """Generate books_data.go from XML file"""
    
    # Parse XML
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Find all book elements
    books_elem = root.find('books')
    if books_elem is None:
        raise ValueError("No <books> element found in XML")
    
    book_elems = books_elem.findall('book')
    
    # Generate Go code
    data_code = '''package v5

// DataBooks contains all book records parsed from books.xml
// This data is embedded directly in the code for performance and reliability
var DataBooks = []Book{
'''
    
    for i, book_elem in enumerate(book_elems):
        book_go = convert_book_to_go(book_elem, i)
        data_code += book_go
        # Always add trailing comma (Go allows it, makes diffs cleaner)
        data_code += ',\n'
    
    data_code += '}\n'
    
    return data_code

def generate_test_file(xml_path):
    """Generate books_test.go with test cases"""
    
    # Parse XML to get book count and sample books
    tree = ET.parse(xml_path)
    root = tree.getroot()
    books_elem = root.find('books')
    if books_elem is None:
        raise ValueError("No <books> element found in XML")
    
    book_elems = books_elem.findall('book')
    
    # Find a book with permanent flag
    permanent_book = None
    for book_elem in book_elems:
        if book_elem.find('permanent') is not None:
            permanent_elem = book_elem.find('name')
            if permanent_elem is not None and permanent_elem.text:
                permanent_book = permanent_elem.text
                break
    
    # Get first few book names for test cases
    test_books = []
    for i, book_elem in enumerate(book_elems[:5]):
        name_elem = book_elem.find('name')
        code_elem = book_elem.find('code')
        if name_elem is not None and name_elem.text and code_elem is not None and code_elem.text:
            test_books.append({
                'name': name_elem.text,
                'code': code_elem.text
            })
    
    test_code = '''package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataBooks(t *testing.T) {
	assert.NotEmpty(t, DataBooks, "DataBooks should not be empty")
	assert.Greater(t, len(DataBooks), 60, "Should have many books")
	assert.Less(t, len(DataBooks), 70, "Should not have too many books")
}
'''
    
    # Add tests for specific books
    if test_books:
        test_code += '\nfunc TestDataBooksSpecific(t *testing.T) {\n'
        test_code += '\ttests := []struct {\n'
        test_code += '\t\tname         string\n'
        test_code += '\t\tcode         string\n'
        test_code += '\t\texpectedName string\n'
        test_code += '\t}{\n'
        
        for book in test_books:
            test_code += f'\t\t{{\n'
            test_code += f'\t\t\tname:         "{book["name"]}",\n'
            test_code += f'\t\t\tcode:         "{book["code"]}",\n'
            test_code += f'\t\t\texpectedName: {escape_go_string(book["name"])},\n'
            test_code += f'\t\t}},\n'
        
        test_code += '\t}\n\n'
        test_code += '\tfor _, tt := range tests {\n'
        test_code += '\t\tt.Run(tt.name, func(t *testing.T) {\n'
        test_code += '\t\t\tvar found *Book\n'
        test_code += '\t\t\tfor i := range DataBooks {\n'
        test_code += '\t\t\t\tif DataBooks[i].Code == tt.code {\n'
        test_code += '\t\t\t\t\tfound = &DataBooks[i]\n'
        test_code += '\t\t\t\t\tbreak\n'
        test_code += '\t\t\t\t}\n'
        test_code += '\t\t\t}\n'
        test_code += '\t\t\trequire.NotNil(t, found, "Book with code %s should exist", tt.code)\n'
        test_code += '\t\t\tassert.Equal(t, tt.expectedName, found.Name)\n'
        test_code += '\t\t\tassert.Equal(t, tt.code, found.Code)\n'
        test_code += '\t\t\tassert.NotEmpty(t, found.ID, "ID should not be empty")\n'
        test_code += '\t\t})\n'
        test_code += '\t}\n'
        test_code += '}\n'
    
    # Add test for book fields
    test_code += '''
func TestBookFields(t *testing.T) {
	// Find first book
	require.NotEmpty(t, DataBooks, "DataBooks should not be empty")
	book := DataBooks[0]

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return book.ID != "" }},
		{"Name", "Name", func() bool { return book.Name != "" }},
		{"Code", "Code", func() bool { return book.Code != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestBookWithMatches(t *testing.T) {
	// Find a book with matches
	var book *Book
	for i := range DataBooks {
		if DataBooks[i].Matches != nil && len(DataBooks[i].Matches.Match) > 0 {
			book = &DataBooks[i]
			break
		}
	}

	require.NotNil(t, book, "Should have at least one book with matches")
	assert.NotNil(t, book.Matches, "Matches should not be nil")
	assert.NotEmpty(t, book.Matches.Match, "Match slice should not be empty")

	match := book.Matches.Match[0]
	assert.NotEmpty(t, match.Language, "Language should not be empty")
	assert.NotEmpty(t, match.Text, "Text should not be empty")
	assert.Greater(t, match.Page, 0, "Page should be greater than 0")
}
'''
    
    # Add test for permanent books if found
    if permanent_book:
        test_code += f'''
func TestBookPermanent(t *testing.T) {{
	// Find permanent book
	var book *Book
	for i := range DataBooks {{
		if DataBooks[i].Permanent != "" {{
			book = &DataBooks[i]
			break
		}}
	}}

	require.NotNil(t, book, "Should have at least one permanent book")
	assert.Equal(t, {escape_go_string(permanent_book)}, book.Name)
	assert.NotEmpty(t, book.Permanent, "Permanent field should be set")
}}
'''
    
    test_code += '\n'
    
    return test_code

def main():
    import sys
    import os
    
    # Paths
    xml_path = "data/chummerxml/books.xml"
    structs_output = "pkg/shadowrun/edition/v5/books.go"
    data_output = "pkg/shadowrun/edition/v5/books_data.go"
    test_output = "pkg/shadowrun/edition/v5/books_test.go"
    
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
    
    book_count = len(ET.parse(xml_path).getroot().find('books').findall('book'))
    print(f"Generated {book_count} books")
    print("Done!")

if __name__ == "__main__":
    main()
