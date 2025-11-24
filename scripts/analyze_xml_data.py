#!/usr/bin/env python3
"""Analyze XML data files to extract field statistics and patterns"""

import xml.etree.ElementTree as ET
import json
import re
import os
from collections import defaultdict, Counter
from typing import Dict, List, Set, Any, Optional
from pathlib import Path

def is_numeric_string(value: str) -> bool:
    """Check if a string represents a number"""
    if not value or not isinstance(value, str):
        return False
    # Remove whitespace
    value = value.strip()
    if not value:
        return False
    # Check for pure integer
    try:
        int(value)
        return True
    except ValueError:
        pass
    # Check for float
    try:
        float(value)
        return True
    except ValueError:
        pass
    # Check for expressions like "(Rating * 30)" or "10(c) + energy"
    if re.match(r'^[0-9+\-*/().\s]+$', value):
        return True
    return False

def is_boolean_string(value: str) -> bool:
    """Check if a string represents a boolean"""
    if not value or not isinstance(value, str):
        return False
    value = value.strip().lower()
    return value in ('true', 'false', 'yes', 'no', '1', '0', 'y', 'n')

def is_enum_candidate(values: Set[str], min_unique: int = 2, max_unique: int = 50) -> bool:
    """Determine if a set of values could be an enum"""
    unique_count = len(values)
    if unique_count < min_unique or unique_count > max_unique:
        return False
    # If all values are short strings, likely enum
    if all(len(v) < 50 for v in values if v):
        return True
    return False

def analyze_element(element: ET.Element, path: str = "", stats: Dict[str, Any] = None) -> Dict[str, Any]:
    """Recursively analyze an XML element and its children"""
    if stats is None:
        stats = {
            'fields': defaultdict(lambda: {
                'count': 0,
                'values': set(),
                'examples': [],
                'numeric_count': 0,
                'boolean_count': 0,
                'empty_count': 0,
                'min_length': float('inf'),
                'max_length': 0,
            }),
            'elements': defaultdict(int),
            'attributes': defaultdict(lambda: {
                'count': 0,
                'values': set(),
                'examples': [],
            }),
        }
    
    # Track element occurrence
    tag = element.tag
    full_path = f"{path}/{tag}" if path else tag
    stats['elements'][full_path] += 1
    
    # Analyze attributes
    for attr_name, attr_value in element.attrib.items():
        attr_key = f"{full_path}@{attr_name}"
        attr_stats = stats['attributes'][attr_key]
        attr_stats['count'] += 1
        if attr_value:
            attr_stats['values'].add(attr_value)
            if len(attr_stats['examples']) < 5:
                attr_stats['examples'].append(attr_value)
    
    # Analyze text content
    text = element.text
    if text and text.strip():
        field_key = full_path
        field_stats = stats['fields'][field_key]
        field_stats['count'] += 1
        text = text.strip()
        
        # Store value
        field_stats['values'].add(text)
        
        # Store examples (up to 10)
        if len(field_stats['examples']) < 10:
            field_stats['examples'].append(text)
        
        # Analyze patterns
        if is_numeric_string(text):
            field_stats['numeric_count'] += 1
        if is_boolean_string(text):
            field_stats['boolean_count'] += 1
        if not text:
            field_stats['empty_count'] += 1
        
        # Track length
        length = len(text)
        field_stats['min_length'] = min(field_stats['min_length'], length)
        field_stats['max_length'] = max(field_stats['max_length'], length)
    
    # Recursively analyze children
    for child in element:
        analyze_element(child, full_path, stats)
    
    # Analyze tail text (text after element)
    if element.tail and element.tail.strip():
        tail_text = element.tail.strip()
        # This is less common, but track it
        tail_key = f"{full_path}#tail"
        if tail_key not in stats['fields']:
            stats['fields'][tail_key] = {
                'count': 0,
                'values': set(),
                'examples': [],
                'numeric_count': 0,
                'boolean_count': 0,
                'empty_count': 0,
                'min_length': float('inf'),
                'max_length': 0,
            }
        tail_stats = stats['fields'][tail_key]
        tail_stats['count'] += 1
        tail_stats['values'].add(tail_text)
        if len(tail_stats['examples']) < 5:
            tail_stats['examples'].append(tail_text)
    
    return stats

def analyze_xml_file(xml_path: str, root_element: Optional[str] = None) -> Dict[str, Any]:
    """Analyze a single XML file"""
    print(f"Analyzing {xml_path}...")
    
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        # If root_element specified, find it
        if root_element:
            found = root.find(f'.//{root_element}')
            if found is not None:
                root = found
        
        stats = analyze_element(root)
        
        # Post-process statistics
        result = {
            'file': os.path.basename(xml_path),
            'file_path': xml_path,
            'root_element': root.tag,
            'total_elements': sum(stats['elements'].values()),
            'fields': {},
            'attributes': {},
            'summary': {
                'unique_fields': len(stats['fields']),
                'unique_attributes': len(stats['attributes']),
                'unique_elements': len(stats['elements']),
            }
        }
        
        # Process fields
        for field_path, field_stats in stats['fields'].items():
            values = field_stats['values']
            total_count = field_stats['count']
            
            # Determine type patterns
            type_patterns = []
            if field_stats['numeric_count'] > total_count * 0.8:
                type_patterns.append('numeric_string')
            elif field_stats['numeric_count'] > 0:
                type_patterns.append('mixed_numeric')
            
            if field_stats['boolean_count'] > total_count * 0.8:
                type_patterns.append('boolean_string')
            elif field_stats['boolean_count'] > 0:
                type_patterns.append('mixed_boolean')
            
            if is_enum_candidate(values):
                type_patterns.append('enum_candidate')
            
            # Calculate presence rate
            presence_rate = field_stats['count'] / total_count if total_count > 0 else 0
            
            result['fields'][field_path] = {
                'count': field_stats['count'],
                'presence_rate': presence_rate,
                'unique_values': len(values),
                'examples': field_stats['examples'][:10],
                'type_patterns': type_patterns,
                'numeric_ratio': field_stats['numeric_count'] / total_count if total_count > 0 else 0,
                'boolean_ratio': field_stats['boolean_count'] / total_count if total_count > 0 else 0,
                'min_length': field_stats['min_length'] if field_stats['min_length'] != float('inf') else 0,
                'max_length': field_stats['max_length'],
                'all_values': list(values) if len(values) <= 20 else list(values)[:20],  # Limit for JSON
                'is_enum_candidate': is_enum_candidate(values),
            }
        
        # Process attributes
        for attr_path, attr_stats in stats['attributes'].items():
            result['attributes'][attr_path] = {
                'count': attr_stats['count'],
                'unique_values': len(attr_stats['values']),
                'examples': attr_stats['examples'][:10],
                'all_values': list(attr_stats['values']) if len(attr_stats['values']) <= 20 else list(attr_stats['values'])[:20],
                'is_enum_candidate': is_enum_candidate(attr_stats['values']),
            }
        
        return result
        
    except Exception as e:
        print(f"Error analyzing {xml_path}: {e}")
        return {
            'file': os.path.basename(xml_path),
            'file_path': xml_path,
            'error': str(e)
        }

def analyze_multiple_files(xml_files: List[str], output_path: str = None) -> Dict[str, Any]:
    """Analyze multiple XML files"""
    results = {}
    
    for xml_file in xml_files:
        if not os.path.exists(xml_file):
            print(f"Warning: {xml_file} not found, skipping")
            continue
        
        result = analyze_xml_file(xml_file)
        file_key = os.path.basename(xml_file).replace('.xml', '')
        results[file_key] = result
    
    if output_path:
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Analysis saved to {output_path}")
    
    return results

def main():
    """Main entry point"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: analyze_xml_data.py <xml_file1> [xml_file2 ...] [-o output.json]")
        print("   or: analyze_xml_data.py --all [data_dir] [-o output.json]")
        sys.exit(1)
    
    xml_files = []
    output_path = None
    data_dir = 'data/chummerxml'
    
    i = 1
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == '-o' or arg == '--output':
            if i + 1 < len(sys.argv):
                output_path = sys.argv[i + 1]
                i += 2
            else:
                print("Error: -o requires output path")
                sys.exit(1)
        elif arg == '--all':
            # Find all XML files in data directory
            if i + 1 < len(sys.argv) and not sys.argv[i + 1].startswith('-'):
                data_dir = sys.argv[i + 1]
                i += 1
            data_path = Path(data_dir)
            xml_files = [str(f) for f in data_path.glob('*.xml')]
            i += 1
        elif arg.startswith('-'):
            print(f"Unknown option: {arg}")
            sys.exit(1)
        else:
            xml_files.append(arg)
            i += 1
    
    if not xml_files:
        print("No XML files specified")
        sys.exit(1)
    
    results = analyze_multiple_files(xml_files, output_path)
    
    # Print summary
    print("\n=== Analysis Summary ===")
    for file_key, result in results.items():
        if 'error' in result:
            print(f"{file_key}: ERROR - {result['error']}")
        else:
            print(f"{file_key}: {result['summary']['unique_fields']} fields, "
                  f"{result['summary']['unique_attributes']} attributes, "
                  f"{result['summary']['unique_elements']} element types")

if __name__ == '__main__':
    main()

