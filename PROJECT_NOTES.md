# LockBench Project Notes

## Overview

LockBench is a visual benchmark/game for testing LLM agents' ability to solve interconnected puzzle locks. The UI displays an AI agent's progress through a series of mathematical locks, showing real-time context window usage and console output.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI**: AI SDK v5 (for future agent integration)

## Key Discovery: Tailwind CSS v4 Configuration

**IMPORTANT**: This project uses Tailwind CSS v4, which has different configuration than v3.

In `globals.css`, you MUST use:
```css
@import "tailwindcss";
```

NOT the old v3 syntax:
```css
/* WRONG - v3 syntax that breaks v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Using the old syntax will cause many Tailwind utilities to fail silently (e.g., `rounded-xl` won't render rounded corners).

## Component Architecture

### Active Components (in use)

#### `src/components/game-card.tsx`
Main reusable card component for displaying agent progress. Uses CSS Grid layout.
- **Props**: agentName, lockState, lockName, contextPercentage, totalTokens, consoleLines, locks, avatarColor, highlightColor
- **Layout**: 2-column top row (lock visual + dependency graph), full-width stats, full-width console

#### `src/components/dependency-graph.tsx`
Displays the puzzle room lock dependency graph with three visual states:
1. **locked**: Gray border, gray lock icon (prerequisites not met)
2. **solved**: Highlighted border, unlock icon (completed)
3. **active**: Highlighted border, avatar icon (currently being worked on)

#### `src/components/console-output.tsx`
Terminal-style output display with color-coded line types:
- `tool-call`: Cyan
- `tool-result`: Yellow
- `success`: Green
- `error`: Red
- `thinking`: Purple
- `text`: White

#### `src/components/context-window.tsx`
Displays context window usage with segmented equalizer bar.
- Can accept direct `percentage` and `totalTokens` props
- Or calculate from `historyLength`

#### `src/components/tui/lock-visual.tsx`
Large pixel art lock display (locked/unlocked states).

#### `src/components/tui/block-renderer.tsx`
Generic pixel art renderer using palette IDs.

#### `src/components/pixel-lock.tsx`
Smaller pixel art icons for various lock types and avatar.

### Reference Component (not in current use)

#### `src/components/agent-dashboard.tsx`
Full dashboard with game engine integration and AI agent loop.
- Contains useful patterns for connecting to AI via server actions
- Has auto-play functionality for AI agents
- Uses GameEngine class for game state management
- **Keep for reference** when adding actual game logic to GameCard

## Game Engine

`src/lib/game-engine.ts` contains:
- Lock definitions and dependencies
- Tool system (inspect, attempt, peer, etc.)
- Game state management
- Validation logic

### Lock Dependencies
```
Victorian → Chinese → Japanese
    ↓
Medieval → Digital → Library
                        ↓
                      Vault (requires all locks)
```

## File Organization

```
src/
├── app/
│   ├── globals.css      # Tailwind v4 imports + CSS variables
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main page rendering GameCard
│   └── actions/
│       └── agent.ts     # Server action for AI generation
├── components/
│   ├── game-card.tsx    # Main reusable card component
│   ├── console-output.tsx
│   ├── context-window.tsx
│   ├── dependency-graph.tsx
│   ├── pixel-lock.tsx
│   ├── agent-dashboard.tsx  # Reference: has game logic integration
│   ├── tui/
│   │   ├── lock-visual.tsx
│   │   └── block-renderer.tsx
│   └── ui/              # shadcn/ui components
└── lib/
    ├── game-engine.ts   # Game logic
    └── utils.ts         # Utility functions
```

## CSS Variables

Defined in `globals.css`:
```css
--background: #131313
--foreground: #e5e5e5
--accent-orange: #D98368
--accent-green: #4caf50
--border-dashed: #D98368
--pixel-off: #333
--pixel-on: #e5e5e5
```

## Customization

### Agent Colors
GameCard supports `avatarColor` and `highlightColor` props for multi-model comparison:
```tsx
// Claude (coral)
<GameCard avatarColor="#ff8c69" highlightColor="#D98368" />

// Gemini (blue)
<GameCard avatarColor="#0053D6" highlightColor="#4285F4" />

// GPT (green)
<GameCard avatarColor="#10a37f" highlightColor="#19c37d" />
```

## TODO / Future Work

1. **Connect game logic to GameCard**: Wire up GameEngine to GameCard component
2. **AI agent integration**: Use server actions and AI SDK for agent moves
3. **Side-by-side comparison**: Layout for comparing multiple agents simultaneously
4. **Benchmark results**: Add scoring and timing metrics
5. **More lock types**: Add additional puzzle varieties

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Session Summary (Nov 26, 2025)

### Accomplished
- Created `GameCard` component with CSS Grid layout matching reference design
- Created `ConsoleOutput` component with typed, color-coded lines
- Enhanced `ContextWindow` to accept direct values (not just historyLength)
- Fixed Tailwind v4 configuration (changed from v3 directives to v4 import)
- Added three-state logic to `DependencyGraph` (locked/solved/active)
- Made avatar and highlight colors customizable props
- Updated `LockVisual` to remove redundant internal header

### Key Bug Fix
Tailwind utilities like `rounded-xl` weren't rendering because `globals.css` used outdated Tailwind v3 directives instead of the v4 `@import "tailwindcss"` syntax.
