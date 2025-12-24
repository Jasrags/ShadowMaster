# Ruleset Discovery Capability

## Purpose

The Ruleset Discovery capability provides a comprehensive interface for exploring and understanding the available Shadowrun gaming systems. It ensures that participants can verify edition-specific capabilities, browse available source materials, and understand mechanical foundations before committing to entity creation or campaign initialization.

## Guarantees

- Every available ruleset edition MUST be queryable for its core metadata, including name, release year, versioning, and availability status.
- The system MUST provide an authoritative summary of content (e.g., metatypes, skills, gear, magic) available within a specific edition ruleset.
- Identification of available character creation methods (e.g., Priority, Point Buy) and their associated constraints MUST be accessible for every ruleset.
- Source material catalogs (books) MUST be categorized (Core, Sourcebook, Adventure) and linked to their authoritative ruleset foundation.

## Requirements

### Edition Browsing and Comparison

- The system MUST enable participants to browse the full catalog of supported Shadowrun editions.
- Every edition record MUST include an abstract of the game's core philosophy, mechanical highlights, and supported content types.
- The system MUST support deep linking to specific edition details to facilitate shared campaign planning.

### Source Material Visibility

- Participants MUST be able to view the full list of books and digital supplements available for a specific ruleset edition.
- Every book entry MUST include metadata such as title, abbreviation, category, and its role as a core or expansion bundle.
- The system MUST identify the "Core Rulebook" as the mandatory foundation for character validation within that edition.

### Content Summarization and Preview

- The system MUST provide summary counts and category overviews for all major content domains (Skills, Qualities, Spells, Augmentations) within an edition.
- Preview interfaces MUST allow participants to explore representative metatypes and equipment categories without initiating a full entity creation session.
- Discovery metadata MUST be automatically synchronized with the underlying ruleset bundles to ensure accuracy.

### Creation Method Mapping

- Every edition MUST explicitly list its supported character creation frameworks.
- The system MUST provide a summarized explanation of each creation method's impact on resource allocation (e.g., Priority vs. Sum-to-Ten).
- Successful discovery transitions MUST facilitate immediate hand-off to the entity creation systems with pre-selected edition parameters.

## Constraints

- Discovery interfaces MUST NOT permit the modification of underlying ruleset data or bundle configurations.
- Access to detailed ruleset summaries MUST comply with the system's global authentication and authorization protocols.
- Summary previews MUST be optimized to ensure high-performance browsing without loading full mechanical resolution engines.

## Non-Goals

- This capability does not govern the actual resolution of character creation (see Character Management).
- This capability does not provide the full text of game rules or narrative lore found in sourcebooks.
- This capability does not manage the licensing or payment processing for digital content access.
