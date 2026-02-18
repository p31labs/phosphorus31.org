# Wonky Sprout - Copilot Instructions

## Project Overview
Wonky Sprout is a Resilience Fireteam platform for neurodivergent adults in transition.
Built with Next.js 15, TypeScript, Firebase, Zustand, Tailwind CSS.

## Critical Context from Research
- 4-person support pods based on tetrahedron geometry (K4 graph)
- MUST include Fifth Element Protocol (AI tie-breaker for 2v2 deadlocks)
- Target users: neurodivergent adults (ADHD/Autism) in crisis (divorce, grief, diagnosis)
- Positioning: "Tactical Fireteam" not "therapy group"

## Architecture Principles
1. Tetrahedron data model (4 nodes, 6 edges, always)
2. Feature flags for v2/v3 (solo mode vs multi-tetrahedron)
3. Mobile-first, one-thumb navigation (bottom 2/3 of screen only)
4. Dark mode default (accessibility critical)
5. Dysregulation-proof (must work when user is overwhelmed)
6. Status Board > Chat (passive presence, not conversation demand)

## Code Style
- TypeScript strict mode (never use `any`)
- Functional components only
- Server components by default ('use client' only when needed)
- Tailwind for all styling (no separate CSS files)
- Zustand for state (NOT Context API)
- Import order: React → Next → External → Internal → Types

## Component Patterns
- One component per file
- Props interface defined above component
- Export at bottom of file
- Keep under 200 lines (split if larger)
- Composition over prop drilling
- Min 44px touch targets for ALL interactive elements

## Naming
- Components: PascalCase (Button.tsx)
- Utils: camelCase (formatDate.ts)
- Types: PascalCase (User, Tetrahedron)
- Files: kebab-case for non-components (user-slice.ts)

## Data Flow
- Firestore for persistence
- Zustand for client state
- Server components fetch data
- Client components handle interaction
- Optimistic updates where possible

## AI Integration
- All AI calls through /api/ai/* routes
- Use structured JSON output
- Fifth Element tie-breaker built into Wonky AI
- Guardian Node sentiment analysis
- Rate limiting (5/day free tier, unlimited pro)

## Accessibility (NON-NEGOTIABLE)
- 44px minimum touch target
- Semantic HTML always
- ARIA labels where needed
- Keyboard navigation support
- High contrast mode support
- Screen reader tested
- Works when user is dysregulated

## Common Patterns

### API Route
```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // validate, process, return
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Component
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'large' | 'medium' | 'small';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'large'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-h-[44px] rounded-lg font-medium transition-colors",
        size === 'large' && "h-20 px-6 text-lg w-full",
        size === 'medium' && "h-16 px-4",
        size === 'small' && "h-11 px-3 text-sm",
        variant === 'primary' && "bg-teal-500 hover:bg-teal-600",
        variant === 'secondary' && "bg-gray-700 hover:bg-gray-600",
        variant === 'ghost' && "bg-transparent hover:bg-gray-800"
      )}
    >
      {children}
    </button>
  );
}
```

### Zustand Store Slice
```typescript
interface UserSlice {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  loadUser: async () => {
    set({ loading: true });
    const user = await fetchCurrentUser();
    set({ user, loading: false });
  },
});
```

## Key Features

### Fifth Element Protocol
When protocol voting splits 2v2:
- Detect deadlock automatically
- Call Gemini with context
- Provide objective tie-breaking suggestions
- Never force decision, always suggest

### Status Board (not Chat)
Primary interface uses passive toggles:
- "Overwhelmed"
- "Focusing"
- "Need Body Double"
- "Crisis"
Users update status, pod sees it, no conversation required.

### Guardian Node
AI monitors pod health:
- Sentiment analysis on messages
- Detects isolation language
- Alerts when multi-node stressed
- Suggests professional intervention if needed

## Remember
- App must work when user is dysregulated
- Simplicity > features always
- Clarity > cleverness always
- Accessibility is not optional
- Dark mode is default
- One-thumb navigation required
- Tetrahedron geometry in all data models
- Fifth Element Protocol is core, not addon

## When to Ask
- Architecture decisions
- Breaking changes
- Security concerns
- Performance issues

## What You Decide
- Implementation details
- Styling within design system
- Utility functions
- Error messages
- Loading states
