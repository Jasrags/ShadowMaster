# Inventory Components Testing Walkthrough

This document provides a step-by-step guide to manually verify the inventory management features implemented in ADR-010.

## Prerequisites

1. Start the development server: `pnpm dev`
2. Sign in to the application
3. Navigate to a character with inventory data (e.g., Test Street Sam)

## Test Character: Test Street Sam

Located at: `/data/characters/b93e21d4-0d8e-44e8-98f0-d4d7a2942e91/test-street-sam.json`

This character has been configured with:

- **Weapons**: 5 weapons with various states and ammo configurations
- **Armor**: 2 armor items (Armor Jacket worn, Full Body Armor stored)
- **Ammunition**: 8 ammo types across different calibers
- **Cyberware**: Multiple augmentations with wireless capability

---

## 1. Weapon Readiness States

### Test: Weapon State Display

**Location**: Character Sheet > Inventory Panel > Weapons Tab

| Weapon          | Expected State | Visual Indicator |
| --------------- | -------------- | ---------------- |
| Ares Predator V | Holstered      | Amber badge      |
| Steyr TMP       | Stored         | Gray badge       |
| HK-227          | Stored         | Gray badge       |
| Ares Alpha      | Readied        | Green badge      |
| Combat Knife    | Holstered      | Amber badge      |

**Verify**:

- [ ] Each weapon shows correct readiness badge color
- [ ] Readiness dropdown appears on hover/click
- [ ] Dropdown shows valid states: Readied, Holstered, Stored

### Test: Weapon State Transitions

**Steps**:

1. Click on a weapon's readiness badge
2. Select a different state from dropdown
3. Verify visual update

**Expected State Transitions** (SR5 Core p.163):

| From → To           | Action Cost    |
| ------------------- | -------------- |
| Readied → Holstered | Simple Action  |
| Readied → Stored    | Complex Action |
| Holstered → Readied | Simple Action  |
| Holstered → Stored  | Simple Action  |
| Stored → Readied    | Complex Action |
| Stored → Holstered  | Simple Action  |

---

## 2. Armor Equipment States

### Test: Armor State Display

**Location**: Character Sheet > Inventory Panel > Armor Tab

| Armor                | Expected State | Notes                                  |
| -------------------- | -------------- | -------------------------------------- |
| Armor Jacket (12)    | Worn           | Blue badge, contributes to armor total |
| Full Body Armor (15) | Stored         | Gray badge, does not contribute        |

**Verify**:

- [ ] Worn armor shows blue "Worn" badge
- [ ] Stored armor shows gray "Stored" badge
- [ ] Only worn armor contributes to Combat Quick Reference armor value

### Test: Armor State Transitions

**Steps**:

1. Click armor state badge
2. Toggle between Worn and Stored
3. Check Combat Quick Reference armor value updates

**Expected**:

- Wearing Armor Jacket: Armor = 12
- Wearing Full Body Armor: Armor = 15
- Wearing both: Armor = 15 (highest only, SR5 stacking rule)

---

## 3. Armor Stacking Rules (SR5 Core p.169-170)

### Test: Base Armor Stacking

**Rule**: Only the highest base armor piece applies.

**Steps**:

1. Equip both armor pieces (set both to "Worn")
2. Check Combat Quick Reference

**Expected**:

- Armor shows 15 (Full Body Armor, the highest)
- Not 27 (12 + 15)

### Test: Armor Accessories

**Rule**: Items with `armorModifier: true` (like helmets/shields) ADD to base armor.

**Note**: Test character doesn't have armor accessories. To test:

1. Add a Helmet (`armorModifier: true`, rating 2) to character
2. Equip Armor Jacket (12) + Helmet (+2)
3. Expected armor = 14

### Test: Accessory Strength Cap

**Rule**: Accessory bonus is capped at Strength attribute.

**Test Street Sam's Strength**: 4

**Scenario**: If wearing accessories totaling +6:

- Raw bonus: +6
- Effective bonus: +4 (capped at Strength)
- Excess: 2 points

### Test: Encumbrance Penalty

**Rule**: -1 AGI/REA per 2 full points accessory bonus exceeds Strength.

**Scenario**: Accessories total +8, Strength = 4

- Excess: 4 points
- Penalty: -2 AGI, -2 REA

**Visual Indicator**:

- Warning icon appears on armor display
- Amber text shows penalty value

---

## 4. Wireless Bonuses

### Test: Global Wireless Toggle

**Location**: Character sheet header area

**Verify**:

- [ ] Global wireless toggle visible (Wifi icon)
- [ ] Toggle state matches `character.wirelessBonusesEnabled`
- [ ] Test Street Sam should have wireless enabled

### Test: Per-Item Wireless Toggle

**Location**: Each weapon/cyberware row

**Steps**:

1. Locate Wifi icon on weapon row
2. Click to toggle wireless
3. Verify icon changes (Wifi → WifiOff)

**Expected**:

- Active: Cyan Wifi icon
- Disabled: Gray WifiOff icon

### Test: Wireless Bonus Effects

**What IS implemented**:

- Initiative bonuses from Wired Reflexes (visible in Combat Quick Reference)
- **Smartgun +2 dice pool bonus** in weapon attack pools
- Wireless toggle state persistence
- Visual indicators (Wifi/WifiOff icons)
- Cyan Wifi icon on weapons with active smartgun wireless bonus

**Smartgun Wireless Bonus Conditions**:
The +2 dice pool bonus applies when ALL conditions are met:

1. Global wireless is enabled on character
2. Weapon is not stored (readied or holstered)
3. Per-weapon wireless is enabled (or not set - defaults to enabled)
4. Weapon has smartgun mod installed (smartgun-internal or smartgun-external)
5. Weapon is ranged (not melee)

**Visual Indicators**:

- Weapon pool displays show cyan Wifi icon when smartgun wireless bonus is active
- Modifier breakdown shows "Smartgun +2" as a gear bonus

---

## 5. Ammunition Management

### Test: Ammo Display

**Location**: Expanded weapon row > Ammunition section

| Weapon          | Loaded Ammo           | Current/Max |
| --------------- | --------------------- | ----------- |
| Ares Predator V | Heavy Pistol Regular  | 15/15       |
| Steyr TMP       | Empty                 | 0/30        |
| HK-227          | SMG APDS              | 20/28       |
| Ares Alpha      | Assault Rifle Regular | 42/42       |

**Visual Elements**:

- [ ] Ammo bar shows fill percentage
- [ ] Color coding: Green (>50%), Yellow (25-50%), Orange (<25%), Red (empty)
- [ ] Empty weapons show red warning

### Test: Ammo Type Display

**Verify ammo modifiers are shown**:

| Ammo Type     | DV Modifier | AP Modifier |
| ------------- | ----------- | ----------- |
| Regular       | 0           | 0           |
| APDS          | 0           | -4          |
| Explosive     | +1          | +1          |
| Gel           | +0S         | +1          |
| Stick-n-Shock | -2S(e)      | -5          |

### Test: Reload Menu

**Steps**:

1. Expand a weapon with less than full ammo
2. Click "Reload" button
3. Verify dropdown shows compatible ammo only

**Expected for Ares Predator V (heavy-pistol)**:

- Heavy Pistol Regular Rounds (100 available)
- Heavy Pistol APDS (30 available)
- Heavy Pistol Explosive Rounds (20 available)

**Not shown**: SMG or Assault Rifle ammo (incompatible caliber)

---

## 6. Ammunition Inventory Tab

### Test: Ammo Tab Display

**Location**: Inventory Panel > Ammo Tab

**Verify all ammo types listed**:

- [ ] Heavy Pistol Regular (100 rounds)
- [ ] Heavy Pistol APDS (30 rounds)
- [ ] Heavy Pistol Explosive (20 rounds)
- [ ] SMG Regular (200 rounds)
- [ ] SMG APDS (50 rounds)
- [ ] Assault Rifle Regular (150 rounds)
- [ ] Assault Rifle APDS (30 rounds)
- [ ] Assault Rifle Explosive (20 rounds)

**Display Elements**:

- Caliber grouping
- Quantity display
- DV/AP modifiers
- Availability/legality indicators (R/F badges)

---

## 7. Cyberware Wireless

### Test: Cyberware Wireless Display

**Location**: Character Sheet > Augmentations Panel

**Test Street Sam's Cyberware**:

- Wired Reflexes 2 - wireless enabled
- Smartlink - wireless enabled
- Cybereyes Rating 3 - wireless enabled

**Verify**:

- [ ] Each cyberware shows wireless indicator
- [ ] Enabled items show cyan Wifi icon
- [ ] Can toggle individual item wireless

---

## 8. Combat Quick Reference Integration

### Test: Armor Value

**Location**: Combat Quick Reference > Armor display

**Expected for Test Street Sam**:

- Base armor: 12 (Armor Jacket, worn)
- No accessories currently equipped
- Total: 12

### Test: Initiative with Wireless

**Wired Reflexes 2 (wireless enabled)**:

- Base: REA (5) + INT (5) = 10
- Wired Reflexes 2: +2 to Initiative, +2d6
- Wireless bonus: +1d6 additional

**Expected**: 12 + 3d6 (with wireless) or 12 + 2d6 (without)

### Test: Wound Modifier Display

**Steps**:

1. Apply damage to character (via API or direct edit)
2. Check wound modifier appears in Combat Quick Reference
3. Verify initiative and pools show wound penalty

---

## 9. Encumbrance Bar

### Test: Encumbrance Display

**Location**: Inventory Panel header

**Elements**:

- Current weight / Max capacity
- Visual progress bar
- Color coding: Green (normal), Yellow (75%+), Red (over capacity)

**Test Street Sam**:

- Strength: 4
- Max capacity: 40 kg (STR × 10)

---

## 10. State Persistence

### Test: State Saves on Change

**Steps**:

1. Change a weapon's readiness state
2. Refresh the page
3. Verify state persisted

**Verify**:

- [ ] Weapon states persist
- [ ] Armor states persist
- [ ] Wireless toggles persist
- [ ] Ammo counts persist

---

## Known Limitations

1. **Reload actions**: Currently display-only, actual reload consumes no ammo from inventory
2. **Magazine swap**: UI present but not fully functional
3. **Weight calculation**: Not all items have weight defined
4. **Weapon accuracy bonus**: Smartgun accuracy bonus (+1) not added to weapon limit display

---

## Troubleshooting

### Dropdown being clipped

If dropdown menus appear cut off, check for `overflow-hidden` on parent containers.

### State not updating

1. Check browser console for errors
2. Verify `onUpdate` callback is wired
3. Check API endpoint is responding

### Wireless bonuses not showing

1. Verify `wirelessBonusesEnabled: true` on character
2. Check individual item `state.wirelessEnabled`
3. Verify cyberware has wireless bonus defined

---

## API Endpoints

| Endpoint                               | Method | Purpose                   |
| -------------------------------------- | ------ | ------------------------- |
| `/api/characters/[id]`                 | GET    | Fetch character data      |
| `/api/characters/[id]`                 | PATCH  | Update character          |
| `/api/characters/[id]/inventory/state` | PATCH  | Update item state         |
| `/api/admin/migrate/gear-state`        | POST   | Migrate legacy characters |

---

## Related Documentation

- [ADR-010: Inventory State Management](/docs/adr/ADR-010-inventory-state-management.md)
- [Gear State Types](/lib/types/gear-state.ts)
- [SR5 Core Rulebook p.163-170] - Equipment rules
