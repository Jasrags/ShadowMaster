# Frontend Patterns Documentation Prompt

## Instructions
Run this prompt after completing the initial analysis to document frontend patterns and conventions.

---

# Generate Frontend Patterns Documentation

Based on your previous analysis of the codebase, create comprehensive documentation of all frontend patterns, conventions, and best practices used in the application.

## Requirements

### 1. Component Architecture

#### Organization
- Directory structure and naming conventions
- Component categorization (pages, layouts, features, UI, etc.)
- File naming patterns
- Co-location strategy (tests, styles, etc.)

#### Component Patterns
For each major pattern found, document:
- Pattern name (functional components, HOCs, render props, custom hooks, etc.)
- When it's used
- Example implementation
- Props patterns
- Composition patterns

### 2. State Management

#### Global State
- State management solution (Redux, Zustand, Context, etc.)
- Store structure
- Action/reducer patterns (if Redux)
- State update patterns
- Async state handling
- State persistence (if any)

#### Local State
- useState patterns
- useReducer usage
- State lifting patterns
- State composition

#### Server State
- Data fetching approach (React Query, SWR, custom, etc.)
- Cache management
- Optimistic updates
- Error handling
- Loading states

### 3. Routing

#### Route Structure
- Routing library used
- Route organization
- Dynamic routes
- Protected routes
- Route parameters
- Navigation patterns

#### Code Splitting
- Lazy loading strategy
- Route-based splitting
- Component-based splitting

### 4. Form Handling
- Form libraries used (React Hook Form, Formik, etc.)
- Form validation integration
- Form state management
- Submit handling
- Error display
- Multi-step forms (if any)

### 5. Data Fetching

#### API Communication
- HTTP client (fetch, axios, etc.)
- Request configuration
- Base URL handling
- Authentication header injection
- Request interceptors
- Response interceptors
- Error handling

#### Loading States
- Loading indicator patterns
- Skeleton screens
- Progressive loading
- Error boundaries

### 6. Styling Approach
- CSS solution (CSS Modules, Styled Components, Tailwind, etc.)
- Theme system
- Responsive design patterns
- Component styling patterns
- Global styles
- CSS architecture (BEM, utility-first, etc.)

### 7. Common Component Patterns

#### Reusable Components
Document key shared components:
- Button variants
- Input components
- Modal/Dialog
- Dropdown/Select
- Card layouts
- Navigation components
- Shadowrun-specific components (dice roller, character sheet, etc.)

For each, include:
- Purpose
- Props interface
- Usage examples
- Variants/configurations

### 8. Hooks

#### Custom Hooks
Document all custom hooks:
- Hook name and purpose
- Parameters
- Return value
- Usage example
- Dependencies

### 9. TypeScript/PropTypes
- Type definition patterns
- Interface vs Type usage
- Generic patterns
- Utility types used
- Type composition

### 10. Error Handling
- Error boundary implementation
- Try-catch patterns
- User error feedback
- Error logging
- Recovery strategies

### 11. Performance Optimization
- Memoization patterns (useMemo, useCallback, React.memo)
- Virtual scrolling (if used)
- Debouncing/throttling
- Image optimization
- Bundle size optimization

### 12. Testing Patterns
- Testing library used
- Component test patterns
- Mock patterns
- Integration test approach
- Test file organization

### 13. Accessibility
- ARIA usage
- Keyboard navigation
- Focus management
- Screen reader considerations

### 14. Shadowrun-Specific UI Components
Document game-specific components:
- Character sheet display
- Dice roller UI
- Initiative tracker
- Skill check interface
- Inventory management
- Combat interface

## Output Format

Create the file as `/docs/claude/frontend-patterns.md` with this structure:

```markdown
# Frontend Patterns & Conventions

## Overview
[High-level frontend architecture summary - framework, version, key libraries]

## Tech Stack
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand (or whatever is used)
- **Routing**: React Router 6.x
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Build Tool**: Vite (or webpack, etc.)

## Project Structure

### Directory Organization
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components
│   └── shadowrun/       # Game-specific components
├── pages/               # Route-level components
├── hooks/               # Custom hooks
├── store/               # State management
├── services/            # API services
├── utils/               # Utility functions
├── types/               # TypeScript types
└── styles/              # Global styles
```

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `CharacterSheet.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useCharacter.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDiceRoll.ts`)
- Types: `PascalCase.ts` or `types.ts` (e.g., `Character.types.ts`)
- Tests: `*.test.tsx` or `*.spec.tsx`

### Co-location Strategy
[How tests, styles, and related files are organized with components]

## Component Patterns

### Functional Component Pattern
**When to use**: Default pattern for all components

**Example**:
```tsx
import { FC } from 'react';

interface CharacterCardProps {
  character: Character;
  onSelect: (id: string) => void;
}

export const CharacterCard: FC<CharacterCardProps> = ({ character, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect(character.id)}>
      <h3>{character.name}</h3>
      <p>{character.metatype}</p>
    </div>
  );
};
```

**Props Pattern**:
- Always define interface for props
- Use descriptive names
- Callback props prefixed with `on`
- Optional props clearly marked with `?`

---

### Custom Hook Pattern
**When to use**: Reusable stateful logic

**Example**:
```tsx
import { useState, useEffect } from 'react';
import { Character } from '@/types';
import { api } from '@/services';

export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.getCharacter(id)
      .then(setCharacter)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { character, loading, error };
}
```

**Usage**:
```tsx
function CharacterProfile({ id }: { id: string }) {
  const { character, loading, error } = useCharacter(id);

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!character) return <NotFound />;

  return <CharacterSheet character={character} />;
}
```

---

[Continue for other patterns: Compound Components, Render Props if used, etc.]

## State Management

### Global State (Zustand)
**Store Structure**:
```typescript
interface AppState {
  user: User | null;
  activeCharacter: Character | null;
  diceRollHistory: DiceRoll[];
  setUser: (user: User | null) => void;
  setActiveCharacter: (character: Character | null) => void;
  addDiceRoll: (roll: DiceRoll) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  activeCharacter: null,
  diceRollHistory: [],
  setUser: (user) => set({ user }),
  setActiveCharacter: (character) => set({ activeCharacter: character }),
  addDiceRoll: (roll) => set((state) => ({ 
    diceRollHistory: [roll, ...state.diceRollHistory] 
  })),
}));
```

**Usage**:
```tsx
function CharacterSelector() {
  const activeCharacter = useStore((state) => state.activeCharacter);
  const setActiveCharacter = useStore((state) => state.setActiveCharacter);

  return (
    <select 
      value={activeCharacter?.id} 
      onChange={(e) => setActiveCharacter(characters.find(c => c.id === e.target.value))}
    >
      {/* options */}
    </select>
  );
}
```

### Local State Patterns
```tsx
// Simple state
const [count, setCount] = useState(0);

// Complex state with useReducer
const [state, dispatch] = useReducer(characterReducer, initialState);

// State with lazy initialization
const [data, setData] = useState(() => expensiveComputation());
```

### Server State (React Query example)
```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

function CharacterList() {
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.getCharacters(),
  });

  const createMutation = useMutation({
    mutationFn: api.createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });

  // Component logic...
}
```

## Routing

### Route Configuration
```tsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'characters', element: <CharacterList /> },
      { path: 'characters/:id', element: <CharacterDetail /> },
      { path: 'dice-roller', element: <DiceRoller /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
```

### Protected Route Pattern
```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Usage in routes
{
  path: 'characters',
  element: <ProtectedRoute><CharacterList /></ProtectedRoute>
}
```

### Navigation Patterns
```tsx
import { useNavigate, Link } from 'react-router-dom';

// Programmatic navigation
const navigate = useNavigate();
navigate('/characters/123');

// Declarative navigation
<Link to="/characters/123">View Character</Link>
```

## Form Handling

### Form Pattern (React Hook Form)
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { characterSchema } from '@/schemas';

function CharacterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
  });

  const onSubmit = async (data: CharacterFormData) => {
    await api.createCharacter(data);
    navigate('/characters');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <select {...register('metatype')}>
        <option value="human">Human</option>
        {/* more options */}
      </select>
      {errors.metatype && <span>{errors.metatype.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Character'}
      </button>
    </form>
  );
}
```

### Validation Integration
```tsx
// Schema defined with Zod
import { z } from 'zod';

export const characterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  metatype: z.enum(['human', 'elf', 'dwarf', 'ork', 'troll']),
  attributes: z.object({
    body: z.number().int().min(1).max(6),
    // ... more attributes
  }),
});

export type CharacterFormData = z.infer<typeof characterSchema>;
```

## API Integration

### API Client Setup
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Pattern
```typescript
// services/characters.ts
import api from './api';
import { Character, CreateCharacterDTO } from '@/types';

export const characterService = {
  getAll: async (): Promise<Character[]> => {
    const response = await api.get('/characters');
    return response.data;
  },

  getById: async (id: string): Promise<Character> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  create: async (data: CreateCharacterDTO): Promise<Character> => {
    const response = await api.post('/characters', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Character>): Promise<Character> => {
    const response = await api.patch(`/characters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/characters/${id}`);
  },
};
```

### Loading and Error States
```tsx
function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    characterService.getAll()
      .then(setCharacters)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {characters.map(char => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </div>
  );
}
```

## Styling

### Tailwind CSS Approach
```tsx
// Utility-first styling
function Button({ variant = 'primary', children }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

### Theme Configuration
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        shadowrun: {
          neon: '#00ff41',
          dark: '#0a0e27',
          cyber: '#7c3aed',
        },
      },
    },
  },
};
```

### Component Styling Pattern
```tsx
// Using Tailwind with conditional classes
function CharacterCard({ character, isActive }: CharacterCardProps) {
  return (
    <div className={`
      p-4 rounded-lg border-2 transition-all
      ${isActive ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-400'}
    `}>
      <h3 className="text-xl font-bold">{character.name}</h3>
      <p className="text-gray-600">{character.metatype}</p>
    </div>
  );
}
```

## Common Components

### Button Component
**Purpose**: Reusable button with variants

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
```

**Implementation**:
```tsx
export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`button button-${variant} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};
```

**Usage**:
```tsx
<Button variant="primary" onClick={handleSave}>
  Save Character
</Button>

<Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>
  Delete
</Button>
```

---

### Modal Component
[Similar detailed documentation for Modal, Input, Select, etc.]

---

## Custom Hooks

### useCharacter Hook
**Purpose**: Fetch and manage a single character's data

**Signature**:
```typescript
function useCharacter(id: string): {
  character: Character | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

**Implementation**:
```typescript
export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCharacter = useCallback(async () => {
    try {
      setLoading(true);
      const data = await characterService.getById(id);
      setCharacter(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  return { character, loading, error, refresh: fetchCharacter };
}
```

**Usage**:
```tsx
function CharacterProfile({ id }: { id: string }) {
  const { character, loading, error, refresh } = useCharacter(id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refresh} />;
  if (!character) return <NotFound />;

  return <CharacterSheet character={character} />;
}
```

---

### useDiceRoll Hook
[Similar detailed documentation for other custom hooks]

---

## TypeScript Patterns

### Type Definitions
```typescript
// Entity types
export interface Character {
  id: string;
  name: string;
  metatype: Metatype;
  attributes: Attributes;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

// Enum types
export type Metatype = 'human' | 'elf' | 'dwarf' | 'ork' | 'troll';

// Utility types
export type CreateCharacterDTO = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCharacterDTO = Partial<CreateCharacterDTO>;

// Generic props
export interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}
```

### Type Composition
```typescript
// Extending interfaces
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Character extends BaseEntity {
  name: string;
  metatype: Metatype;
  // ... other fields
}

// Union types
type DiceRollResult = SuccessRoll | GlitchRoll | CriticalGlitchRoll;

// Discriminated unions
type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

## Error Handling

### Error Boundary
```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Try-Catch Pattern
```tsx
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await api.createCharacter(data);
    toast.success('Character created!');
    navigate('/characters');
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Failed to create character');
    } else {
      toast.error('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};
```

## Performance Optimization

### Memoization Patterns
```tsx
// React.memo for component
export const CharacterCard = React.memo(({ character }: Props) => {
  return <div>{/* ... */}</div>;
});

// useMemo for expensive calculations
function DiceRollDisplay({ rolls }: Props) {
  const totalHits = useMemo(() => {
    return rolls.filter(r => r >= 5).length;
  }, [rolls]);

  return <div>Hits: {totalHits}</div>;
}

// useCallback for stable function references
function CharacterList() {
  const handleSelect = useCallback((id: string) => {
    navigate(`/characters/${id}`);
  }, [navigate]);

  return characters.map(char => (
    <CharacterCard key={char.id} character={char} onSelect={handleSelect} />
  ));
}
```

### Code Splitting
```tsx
// Route-based code splitting
const CharacterDetail = lazy(() => import('./pages/CharacterDetail'));
const DiceRoller = lazy(() => import('./pages/DiceRoller'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/characters/:id" element={<CharacterDetail />} />
    <Route path="/dice-roller" element={<DiceRoller />} />
  </Routes>
</Suspense>
```

## Shadowrun-Specific Components

### Dice Roller Component
**Purpose**: Roll dice pools for Shadowrun checks

**Props**:
```typescript
interface DiceRollerProps {
  dicePool: number;
  threshold?: number;
  onRoll: (result: DiceRollResult) => void;
}
```

**Implementation**:
```tsx
export const DiceRoller: FC<DiceRollerProps> = ({ 
  dicePool, 
  threshold = 0, 
  onRoll 
}) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<DiceRollResult | null>(null);

  const handleRoll = () => {
    setRolling(true);
    
    // Simulate dice rolling animation
    setTimeout(() => {
      const rolls = Array.from({ length: dicePool }, () => 
        Math.floor(Math.random() * 6) + 1
      );
      
      const hits = rolls.filter(r => r >= 5).length;
      const ones = rolls.filter(r => r === 1).length;
      const isGlitch = ones > dicePool / 2;
      const isCriticalGlitch = isGlitch && hits === 0;
      
      const rollResult: DiceRollResult = {
        rolls,
        hits,
        threshold,
        success: hits >= threshold,
        glitch: isGlitch,
        criticalGlitch: isCriticalGlitch,
      };
      
      setResult(rollResult);
      setRolling(false);
      onRoll(rollResult);
    }, 1000);
  };

  return (
    <div className="dice-roller">
      <div className="dice-pool-display">
        <span>Dice Pool: {dicePool}</span>
        {threshold > 0 && <span>Threshold: {threshold}</span>}
      </div>
      
      <button 
        onClick={handleRoll} 
        disabled={rolling || dicePool === 0}
        className="roll-button"
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
      
      {result && (
        <DiceRollResult result={result} />
      )}
    </div>
  );
};
```

---

### Character Sheet Component
[Similar detailed documentation]

---

## Naming Conventions
- **Components**: PascalCase (CharacterSheet, DiceRoller)
- **Files**: PascalCase for components, camelCase for utilities
- **Props**: camelCase, callbacks prefixed with `on`
- **Handlers**: camelCase, prefixed with `handle`
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## Best Practices
- Always define TypeScript types for props
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Use composition over prop drilling
- Implement proper loading and error states
- Add meaningful error messages
- Use semantic HTML elements
- Ensure keyboard accessibility

## Anti-Patterns to Avoid
- Don't mutate state directly
- Avoid inline object/array creation in render (causes re-renders)
- Don't use array index as key in lists
- Avoid large component files (> 300 lines)
- Don't fetch data in render
- Avoid deeply nested components

## Recommendations for Refactor
1. **Implement comprehensive testing**: Add unit tests for hooks and components
2. **Improve accessibility**: Add ARIA labels, keyboard navigation
3. **Optimize bundle size**: Analyze and reduce unnecessary dependencies
4. **Add Storybook**: Component documentation and visual testing
5. **Implement error tracking**: Sentry or similar for production errors
6. **Add performance monitoring**: Measure and optimize render performance
7. **Standardize loading states**: Create consistent loading UI patterns
8. **Improve type safety**: Eliminate any `any` types, add stricter checks
```

## Additional Notes
- Include realistic code examples for all patterns
- Show both simple and complex examples
- Document any workarounds or hacks
- Note inconsistencies in patterns across the codebase
- Flag deprecated patterns or components
- Highlight performance bottlenecks
- Document any third-party component library integrations

---

**Output File**: Save the complete documentation to `/docs/claude/frontend-patterns.md`