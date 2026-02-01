# Reviews

This directory contains implementation review reports generated during development.

## Directory Structure

```
reviews/
├── code-reviews/           # Post-implementation code review reports
│   └── [feature]-review-[date].md
├── ui-ux-verifications/    # UI/UX verification reports from browser testing
│   └── [feature]-verification-[date].md
└── README.md
```

## Report Types

### Code Reviews (`code-reviews/`)

Generated using the [post-implementation-review.md](../capabilities/prompts/post-implementation-review.md) prompt.

Contains:

- Requirements coverage analysis
- Code quality assessment
- Test coverage analysis
- Critical/important issues identified
- Recommended fixes and improvements

### UI/UX Verifications (`ui-ux-verifications/`)

Generated using the [automated_ui_ux_verification.md](../capabilities/prompts/automated_ui_ux_verification.md) prompt.

Contains:

- Visual verification results
- User workflow testing results
- Accessibility checks
- Performance observations
- Screenshots (when applicable)

## Naming Convention

All reports follow the pattern:

```
[feature-name]-[report-type]-[YYYY-MM-DD].md
```

Examples:

- `quality-selection-modal-review-2026-01-31.md`
- `augmentation-modal-verification-2026-01-30.md`

## Related Directories

- `docs/audits/` - Compliance audits and system-wide reviews
- `docs/plans/` - Implementation plans (input to these reviews)
