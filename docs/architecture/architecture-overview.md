# Architecture Overview

## Tech Stack

### Frontend Framework
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.0** - UI library
- **React DOM 19.2.0** - React rendering for web
- **TypeScript 5** - Type-safe JavaScript

### UI Components
- **React Aria Components 1.13.0** - Accessible component primitives built on React Aria

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/postcss** - Tailwind CSS v4 PostCSS plugin
- **PostCSS** - CSS processing with Tailwind plugin
- **Geist Fonts** - Custom font family (Sans & Mono) via Next.js font optimization
  - CSS variables: `--font-geist-sans` and `--font-geist-mono`

### Development Tools
- **ESLint 9** - Code linting with Next.js configurations
  - Flat config format (`eslint.config.mjs`)
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
  - Custom global ignore patterns
- **pnpm** - Package manager

### Build & Runtime
- **Node.js** - Runtime environment
- **TypeScript Compiler** - Type checking and compilation
  - Target: ES2017
  - Module: ESNext
  - Module Resolution: Bundler

## Project Structure

```
shadow-master/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout with fonts and global styles
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles with Tailwind imports
│   └── favicon.ico        # Site favicon
├── docs/                   # Documentation
│   ├── architecture/      # System architecture and design docs
│   ├── requirements/      # Requirements and planning docs
│   └── prompts/           # Feature requests and design wireframes
├── public/                 # Static assets
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.mjs     # PostCSS configuration
├── eslint.config.mjs      # ESLint configuration
└── package.json           # Dependencies and scripts
```

## Application Architecture

### Core Domain: Shadowrun Character Management

The application is designed to support multiple Shadowrun tabletop RPG editions (1E-6E + Anarchy) with a flexible, modular ruleset system.

### Key Architectural Components

#### 1. Ruleset System
- **Edition-Based Architecture**: Each edition has its own base ruleset
- **Modular Rule Modules**: Rules organized by domain (attributes, skills, combat, matrix, magic, edge, lifestyle, gear)
- **Book-Based Overrides**: Support for errata, expansions, and rule modifications
- **Merging Engine**: Combines base edition rules with book-specific overrides
- **Validation Engine**: Applies merged ruleset to character data

#### 2. Database Schema
The system uses a relational database with the following core entities:

- **Editions**: Top-level ruleset identifiers
- **Books**: Contain rule modules and overrides per edition
- **Rule Modules**: Encapsulate specific rule domains (JSONB payload)
- **Rule Overrides**: Book-specific modifications to base modules
- **Creation Methods**: Edition-specific character creation approaches

See `docs/architecture/database_schema.md` for detailed schema.

#### 3. Data Flow

```
Edition Selection
    ↓
Load Edition Base Rules
    ↓
Load Associated Books
    ↓
Merge Engine (Base Modules + Overrides)
    ↓
Final Immutable Ruleset
    ↓
Validation Engine
    ↓
Character Data Generation
```

#### 4. Frontend Architecture

**App Router Structure**:
- Uses Next.js 16 App Router (file-based routing)
- Server Components by default
- TypeScript for type safety
- Tailwind CSS for styling with dark mode support

**Styling Approach**:
- Utility-first CSS with Tailwind CSS v4
- CSS custom properties for theming (`--background`, `--foreground`)
- Tailwind theme configuration via `@theme inline` directive
- Dark mode via `prefers-color-scheme` media query
- Font optimization via Next.js font system with CSS variables
- Accessible component primitives via React Aria Components

## Configuration Details

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to root directory
- JSX: React JSX transform
- Module resolution: Bundler (for Next.js)

### Next.js Configuration
- Currently using default configuration
- Ready for custom configuration as needed

### ESLint Configuration
- Flat config format (ESLint 9)
- Next.js core web vitals rules
- TypeScript-specific rules
- Custom global ignore patterns (`.next/`, `out/`, `build/`, `next-env.d.ts`)

## Development Workflow

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Development Server
- Default port: 3000
- Hot module replacement enabled
- TypeScript type checking in development

## Future Architecture Considerations

Based on the documentation, the system is designed to support:

1. **User Authentication** - Planned feature (see `docs/prompts/user-authentication-feature-request.md`)
2. **User Management** - Planned feature (see `docs/prompts/user-management-feature-request.md`)
3. **Character Sheet Generation** - Edition-specific templates
4. **Ruleset Validation** - Real-time character validation against merged rulesets
5. **Multi-Edition Support** - Seamless switching between Shadowrun editions

## Design Principles

1. **Modularity**: Rules are organized into discrete, composable modules
2. **Immutability**: Rulesets are immutable after merge to ensure consistency
3. **Extensibility**: Book-based override system allows for easy expansion
4. **Type Safety**: TypeScript throughout for compile-time error detection
5. **Performance**: Next.js optimizations (font loading, image optimization, etc.)

## Related Documentation

### Architecture
- `docs/architecture/database_schema.md` - Database structure
- `docs/architecture/edition_support_and_ruleset_architecture.md` - Ruleset architecture details
- `docs/architecture/merging_algorithm.md` - Ruleset merging logic
- `docs/architecture/system_design_diagram.md` - Visual system flow

### Requirements
- `docs/requirements/shadowrun_edition_support_requirements.md` - Edition support requirements

