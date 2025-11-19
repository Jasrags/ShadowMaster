#!/usr/bin/env python3
"""Generate sheets_data.go from sheets.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_sheet_to_go(sheet, sheet_id):
    """Convert a sheet object to Go struct literal"""
    sheet_id_str = sheet["id"]
    name = sheet["name"]
    filename = sheet["filename"]
    
    return f'''		{{
			ID: "{sheet_id_str}",
			Name: {json.dumps(name)},
			Filename: {json.dumps(filename)},
		}},'''

def convert_sheet_to_map_entry(sheet, sheet_id):
    """Convert a sheet object to Go map entry"""
    sheet_id_str = sheet["id"]
    name = sheet["name"]
    filename = sheet["filename"]
    
    return f'''	"{sheet_id}": {{
		ID: "{sheet_id_str}",
		Name: {json.dumps(name)},
		Filename: {json.dumps(filename)},
	}},'''

def main():
    with open("data/chummer/sheets.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Sheets by language
    sheets_by_lang = data["sheets"]
    print("// DataSheetsByLanguage contains sheet records grouped by language")
    print("var DataSheetsByLanguage = []SheetLanguageGroup{")
    
    for lang_group in sheets_by_lang:
        lang = lang_group["+@lang"]
        sheets = lang_group["sheet"]
        
        print(f'\t{{')
        print(f'\t\tLang: {json.dumps(lang)},')
        print(f'\t\tSheet: []Sheet{{')
        
        for sheet in sheets:
            name = sheet["name"]
            sheet_id = to_snake_case(name)
            print(convert_sheet_to_go(sheet, sheet_id))
        
        print(f'\t\t}},')
        print(f'\t}},')
    
    print("}")
    print()
    
    # Also create a flat map of all sheets by ID
    # Note: Same sheet IDs appear in multiple languages, so we only add each ID once
    print("// DataSheets contains all sheet records keyed by their ID (UUID)")
    print("// Note: Sheets appear in multiple languages, so we use the first occurrence of each ID")
    print("var DataSheets = map[string]Sheet{")
    
    seen_ids = set()
    for lang_group in sheets_by_lang:
        sheets = lang_group["sheet"]
        for sheet in sheets:
            sheet_id_str = sheet["id"]
            if sheet_id_str not in seen_ids:
                seen_ids.add(sheet_id_str)
                # Use the UUID as the key for the flat map
                print(convert_sheet_to_map_entry(sheet, sheet_id_str))
    
    print("}")

if __name__ == "__main__":
    main()

