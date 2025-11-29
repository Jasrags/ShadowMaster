# SR5 Character Creation UI Implementation Plan

## Status: ✅ IN PROGRESS - Core Implementation Complete

**Target**: Build complete React/TypeScript UI for SR5 character creation

**Dependencies**: Backend API (✅ Complete)

**Reference Pattern**: `CampaignCreationWizard.tsx`

## Implementation Status

### ✅ Completed

- **Phase 1: Foundation & Types** - Complete
  - TypeScript type definitions extended in `types.ts`
  - API functions added to `api.ts`
- **Phase 2: Main Wizard Component** - Complete
  - `CharacterCreationWizard.tsx` with 9-step navigation
  - State management with localStorage persistence
  - Step validation and error handling
- **Phase 3: Step Components** - Mostly Complete
  - ✅ Step 1: Concept - Fully functional
  - ✅ Step 2: Metatype & Attributes - Fully functional
  - ✅ Step 3: Magic/Resonance - Fully functional
  - ✅ Step 4: Qualities - Fully functional with search and karma tracking
  - ✅ Step 5: Skills - Functional with skill allocation interface
  - ✅ Step 6: Resources - Functional with nuyen budget display
  - ⚠️ Step 7: Karma Spending - Basic structure (needs enhancement)
  - ✅ Step 8: Final Calculations - Functional with derived attributes
  - ✅ Step 9: Final Touches - Fully functional
- **Phase 4: Supporting Components** - Complete
  - All supporting components created
  - PrioritySelector, SumToTenSelector, MetatypeSelector, AttributeAllocator
  - MagicTypeSelector, QualitySelector, SkillAllocator, EquipmentSelector
  - CharacterSummary, KarmaBuildPanel
- **Phase 5: Integration** - Complete
  - Routes added to `App.tsx`
  - `CharacterCreationPage.tsx` created

### ⚠️ Needs Enhancement

- Step 7: Karma Spending - Full karma spending interface
- Step 6: Resources - Equipment selection tabs (weapons, armor, cyberware, etc.)
- Step 5: Skills - Skill group allocation interface
- Equipment integration with existing table components
- Full derived attribute calculations from backend

## Overview

This plan implements a comprehensive user interface for SR5 character creation, providing a multi-step wizard that guides users through all 9 creation steps. The UI will support all three creation methods (Priority, Sum-to-Ten, Karma Point-Buy) and integrate with the existing backend API.

## Architecture

The UI implementation follows existing patterns:

- **Framework**: React with TypeScript
- **UI Library**: React Aria Components (matching existing components)
- **State Management**: React hooks (useState, useEffect, useCallback)
- **API Integration**: Existing `api.ts` pattern
- **Styling**: Tailwind CSS (matching existing design system)
- **Routing**: React Router (integrate with existing App.tsx)

## Key Files to Create

### Core Components

- `web/ui/src/components/character/CharacterCreationWizard.tsx` - Main wizard component
- `web/ui/src/pages/CharacterCreationPage.tsx` - Page component
- `web/ui/src/lib/types.ts` - TypeScript type definitions (extend existing)

### Step Components

- `web/ui/src/components/character/steps/Step1Concept.tsx`
- `web/ui/src/components/character/steps/Step2MetatypeAttributes.tsx`
- `web/ui/src/components/character/steps/Step3MagicResonance.tsx`
- `web/ui/src/components/character/steps/Step4Qualities.tsx`
- `web/ui/src/components/character/steps/Step5Skills.tsx`
- `web/ui/src/components/character/steps/Step6Resources.tsx`
- `web/ui/src/components/character/steps/Step7KarmaSpending.tsx`
- `web/ui/src/components/character/steps/Step8FinalCalculations.tsx`
- `web/ui/src/components/character/steps/Step9FinalTouches.tsx`

### Supporting Components

- `web/ui/src/components/character/PrioritySelector.tsx`
- `web/ui/src/components/character/SumToTenSelector.tsx`
- `web/ui/src/components/character/KarmaBuildPanel.tsx`
- `web/ui/src/components/character/MetatypeSelector.tsx`
- `web/ui/src/components/character/AttributeAllocator.tsx`
- `web/ui/src/components/character/MagicTypeSelector.tsx`
- `web/ui/src/components/character/QualitySelector.tsx`
- `web/ui/src/components/character/SkillAllocator.tsx`
- `web/ui/src/components/character/EquipmentSelector.tsx`
- `web/ui/src/components/character/CharacterSummary.tsx`

### Modified Files

- `web/ui/src/App.tsx` - Add character creation route
- `web/ui/src/lib/api.ts` - Add character creation API functions
- `web/ui/src/lib/types.ts` - Add character creation types
- `web/ui/src/components/layout/AppLayout.tsx` - Add navigation link (optional)

## Implementation Details

### Phase 1: Foundation & Types

#### Step 1.1: TypeScript Type Definitions

Extend `web/ui/src/lib/types.ts` with:

```typescript
// Character Creation Types
export interface CharacterCreationData {
  priorities: {
    metatype: Record<string, PriorityOption>;
    attributes: Record<string, PriorityOption>;
    skills: Record<string, PriorityOption>;
    resources: Record<string, PriorityOption>;
    magic: Record<string, PriorityOption>;
  };
  metatypes: MetatypeDefinition[];
  gameplayLevels: Record<string, GameplayLevel>;
  creationMethods: Record<string, CreationMethod>;
  advancement?: AdvancementRules;
}

export interface PrioritySelection {
  metatype_priority: string; // A-E
  attributes_priority: string; // A-E
  magic_priority: string; // A-E or "none"
  skills_priority: string; // A-E
  resources_priority: string; // A-E
  selected_metatype?: string;
  magic_type?: string;
  tradition?: string;
  gameplay_level?: string;
}

export interface SumToTenSelection {
  metatype_priority: string;
  attributes_priority: string;
  magic_priority: string;
  skills_priority: string;
  resources_priority: string;
  selected_metatype?: string;
  magic_type?: string;
  tradition?: string;
  gameplay_level?: string;
}

export interface KarmaSelection {
  metatype: string;
  attributes: Record<string, number>;
  magic_type?: string;
  tradition?: string;
  skills: Record<string, number>;
  qualities?: Array<{ name: string; type: 'positive' | 'negative' }>;
  equipment?: Array<{ type: string; name: string }>;
  gameplay_level?: string;
}

export interface CharacterSR5 {
  // Attributes
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
  edge: number;
  magic?: number;
  resonance?: number;
  
  // Priority system
  metatype_priority: string;
  attributes_priority: string;
  magic_priority: string;
  skills_priority: string;
  resources_priority: string;
  creation_method: string;
  gameplay_level: string;
  
  // Metatype
  metatype: string;
  special_attribute_points: number;
  
  // Skills
  active_skills: Record<string, Skill>;
  knowledge_skills: Record<string, Skill>;
  language_skills: Record<string, Skill>;
  
  // Qualities
  positive_qualities: Quality[];
  negative_qualities: Quality[];
  
  // Equipment
  weapons: Weapon[];
  armor: Armor[];
  cyberware: Cyberware[];
  bioware: Bioware[];
  gear: any[];
  vehicles: Vehicle[];
  
  // Magic
  magic_type?: string;
  tradition?: string;
  spells: Spell[];
  complex_forms: ComplexForm[];
  focuses: any[];
  spirits: any[];
  adept_powers: any[];
  power_points?: number;
  
  // Social
  contacts: Contact[];
  lifestyle: string;
  
  // Resources
  karma: number;
  nuyen: number;
  essence: number;
  
  // Derived
  initiative: InitiativeData;
  inherent_limits: InherentLimits;
  condition_monitor: ConditionMonitor;
  living_persona?: LivingPersona;
}
```

#### Step 1.2: API Functions

Add to `web/ui/src/lib/api.ts`:

```typescript
export const characterApi = {
  // Get character creation metadata
  async getCharacterCreationData(edition: string): Promise<CharacterCreationData> {
    return apiRequest<CharacterCreationData>(`/editions/${edition}/character-creation`);
  },

  // Create character
  async createCharacter(data: {
    name: string;
    player_name: string;
    edition: string;
    creation_data: PrioritySelection | SumToTenSelection | KarmaSelection;
  }): Promise<Character> {
    return apiRequest<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get character
  async getCharacter(id: string): Promise<Character> {
    return apiRequest<Character>(`/characters/${id}`);
  },
};
```

### Phase 2: Main Wizard Component

#### Step 2.1: CharacterCreationWizard Component

Create `web/ui/src/components/character/CharacterCreationWizard.tsx`:

**Structure**:

- Modal/Dialog wrapper (similar to CampaignCreationWizard)
- Step navigation (1-9)
- Progress indicator
- Form state management
- Validation per step
- API integration

**Key Features**:

- Support for all three creation methods (Priority, Sum-to-Ten, Karma)
- Step-by-step navigation with validation
- Save/restore state (localStorage)
- Real-time validation feedback
- Error handling and display

**State Management**:

```typescript
interface CharacterCreationState {
  // Basic info
  name: string;
  playerName: string;
  concept: string;
  
  // Creation method
  creationMethod: 'priority' | 'sum_to_ten' | 'karma';
  gameplayLevel: 'experienced' | 'street' | 'prime';
  
  // Priority/Sum-to-Ten data
  priorities?: PrioritySelection;
  sumToTen?: SumToTenSelection;
  karma?: KarmaSelection;
  
  // Step-specific data
  selectedMetatype?: string;
  attributeAllocations?: Record<string, number>;
  magicType?: string;
  tradition?: string;
  selectedQualities?: Array<{ name: string; type: string }>;
  skillAllocations?: Record<string, number>;
  equipment?: any[];
  karmaSpending?: any;
  
  // Validation
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}
```

### Phase 3: Step Components

#### Step 3.1: Step 1 - Concept

**File**: `web/ui/src/components/character/steps/Step1Concept.tsx`

**Features**:

- Character name input
- Player name input
- Concept/role selection (Face, Spellcaster, Decker, etc.)
- Notes/description textarea
- Character type suggestions with descriptions

**UI Elements**:

- TextField for name
- TextField for player name
- Select/ListBox for character type
- TextArea for concept notes
- Help text with character type descriptions

#### Step 3.2: Step 2 - Metatype & Special Attributes

**File**: `web/ui/src/components/character/steps/Step2MetatypeAttributes.tsx`

**Features**:

- Creation method selector (Priority/Sum-to-Ten/Karma)
- Gameplay level selector
- Priority selector (if Priority method)
- Metatype selector with:
  - Visual cards showing special attribute points
  - Priority tier availability
  - Racial abilities preview
- Special attribute point allocation (Edge, Magic, Resonance)
- Attribute point allocation interface

**Dependencies**:

- `PrioritySelector.tsx`
- `SumToTenSelector.tsx`
- `MetatypeSelector.tsx`
- `AttributeAllocator.tsx`

#### Step 3.3: Step 3 - Magic or Resonance

**File**: `web/ui/src/components/character/steps/Step3MagicResonance.tsx`

**Features**:

- Magic type selector (Magician, Adept, Aspected Magician, Mystic Adept, Technomancer)
- Tradition selector (for Magicians)
- Free benefits display:
  - Spells (for Magicians/Mystic Adepts)
  - Complex Forms (for Technomancers)
  - Power Points (for Adepts)
  - Free skills
- Magic/Resonance rating display

**Dependencies**:

- `MagicTypeSelector.tsx`

#### Step 3.4: Step 4 - Qualities

**File**: `web/ui/src/components/character/steps/Step4Qualities.tsx`

**Features**:

- Positive qualities selector
- Negative qualities selector
- Search/filter functionality
- Karma budget tracker (25 max each)
- Quality details modal
- Category filtering

**Dependencies**:

- `QualitySelector.tsx` (reuse existing QualityViewModal pattern)

#### Step 3.5: Step 5 - Skills

**File**: `web/ui/src/components/character/steps/Step5Skills.tsx`

**Features**:

- Individual skill point allocation
- Skill group point allocation
- Specialization selector
- Free knowledge points calculator: (Intuition + Logic) × 2
- Native language selector (rating 6, free)
- Skill search/filter
- Category filtering

**Dependencies**:

- `SkillAllocator.tsx`

#### Step 3.6: Step 6 - Resources

**File**: `web/ui/src/components/character/steps/Step6Resources.tsx`

**Features**:

- Nuyen budget display
- Equipment tabs:
  - Weapons
  - Armor
  - Cyberware
  - Bioware
  - Gear
  - Vehicles
- Availability/Device Rating filtering
- Essence cost calculator
- Lifestyle selector
- Starting nuyen calculator

**Dependencies**:

- `EquipmentSelector.tsx`
- Reuse existing table components (WeaponsTable, ArmorTable, etc.)

#### Step 3.7: Step 7 - Karma Spending

**File**: `web/ui/src/components/character/steps/Step7KarmaSpending.tsx`

**Features**:

- Remaining karma display
- Additional spells purchase
- Complex forms purchase (Technomancers)
- Sprite registration (Technomancers)
- Spirit binding (Magicians)
- Foci bonding
- Contact purchase (with free karma calculation)
- Skill/attribute improvements
- Karma→Nuyen conversion

#### Step 3.8: Step 8 - Final Calculations

**File**: `web/ui/src/components/character/steps/Step8FinalCalculations.tsx`

**Features**:

- Derived attributes display:
  - Initiative (Physical, Astral, Matrix)
  - Inherent Limits (Mental, Physical, Social)
  - Condition Monitors (Physical, Stun, Overflow)
  - Living Persona (Technomancers)
- Validation summary
- Resource summary (Karma, Nuyen remaining)
- Read-only review of all selections

**Dependencies**:

- `CharacterSummary.tsx`

#### Step 3.9: Step 9 - Final Touches

**File**: `web/ui/src/components/character/steps/Step9FinalTouches.tsx`

**Features**:

- Background textarea
- Street name input
- Notes textarea
- Final review
- Submit button
- Character creation API call

### Phase 4: Supporting Components

#### Step 4.1: PrioritySelector Component

**File**: `web/ui/src/components/character/PrioritySelector.tsx`

**Features**:

- Five dropdowns (Metatype, Attributes, Magic, Skills, Resources)
- Priority levels A-E
- Visual validation (no duplicates)
- Priority benefits display
- Gameplay level selector

#### Step 4.2: SumToTenSelector Component

**File**: `web/ui/src/components/character/SumToTenSelector.tsx`

**Features**:

- Point budget tracker (must equal 10)
- Priority cost display (A=4, B=3, C=2, D=1, E=0)
- Visual feedback when total ≠ 10
- Support for multiple A priorities

#### Step 4.3: KarmaBuildPanel Component

**File**: `web/ui/src/components/character/KarmaBuildPanel.tsx`

**Features**:

- Karma budget tracker (800 starting)
- Metatype cost display
- Magic quality costs
- Attribute/skill cost calculator
- Karma→Nuyen conversion tool
- Remaining karma display

#### Step 4.4: MetatypeSelector Component

**File**: `web/ui/src/components/character/MetatypeSelector.tsx`

**Features**:

- Metatype cards with:
  - Name
  - Special attribute points
  - Attribute ranges
  - Racial abilities
  - Priority tier availability
- Filter by priority tier
- Selection state

#### Step 4.5: AttributeAllocator Component

**File**: `web/ui/src/components/character/AttributeAllocator.tsx`

**Features**:

- Attribute point allocation interface
- Min/max validation display
- Augmented vs natural display
- "Only one at max" warning
- Point counter
- Visual feedback for invalid allocations

#### Step 4.6: MagicTypeSelector Component

**File**: `web/ui/src/components/character/MagicTypeSelector.tsx`

**Features**:

- Magic type cards (Magician, Adept, etc.)
- Tradition selector (for Magicians)
- Free benefits display
- Priority-based benefits
- Selection state

#### Step 4.7: QualitySelector Component

**File**: `web/ui/src/components/character/QualitySelector.tsx`

**Features**:

- Positive/negative quality filters
- Search functionality
- Category filtering
- Karma cost display
- Selected qualities list
- Karma budget tracking
- Quality details modal (reuse existing)

#### Step 4.8: SkillAllocator Component

**File**: `web/ui/src/components/character/SkillAllocator.tsx`

**Features**:

- Individual skill point allocation
- Skill group point allocation
- Specialization selector
- Free knowledge points display
- Native language selector
- Point counters
- Category filtering

#### Step 4.9: EquipmentSelector Component

**File**: `web/ui/src/components/character/EquipmentSelector.tsx`

**Features**:

- Tabbed interface for equipment types
- Reuse existing table components
- Availability/Device Rating filtering
- Essence cost calculator
- Nuyen budget tracker
- Selected equipment list
- Equipment details modal (reuse existing)

#### Step 4.10: CharacterSummary Component

**File**: `web/ui/src/components/character/CharacterSummary.tsx`

**Features**:

- Derived attributes display
- Initiative values
- Inherent Limits
- Condition Monitors
- Living Persona (if Technomancer)
- Resource summary
- Validation status

### Phase 5: Integration

#### Step 5.1: Route Integration

**File**: `web/ui/src/App.tsx`

Add route:

```typescript
<Route
  path="/characters/create"
  element={
    <AuthenticatedRoute>
      <CharacterCreationPage />
    </AuthenticatedRoute>
  }
/>
```

Or for campaign-specific:

```typescript
<Route
  path="/campaigns/:campaignId/characters/create"
  element={
    <AuthenticatedRoute>
      <CharacterCreationPage />
    </AuthenticatedRoute>
  }
/>
```

#### Step 5.2: Navigation Integration

**File**: `web/ui/src/components/layout/AppLayout.tsx`

Add to navigation (optional, or access via campaign):

- "Create Character" link in Character Creation section

#### Step 5.3: API Integration

**File**: `web/ui/src/lib/api.ts`

Ensure all API functions are properly integrated:

- Error handling
- Loading states
- Success/error toasts

## Implementation Order

### Phase 1: Foundation ✅ COMPLETE

1. ✅ TypeScript type definitions
2. ✅ API functions
3. ✅ Basic wizard structure

### Phase 2: Core Steps ✅ COMPLETE

1. ✅ Step 1: Concept
2. ✅ Step 2: Metatype & Attributes (with PrioritySelector)
3. ✅ Step 3: Magic/Resonance

### Phase 3: Supporting Components ✅ COMPLETE

1. ✅ MetatypeSelector
2. ✅ AttributeAllocator
3. ✅ MagicTypeSelector
4. ✅ PrioritySelector
5. ✅ SumToTenSelector
6. ✅ KarmaBuildPanel
7. ✅ QualitySelector
8. ✅ SkillAllocator
9. ✅ EquipmentSelector
10. ✅ CharacterSummary

### Phase 4: Remaining Steps ✅ MOSTLY COMPLETE

1. ✅ Step 4: Qualities
2. ✅ Step 5: Skills
3. ✅ Step 6: Resources
4. ⚠️ Step 7: Karma Spending (basic structure, needs enhancement)

### Phase 5: Finalization ✅ COMPLETE

1. ✅ Step 8: Final Calculations
2. ✅ Step 9: Final Touches
3. ✅ CharacterSummary component
4. ✅ Route integration
5. ⚠️ Testing and polish (ongoing)

## Testing Considerations

- Unit tests for each step component
- Integration tests for wizard flow
- API integration tests
- Validation tests
- Edge case testing (max attributes, burnout, etc.)
- User experience testing

## UI/UX Guidelines

- Follow existing design patterns (CampaignCreationWizard)
- Use React Aria Components for accessibility
- Consistent styling with Tailwind CSS
- Clear validation feedback
- Helpful tooltips and descriptions
- Progress indicator
- Save/restore functionality
- Mobile-responsive design

## Dependencies

- Backend API (✅ Complete)
- Existing UI components (tables, modals, etc.)
- React Aria Components
- Tailwind CSS
- React Router

## Notes

- ✅ Reuse existing table components where possible
- ✅ Follow CampaignCreationWizard pattern for wizard structure
- ✅ Ensure accessibility (keyboard navigation, screen readers)
- ✅ Provide helpful error messages
- ✅ Real-time validation feedback
- ✅ Save progress to localStorage for recovery

## Recent Updates

### 2024 - Core Implementation Complete

- ✅ All 9 step components created and functional
- ✅ Full integration with backend API
- ✅ Quality selection with search and karma tracking
- ✅ Skills allocation interface with category filtering
- ✅ Resources budget calculation and display
- ✅ Derived attributes calculation in Step 8
- ✅ All import paths fixed and verified
- ✅ No linting errors

### Next Steps for Enhancement

1. Complete Step 7 (Karma Spending) with full interface
2. Integrate equipment selection tabs with existing table components
3. Add skill group allocation to Step 5
4. Enhance equipment selection with cost calculation
5. Add full backend validation integration
6. Add character preview/summary before final submission