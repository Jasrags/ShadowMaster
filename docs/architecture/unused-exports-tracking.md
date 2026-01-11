# Unused Exports Tracking

**Created:** 2025-12-29
**Purpose:** Map unused exports (detected by knip) to planned capabilities
**Baseline:** 169 unused exports, 64 unused types, 20 unused files

This document tracks intentionally pre-built code that will be consumed when their
associated capabilities are implemented. After completing each capability, run
`pnpm knip` to verify reduction.

---

## Phase 5: Specialized Domains (Next Up)

### mechanics.matrix-operations (⏳ Pending)

**Ruleset Hooks** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useProgramsCatalog` | 1775 | Get full programs catalog |
| `usePrograms` | 1783 | Get programs by type |
| `useCommonPrograms` | 1844 | Filter common programs |
| `useHackingPrograms` | 1852 | Filter hacking programs |
| `useAgentPrograms` | 1860 | Filter agent programs |
| `useSpriteTypes` | 1101 | Technomancer sprite types |
| `useSpritePowers` | 1109 | Sprite power catalog |

**Loader Functions** (`lib/rules/loader.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `extractPrograms` | 653 | Extract all programs from ruleset |
| `extractProgramsByCategory` | 667 | Programs filtered by category |
| `extractCommonPrograms` | 683 | Common program extraction |
| `extractHackingPrograms` | 691 | Hacking program extraction |
| `extractAgentPrograms` | 699 | Agent program extraction |

**Types** (`lib/types/programs.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `ProgramsModule` | 71 | Programs module interface |

**Expected Reduction:** ~15 exports after Matrix Operations implementation

---

### mechanics.rigging-control (⏳ Pending)

**Ruleset Hooks** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useVehiclesCatalog` | 1545 | Full vehicles catalog |
| `useVehiclesByType` | 1597 | Vehicles filtered by type |

**Loader Functions** (`lib/rules/loader.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `extractVehicles` | 569 | Extract all vehicles |
| `extractVehiclesByCategory` | 584 | Vehicles by category |
| `extractVehicleCategories` | 600 | Vehicle category list |
| `extractDrones` | 608 | Extract drones |
| `extractDroneSizes` | 616 | Drone size categories |
| `extractRCCs` | 624 | Rigger command consoles |
| `extractAutosofts` | 632 | Autosoft programs |

**Types** (`lib/types/vehicles.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `OwnedVehicle` | 326 | Character-owned vehicle state |
| `OwnedDrone` | 352 | Character-owned drone state |
| `OwnedRCC` | 385 | Owned RCC state |
| `OwnedAutosoft` | 406 | Owned autosoft state |
| `VehiclesModuleData` | 424 | Vehicles module interface |

**Expected Reduction:** ~15 exports after Rigging Control implementation

---

### character.augmentation-systems (⏳ Pending)

**Ruleset Hooks** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useCyberwareModifications` | 1009 | Cyberware mod catalog |
| `calculateRemainingEssence` | 1353 | Essence calculation utility |
| `canAddAugmentation` | 1384 | Augmentation validation |
| `checkAttributeBonusLimit` | 1402 | Attribute bonus limit check |

**Loader Functions** (`lib/rules/loader.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `extractCyberwareModifications` | 770 | Cyberware mod extraction |
| `extractGearModifications` | 778 | General gear mod extraction |

**Types** (`lib/types/character.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `CYBERWARE_GRADE_MULTIPLIERS` | 701 | Grade essence multipliers |
| `CYBERWARE_GRADE_AVAILABILITY_MODIFIERS` | 712 | Grade availability modifiers |
| `CYBERWARE_GRADE_COST_MULTIPLIERS` | 726 | Grade cost multipliers |
| `BIOWARE_GRADE_MULTIPLIERS` | 771 | Bioware grade multipliers |

**Types** (`lib/types/edition.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `CyberwareCatalogItem` | 310 | Cyberware catalog interface |
| `BiowareCatalogItem` | 393 | Bioware catalog interface |
| `AugmentationRules` | 456 | Augmentation rules interface |

**Expected Reduction:** ~15 exports after Augmentation Systems implementation

---

## Phase 4: Action Resolution (UI Incomplete)

### Action Resolution UI Components

**Unused Files** (`components/action-resolution/`)
| File | Purpose |
|------|---------|
| `ActionPoolBuilder.tsx` | Interactive pool building UI |
| `ActionHistory.tsx` | Action history display |
| `EdgeTracker.tsx` | Edge point tracker UI |
| `index.ts` | Barrel export file |

**Hooks** (`lib/rules/action-resolution/hooks.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `useActionResolver` | 70 | Main action resolution hook |
| `usePoolBuilder` | 461 | Pool building state hook |
| `useActionHistory` | 569 | Action history state hook |

**Pool Builder** (`lib/rules/action-resolution/pool-builder.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `buildSimplePool` | 284 | Generic pool construction |
| `applyLimitToPool` | 312 | Limit application |
| `buildAttackPool` | 331 | Attack pool construction |
| `buildResistancePool` | 375 | Resistance pool construction |
| `buildSpellcastingPool` | 403 | Spellcasting pool construction |
| `buildPerceptionPool` | 425 | Perception pool construction |

**Edge Actions** (`lib/rules/action-resolution/edge-actions.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `canUseEdgeAction` | 59 | Edge action validation |
| `executeEdgeAction` | 315 | Edge action execution |
| `canRestoreEdge` | 408 | Edge restoration check |

**Dice Engine** (`lib/rules/action-resolution/dice-engine.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `expectedHits` | 400 | Statistical expected hits |
| `glitchProbability` | 409 | Glitch probability calculation |

**Components** (`components/DiceRoller.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `EdgeRerollButton` | 529 | Edge reroll UI button |

**Combat Handlers** (`lib/rules/action-resolution/combat/`)
| Export | File | Line | Purpose |
|--------|------|------|---------|
| `calculateNaturalHealingPool` | damage-handler.ts | 559 | Healing pool calculation |
| `processElementalDamage` | damage-handler.ts | 585 | Elemental damage processing |
| `createConditionUpdates` | damage-handler.ts | 628 | Condition monitor updates |
| `FIRING_MODE_RECOIL` | weapon-handler.ts | 164 | Recoil constants |

**Storage** (`lib/storage/action-history.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getRecentActions` | 59 | Recent action retrieval |
| `clearActionHistory` | 329 | Clear action history |
| `deleteActionHistory` | 348 | Delete action history |

**Types** (`lib/types/action-resolution.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `ActionResultResponse` | 322 | API response type |
| `ActionHistoryResponse` | 338 | History API response |
| `EdgeResponse` | 352 | Edge API response |
| `ActionActivityType` | 370 | Activity type enum |

**Types** (`lib/types/action-definitions.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `ActionCatalog` | 339 | Full action catalog |
| `GetAvailableActionsRequest` | 401 | API request type |
| `GetAvailableActionsResponse` | 410 | API response type |
| `GetActionDetailsRequest` | 420 | Details request type |
| `GetActionDetailsResponse` | 428 | Details response type |

**Ruleset Actions** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useActions` | 1909 | Actions by category |
| `useAllActions` | 1917 | All actions catalog |
| `useActionsByDomain` | 1937 | Actions filtered by domain |

**Expected Reduction:** ~35 exports when action UI pages are built

---

## Phase 7-8: Real-Time & Multiplayer (📝 Draft)

### Combat UI Components

**Unused Files** (`app/characters/[id]/components/`)
| File | Purpose |
|------|---------|
| `CombatTrackerModal.tsx` | Combat session tracker |
| `CombatModeIndicator.tsx` | Combat state indicator |
| `ActionResultToast.tsx` | Action result notifications |
| `index.ts` | Barrel export file |

**Types** (`lib/types/combat.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `InitiativePass` | 262 | Initiative pass tracking |
| `CreateCombatSessionRequest` | 331 | Create session API |
| `UpdateCombatSessionRequest` | 352 | Update session API |
| `CombatInitiativeRequest` | 362 | Initiative roll API |
| `ExecuteActionRequest` | 373 | Action execution API |
| `CombatSessionResponse` | 393 | Session API response |
| `CombatSessionsListResponse` | 402 | Sessions list API |
| `InitiativeRollResponse` | 411 | Initiative API response |
| `ActionExecutionResponse` | 422 | Execution API response |
| `CombatActivityType` | 453 | Combat activity enum |

### Campaign Sessions

**Unused Files** (`app/campaigns/[id]/components/`)
| File | Purpose |
|------|---------|
| `CampaignSessionsTab.tsx` | Session management UI |

---

## Supporting Systems (Partially Used)

### Magic Components

**Unused Files** (`app/characters/create/components/`)
| File | Purpose |
|------|---------|
| `SpellSelector.tsx` | Spell selection (superseded by MagicStep) |
| `AdeptPowerSelector.tsx` | Adept power selection (superseded by MagicStep) |

**Unused Files** (`components/character/`)
| File | Purpose |
|------|---------|
| `Spellbook.tsx` | Character sheet spellbook display |
| `AdeptPowerList.tsx` | Adept powers display |
| `MagicSummary.tsx` | Magic summary widget |
| `index.ts` | Barrel export file |

**Ruleset Hooks** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useSpell` | 1475 | Single spell lookup |
| `useAdeptPower` | 1497 | Single adept power lookup |
| `useRitual` | 1508 | Single ritual lookup |
| `useMentorSpirit` | 1519 | Single mentor spirit lookup |
| `useTradition` | 1530 | Single tradition lookup |

**Magic Rules** (`lib/rules/magic/`)
| Export | File | Line | Purpose |
|--------|------|------|---------|
| `getAllAdeptPowers` | spell-validator.ts | 447 | All adept powers list |
| `getTraditionSpiritTypes` | tradition-validator.ts | 138 | Tradition spirit types |
| `getAvailableTraditions` | tradition-validator.ts | 478 | Available traditions list |

**Magic Types** (`lib/types/magic.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `MagicState` | 19 | Magic state interface |
| `SpellType` | 369 | Spell type enum |

**Advancement** (`lib/rules/advancement/magic-advancement.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `validateSpellAdvancement` | 66 | Spell learning validation |
| `validateInitiationAdvancement` | 175 | Initiation validation |
| `validateAdeptPowerAdvancement` | 259 | Adept power advancement |
| `validateRitualAdvancement` | 364 | Ritual learning validation |
| `getAvailableMetamagics` | 416 | Metamagic options |

**Focus Types** (`lib/types/edition.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `Focus` | 500 | Focus interface |
| `FocusCatalogItem` | 512 | Focus catalog item |
| `Spirit` | 569 | Spirit interface |

---

### Contact/Social System

**Rules** (`lib/rules/contacts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getLoyaltyImprovementCost` | 407 | Loyalty karma cost |
| `getConnectionImprovementCost` | 459 | Connection karma cost |
| `getNewContactCost` | 512 | New contact karma cost |
| `resolveSharedContact` | 544 | Shared contact resolution |

**Favors** (`lib/rules/favors.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getFavorBalance` | 314 | Favor balance calculation |
| `getOwedFavors` | 331 | Owed favors list |
| `getOwingContacts` | 357 | Contacts who owe favors |
| `calculateBurnRisk` | 399 | Contact burn risk |
| `findBestContactForService` | 479 | Service matching |

**Social Actions** (`lib/rules/social-actions.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `resolveBribe` | 399 | Bribe resolution |
| `resolveLegwork` | 464 | Legwork resolution |
| `propagateSocialConsequences` | 526 | Social consequence spread |
| `calculateSocialLimit` | 595 | Social limit calculation |

**Storage** (`lib/storage/contacts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `updateContactLoyalty` | 368 | Update loyalty |
| `updateContactConnection` | 413 | Update connection |
| `updateContactFavorBalance` | 458 | Update favor balance |
| `updateCampaignContact` | 586 | Update campaign contact |
| `deleteCampaignContact` | 627 | Delete campaign contact |
| `searchContacts` | 648 | Search contacts |
| `searchCampaignContacts` | 740 | Search campaign contacts |
| `calculateTotalContactPoints` | 873 | Contact point total |
| `countContactsByStatus` | 886 | Count by status |

**Storage** (`lib/storage/favor-ledger.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getSessionTransactions` | 205 | Session transactions |
| `getTransactionsByType` | 222 | Transactions by type |
| `getTransactionsByDateRange` | 240 | Transactions by date |
| `getPendingApprovals` | 260 | Pending approvals |
| `approveFavorTransaction` | 284 | Approve transaction |
| `rejectFavorTransaction` | 337 | Reject transaction |
| `recalculateAggregates` | 389 | Recalculate aggregates |
| `getContactFavorBalance` | 417 | Contact favor balance |
| `getFavorStatistics` | 437 | Favor statistics |

**Storage** (`lib/storage/social-capital.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `checkContactBudget` | 252 | Budget check |
| `setMaxContactPoints` | 301 | Set max points |
| `setCampaignConstraints` | 326 | Set constraints |
| `applyInfluenceModifiers` | 356 | Apply modifiers |
| `getSocialCapitalSummary` | 390 | Capital summary |

**Types** (`lib/types/contacts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `SocialAction` | 531 | Social action interface |
| `FavorCostTable` | 615 | Favor cost table |
| `ContactStateChangeRequest` | 763 | State change API |
| `CallFavorRequest` | 771 | Call favor API |
| `NetworkingActionRequest` | 799 | Networking API |
| `ContactResponse` | 809 | Contact API response |
| `ContactsListResponse` | 818 | Contacts list API |
| `FavorLedgerResponse` | 828 | Ledger API response |
| `SocialCapitalResponse` | 838 | Capital API response |
| `CallFavorResponse` | 847 | Call favor API response |
| `NetworkingActionResponse` | 866 | Networking API response |
| `SocialActivityType` | 882 | Social activity enum |
| `DEFAULT_CONTACT_VISIBILITY` | 54 | Default visibility |
| `GM_CONTACT_VISIBILITY` | 65 | GM visibility |

---

### Grunt/NPC System

**Rules** (`lib/rules/grunts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getConditionMonitorSize` | 64 | Grunt condition monitor |
| `shouldCheckMorale` | 264 | Morale check trigger |
| `attemptRally` | 300 | Rally attempt |
| `getGroupEdgeMax` | 332 | Group edge maximum |
| `calculateRemainingEdge` | 354 | Remaining edge |
| `applyWoundModifierToInitiative` | 443 | Wound modifier |
| `getProfessionalRatingModifiers` | 666 | PR modifiers |
| `DEFAULT_SIMPLIFIED_RULES` | 733 | Simplified rules |
| `MOWING_THEM_DOWN_RULES` | 744 | Mowing rules |
| `isRollUnopposed` | 759 | Unopposed check |
| `canGruntsDodge` | 777 | Dodge check |
| `doesAmbushFail` | 787 | Ambush failure |
| `isAutoSurprise` | 797 | Auto surprise |
| `isCriticalGlitch` | 855 | Critical glitch |

**Storage** (`lib/storage/grunts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getGruntTeamsByEncounter` | 303 | Teams by encounter |
| `refreshGroupEdge` | 580 | Refresh group edge |
| `resetCombatState` | 608 | Reset combat state |
| `duplicateGruntTeam` | 652 | Duplicate team |

**Storage** (`lib/storage/grunt-templates.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getTemplatesByRating` | 102 | Templates by rating |
| `getTemplateByName` | 124 | Template by name |
| `getTemplatesByCategory` | 140 | Templates by category |
| `hasTemplates` | 175 | Check templates exist |
| `getTemplateCategories` | 192 | Template categories |

**Types** (`lib/types/grunts.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `GruntActivityType` | 658 | Grunt activity enum |

---

### Quality System

**Rules** (`lib/rules/qualities/dynamic-state/`)
| Export | File | Line | Purpose |
|--------|------|------|---------|
| `attemptRecovery` | addiction.ts | 141 | Addiction recovery |
| `applyAllergyDamage` | allergy.ts | 133 | Allergy damage |
| `calculateTotalTimeCommitment` | dependents.ts | 109 | Dependent time |

---

### Downtime/Advancement

**Rules** (`lib/rules/advancement/downtime.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `getDowntimeEvents` | 15 | Get downtime events |
| `getDowntimeEventById` | 28 | Get event by ID |
| `getDowntimeTraining` | 122 | Get training events |
| `getDowntimeAdvancements` | 138 | Get advancements |

**Rules** (`lib/rules/advancement/ledger.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `earnKarma` | 98 | Karma earning |

**Loader** (`lib/rules/loader.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `extractAdvancement` | 799 | Advancement extraction |
| `extractAllActions` | 856 | All actions extraction |

---

### Validation

**Rules** (`lib/rules/constraint-validation.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `validateCharacter` | 663 | Full character validation |
| `calculateRemainingBudget` | 775 | Budget calculation |
| `isAttributeWithinLimits` | 876 | Attribute limit check |

**Rules** (`lib/rules/validation/character-validator.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `isCharacterValid` | 561 | Validity check |

**Types** (`lib/rules/action-resolution/action-validator.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `ValidationSeverity` | 36 | Validation severity type |

**Types** (`lib/rules/action-resolution/combat/weapon-handler.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `RecoilState` | 118 | Recoil state interface |

---

### Gameplay Utilities

**Rules** (`lib/rules/gameplay.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `calculateWoundModifier` | 234 | Wound modifier calculation |

---

### Auth/Storage Infrastructure

**Auth** (`lib/auth/`)
| Export | File | Line | Purpose |
|--------|------|------|---------|
| `authorizeGM` | campaign.ts | 115 | GM authorization |
| `authorizeMember` | campaign.ts | 125 | Member authorization |
| `canViewCharacter` | character-authorization.ts | 359 | View permission |
| `canEditCharacter` | character-authorization.ts | 371 | Edit permission |
| `canFinalizeCharacter` | character-authorization.ts | 383 | Finalize permission |
| `canDeleteCharacter` | character-authorization.ts | 395 | Delete permission |
| `isAdmin` | middleware.ts | 48 | Admin check |
| `getUsernameError` | validation.ts | 63 | Username validation |

**Storage** (`lib/storage/`)
| Export | File | Line | Purpose |
|--------|------|------|---------|
| `getCampaignsByGmId` | campaigns.ts | 133 | Campaigns by GM |
| `isPlayerInCampaign` | campaigns.ts | 384 | Player membership |
| `getDowntimeEvents` | campaigns.ts | 526 | Campaign downtime |
| `getDowntimeEventById` | campaigns.ts | 536 | Downtime by ID |
| `addAuditEntry` | characters.ts | 394 | Audit entry |
| `editionExists` | editions.ts | 85 | Edition check |
| `getCoreBook` | editions.ts | 147 | Core book retrieval |
| `getDefaultCreationMethod` | editions.ts | 239 | Default creation method |
| `getBookSummary` | editions.ts | 374 | Book summary |
| `incrementTemplateUsage` | locations.ts | 718 | Template usage |
| `countAdmins` | user-audit.ts | 249 | Admin count |

**Storage** (`lib/storage/audit.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `buildAuditActor` | 194 | Build audit actor |

**Types** (`lib/storage/audit.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `AuditUpdateContext` | 183 | Audit context interface |

---

### Ruleset Hooks

**RulesetContext** (`lib/rules/RulesetContext.tsx`)
| Export | Line | Purpose |
|--------|------|---------|
| `useCreationMethods` | 758 | Creation methods list |
| `useRulesetReady` | 821 | Ruleset ready check |

---

### Modification System

**Loader** (`lib/rules/loader.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `extractWeaponModifications` | 754 | Weapon mods |
| `extractArmorModifications` | 762 | Armor mods |

**Types** (`lib/types/edition.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `ModifiableGearType` | 596 | Modifiable gear enum |
| `ModificationsCatalog` | 734 | Modifications catalog |

---

### Character/Creation Types

**Types** (`lib/types/character.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `SkillWithSource` | 442 | Skill with source |
| `CreateCharacterRequest` | 1019 | Create character API |
| `UpdateCharacterRequest` | 1025 | Update character API |
| `CharacterResponse` | 1029 | Character API response |
| `CharactersListResponse` | 1036 | Characters list API |

**Types** (`lib/types/creation.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `SR5PriorityTable` | 354 | SR5 priority table |

**Types** (`lib/types/discovery.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `EditionDiscoveryResponse` | 152 | Edition discovery API |

**Types** (`lib/types/edition.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `AdvancementRules` | 161 | Advancement rules |
| `RuleModule` | 203 | Rule module interface |
| `RuleOverride` | 238 | Rule override interface |

**Types** (`lib/types/campaign.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `CampaignMembership` | 200 | Campaign membership |

**Types** (`lib/types/user.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `UsersListResponse` | 72 | Users list API |

**Types** (`lib/types/ratings.ts`)
| Export | Line | Purpose |
|--------|------|---------|
| `OwnedItemRating` | 117 | Owned item rating |

---

### Contact Network (Unused File)

**Unused Files** (`lib/rules/`)
| File | Purpose |
|------|---------|
| `contact-network.ts` | Contact network graph utilities |

---

### Barrel Export Files (Can Remove)

These are index.ts files that re-export from other modules but aren't imported:

| File                                        | Action |
| ------------------------------------------- | ------ |
| `app/characters/[id]/components/index.ts`   | Remove |
| `app/characters/create/components/index.ts` | Remove |
| `components/action-resolution/index.ts`     | Remove |
| `components/character/index.ts`             | Remove |
| `components/combat/index.ts`                | Remove |
| `lib/rules/character/index.ts`              | Remove |
| `lib/storage/index.ts`                      | Remove |

---

## Tracking Progress

### Baseline (2025-12-29)

- **Unused exports:** 169
- **Unused types:** 64
- **Unused files:** 20

### After mechanics.matrix-operations

- [ ] Run `pnpm knip`
- [ ] Record new counts
- [ ] Expected reduction: ~15 exports

### After mechanics.rigging-control

- [ ] Run `pnpm knip`
- [ ] Record new counts
- [ ] Expected reduction: ~15 exports

### After character.augmentation-systems

- [ ] Run `pnpm knip`
- [ ] Record new counts
- [ ] Expected reduction: ~15 exports

### After Action Resolution UI

- [ ] Run `pnpm knip`
- [ ] Record new counts
- [ ] Expected reduction: ~35 exports

---

## Notes

1. **API Types**: Many unused types are request/response interfaces for APIs that exist
   but aren't consumed by a frontend yet. These will be used when UI pages are built.

2. **Barrel Files**: The unused index.ts files can be safely removed as they provide
   no value if not imported.

3. **Magic Components**: Some magic components were superseded by the unified MagicStep
   component but kept for potential future use in character sheet display.

4. **Social/Contact Utilities**: The social governance capability is implemented but
   many utility functions for advanced contact management aren't exposed in UI yet.
