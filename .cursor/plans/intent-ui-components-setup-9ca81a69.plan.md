<!-- 9ca81a69-a10a-40af-8c6e-f48b1cf18fcb b7228892-9daa-4bde-8425-520094076ff2 -->
# Core UI Components Setup with Intent UI

This plan sets up Intent UI components and creates the core UI structure for the Shadowrun VTT application.

## 1. Install Intent UI Dependencies

- Initialize Intent UI theme: `npx shadcn@latest init @intentui/theme-default`
- Install react-aria-components (if not already installed): `npm install react-aria-components`
- Add required Intent UI components via shadcn CLI:
- `@intentui/button`
- `@intentui/text-field` (for Input)
- `@intentui/listbox` (for Select/Dropdown)
- `@intentui/table`
- `@intentui/menu`
- `@intentui/sidebar`
- `@intentui/dialog` (for Modal)
- `@intentui/tabs`
- `@intentui/card`
- `@intentui/form` and `@intentui/field`

## 2. Create Theme Configuration

Create [src/styles/theme.ts](src/styles/theme.ts) with:

- Shadowrun cyberpunk color palette (neon greens, dark backgrounds, accent colors)
- Dark mode color scheme
- Typography settings
- Tailwind theme extensions

Update [src/app/globals.css](src/app/globals.css) to:

- Import theme variables
- Add cyberpunk aesthetic styles
- Configure dark mode support

## 3. Create Layout Components

- [src/components/layout/AppLayout.tsx](src/components/layout/AppLayout.tsx): Main app shell with responsive layout
- [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx): Top navigation with user menu integration
- [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx): Sidebar navigation using Intent UI Sidebar component

## 4. Create Game Components

- [src/components/game/CampaignCard.tsx](src/components/game/CampaignCard.tsx): Card component for displaying campaign info
- [src/components/game/CampaignList.tsx](src/components/game/CampaignList.tsx): List view of campaigns using CampaignCard
- [src/components/game/CharacterCard.tsx](src/components/game/CharacterCard.tsx): Card component for character display
- [src/components/game/CharacterSheet.tsx](src/components/game/CharacterSheet.tsx): Tabbed interface for character details using Intent UI Tabs

## 5. Create Form Components

- [src/components/forms/CampaignForm.tsx](src/components/forms/CampaignForm.tsx): Form for creating/editing campaigns using Intent UI Form + Field
- [src/components/forms/CharacterForm.tsx](src/components/forms/CharacterForm.tsx): Form for creating/editing characters using Intent UI Form + Field

## 6. Update Root Layout

Update [src/app/layout.tsx](src/app/layout.tsx) to:

- Integrate AppLayout component
- Include Navbar with user menu
- Include Sidebar for navigation
- Apply theme configuration

## Component Requirements

All components must:

- Use TypeScript with proper types
- Include proper accessibility (ARIA attributes, keyboard navigation)
- Have loading states (skeleton loaders or spinners)
- Handle errors gracefully (error boundaries, error messages)
- Be responsive (mobile-friendly with breakpoints)

## Implementation Notes

- Components will be added to `src/components/ui/` by shadcn CLI
- Existing layout structure in [src/app/layout.tsx](src/app/layout.tsx) will be refactored to use AppLayout
- Theme will integrate with existing Tailwind configuration
- Components should follow Shadowrun cyberpunk aesthetic (dark, neon accents, futuristic)

## Completed Implementation

All components have been successfully created and integrated:

1. **Intent UI Components**: Installed and configured all available components
2. **Theme**: Cyberpunk Shadowrun theme with dark mode support implemented
3. **Layout Components**: AppLayout, Navbar, and Sidebar with full responsive design
4. **Game Components**: CampaignCard, CampaignList, CharacterCard, and CharacterSheet with loading/error states
5. **Form Components**: CampaignForm and CharacterForm using react-aria-components Form
6. **Server/Client Boundary**: Fixed by creating AuthNavClient and properly passing user data from server to client components

### To-dos

- [x] Initialize Intent UI theme and install react-aria-components dependency
- [x] Add all required Intent UI components via shadcn CLI (button, text-field, select, table, menu, dialog, tabs, card, field)
- [x] Create theme.ts with cyberpunk Shadowrun color palette and update globals.css with theme variables and dark mode support
- [x] Create AppLayout, Navbar, and Sidebar components with responsive design and accessibility
- [x] Create CampaignCard, CampaignList, CharacterCard, and CharacterSheet components with loading states and error handling
- [x] Create CampaignForm and CharacterForm using Intent UI Form + Field components
- [x] Refactor root layout.tsx to use AppLayout, Navbar, and Sidebar components