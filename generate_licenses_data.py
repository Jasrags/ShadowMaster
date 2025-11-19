#!/usr/bin/env python3
"""Generate licenses_data.go from licenses.json"""

import json

def main():
    with open("data/chummer/licenses.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    licenses = data["licenses"]["license"]
    
    print("package v5")
    print()
    print("// DataLicenses contains all license names from Shadowrun 5th Edition")
    print("var DataLicenses = []string{")
    for license in licenses:
        print(f'	{json.dumps(license)},')
    print("}")

if __name__ == "__main__":
    main()

