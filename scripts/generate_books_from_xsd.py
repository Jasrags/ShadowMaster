#!/usr/bin/env python3
"""Generate books.go from books.xsd"""

import xml.etree.ElementTree as ET
import os

def generate_books():
    """Generate books.go from books.xsd"""
    
    tree = ET.parse('data/chummerxml/books.xsd')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/books.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('import "shadowmaster/pkg/shadowrun/edition/v5/common"\n\n')
        f.write('// This file contains book structures generated from books.xsd\n\n')
        
        # Generate Match struct
        f.write('// Match represents a book match entry\n')
        f.write('type Match struct {\n')
        f.write('\tLanguage string `xml:"language" json:"language"`\n')
        f.write('\tText string `xml:"text" json:"text"`\n')
        f.write('\tPage int `xml:"page" json:"page"`\n')
        f.write('}\n\n')
        
        # Generate Matches struct
        f.write('// Matches represents a collection of book matches\n')
        f.write('type Matches struct {\n')
        f.write('\tMatch []Match `xml:"match" json:"match"`\n')
        f.write('}\n\n')
        
        # Generate Book struct
        f.write('// Book represents a book definition\n')
        f.write('type Book struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tHide *string `xml:"hide,omitempty" json:"hide,omitempty"`\n')
        f.write('\tCode string `xml:"code" json:"code"`\n')
        f.write('\tPermanent *string `xml:"permanent,omitempty" json:"permanent,omitempty"`\n')
        f.write('\tMatches *Matches `xml:"matches,omitempty" json:"matches,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate Books struct
        f.write('// Books represents a collection of books\n')
        f.write('type Books struct {\n')
        f.write('\tBook []Book `xml:"book,omitempty" json:"book,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate BooksChummer struct (root element)
        f.write('// BooksChummer represents the root chummer element for books\n')
        f.write('type BooksChummer struct {\n')
        f.write('\tVersion *string `xml:"version,omitempty" json:"version,omitempty"`\n')
        f.write('\tBooks []Books `xml:"books,omitempty" json:"books,omitempty"`\n')
        f.write('}\n\n')
    
    print("Generated books.go")

if __name__ == '__main__':
    print("Generating books from books.xsd...")
    generate_books()
    print("Done!")

