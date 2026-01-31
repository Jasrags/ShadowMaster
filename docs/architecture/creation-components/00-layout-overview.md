# Layout Overview

The character creation interface uses a three-column responsive layout defined in `SheetCreationLayout.tsx`.

## Three-Column Layout

```mermaid
graph TD
    subgraph SheetCreationLayout
        subgraph "Column 1: Foundation"
            CharacterInfoCard[CharacterInfoCard]
            PrioritySelectionCard[PrioritySelectionCard]
            MetatypeCard[MetatypeCard]
            MagicPathCard[MagicPathCard]
            DerivedStatsCard[DerivedStatsCard]
            BudgetSummaryCard[BudgetSummaryCard]
            ValidationSummary[ValidationSummary]
        end

        subgraph "Column 2: Attributes & Powers"
            AttributesCard[AttributesCard]
            QualitiesCard[QualitiesCard]
            SkillsCard[SkillsCard]
            SpellsCard[SpellsCard]
            AdeptPowersCard[AdeptPowersCard]
            FociCard[FociCard]
            ComplexFormsCard[ComplexFormsCard]
        end

        subgraph "Column 3: Skills & Gear"
            KnowledgeLanguagesCard[KnowledgeLanguagesCard]
            ContactsCard[ContactsCard]
            GearPanel[GearPanel]
            WeaponsPanel[WeaponsPanel]
            ArmorPanel[ArmorPanel]
            MatrixGearCard[MatrixGearCard]
            AugmentationsCard[AugmentationsCard]
            VehiclesCard[VehiclesCard]
            IdentitiesCard[IdentitiesCard]
        end
    end

    style CharacterInfoCard fill:#3b82f6,color:#fff
    style PrioritySelectionCard fill:#3b82f6,color:#fff
    style MetatypeCard fill:#3b82f6,color:#fff
    style MagicPathCard fill:#3b82f6,color:#fff
    style DerivedStatsCard fill:#3b82f6,color:#fff
    style BudgetSummaryCard fill:#6b7280,color:#fff
    style ValidationSummary fill:#6b7280,color:#fff
    style AttributesCard fill:#3b82f6,color:#fff
    style QualitiesCard fill:#3b82f6,color:#fff
    style SkillsCard fill:#3b82f6,color:#fff
    style SpellsCard fill:#3b82f6,color:#fff
    style AdeptPowersCard fill:#3b82f6,color:#fff
    style FociCard fill:#3b82f6,color:#fff
    style ComplexFormsCard fill:#3b82f6,color:#fff
    style KnowledgeLanguagesCard fill:#3b82f6,color:#fff
    style ContactsCard fill:#3b82f6,color:#fff
    style GearPanel fill:#3b82f6,color:#fff
    style WeaponsPanel fill:#3b82f6,color:#fff
    style ArmorPanel fill:#3b82f6,color:#fff
    style MatrixGearCard fill:#3b82f6,color:#fff
    style AugmentationsCard fill:#3b82f6,color:#fff
    style VehiclesCard fill:#3b82f6,color:#fff
    style IdentitiesCard fill:#3b82f6,color:#fff
```

## Responsive Behavior

| Viewport            | Layout                                  |
| ------------------- | --------------------------------------- |
| Desktop (>1280px)   | Three columns                           |
| Tablet (768-1280px) | Two columns                             |
| Mobile (<768px)     | Single column with collapsible sections |

## Conditional Cards

Some cards are conditionally rendered based on magical path selection:

| Card             | Condition                                   |
| ---------------- | ------------------------------------------- |
| SpellsCard       | `magician`, `mystic-adept`, `aspected-mage` |
| AdeptPowersCard  | `adept`, `mystic-adept`                     |
| FociCard         | `magician`, `mystic-adept`, `aspected-mage` |
| ComplexFormsCard | `technomancer`                              |

## Dynamic Imports

Conditional cards use Next.js dynamic imports for code splitting:

```typescript
const SpellsCard = dynamic(
  () => import("@/components/creation/SpellsCard"),
  { loading: () => <CardSkeleton title="Spells" rows={4} /> }
);
```

## Component Reference

| Component           | Location                                   | Purpose                                |
| ------------------- | ------------------------------------------ | -------------------------------------- |
| SheetCreationLayout | `/app/characters/create/sheet/components/` | Main layout orchestrator               |
| BudgetSummaryCard   | Inline in SheetCreationLayout              | Budget progress bars                   |
| ValidationSummary   | Inline in SheetCreationLayout              | Finalize button and status             |
| PlaceholderCard     | Inline in SheetCreationLayout              | Placeholder for unimplemented sections |

## Props Interface

```typescript
interface SheetCreationLayoutProps {
  creationState: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  onFinalize: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError?: string | null;
  onRetry?: () => void;
  campaignId?: string;
  campaign?: Campaign | null;
}
```

## Context Dependencies

The layout and all child components rely on these contexts:

- **CreationBudgetContext** - Budget tracking and validation
- **RulesetContext** - Game rules and catalogs
- **AuthContext** - User authentication (for save operations)
