#!/usr/bin/env python3
"""Generate strings_data.go from strings.json"""

import json

def main():
    with open("data/chummer/strings.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Matrix attributes
    matrix_attrs = data.get("matrixattributes", {}).get("key", [])
    print("// DataMatrixAttributes contains matrix attribute string keys")
    print("var DataMatrixAttributes = []string{")
    for attr in matrix_attrs:
        print(f'\t{json.dumps(attr)},')
    print("}")
    print()
    
    # Elements
    elements = data.get("elements", {}).get("element", [])
    print("// DataElements contains element names")
    print("var DataElements = []string{")
    for element in elements:
        print(f'\t{json.dumps(element)},')
    print("}")
    print()
    
    # Immunities
    immunities = data.get("immunities", {}).get("immunity", [])
    print("// DataImmunities contains immunity types")
    print("var DataImmunities = []string{")
    for immunity in immunities:
        print(f'\t{json.dumps(immunity)},')
    print("}")
    print()
    
    # Spirit categories
    spirit_cats = data.get("spiritcategories", {}).get("category", [])
    print("// DataSpiritCategories contains spirit category names")
    print("var DataSpiritCategories = []string{")
    for cat in spirit_cats:
        print(f'\t{json.dumps(cat)},')
    print("}")

if __name__ == "__main__":
    main()

