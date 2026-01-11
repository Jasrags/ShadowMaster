# Unauthenticated Homepage Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Logo/App Name                                    [Sign In] [Sign Up] │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                         MAIN CONTENT AREA                                │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                       │ │
│ │                    Hero Section                                       │ │
│ │                                                                       │ │
│ │              Welcome to Shadow Master                                │ │
│ │                                                                       │ │
│ │    Create and manage your Shadowrun characters with ease.            │ │
│ │    Support for all editions (1E-6E + Anarchy)                        │ │
│ │                                                                       │ │
│ │        [Get Started] [Learn More]                                     │ │
│ │                                                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                       │ │
│ │                    Features Section                                   │ │
│ │                                                                       │ │
│ │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │ │
│ │  │              │  │              │  │              │              │ │
│ │  │   📝         │  │   📚         │  │   ⚙️         │              │ │
│ │  │              │  │              │  │              │              │ │
│ │  │  Character   │  │   Multi-     │  │   Flexible   │              │ │
│ │  │  Management  │  │   Edition    │  │   Rulesets   │              │ │
│ │  │              │  │   Support    │  │              │              │ │
│ │  │              │  │              │  │              │              │ │
│ │  └──────────────┘  └──────────────┘  └──────────────┘              │ │
│ │                                                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                       │ │
│ │                    Call-to-Action Section                           │ │
│ │                                                                       │ │
│ │              Ready to create your first character?                   │ │
│ │                                                                       │ │
│ │        [Sign Up Free] [Sign In]                                      │ │
│ │                                                                       │ │
│ │              Already have an account? Sign in to continue.            │ │
│ │                                                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                       │ │
│ │                    Footer                                             │ │
│ │                                                                       │ │
│ │    [About] [Documentation] [Support] [Privacy] [Terms]               │ │
│ │                                                                       │ │
│ │                    © 2024 Shadow Master                              │ │
│ │                                                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### HEADER

- **Position**: Fixed at top, full width
- **Height**: ~64px (4rem)
- **Content**:
  - Left: Logo/App Name ("Shadow Master") - clickable, links to home
  - Right: "Sign In" button (secondary style) | "Sign Up" button (primary style)
- **Styling**:
  - Background: White/Dark mode compatible
  - Border: Bottom border for separation
  - Sticky/fixed on scroll

### MAIN CONTENT AREA

- **Position**: Full width below header
- **Padding**: Responsive padding (16px mobile, 24px tablet, 32px desktop)
- **Max Width**: Centered with max-width constraint (e.g., 1200px)
- **Sections** (stacked vertically):

#### 1. Hero Section

- **Purpose**: First impression, value proposition
- **Content**:
  - Large heading: "Welcome to Shadow Master"
  - Subheading: Brief description of the app
  - Supporting text: Key benefits (edition support, character management)
  - Action buttons:
    - Primary: "Get Started" (links to signup)
    - Secondary: "Learn More" (scrolls to features or links to docs)
- **Styling**:
  - Centered text alignment
  - Large, prominent heading (text-4xl or larger)
  - Generous spacing (py-16 or py-24)
  - Optional: Background gradient or subtle pattern

#### 2. Features Section

- **Purpose**: Highlight key capabilities
- **Layout**: 3-column grid (stacks on mobile)
- **Feature Cards**:
  - **Character Management**:
    - Icon: Document/Character icon
    - Title: "Character Management"
    - Description: "Create, edit, and manage your Shadowrun characters with an intuitive interface"
  - **Multi-Edition Support**:
    - Icon: Book/Collection icon
    - Title: "Multi-Edition Support"
    - Description: "Support for all Shadowrun editions (1E-6E + Anarchy) with edition-specific rules"
  - **Flexible Rulesets**:
    - Icon: Settings/Gear icon
    - Title: "Flexible Rulesets"
    - Description: "Customizable rulesets with book-based overrides and modular rule systems"
- **Styling**:
  - Card-based layout with hover effects
  - Icons: Large, prominent (64px or larger)
  - Consistent spacing between cards

#### 3. Call-to-Action Section

- **Purpose**: Convert visitors to users
- **Content**:
  - Heading: "Ready to create your first character?"
  - Primary CTA: "Sign Up Free" (large, prominent button)
  - Secondary CTA: "Sign In" (for returning users)
  - Supporting text: "Already have an account? Sign in to continue."
- **Styling**:
  - Centered layout
  - Prominent button styling
  - Clear visual hierarchy

#### 4. Footer (Optional)

- **Purpose**: Additional navigation and legal links
- **Content**:
  - Links: About, Documentation, Support, Privacy Policy, Terms of Service
  - Copyright notice
- **Styling**:
  - Subtle background
  - Small text
  - Horizontal link layout

## Responsive Behavior

### Desktop (> 1024px)

- Header: Full width, buttons on right
- Hero: Centered, max-width container
- Features: 3-column grid
- CTA: Centered, prominent buttons
- Footer: Full width, horizontal links

### Tablet (768px - 1024px)

- Header: Full width, buttons may stack or reduce size
- Hero: Centered, slightly reduced padding
- Features: 2-column grid or stacked
- CTA: Centered, buttons side-by-side
- Footer: Full width, horizontal links

### Mobile (< 768px)

- Header: Full width, hamburger menu or stacked buttons
- Hero: Full width, reduced padding, larger text
- Features: Single column, stacked cards
- CTA: Full-width buttons, stacked vertically
- Footer: Full width, stacked or wrapped links

## Visual Hierarchy

1. **Hero Section**: Highest priority (first impression)
2. **CTA Buttons**: High priority (conversion points)
3. **Features**: Medium priority (information)
4. **Footer**: Lowest priority (supporting content)

## Color Scheme

- Follows existing dark mode support
- Uses Tailwind CSS classes
- Maintains contrast ratios for accessibility
- Primary CTA buttons: High contrast, prominent

## Interactive Elements

### Header

- Logo: Clickable (navigate to home)
- Sign In button: Secondary style, links to `/signin`
- Sign Up button: Primary style, links to `/signup`

### Hero Section

- "Get Started" button: Primary style, links to `/signup`
- "Learn More" button: Secondary style, scrolls to features or links to docs

### Features Section

- Feature cards: Hover effects (subtle elevation or background change)
- Optional: Clickable cards that expand or link to detailed pages

### CTA Section

- "Sign Up Free" button: Primary style, large, prominent, links to `/signup`
- "Sign In" button: Secondary style, links to `/signin`
- Links: Underlined, hover states

## Content Strategy

### Hero Message

- Clear value proposition
- Emphasize ease of use
- Highlight multi-edition support
- Keep it concise (2-3 sentences max)

### Features

- Focus on 3-4 key differentiators
- Use clear, benefit-focused language
- Keep descriptions brief (1-2 sentences)

### CTA

- Clear, action-oriented language
- Remove friction (e.g., "Sign Up Free" vs "Sign Up")
- Provide alternative for returning users

## Accessibility Considerations

- All buttons and links have clear focus states
- Color contrast meets WCAG AA standards
- Text is readable at all sizes
- Interactive elements have sufficient touch targets (44x44px minimum)
- Semantic HTML structure (header, main, footer)
- ARIA labels where appropriate

## Animation & Transitions

- Subtle fade-in on scroll for sections
- Smooth hover transitions on buttons and cards
- No auto-playing animations or videos
- Respects `prefers-reduced-motion` media query
