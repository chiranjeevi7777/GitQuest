# GitQuest — Complete Audit & Redesign Plan

---

## PART 1: PROJECT AUDIT

### 1.1 Architecture Overview (Current)

```
src/
├── App.tsx                    # Minimal shell → GameLayout
├── main.tsx                   # Entry point
├── index.css                  # Design system (Cyberpunk)
├── game.css                   # Game-specific animations
├── types/index.ts             # All types in one file
├── stores/gameStore.ts        # Single monolithic Zustand store
├── engine/gitEngine.ts        # Client-side Git simulator
├── data/
│   ├── worlds.ts              # 6 worlds, 9 total missions
│   ├── npcs.ts                # 6 NPCs
│   └── achievements.ts        # 12 achievements
├── components/
│   ├── layout/                # GameLayout, Sidebar, TopBar
│   ├── views/                 # WorldMap, Mission, Achievements, Settings
│   ├── game/                  # Terminal, Dialogue, Objectives, GitGraph, etc.
│   └── ui/                    # NotificationStack only
```

**Tech Stack**: React 19 + TypeScript + Vite 8 + Tailwind v4 + Zustand + Framer Motion + Lucide Icons

---

### 1.2 Current Strengths

| # | Strength | Details |
|---|----------|---------|
| 1 | **Solid foundation** | React + Zustand + Framer Motion is a great stack for a game UI |
| 2 | **Good type definitions** | Player, World, Mission, NPC, Achievement, Inventory types are well-structured |
| 3 | **Persistent state** | Zustand `persist` middleware saves player progress to localStorage |
| 4 | **Git engine concept** | Client-side Git simulator with validation is a clever approach |
| 5 | **Dialogue system** | Typewriter effect, NPC avatars, progress dots work well |
| 6 | **Notification system** | Toast notifications with auto-dismiss and animations |
| 7 | **XP/Level progression** | XP thresholds, titles, level-up notifications exist |
| 8 | **World map with connections** | SVG connector lines between world nodes with unlock flow |
| 9 | **Mission briefing overlay** | Full-screen modal with narrative, objectives preview, NPC intro |
| 10 | **Objective validation** | Each objective has a `validationType` checked against engine state |

---

### 1.3 Current Weaknesses

#### 🔴 Critical Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Fake Git engine** | The `GitEngine` class simulates Git in-memory — it doesn't run real Git. This undermines the entire learning premise. |
| 2 | **Only 9 missions total** | 6 worlds but only 9 missions. Worlds 3-6 have just 1 mission each. Players finish in ~15 minutes. |
| 3 | **Cyberpunk theme is intimidating** | Dark void backgrounds, neon glows, Orbitron font, scanlines — looks like a hacker tool, not a beginner-friendly game. |
| 4 | **No onboarding** | App drops you on a world map with no tutorial, no character creation, no story intro. |
| 5 | **`completeObjective` is a no-op** | Lines 209-223 of `gameStore.ts` — the function returns `state` unchanged. Objectives are tracked only in `MissionView` local state. |
| 6 | **Settings toggles don't work** | Sound, animations, font size sliders are visual-only — they have no `onChange` handlers. |
| 7 | **No routing** | `react-router-dom` is installed but never used. Navigation is manual state switching. |

#### 🟡 Gameplay Issues

| # | Issue | Details |
|---|-------|---------|
| 8 | **Linear progression only** | Must complete worlds 1→2→3→4→5→6 in order. No side quests, no exploration. |
| 9 | **No coins/currency** | XP exists but no economy. Nothing to spend. |
| 10 | **Inventory system unused** | `InventoryItem` type exists, `inventory: []` in player, but no items are ever granted. |
| 11 | **Achievements never trigger** | `unlockAchievement` exists but is never called from game logic. |
| 12 | **Streak is hardcoded to 1** | `streak: 1` in initial state, never incremented. |
| 13 | **No Playground mode** | No way to freely experiment with Git outside of missions. |
| 14 | **No skill tree** | `'skill-tree'` is a valid `GameView` but no component renders it. |
| 15 | **Terminal is basic HTML input** | Not using the installed xterm.js despite it being a dependency. |

#### 🟠 UX Issues

| # | Issue | Details |
|---|-------|---------|
| 16 | **World map positioning is awkward** | Nodes use absolute `%` positioning — they overlap on small screens. |
| 17 | **No mobile responsiveness** | Fixed sidebar, hardcoded widths (`w-[72px]`, `w-[380px]`, `w-[300px]`). |
| 18 | **No loading states** | No skeleton screens, no spinners, no error boundaries. |
| 19 | **No accessibility** | No ARIA labels, no keyboard navigation, no focus management, no skip links. |
| 20 | **`dangerouslySetInnerHTML` in terminal** | XSS vulnerability in `GameTerminal.tsx` line 124. |
| 21 | **GitGraph polls every 500ms** | `setInterval` in `GitGraphPanel.tsx` is wasteful — should use the engine's `onStateChange` callback. |
| 22 | **No "return to world map" after mission complete** | Mission complete overlay has no button — it auto-navigates after 1.5s with no user control. |

#### 🔵 Code Quality Issues

| # | Issue | Details |
|---|-------|---------|
| 23 | **Monolithic store** | Single 350-line Zustand store handles player, view, terminal, git, dialogue, hints, timer. Should be split. |
| 24 | **Types in one file** | All types crammed into `types/index.ts`. Should be co-located or split by domain. |
| 25 | **XP_PER_LEVEL duplicated** | Defined in both `gameStore.ts` (line 11) and `TopBar.tsx` (line 5). |
| 26 | **No tests** | Zero test files in the entire project. |
| 27 | **No error boundaries** | A crash in any component takes down the entire app. |
| 28 | **Unused dependencies** | `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-web-links` are installed but unused. |

---

### 1.4 Quick Wins (Can fix in 1-2 hours each)

1. **Fix settings toggles** — Add `onChange` handlers to sound/animation/font toggles
2. **Fix `completeObjective`** — Actually update state when objectives complete
3. **Wire up achievement triggers** — Call `unlockAchievement` from `completeMission`
4. **Replace `dangerouslySetInnerHTML`** — Parse ANSI codes safely with a React component
5. **Fix GitGraph polling** — Use `onStateChange` callback instead of `setInterval`
6. **Add auto-return after mission complete** — Show a "Return to Map" button
7. **Extract `XP_PER_LEVEL` to a shared constant** — Remove duplication
8. **Add `<title>` updates per view** — Dynamic document title
9. **Add error boundary wrapper** — Catch crashes gracefully
10. **Add keyboard shortcut for hints** — `H` key triggers hint

---

## PART 2: REDESIGN PLAN

### 2.1 Theme Transformation

| Aspect | Current (Cyberpunk) | Redesign (Cartoon Adventure) |
|--------|---------------------|------------------------------|
| **Background** | `#0a0a0f` void black | Soft sky gradients, pastel landscapes |
| **Palette** | Neon cyan/pink/green | Warm earth tones + vibrant accents |
| **Typography** | Orbitron (cold, robotic) | Nunito/Quicksand (friendly, rounded) |
| **Panels** | Glass morphism + scanlines | Paper/parchment cards with soft shadows |
| **Icons** | Lucide (thin lines) | Custom illustrated + emoji characters |
| **Terminal** | Hacker aesthetic | Cozy "magic scroll" terminal |
| **Mood** | Intimidating, dark | Inviting, warm, whimsical |

#### New Color Palette

```
Primary:    #4A90D9  (Friendly Blue)
Secondary:  #7C5CBF  (Magic Purple)
Accent:     #F5A623  (Golden Star)
Success:    #7ED321  (Fresh Green)
Danger:     #E85D75  (Soft Red)
Background: #F0EDE5  (Warm Parchment)
Dark BG:    #2D2B3D  (Cozy Night)
Card:       #FFFFFF  (Clean White)
Text:       #3D3852  (Soft Dark)
Muted:      #9B97A8  (Gentle Gray)
```

#### New Fonts
```
Display:  "Quicksand", sans-serif  (headings, game UI)
Body:     "Nunito", sans-serif     (readable body text)
Mono:     "Fira Code", monospace   (terminal, code)
```

---

### 2.2 Expanded World Map (6 → 12 Regions)

| # | World | Theme | Git Concepts | Missions |
|---|-------|-------|-------------|----------|
| 1 | **Repository Village** | Cozy starting village | init, status, add, commit, log | 5 |
| 2 | **Branch Forest** | Enchanted forest with forking paths | branch, checkout, switch | 4 |
| 3 | **Merge Meadows** | Rolling hills where paths converge | merge, fast-forward, 3-way merge | 3 |
| 4 | **Conflict Volcano** | Active volcano with clashing forces | merge conflicts, resolution | 3 |
| 5 | **Remote Harbor** | Seaside port connecting distant lands | remote, push, pull, fetch, clone | 4 |
| 6 | **GitHub City** | Bustling metropolis | fork, PR, issues, actions | 4 |
| 7 | **Stash Caverns** | Underground caves with hidden treasures | stash, stash pop, stash list | 3 |
| 8 | **Rebase Temple** | Ancient temple of rewriting history | rebase, interactive rebase | 3 |
| 9 | **Cherry Pick Orchard** | Magical orchard | cherry-pick, selective commits | 2 |
| 10 | **History Cave** | Time-travel cave | reflog, reset, revert, bisect | 4 |
| 11 | **Hook Laboratory** | Mad-scientist lab | hooks, pre-commit, CI/CD | 3 |
| 12 | **Open Source Academy** | Grand academy (endgame) | full workflows, best practices | 3 |
| | | | **Total** | **~41 missions** |

---

### 2.3 NPC System (6 → 12+ Characters)

| NPC | Location | Role | Personality | Teaches |
|-----|----------|------|-------------|---------|
| Elder Init 🧙 | Repository Village | Village Elder | Wise, patient | Basics |
| Captain Branch 🌿 | Branch Forest | Forest Ranger | Adventurous | Branching |
| Forge Master ⚒️ | Merge Meadows | Blacksmith | Practical, gruff | Merging |
| Ember the Dragon 🐉 | Conflict Volcano | Guardian | Fierce but fair | Conflicts |
| Captain Harbor ⚓ | Remote Harbor | Ship Captain | Well-traveled | Remotes |
| Mayor Octocat 🐙 | GitHub City | Mayor | Community-driven | GitHub |
| Mole Stasher 🦔 | Stash Caverns | Treasure Hunter | Secretive | Stash |
| Sensei Rebase 🦊 | Rebase Temple | Monk | Disciplined | Rebase |
| Farmer Cherry 🍒 | Cherry Pick Orchard | Farmer | Selective, careful | Cherry-pick |
| Professor Reflog 🦉 | History Cave | Historian | Eccentric | History |
| Dr. Hook 🔬 | Hook Laboratory | Scientist | Inventive | Automation |
| Dean Open 📚 | Open Source Academy | Dean | Inspiring | Workflows |

---

### 2.4 New Game Systems

#### A. Reward Economy
```
Coins (earned per mission, spent in shop)
Gems (rare currency from boss fights / achievements)
XP (progression)
Collectible Cards (one per Git concept — 50+ total)
```

#### B. Character Customization
```
- Choose avatar appearance (hat, outfit colors)
- Unlock titles ("Branch Explorer", "Merge Master", "Conflict Resolver")
- Earn badges displayed on profile
- Pet companions (unlocked via achievements)
```

#### C. Skill Tree (3 branches)
```
🌲 Explorer     → World navigation bonuses, reveal hidden areas
⚔️ Commander    → Better hints, command autocomplete
📚 Scholar      → Lore entries, bonus XP from reading docs
```

#### D. Daily/Weekly Systems
```
- Daily Challenge: A random mini-mission with bonus XP
- Weekly Quest: Multi-step quest chain across worlds
- Login Streak: Escalating daily rewards (coins + gems)
```

#### E. Achievement System (12 → 50+)
```
Categories: Progression, Speed, Mastery, Collection, Secret
Rarity tiers: Common → Rare → Epic → Legendary → Mythic
Each achievement grants: XP bonus + Title + sometimes Cosmetic
```

---

### 2.5 Git Playground Architecture

The Playground is a **free-form sandbox** independent of missions.

```
┌─────────────────────────────────────────────────────┐
│                  PLAYGROUND SHELL                    │
├───────────┬──────────────────────┬──────────────────┤
│ File      │   Visual Commit      │   Terminal       │
│ Explorer  │   Graph (animated)   │   (real or sim)  │
│           │                      │                  │
│ 📁 src/   │   ● ── ● ── ●       │   $ git init     │
│ 📁 docs/  │        \    /        │   $ touch f.txt  │
│ 📄 readme │         ● ●         │   $ git add .    │
│           │          \           │   $ git commit   │
│           │           ●          │                  │
├───────────┴──────────────────────┴──────────────────┤
│  Branch Bar: [main] [feature] [bugfix]  + New       │
├─────────────────────────────────────────────────────┤
│  Status: On branch main | 2 staged | 1 untracked   │
└─────────────────────────────────────────────────────┘
```

**Playground Features:**
- Multiple sandbox repositories (create/delete/reset)
- Visual commit graph that updates in real-time
- File explorer showing working directory
- Branch visualizer with drag-and-merge
- Command history with replay
- Templates: "Start from merge conflict", "Start with 3 branches", etc.
- Challenge Mode: Timed puzzles ("Create this graph shape in 60 seconds")

---

## PART 3: TECHNICAL ARCHITECTURE

### 3.1 Recommended Folder Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── Router.tsx                  # React Router setup
│   └── providers/
│       ├── GameProvider.tsx
│       └── ThemeProvider.tsx
├── assets/
│   ├── images/                    # Character sprites, backgrounds
│   ├── icons/                     # Custom game icons
│   └── sounds/                    # (hooks for future audio)
├── components/
│   ├── ui/                        # Button, Card, Badge, Toggle, Modal, etc.
│   ├── layout/                    # Shell, Sidebar, TopBar, BottomNav
│   ├── game/                      # Terminal, Dialogue, GitGraph, WorldNode
│   ├── playground/                # PlaygroundShell, FileExplorer, CommitGraph
│   └── common/                    # ErrorBoundary, LoadingSpinner, etc.
├── views/                         # Full-page views (one per route)
│   ├── WorldMapView.tsx
│   ├── MissionView.tsx
│   ├── PlaygroundView.tsx
│   ├── AchievementsView.tsx
│   ├── ProfileView.tsx
│   ├── ShopView.tsx
│   ├── SkillTreeView.tsx
│   └── SettingsView.tsx
├── stores/                        # Split Zustand stores
│   ├── playerStore.ts             # XP, level, inventory, achievements
│   ├── gameStore.ts               # View state, active mission, dialogue
│   ├── gitStore.ts                # Git engine state, commits, branches
│   └── playgroundStore.ts         # Sandbox repositories, playground state
├── engine/
│   ├── gitEngine.ts               # Improved Git simulator
│   ├── gitValidator.ts            # Objective validation logic
│   └── gitParser.ts               # ANSI parser, command parser
├── data/
│   ├── worlds/                    # One file per world
│   │   ├── repositoryVillage.ts
│   │   ├── branchForest.ts
│   │   └── ...
│   ├── npcs.ts
│   ├── achievements.ts
│   ├── items.ts
│   ├── skillTree.ts
│   └── constants.ts               # XP thresholds, titles, shared config
├── hooks/
│   ├── useGitEngine.ts
│   ├── useMission.ts
│   ├── useDialogue.ts
│   └── useKeyboardShortcuts.ts
├── lib/
│   ├── ansiParser.ts              # Safe ANSI → React elements
│   ├── storage.ts                 # LocalStorage helpers
│   └── utils.ts
├── types/
│   ├── player.ts
│   ├── world.ts
│   ├── mission.ts
│   ├── git.ts
│   └── index.ts                   # Re-exports
└── styles/
    ├── index.css                  # Design tokens + base styles
    ├── game.css                   # Game-specific animations
    └── playground.css             # Playground-specific styles
```

### 3.2 Store Architecture (Split)

```typescript
// playerStore.ts — Player progression only
interface PlayerState {
  player: Player;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  addToInventory: (item: InventoryItem) => void;
  spendCoins: (amount: number) => boolean;
  incrementStreak: () => void;
}

// gameStore.ts — View/navigation state only
interface GameState {
  currentView: GameView;
  selectedWorldId: string | null;
  activeMissionId: string | null;
  notifications: GameNotification[];
  setView: (view: GameView) => void;
  startMission: (id: string) => void;
}

// gitStore.ts — Git engine state only
interface GitState {
  engine: GitEngine;
  commits: CommitEntry[];
  branches: string[];
  currentBranch: string;
  executeCommand: (input: string) => CommandResult;
}
```

### 3.3 Key Technical Improvements

| # | Area | Change |
|---|------|--------|
| 1 | **Routing** | Use `react-router-dom` with proper routes (`/map`, `/mission/:id`, `/playground`, `/achievements`, `/settings`) |
| 2 | **Error Boundaries** | Wrap each view in an error boundary with fallback UI |
| 3 | **Accessibility** | Add ARIA labels, focus trapping in modals, keyboard nav, skip links, color contrast AA |
| 4 | **Safe terminal output** | Replace `dangerouslySetInnerHTML` with a safe ANSI parser component |
| 5 | **Git engine callbacks** | Use the existing `onStateChange` callback instead of polling |
| 6 | **Responsive design** | Mobile-first layout, collapsible sidebar, bottom nav on mobile |
| 7 | **Code splitting** | Lazy-load views with `React.lazy` + `Suspense` |
| 8 | **Testing** | Add Vitest for unit tests, Playwright for E2E |
| 9 | **Performance** | Memoize world/mission lookups, virtualize long lists |
| 10 | **xterm.js** | Actually use the installed xterm.js for a proper terminal experience |

---

## PART 4: IMPLEMENTATION ROADMAP

### Phase 1: Foundation Fix (Week 1)
> Fix critical bugs in existing code without visual changes

- [x] Fix `completeObjective` no-op in gameStore
- [x] Fix settings toggles (add onChange handlers)
- [x] Wire achievement triggers to game events
- [x] Replace `dangerouslySetInnerHTML` with safe ANSI parser
- [x] Fix GitGraph polling → use onStateChange callback
- [x] Extract shared constants (XP_PER_LEVEL, TITLES)
- [x] Add error boundary wrapper
- [x] Add mission complete "Return to Map" button

### Phase 2: Architecture Refactor (Week 2)
> Split stores, add routing, improve folder structure

- [x] Split monolithic store into playerStore, gameStore, gitStore
- [x] Set up React Router with proper routes
- [x] Reorganize folder structure (co-locate types, split world data)
- [x] Create reusable UI component library (Button, Card, Badge, Toggle, Modal)
- [x] Add custom hooks (useGitEngine, useMission, useDialogue)
- [x] Add keyboard shortcuts system
- [x] Add basic Vitest test setup

### Phase 3: Visual Redesign (Week 3)
> Transform from cyberpunk to cartoon adventure

- [x] Replace color palette (dark neon → warm cartoon)
- [x] Replace fonts (Orbitron → Quicksand/Nunito)
- [x] Redesign glass panels → paper/card components
- [x] Create illustrated world map (canvas or SVG-based)
- [x] Design NPC character cards with speech bubbles
- [x] Redesign terminal as "magic scroll" with friendly theme
- [x] Add responsive layout (mobile bottom nav, collapsible sidebar)
- [x] Generate character illustrations with AI image tool

### Phase 4: Content Expansion (Weeks 4-5)
> Expand from 9 missions to 40+

- [ ] Write missions for all 12 worlds (see Section 2.2)
- [ ] Create 12+ NPC characters with unique dialogue
- [ ] Design 50+ achievements across 5 categories
- [ ] Create collectible card system (one per Git concept)
- [ ] Add item/reward drops per mission
- [ ] Add boss fight mechanics (timed challenges, multi-objective)

### Phase 5: New Game Systems (Weeks 5-6)
> Add depth to gameplay loop

- [ ] Implement coin/gem economy + shop
- [ ] Build skill tree UI and logic
- [ ] Add daily challenge system
- [ ] Add character customization (avatar, titles, badges)
- [ ] Implement streak tracking with daily rewards
- [ ] Add world completion percentages and statistics

### Phase 6: Git Playground (Weeks 7-8)
> Build the sandbox environment

- [ ] Design Playground layout (file explorer + graph + terminal)
- [ ] Build visual commit graph renderer (animated, interactive)
- [ ] Add file explorer component
- [ ] Add branch visualizer with branch bar
- [ ] Add sandbox repository management (create, reset, delete)
- [ ] Add playground templates ("merge conflict", "3 branches", etc.)
- [ ] Add challenge mode (timed graph puzzles)

### Phase 7: Polish & Ship (Week 9)
> Production readiness

- [ ] Add onboarding flow (character creation, story intro, tutorial)
- [ ] Add loading states and skeleton screens
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Performance optimization (code splitting, memoization)
- [ ] Add SEO meta tags per route
- [ ] E2E tests for critical paths
- [ ] Deploy to production

---

## PART 5: DELIVERABLES CHECKLIST

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Complete project audit | ✅ Above |
| 2 | UX audit | ✅ Section 1.3 |
| 3 | Gameplay audit | ✅ Section 1.3 (Gameplay Issues) |
| 4 | UI redesign plan | ✅ Section 2.1 |
| 5 | New architecture recommendations | ✅ Section 3.1-3.3 |
| 6 | New game systems | ✅ Section 2.4 |
| 7 | Expanded mission system | ✅ Section 2.2 |
| 8 | Expanded world map | ✅ Section 2.2 (12 regions) |
| 9 | Playground architecture | ✅ Section 2.5 |
| 10 | Character system | ✅ Section 2.3, 2.4B |
| 11 | Reward system | ✅ Section 2.4A |
| 12 | Achievement system | ✅ Section 2.4E |
| 13 | Progression redesign | ✅ Section 2.4C (Skill Tree) |
| 14 | Component redesign | ✅ Section 3.1 (folder structure) |
| 15 | Folder improvements | ✅ Section 3.1 |
| 16 | Performance improvements | ✅ Section 3.3 |
| 17 | Accessibility improvements | ✅ Section 3.3 #3 |
| 18 | Production implementation plan | ✅ Section 4 (7-phase roadmap) |
