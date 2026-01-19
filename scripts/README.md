# Shadow Master CLI Scripts

Administrative and development scripts for managing the Shadow Master application.

## Quick Reference

| Script                   | Purpose                      | Common Usage                             |
| ------------------------ | ---------------------------- | ---------------------------------------- |
| `backup.ts`              | Backup/restore data          | `pnpm backup create`                     |
| `health-check.ts`        | Data integrity check         | `pnpm health-check`                      |
| `seed-data.ts`           | Create test data             | `pnpm seed-data`                         |
| `user-admin.ts`          | User management              | `pnpm user-admin list`                   |
| `validate-claude-md.ts`  | Validate CLAUDE.md accuracy  | `pnpm validate-docs`                     |
| `check-test-coverage.ts` | Check for missing tests      | `pnpm check-tests`                       |
| `sync-character.ts`      | Sync character with rulebook | `npx tsx scripts/sync-character.ts <id>` |
| `verify-data.ts`         | Validate ruleset data        | `pnpm verify-data`                       |
| `migrate-*.ts`           | Data migration utilities     | See individual scripts                   |

---

## Scripts

### backup.ts

Backup and restore utility for Shadow Master data.

```bash
# Create a backup
npx tsx scripts/backup.ts create
npx tsx scripts/backup.ts create --output /path/to/backups

# List available backups
npx tsx scripts/backup.ts list

# Restore from backup
npx tsx scripts/backup.ts restore backup-2024-01-15T10-30-00
npx tsx scripts/backup.ts restore backup-2024-01-15T10-30-00 --force
```

**Options:**

- `--output <dir>` - Directory for backups (default: `./backups`)
- `--force` - Skip confirmation prompts on restore
- `--help` - Show help

**What gets backed up:**

- Users (`data/users/`)
- Characters (`data/characters/`)
- Campaigns (`data/campaigns/`)

**Not backed up:**

- Edition data (static ruleset files)

---

### health-check.ts

Health check and data integrity utility.

```bash
# Run health check
npx tsx scripts/health-check.ts

# Verbose output
npx tsx scripts/health-check.ts --verbose

# Auto-fix issues (removes orphaned data)
npx tsx scripts/health-check.ts --fix

# JSON output
npx tsx scripts/health-check.ts --json
```

**Options:**

- `--fix` - Attempt to fix issues (remove orphaned data)
- `--verbose, -v` - Show detailed output
- `--json` - Output results as JSON
- `--help` - Show help

**Checks performed:**

- Directory structure validation
- JSON file integrity
- Orphaned characters (characters with invalid owner)
- Orphaned campaign references
- Storage statistics

---

### seed-data.ts

Creates sample data for development and testing.

```bash
# Create seed data
npx tsx scripts/seed-data.ts

# Clean existing data first
npx tsx scripts/seed-data.ts --clean

# Preview changes without writing
npx tsx scripts/seed-data.ts --dry-run

# Minimal seed data (1 user, 1 character)
npx tsx scripts/seed-data.ts --minimal
```

**Options:**

- `--clean` - Remove existing user data before seeding
- `--dry-run` - Preview changes without writing files
- `--minimal` - Create minimal seed data
- `--help` - Show help

**Default seed data:**

- 3 users: `admin@shadowmaster.test`, `player@shadowmaster.test`, `gm@shadowmaster.test`
- 6 characters (various metatypes and statuses)
- 2 campaigns

**Default password:** `password123`

---

### user-admin.ts

User administration utility (consolidated user management).

```bash
# List all users
npx tsx scripts/user-admin.ts list
npx tsx scripts/user-admin.ts list --json

# Show user details
npx tsx scripts/user-admin.ts info user@example.com

# Create a new user
npx tsx scripts/user-admin.ts create email@example.com username password123
npx tsx scripts/user-admin.ts create gm@example.com gmuser password123 --role gamemaster

# Delete a user
npx tsx scripts/user-admin.ts delete user@example.com
npx tsx scripts/user-admin.ts delete user@example.com --force

# Change password
npx tsx scripts/user-admin.ts change-password user@example.com NewPassword123

# Update roles
npx tsx scripts/user-admin.ts set-role user@example.com user gamemaster

# Suspend/reactivate
npx tsx scripts/user-admin.ts suspend user@example.com --reason "Terms violation"
npx tsx scripts/user-admin.ts reactivate user@example.com
```

**Commands:**

- `list` - List all users
- `info <email>` - Show user details
- `create <email> <username> <password>` - Create user
- `delete <email>` - Delete user and their characters
- `change-password <email> <password>` - Change password
- `set-role <email> <roles...>` - Set user roles
- `suspend <email>` - Suspend user account
- `reactivate <email>` - Reactivate suspended user

**Options:**

- `--json` - JSON output (list, info)
- `--force` - Skip confirmation (delete)
- `--role <role>` - Initial role (create)
- `--reason <reason>` - Suspension reason

**Valid roles:** `user`, `gamemaster`, `administrator`

---

### validate-claude-md.ts

Validates CLAUDE.md documentation against the actual codebase structure.

```bash
# Run validation
pnpm validate-docs

# Or directly
npx tsx scripts/validate-claude-md.ts
```

**What gets validated:**

- Creation component count (~89 components)
- API route file count (~133 routes)
- Test file count (~85 tests)
- Storage module count (~25 modules)
- Creation subfolder count (15 directories)
- Key directory existence (matrix, rigging, inventory, character, sync, etc.)

**Exit codes:**

- `0` - All checks passed (or warnings only)
- `1` - Validation failed (missing directories, major discrepancies)

**When to run:**

- Before pushing changes (`pre-push` hook runs this automatically)
- After adding new modules or components
- When updating CLAUDE.md manually

---

### check-test-coverage.ts

Checks that source files have corresponding test files.

```bash
# Check staged files only (default, for pre-commit)
pnpm check-tests

# Check all source files
pnpm check-tests:all

# Strict mode (fails if tests missing)
pnpm check-tests:strict

# Or directly
npx tsx scripts/check-test-coverage.ts
npx tsx scripts/check-test-coverage.ts --all
npx tsx scripts/check-test-coverage.ts --strict
```

**Options:**

- `--all` - Check all source files (not just staged)
- `--strict` - Exit with error code if tests are missing

**Files that require tests:**

- `lib/rules/**/*.ts` → expects `__tests__/*.test.ts`
- `lib/storage/*.ts` → expects `__tests__/*.test.ts`
- `lib/auth/*.ts` → expects `__tests__/*.test.ts`
- `lib/security/*.ts` → expects `__tests__/*.test.ts`
- `app/api/**/route.ts` → expects `__tests__/route.test.ts`

**Exempt files (no test required):**

- `index.ts` - Re-export files
- `types.ts` - Type definition files
- `constants.ts` - Constant definition files
- `*.d.ts` - TypeScript declaration files
- Files already in `__tests__/` directories

**When to run:**

- On commit (`pre-commit` hook runs this as a warning)
- Before creating PRs
- In CI pipeline with `--strict` flag

---

### sync-character.ts

Synchronizes character items with the core rulebook.

```bash
# Sync character (apply changes)
npx tsx scripts/sync-character.ts <character-id>

# Preview changes without saving
npx tsx scripts/sync-character.ts <character-id> --dry-run

# Verbose output
npx tsx scripts/sync-character.ts <character-id> --dry-run --verbose
```

**Options:**

- `--dry-run` - Preview changes without saving
- `--verbose, -v` - Show detailed sync information
- `--help` - Show help

**What gets synchronized:**

- Weapons (damage, accuracy, AP, etc.)
- Armor (ratings, capacity)
- Gear (availability, cost)
- Vehicles (stats, handling)
- Qualities (verified against rulebook)

**What is preserved:**

- Character-specific data (quantity, equipped status)
- Custom modifications
- Character ownership and ID

---

### verify-data.ts

Validates game data in edition files against reference documentation.

```bash
# Run verification
npx tsx scripts/verify-data.ts

# Filter by source
npx tsx scripts/verify-data.ts --sources Core,SR5:R&G

# Filter by category
npx tsx scripts/verify-data.ts --categories weapons,cyberware

# Custom output directory
npx tsx scripts/verify-data.ts --output ./reports

# Report only (no prompts)
npx tsx scripts/verify-data.ts --report-only
```

**Options:**

- `--sources <codes>` - Comma-separated source codes
- `--categories <cats>` - Comma-separated categories
- `--output <dir>` - Output directory for reports
- `--report-only` - Generate reports without interactive prompts
- `--help` - Show help

---

### migrate-rating-format.ts

Converts legacy rating properties to unified rating format.

```bash
# Preview migration
npx tsx scripts/migrate-rating-format.ts input.json output.json --dry-run

# Apply migration
npx tsx scripts/migrate-rating-format.ts input.json output.json
```

**Options:**

- `--dry-run` - Preview changes without writing

---

### migrate-to-unified-ratings.ts

Major edition data migration for consolidating rating entries.

```bash
# Preview migration
npx tsx scripts/migrate-to-unified-ratings.ts sr5 --dry-run

# Apply migration
npx tsx scripts/migrate-to-unified-ratings.ts sr5
```

**Options:**

- `--dry-run` - Preview changes without writing

**Migration types:**

- Consolidates duplicate "(Rating X)" entries
- Converts gear ratingSpec formulas to explicit tables
- Converts quality levels[] arrays to rating tables
- Converts adept power perLevel cost to rating tables

---

## npm Scripts

The following npm scripts are available for commonly used operations:

```bash
# Data management
pnpm backup create           # Create backup (via backup.ts)
pnpm health-check            # Run health check
pnpm seed-data               # Create seed data
pnpm verify-data             # Verify ruleset data

# User management
pnpm user-admin list         # List users
pnpm user-admin info <email> # Show user info

# Documentation & test enforcement
pnpm validate-docs           # Validate CLAUDE.md against codebase
pnpm check-tests             # Check staged files for missing tests
pnpm check-tests:all         # Check all source files
pnpm check-tests:strict      # Fail if tests are missing
```

---

## Development Guidelines

### Adding New Scripts

1. Create script in `/scripts/` directory
2. Add shebang: `#!/usr/bin/env npx tsx`
3. Include JSDoc comment with usage examples
4. Add `USAGE` constant with help text
5. Parse arguments with `parseArgs()` function
6. Support `--help` flag
7. Use proper exit codes (0 success, 1 error)
8. Add to this README

### Script Template

```typescript
#!/usr/bin/env npx tsx

/**
 * Script description
 *
 * Usage:
 *   npx tsx scripts/my-script.ts [options]
 *
 * Examples:
 *   npx tsx scripts/my-script.ts
 */

const USAGE = `
My Script

Usage:
  npx tsx scripts/my-script.ts [options]

Options:
  --help, -h    Show this help
`;

function parseArgs(args: string[]): { help: boolean } {
  return {
    help: args.includes("--help") || args.includes("-h"),
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { help } = parseArgs(args);

  if (help) {
    console.log(USAGE);
    process.exit(0);
  }

  // Script logic here
}

main();
```

### Common Patterns

**Dry-run mode:**

```typescript
if (dryRun) {
  console.log("[DRY RUN] No changes will be made");
  // Show what would happen
} else {
  // Actually make changes
}
```

**Force flag for destructive operations:**

```typescript
if (!force) {
  console.log("Use --force to confirm this action");
  process.exit(0);
}
```

**JSON output option:**

```typescript
if (jsonOutput) {
  console.log(JSON.stringify(data, null, 2));
} else {
  // Human-readable output
}
```

---

## Troubleshooting

### Script not found

Ensure you're running from the project root:

```bash
cd /path/to/ShadowMaster
npx tsx scripts/backup.ts
```

### Permission denied

Scripts may need data directory access:

```bash
# Check data directory permissions
ls -la data/
```

### TypeScript errors

Run type check:

```bash
pnpm type-check
```

### Missing dependencies

Install dependencies:

```bash
pnpm install
```
