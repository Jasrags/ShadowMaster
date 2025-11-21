<!-- 7ac55486-2359-4f89-ae30-01d8b1093377 505685f2-3408-4b8f-a3e5-356df163b3b0 -->
# XML Data Analysis and Struct Enhancement Plan

## Overview

Analyze XML data files in `data/chummerxml/` to understand actual data patterns, add comprehensive documentation to generated structs, and identify type improvements for better type safety.

## Phase 1: Analysis Infrastructure

### 1.1 Create XML Analysis Script

- **File**: `scripts/analyze_xml_data.py`
- **Purpose**: Parse XML files and extract field statistics
- **Output**: JSON report with:
  - Field presence/absence frequency
  - Value type patterns (numeric strings, boolean strings, enums, etc.)
  - Min/max values for numeric fields
  - Unique value sets for categorical fields
  - Example values for each field
  - Field usage patterns (always present, optional, conditional)

### 1.2 Create Analysis Report Generator

- **File**: `scripts/generate_field_analysis.py`
- **Purpose**: Generate markdown reports summarizing findings
- **Output**: Per-struct analysis reports in `docs/analysis/`

## Phase 2: Data Analysis (Priority Files)

### 2.1 Common Package Analysis

Analyze data patterns for shared structures:

- `common/gear.go` - Analyze `gear.xml` (22K+ lines)
- `common/bonuses.go` - Analyze bonus usage across all XML files
- `common/conditions.go` - Analyze condition patterns
- `common/categories.go` - Analyze category usage

**Deliverables**:

- Field type analysis (string vs int, enum patterns, etc.)
- Value range analysis for numeric fields
- Enum candidate identification
- Required vs optional field patterns

### 2.2 Core Data Files Analysis

Analyze priority XML files:

- `weapons.xml` → `weapons.go`
- `armor.xml` → `armor.go`
- `cyberware.xml` → `cyberware.go`
- `bioware.xml` → `bioware.go`
- `qualities.xml` → `qualities.go`
- `spells.xml` → `spells.go`
- `powers.xml` → `powers.go`

**Focus Areas**:

- Cost/availability format patterns
- Rating/value ranges
- Source/page reference formats
- Boolean string patterns ("True"/"False" vs "Yes"/"No")
- Numeric string patterns that should be int/float

### 2.3 Remaining Files Analysis

Analyze remaining XML files in batches:

- Batch 1: `metatypes.xml`, `skills.xml`, `references.xml`
- Batch 2: `vehicles.xml`, `vessels.xml`, `traditions.xml`
- Batch 3: `martialarts.xml`, `mentors.xml`, `paragons.xml`, `echoes.xml`
- Batch 4: `critters.xml`, `critterpowers.xml`, `complexforms.xml`, `programs.xml`
- Batch 5: `metamagic.xml`, `lifestyles.xml`

## Phase 3: Documentation Enhancement

### 3.1 Create Comment Template System

- **File**: `scripts/add_struct_comments.py`
- **Purpose**: Add comprehensive comments to struct fields based on analysis
- **Comment Format**:
  ```go
  // FieldName represents [description]
  // Type: [actual type pattern]
  // Values: [example values or range]
  // Usage: [always present | optional | conditional]
  // Examples: [sample values from data]
  ```


### 3.2 Update Generation Scripts

Modify existing generation scripts to include:

- Field-level comments from analysis data
- Type recommendations in comments
- Usage pattern notes
- Example values

**Files to Update**:

- All `scripts/generate_*_from_xsd.py` files
- Add comment injection step after struct generation

### 3.3 Generate Documentation Summaries

- **File**: `docs/analysis/field-type-summary.md`
- **Content**: 
  - Type improvement recommendations
  - Enum candidates
  - Validation rules needed
  - Common patterns across files

## Phase 4: Type Refinement Recommendations

### 4.1 Identify Type Improvements

Based on analysis, document recommendations for:

- String → Enum conversions (e.g., boolean strings, category values)
- String → Numeric conversions (e.g., cost, rating fields)
- Validation rules (e.g., rating ranges, cost formats)
- Custom types (e.g., Availability, Cost, Rating)

### 4.2 Create Type Improvement Plan

- **File**: `docs/analysis/type-improvements.md`
- **Content**:
  - Prioritized list of type changes
  - Breaking change assessment
  - Migration strategy
  - Validation requirements

## Phase 5: Type Recommendation Analysis and Implementation Plan

### 5.1 Examine Generated Documentation

Review and analyze the generated documentation to extract actionable type recommendations:

- **Input Files**:
  - `docs/analysis/field-type-summary.md` - Enum candidates and type patterns
  - `docs/analysis/type-improvements.md` - Initial recommendations
  - `docs/analysis/all-analysis.json` - Raw analysis data
  - Individual analysis reports (`*-analysis.md`)

- **Analysis Focus**:
  - High-confidence type conversions (≥95% pattern match)
  - Enum candidates with stable value sets
  - Numeric fields with consistent formats
  - Boolean fields with clear true/false patterns
  - Custom type opportunities (Availability, Cost, Rating expressions)

### 5.2 Create Type Recommendation Script

- **File**: `scripts/generate_type_recommendations.py`
- **Purpose**: Analyze documentation and generate specific type change recommendations
- **Output**: `docs/analysis/type-recommendations-detailed.md`
- **Features**:
  - Parse analysis JSON and markdown reports
  - Calculate confidence scores for each recommendation
  - Group recommendations by struct and priority
  - Generate before/after code examples
  - Identify dependencies between type changes
  - Estimate migration complexity

### 5.3 Generate Detailed Recommendations

- **File**: `docs/analysis/type-recommendations-detailed.md`
- **Content**:
  - **High Priority Changes**:
    - Boolean string → bool conversions
    - Simple numeric string → int/float conversions
    - Small enum sets (2-10 values) → enum types
  - **Medium Priority Changes**:
    - Medium enum sets (11-30 values) → enum types
    - Complex numeric patterns → custom numeric types
    - Format-constrained strings → custom types (Availability, Cost)
  - **Low Priority Changes**:
    - Large enum sets (31+ values) → enum types (consider validation instead)
    - Expression fields → custom expression types
  - **For Each Recommendation**:
    - Current type and usage
    - Recommended type
    - Confidence score (0-100%)
    - Example values
    - Migration code example
    - Breaking change impact
    - Testing requirements

### 5.4 Create Type Implementation Examples

- **File**: `docs/analysis/type-implementation-examples.md`
- **Purpose**: Provide concrete code examples for recommended type changes
- **Content**:
  - Enum type definitions with all values
  - Custom type definitions (Availability, Cost, Rating)
  - Validation functions
  - Unmarshaling/marshaling methods
  - Migration helper functions
  - Unit test examples

### 5.5 Prioritize and Categorize Recommendations

Create a prioritized implementation plan:

- **Category 1: Safe Changes** (Low risk, high benefit)
  - Boolean strings with 100% boolean ratio
  - Simple numeric strings with no expressions
  - Small, stable enum sets

- **Category 2: Moderate Changes** (Medium risk, medium-high benefit)
  - Numeric strings with occasional expressions
  - Medium enum sets
  - Format-constrained strings

- **Category 3: Complex Changes** (Higher risk, variable benefit)
  - Large enum sets
  - Expression-heavy fields
  - Custom types requiring parsing logic

### 5.6 Generate Migration Roadmap

- **File**: `docs/analysis/type-migration-roadmap.md`
- **Content**:
  - Phased implementation plan
  - Dependencies between changes
  - Testing strategy for each phase
  - Rollback plan
  - Timeline estimates
  - Success metrics

## Implementation Details

### Analysis Script Features

- Parse XML files using ElementTree
- Track field statistics per struct type
- Identify patterns (numeric strings, enums, etc.)
- Generate sample values
- Export JSON analysis data

### Comment Enhancement Process

1. Run analysis on XML files
2. Generate analysis reports
3. Create comment mapping from analysis to struct fields
4. Update generation scripts to inject comments
5. Regenerate struct files with enhanced comments

### Output Structure

```
docs/analysis/
  ├── gear-analysis.json
  ├── gear-analysis.md
  ├── weapons-analysis.json
  ├── weapons-analysis.md
  ├── field-type-summary.md
  ├── type-improvements.md
  ├── type-recommendations-detailed.md
  ├── type-implementation-examples.md
  └── type-migration-roadmap.md
```

## Success Criteria

- All priority structs have comprehensive field comments
- Analysis reports identify type improvement opportunities
- Documentation summarizes field usage patterns
- Type refinement recommendations are prioritized and actionable
- Detailed type recommendations with confidence scores and migration examples
- Implementation roadmap with phased approach and risk assessment

### To-dos

- [ ] Create scripts/analyze_xml_data.py to parse XML files and extract field statistics
- [ ] Create scripts/generate_field_analysis.py to generate markdown analysis reports
- [ ] Analyze common package XML data (gear.xml, bonus usage, conditions, categories)
- [ ] Analyze core data files (weapons, armor, cyberware, bioware, qualities, spells, powers)
- [ ] Analyze remaining XML files in batches
- [ ] Create scripts/add_struct_comments.py to add comprehensive comments to struct fields
- [ ] Update generation scripts to include field-level comments from analysis
- [ ] Generate documentation summaries (field-type-summary.md, type-improvements.md)
- [ ] Document type improvement recommendations with prioritization and migration strategy
- [ ] Create scripts/generate_type_recommendations.py to analyze documentation and generate detailed recommendations
- [ ] Generate type-recommendations-detailed.md with confidence scores and code examples
- [ ] Create type-implementation-examples.md with concrete code examples
- [ ] Generate type-migration-roadmap.md with phased implementation plan