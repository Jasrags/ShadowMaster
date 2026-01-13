> [!NOTE]
> This implementation guide is governed by the [Capability (TBD)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/TBD).

# Settings Page Specification

**Last Updated:** 2025-12-17  
**Status:** Fully Implemented (MVP)  
**Category:** UI/UX, User Management  
**Affected Editions:** All editions (user-facing feature)

---

## Overview

The Settings page (`/settings`) provides a centralized interface for users to manage their account, preferences, and application settings. This page allows users to:

- Update account information (email, username)
- Change password
- Manage application preferences (theme, UI behavior)
- Control data management (export, import, backup)
- Configure privacy and security settings
- View account information and activity

This page is accessible from the main navigation sidebar and is currently marked as "Coming Soon" in the UI. It can also be accessed from the user menu dropdown in the header.

---

## Page Structure

### Route

- **Path:** `/app/settings/page.tsx`
- **Layout:** Uses `SettingsLayout` (wrapping `AuthenticatedLayout`)
- **Authentication:** Required (protected route)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (from AuthenticatedLayout)                                │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN CONTENT AREA                                    │
│ (nav)     │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Page Header                                      │ │
│           │ │ - Title: "Settings"                              │ │
│           │ │ - Subtitle: "Manage your account and preferences"│ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Settings Sections (Tabbed or Accordion)          │ │
│           │ │ - Account                                       │ │
│           │ │ - Security                                       │ │
│           │ │ - Preferences                                    │ │
│           │ │ - Data Management                                │ │
│           │ │ - Privacy                                        │ │
│           │ └─────────────────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## Components

### 1. SettingsPage (Main Component)

**Location:** `/app/settings/page.tsx`

**Responsibilities:**

- Fetch current user data
- Coordinate between settings sections
- Handle form submissions and updates
- Manage loading and error states
- Display success/error messages

**State:**

- `user: PublicUser | null` - Current user data
- `activeSection: SettingsSection` - Currently active section
- `loading: boolean` - Loading state
- `error: string | null` - Error state
- `successMessage: string | null` - Success message

**Props:** None (client component with data fetching)

---

### 2. SettingsNavigation

**Location:** `/app/settings/components/SettingsNavigation.tsx`

**Description:** Side navigation or tabs for switching between settings sections.

**Sections:**

- **Account** - Profile information, email, username
- **Security** - Password change, session management
- **Preferences** - Theme, UI settings
- **Data Management** - Export, import, backup
- **Privacy** - Account deletion, data privacy

**Props:**

```typescript
interface SettingsNavigationProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}
```

---

### 3. AccountSection

**Location:** `/app/settings/components/AccountSection.tsx`

**Description:** Manage account information and profile details.

**Features:**

- Display current account information
- Edit email address (with validation)
- Edit username (with validation)
- Display account creation date
- Display last login date
- Display user roles
- Character count

**Form Fields:**

- Email (text input, email validation)
- Username (text input, 3-50 characters)
- Save button

**Props:**

```typescript
interface AccountSectionProps {
  user: PublicUser;
  onUpdate: (updates: { email?: string; username?: string }) => Promise<void>;
}
```

**API Endpoint:** `PUT /api/settings/account` (new endpoint for self-service updates)

---

### 4. SecuritySection

**Location:** `/app/settings/components/SecuritySection.tsx`

**Description:** Manage password and security settings.

**Features:**

- Change password form
- Current password verification
- New password strength indicator
- Password confirmation
- Active sessions list (future)
- Two-factor authentication toggle (future)

**Form Fields:**

- Current password (password input)
- New password (password input with strength meter)
- Confirm password (password input)
- Change password button

**Password Requirements:**

- Minimum 8 characters
- Show strength indicator (weak, medium, strong)
- Must match confirmation

**Props:**

```typescript
interface SecuritySectionProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}
```

**API Endpoint:** `POST /api/settings/password` (new endpoint)

---

### 5. PreferencesSection

**Location:** `/app/settings/components/PreferencesSection.tsx`

**Description:** Manage application preferences and UI settings.

**Features:**

- Theme selection (Light, Dark, System)
- Sidebar behavior (collapsed by default, etc.)
- Character creation defaults (preferred edition, etc.)
- Notification preferences (future)
- Language selection (future)

**Settings:**

- **Auto-save drafts:** Toggle (character creation)

**Props:**

```typescript
interface PreferencesSectionProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}
```

**Storage:** Preferences stored in localStorage initially, optionally synced to user record

---

### 6. DataManagementSection

**Location:** `/app/settings/components/DataManagementSection.tsx`

**Description:** Export, import, and manage character data.

**Features:**

- Export all characters as JSON
- Export individual character as JSON
- Import characters from JSON
- Download data backup
- View storage usage (character count, etc.)

**Actions:**

- **Export All Characters:** Button → Downloads JSON file
- **Export Character:** Dropdown → Select character → Download
- **Import Characters:** File input → Upload JSON → Validate → Import
- **Download Full Backup:** Button → Downloads all user data

**Props:**

```typescript
interface DataManagementSectionProps {
  characters: Character[];
  onExport: (characterIds?: string[]) => Promise<void>;
  onImport: (file: File) => Promise<void>;
}
```

**API Endpoints:**

- `GET /api/settings/export` - Export user data
- `POST /api/settings/import` - Import character data

---

### 7. PrivacySection

**Location:** `/app/settings/components/PrivacySection.tsx`

**Description:** Privacy settings and account deletion.

**Features:**

- Account deletion option
- Data retention information
- Privacy policy link
- Terms of service link
- Clear confirmation dialog for deletion

**Actions:**

- **Delete Account:** Button → Confirmation dialog → Delete account and all data

**Warning:** Account deletion is permanent and cannot be undone.

**Props:**

```typescript
interface PrivacySectionProps {
  onDeleteAccount: () => Promise<void>;
}
```

**API Endpoint:** `DELETE /api/settings/account` (new endpoint for self-service deletion)

---

## Data Requirements

### User Preferences Type

```typescript
interface UserPreferences {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  defaultEdition?: EditionCode;
  autoSaveDrafts: boolean;
  notifications?: {
    email?: boolean;
    inApp?: boolean;
  };
}
```

### API Endpoints

#### 1. GET `/api/settings/account`

**Purpose:** Get current user's account information

**Response:**

```typescript
{
  success: boolean;
  user: PublicUser;
}
```

**Implementation:** Use existing `/api/auth/me` or create dedicated endpoint

---

#### 2. PUT `/api/settings/account`

**Purpose:** Update user's own account information (email, username)

**Request:**

```typescript
{
  email?: string;
  username?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  user?: PublicUser;
  error?: string;
}
```

**Implementation:** New endpoint - allows users to update their own account (different from admin-only `/api/users/[id]`)

**Validation:**

- Email format validation
- Username length (3-50 characters)
- Email uniqueness check
- Username uniqueness check

---

#### 3. POST `/api/settings/password`

**Purpose:** Change user's password

**Request:**

```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint

**Validation:**

- Verify current password
- New password minimum 8 characters
- New password strength requirements

---

#### 4. GET `/api/settings/export`

**Purpose:** Export all user data as JSON

**Query Parameters:**

- `type?: "characters" | "all"` - What to export (default: "all")

**Response:**

- JSON file download (Content-Type: application/json)
- Or JSON response with data

**Implementation:** New endpoint

**Data Included:**

- User profile (without password)
- All characters
- Preferences (if stored server-side)

---

#### 5. POST `/api/settings/import`

**Purpose:** Import character data from JSON

**Request:**

- Multipart form data with JSON file

**Response:**

```typescript
{
  success: boolean;
  imported: number;
  errors?: string[];
}
```

**Implementation:** New endpoint

**Validation:**

- Validate JSON structure
- Validate character data against ruleset
- Check for duplicate character IDs
- Validate ownership

---

#### 6. DELETE `/api/settings/account`

**Purpose:** Delete user's own account

**Request:**

```typescript
{
  confirm: boolean; // Must be true
  password: string; // Verify password for security
}
```

**Response:**

```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - allows users to delete their own account

**Security:**

- Require password confirmation
- Prevent deletion of last administrator (if user is admin)
- Delete all associated data (characters, etc.)

---

## UI/UX Considerations

### Visual Design

- **Sectioned Layout:** Use tabs or accordion for settings sections
- **Form Design:** Consistent form styling with validation messages
- **Confirmation Dialogs:** For destructive actions (password change, account deletion)
- **Success Feedback:** Toast notifications or inline success messages
- **Error Handling:** Clear, user-friendly error messages
- **Loading States:** Disable forms during submission, show loading indicators

### Accessibility

- **Form Labels:** All inputs have associated labels
- **Error Announcements:** ARIA live regions for form errors
- **Keyboard Navigation:** Full keyboard support
- **Focus Management:** Proper focus handling in modals and forms
- **Screen Readers:** Descriptive labels and instructions

### Security Considerations

- **Password Verification:** Require current password for sensitive changes
- **CSRF Protection:** Use Next.js built-in CSRF protection
- **Rate Limiting:** Prevent brute force on password changes (future)
- **Session Management:** Invalidate sessions on password change (future)
- **Audit Logging:** Log sensitive actions (future)

### User Flow

1. User navigates to `/settings` from sidebar or user menu
2. Page loads, displays current user information
3. User selects a settings section (Account, Security, etc.)
4. User makes changes to settings
5. User clicks "Save" or equivalent action
6. Form validates input
7. API call updates settings
8. Success message displayed
9. UI updates to reflect changes

---

## Implementation Notes

### File Structure

```
app/settings/
├── page.tsx                          # Main settings page
├── layout.tsx                        # AuthenticatedLayout wrapper
└── components/
    ├── SettingsNavigation.tsx        # Section navigation
    ├── AccountSection.tsx            # Account management
    ├── SecuritySection.tsx          # Password and security
    ├── PreferencesSection.tsx        # App preferences
    ├── DataManagementSection.tsx     # Export/import
    ├── PrivacySection.tsx            # Privacy and deletion
    └── PasswordStrengthMeter.tsx     # Password strength indicator
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions
  - `@/lib/auth` - Authentication utilities
  - `@/lib/storage/users` - User data access
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

- **New:**
  - File upload handling for import
  - JSON export/download utilities

### State Management

- **Client-side state:** React `useState` for form state
- **Server data:** Fetch via API routes
- **Preferences:** Store in localStorage initially, optionally sync to server
- **Form validation:** Client-side validation with server-side verification

### Storage Strategy

**User Preferences:**

- **Phase 1:** Store in localStorage (client-side only)
- **Phase 2:** Add `preferences` field to User type, sync to server
- **Phase 3:** Full server-side preference management

**Rationale:** Start simple with localStorage, add server sync when needed for multi-device support.

---

## Security Considerations

### Password Change

- Require current password verification
- Enforce minimum password strength
- Hash new password server-side
- Invalidate all sessions on password change (future)
- Rate limit password change attempts (future)

### Account Updates

- Validate email format and uniqueness
- Validate username format and uniqueness
- Prevent email/username changes to existing values without verification
- Send confirmation email for email changes (future)

### Account Deletion

- Require password confirmation
- Require explicit confirmation (checkbox + button)
- Show warning about data loss
- Prevent deletion of last administrator
- Delete all associated data (characters, etc.)
- Log deletion for audit (future)

### Data Export/Import

- Validate imported data structure
- Sanitize imported data
- Prevent import of malicious data
- Limit export size for performance
- Rate limit export requests (future)

---

## Future Enhancements

### Phase 2: Enhanced Security

- Two-factor authentication (2FA)
- Active sessions management
- Login history and audit log
- Security alerts (new device login, etc.)
- Password expiration reminders

### Phase 3: Advanced Preferences

- Customizable UI themes
- Keyboard shortcuts configuration
- Character creation wizard preferences
- Default campaign settings
- Notification preferences (email, in-app)

### Phase 4: Data Management

- Scheduled automatic backups
- Cloud storage integration (Google Drive, Dropbox)
- Character versioning/history
- Bulk character operations
- Data migration tools

### Phase 5: Privacy & Compliance

- GDPR compliance features
- Data retention policies
- Privacy policy acceptance
- Terms of service acceptance
- Data portability tools

---

## Related Documentation

- **User Management:** `/docs/prompts/user-management-feature-request.md`
- **User Authentication:** `/docs/prompts/user-authentication-feature-request.md`
- **Character Export:** Mentioned in `/docs/architecture/v1_roadmap.md`
- **Architecture:** `/docs/architecture/architecture-overview.md`

---

## Change Log

### 2025-01-27

- Initial specification created
- Documents current settings page implementation

### 2025-12-17

- Confirmed full implementation of MVP features
- Verified account updates, password changes, and data export functionality
- Updated status to "Fully Implemented"

---

## Open Questions

1. **Preference Storage:** Should preferences be stored server-side from the start or start with localStorage?
   - **Recommendation:** Start with localStorage, add server sync in Phase 2

2. **Password Strength:** What are the exact password requirements?
   - **Recommendation:** Minimum 8 characters, show strength meter, optional complexity requirements

3. **Email Verification:** Should email changes require verification?
   - **Recommendation:** Phase 2 feature - start with simple update, add verification later

4. **Session Management:** Should password change invalidate all sessions?
   - **Recommendation:** Phase 2 feature - start with simple change, add session invalidation later

5. **Account Deletion:** Should there be a grace period (e.g., 30 days) before permanent deletion?
   - **Recommendation:** Start with immediate deletion, add grace period in Phase 2 if needed

6. **Data Export Format:** What should the export JSON structure be?
   - **Recommendation:** Include user metadata + array of characters, version the format

---

## Implementation Priority

**Priority:** Medium-High  
**Estimated Effort:** 4-5 days  
**Dependencies:**

- User update API endpoints (some exist, some need creation)
- Password change API endpoint (needs creation)
- Export/import API endpoints (need creation)

**Blockers:** None (all infrastructure exists, need new API endpoints)

This feature is important for user autonomy and data management. While not critical for MVP character creation, it significantly improves user experience and trust in the platform.

---

## Notes

- This page complements the user management system by providing self-service capabilities
- Consider adding analytics to track which settings are used most
- Future: Consider adding user feedback/support links in settings
- Integration with campaign management (future): Allow users to set default campaign preferences
- Consider adding a "Profile" page separate from Settings for public-facing profile information (future)
