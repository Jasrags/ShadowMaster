# Rulebook Extraction — Shadow Master Reference

Extract an entire Shadowrun sourcebook (or specific sections) into structured reference
material for feature implementation, validation, and testing.

## Inputs

- **PDF**: Path to PDF in `docs/pdfs/` (e.g. `docs/pdfs/sr5-run-faster.pdf`)
- **Sections** (optional): Specific section names to extract. If omitted, extract all mechanical sections.
- **Resume** (optional): If a manifest already exists, resume from where extraction left off.

## Phase 1 — Table of Contents Discovery

1. Derive the book slug from the PDF filename (e.g. `sr5-run-faster.pdf` → `sr5-run-faster`).
2. Check if `docs/references/{book-slug}/manifest.json` already exists. If so, skip to Phase 3 (resume).
3. Read the first 10 PDF pages to locate the Table of Contents. Most RPG books have the TOC within pages 2-8.
4. Detect the **PDF page offset** by comparing a known section's book page number to its PDF page number. Record as `pdf_page_offset` in the manifest.
5. Log: `TOC located — PDF pages {X}–{Y}, offset: {N}`

## Phase 2 — Build Extraction Manifest

Create `docs/references/{book-slug}/manifest.json`:

```json
{
  "book": "{Book Title}",
  "pdf": "docs/pdfs/{book-slug}.pdf",
  "total_pages": 0,
  "pdf_page_offset": 0,
  "sections": [
    {
      "slug": "section-slug",
      "title": "Section Title",
      "pages": "start-end",
      "pdf_pages": "start-end",
      "priority": "high|medium|low|skip",
      "reason": "Why this priority",
      "page_count": 0,
      "split_into": [],
      "status": "pending|done|skipped"
    }
  ],
  "summary": {
    "total_sections": 0,
    "skip": 0,
    "pending": 0,
    "done": 0
  }
}
```

### Classification Rules

- **skip**: Fiction, flavor, lore, art, indexes, blank sheets, table of contents
- **high**: Core mechanics, character creation, combat, magic, matrix, gear catalogs, skills
- **medium**: GM advice, NPCs, contacts, lifestyles, reputation (mix of mechanical and advisory)
- **low**: Random tables, appendices, optional rules

### Splitting Rules

Sections are processed one at a time. Split large sections to keep each extraction unit manageable:

- **25 pages or fewer**: Extract as a single unit
- **26-50 pages**: Consider splitting if the section has natural subsection boundaries
- **51+ pages**: Must split into chunks of ~20-25 pages along subsection boundaries
- **Catalog-heavy sections** (gear, spells, critters): Split by category even if under 50 pages

Record splits in the manifest's `split_into` array. Each split gets its own slug
(e.g. `street-gear-weapons-armor`, `street-gear-electronics-cyber`).

### Present the Plan

After building the manifest, present a summary table to the user:

```
| Priority | Sections | Pages | Status |
|----------|----------|-------|--------|
| high     | 7        | 280   | pending |
| medium   | 2        | 84    | pending |
| skip     | 11       | 138   | skipped |
```

**Wait for user confirmation before proceeding to Phase 3.**

## Phase 3 — Extract Sections

Process sections **one at a time**, in priority order (high → medium → low).

For each section (or split chunk):

1. Read the PDF pages in chunks of 20 pages max. Read ALL chunks before writing output.
2. Log: `Extracting: "{Title}" — PDF pages {X}–{Y}`
3. Write two output files per the templates below.
4. Update the manifest: set `status: "done"` for the completed section.
5. Log progress: `Done: {N}/{total} sections complete`

### Extraction Agent Prompt

When launching an agent for extraction, include these instructions:

- Read ALL pages before writing any output
- Developer reference tone — no flavor text, no lore
- Use exact attribute names and terminology from the book
- Target 1-2 sentences per rule, bullet points for complex rules
- Every rule must include enough mechanical detail (thresholds, formulas, modifiers, edge cases) to implement, validate, and write tests against without re-reading the source
- Flag ambiguities with `> **Ambiguity:**` blocks — never silently resolve unclear rules
- Flag cross-references with `> **Cross-reference:**` blocks
- For catalog-heavy sections: capture EVERY item with its FULL stat line
- Include a Validation Checklist with specific testable assertions
- Include Implementation Notes with developer guidance

### Output File 1: `docs/references/{book-slug}/{section-slug}.md`

```markdown
# {Section Title}

**Source:** {Book Title}, p.{book-start}–{book-end}
**PDF Pages:** {pdf-start}–{pdf-end}

---

## Overview

One paragraph summary of what this section covers and why it matters.

---

## Rules

### {Rule Name}

Clear, implementation-focused distillation of the rule.

> **Ambiguity:** [Flag any unclear or contradictory language]

> **Cross-reference:** [Dependencies on other sections or sourcebooks]

---

## Tables

> Tabular data is extracted to the companion JSON file.
> Reference: `{section-slug}.json`

List each table by name and a one-line description.

---

## Validation Checklist

- [ ] {Specific testable assertion}

---

## Implementation Notes

Developer guidance, data structures, edge cases, ordering dependencies.
```

### Output File 2: `docs/references/{book-slug}/{section-slug}.json`

```json
{
  "tables": {
    "table-slug": {
      "source": "{Book Title}, p.{page}",
      "description": "What this table governs",
      "columns": ["column1", "column2"],
      "rows": [{ "column1": "value", "column2": "value" }]
    }
  }
}
```

## Phase 4 — Summary

After all sections are extracted, log a final summary:

```
Extraction complete: {book-slug}
- Sections extracted: {N}
- Sections skipped: {N}
- Total reference files: {N} md + {N} json
- Output: docs/references/{book-slug}/
```

## Conventions

- **PDF source:** PDFs live in `docs/pdfs/`. Book slug = PDF filename without extension.
- **Output path:** `docs/references/{book-slug}/` with kebab-case section slugs.
- **Tone:** Developer reference, not player-facing.
- **Brevity with substance:** Include enough mechanical detail to implement, validate, and
  test without re-reading the source book.
- **Precision:** Use exact terminology from the book. Do not paraphrase mechanical terms.
- **Ambiguity flags:** Use `> **Ambiguity:**` inline. Never silently resolve unclear rules.
- **Cross-references:** Note dependencies on other sections or sourcebooks.
- **Resumability:** The manifest tracks status. Re-invoking the skill picks up where it left off.

## Example Invocations

```
# Extract entire book
/extract-rulebook
PDF: docs/pdfs/sr5-run-faster.pdf

# Extract specific sections
/extract-rulebook
PDF: docs/pdfs/sr5-core-rulebook.pdf
Sections: Combat, Magic

# Resume interrupted extraction
/extract-rulebook
PDF: docs/pdfs/sr5-run-faster.pdf
Resume: true
```
