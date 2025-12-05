# Edition Support & Ruleset Architecture

## Overview

Your system must support all major Shadowrun editions (1E--6E + Anarchy)
with modular loading, rule overrides, and edition-specific character
sheets.

## Goals

-   Support multiple rulebooks per edition.
-   Maintain rule modules (attributes, skills, combat, Matrix, magic,
    edge, etc.).
-   Allow book-based overrides (e.g., errata, expansions).
-   Permit character sheet templates per edition.
-   Preserve differences while sharing common logic in core engine.

## Architecture Summary

-   **Edition**: Top-level ruleset identifier.
-   **Books**: Contain rule modules and overrides.
-   **Rule Modules**: Encapsulate specific rules (combat, skills, etc.).
-   **Creation Methods**: Vary by edition (Priority, Point Buy, Life
    Path, etc.).
-   **Merging Layer**: Combines base edition rules with book modifiers.
-   **Validation Engine**: Applies edition ruleset to character data.

## Flow

1.  Load edition → load base modules → load books → merge rules →
    produce final ruleset object.
2.  Character validations reference the merged ruleset.
3.  UI forms derived from edition-specific schema + module
    configuration.
