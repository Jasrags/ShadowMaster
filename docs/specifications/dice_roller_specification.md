# Dice Roller Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** Gameplay, User Interface, Core Mechanics  
**Affected Areas:** Character sheets, combat resolution, skill tests, all action resolution

---

## Overview

The Dice Roller is a core gameplay component that enables players to perform Shadowrun 5th Edition dice pool tests. It provides an intuitive interface for rolling d6 dice pools, calculating hits, detecting glitches, and supporting Edge rerolls. The component follows Shadowrun 5e mechanics where results of 5 or 6 count as hits, and glitches occur when more than half the dice show 1s.

**Key Features:**
- Configurable dice pool size (1-50 dice, default 6)
- Visual dice face display with hit/glitch highlighting
- Automatic hit calculation (5-6 = hit)
- Glitch detection (more than half dice show 1s)
- Critical glitch detection (glitch with zero hits)
- Roll history tracking
- Edge reroll support (reroll non-hits)
- Compact and full display modes
- Quick pool size presets
- Visual feedback with animations and color coding

**Current Status:** Fully implemented. See [Acceptance Criteria](#acceptance-criteria) for detailed status.

---

## User Stories

### Primary Use Cases (Players)

1. **As a player**, I want to roll a dice pool for skill tests so I can resolve character actions.

2. **As a player**, I want to see which dice rolled hits (5-6) so I can quickly count successes.

3. **As a player**, I want to see when I roll a glitch or critical glitch so I know when complications occur.

4. **As a player**, I want to adjust my dice pool size easily so I can account for modifiers and situational changes.

5. **As a player**, I want to see my recent roll history so I can reference previous results.

6. **As a player**, I want to use Edge to reroll non-hits so I can improve my results when I have Edge available.

7. **As a player**, I want the dice roller to automatically calculate my pool from character attributes and skills so I don't have to manually calculate it.

8. **As a player**, I want visual feedback when rolling so the experience feels engaging.

### Gameplay Use Cases

9. **As a player**, I want to see individual die values so I can verify the roll results.

10. **As a player**, I want dice sorted with hits first so I can quickly assess success.

11. **As a player**, I want clear visual distinction between hits, misses, and ones so I can understand the roll at a glance.

12. **As a player**, I want the system to correctly identify glitches (more than half dice are 1s) so complications are properly flagged.

13. **As a player**, I want the system to correctly identify critical glitches (glitch with zero hits) so severe failures are properly flagged.

14. **As a player**, I want Edge rerolls to only reroll non-hits so I don't lose successful dice.

### Integration Use Cases

15. **As a character sheet**, I want to integrate the dice roller so players can roll directly from their character data.

16. **As a combat system**, I want to use the dice roller for attack and defense rolls so combat resolution is consistent.

17. **As a skill test system**, I want to use the dice roller for skill checks so all tests use the same mechanics.

---

## Acceptance Criteria

### MVP (Phase 1) - Core Dice Mechanics

**Functionality:**
- [x] **Pool Management:** Support dice pools from 1 to 50 dice.
- [x] **Adjust Controls:** Easy increment/decrement buttons and direct text input for pool size.
- [x] **Presets:** Quick selection buttons for common pool sizes (4, 8, 12, 16, 20).
- [x] **Rolling:** Generate random results (1-6) for each die in the pool.
- [x] **Calculating:** Automatically count "Hits" (5s and 6s) and "Ones".
- [x] **Glitch Detection:** Correctly identify a Glitch (> 50% ones).
- [x] **Critical Glitch:** Correctly identify a Critical Glitch (Glitch + 0 Hits).
- [x] **Sorting:** Display results sorted by Hits (successes first) then descending value.
- [x] **Edge Reroll:** Button to "Spend Edge" appearing only when applicable (non-hits available).
   - [x] **Logic:** Reroll only non-hits (1-4), preserve original hits (5-6).
   - [x] **Recalculation:** Correctly new hits/glitches after reroll.

**Display & UX:**
- [x] **Visual Dice:** Render custom die faces with pips (dots) rather than just numbers.
- [x] **Feedback:** Animated rolling effect (bounce/spin) before settling.
- [x] **Color Coding:** Distinct colors for Hits (Green), Ones (Red), and Glitch Warnings (Amber/Red).
- [x] **Responsiveness:** Layout adapts to available width (wrapping dice).
- [x] **Compact Mode:** Ability to render a smaller version for tight UI spaces.
- [x] **History:** Display a list of recent previous rolls with timestamps.

### Future Phases (Backlog)

**Phase 2 - Advanced Integration:**
- [x] **Context Awareness:** Automatically set pool size based on Character context (e.g. clicking "Pistols" skill sets pool).
- [x] **Modifiers UI:** Interface to add simple modifiers (+/- dice) separate from base pool.
- [ ] **Test Types:** Dedicated modes for "Opposed Tests" (roll vs X hits).
- [ ] **Extended Tests:** Tracking cumulative hits over multiple rolls.

**Phase 3 - Advanced Edge Actions:**
- [ ] **Push the Limit:** "Exploding" 6s logic (Rule of Six).
- [ ] **Second Chance:** Reroll all failures (distinct from current implementation if rules differ).
- [ ] **Pre-Edging:** Add Edge attribute to pool before rolling.

**Phase 4 - Polish & customization:**
- [ ] **3D Physics:** Implement 3D canvas based dice rolling for premium feel.
- [ ] **Theming:** Allow users to choose dice colors/skins.
- [ ] **Sound:** Optional sound effects for rolling.

---

## Shadowrun 5e Dice Mechanics

### Core Rules

**Hits:**
- Results of 5 or 6 on a d6 count as hits
- Hits represent successes toward meeting a threshold or winning an opposed test
- Net hits = total hits minus threshold (for success tests) or opponent hits (for opposed tests)

**Glitches:**
- A glitch occurs when more than half the dice in the pool show 1s
- Glitches add complications to the outcome, even if the test succeeds
- Example: Pool of 6 dice with 4 ones = glitch (4 > 6/2)

**Critical Glitches:**
- A critical glitch occurs when a glitch happens AND there are zero hits
- Critical glitches represent major failures with severe consequences
- GM determines narrative consequences (not necessarily character death)

**Edge Rerolls:**
- Players can spend Edge points to reroll non-hits
- Only dice that did not roll 5 or 6 are rerolled
- Hits are preserved during Edge rerolls
- Each Edge point spent allows one reroll of all non-hits

**Reference:** SR5 Core Rulebook, p. 45-47 (Dice Pools & Hits), p. 56 (Edge), p. 48-49 (Glitches)

---

## Components

### 1. DiceRoller (Main Component)

**Location:** `/components/DiceRoller.tsx`

**Responsibilities:**
- Manage dice pool size state
- Generate random dice rolls
- Calculate hits, ones, glitches, and critical glitches
- Display current roll results
- Maintain roll history
- Provide roll callback for parent components
- Handle pool size adjustments

**Props:**
```typescript
interface DiceRollerProps {
  /** Initial dice pool size */
  initialPool?: number;        // Default: 6
  /** Minimum pool size */
  minPool?: number;            // Default: 1
  /** Maximum pool size */
  maxPool?: number;            // Default: 50
  /** Called when a roll is made */
  onRoll?: (result: RollResult) => void;
  /** Whether to show roll history */
  showHistory?: boolean;        // Default: true
  /** Maximum history items to show */
  maxHistory?: number;         // Default: 5
  /** Compact mode - smaller UI */
  compact?: boolean;            // Default: false
  /** Label for the dice pool input */
  label?: string;              // Default: "Dice Pool"
  /** Label for the current operation (e.g. "Pistols Roll") */
  contextLabel?: string;
}
```

**State:**
- `basePoolSize: number` - Current base dice pool size
- `modifier: number` - Current situational modifier (+/-)
- `isRolling: boolean` - Whether a roll is in progress
- `currentResult: RollResult | null` - Most recent roll result
- `history: RollResult[]` - Array of previous roll results

**Key Methods:**
- `rollDice()` - Generates random dice, calculates hits/glitches, updates state
- `handlePoolChange(delta: number)` - Adjusts pool size within min/max bounds

**Visual Features:**
- Pool size input with +/- buttons
- Situational Modifier input with quick presets (+1, -1, +2, -2)
- Quick preset buttons for base pool (4, 8, 12, 16, 20)
- Roll button with loading state and total pool display (Base + Mod)
- Current result display with color-coded dice
- Statistics summary (hits, ones, pool size)
- Roll history list

---

### 2. DiceFace (Visual Dice Component)

**Location:** `/components/DiceRoller.tsx` (internal component)

**Responsibilities:**
- Display individual die face with value
- Show visual dot patterns (1-6)
- Apply color coding for hits (emerald) and ones (red)
- Support multiple sizes (sm, md, lg)
- Animate during roll

**Props:**
```typescript
interface DiceFaceProps {
  value: number;              // 1-6
  isHit: boolean;            // true if value >= 5
  isOne: boolean;            // true if value === 1
  isAnimating?: boolean;     // Whether to show bounce animation
  size?: "sm" | "md" | "lg"; // Display size
}
```

**Visual Design:**
- Classic d6 dot patterns for values 1-6
- Color scheme:
  - Hits (5-6): Emerald background with emerald border and text
  - Ones (1): Red background with red border and text
  - Normal (2-4): Zinc/gray background with neutral colors
- Rounded corners with border
- Shadow effects for emphasis
- Bounce animation during roll

---

### 3. RollHistoryItem (History Display Component)

**Location:** `/components/DiceRoller.tsx` (internal component)

**Responsibilities:**
- Display previous roll results in compact format
- Show timestamp, pool size, hits, and glitch status
- Support compact and expanded views

**Props:**
```typescript
interface RollHistoryItemProps {
  result: RollResult;
  compact?: boolean;          // Use compact display
}
```

**Display Format:**
- Compact: Time, pool size, hits count, glitch indicators
- Expanded: Full dice display, detailed statistics

---

### 4. EdgeRerollButton (Edge Reroll Component)

**Location:** `/components/DiceRoller.tsx`

**Responsibilities:**
- Display Edge reroll option when available
- Reroll non-hits when Edge is spent
- Preserve hits during reroll
- Recalculate glitches after reroll
- Call parent callback with new result and Edge spent

**Props:**
```typescript
interface EdgeRerollProps {
  result: RollResult;        // Original roll result
  edgeAvailable: number;     // Current Edge points
  onReroll: (newResult: RollResult, edgeSpent: number) => void;
}
```

**Behavior:**
- Only renders if `edgeAvailable > 0` and there are non-hits to reroll
- Rerolls all dice that did not roll 5 or 6
- Preserves all original hits
- Recalculates hits, ones, glitches after reroll
- Spends 1 Edge point per reroll
- Calls `onReroll` with new result and edge spent

---

## Data Types

### DiceResult

```typescript
interface DiceResult {
  value: number;    // 1-6 (d6 result)
  isHit: boolean;   // true if value >= 5
  isOne: boolean;   // true if value === 1
}
```

### RollResult

```typescript
interface RollResult {
  dice: DiceResult[];           // Array of individual die results
  hits: number;                 // Count of hits (5-6)
  ones: number;                 // Count of ones (1)
  isGlitch: boolean;            // true if ones > poolSize / 2
  isCriticalGlitch: boolean;    // true if isGlitch && hits === 0
  poolSize: number;             // Original dice pool size
  timestamp: number;            // Unix timestamp of roll
}
```

---

## UI/UX Requirements

### Visual Design

**Color Scheme:**
- **Hits (5-6):** Emerald green (`emerald-400`, `emerald-500`, `emerald-600`)
- **Ones (1):** Red (`red-400`, `red-500`)
- **Glitches:** Amber (`amber-400`, `amber-500`)
- **Critical Glitches:** Red with pulse animation (`red-500` with `animate-pulse`)
- **Normal dice (2-4):** Zinc/gray (`zinc-300`, `zinc-400`, `zinc-600`, `zinc-700`, `zinc-800`)
- **Background:** Dark theme with zinc/gray backgrounds

**Layout:**
- Vertical stacking of components
- Centered dice display
- Responsive flex/grid layouts
- Consistent spacing using Tailwind spacing scale

**Typography:**
- Monospace font for numbers (`font-mono`)
- Bold weights for emphasis (`font-bold`)
- Uppercase labels with tracking (`uppercase tracking-wider`)
- Size hierarchy: `text-xs` (labels), `text-sm` (secondary), `text-lg` (primary), `text-xl` (large numbers), `text-2xl` (very large), `text-3xl` (hits display)

### Interactions

**Pool Size Adjustment:**
- +/- buttons for increment/decrement
- Direct number input with validation
- Quick preset buttons (4, 8, 12, 16, 20)
- Enforced min/max bounds
- Visual feedback on disabled states

**Rolling:**
- Button disabled during roll animation
- Loading spinner during roll
- 300ms delay for animation effect
- Bounce animation on dice during roll

**History:**
- Most recent roll shown as current result
- Previous rolls in history list
- Timestamp display (HH:MM format)
- Compact format for space efficiency

### Accessibility

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Focus states visible (ring indicators)
- Enter/Space activate buttons

**Screen Readers:**
- Semantic HTML elements
- ARIA labels where needed
- Descriptive text for visual elements

**Visual Feedback:**
- Clear disabled states
- Loading indicators
- Color coding with text labels (not color-only)
- High contrast for readability

---

## Integration Points

### Character Sheet Integration

**Current Usage:**
- Integrated in `/app/characters/[id]/page.tsx`
- **Context Awareness:** Attributes and Skills are interactive. Clicking an attribute or skill:
   - Sets the base pool size to the rating.
   - Sets the `contextLabel` to the attribute/skill name.
   - Automatically expands the Dice Roller section.
- Supports situational modifiers via the internal `modifier` state.

**Integration Pattern:**
```typescript
<DiceRoller
  initialPool={Math.max(
    (character.attributes?.agility || 3) + 
    (character.skills?.pistols || 0),
    6
  )}
  compact={false}
  label="Dice Pool"
  showHistory={true}
  maxHistory={3}
  onRoll={(result) => {
    // Handle roll result (e.g., log to character history)
  }}
/>
```

### Future Integration Opportunities

**Combat System:**
- Attack rolls: `Weapon Skill + Attribute [Limit]`
- Defense rolls: `Reaction + Intuition`
- Damage resistance: `Body + Armor`
- Initiative: `Reaction + Intuition + Initiative Dice`

**Skill Tests:**
- Success tests: `Skill + Attribute [Limit] (Threshold)`
- Opposed tests: `Skill + Attribute [Limit] vs. Opposed Pool`
- Extended tests: Multiple rolls with degrading pool

**Magic System:**
- Spellcasting: `Magic + Spellcasting [Force] (Threshold)`
- Drain resistance: `Willpower + (Magic or Resonance)`
- Counterspelling: `Magic + Counterspelling [Mental]`

**Matrix System:**
- Hacking: `Hacking + Logic [Data Processing]`
- Cybercombat: `Cybercombat + Logic [Attack]`
- Electronic Warfare: `Electronic Warfare + Logic [Sensor]`

---

## Algorithm Details

### Dice Rolling Algorithm

```typescript
function rollDice(poolSize: number): RollResult {
  const dice: DiceResult[] = [];
  let hits = 0;
  let ones = 0;

  // Generate random dice
  for (let i = 0; i < poolSize; i++) {
    const value = Math.floor(Math.random() * 6) + 1;
    const isHit = value >= 5;
    const isOne = value === 1;

    if (isHit) hits++;
    if (isOne) ones++;

    dice.push({ value, isHit, isOne });
  }

  // Sort dice: hits first, then by value descending
  dice.sort((a, b) => {
    if (a.isHit && !b.isHit) return -1;
    if (!a.isHit && b.isHit) return 1;
    if (a.isOne && !b.isOne) return 1;
    if (!a.isOne && b.isOne) return -1;
    return b.value - a.value;
  });

  // Check for glitch (more 1s than half the dice pool)
  const isGlitch = ones > poolSize / 2;
  const isCriticalGlitch = isGlitch && hits === 0;

  return {
    dice,
    hits,
    ones,
    isGlitch,
    isCriticalGlitch,
    poolSize,
    timestamp: Date.now(),
  };
}
```

### Edge Reroll Algorithm

```typescript
function rerollWithEdge(result: RollResult): RollResult {
  const newDice: DiceResult[] = result.dice.map(d => {
    if (d.isHit) return d; // Keep hits

    // Reroll non-hits
    const value = Math.floor(Math.random() * 6) + 1;
    return {
      value,
      isHit: value >= 5,
      isOne: value === 1,
    };
  });

  const hits = newDice.filter(d => d.isHit).length;
  const ones = newDice.filter(d => d.isOne).length;
  const isGlitch = ones > result.poolSize / 2;
  const isCriticalGlitch = isGlitch && hits === 0;

  // Sort dice (same algorithm as initial roll)
  newDice.sort(/* ... */);

  return {
    dice: newDice,
    hits,
    ones,
    isGlitch,
    isCriticalGlitch,
    poolSize: result.poolSize,
    timestamp: Date.now(),
  };
}
```

### Glitch Detection

**Glitch Rule:**
- Glitch occurs when `ones > poolSize / 2`
- Uses strict greater than (not >=)
- Example: Pool of 6 dice, 4 ones = glitch (4 > 3)
- Example: Pool of 5 dice, 3 ones = glitch (3 > 2.5, which rounds to 3 > 2)

**Critical Glitch Rule:**
- Critical glitch occurs when `isGlitch && hits === 0`
- Must be both conditions: glitch AND zero hits

---

## API Requirements

### Component Callbacks

**onRoll Callback:**
```typescript
onRoll?: (result: RollResult) => void
```
- Called after dice roll completes
- Receives complete RollResult object
- Optional (component works without it)
- Use case: Log rolls to character history, trigger game events

**onReroll Callback (EdgeRerollButton):**
```typescript
onReroll: (newResult: RollResult, edgeSpent: number) => void
```
- Called after Edge reroll completes
- Receives new RollResult and number of Edge points spent
- Required for EdgeRerollButton
- Use case: Update character Edge attribute, log reroll event

### Future API Endpoints (Planned)

**POST `/api/characters/[id]/rolls`**
- Store roll history server-side
- Associate rolls with character
- Include metadata (test type, context, modifiers)

**GET `/api/characters/[id]/rolls`**
- Retrieve roll history
- Support filtering by date, test type
- Pagination support

---

## Testing Requirements

### Unit Tests

**Dice Rolling Logic:**
- Verify hit calculation (5-6 = hit)
- Verify glitch detection (ones > poolSize / 2)
- Verify critical glitch detection (glitch + zero hits)
- Verify dice sorting (hits first, then by value)
- Test edge cases (pool size 1, maximum pool size)

**Edge Reroll Logic:**
- Verify only non-hits are rerolled
- Verify hits are preserved
- Verify glitch recalculation after reroll
- Test with various pool sizes and hit distributions

**Pool Size Validation:**
- Verify min/max bounds enforcement
- Verify input validation
- Test invalid inputs (negative, non-numeric, etc.)

### Integration Tests

**Component Rendering:**
- Verify all UI elements render correctly
- Test compact vs. full display modes
- Test history display (empty, single roll, multiple rolls)
- Test Edge reroll button visibility conditions

**User Interactions:**
- Test pool size adjustment (+/- buttons, direct input, presets)
- Test roll button (enabled/disabled states, loading state)
- Test Edge reroll button (enabled/disabled states)
- Test keyboard navigation

**Visual States:**
- Verify color coding (hits, ones, glitches)
- Verify animations (roll, bounce, pulse)
- Test responsive layouts

### E2E Tests

**Character Sheet Integration:**
- Navigate to character page
- Open dice roller
- Adjust pool size
- Perform roll
- Verify results display
- Test Edge reroll (if Edge available)
- Verify history updates

---

## Future Enhancements

### Phase 1: Enhanced Pool Calculation

**Automatic Pool Building:**
- Calculate pools from character attributes and skills
- Support modifiers (wounds, environmental, situational)
- Display pool breakdown (e.g., "Agility (4) + Pistols (3) - Wounds (2) = 5")
- Support for limits (Physical, Mental, Social, Accuracy)

**Modifier System:**
- UI for adding/subtracting modifiers
- Common modifier presets (wounds, environmental, etc.)
- Modifier history tracking

### Phase 2: Test Types

**Success Tests:**
- Threshold input
- Automatic success/failure determination
- Net hits calculation

**Opposed Tests:**
- Opponent pool input
- Automatic winner determination
- Net hits calculation

**Extended Tests:**
- Multiple interval rolls
- Pool degradation tracking
- Cumulative hits tracking
- Threshold progress display

**Teamwork Tests:**
- Multiple assistant pools
- Limit and dice bonuses calculation
- Helper glitch handling

### Phase 3: Advanced Features

**Buying Hits:**
- Option to buy hits instead of rolling
- Calculation: `floor(poolSize / 4)` automatic hits
- GM approval workflow

**Roll History Persistence:**
- Server-side storage
- Character-specific history
- Filtering and search
- Export functionality

**Roll Templates:**
- Save common roll configurations
- Quick access to frequent tests
- Character-specific templates

**Dice Pool Presets:**
- Character-specific presets (e.g., "Pistol Attack", "Sneaking")
- Campaign-specific presets
- Custom preset creation

### Phase 4: Advanced Edge Features

**Edge Actions:**
- Push the Limit (ignore limits)
- Close Call (downgrade/cancel glitches)
- Seize the Initiative (reroll initiative)
- Second Chance (reroll entire pool)
- All In (roll twice, take better result)

**Edge Tracking:**
- Automatic Edge deduction
- Edge recovery rules
- Edge attribute integration

### Phase 5: Visual Enhancements

**3D Dice Animation:**
- 3D dice models
- Physics-based rolling animation
- Sound effects (optional)

**Customizable Themes:**
- Multiple color schemes
- Custom dice styles
- User preferences

**Roll Animations:**
- Sequential dice reveal
- Staggered animations
- Celebration effects for critical successes

---

## Edge Cases & Error Handling

### Invalid Pool Sizes

**Handling:**
- Enforce min/max bounds on input
- Clamp values to valid range
- Display error message for out-of-range values
- Default to minPool if invalid input provided

### Empty Rolls

**Handling:**
- Prevent rolling with pool size 0
- Disable roll button when pool size < minPool
- Clear previous result if pool size becomes invalid

### Glitch Edge Cases

**Odd Pool Sizes:**
- Pool of 5: 3 ones = glitch (3 > 2.5)
- Pool of 7: 4 ones = glitch (4 > 3.5)
- Use strict greater than comparison

**Single Die:**
- Pool of 1: 1 one = glitch (1 > 0.5)
- Pool of 1: 1 hit = success, no glitch

### Edge Reroll Edge Cases

**All Hits:**
- If all dice are hits, Edge reroll button should not appear
- No non-hits to reroll

**No Edge Available:**
- Edge reroll button should not appear
- Component handles gracefully

**Zero Edge After Reroll:**
- Button should disappear after reroll
- State updates correctly

---

## Performance Considerations

### Rendering Performance

**Large Dice Pools:**
- Current implementation handles up to 50 dice efficiently
- Consider virtualization for pools > 50 if needed
- Dice face components are lightweight

**History Management:**
- Limited to maxHistory items (default 5)
- Oldest items removed automatically
- No performance impact for typical usage

### Random Number Generation

**Current Implementation:**
- Uses `Math.random()` (browser PRNG)
- Sufficient for gameplay purposes
- Consider cryptographically secure RNG for future if needed

**Roll Timing:**
- 300ms animation delay provides smooth UX
- Actual roll calculation is instant
- No performance concerns

---

## Security Considerations

### Client-Side Randomness

**Current Approach:**
- Dice rolling happens client-side using `Math.random()`
- Acceptable for gameplay (not security-critical)
- Players can inspect/modify if desired (acceptable for tabletop RPG)

**Future Considerations:**
- Server-side rolling for competitive/verified play
- Cryptographic randomness for high-stakes rolls
- Roll verification and audit trails

### Input Validation

**Pool Size:**
- Enforced min/max bounds
- Type validation (numbers only)
- Prevents injection attacks

**Callback Functions:**
- TypeScript type safety
- No arbitrary code execution risk

---

## Dependencies

### External Libraries

**React Aria Components:**
- `Button` component for accessible buttons
- Provides keyboard navigation and ARIA attributes

### Internal Dependencies

**None** - DiceRoller is a standalone component with no internal dependencies on other application components.

### Future Dependencies (Planned)

**Character Data:**
- Integration with character types for automatic pool calculation
- Edge attribute access for Edge reroll functionality

**Storage Layer:**
- Roll history persistence (future enhancement)

---

## Related Documentation

- **Game Concepts:** `/docs/rules/5e/game-concepts.md` - Core Shadowrun 5e mechanics
- **Combat Specification:** `/docs/rules/5e/game-mechanics/combat.md` - Combat dice pool usage
- **Skills Specification:** `/docs/rules/5e/game-mechanics/skills.md` - Skill test mechanics
- **Character Creation:** `/docs/specifications/character_creation_and_management_specification.md` - Character data structure

---

## Change Log

### 2025-01-27
- Initial specification created
- Documents current implementation
- Defines future enhancement roadmap

---

## Open Questions

1. **Server-Side Rolling:** Should rolls be verified server-side for competitive play, or is client-side sufficient for tabletop RPG use?

2. **Roll Persistence:** Should all rolls be stored server-side, or only important ones (combat, critical tests)?

3. **GM Override:** Should GMs be able to force specific results, buy hits, or modify rolls for narrative purposes?

4. **Edition Support:** Current implementation is SR5-specific. How should other editions (SR6, Anarchy) be supported?

5. **Accessibility:** Are current accessibility features sufficient, or are additional ARIA labels and screen reader support needed?

---

*This specification is a living document and will be updated as the Dice Roller component evolves.*

