# Homepage Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Logo/App Name                    [User Menu] [Notifications] [⚙️] │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │                                                               │
│ SIDEBAR  │                    MAIN CONTENT AREA                         │
│          │                                                               │
│ ┌──────┐ │ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏠   │ │ │                                                           │ │
│ │ Home │ │ │                    Welcome Section                       │ │
│ ├──────┤ │ │                                                           │ │
│ │ 👤   │ │ │  [Welcome message for authenticated users]               │ │
│ │      │ │ │  or                                                      │ │
│ │ Char │ │ │  [Sign up / Sign in prompts for guests]                  │ │
│ │ acte │ │ │                                                           │ │
│ │ rs   │ │ └─────────────────────────────────────────────────────────┘ │
│ ├──────┤ │                                                               │
│ │ 📚   │ │ ┌─────────────────────────────────────────────────────────┐ │
│ │      │ │ │                                                           │ │
│ │ Rule │ │ │              Quick Actions / Dashboard                   │ │
│ │ sets │ │ │                                                           │ │
│ │      │ │ │  [Create New Character] [Browse Characters]              │ │
│ │      │ │ │  [View Rulesets] [Recent Activity]                       │ │
│ │      │ │ │                                                           │ │
│ ├──────┤ │ └─────────────────────────────────────────────────────────┘ │
│ │ ⚙️   │ │                                                               │
│ │      │ │ ┌─────────────────────────────────────────────────────────┐ │
│ │ Sett │ │ │                                                           │ │
│ │ ings │ │ │              Character List / Overview                   │ │
│ │      │ │ │                                                           │ │
│ │      │ │ │  [Character cards or list view]                          │ │
│ │      │ │ │  [Empty state if no characters]                          │ │
│ │      │ │ │                                                           │ │
│ ├──────┤ │ └─────────────────────────────────────────────────────────┘ │
│ │      │ │                                                               │
│ │      │ │                                                               │
│ │      │ │                                                               │
│ └──────┘ │                                                               │
│          │                                                               │
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### HEADER

- **Position**: Fixed at top, full width
- **Height**: ~64px (4rem)
- **Content**:
  - Left: Logo/App Name ("Shadow Master")
  - Right: User menu dropdown (username, email, role) | Notifications icon | Settings icon
  - Background: White/Dark mode compatible
  - Border: Bottom border for separation

### SIDEBAR

- **Position**: Fixed on left side
- **Width**: ~240px (15rem)
- **Height**: Full viewport height minus header
- **Navigation Items**:
  - Home (current page, highlighted)
  - Characters (with count badge if applicable)
  - Rulesets
  - Settings
- **Styling**:
  - Each nav item: Icon + Label
  - Active state: Highlighted background
  - Hover state: Subtle background change
  - Collapsible on mobile (hamburger menu)

### MAIN CONTENT AREA

- **Position**: Right side, below header
- **Width**: Remaining viewport width (calc(100% - 240px))
- **Padding**: Responsive padding (16px mobile, 24px tablet, 32px desktop)
- **Sections** (stacked vertically):

#### 1. Welcome Section

- **Conditional Content**:
  - If authenticated: "Welcome back, [username]!"
  - If guest: "Welcome to Shadow Master" with sign up/sign in links
- **User Info**: Email, role, account creation date, last login

#### 2. Quick Actions / Dashboard

- **Action Buttons**:
  - Primary: "Create New Character"
  - Secondary: "Browse Characters", "View Rulesets"
- **Recent Activity**: Last viewed/edited characters (if any)

#### 3. Character List / Overview

- **If characters exist**:
  - Grid or list view of character cards
  - Each card: Name, edition, last modified, quick actions
- **If no characters**:
  - Empty state with illustration
  - Call-to-action: "Create your first character"

## Responsive Behavior

### Desktop (> 1024px)

- Sidebar: Always visible, fixed width
- Header: Full width
- Main content: Full remaining width

### Tablet (768px - 1024px)

- Sidebar: Collapsible, overlay on mobile
- Header: Full width
- Main content: Full width when sidebar hidden

### Mobile (< 768px)

- Sidebar: Hidden by default, accessible via hamburger menu
- Header: Full width with hamburger icon
- Main content: Full width
- Navigation: Bottom sheet or slide-out drawer

## Visual Hierarchy

1. **Header**: Highest priority (navigation, user actions)
2. **Sidebar**: Secondary navigation (persistent access)
3. **Main Content**: Primary focus area (content, actions)

## Color Scheme

- Follows existing dark mode support
- Uses Tailwind CSS classes
- Maintains contrast ratios for accessibility

## Interactive Elements

### Header

- Logo: Clickable (navigate to home)
- User menu: Dropdown with profile, settings, sign out
- Notifications: Badge with count if unread

### Sidebar

- Navigation items: Active state styling
- Hover effects: Subtle background changes
- Icons: Consistent icon set (Lucide or similar)

### Main Content

- Action buttons: Primary/secondary styling
- Character cards: Clickable, hover effects
- Links: Underlined, hover states
