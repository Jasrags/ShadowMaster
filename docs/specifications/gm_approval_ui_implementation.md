> [!NOTE]
> This implementation guide is governed by the [Capability (TBD)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/TBD).

# GM Approval UI Implementation Guide

**Status:** Implemented
**Last Updated:** 2025-12-22
**Category:** UI Implementation, Campaign Management
**Dependencies:** Character Advancement System

---

## Overview

This document outlines the implementation plan for the GM approval UI workflow. The backend API endpoints for approving and rejecting character advancements are complete. This guide covers building the frontend interface that allows GMs to view, review, and approve/reject pending character advancements in their campaigns.

## Current State

### ✅ Completed (Backend)

- `POST /api/characters/[characterId]/advancement/[recordId]/approve` - Approve advancement
- `POST /api/characters/[characterId]/advancement/[recordId]/reject` - Reject advancement
- Enforcement in all advancement endpoints (prevents self-approval)
- GM authorization checks
- Full test coverage (16 tests)

### ✅ Completed (Frontend)

- `GET /api/campaigns/[id]/advancements/pending` - Fetch pending advancements for campaign
- `CampaignAdvancementsTab.tsx` - Main UI component with advancement cards
- `CampaignTabs.tsx` - Added "Approvals" tab (GM-only) with pending count badge
- Integration with campaign detail page (`page.tsx`)

---

## Requirements

### Functional Requirements

1. **View Pending Advancements**
   - GM should see all unapproved advancements for characters in their campaign
   - Display should include: character name, advancement type, details, cost, player notes
   - Filter by character, advancement type, or date
   - Show count of pending advancements

2. **Approve Advancements**
   - One-click approve button
   - Confirmation optional (or auto-confirm)
   - Success notification
   - List refresh after approval

3. **Reject Advancements**
   - Reject button opens dialog
   - Require reason for rejection
   - Success notification
   - List refresh after rejection

4. **Display Advancement Details**
   - Character name (link to character sheet)
   - Advancement type (Attribute, Skill, Edge, Specialization)
   - Current value → New value
   - Karma cost
   - Training time (if applicable)
   - Player notes/justification
   - Created date
   - Status (pending approval)

### Non-Functional Requirements

- **Performance:** Load pending advancements efficiently (may need aggregation)
- **UX:** Clear visual distinction between approved/pending/rejected
- **Accessibility:** Keyboard navigation, screen reader support
- **Responsive:** Works on mobile, tablet, desktop
- **Dark Mode:** Support dark mode styling

---

## API Endpoints

### 1. Get Pending Advancements (NEW - To Be Created)

**Endpoint:** `GET /api/campaigns/[campaignId]/advancements/pending`

**Purpose:** Fetch all unapproved advancements for characters in a campaign

**Authentication:** Required (GM only)

**Response:**

```typescript
{
  success: boolean;
  advancements: Array<{
    advancementRecord: AdvancementRecord;
    character: {
      id: string;
      name: string;
      ownerId: string;
    };
  }>;
}
```

**Implementation Notes:**

- Query all characters in campaign
- Filter advancement history for `gmApproved: false`
- Return with character context
- Sort by creation date (newest first)

**File:** `app/api/campaigns/[id]/advancements/pending/route.ts`

### 2. Approve Advancement (EXISTS)

**Endpoint:** `POST /api/characters/[characterId]/advancement/[recordId]/approve`

**Usage:** Call from UI with characterId and recordId

### 3. Reject Advancement (EXISTS)

**Endpoint:** `POST /api/characters/[characterId]/advancement/[recordId]/reject`

**Body:**

```typescript
{
  reason?: string; // Optional rejection reason
}
```

---

## Component Architecture

### File Structure

```
app/campaigns/[id]/components/
  ├── CampaignAdvancementsTab.tsx        # Main tab component
  ├── AdvancementCard.tsx                 # Individual advancement card
  └── RejectAdvancementDialog.tsx         # Rejection dialog

app/api/campaigns/[id]/advancements/
  └── pending/route.ts                    # API endpoint (NEW)
```

### Component Specifications

#### 1. CampaignAdvancementsTab.tsx

**Location:** `app/campaigns/[id]/components/CampaignAdvancementsTab.tsx`

**Props:**

```typescript
interface CampaignAdvancementsTabProps {
  campaign: Campaign;
  isGM: boolean; // Should always be true for this tab
}
```

**Features:**

- Fetch pending advancements on mount
- Display list of advancement cards
- Loading and error states
- Empty state when no pending advancements
- Filter/search functionality (optional)
- Refresh button

**Pattern Reference:** `CampaignCharactersTab.tsx`, `CampaignNotesTab.tsx`

**Estimated Lines:** 200-300

#### 2. AdvancementCard.tsx

**Location:** `app/campaigns/[id]/components/AdvancementCard.tsx`

**Props:**

```typescript
interface AdvancementCardProps {
  advancement: AdvancementRecord;
  character: {
    id: string;
    name: string;
    ownerId: string;
  };
  onApprove: (characterId: string, recordId: string) => Promise<void>;
  onReject: (characterId: string, recordId: string, reason?: string) => Promise<void>;
}
```

**Features:**

- Display advancement details in card format
- Character name (link to character sheet)
- Advancement type badge
- Value change display (e.g., "Body: 3 → 4")
- Karma cost
- Training time (if applicable)
- Player notes
- Created date
- Approve button
- Reject button (opens dialog)

**Pattern Reference:** Character cards in `CampaignCharactersTab.tsx`

**Estimated Lines:** 150-200

#### 3. RejectAdvancementDialog.tsx

**Location:** `app/campaigns/[id]/components/RejectAdvancementDialog.tsx`

**Props:**

```typescript
interface RejectAdvancementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  advancementType: string;
  characterName: string;
}
```

**Features:**

- Modal dialog for rejection
- Text area for rejection reason (required)
- Cancel and Confirm buttons
- Form validation
- Loading state during submission

**Pattern Reference:** React Aria Components Modal pattern

**Estimated Lines:** 100-150

---

## Implementation Steps

### Phase 1: API Endpoint (30 minutes)

1. Create `app/api/campaigns/[id]/advancements/pending/route.ts`
2. Implement GET handler:
   - Authenticate user
   - Verify user is GM of campaign
   - Get all characters in campaign
   - Query advancement history for each character
   - Filter for `gmApproved: false`
   - Return with character context
3. Add error handling
4. Write basic tests (optional, can be done later)

### Phase 2: Main Tab Component (2-3 hours)

1. Create `CampaignAdvancementsTab.tsx`
2. Implement data fetching:
   - Use `useEffect` to fetch on mount
   - Handle loading and error states
3. Implement list display:
   - Map advancements to cards
   - Empty state component
4. Add refresh functionality
5. Integrate with campaign page tabs

### Phase 3: Advancement Card Component (1 hour)

1. Create `AdvancementCard.tsx`
2. Implement card layout:
   - Character info section
   - Advancement details section
   - Action buttons section
3. Style with Tailwind (match existing patterns)
4. Add link to character sheet
5. Implement approve/reject handlers

### Phase 4: Rejection Dialog (1 hour)

1. Create `RejectAdvancementDialog.tsx`
2. Implement modal using React Aria Components
3. Add form with textarea for reason
4. Implement validation (reason required)
5. Add loading state
6. Connect to reject API endpoint

### Phase 5: Integration (30 minutes)

1. Add "Advancements" tab to `CampaignTabs.tsx` (GM-only)
2. Add tab content to campaign detail page
3. Add pending count badge (optional)
4. Test end-to-end workflow

### Phase 6: Polish (30 minutes - 1 hour)

1. Add filtering/search (optional)
2. Add sorting options (optional)
3. Improve error messages
4. Add success notifications
5. Responsive design testing
6. Dark mode testing

---

## Design Specifications

### Visual Design

**Tab Badge:**

- Show count of pending advancements: "Advancements (3)"
- Use warning/attention color (yellow/orange) if count > 0
- Only visible to GMs

**Advancement Card:**

- Border: `border-zinc-200 dark:border-zinc-800`
- Background: `bg-white dark:bg-black`
- Hover: `hover:border-zinc-300 hover:shadow-md`
- Padding: `p-4` or `p-6`

**Advancement Type Badges:**

- Attribute: Blue (`bg-blue-100 text-blue-800`)
- Skill: Green (`bg-green-100 text-green-800`)
- Edge: Purple (`bg-purple-100 text-purple-800`)
- Specialization: Orange (`bg-orange-100 text-orange-800`)

**Action Buttons:**

- Approve: Green (`bg-green-600 hover:bg-green-700`)
- Reject: Red (`bg-red-600 hover:bg-red-700`)

### Layout

```
┌─────────────────────────────────────────┐
│  Campaign: Shadowrun 2050              │
│  [Overview] [Characters] [Advancements]│
├─────────────────────────────────────────┤
│                                         │
│  Pending Advancements (3)              │
│  [Refresh]                              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Alice's Runner                   │   │
│  │ Attribute: Body 3 → 4           │   │
│  │ Cost: 20 karma                   │   │
│  │ Training: 28 days                │   │
│  │ Notes: "Need more durability"     │   │
│  │ [Approve] [Reject]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Bob's Decker                     │   │
│  │ Skill: Hacking 4 → 5             │   │
│  │ Cost: 10 karma                   │   │
│  │ Training: 35 days                │   │
│  │ [Approve] [Reject]               │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Code Examples

### Fetching Pending Advancements

```typescript
// In CampaignAdvancementsTab.tsx
useEffect(() => {
  async function fetchPendingAdvancements() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/advancements/pending`);
      const data = await res.json();

      if (data.success) {
        setAdvancements(data.advancements || []);
      } else {
        setError(data.error || "Failed to load pending advancements");
      }
    } catch (err) {
      setError("An error occurred while loading advancements");
    } finally {
      setLoading(false);
    }
  }

  fetchPendingAdvancements();
}, [campaign.id]);
```

### Approve Handler

```typescript
const handleApprove = async (characterId: string, recordId: string) => {
  try {
    const res = await fetch(`/api/characters/${characterId}/advancement/${recordId}/approve`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      // Show success notification
      // Refresh list
      await fetchPendingAdvancements();
    } else {
      // Show error
    }
  } catch (err) {
    // Show error
  }
};
```

### Reject Handler

```typescript
const handleReject = async (characterId: string, recordId: string, reason: string) => {
  try {
    const res = await fetch(`/api/characters/${characterId}/advancement/${recordId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();

    if (data.success) {
      // Show success notification
      // Close dialog
      // Refresh list
      await fetchPendingAdvancements();
    } else {
      // Show error
    }
  } catch (err) {
    // Show error
  }
};
```

---

## Testing Considerations

### Manual Testing Checklist

- [ ] GM can see pending advancements tab
- [ ] Tab only visible to GMs
- [ ] Pending advancements load correctly
- [ ] Empty state displays when no pending advancements
- [ ] Approve button works and updates list
- [ ] Reject dialog opens and requires reason
- [ ] Reject button works and updates list
- [ ] Character name links to character sheet
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode styling correct

### Test Data Setup

1. Create a campaign with GM user
2. Add characters to campaign
3. Create pending advancements (via API or UI)
4. Test approval/rejection workflow

---

## Future Enhancements

### Phase 2 Features (Optional)

1. **Bulk Operations**
   - Select multiple advancements
   - Bulk approve/reject
   - Estimated: 1-2 hours

2. **Advanced Filtering**
   - Filter by character
   - Filter by advancement type
   - Filter by date range
   - Estimated: 1 hour

3. **Notifications**
   - Notify players when advancement approved/rejected
   - Badge count on campaign page
   - Estimated: 2-3 hours

4. **Approval History**
   - View previously approved/rejected advancements
   - Search and filter history
   - Estimated: 2-3 hours

5. **Auto-Approval Rules**
   - Campaign settings for auto-approval thresholds
   - Auto-approve based on cost or type
   - Estimated: 3-4 hours

---

## Dependencies

### Required

- Character Advancement System (✅ Complete)
- Campaign System (✅ Complete)
- React Aria Components (✅ Available)
- Tailwind CSS (✅ Available)

### Optional

- Toast notification library (if not using React Aria)
- Date formatting library (if needed)

---

## Estimated Effort

### MVP (Minimum Viable Product)

- **Time:** 4-6 hours
- **Components:** 3 files
- **API Endpoints:** 1 new endpoint
- **Complexity:** Medium

### With Enhancements

- **Time:** 8-12 hours
- **Additional Features:** Filtering, bulk operations, notifications
- **Complexity:** Medium-High

---

## Related Documentation

- **Character Advancement Specification:** `/docs/specifications/character_advancement_specification.md`
- **Campaign Support Specification:** `/docs/specifications/campaign_support_specification.md`
- **Architecture Overview:** `/docs/architecture/architecture-overview.md`

---

## Notes

- Follow existing UI patterns from `CampaignCharactersTab` and `CampaignNotesTab`
- Use React Aria Components for accessibility
- Ensure dark mode support
- Test with multiple pending advancements
- Consider performance if campaign has many characters/advancements

---

## Questions to Resolve

1. Should approval require confirmation, or be one-click?
2. Should rejected advancements be removed or marked as rejected?
3. Should there be a time limit on pending advancements?
4. Should players be notified when advancement is approved/rejected?
5. Should there be approval history view?

---

**Implementation Status:** Complete
**Implemented By:** Claude Code (feature/gm-approval-ui branch)
**Implementation Date:** 2025-12-22
