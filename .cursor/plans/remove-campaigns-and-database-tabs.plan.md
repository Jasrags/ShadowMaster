<!-- remove-campaigns-db-tabs-plan -->

# Remove Campaigns and Database Tabs - Home & Characters Only

**Goal**: Remove all Campaign and Database tab functionality, keeping only Home and Characters tabs.

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## Phase 1: Frontend - Remove Database Tab Components & Pages

### 1.1 Delete Database Tab Page Files

- [ ] `web/ui/src/pages/ActionsPage.tsx`
- [ ] `web/ui/src/pages/ArmorPage.tsx`
- [ ] `web/ui/src/pages/BiowarePage.tsx`
- [ ] `web/ui/src/pages/BooksPage.tsx`
- [ ] `web/ui/src/pages/ComplexFormsPage.tsx`
- [ ] `web/ui/src/pages/ContactsPage.tsx`
- [ ] `web/ui/src/pages/CyberwarePage.tsx`
- [ ] `web/ui/src/pages/GearPage.tsx`
- [ ] `web/ui/src/pages/LifestylesPage.tsx`
- [ ] `web/ui/src/pages/MentorsPage.tsx`
- [ ] `web/ui/src/pages/MetatypesPage.tsx`
- [ ] `web/ui/src/pages/PowersPage.tsx`
- [ ] `web/ui/src/pages/ProgramsPage.tsx`
- [ ] `web/ui/src/pages/QualitiesPage.tsx`
- [ ] `web/ui/src/pages/SkillsPage.tsx`
- [ ] `web/ui/src/pages/SpellsPage.tsx`
- [ ] `web/ui/src/pages/TraditionsPage.tsx`
- [ ] `web/ui/src/pages/VehicleModificationsPage.tsx`
- [ ] `web/ui/src/pages/VehiclesPage.tsx`
- [ ] `web/ui/src/pages/WeaponAccessoriesPage.tsx`
- [ ] `web/ui/src/pages/WeaponConsumablesPage.tsx`
- [ ] `web/ui/src/pages/WeaponsPage.tsx`

### 1.2 Delete Database Tab Component Directories

- [ ] `web/ui/src/components/action/` (entire directory)
- [ ] `web/ui/src/components/armor/` (entire directory)
- [ ] `web/ui/src/components/bioware/` (entire directory)
- [ ] `web/ui/src/components/book/` (entire directory)
- [ ] `web/ui/src/components/complexform/` (entire directory)
- [ ] `web/ui/src/components/contact/` (entire directory)
- [ ] `web/ui/src/components/cyberware/` (entire directory)
- [ ] `web/ui/src/components/database/` (entire directory - DatabasePageLayout, ViewModeToggle)
- [ ] `web/ui/src/components/gear/` (entire directory)
- [ ] `web/ui/src/components/lifestyle/` (entire directory)
- [ ] `web/ui/src/components/mentor/` (entire directory)
- [ ] `web/ui/src/components/metatype/` (entire directory)
- [ ] `web/ui/src/components/power/` (entire directory)
- [ ] `web/ui/src/components/program/` (entire directory)
- [ ] `web/ui/src/components/quality/` (entire directory)
- [ ] `web/ui/src/components/skill/` (entire directory)
- [ ] `web/ui/src/components/spell/` (entire directory)
- [ ] `web/ui/src/components/tradition/` (entire directory)
- [ ] `web/ui/src/components/vehicle/` (entire directory)
- [ ] `web/ui/src/components/vehicle-modification/` (entire directory)
- [ ] `web/ui/src/components/weapon/` (entire directory)
- [ ] `web/ui/src/components/weapon-consumable/` (entire directory)

---

## Phase 2: Frontend - Remove Campaign Components & Pages

### 2.1 Delete Campaign Page Files

- [ ] `web/ui/src/pages/CampaignsPage.tsx`

### 2.2 Delete Campaign Component Directory

- [ ] `web/ui/src/components/campaigns/` (entire directory)
- CampaignCard.tsx
- CampaignCreationWizard.tsx
- CampaignEditModal.tsx
- CampaignList.tsx
- CampaignTable.tsx
- CampaignViewModal.tsx

### 2.3 Remove Campaign Dependencies from Character Components

- [ ] `web/ui/src/components/character/steps/Step1Concept.tsx`
- Remove `campaignApi` import
- Remove user search functionality (lines 36-50)
- Simplify player name input (remove admin user search)
- Remove `campaignApi.searchUsers` call

### 2.4 Remove Campaign Dependencies from Character Sheet

- [ ] `web/ui/src/pages/CharacterSheetPage.tsx`
- Remove `campaignApi` import (line 5)
- Remove `CampaignResponse` type import (line 7)
- Remove any campaign-related UI/functionality (check for campaign display/links)

### 2.5 Remove Campaign Dependencies from Common Components

- [ ] `web/ui/src/components/common/InvitationNotification.tsx`
- Delete entire file (campaign invitations only)

---

## Phase 3: Frontend - Update Routing & Navigation

### 3.1 Update App.tsx Routes

- [ ] Remove `CampaignsPage` import (line 9)
- [ ] Remove `/campaigns` route (lines 47-54)
- [ ] Remove `/campaigns/:campaignId/characters/create` route (lines 63-70)
- [ ] Remove all Database tab routes (lines 88-273):
- `/database` redirect
- `/gear`, `/armor`, `/weapons`, `/weapon-accessories`
- `/skills`, `/qualities`, `/books`, `/lifestyles`
- `/weapon-consumables`, `/contacts`, `/actions`
- `/cyberware`, `/bioware`, `/complex-forms`
- `/mentors`, `/metatypes`, `/powers`
- `/programs`, `/spells`, `/traditions`
- `/vehicle-modifications`, `/vehicles`
- [ ] Keep only: `/`, `/characters`, `/characters/create`, `/characters/:id`

### 3.2 Update AppLayout.tsx

- [ ] Remove Campaigns tab from tabs array (line 30)
- [ ] Remove Database tab and all nested tabs (lines 36-72)
- [ ] Keep only Home and Characters tabs
- [ ] Update tab logic to only show Characters for administrators

### 3.3 Update CharacterCreationPage.tsx

- [ ] Remove `campaignId` from useParams (line 8)
- [ ] Remove campaign-specific navigation logic (lines 18-19)
- [ ] Simplify `handleSuccess` to always navigate to `/characters`

---

## Phase 4: Frontend - Clean Up API & Types

### 4.1 Update lib/api.ts

- [ ] Remove `campaignApi` export (lines 106-197):
- `getCampaigns`, `getCampaign`, `updateCampaign`, `createCampaign`, `deleteCampaign`
- `getEditionBooks` (if only used by campaigns)
- `invitePlayer`, `getCampaignInvitations`, `removeInvitation`
- `removePlayer`, `getUserInvitations`, `acceptInvitation`, `declineInvitation`
- `searchUsers`
- [ ] Remove all Database tab API exports (lines 199-369):
- `gearApi`, `armorApi`, `weaponApi`, `skillApi`, `qualityApi`
- `bookApi`, `lifestyleApi`, `weaponConsumableApi`, `contactApi`
- `actionApi`, `cyberwareApi`, `biowareApi`, `complexFormApi`
- `mentorApi`, `metatypeApi`, `powerApi`, `programApi`
- `spellApi`, `traditionApi`, `vehicleModificationApi`, `vehicleApi`
- [ ] Keep: `authApi`, `characterApi`

### 4.2 Update lib/types.ts

- [ ] Remove campaign-related types:
- `CampaignResponse`, `CampaignPlayer`, `CampaignFaction`, etc.
- [ ] Remove Database item types (if only used by Database pages):
- Verify each type is not used by character creation/sheet
- Remove: `Gear`, `Armor`, `Weapon`, `WeaponAccessoryItem`, `Skill`, `Quality`, `Book`, `Lifestyle`, `WeaponConsumable`, `Contact`, `Action`, `Cyberware`, `Bioware`, `ComplexForm`, `Mentor`, `Metatype`, `Power`, `Program`, `Spell`, `Tradition`, `VehicleModification`, `Vehicle`
- **Note**: Some types may be needed for character data structures - verify before removing

---

## Phase 5: Frontend - Update Home Page

### 5.1 Update HomePage.tsx

- [ ] Remove campaign references from "Getting Started" section (line 30)
- [ ] Update welcome message to focus on character creation
- [ ] Update help text to remove campaign mentions

---

## Phase 6: Backend - Remove Database Equipment Routes

### 6.1 Update cmd/shadowmaster-server/main.go

- [ ] Remove admin-only equipment routes (lines 107-129):
- `/api/equipment/skills`
- `/api/equipment/weapons`
- `/api/equipment/weapon-accessories`
- `/api/equipment/gear`
- `/api/equipment/qualities`
- `/api/equipment/books` (verify if used by character creation)
- `/api/equipment/lifestyles`
- `/api/equipment/weapon-consumables`
- `/api/equipment/contacts`
- `/api/equipment/actions`
- `/api/equipment/bioware`
- `/api/equipment/complex-forms`
- `/api/equipment/mentors`
- `/api/equipment/metatypes`
- `/api/equipment/powers`
- `/api/equipment/programs`
- `/api/equipment/spells`
- `/api/equipment/traditions`
- `/api/equipment/vehicle-modifications`
- `/api/equipment/vehicles`
- [ ] **Keep** (if used by character creation):
- `/api/skills/active` (line 101)
- `/api/skills/knowledge` (line 102)
- `/api/equipment/armor` (line 105)
- `/api/equipment/cyberware` (line 106)
- [ ] Remove `/api/editions/{edition}/books` route (line 98) if not needed

### 6.2 Update internal/api/handlers.go

- [ ] Remove Database equipment handler methods:
- `GetSkills`, `GetWeapons`, `GetWeaponAccessories`, `GetGears`
- `GetQualities`, `GetBooks`, `GetLifestyles`, `GetWeaponConsumables`
- `GetContacts`, `GetActions`, `GetBioware`, `GetComplexForms`
- `GetMentors`, `GetMetatypes`, `GetPowers`, `GetPrograms`
- `GetSpells`, `GetTraditions`, `GetVehicleModifications`, `GetVehicles`
- [ ] **Keep** (if used by character creation):
- `GetActiveSkills`, `GetKnowledgeSkills`, `GetArmor`, `GetCyberware`
- [ ] Remove `GetEditionBooks` handler if not needed

---

## Phase 7: Backend - Remove Campaign/Session/Scene Routes

### 7.1 Update cmd/shadowmaster-server/main.go

- [ ] Remove `campaignService` initialization (line 50)
- [ ] Remove `sessionService` initialization (line 51)
- [ ] Remove `sceneService` initialization (line 52)
- [ ] Remove from `NewHandlers` call: `campaignService`, `sessionService`, `sceneService` (line 58)
- [ ] Remove Campaign routes (lines 138-156):
- `/api/campaigns` (GET, POST)
- `/api/campaigns/{id}` (GET, PUT, DELETE)
- `/api/campaigns/{id}/character-creation` (GET)
- `/api/campaigns/{id}/invitations` (POST, GET, DELETE)
- `/api/campaigns/{id}/players/{playerId}` (DELETE)
- [ ] Remove Invitation routes (lines 158-164):
- `/api/invitations` (GET)
- `/api/invitations/{id}/accept` (POST)
- `/api/invitations/{id}/decline` (POST)
- [ ] Remove User search route (lines 166-170):
- `/api/users/search` (GET)
- [ ] Remove Sessions routes (lines 172-183):
- `/api/sessions` (GET, POST)
- `/api/sessions/{id}` (GET, PUT, DELETE)
- [ ] Remove Scenes routes (lines 185-196):
- `/api/scenes` (GET, POST)
- `/api/scenes/{id}` (GET, PUT, DELETE)
- [ ] Remove Groups routes (lines 131-136):
- `/api/groups` (GET, POST)
- `/api/groups/{id}` (GET, PUT, DELETE)

### 7.2 Update internal/api/handlers.go

- [ ] Remove from `Handlers` struct:
- `CampaignRepo` (line 22)
- `SessionRepo` (line 23)
- `SceneRepo` (line 24)
- `GroupRepo` (line 21) - if not needed
- `CampaignService` (line 30)
- `SessionService` (line 31)
- `SceneService` (line 32)
- [ ] Remove campaign handler methods:
- `GetCampaigns`, `GetCampaign`, `CreateCampaign`, `UpdateCampaign`, `DeleteCampaign`
- `GetCampaignCharacterCreationData`
- `InvitePlayer`, `GetCampaignInvitations`, `RemoveInvitation`
- `RemovePlayer`
- [ ] Remove invitation handler methods:
- `GetUserInvitations`, `AcceptInvitation`, `DeclineInvitation`
- [ ] Remove user search handler:
- `SearchUsers`
- [ ] Remove session handler methods:
- `GetSessions`, `GetSession`, `CreateSession`, `UpdateSession`, `DeleteSession`
- [ ] Remove scene handler methods:
- `GetScenes`, `GetScene`, `CreateScene`, `UpdateScene`, `DeleteScene`
- [ ] Remove group handler methods (if not needed):
- `GetGroups`, `GetGroup`, `CreateGroup`, `UpdateGroup`, `DeleteGroup`
- [ ] Update `NewHandlers` function signature to remove:
- `campaignService`, `sessionService`, `sceneService` parameters

---

## Phase 8: Backend - Clean Up Services & Repositories

### 8.1 Repository Cleanup

- [ ] Update `internal/repository/json/repository.go`:
- Remove `Campaign` repository initialization
- Remove `Session` repository initialization
- Remove `Scene` repository initialization
- Remove `Group` repository initialization (if not needed)
- [ ] **Optional** - Delete repository files (if not used elsewhere):
- `internal/repository/json/campaign.go`
- `internal/repository/json/session.go`
- `internal/repository/json/scene.go`
- `internal/repository/json/group.go`

### 8.2 Service Cleanup

- [ ] **Optional** - Delete service files (if not used elsewhere):
- `internal/service/campaign.go`
- `internal/service/session.go`
- `internal/service/scene.go`

### 8.3 Domain Cleanup

- [ ] **Optional** - Delete domain files (if not used elsewhere):
- `internal/domain/campaign.go`
- `internal/domain/session.go`
- `internal/domain/scene.go`
- `internal/domain/group.go`
- [ ] **Note**: Character domain may reference `CampaignID` - keep field but don't use in UI

### 8.4 Repository Interface Cleanup

- [ ] Update `internal/repository/interfaces.go`:
- Remove `CampaignRepository` interface
- Remove `SessionRepository` interface
- Remove `SceneRepository` interface
- Remove `GroupRepository` interface (if not needed)

---

## Phase 9: Testing & Verification

### 9.1 Frontend Testing

- [ ] Home page loads correctly
- [ ] Login/Register works
- [ ] Characters tab appears for administrators
- [ ] Character creation wizard works end-to-end
- [ ] Character sheet displays correctly
- [ ] Character editing works
- [ ] No broken imports or missing components
- [ ] No console errors

### 9.2 Backend Testing

- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Authentication endpoints work
- [ ] Character CRUD endpoints work
- [ ] Character creation data endpoint works
- [ ] No broken handler references
- [ ] No missing repository/service errors

### 9.3 Integration Testing

- [ ] Full character creation flow works
- [ ] Character can be viewed after creation
- [ ] Character can be updated
- [ ] Character can be deleted
- [ ] All navigation works correctly

### 9.4 Code Quality

- [ ] Run linter and fix any errors
- [ ] Remove unused imports
- [ ] Remove unused types
- [ ] Verify no dead code remains

---

## Phase 10: Documentation Updates

### 10.1 Update README.md

- [ ] Remove campaign features from description
- [ ] Update feature list to only mention Characters
- [ ] Remove campaign-related API endpoints from documentation
- [ ] Update architecture description if needed

### 10.2 Update API Documentation

- [ ] Remove campaign endpoints from API docs
- [ ] Remove database equipment endpoints from API docs
- [ ] Keep only: Auth, Characters, Edition metadata

---

## Notes & Considerations

### Important Dependencies to Verify

1. **Character Creation Data**: The `/api/editions/{edition}/character-creation` endpoint should remain - it's used by the character creation wizard
2. **Active/Knowledge Skills**: Verify if `/api/skills/active` and `/api/skills/knowledge` are used by character creation
3. **Armor/Cyberware**: Verify if `/api/equipment/armor` and `/api/equipment/cyberware` are used by character creation
4. **Books Endpoint**: Check if `/api/editions/{edition}/books` is needed for character creation or can be removed
5. **Character Domain**: The `CampaignID` field in Character domain can remain for future use

### Files That May Need Manual Review

- `web/ui/src/lib/types.ts` - Verify which types are actually used
- `internal/domain/character.go` - Keep CampaignID field but don't use in UI
- Any test files that reference removed functionality

### Rollback Strategy

- Commit after each phase completion
- Tag commits for easy rollback
- Keep a branch with full functionality for reference

---

## Progress Summary

**Total Phases**: 10
**Total Tasks**: ~150+ individual items

**Current Status**: ⬜ Not Started

**Estimated Time**: 4-6 hours for careful removal and testing