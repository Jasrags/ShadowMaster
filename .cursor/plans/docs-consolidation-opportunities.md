# Documentation Consolidation Opportunities

## Summary

Analysis of documentation structure reveals several opportunities for consolidation and reorganization.

## Files to Move from `data/editions/sr5/` to `docs/`

The `data/editions/` directory should contain only JSON data files, not documentation.

### 1. `data/editions/sr5/character_creation_guide.md`
**Current Location:** `data/editions/sr5/character_creation_guide.md`  
**Recommended Action:** 
- **Option A (Recommended):** Delete if content is fully covered in `docs/rules/5e/character-creation.md`
- **Option B:** Move to `docs/rules/5e/` and merge unique content into `character-creation.md`, then delete
- **Reason:** This appears to be source material that was used to create the official docs. The docs version is more structured and includes implementation notes.

**Content Comparison:**
- `character_creation_guide.md`: 734 lines, includes source URLs, implementation notes, detailed step-by-step
- `character-creation.md`: 460 lines, more structured with implementation notes per section, references to other docs

**Recommendation:** Review for any unique content (especially implementation notes or source URLs), then delete the data/ version.

### 2. `data/editions/sr5/character_creation_urls.md`
**Current Location:** `data/editions/sr5/character_creation_urls.md`  
**Recommended Action:** 
- Delete (outdated reference URLs to external wiki)
- Or move to `docs/archive/` if historical reference is needed
- **Reason:** Just a list of URLs to an external wiki, not useful documentation

## Files to Consolidate

### 3. `docs/rules/5e/creation-methods/priority.md`
**Current Status:** Very thin (35 lines), mostly just references other docs  
**Recommended Action:**
- **Option A:** Expand with priority-specific details from `character-creation.md`
- **Option B:** Merge into `character-creation.md` and remove the separate file
- **Reason:** Currently just a stub that references the main guide. Either expand it or remove redundancy.

**Content:** Only contains overview and references to other files. The actual priority rules are in `character-creation.md`.

## Files That Are Fine As-Is

### `docs/rules/5e/creation-methods/sum-to-ten.md` and `karma-point-buy.md`
- These are comprehensive, method-specific documentation
- They contain implementation specs and unique rules
- **Keep separate** - they serve a different purpose than the main character-creation.md

### `docs/rules/5e/character.md`
- This is the data model spec, not character creation rules
- **Keep separate** - different purpose (implementation vs. rules)

### `docs/development/LIVE_RELOAD_IMPLEMENTATION.md`
- Implementation documentation, not a plan
- **Keep in docs/development/** - appropriate location

## Recommended Actions

### ✅ Completed Actions

1. **✅ Archived `data/editions/sr5/character_creation_urls.md`** - Moved to `docs/archive/character-creation-urls.md`
2. **✅ Deleted `data/editions/sr5/character_creation_guide.md`** - Content was duplicated in `docs/rules/5e/character-creation.md`
3. **✅ Expanded `docs/rules/5e/creation-methods/priority.md`** - Added Priority System Flow, Key Validation Rules, and Implementation Considerations sections
4. **✅ Updated `docs/rules/5e/README.md`** - Added note explaining the relationship between character-creation.md and creation-methods files

### Remaining Actions

None - all high and medium priority items have been completed.

## File Structure After Cleanup

```
docs/
├── archive/
│   └── character-creation-urls.md (archived from data/editions/sr5/)
├── rules/
│   ├── 5e/
│   │   ├── character-creation.md (main guide)
│   │   ├── creation-methods/
│   │   │   ├── priority.md (✅ expanded with validation rules and flow)
│   │   │   ├── sum-to-ten.md (keep)
│   │   │   └── karma-point-buy.md (keep)
│   │   └── ...
│   └── ...
└── ...

data/
└── editions/
    └── sr5/
        ├── *.json (data files only)
        └── (no .md files) ✅ cleaned
```

## Summary of Changes

- **Removed:** 2 markdown files from `data/editions/sr5/` (moved to archive or deleted)
- **Expanded:** `priority.md` with validation rules, flow, and implementation considerations
- **Updated:** README.md to clarify file relationships
- **Result:** Cleaner structure with `data/` containing only JSON data files

