# Identity, Lifestyle, SIN, and License Logic Specification (SR5)

## Corrected Logic Structure

### Identity (Fake SIN or Real SIN Identity)

An **Identity** represents a character's persona used to operate in society. Each identity is a complete package of identification documents.

- **MUST** have a name
- **MUST** be associated with **ONE SIN**:
  - **Fake SIN**: Rating 1-4 (purchased as gear)
  - **Real SIN**: From SINner quality (National, Criminal, Corporate Limited, or Corporate Born)
- **MAY** have **MANY licenses** (all tied to that identity's SIN):
  - **Fake licenses**: Rating 1-4, custom name/type (tied to Fake SIN)
  - **Real licenses**: Custom name/type (only if identity uses Real SIN from SINner quality)
- **MAY** be associated with a lifestyle (for that identity's safehouse/living situation)

### Lifestyle

A **Lifestyle** represents living conditions and monthly expenses. It is separate from identity but can be associated with one.

- Represents living conditions: Street, Squatter, Low, Medium, High, Luxury
- Has a monthly cost
- **MAY** be permanent (cost = 100 × monthly cost)
- **MAY** have modifications:
  - Positive or Negative
  - Percentage-based (e.g., +20%, -20%)
  - Fixed cost (e.g., +1,000¥)
- **MAY** have subscriptions (e.g., DocWagon contracts, food services)
- **MAY** have custom monthly expenses
- **MAY** have custom monthly income
- **MAY** be shared with guests (deferred - see notes below)
- Is **NOT** directly tied to a SIN (identities use lifestyles)

**Deferred Items:**
- Guest sharing mechanics (0-10 guests limit, even split vs. base + 10% per occupant) - to be implemented later

### Character

A **Character** is the top-level entity that owns identities and lifestyles.

- **MUST** have at least one identity (or be SINless, but still uses fake SINs to function)
- **MAY** have many identities (common practice for shadowrunners)
- **MUST** have a primary lifestyle
- **MAY** have additional lifestyles (for alternate identities/safehouses)
- **MAY** have a Real SIN (from SINner quality):
  - National SIN: 5 Karma (15% tax)
  - Criminal SIN: 10 Karma (constant scrutiny, social penalties)
  - Corporate Limited SIN: 15 Karma (20% corp tax)
  - Corporate Born SIN: 25 Karma (10% tax, deep distrust)

## Key Relationships

```
Character
├── Identities (1+)
│   ├── Name
│   ├── SIN (Fake Rating 1-4 OR Real from SINner)
│   └── Licenses (0+, tied to SIN)
│       ├── Fake License (Rating 1-4) if Fake SIN
│       └── Real License if Real SIN
└── Lifestyles (1+)
    ├── Type (Street, Squatter, Low, Medium, High, Luxury)
    ├── Monthly Cost
    ├── Modifications (0+)
    ├── Subscriptions (0+)
    ├── Custom Expenses (0+)
    └── Custom Income (0+)

Identity → Lifestyle (association, not ownership)
```

## SR5 Rules Compliance

### SIN Rules
- **Fake SINs**: Rating 1-4 only (not 1-6)
- **Real SINs**: No ratings - they come from SINner quality levels
- **SIN Broadcasting**: Characters with Real SINs must broadcast them at all times
- **Fake SIN Detection**: If a fake SIN is detected, all associated licenses become invalid

### License Rules
- **Fake Licenses**: Rating 1-4 only (not 1-6), must be tied to a Fake SIN
- **Real Licenses**: No ratings - valid/invalid based on SIN status, must be tied to a Real SIN
- **License Requirements**: Different activities require different licenses (firearms, magic, vehicles, etc.)
- **License Types**: Custom name/type per license (e.g., "Firearms License", "Magic User License")

### Lifestyle Rules
- **Permanent Purchase**: 100 × monthly cost (one-time payment)
- **Team Lifestyle**: Base + 10% per extra occupant (SR5 standard) - deferred implementation
- **Lifestyle Modifications**: Examples from SR5:
  - Special Work Area: +1,000¥/month, +2 limit to relevant skill tests
  - Extra Secure: +20%, improves security response tier
  - Obscure/Difficult to Find: +10%, -2 dice on intruders' Sneaking tests
  - Cramped: -10%, -2 to Logic-linked test limits
  - Dangerous Area: -20%, degrades security response tier

### Identity-Lifestyle Relationship
- A character can have multiple identities, each potentially using a different lifestyle
- Example: "John Smith" identity uses Medium lifestyle, "Bob Johnson" identity uses Low lifestyle
- Lifestyles are not owned by identities - they're associated/used by them

## Implementation Notes

### Data Model Considerations

1. **Identity Structure**:
   ```typescript
   interface Identity {
     id: string;
     name: string;
     sin: {
       type: 'fake' | 'real';
       rating?: number; // 1-4 for fake, undefined for real
       sinnerQuality?: 'national' | 'criminal' | 'corporate-limited' | 'corporate-born';
     };
     licenses: License[];
     associatedLifestyleId?: string; // Reference to lifestyle
   }
   ```

2. **Lifestyle Structure**:
   ```typescript
   interface Lifestyle {
     id: string;
     type: 'street' | 'squatter' | 'low' | 'medium' | 'high' | 'luxury';
     monthlyCost: number;
     isPermanent: boolean;
     modifications: LifestyleModification[];
     subscriptions: Subscription[];
     customExpenses: CustomExpense[];
     customIncome: CustomIncome[];
     // Guest sharing deferred
   }
   ```

3. **Character Structure**:
   ```typescript
   interface Character {
     identities: Identity[];
     primaryLifestyleId: string;
     lifestyles: Lifestyle[];
     sinnerQuality?: SinnerQuality; // If character has Real SIN
   }
   ```

### Validation Rules

1. **Identity Validation**:
   - Every identity must have a name
   - Every identity must have exactly one SIN
   - Fake SINs must have rating 1-4
   - Real SINs must reference SINner quality on character
   - Licenses must match SIN type (fake licenses for fake SIN, real licenses for real SIN)

2. **Lifestyle Validation**:
   - Every character must have at least one lifestyle (primary)
   - Lifestyle modifications must be valid (positive/negative, percentage or fixed)
   - Permanent lifestyle cost = 100 × monthly cost

3. **Character Validation**:
   - Character must have at least one identity
   - If character has Real SIN identity, must have SINner quality
   - Primary lifestyle must exist in character's lifestyles array

## Summary of Changes from Original Proposal

1. ✅ **SIN ratings corrected**: Fake SINs/Licenses are 1-4 (not 1-6)
2. ✅ **Real SINs**: No ratings - come from SINner quality levels
3. ✅ **Real licenses**: No ratings - valid/invalid based on SIN status
4. ✅ **Conceptual separation**: Identity (SIN + licenses) vs. Lifestyle (living conditions)
5. ⏸️ **Team lifestyle mechanics**: Deferred to later implementation
6. ✅ **SIN ownership**: SINs belong to identities, not lifestyles
7. ✅ **License ownership**: Licenses belong to identities, tied to SINs
