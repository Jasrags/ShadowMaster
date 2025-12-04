# Rule Merging Algorithm for Book-Based Overrides

## Goal

Combine base edition rules with book overrides in deterministic,
predictable ways.

## Algorithm

    function mergeRules(baseModule, overridePayload, mergeStrategy):
        switch mergeStrategy:
            case "replace":
                return overridePayload
            case "merge":
                return deepMerge(baseModule, overridePayload)
            case "append":
                return appendLists(baseModule, overridePayload)
            case "remove":
                return removeKeys(baseModule, overridePayload)
            default:
                throw Error("unknown strategy")

## Deep Merge Rules

-   Objects: recursively merge keys.
-   Arrays: append-only unless `append` or `remove` specified.
-   Scalars: override directly.

## Apply to Ruleset

1.  Load all core modules.
2.  For each book in load-order:
    -   For each override:
        -   Apply mergeRules.
3.  Return final merged ruleset.
