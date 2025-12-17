# Character Sheet Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** User Interface, Character Management, Gameplay  
**Affected Areas:** Character display, gameplay integration, dice rolling, action resolution

---

## Overview

The Character Sheet is the primary interface for viewing and interacting with Shadowrun characters in Shadow Master. It provides a comprehensive, organized display of all character information including attributes, skills, gear, condition monitors, and derived statistics. The sheet integrates with gameplay systems like dice rolling and action resolution, and supports both viewing and limited editing capabilities.

**Key Features:**
- Comprehensive character information display
- Organized sections (Attributes, Skills, Gear, Qualities, etc.)
- Condition monitor visualization
- Derived stats calculation and display
- Dice roller integration
- Responsive layout (mobile, tablet, desktop)
- Dark mode support
- Quick stats bar (Karma, Nuyen, Essence, Edge)
- Character status indicators
- Navigation and editing controls

**Current Status:** Fully implemented for viewing. Editing capabilities limited to draft characters. This specification documents current implementation and defines future enhancements.

---

## User Stories

### Primary Use Cases (Players)

1. **As a player**, I want to view all my character's information in one organized place so I can quickly reference stats during gameplay.

2. **As a player**, I want to see my character's attributes, skills, and derived stats clearly so I can make informed decisions.

3. **As a player**, I want to see my condition monitors (physical and stun damage) so I know my character's current health status.

4. **As a player**, I want to access a dice roller from my character sheet so I can roll tests quickly during gameplay.

5. **As a player**, I want to see my character's gear, weapons, and equipment so I know what resources I have available.

6. **As a player**, I want to see my character's qualities, contacts, and lifestyles so I understand my character's background and connections.

7. **As a player**, I want the character sheet to be responsive so I can view it on mobile devices during games.

8. **As a player**, I want to see calculated derived stats (limits, initiative) so I don't have to calculate them manually.

### Gameplay Use Cases

9. **As a player**, I want to see wound modifiers displayed on condition monitors so I know my current penalties.

10. **As a player**, I want to see my dice pools calculated from attributes and skills so I can quickly determine test pools.

11. **As a player**, I want to see my character's current karma and nuyen so I can track resources.

12. **As a player**, I want to see my character's essence and magic/resonance ratings so I understand my magical capabilities.

13. **As a player**, I want to see my character's initiative score so I know when I act in combat.

14. **As a player**, I want to see my character's limits (Physical, Mental, Social) so I know my action constraints.

### Integration Use Cases

15. **As a dice roller**, I want to receive character data so I can calculate dice pools automatically.

16. **As a combat system**, I want to read character stats so I can resolve combat actions.

17. **As a character editor**, I want to link to the character sheet so users can view their characters after editing.

18. **As a GM**, I want to view character sheets so I can understand player capabilities during games.

---

## Page Structure

### Route

**Character Sheet Page:**
- **Path:** `/app/characters/[id]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Authorization:** Character must belong to authenticated user
- **Description:** Comprehensive character sheet view with all character information

---

## Layout & Design

### Overall Structure

**Header Section:**
- Navigation back to character list
- Character name and status badge
- Metatype and magical path indicators
- Edition code indicator
- Action buttons (Dice Roller toggle, Edit button for drafts)

**Character Header Card:**
- Character name (large, prominent)
- Status badge (active, draft, retired, deceased)
- Metatype and magical path
- Quick stats bar (Karma, Nuyen, Essence, Edge)
- Collapsible dice roller section

**Main Content Grid:**
- Three-column layout on large screens
- Single column on mobile
- Responsive breakpoints

**Footer:**
- Character ID
- Creation and update timestamps

### Color Scheme

**Status Colors:**
- **Active:** Emerald green (`emerald-400`, `emerald-500`)
- **Draft:** Amber (`amber-400`, `amber-500`)
- **Retired/Deceased:** Zinc/gray (`zinc-400`, `zinc-500`)

**Attribute Colors:**
- **Body (BOD):** Red (`red-400`)
- **Agility (AGI):** Amber (`amber-400`)
- **Reaction (REA):** Orange (`orange-400`)
- **Strength (STR):** Rose (`rose-400`)
- **Willpower (WIL):** Purple (`purple-400`)
- **Logic (LOG):** Blue (`blue-400`)
- **Intuition (INT):** Cyan (`cyan-400`)
- **Charisma (CHA):** Pink (`pink-400`)

**Special Attributes:**
- **Magic (MAG):** Violet (`violet-400`)
- **Resonance (RES):** Cyan (`cyan-400`)
- **Edge:** Rose (`rose-400`)
- **Essence:** Cyan (`cyan-400`)

**Condition Monitors:**
- **Physical:** Red (`red-400`, `red-500`)
- **Stun:** Amber (`amber-400`, `amber-500`)

**Derived Stats:**
- **Physical Limit:** Red (`red-400`)
- **Mental Limit:** Blue (`blue-400`)
- **Social Limit:** Pink (`pink-400`)
- **Initiative:** Emerald (`emerald-400`)

**Resources:**
- **Karma:** Amber (`amber-400`)
- **Nuyen:** Emerald (`emerald-400`)

### Visual Design Elements

**Section Styling:**
- Border with corner accents (emerald)
- Dark background with subtle transparency
- Section headers with emerald accent
- Consistent padding and spacing

**Typography:**
- Monospace font for numbers and codes (`font-mono`)
- Bold weights for emphasis (`font-bold`)
- Uppercase labels with tracking (`uppercase tracking-wider`)
- Size hierarchy for readability

**Icons:**
- Arrow left (navigation)
- Edit (draft editing)
- Dice (dice roller toggle)

---

## Sections

### 1. Character Header

**Location:** Top of page

**Components:**
- Character name (large heading)
- Status badge
- Metatype indicator
- Magical path indicator (if applicable)
- Edition code
- Action buttons (Dice Roller, Edit)

**Quick Stats Bar:**
- Karma (current)
- Nuyen (formatted with ¥ symbol)
- Essence (2 decimal places)
- Edge (current)

**Dice Roller Section:**
- Collapsible/expandable
- Integrated DiceRoller component
- Pool size calculated from character attributes/skills
- Example: `Agility + Pistols`

**Visual Design:**
- Gradient background
- Pattern overlay
- Scan line effect
- Border with rounded corners

---

### 2. Attributes Section

**Location:** Left column (desktop), first section (mobile)

**Display:**
- All core attributes (BOD, AGI, REA, STR, WIL, LOG, INT, CHA)
- Attribute abbreviation and full value
- Progress bar visualization
- Color-coded by attribute type

**Special Attributes:**
- Magic (MAG) - if character has magic
- Resonance (RES) - if character has resonance
- Displayed below core attributes with divider

**Component:** `AttributeBlock`

**Visual Design:**
- Horizontal layout with abbreviation, progress bar, value
- Color-coded text
- Gradient progress bars
- Responsive sizing

---

### 3. Derived Stats Section

**Location:** Left column, below Attributes

**Calculated Values:**
- **Physical Limit:** `ceil(((STR × 2) + BOD + REA) / 3)`
- **Mental Limit:** `ceil(((LOG × 2) + INT + WIL) / 3)`
- **Social Limit:** `ceil(((CHA × 2) + WIL + ceil(Essence)) / 3)`
- **Initiative:** `REA + INT` (base, shows "+1d6" notation)

**Display:**
- Grid layout (2×2)
- Label and value
- Color-coded by stat type
- Rounded background boxes

**Component:** `Section` wrapper with grid

---

### 4. Condition Monitors Section

**Location:** Left column, below Derived Stats

**Physical Monitor:**
- Max boxes: `ceil(BOD / 2) + 8`
- Filled boxes: `condition.physicalDamage`
- Wound modifiers displayed per row of 3
- Red color scheme

**Stun Monitor:**
- Max boxes: `ceil(WIL / 2) + 8`
- Filled boxes: `condition.stunDamage`
- Wound modifiers displayed per row of 3
- Amber color scheme

**Component:** `ConditionMonitor`

**Visual Design:**
- Hexagonal box shapes (polygon clip-path)
- Grouped in rows of 3
- Wound modifier labels (-1, -2, etc.)
- Filled/empty state with color coding
- Shadow effects for filled boxes

---

### 5. Skills Section

**Location:** Middle column (desktop), second section (mobile)

**Display:**
- All active skills with ratings
- Sorted by rating (highest first)
- Skill name (capitalized, spaces instead of hyphens)
- Linked attribute abbreviation in brackets
- Rating visualization (filled/empty dots)
- Numeric rating value

**Component:** `SkillList`

**Visual Design:**
- List layout with hover effects
- Dots for rating visualization (emerald filled, zinc empty)
- Attribute abbreviation in color-coded brackets
- Responsive spacing

---

### 6. Knowledge Skills Section

**Location:** Middle column, below Skills

**Display:**
- Knowledge skill name
- Category (academic, interests, professional, street)
- Rating value

**Conditional:** Only shown if character has knowledge skills

**Visual Design:**
- List layout
- Category shown in parentheses
- Hover effects

---

### 7. Languages Section

**Location:** Middle column, below Knowledge Skills

**Display:**
- Language name
- Rating or "(N)" for native
- Badge styling

**Conditional:** Only shown if character has languages

**Visual Design:**
- Flex wrap layout
- Badge styling
- Native languages highlighted (emerald)
- Non-native show rating

---

### 8. Qualities Section

**Location:** Right column (desktop), third section (mobile)

**Display:**
- Positive qualities (green badges)
- Negative qualities (red badges)
- Quality names (spaces instead of hyphens)
- Plus/minus indicators

**Component:** `QualityBadge`

**Visual Design:**
- Badge layout with flex wrap
- Color-coded by type (positive/negative)
- Border and background styling
- Plus/minus symbols

---

### 9. Gear Section

**Location:** Right column, below Qualities

**Display:**
- Gear item name
- Category
- Rating (if applicable)
- Quantity (if > 1)

**Component:** `GearItem`

**Visual Design:**
- List layout
- Left border accent
- Background with transparency
- Rating shown as "R{rating}"

---

### 10. Contacts Section

**Location:** Right column, below Gear

**Display:**
- Contact name
- Type (if specified)
- Connection rating
- Loyalty rating

**Component:** Custom contact card

**Visual Design:**
- Card layout
- Connection and Loyalty highlighted
- Color-coded ratings (amber for connection, emerald for loyalty)

---

### 11. Lifestyles Section

**Location:** Right column, below Contacts

**Display:**
- Lifestyle type/name
- Primary indicator (if applicable)
- Permanent indicator (if applicable)
- Monthly cost (or "Purchased" if permanent)
- Location (if specified)

**Calculations:**
- Base monthly cost
- Modifications (percentage and fixed)
- Subscriptions
- Custom expenses/income
- Total monthly cost

**Conditional:** Only shown if character has lifestyles

**Visual Design:**
- Card layout
- Primary and Permanent badges
- Cost formatting with ¥ symbol
- Location as secondary text

---

## Components

### Section Wrapper

**Component:** `Section`

**Props:**
```typescript
interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

**Features:**
- Consistent styling across all sections
- Corner accent decorations
- Section header with title
- Optional icon support
- Responsive padding

---

### AttributeBlock

**Component:** `AttributeBlock`

**Props:**
```typescript
interface AttributeBlockProps {
  id: string;
  value: number;
  max?: number;
}
```

**Features:**
- Displays attribute abbreviation and value
- Progress bar visualization
- Color-coded by attribute type
- Responsive layout

---

### ConditionMonitor

**Component:** `ConditionMonitor`

**Props:**
```typescript
interface ConditionMonitorProps {
  label: string;
  maxBoxes: number;
  filledBoxes: number;
  color: "physical" | "stun";
}
```

**Features:**
- Hexagonal box shapes
- Grouped in rows of 3
- Wound modifier labels
- Color-coded by monitor type
- Filled/empty state visualization

---

### SkillList

**Component:** `SkillList`

**Props:**
```typescript
interface SkillListProps {
  skills: Record<string, number>;
  linkedAttributes?: Record<string, string>;
}
```

**Features:**
- Sorted by rating
- Rating visualization (dots)
- Linked attribute display
- Hover effects

---

### QualityBadge

**Component:** `QualityBadge`

**Props:**
```typescript
interface QualityBadgeProps {
  name: string;
  type: "positive" | "negative";
}
```

**Features:**
- Color-coded by type
- Plus/minus indicators
- Badge styling

---

### GearItem

**Component:** `GearItem`

**Props:**
```typescript
interface GearItemProps {
  item: {
    name: string;
    category: string;
    quantity: number;
    rating?: number;
  };
}
```

**Features:**
- Item name and category
- Rating display
- Quantity display
- Left border accent

---

## Data Calculations

### Derived Stats

**Physical Limit:**
```typescript
const physicalLimit = Math.ceil(
  (((character.attributes?.strength || 1) * 2) +
    (character.attributes?.body || 1) +
    (character.attributes?.reaction || 1)) / 3
);
```

**Mental Limit:**
```typescript
const mentalLimit = Math.ceil(
  (((character.attributes?.logic || 1) * 2) +
    (character.attributes?.intuition || 1) +
    (character.attributes?.willpower || 1)) / 3
);
```

**Social Limit:**
```typescript
const socialLimit = Math.ceil(
  (((character.attributes?.charisma || 1) * 2) +
    (character.attributes?.willpower || 1) +
    Math.ceil(character.specialAttributes?.essence || 6)) / 3
);
```

**Initiative:**
```typescript
const initiative = (character.attributes?.reaction || 1) + 
                   (character.attributes?.intuition || 1);
```

### Condition Monitors

**Physical Monitor Max:**
```typescript
const physicalMonitorMax = Math.ceil((character.attributes?.body || 1) / 2) + 8;
```

**Stun Monitor Max:**
```typescript
const stunMonitorMax = Math.ceil((character.attributes?.willpower || 1) / 2) + 8;
```

### Lifestyle Costs

**Total Monthly Cost:**
```typescript
let totalMonthlyCost = lifestyle.monthlyCost || 0;

// Apply modifications (excluding permanent lifestyle)
lifestyle.modifications?.forEach((mod) => {
  if (mod.catalogId === "permanent-lifestyle") return;
  
  if (mod.modifierType === "percentage") {
    totalMonthlyCost = totalMonthlyCost * 
      (1 + (mod.type === "positive" ? 1 : -1) * (mod.modifier / 100));
  } else if (mod.modifierType === "fixed") {
    totalMonthlyCost = totalMonthlyCost + 
      (mod.type === "positive" ? 1 : -1) * mod.modifier;
  }
});

// Add subscriptions
const subscriptionCost = (lifestyle.subscriptions || []).reduce(
  (sum, sub) => sum + (sub.monthlyCost || 0),
  0
);
totalMonthlyCost = totalMonthlyCost + subscriptionCost;

// Add custom expenses/income
if (lifestyle.customExpenses) {
  totalMonthlyCost = totalMonthlyCost + lifestyle.customExpenses;
}
if (lifestyle.customIncome) {
  totalMonthlyCost = totalMonthlyCost - lifestyle.customIncome;
}
```

---

## Interactive Features

### Dice Roller Integration

**Toggle Button:**
- Located in character header
- Shows/hides dice roller section
- Visual feedback (active state)

**Dice Roller:**
- Integrated DiceRoller component
- Pool size calculated from character data
- Example: `Agility + Pistols` for weapon attacks
- Compact mode: false
- History enabled: true
- Max history: 3

**Pool Calculation:**
```typescript
const poolSize = Math.max(
  (character.attributes?.agility || 3) + 
  (character.skills?.pistols || 0),
  6
);
```

### Edit Button

**Visibility:**
- Only shown for draft characters
- Links to character edit page
- Icon button with hover effects

**Navigation:**
- Route: `/characters/[id]/edit`
- Resumes character creation wizard

### Navigation

**Back to Characters:**
- Link to character list
- Arrow icon
- Hover effects

---

## Responsive Design

### Breakpoints

**Mobile (< 640px):**
- Single column layout
- Stacked sections
- Full-width components
- Reduced padding

**Tablet (640px - 1024px):**
- Two-column layout possible
- Adjusted spacing
- Maintained readability

**Desktop (> 1024px):**
- Three-column grid
- Optimal spacing
- Full feature set

### Layout Grid

**Desktop:**
```
┌─────────────────────────────────────────┐
│           Character Header               │
├──────────┬──────────┬──────────────────┤
│          │          │                  │
│  Left    │  Middle  │  Right           │
│  Column  │  Column  │  Column          │
│          │          │                  │
│  • Attr  │  • Skills│  • Qualities     │
│  • Stats │  • Know  │  • Gear          │
│  • Cond  │  • Lang  │  • Contacts      │
│          │          │  • Lifestyles    │
└──────────┴──────────┴──────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│ Character Header    │
├─────────────────────┤
│ Attributes          │
├─────────────────────┤
│ Derived Stats       │
├─────────────────────┤
│ Condition           │
├─────────────────────┤
│ Skills              │
├─────────────────────┤
│ Knowledge           │
├─────────────────────┤
│ Languages           │
├─────────────────────┤
│ Qualities           │
├─────────────────────┤
│ Gear                │
├─────────────────────┤
│ Contacts            │
├─────────────────────┤
│ Lifestyles          │
└─────────────────────┘
```

---

## State Management

### Component State

**Character Data:**
- `character: Character | null` - Character data
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**UI State:**
- `showDiceRoller: boolean` - Dice roller visibility

### Data Fetching

**API Call:**
```typescript
const response = await fetch(`/api/characters/${characterId}`);
const data = await response.json();
```

**Error Handling:**
- Loading state with spinner
- Error state with message
- Fallback UI for missing character

---

## Integration Points

### Dice Roller

**Integration:**
- DiceRoller component imported
- Pool size calculated from character
- Integrated in collapsible section
- Callback support for roll logging

**Future Enhancements:**
- Context-aware pool calculations
- Quick action buttons (Attack, Skill Test, etc.)
- Roll history per character

### Character Data

**Data Source:**
- Character type from `/lib/types/character.ts`
- Complete character object
- All sections populated from character data

**Data Validation:**
- Null checks for optional fields
- Default values for missing data
- Type safety with TypeScript

### Navigation

**Routes:**
- Character list: `/characters`
- Character edit: `/characters/[id]/edit`
- Character sheet: `/characters/[id]`

**Breadcrumbs:**
- Back to characters link
- Character name in header

---

## Future Enhancements

### Phase 1: Enhanced Display

**Expanded Sections:**
- Weapons section with stats
- Armor section with ratings
- Cyberware/Bioware sections
- Vehicles section
- Drones section
- Spells section (for mages)
- Adept Powers section (for adepts)
- Complex Forms section (for technomancers)

**Improved Visualizations:**
- Weapon cards with damage, AP, modes
- Armor cards with ratings and modifications
- Cyberware tree visualization
- Spell list with categories

### Phase 2: Interactive Features

**Editable Fields:**
- Condition monitor editing (damage/healing)
- Karma spending interface
- Nuyen tracking
- Notes section

**Quick Actions:**
- Quick dice pool buttons
- Action buttons (Attack, Skill Test, etc.)
- Context menus for items

**Calculations:**
- Automatic dice pool calculation
- Modifier display
- Limit enforcement visualization

### Phase 3: Advanced Features

**Tabs/Accordions:**
- Tabbed interface for organization
- Collapsible sections
- Customizable layout

**Filters and Search:**
- Filter skills by category
- Search gear/weapons
- Filter qualities by type

**Export/Print:**
- PDF export
- Print-friendly layout
- Character summary export

### Phase 4: Gameplay Integration

**Combat Integration:**
- Initiative display
- Action economy tracker
- Combat modifiers display

**Magic Integration:**
- Spell casting interface
- Drain tracking
- Sustaining penalties display

**Matrix Integration:**
- Matrix attributes display
- Program list
- Overwatch Score display

### Phase 5: Customization

**Layout Customization:**
- Reorderable sections
- Collapsible sections
- Custom section visibility

**Theme Customization:**
- Color scheme options
- Font size options
- Layout density options

**Notes and Annotations:**
- Character notes section
- GM notes (if GM)
- Private notes

---

## Testing Requirements

### Unit Tests

**Component Rendering:**
- All sections render correctly
- Conditional sections show/hide appropriately
- Empty states display correctly
- Error states display correctly

**Calculations:**
- Derived stats calculated correctly
- Condition monitor max calculated correctly
- Lifestyle costs calculated correctly

**Data Display:**
- Attributes display correctly
- Skills display correctly
- Gear displays correctly
- All sections populate from character data

### Integration Tests

**Data Fetching:**
- Character data loads correctly
- Error handling works
- Loading states display

**Navigation:**
- Back button works
- Edit button navigates correctly
- Links work properly

**Dice Roller:**
- Toggle works
- Pool calculation correct
- Integration functional

### E2E Tests

**Character Sheet Display:**
- Navigate to character sheet
- Verify all sections display
- Verify calculations correct
- Test responsive layout

**Interactive Features:**
- Toggle dice roller
- Navigate back to list
- Edit button (draft only)

---

## Performance Considerations

### Data Loading

**Optimization:**
- Single API call for character data
- Efficient data structure
- Minimal re-renders

**Caching:**
- Character data caching (future)
- Derived stats caching
- Calculation memoization

### Rendering

**Optimization:**
- Component memoization where appropriate
- Efficient list rendering
- Lazy loading for large sections (future)

**Responsive:**
- Efficient breakpoint handling
- Optimized mobile layout
- Touch-friendly interactions

---

## Accessibility

### Keyboard Navigation

**Features:**
- All interactive elements keyboard accessible
- Focus states visible
- Logical tab order

### Screen Readers

**Features:**
- Semantic HTML
- ARIA labels where needed
- Descriptive text for visual elements

### Visual Accessibility

**Features:**
- High contrast colors
- Clear typography
- Sufficient spacing
- Color not sole indicator

---

## Security Considerations

### Data Access

**Authorization:**
- Character must belong to authenticated user
- Server-side validation
- No unauthorized data access

### Data Display

**Sanitization:**
- User input sanitized
- XSS prevention
- Safe rendering

---

## Dependencies

### Internal Dependencies

**Components:**
- DiceRoller component
- React Aria Components (Button, Link)

**Types:**
- Character type from `/lib/types/character.ts`
- All character-related types

**API:**
- `/api/characters/[id]` endpoint

### External Dependencies

**React:**
- React hooks (useState, useEffect, use)
- React Aria Components

**Styling:**
- Tailwind CSS
- Custom component styles

---

## Related Documentation

- **Character Creation:** `/docs/specifications/character_creation_and_management_specification.md` - Character creation and data structure
- **Dice Roller:** `/docs/specifications/dice_roller_specification.md` - Dice roller integration
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md` - Action system integration
- **Character Types:** `/lib/types/character.ts` - Complete character type definitions

---

## Change Log

### 2025-01-27
- Initial specification created
- Documents current character sheet implementation
- Defines future enhancement roadmap

---

## Open Questions

1. **Editing Capabilities:** Should active characters be editable, or only draft characters? What level of editing should be allowed?

2. **Section Organization:** Should sections be reorderable or customizable by users?

3. **Export Format:** What format should character export use? PDF, JSON, or other formats?

4. **Print Layout:** Should there be a dedicated print layout, or use the existing responsive layout?

5. **GM View:** Should GMs see additional information (GM notes, hidden stats) on character sheets?

6. **Real-time Updates:** Should character sheets update in real-time if character data changes (e.g., during combat)?

7. **Mobile Optimization:** Are there additional mobile-specific features needed (e.g., quick actions, simplified view)?

8. **Accessibility:** Are there additional accessibility features needed beyond current implementation?

---

*This specification is a living document and will be updated as the character sheet evolves.*

