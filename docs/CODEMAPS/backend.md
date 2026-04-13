<!-- Generated: 2026-04-13 | Files scanned: 217 | Token estimate: ~950 -->

# Backend Architecture

## API Route Domains (217 route files)

### Auth (9 routes)

```
POST /api/auth/signin        → verifyCredentials → createSession → RateLimiter
POST /api/auth/signup        → createUser → hashPassword → sendVerificationEmail
POST /api/auth/signout       → clearSession → AuditLogger
GET  /api/auth/me            → getSession → getUserById
POST /api/auth/magic-link    → requestMagicLink → RateLimiter
POST /api/auth/forgot-password → requestPasswordReset → RateLimiter
POST /api/auth/reset-password → resetPassword → isStrongPassword
```

### Characters — Core (80+ routes)

```
GET    /api/characters                → searchCharacters (multi-criteria)
POST   /api/characters                → createCharacterDraft → logActivity
GET    /api/characters/[id]           → resolveCharacterForGameplay
PATCH  /api/characters/[id]           → updateCharacter → authorizeOwnerAccess → createAuditEntry
DELETE /api/characters/[id]           → deleteCharacter → authorizeOwnerAccess
POST   /api/characters/[id]/finalize  → finalizeCharacter
POST   /api/characters/[id]/clone     → cloneCharacter
POST   /api/characters/[id]/validate  → validateCharacter
```

### Characters — Advancement

```
POST /api/characters/[id]/advancement/skills           → advanceSkill → loadAndMergeRuleset
POST /api/characters/[id]/advancement/attributes       → advanceAttribute
POST /api/characters/[id]/advancement/edge             → advanceEdge
POST /api/characters/[id]/advancement/specializations  → advanceSpecialization
POST /api/characters/[id]/advancement/[recordId]/approve → authorizeGM
```

### Characters — Subsystems

```
augmentations/          → CRUD + cyberlimbs + enhancements + accessories (13 routes)
contacts/               → CRUD + call-favor + spend-chips + edge (8 routes)
loadouts/               → CRUD + apply (5 routes)
inventory/              → items + containers (4 routes)
weapons/[id]/ammo|mods  → ammo management + weapon mods (6 routes)
magic/                  → spells + drain (4 routes)
matrix/                 → programs + overwatch (4 routes)
rigging/                → drones + validation (3 routes)
qualities/              → CRUD + state toggle (5 routes)
modifiers/              → CRUD (4 routes)
training/               → CRUD (4 routes)
```

### Campaigns (25+ routes)

```
GET/POST /api/campaigns              → list/create
GET/PUT/DELETE /api/campaigns/[id]   → CRUD (GM-only write)
POST /api/campaigns/[id]/join|leave  → player management
sessions/                            → CRUD + complete + edge-refresh + awards
advancements/                        → list + approve/reject (GM)
contacts/                            → campaign-level contacts
locations/                           → import/export support
```

### Combat (14 routes)

```
GET/POST   /api/combat                           → list/create sessions
GET/PATCH/DELETE /api/combat/[sessionId]          → session CRUD
POST /api/combat/[sessionId]/turn                → advance turn
POST /api/combat/[sessionId]/spend-action        → action economy
participants/                                    → CRUD combatants
```

### Other Domains

```
grunt-teams/     → team CRUD + bulk damage + initiative + edge (10 routes)
editions/        → edition metadata + content + archetypes + grunt-templates (9 routes)
locations/       → CRUD + connections + templates (14 routes)
account/         → preferences + export/import + delete + password (5 routes)
settings/        → account + communications + password (6 routes)
users/           → admin CRUD + suspend/lockout (7 routes)
notifications/   → list + mark-read (3 routes)
health           → health check (1 route)
```

## Authorization Model

```
getSession()              → All authenticated routes
authorizeOwnerAccess()    → Character owner only
authorizeCampaign()       → Campaign member access
authorizeGM()             → GM-only operations
requireAdmin()            → Admin panel operations
resolveCharacterForGameplay() → GM cross-user character access
```

## Key Storage Functions

```
readJsonFile() / writeJsonFile()  → All data persistence
getCharacter() / updateCharacter() → Character CRUD
getCampaignById() / updateCampaign() → Campaign CRUD
loadAndMergeRuleset()             → Ruleset composition (edition + errata)
createAuditEntry()                → Character change audit trail
logActivity()                     → Campaign activity feed
createNotification()              → User notifications
```
