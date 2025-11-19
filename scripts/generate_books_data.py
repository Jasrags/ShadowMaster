#!/usr/bin/env python3
"""Generate books_data.go from books.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_match_to_go(match):
    """Convert a match object to Go struct literal"""
    if isinstance(match, dict):
        return f'BookMatch{{Language: "{match["language"]}", Text: {json.dumps(match["text"])}, Page: "{match["page"]}"}}'
    return "nil"

def convert_matches_to_go(matches):
    """Convert matches object to Go struct literal"""
    if not matches or "match" not in matches:
        return "nil"
    
    match = matches["match"]
    if match is None:
        return "nil"
    
    if isinstance(match, list):
        if len(match) == 0:
            return "nil"
        match_strs = [convert_match_to_go(m) for m in match]
        matches_list = ', '.join(match_strs)
        # Use string formatting to avoid f-string brace issues
        return "&BookMatches{Match: []interface{}{" + matches_list + "}}"
    elif isinstance(match, dict):
        match_str = convert_match_to_go(match)
        return f"&BookMatches{{Match: {match_str}}}"
    
    return "nil"

def convert_book_to_go(book, book_id):
    """Convert a book object to Go struct literal"""
    name = book["name"]
    code = book["code"]
    book_id_str = book["id"]
    
    # Handle permanent field
    permanent_str = "nil"
    if "permanent" in book and book["permanent"] is not None:
        permanent_str = f"&[]bool{{{str(book['permanent']).lower()}}}[0]"
    
    # Handle matches
    matches_str = "nil"
    if "matches" in book and book["matches"]:
        matches_str = convert_matches_to_go(book["matches"])
    
    return f'''	"{book_id}": {{
		ID: "{book_id_str}",
		Name: {json.dumps(name)},
		Code: "{code}",
		Permanent: {permanent_str},
		Matches: {matches_str},
	}},'''

def main():
    with open("data/chummer/books.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    books = data["books"]["book"]
    
    print("package v5")
    print()
    print("// DataBooks contains book records keyed by their ID (lowercase with underscores)")
    print("var DataBooks = map[string]Book{")
    
    for book in books:
        # Use code as the key (it's unique and more readable than UUID)
        # But we need to handle duplicates - let's use a combination
        code = book["code"]
        name = book["name"]
        
        # Create a unique key from code, handling duplicates
        book_id = to_snake_case(code)
        
        # Check for duplicates by using name as fallback
        # For now, just use code - if there are duplicates we'll handle them
        print(convert_book_to_go(book, book_id))
    
    print("}")

if __name__ == "__main__":
    main()

