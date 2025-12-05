# Database Schema: Editions, Books, Creation Methods, Rules Modules

## Tables

### `editions`

-   id (PK)
-   name (string)
-   short_code (string)
-   release_year (int)
-   description (text)

### `books`

-   id (PK)
-   edition_id (FK → editions)
-   title (string)
-   abbreviation (string)
-   release_year (int)
-   is_core (bool)

### `creation_methods`

-   id (PK)
-   edition_id (FK → editions)
-   name (string)
-   description (text)

### `rule_modules`

-   id (PK)
-   edition_id (FK → editions)
-   module_type (enum: attributes, skills, combat, matrix, magic, edge,
    lifestyle, gear)
-   base_payload (jsonb)

### `rule_overrides`

-   id (PK)
-   book_id (FK → books)
-   module_id (FK → rule_modules)
-   override_payload (jsonb)
-   merge_strategy (enum: replace, merge, append, remove)
