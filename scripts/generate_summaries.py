#!/usr/bin/env python3
"""Generate summary documents from analysis data"""

import json
import os
import sys
from collections import defaultdict
from typing import Dict, Any, List, Set

def load_analysis_data(json_path: str) -> Dict[str, Any]:
    """Load analysis JSON data"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def collect_enum_candidates(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Collect all enum candidates across all files"""
    candidates = []
    
    for file_key, result in data.items():
        if 'error' in result:
            continue
        
        fields = result.get('fields', {})
        for field_path, field_data in fields.items():
            if field_data.get('is_enum_candidate', False):
                unique_values = field_data.get('unique_values', 0)
                all_values = field_data.get('all_values', [])
                candidates.append({
                    'file': file_key,
                    'field_path': field_path,
                    'field_name': field_path.split('/')[-1],
                    'unique_values': unique_values,
                    'values': sorted(all_values) if all_values else [],
                    'examples': field_data.get('examples', [])[:5],
                })
    
    return candidates

def collect_numeric_candidates(data: Dict[str, Any], threshold: float = 0.9) -> List[Dict[str, Any]]:
    """Collect fields that should be numeric types"""
    candidates = []
    
    for file_key, result in data.items():
        if 'error' in result:
            continue
        
        fields = result.get('fields', {})
        for field_path, field_data in fields.items():
            numeric_ratio = field_data.get('numeric_ratio', 0)
            if numeric_ratio >= threshold:
                candidates.append({
                    'file': file_key,
                    'field_path': field_path,
                    'field_name': field_path.split('/')[-1],
                    'numeric_ratio': numeric_ratio,
                    'examples': field_data.get('examples', [])[:5],
                    'type_patterns': field_data.get('type_patterns', []),
                })
    
    return sorted(candidates, key=lambda x: x['numeric_ratio'], reverse=True)

def collect_boolean_candidates(data: Dict[str, Any], threshold: float = 0.9) -> List[Dict[str, Any]]:
    """Collect fields that should be boolean types"""
    candidates = []
    
    for file_key, result in data.items():
        if 'error' in result:
            continue
        
        fields = result.get('fields', {})
        for field_path, field_data in fields.items():
            boolean_ratio = field_data.get('boolean_ratio', 0)
            if boolean_ratio >= threshold:
                candidates.append({
                    'file': file_key,
                    'field_path': field_path,
                    'field_name': field_path.split('/')[-1],
                    'boolean_ratio': boolean_ratio,
                    'examples': field_data.get('examples', [])[:5],
                })
    
    return sorted(candidates, key=lambda x: x['boolean_ratio'], reverse=True)

def generate_field_type_summary(data: Dict[str, Any], output_path: str) -> None:
    """Generate field-type-summary.md"""
    lines = ["# Field Type Summary\n"]
    lines.append("This document summarizes field type patterns and recommendations across all analyzed XML files.\n")
    
    # Enum candidates
    enum_candidates = collect_enum_candidates(data)
    lines.append("## Enum Candidates\n")
    lines.append(f"Found {len(enum_candidates)} fields that are good candidates for enum types.\n")
    
    # Group by field name
    by_field_name = defaultdict(list)
    for candidate in enum_candidates:
        by_field_name[candidate['field_name']].append(candidate)
    
    for field_name, candidates in sorted(by_field_name.items()):
        lines.append(f"### {field_name}")
        lines.append(f"Appears in {len(candidates)} file(s):\n")
        for candidate in candidates:
            lines.append(f"- **{candidate['file']}** (`{candidate['field_path']}`)")
            lines.append(f"  - Unique values: {candidate['unique_values']}")
            if candidate['values'] and len(candidate['values']) <= 20:
                lines.append(f"  - Values: {', '.join(candidate['values'])}")
            lines.append("")
    
    # Numeric candidates
    numeric_candidates = collect_numeric_candidates(data)
    lines.append("## Numeric Type Candidates\n")
    lines.append(f"Found {len(numeric_candidates)} fields that should be numeric types (≥90% numeric).\n")
    
    # Group by field name
    by_field_name = defaultdict(list)
    for candidate in numeric_candidates:
        by_field_name[candidate['field_name']].append(candidate)
    
    for field_name, candidates in sorted(by_field_name.items()):
        lines.append(f"### {field_name}")
        for candidate in candidates:
            lines.append(f"- **{candidate['file']}** (`{candidate['field_path']}`): {candidate['numeric_ratio']:.1%} numeric")
            if candidate['examples']:
                lines.append(f"  - Examples: {', '.join(str(e) for e in candidate['examples'][:3])}")
        lines.append("")
    
    # Boolean candidates
    boolean_candidates = collect_boolean_candidates(data)
    lines.append("## Boolean Type Candidates\n")
    lines.append(f"Found {len(boolean_candidates)} fields that should be boolean types (≥90% boolean).\n")
    
    # Group by field name
    by_field_name = defaultdict(list)
    for candidate in boolean_candidates:
        by_field_name[candidate['field_name']].append(candidate)
    
    for field_name, candidates in sorted(by_field_name.items()):
        lines.append(f"### {field_name}")
        for candidate in candidates:
            lines.append(f"- **{candidate['file']}** (`{candidate['field_path']}`): {candidate['boolean_ratio']:.1%} boolean")
            if candidate['examples']:
                lines.append(f"  - Examples: {', '.join(str(e) for e in candidate['examples'][:3])}")
        lines.append("")
    
    # Common patterns
    lines.append("## Common Patterns\n")
    lines.append("### Cost Fields\n")
    lines.append("Cost fields often contain expressions like `(Rating * 30)` or simple numbers.\n")
    lines.append("Recommendation: Keep as string to support expressions, or create custom Cost type.\n\n")
    
    lines.append("### Availability Fields\n")
    lines.append("Availability fields use format like `6F`, `12R`, `28F` (number + letter).\n")
    lines.append("Recommendation: Create custom Availability type or keep as string.\n\n")
    
    lines.append("### Rating Fields\n")
    lines.append("Rating fields are mostly numeric but may contain expressions.\n")
    lines.append("Recommendation: Keep as string or create Rating type that supports expressions.\n\n")
    
    # Write file
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Field type summary saved to {output_path}")

def generate_type_improvements(data: Dict[str, Any], output_path: str) -> None:
    """Generate type-improvements.md with prioritized recommendations"""
    lines = ["# Type Improvement Recommendations\n"]
    lines.append("This document provides prioritized recommendations for improving type safety in generated structs.\n")
    
    # High priority: Boolean strings
    boolean_candidates = collect_boolean_candidates(data, threshold=0.95)
    lines.append("## High Priority\n")
    lines.append("### Boolean String Fields\n")
    lines.append("Fields that are ≥95% boolean values should be converted to bool type.\n\n")
    
    if boolean_candidates:
        for candidate in boolean_candidates[:20]:  # Top 20
            lines.append(f"- **{candidate['file']}** - `{candidate['field_path']}`")
            lines.append(f"  - Current: string (boolean_ratio: {candidate['boolean_ratio']:.1%})")
            lines.append(f"  - Recommended: bool")
            lines.append(f"  - Examples: {', '.join(str(e) for e in candidate['examples'][:3])}")
            lines.append("")
    else:
        lines.append("No high-confidence boolean candidates found.\n")
    
    # Medium priority: Numeric fields
    numeric_candidates = collect_numeric_candidates(data, threshold=0.95)
    lines.append("### Numeric String Fields\n")
    lines.append("Fields that are ≥95% numeric should be converted to int/float types.\n\n")
    
    if numeric_candidates:
        for candidate in numeric_candidates[:20]:  # Top 20
            lines.append(f"- **{candidate['file']}** - `{candidate['field_path']}`")
            lines.append(f"  - Current: string (numeric_ratio: {candidate['numeric_ratio']:.1%})")
            lines.append(f"  - Recommended: int or float (depending on examples)")
            lines.append(f"  - Examples: {', '.join(str(e) for e in candidate['examples'][:3])}")
            lines.append("")
    else:
        lines.append("No high-confidence numeric candidates found.\n")
    
    # Medium priority: Enums
    enum_candidates = collect_enum_candidates(data)
    # Filter to reasonable size enums
    small_enums = [e for e in enum_candidates if 2 <= e['unique_values'] <= 30]
    lines.append("## Medium Priority\n")
    lines.append("### Enum Type Conversions\n")
    lines.append("Fields with limited, well-defined value sets should be converted to enums.\n\n")
    
    if small_enums:
        # Group by field name and show most common
        by_field_name = defaultdict(list)
        for candidate in small_enums:
            by_field_name[candidate['field_name']].append(candidate)
        
        # Show top 15 most common field names
        sorted_fields = sorted(by_field_name.items(), key=lambda x: len(x[1]), reverse=True)[:15]
        for field_name, candidates in sorted_fields:
            lines.append(f"#### {field_name}")
            lines.append(f"Appears in {len(candidates)} file(s). Example from {candidates[0]['file']}:\n")
            if candidates[0]['values']:
                lines.append(f"```go")
                lines.append(f"type {field_name}Enum string")
                lines.append("")
                lines.append("const (")
                for value in candidates[0]['values'][:20]:  # Limit to 20 values
                    const_name = value.upper().replace(' ', '_').replace('-', '_')
                    lines.append(f'    {field_name}{const_name} {field_name}Enum = "{value}"')
                lines.append(")")
                lines.append("```\n")
            lines.append("")
    else:
        lines.append("No suitable enum candidates found.\n")
    
    # Low priority: Custom types
    lines.append("## Low Priority\n")
    lines.append("### Custom Types for Complex Fields\n")
    lines.append("Consider creating custom types for fields with special formats:\n\n")
    lines.append("- **Availability**: Format like `6F`, `12R` (number + legality code)\n")
    lines.append("- **Cost**: May contain expressions like `(Rating * 30)`\n")
    lines.append("- **Source/Page**: Sourcebook abbreviations and page numbers\n")
    lines.append("- **Rating**: Mostly numeric but may support expressions\n\n")
    
    # Breaking changes
    lines.append("## Breaking Change Assessment\n")
    lines.append("### Impact Analysis\n")
    lines.append("- **Boolean conversions**: Low impact - mostly internal fields\n")
    lines.append("- **Numeric conversions**: Medium impact - may affect API responses\n")
    lines.append("- **Enum conversions**: High impact - requires validation and migration\n")
    lines.append("- **Custom types**: Medium impact - requires new type definitions\n\n")
    
    # Migration strategy
    lines.append("## Migration Strategy\n")
    lines.append("1. **Phase 1**: Add new typed fields alongside existing string fields\n")
    lines.append("2. **Phase 2**: Update code to use typed fields\n")
    lines.append("3. **Phase 3**: Deprecate string fields\n")
    lines.append("4. **Phase 4**: Remove string fields in next major version\n\n")
    
    lines.append("### Validation Requirements\n")
    lines.append("- Add validation for enum values\n")
    lines.append("- Add parsing for numeric expressions in cost/rating fields\n")
    lines.append("- Add validation for availability format\n")
    lines.append("- Add unit tests for type conversions\n\n")
    
    # Write file
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Type improvements document saved to {output_path}")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: generate_summaries.py <analysis.json> [-o output_dir]")
        sys.exit(1)
    
    json_path = sys.argv[1]
    output_dir = "docs/analysis"
    
    if len(sys.argv) > 2 and sys.argv[2] == '-o':
        if len(sys.argv) > 3:
            output_dir = sys.argv[3]
        else:
            print("Error: -o requires output directory")
            sys.exit(1)
    
    data = load_analysis_data(json_path)
    
    summary_path = os.path.join(output_dir, "field-type-summary.md")
    improvements_path = os.path.join(output_dir, "type-improvements.md")
    
    generate_field_type_summary(data, summary_path)
    generate_type_improvements(data, improvements_path)
    
    print("\nSummary generation complete!")

if __name__ == '__main__':
    main()

