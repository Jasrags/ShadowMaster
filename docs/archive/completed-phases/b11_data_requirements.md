# B11 Data Requirements: Identity/Lifestyle/SIN System

**Date:** January 2025  
**Purpose:** Comprehensive analysis of data requirements for B11 Identity/Lifestyle/SIN system implementation

---

## Executive Summary

This document identifies what data already exists in the ruleset and what additional data structures are needed to implement the B11 Identity/Lifestyle/SIN system per SR5 rules.

**Status:**
- ✅ **Available:** Basic lifestyles, fake SIN/license gear, SINner quality
- ❌ **Missing:** Lifestyle modifications catalog, subscriptions catalog
- ⚠️ **Optional:** License type examples for UI guidance

---

## 1. Existing Data Analysis

### ✅ Lifestyles (Available)

**Location:** `/data/editions/sr5/core-rulebook.json` (lines 4641-4692)

**Existing Data:**
- 6 lifestyle types with monthly costs:
  - Street: 0¥/month
  - Squatter: 500¥/month
  - Low: 2,000¥/month
  - Medium: 5,000¥/month
  - High: 10,000¥/month
  - Luxury: 100,000¥/month
- Starting nuyen formulas for each lifestyle
- Metatype cost modifiers:
  - Dwarf: 1.2× multiplier
  - Troll: 2.0× multiplier

**Data Structure:**
```typescript
interface LifestyleData {
  id: string;
  name: string;
  monthlyCost: number;
  startingNuyen: string;
  description?: string;
}
```

**Status:** ✅ **Complete** - No additional lifestyle types needed for B11

---

### ✅ Fake SIN/License Gear (Available)

**Location:** `/data/editions/sr5/core-rulebook.json` (lines 6054-6072)

**Existing Data:**
- Fake SIN gear item:
  - ID: `fake-sin`
  - Cost: Rating*2,500¥
  - Availability: Rating*3F
  - Forbidden: true
  - Rating: 4 (max rating)
  - Description: "Forged identity (Rating 1-4)"

- Fake License gear item:
  - ID: `fake-license`
  - Cost: Rating*200¥
  - Availability: Rating*3F
  - Forbidden: true
  - Rating: 4 (max rating)
  - Description: "Forged permit or license (Rating 1-4)"

**Note:** Costs likely scale with rating (Rating 1 = lowest cost, Rating 4 = listed cost). Need to verify pricing formula.

**Status:** ✅ **Available** - Can be purchased in GearStep and linked to identities

---

### ✅ SINner Quality (Available)

**Location:** `/data/editions/sr5/core-rulebook.json` (lines 4566-4592)

**Existing Data:**
- Quality ID: `sinner`
- Name: "SINner"
- Layered quality with 4 levels:

| Level | Name | Karma Bonus |
|-------|------|-------------|
| 1 | National | 5 |
| 2 | Criminal | 10 |
| 3 | Corporate Limited | 15 |
| 4 | Corporate Born | 25 |

**Data Structure:**
```json
{
  "id": "sinner",
  "name": "SINner",
  "karmaBonus": 5,
  "levels": [
    {"level": 1, "name": "National", "karma": 5},
    {"level": 2, "name": "Criminal", "karma": 10},
    {"level": 3, "name": "Corporate Limited", "karma": 15},
    {"level": 4, "name": "Corporate Born", "karma": 25}
  ]
}
```

**Status:** ✅ **Complete** - All 4 SINner types available

---

## 2. Missing Data Requirements

### ❌ Lifestyle Modifications Catalog

**Status:** ❌ **Missing**

**Required Data Structure:**
```typescript
interface LifestyleModificationData {
  id: string;
  name: string;
  type: "positive" | "negative";
  modifierType: "percentage" | "fixed";
  modifier: number; // Percentage (e.g., 20 for +20%) or fixed cost (e.g., 1000 for +1,000¥)
  description: string;
  effects?: string; // Optional game effects (e.g., "+2 limit to relevant skill tests")
}
```

**Required Modifications (From SR5 Rules):**

| Name | Type | Modifier | Description | Effects |
|------|------|----------|-------------|---------|
| Special Work Area | Positive | +1,000¥ | Dedicated workspace for skills | +2 limit to relevant skill tests |
| Extra Secure | Positive | +20% | Enhanced security | Improves security response tier |
| Obscure/Difficult to Find | Positive | +10% | Hard to locate | -2 dice on intruders' Sneaking tests |
| Cramped | Negative | -10% | Limited space | -2 to Logic-linked test limits |
| Dangerous Area | Negative | -20% | High crime neighborhood | Degrades security response tier |

**Implementation Location:**
- Add to `/data/editions/sr5/core-rulebook.json` in `lifestyle` module
- Extract via `/lib/rules/loader.ts`
- Expose via `/lib/rules/RulesetContext.tsx` hook: `useLifestyleModifications()`

**Priority:** 🔴 **High** - Required for B11.3

---

### ❌ Subscriptions Catalog

**Status:** ❌ **Missing**

**Required Data Structure:**
```typescript
interface SubscriptionData {
  id: string;
  name: string;
  monthlyCost: number;
  description: string;
  category?: string; // e.g., "medical", "security", "food", "entertainment"
}
```

**Required Subscriptions (From SR5 Rules):**

| Name | Monthly Cost | Description | Category |
|------|-------------|-------------|----------|
| DocWagon Contract (Basic) | 5,000¥/year | Medical response service (Zone 1-2) | Medical |
| DocWagon Contract (Gold) | 25,000¥/year | Medical response service (Zone 1-6) | Medical |
| DocWagon Contract (Platinum) | 50,000¥/year | Medical response service (Zone 1-8) | Medical |
| DocWagon Contract (Super-Platinum) | 100,000¥/year | Medical response service (Zone 1-8) | Medical |
| Food Service (Basic) | Rating*200¥/month | Basic meal delivery service | Food |

**Note:** This is a starting list. SR5 sourcebooks may have additional subscription services.

**Implementation Location:**
- Add to `/data/editions/sr5/core-rulebook.json` in `lifestyle` module
- Extract via `/lib/rules/loader.ts`
- Expose via `/lib/rules/RulesetContext.tsx` hook: `useSubscriptions()`

**Priority:** 🔴 **High** - Required for B11.3

---

### ⚠️ License Type Examples (Optional)

**Status:** ⚠️ **Optional but Recommended**

**Purpose:** Provide example license types for UI guidance/autocomplete when players create licenses

**Suggested Examples:**
- Firearms License
- Magic User License
- Driver's License
- Vehicle Registration
- Restricted Augmentation License
- Security License
- Corporate License
- Bounty Hunter License
- Private Investigator License
- Bodyguard License
- Academic License (university access)
- Media License (journalist credentials)

**Implementation:**
- Can be hardcoded in UI component or added as example data
- Not required for validation (licenses are custom-name)
- Improves UX by suggesting common license types

**Priority:** 🟡 **Medium** - Nice to have for better UX

---

## 3. Data Structure Additions Needed

### Ruleset JSON Structure

**File:** `/data/editions/sr5/core-rulebook.json`

**Section:** `lifestyle` module (around line 4641)

**Current Structure:**
```json
{
  "lifestyle": {
    "mergeStrategy": "replace",
    "payload": {
      "lifestyles": [...],
      "metatypeModifiers": {...}
    }
  }
}
```

**Proposed Extended Structure:**
```json
{
  "lifestyle": {
    "mergeStrategy": "replace",
    "payload": {
      "lifestyles": [...],
      "metatypeModifiers": {...},
      "modifications": [
        {
          "id": "special-work-area",
          "name": "Special Work Area",
          "type": "positive",
          "modifierType": "fixed",
          "modifier": 1000,
          "description": "Dedicated workspace for skill use",
          "effects": "+2 limit to relevant skill tests"
        },
        ...
      ],
      "subscriptions": [
        {
          "id": "docwagon-basic",
          "name": "DocWagon Basic",
          "monthlyCost": 500,
          "description": "Medical response service covering Zone 1-2",
          "category": "medical"
        },
        ...
      ]
    }
  }
}
```

---

### TypeScript Type Updates

**File:** `/lib/types/edition.ts`

**Add:**
```typescript
export interface LifestyleModificationData {
  id: string;
  name: string;
  type: "positive" | "negative";
  modifierType: "percentage" | "fixed";
  modifier: number;
  description: string;
  effects?: string;
}

export interface SubscriptionData {
  id: string;
  name: string;
  monthlyCost: number;
  description: string;
  category?: string;
}
```

**File:** `/lib/rules/loader.ts`

**Add extraction functions:**
```typescript
export function extractLifestyleModifications(ruleset: LoadedRuleset): LifestyleModificationData[] {
  const ruleModule = extractModule<{ modifications: LifestyleModificationData[] }>(ruleset, "lifestyle");
  return ruleModule?.modifications || [];
}

export function extractSubscriptions(ruleset: LoadedRuleset): SubscriptionData[] {
  const ruleModule = extractModule<{ subscriptions: SubscriptionData[] }>(ruleset, "lifestyle");
  return ruleModule?.subscriptions || [];
}
```

**File:** `/lib/rules/RulesetContext.tsx`

**Add to RulesetData interface:**
```typescript
export interface RulesetData {
  // ... existing fields
  lifestyleModifications: LifestyleModificationData[];
  subscriptions: SubscriptionData[];
}
```

**Add hooks:**
```typescript
export function useLifestyleModifications(): LifestyleModificationData[] {
  const { data } = useRuleset();
  return data.lifestyleModifications;
}

export function useSubscriptions(): SubscriptionData[] {
  const { data } = useRuleset();
  return data.subscriptions;
}
```

**File:** `/app/api/rulesets/[editionCode]/route.ts`

**Add to API response:**
```typescript
lifestyleModifications: extractLifestyleModifications(loadedRuleset),
subscriptions: extractSubscriptions(loadedRuleset),
```

---

## 4. Fake SIN/License Cost Formula

**Issue:** Current gear catalog shows cost for Rating 4 fake SIN/license. Need to determine pricing formula for Ratings 1-4.

**Current Data:**
- Fake SIN (Rating 4): 2,500¥
- Fake License (Rating 4): 200¥

**SR5 Rules:**
- Fake SIN cost typically scales with rating
- Common formula: Base cost × (Rating/4) or similar scaling

**Recommendation:**
1. Research SR5 core rulebook for exact pricing formula
2. Implement cost calculation function that takes rating (1-4) and returns cost
3. Update gear catalog to support rating-based costs or add separate entries per rating

**Priority:** 🟡 **Medium** - Required for proper fake SIN/license purchases

---

## 5. Implementation Checklist

### Data Addition Tasks

- [ ] **B11.DATA.1:** Add lifestyle modifications catalog to `/data/editions/sr5/core-rulebook.json`
  - Add at least 5 core modifications (Special Work Area, Extra Secure, Obscure, Cramped, Dangerous Area)
  - Add additional modifications from sourcebooks if available

- [ ] **B11.DATA.2:** Add subscriptions catalog to `/data/editions/sr5/core-rulebook.json`
  - Add DocWagon services (Basic, Gold, Platinum)
  - Add CrashCart services (Basic, Gold)
  - Add food services
  - Add Matrix services
  - Add security services

- [ ] **B11.DATA.3:** Verify/implement fake SIN/license cost formula
  - Research SR5 pricing rules
  - Implement rating-based cost calculation
  - Update gear items or add rating variants

- [ ] **B11.DATA.4:** Add TypeScript types for modifications and subscriptions
  - Update `/lib/types/edition.ts`
  - Add to loader functions
  - Add to RulesetContext
  - Add to API route

- [ ] **B11.DATA.5:** (Optional) Add license type examples for UI
  - Create list of common license types
  - Add as helper data or hardcode in UI component

---

## 6. Summary

### ✅ Available Data
- Basic lifestyles (6 types) ✅
- Metatype lifestyle modifiers ✅
- Fake SIN/license gear items ✅
- SINner quality (all 4 levels) ✅

### ❌ Missing Critical Data
- Lifestyle modifications catalog ❌
- Subscriptions catalog ❌

### ⚠️ Needs Verification/Enhancement
- Fake SIN/license cost formula for ratings 1-4 ⚠️
- License type examples (optional) ⚠️

### Implementation Priority

1. **🔴 High Priority:**
   - Add lifestyle modifications catalog (required for B11.3.4)
   - Add subscriptions catalog (required for B11.3.5)
   - Add TypeScript types and extraction functions

2. **🟡 Medium Priority:**
   - Verify/implement fake SIN/license cost formula
   - Add license type examples for better UX

3. **🟢 Low Priority:**
   - Additional modifications/subscriptions from sourcebooks
   - Advanced lifestyle features (deferred: guest sharing, team lifestyle)

---

**Document Status:** ✅ Complete  
**Last Updated:** January 2025  
**Next Steps:** Add missing data to ruleset JSON, implement extraction functions, and update types