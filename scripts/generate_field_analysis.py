#!/usr/bin/env python3
"""Generate markdown analysis reports from JSON analysis data"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Any, List

def format_field_name(field_path: str) -> str:
    """Format field path for display"""
    # Remove namespace prefixes and clean up
    parts = field_path.split('/')
    return parts[-1] if parts else field_path

def format_type_patterns(patterns: List[str]) -> str:
    """Format type patterns for display"""
    if not patterns:
        return "string"
    return ", ".join(patterns)

def generate_field_section(fields: Dict[str, Any], title: str = "Fields") -> str:
    """Generate markdown section for fields"""
    lines = [f"## {title}\n"]
    
    # Sort fields by count (most common first)
    sorted_fields = sorted(fields.items(), key=lambda x: x[1].get('count', 0), reverse=True)
    
    for field_path, field_data in sorted_fields:
        field_name = format_field_name(field_path)
        count = field_data.get('count', 0)
        presence_rate = field_data.get('presence_rate', 0)
        unique_values = field_data.get('unique_values', 0)
        type_patterns = field_data.get('type_patterns', [])
        examples = field_data.get('examples', [])
        numeric_ratio = field_data.get('numeric_ratio', 0)
        boolean_ratio = field_data.get('boolean_ratio', 0)
        is_enum = field_data.get('is_enum_candidate', False)
        min_length = field_data.get('min_length', 0)
        max_length = field_data.get('max_length', 0)
        
        lines.append(f"### {field_name}")
        lines.append(f"**Path**: `{field_path}`\n")
        lines.append(f"- **Count**: {count}")
        lines.append(f"- **Presence Rate**: {presence_rate:.1%}")
        lines.append(f"- **Unique Values**: {unique_values}")
        lines.append(f"- **Type Patterns**: {format_type_patterns(type_patterns)}")
        
        if numeric_ratio > 0:
            lines.append(f"- **Numeric Ratio**: {numeric_ratio:.1%}")
        if boolean_ratio > 0:
            lines.append(f"- **Boolean Ratio**: {boolean_ratio:.1%}")
        if is_enum:
            lines.append(f"- **Enum Candidate**: Yes")
        if min_length > 0 or max_length > 0:
            lines.append(f"- **Length Range**: {min_length}-{max_length} characters")
        
        if examples:
            lines.append(f"- **Examples**:")
            for example in examples[:5]:
                # Escape markdown special characters
                example_str = str(example).replace('|', '\\|').replace('`', '\\`')
                lines.append(f"  - `{example_str}`")
        
        # Show all values if enum candidate and reasonable size
        if is_enum and unique_values <= 30:
            all_values = field_data.get('all_values', [])
            if all_values:
                lines.append(f"- **All Values**: {', '.join(sorted(all_values))}")
        
        lines.append("")
    
    return "\n".join(lines)

def generate_attributes_section(attributes: Dict[str, Any]) -> str:
    """Generate markdown section for attributes"""
    if not attributes:
        return ""
    
    lines = ["## Attributes\n"]
    
    sorted_attrs = sorted(attributes.items(), key=lambda x: x[1].get('count', 0), reverse=True)
    
    for attr_path, attr_data in sorted_attrs:
        attr_name = format_field_name(attr_path)
        count = attr_data.get('count', 0)
        unique_values = attr_data.get('unique_values', 0)
        examples = attr_data.get('examples', [])
        is_enum = attr_data.get('is_enum_candidate', False)
        
        lines.append(f"### {attr_name}")
        lines.append(f"**Path**: `{attr_path}`\n")
        lines.append(f"- **Count**: {count}")
        lines.append(f"- **Unique Values**: {unique_values}")
        
        if is_enum:
            lines.append(f"- **Enum Candidate**: Yes")
        
        if examples:
            lines.append(f"- **Examples**:")
            for example in examples[:5]:
                example_str = str(example).replace('|', '\\|').replace('`', '\\`')
                lines.append(f"  - `{example_str}`")
        
        if is_enum and unique_values <= 30:
            all_values = attr_data.get('all_values', [])
            if all_values:
                lines.append(f"- **All Values**: {', '.join(sorted(all_values))}")
        
        lines.append("")
    
    return "\n".join(lines)

def generate_summary_section(result: Dict[str, Any]) -> str:
    """Generate summary section"""
    summary = result.get('summary', {})
    lines = ["## Summary\n"]
    lines.append(f"- **Total Elements**: {result.get('total_elements', 0)}")
    lines.append(f"- **Unique Fields**: {summary.get('unique_fields', 0)}")
    lines.append(f"- **Unique Attributes**: {summary.get('unique_attributes', 0)}")
    lines.append(f"- **Unique Element Types**: {summary.get('unique_elements', 0)}")
    lines.append("")
    return "\n".join(lines)

def generate_type_recommendations_section(fields: Dict[str, Any]) -> str:
    """Generate type improvement recommendations"""
    lines = ["## Type Improvement Recommendations\n"]
    
    enum_candidates = []
    numeric_candidates = []
    boolean_candidates = []
    
    for field_path, field_data in fields.items():
        field_name = format_field_name(field_path)
        type_patterns = field_data.get('type_patterns', [])
        numeric_ratio = field_data.get('numeric_ratio', 0)
        boolean_ratio = field_data.get('boolean_ratio', 0)
        is_enum = field_data.get('is_enum_candidate', False)
        
        if is_enum and 'enum_candidate' in type_patterns:
            enum_candidates.append((field_name, field_path, field_data))
        elif numeric_ratio > 0.9:
            numeric_candidates.append((field_name, field_path, field_data))
        elif boolean_ratio > 0.9:
            boolean_candidates.append((field_name, field_path, field_data))
    
    if enum_candidates:
        lines.append("### Enum Candidates")
        for field_name, field_path, field_data in enum_candidates:
            unique_values = field_data.get('unique_values', 0)
            lines.append(f"- **{field_name}** (`{field_path}`): {unique_values} unique values")
            all_values = field_data.get('all_values', [])
            if all_values and len(all_values) <= 20:
                lines.append(f"  - Values: {', '.join(sorted(all_values))}")
        lines.append("")
    
    if numeric_candidates:
        lines.append("### Numeric Type Candidates")
        for field_name, field_path, field_data in numeric_candidates:
            numeric_ratio = field_data.get('numeric_ratio', 0)
            examples = field_data.get('examples', [])[:3]
            lines.append(f"- **{field_name}** (`{field_path}`): {numeric_ratio:.1%} numeric")
            if examples:
                lines.append(f"  - Examples: {', '.join(str(e) for e in examples)}")
        lines.append("")
    
    if boolean_candidates:
        lines.append("### Boolean Type Candidates")
        for field_name, field_path, field_data in boolean_candidates:
            boolean_ratio = field_data.get('boolean_ratio', 0)
            examples = field_data.get('examples', [])[:3]
            lines.append(f"- **{field_name}** (`{field_path}`): {boolean_ratio:.1%} boolean")
            if examples:
                lines.append(f"  - Examples: {', '.join(str(e) for e in examples)}")
        lines.append("")
    
    if not enum_candidates and not numeric_candidates and not boolean_candidates:
        lines.append("No type improvement recommendations identified.\n")
    
    return "\n".join(lines)

def generate_report(result: Dict[str, Any], output_path: str = None) -> str:
    """Generate markdown report from analysis result"""
    file_name = result.get('file', 'unknown')
    root_element = result.get('root_element', 'unknown')
    
    if 'error' in result:
        lines = [f"# Analysis Report: {file_name}\n"]
        lines.append(f"**Error**: {result['error']}\n")
        return "\n".join(lines)
    
    lines = [f"# Analysis Report: {file_name}\n"]
    lines.append(f"**File**: `{result.get('file_path', file_name)}`")
    lines.append(f"**Root Element**: `{root_element}`\n")
    lines.append("---\n")
    
    # Summary
    lines.append(generate_summary_section(result))
    
    # Fields
    fields = result.get('fields', {})
    if fields:
        lines.append(generate_field_section(fields))
    
    # Attributes
    attributes = result.get('attributes', {})
    if attributes:
        lines.append(generate_attributes_section(attributes))
    
    # Type recommendations
    if fields:
        lines.append(generate_type_recommendations_section(fields))
    
    report = "\n".join(lines)
    
    if output_path:
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"Report saved to {output_path}")
    
    return report

def generate_reports_from_json(json_path: str, output_dir: str = "docs/analysis") -> None:
    """Generate markdown reports from JSON analysis file"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    os.makedirs(output_dir, exist_ok=True)
    
    for file_key, result in data.items():
        if 'error' in result:
            print(f"Skipping {file_key} due to error: {result['error']}")
            continue
        
        output_path = os.path.join(output_dir, f"{file_key}-analysis.md")
        generate_report(result, output_path)
        print(f"Generated report for {file_key}")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: generate_field_analysis.py <analysis.json> [-o output_dir]")
        print("   or: generate_field_analysis.py <analysis.json> <file_key> [-o output.md]")
        sys.exit(1)
    
    json_path = sys.argv[1]
    output_dir = "docs/analysis"
    output_path = None
    file_key = None
    
    i = 2
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == '-o' or arg == '--output':
            if i + 1 < len(sys.argv):
                output_path = sys.argv[i + 1]
                i += 2
            else:
                print("Error: -o requires output path")
                sys.exit(1)
        elif not arg.startswith('-'):
            file_key = arg
            i += 1
        else:
            print(f"Unknown option: {arg}")
            sys.exit(1)
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if file_key:
        # Generate report for specific file
        if file_key not in data:
            print(f"Error: {file_key} not found in analysis data")
            sys.exit(1)
        result = data[file_key]
        generate_report(result, output_path or f"{file_key}-analysis.md")
    else:
        # Generate reports for all files
        if output_path:
            output_dir = output_path
        generate_reports_from_json(json_path, output_dir)

if __name__ == '__main__':
    main()

