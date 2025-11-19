#!/usr/bin/env python3
"""Generate options_data.go from options.json"""

import json
import re

def to_snake_case(name):
    """Convert a name to snake_case for use as a map key"""
    # Replace spaces and special chars with underscores
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def convert_string_ptr(value):
    """Convert a value to *string or nil"""
    if value is None:
        return "nil"
    if isinstance(value, str):
        if value == "":
            return "nil"
        return f'&[]string{{{json.dumps(value)}}}[0]'
    return "nil"

def convert_limbcount_to_go(limb, limb_id):
    """Convert a limb count to Go struct literal"""
    name = limb["name"]
    limbcount = limb["limbcount"]
    exclude_str = convert_string_ptr(limb.get("exclude"))
    
    parts = [
        f'Name: {json.dumps(name)}',
        f'LimbCount: {json.dumps(limbcount)}',
    ]
    
    if exclude_str != "nil":
        parts.append(f"Exclude: {exclude_str}")
    
    return f'''	"{limb_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def convert_pdfargument_to_go(pdfarg, pdfarg_id):
    """Convert a PDF argument to Go struct literal"""
    name = pdfarg["name"]
    value = pdfarg["value"]
    
    parts = [
        f'Name: {json.dumps(name)}',
        f'Value: {json.dumps(value)}',
    ]
    
    if "appnames" in pdfarg and pdfarg["appnames"]:
        appnames = pdfarg["appnames"]["appname"]
        appname_strs = [json.dumps(app) for app in appnames]
        appname_list = ', '.join(appname_strs)
        parts.append(f"AppNames: &PDFArgumentAppNames{{AppName: []string{{{appname_list}}}}}")
    
    return f'''	"{pdfarg_id}": {{
		{",\n\t\t".join(parts)},
	}},'''

def convert_availmap_to_go(avail, avail_id):
    """Convert an avail map entry to Go struct literal"""
    avail_id_str = avail["id"]
    value = avail["value"]
    duration = avail["duration"]
    interval = avail["interval"]
    
    return f'''	"{avail_id}": {{
		ID: "{avail_id_str}",
		Value: {json.dumps(value)},
		Duration: {json.dumps(duration)},
		Interval: {json.dumps(interval)},
	}},'''

def main():
    with open("data/chummer/options.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("package v5")
    print()
    
    # Limb counts
    limbs = data["limbcounts"]["limb"]
    print("// DataLimbCounts contains limb count options keyed by their ID (lowercase with underscores)")
    print("var DataLimbCounts = map[string]LimbCount{")
    
    used_limb_ids = {}
    for limb in limbs:
        name = limb["name"]
        limb_id = to_snake_case(name)
        
        original_id = limb_id
        suffix = 0
        while limb_id in used_limb_ids:
            suffix += 1
            limb_id = f"{original_id}_{suffix}"
        
        used_limb_ids[limb_id] = True
        print(convert_limbcount_to_go(limb, limb_id))
    
    print("}")
    print()
    
    # PDF arguments
    pdfargs = data["pdfarguments"]["pdfargument"]
    print("// DataPDFArguments contains PDF argument configurations keyed by their ID (lowercase with underscores)")
    print("var DataPDFArguments = map[string]PDFArgument{")
    
    used_pdfarg_ids = {}
    for pdfarg in pdfargs:
        name = pdfarg["name"]
        pdfarg_id = to_snake_case(name)
        
        original_id = pdfarg_id
        suffix = 0
        while pdfarg_id in used_pdfarg_ids:
            suffix += 1
            pdfarg_id = f"{original_id}_{suffix}"
        
        used_pdfarg_ids[pdfarg_id] = True
        print(convert_pdfargument_to_go(pdfarg, pdfarg_id))
    
    print("}")
    print()
    
    # Black market pipeline categories
    cats = data["blackmarketpipelinecategories"]["category"]
    print("// DataBlackMarketPipelineCategories contains black market pipeline category names")
    print("var DataBlackMarketPipelineCategories = []string{")
    for cat in cats:
        print(f'	{json.dumps(cat)},')
    print("}")
    print()
    
    # Avail map
    avails = data["availmap"]["avail"]
    print("// DataAvailMap contains availability mapping entries keyed by their ID (lowercase with underscores)")
    print("var DataAvailMap = map[string]AvailMapEntry{")
    
    used_avail_ids = {}
    for avail in avails:
        # Use value as the key
        value = avail["value"]
        avail_id = to_snake_case(value)
        
        original_id = avail_id
        suffix = 0
        while avail_id in used_avail_ids:
            suffix += 1
            avail_id = f"{original_id}_{suffix}"
        
        used_avail_ids[avail_id] = True
        print(convert_availmap_to_go(avail, avail_id))
    
    print("}")

if __name__ == "__main__":
    main()

