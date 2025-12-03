# ShadowMaster Cyberpunk Theme Guide

This document describes the cyberpunk/Shadowrun-inspired theme system for ShadowMaster.

## Color Palette

### Base Colors
- `sr-dark` / `sr-darker` / `sr-darkest`: Deep dark backgrounds with blue undertones
- `sr-gray` / `sr-gray-light` / `sr-light-gray` / `sr-lighter-gray`: Layered surface colors

### Accent Colors
- **Primary (Cyan)**: `sr-accent` - Classic cyberpunk neon cyan (#00d4ff)
  - Variants: `sr-accent-dark`, `sr-accent-light`, `sr-accent-glow`
- **Secondary (Magenta)**: `sr-secondary` - Electric magenta/pink (#ff00ff)
  - Variants: `sr-secondary-dark`, `sr-secondary-light`
- **Tertiary (Blue)**: `sr-tertiary` - Electric blue (#0066ff)
  - Variants: `sr-tertiary-dark`, `sr-tertiary-light`

### Status Colors
- **Success**: `sr-success` - Matrix green (#00ff88)
- **Danger**: `sr-danger` - Neon red/pink (#ff3366)
- **Warning**: `sr-warning` - Electric orange (#ffaa00)
- **Matrix**: `sr-matrix` - Classic matrix green (#00ff41)

### Text Colors
- `sr-text`: Primary text (#e0e0e0) - High contrast for readability
- `sr-text-dim`: Secondary text (#a0a0a0)
- `sr-text-muted`: Muted text (#707070)

## Typography

### Font Families
- **Tech Font** (`font-tech`): Orbitron/Rajdhani - For headings and tech elements
- **Body Font** (`font-body`): Inter - For readable body text
- **Monospace** (`font-mono`): JetBrains Mono - For code and data

### Usage
```tsx
<h1 className="font-tech">Cyberpunk Heading</h1>
<p className="font-body">Readable body text</p>
<code className="font-mono">Code snippet</code>
```

## Component Classes

### Buttons

#### Primary Button
```tsx
<button className="btn-cyber-primary">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="btn-cyber">
  Secondary Action
</button>
```

### Cards/Panels
```tsx
<div className="card-cyber p-6">
  <h2>Card Title</h2>
  <p>Card content with hover glow effect</p>
</div>
```

### Input Fields
```tsx
<input 
  type="text" 
  className="input-cyber"
  placeholder="Enter text..."
/>
```

### Badges
```tsx
<span className="badge-cyber-accent">Accent</span>
<span className="badge-cyber-success">Success</span>
<span className="badge-cyber-danger">Danger</span>
<span className="badge-cyber-warning">Warning</span>
```

## Effects & Utilities

### Glow Effects
- `shadow-glow-cyan`: Cyan glow shadow
- `shadow-glow-cyan-lg`: Large cyan glow
- `shadow-glow-magenta`: Magenta glow
- `shadow-glow-blue`: Blue glow
- `shadow-glow-success`: Success glow
- `shadow-glow-danger`: Danger glow
- `shadow-glow-warning`: Warning glow

### Text Effects
- `text-glow-cyan`: Cyan text glow
- `text-glow-magenta`: Magenta text glow
- `text-readable`: Ensures text has good contrast

### Border Effects
- `border-glow-cyan`: Cyan border glow

### Animations
- `animate-pulse-glow`: Pulsing glow effect
- `animate-scanline`: Scanline animation
- `animate-flicker`: Flicker effect

## Background Patterns

The theme includes subtle background patterns:
- **Grid Pattern**: Subtle cyan grid overlay on body
- **Scanline Pattern**: Subtle scanline effect overlay

These are automatically applied to the body element for a cyberpunk aesthetic without compromising readability.

## Best Practices

### Readability
- Always use `sr-text` or `text-sr-text` for primary text
- Use `text-readable` utility for text that needs extra contrast
- Avoid using glow effects on large blocks of text
- Maintain sufficient contrast ratios (WCAG AA compliant)

### Color Usage
- Use `sr-accent` (cyan) as the primary accent color
- Use `sr-secondary` (magenta) sparingly for special emphasis
- Use status colors (`sr-success`, `sr-danger`, `sr-warning`) for their semantic meanings
- Avoid mixing too many accent colors in a single component

### Effects
- Use glow effects on interactive elements (buttons, links, inputs)
- Apply glow effects on hover/focus states
- Keep animations subtle and purposeful
- Don't overuse glow effects - less is more

### Typography
- Use tech fonts (`font-tech`) for headings and labels
- Use body fonts (`font-body`) for paragraphs and content
- Use monospace (`font-mono`) for code, data, and technical information

## Examples

### Complete Card Example
```tsx
<div className="card-cyber p-6">
  <h2 className="font-tech text-2xl text-glow-cyan mb-4">
    Character Sheet
  </h2>
  <div className="space-y-4">
    <div>
      <label className="text-sr-text-dim text-sm">Name</label>
      <input 
        type="text" 
        className="input-cyber w-full mt-1"
        placeholder="Enter character name"
      />
    </div>
    <button className="btn-cyber-primary">
      Save Character
    </button>
  </div>
</div>
```

### Status Display Example
```tsx
<div className="flex gap-2">
  <span className="badge-cyber-success">Online</span>
  <span className="badge-cyber-warning">Warning</span>
  <span className="badge-cyber-danger">Error</span>
</div>
```

## Accessibility

The theme is designed with accessibility in mind:
- High contrast text colors (WCAG AA compliant)
- Focus states with visible rings
- Readable font sizes and line heights
- Semantic color usage for status indicators
- Keyboard navigation support

When customizing, ensure you maintain:
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Visible focus indicators
- Clear visual hierarchy

