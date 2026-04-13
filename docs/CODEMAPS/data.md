<!-- Generated: 2026-04-13 | Files scanned: ~22 storage modules | Token estimate: ~600 -->

# Data Architecture

## Storage Model

File-based JSON storage in `/data/` — no database. All access via `readJsonFile()` / `writeJsonFile()`.

## Data Directories

```
/data/
├── editions/sr5/
│   ├── edition.json              Edition metadata
│   ├── core-rulebook.json        ~850KB core ruleset (mechanics, attributes, skills, qualities)
│   ├── run-faster.json           ~570KB sourcebook supplement
│   ├── core-errata-2014-02-09.json  Errata patches
│   ├── rule-reference.json       ~43KB indexed reference
│   ├── archetypes/               Archetype templates by role
│   ├── example-characters/       Sample character sheets
│   ├── grunt-templates/          NPC stat templates
│   └── sample-contacts/          56 pre-made contact files
├── characters/                   ~1268 character JSON files
├── campaigns/                    ~493 campaign files
├── users/                        ~119 user records
├── combat/                       18 combat encounter dirs
├── contacts/                     Contact/NPC profiles
├── notifications/                35 notification type dirs
├── emails/                       ~1984 email logs
├── activity/                     22+ campaign activity logs
├── audit/                        Audit trail records
├── migration/                    Schema migration snapshots
├── violations/                   Constraint violation records
├── matrix/                       Matrix session data
├── ruleset-snapshots/            Cached rule state
├── drift-reports/                Sync drift detection
├── campaign_templates/           Campaign setup templates
├── templates/                    Email/form templates
└── security/                     Security audit data
```

## Storage Modules (/lib/storage/)

| Module                 | Entity        | Key Operations                      |
| ---------------------- | ------------- | ----------------------------------- |
| `characters.ts`        | Characters    | CRUD, advancement, skill updates    |
| `campaigns.ts`         | Campaigns     | Create, state management, archives  |
| `users.ts`             | Users         | Account, permissions, preferences   |
| `contacts.ts`          | Contacts      | Relationship states, NPC management |
| `combat.ts`            | Combat        | Encounter state, initiative, turns  |
| `editions.ts`          | Editions      | Rulebook loading, errata merging    |
| `grunts.ts`            | Grunts        | NPC instances                       |
| `grunt-templates.ts`   | Templates     | NPC stat templates                  |
| `locations.ts`         | Locations     | Security ratings, metadata          |
| `archetypes.ts`        | Archetypes    | Archetype lookup                    |
| `notifications.ts`     | Notifications | System alerts                       |
| `activity.ts`          | Activity      | Campaign activity feed              |
| `favor-ledger.ts`      | Favors        | Favor/obligation tracking           |
| `social-capital.ts`    | Social        | Karma and street cred               |
| `action-history.ts`    | Actions       | Timestamped action records          |
| `user-audit.ts`        | Audit         | User action audit log               |
| `ruleset-snapshots.ts` | Snapshots     | Cached rule snapshots               |
| `snapshot-cache.ts`    | Cache         | In-memory rule cache                |
| `base.ts`              | —             | Abstract CRUD base class            |
| `validation.ts`        | —             | Data validation rules               |

## Data Flow

```
API Route → Storage Module → readJsonFile(path) → JSON.parse → Return
         → Storage Module → writeJsonFile(path, data) → JSON.stringify → fs.writeFile
         → loadAndMergeRuleset() → edition.json + core-rulebook + errata → merged ruleset
```

## Edition Data Schema

```
edition.json:        { id, name, version, rulebooks[] }
core-rulebook.json:  { id, name, page, section, entries[] } (nested catalog)
```
