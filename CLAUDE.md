# IronLog — Fitness Progressive Overload Tracker

React + TypeScript SPA with local-first storage. Dark theme. Four modules: Workout Tracker, Diary, AI Coach, Exercise Catalog.

## Tech Stack

- **Framework**: React 18 + TypeScript (strict mode, no `any`)
- **Build**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3 (utility classes only, no custom CSS files)
- **State**: Zustand for global state, React Hook Form for forms
- **Storage**: IndexedDB via Dexie.js (local-first, no backend)
- **Icons**: Lucide React
- **Animations**: Framer Motion (subtle, max 200ms transitions)
- **Linting**: ESLint + Prettier (run before every commit)
- **Testing**: Vitest + React Testing Library

## Commands

- `npm run dev` — Start dev server (port 5173)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run format` — Prettier format
- `npm run test` — Run Vitest
- `npm run preview` — Preview production build

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root component, router setup
│   └── main.tsx             # Entry point
├── components/
│   ├── ui/                  # Reusable primitives (Button, Input, Modal, Card, Badge, Tabs)
│   ├── layout/              # Shell, Sidebar, BottomNav, Header
│   ├── workout/             # Workout-specific components
│   ├── diary/               # Diary-specific components
│   ├── coach/               # AI Coach components
│   └── catalog/             # Exercise Catalog components
├── pages/
│   ├── WorkoutPage.tsx
│   ├── DiaryPage.tsx
│   ├── CoachPage.tsx
│   ├── CatalogPage.tsx
│   └── SettingsPage.tsx
├── stores/                  # Zustand stores (one per domain)
│   ├── workoutStore.ts
│   ├── diaryStore.ts
│   ├── coachStore.ts
│   └── catalogStore.ts
├── db/
│   ├── database.ts          # Dexie.js schema and DB instance
│   └── seed.ts              # Seed data for exercise catalog
├── types/
│   └── index.ts             # All TypeScript interfaces/types
├── utils/
│   └── index.ts             # Helpers (date formatting, calculations)
└── constants/
    └── index.ts             # App-wide constants, hardcoded coach responses
```

## Design System

### Theme — STRICTLY enforced

The entire app uses a dark theme. No light mode. No toggle.

| Token              | Value                  | Usage                          |
|--------------------|------------------------|--------------------------------|
| `bg-primary`       | `#0A0A0A`              | Page backgrounds               |
| `bg-surface`       | `#141414`              | Cards, panels                  |
| `bg-surface-alt`   | `#1E1E1E`              | Inputs, hover states           |
| `border-default`   | `#2A2A2A`              | All borders                    |
| `text-primary`     | `#F5F5F5`              | Headings, primary text         |
| `text-secondary`   | `#A0A0A0`              | Labels, secondary text         |
| `text-muted`       | `#666666`              | Placeholders, disabled         |
| `accent`           | `#FFFFFF`              | CTAs, active states, focus     |
| `accent-hover`     | `#E0E0E0`              | Hover on accent elements       |
| `success`          | `#22C55E`              | PR badges, positive trends     |
| `destructive`      | `#EF4444`              | Delete, warnings               |

Configure these as Tailwind `extend.colors` in `tailwind.config.ts`. Every component uses ONLY these tokens — no hardcoded hex values inline.

### Typography

- Font: `Inter` loaded from Google Fonts
- Page titles: `text-2xl font-bold text-primary`
- Section titles: `text-lg font-semibold text-primary`
- Body: `text-sm text-secondary`
- Captions: `text-xs text-muted`

### Component Patterns

- **Cards**: `bg-surface rounded-xl border border-default p-4`
- **Inputs**: `bg-surface-alt border border-default rounded-lg px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none`
- **Buttons (primary)**: `bg-accent text-black font-medium rounded-lg px-4 py-2 hover:bg-accent-hover transition-colors`
- **Buttons (ghost)**: `text-secondary hover:text-primary hover:bg-surface-alt rounded-lg px-3 py-2 transition-colors`
- **Modals**: Centered overlay with `bg-black/60` backdrop, `bg-surface rounded-2xl border border-default p-6 max-w-md w-full`
- Border radius: `rounded-lg` (8px) for controls, `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for modals
- Spacing: multiples of 4px only (`p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`)
- No shadows. Depth = border + background color difference only.

### Layout

- Mobile-first, max-width 480px centered on desktop
- Bottom navigation bar with 4 tabs: Workouts, Diary, Coach, Catalog
- Bottom nav: `fixed bottom-0 left-0 right-0 bg-surface border-t border-default h-16`
- Active tab icon/label: `text-accent`, inactive: `text-muted`
- Page content: `pb-20` to account for bottom nav
- No hamburger menus. No sidebars on mobile.

## Data Models

Define all types in `src/types/index.ts`:

```typescript
// === WORKOUT PLAN SYSTEM ===
interface WorkoutPlan {
  id: string;                // crypto.randomUUID()
  name: string;              // e.g. "Upper Lower Split"
  days: WorkoutDay[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkoutDay {
  id: string;
  name: string;              // e.g. "Upper A", "Lower B"
  exercises: PlannedExercise[];
  order: number;             // Display order within plan
}

interface PlannedExercise {
  id: string;
  exerciseId: string;        // References Exercise from catalog
  exerciseName: string;      // Denormalized for quick display
  sets: number;              // Target number of sets (e.g. 3)
  repRangeMin: number;       // e.g. 8
  repRangeMax: number;       // e.g. 12
  order: number;             // Display order within day
}

// === WORKOUT LOG (the actual training session) ===
interface WorkoutSession {
  id: string;
  planId: string;
  dayId: string;
  dayName: string;           // Denormalized
  startedAt: Date;
  completedAt: Date | null;
  exercises: LoggedExercise[];
}

interface LoggedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
}

interface LoggedSet {
  id: string;
  setNumber: number;         // 1-indexed
  weight: number;            // in kg
  reps: number;
  isCompleted: boolean;
  isPR: boolean;             // Auto-calculated: best weight×reps for this exercise
}

// === DIARY ===
interface DiaryEntry {
  id: string;
  date: string;              // ISO date string "YYYY-MM-DD"
  content: string;           // Markdown-supported free text
  goals: DiaryGoal[];
  mood: 1 | 2 | 3 | 4 | 5;  // 1=terrible, 5=great
  createdAt: Date;
  updatedAt: Date;
}

interface DiaryGoal {
  id: string;
  text: string;              // e.g. "Wake up at 5:00 AM"
  isCompleted: boolean;
}

// === EXERCISE CATALOG ===
interface Exercise {
  id: string;
  name: string;
  category: "chest" | "back" | "shoulders" | "arms" | "legs" | "core" | "cardio" | "full-body";
  equipment: "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight" | "band" | "kettlebell";
  videoUrl: string;          // YouTube embed URL
  thumbnailUrl: string;
  instructions: string[];    // Step-by-step text instructions
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

// === AI COACH ===
interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
```

## Feature Specifications

### 1. Workout Tracker (`/workouts`)

This is the core feature. Two distinct flows: **Plan Management** and **Session Logging**.

#### Plan Management (accessed via "My Plans" tab or gear icon)

1. User creates a plan (e.g. "Upper Lower Split") and gives it a name
2. Within a plan, user adds days (e.g. "Upper A", "Lower B", "Upper B", "Lower A")
3. Within each day, user adds exercises from the catalog:
   - Search/browse exercises → select → define sets count and rep range (e.g. 3 sets of 8-12)
   - Reorder exercises via drag handle or up/down arrows
4. Plans are editable and deletable. Editing a plan does NOT retroactively change past logged sessions.
5. The user must create at least one plan with at least one day before they can start a workout.

**Plan Creation UI**: Full-page form. Plan name input at top. "Add Day" button adds a collapsible section. Within each day section, "Add Exercise" opens a slide-up modal with exercise search. Each exercise row shows: name, sets × rep range, drag handle, delete button.

#### Session Logging (the main workout view)

1. User taps "Start Workout" → selects plan → selects day → session begins
2. Screen shows a vertical scrollable list of exercises, each in its own card
3. Each exercise card shows:
   - Exercise name (tappable to see catalog details)
   - A row for each set with columns: **Set #** | **Previous** (last session's weight×reps in `text-muted`) | **kg** input | **reps** input | **checkmark** button
   - "Add Set" text button below sets to add an extra set beyond plan
4. Input fields: numeric, `bg-surface-alt`, centered text, 60px wide for weight, 48px wide for reps
5. When a set is checked off, the row gets a subtle `bg-surface-alt/50` tint
6. If weight×reps exceeds all-time best for that exercise, show a `success` colored "PR" badge on the set row
7. "Finish Workout" button at bottom saves the session with `completedAt` timestamp
8. A running timer at the top shows elapsed time since session start (format: `HH:MM:SS`)

**Critical UX**: This must feel like a notes app — fast, minimal taps. No unnecessary confirmation dialogs. Number inputs open the numeric keyboard on mobile.

#### Progress View

Below the session logger, a secondary tab "History" shows:
- A list of past sessions, grouped by week
- Each row shows: day name, date, number of exercises, total volume (weight × reps × sets)
- Tapping a past session shows the full logged data read-only

### 2. Diary (`/diary`)

A personal journal with daily goals tracking.

#### Daily View (default)

- Calendar strip at top: horizontally scrollable row of dates (current week visible), today highlighted with `accent` underline
- Tapping a date loads that day's entry (or empty state for new entry)
- Entry form below calendar:
  1. **Mood selector**: 5 emoji-style buttons in a row (😞😕😐🙂😄), selected one gets `accent` ring
  2. **Goals section**: titled "Today's Goals"
     - Each goal is a row: checkbox + text. Tapping checkbox toggles `isCompleted`
     - "Add Goal" text button at bottom (input appears inline, enter to confirm)
     - Example goals: "Wake up at 5:00 AM", "Go for a run", "Drink 3L water"
  3. **Free text area**: Large `textarea` with placeholder "How was your day?"
     - Minimum height 200px, auto-grows
     - Saves on blur (auto-save, no save button)

#### Weekly Summary

Accessible via a "Week" tab next to "Day":
- Shows mood trend (5 dots connected by a line, one per day)
- Goal completion rate as percentage
- Number of workouts completed that week (pull from workout sessions)

### 3. AI Coach (`/coach`)

A chat interface. Two modes determined by settings.

#### Mode 1: Hardcoded (default, no API key required)

The chat uses keyword matching to provide pre-written responses. Store all responses in `src/constants/coachResponses.ts`.

**Keyword → Response mapping** (implement ALL of these):

| Keywords (match any) | Response |
|---|---|
| `hello`, `hi`, `hey`, `start` | "Hey! 💪 I'm your AI Coach. Ask me about workouts, nutrition, recovery, or motivation. What's on your mind?" |
| `motivation`, `motivated`, `lazy`, `don't want to` | "Remember: you don't have to be motivated to show up. Discipline beats motivation every time. The best workout is the one you almost skipped. What's holding you back today?" |
| `sore`, `soreness`, `doms`, `recovery` | "Soreness means your muscles are adapting. Make sure you're sleeping 7-9 hours, eating enough protein (1.6-2.2g per kg bodyweight), and staying hydrated. Light movement and stretching can help. If pain is sharp or in joints, take a rest day." |
| `protein`, `nutrition`, `eat`, `diet`, `food`, `meal` | "For muscle growth, aim for 1.6-2.2g protein per kg bodyweight daily. Spread it across 3-5 meals. Good sources: chicken, eggs, Greek yogurt, lentils, fish, whey protein. Don't neglect carbs — they fuel your workouts." |
| `plateau`, `stuck`, `not progressing`, `stalled` | "Plateaus are normal. Try these: (1) Increase volume — add 1 set per exercise. (2) Change rep ranges — if doing 8-12, try 5-8 heavier. (3) Improve sleep and nutrition. (4) Deload for a week at 50-60% intensity, then come back." |
| `beginner`, `new`, `starting`, `first time` | "Welcome! Start with compound movements: squat, bench press, deadlift, overhead press, rows. 3x per week, 3 sets of 8-12 reps. Focus on form over weight. Increase weight by the smallest increment when you hit the top of your rep range for all sets." |
| `progressive overload`, `overload`, `progress` | "Progressive overload is THE key to growth. Each session, try to beat your last performance: more weight, more reps, or more sets. Even 1 extra rep counts. Track everything — that's what this app is for." |
| `rest`, `rest day`, `off day` | "Rest days are when you grow. Your muscles repair and get stronger during rest, not during the workout. Take at least 1-2 full rest days per week. Active recovery (walking, light stretching) is great on off days." |
| `warm up`, `warmup`, `stretch` | "Always warm up: 5 min light cardio, then 2-3 warm-up sets with lighter weight for your first exercise. Dynamic stretches before training, static stretches after. Never skip the warm-up — injury prevention is progress protection." |
| `sleep`, `tired`, `fatigue`, `exhausted` | "Sleep is the most underrated performance enhancer. Aim for 7-9 hours. Tips: consistent bed time, no screens 30 min before bed, cool dark room, limit caffeine after 2 PM. Poor sleep = poor recovery = poor gains." |
| `form`, `technique`, `how to` | "Good form is non-negotiable. Check the Exercise Catalog in this app for video demonstrations. Key rules: control the weight, full range of motion, don't ego lift. When in doubt, lower the weight and nail the movement pattern." |
| `weight loss`, `lose weight`, `cut`, `fat loss` | "Fat loss = caloric deficit. Track your calories and aim for 300-500 cal below maintenance. Keep protein high to preserve muscle. Lift heavy — don't switch to 'light weight high reps' for fat loss. Cardio helps but diet is king." |
| `bulk`, `gain weight`, `mass`, `muscle gain` | "For a lean bulk, eat 200-400 cal above maintenance. Prioritize protein (1.6-2.2g/kg). Train hard with progressive overload, focus on compound lifts. Expect to gain 0.5-1kg per month. More than that is likely excess fat." |
| (no keyword match / default) | "I'm not sure I understand that fully. Try asking me about: workouts, nutrition, recovery, progressive overload, motivation, or common training questions. I'm here to help!" |

**Matching logic**: Convert user input to lowercase, check if message `.includes()` any keyword from each group. First match wins. If no match, use default.

#### Mode 2: API-powered (when API key is set in settings)

- User enters their OpenAI-compatible API key + endpoint URL in Settings
- Chat sends messages to the API with this system prompt (store in constants):

```
You are IronLog AI Coach, an expert fitness and strength training assistant built into the IronLog workout tracker app. Your role:

- Give practical, evidence-based advice on training, nutrition, recovery, and motivation
- Be concise: respond in 2-4 paragraphs max unless the user asks for detail
- Use a direct, encouraging but not fake-cheerful tone
- Reference progressive overload principles when relevant
- When asked about exercises, recommend checking the app's Exercise Catalog
- Never give medical advice — recommend seeing a doctor for injuries or health concerns
- If the user shares their workout data, analyze it and give specific feedback
- Use metric units (kg, cm) by default
```

- Chat UI is identical in both modes. The store tracks which mode is active.
- Stream responses if the API supports it. Show a typing indicator (3 pulsing dots) while waiting.

#### Chat UI Spec

- Messages in a vertical scroll container, newest at bottom
- User messages: right-aligned, `bg-surface-alt rounded-2xl rounded-br-sm px-4 py-2`
- Assistant messages: left-aligned, `bg-surface rounded-2xl rounded-bl-sm px-4 py-2`
- Input bar fixed at bottom: `bg-surface border-t border-default` with text input and send button (arrow-up icon)
- Send on Enter key. Shift+Enter for newline.
- Empty state (no messages): Show centered text "Ask me anything about fitness, nutrition, or training" with 3 suggested quick-reply chips below: "How do I start?", "Help with plateau", "Nutrition tips"

### 4. Exercise Catalog (`/catalog`)

A searchable, browsable library of exercises.

#### Data

Seed the database with **at least 30 exercises** covering all categories and equipment types. For each exercise, include a real YouTube embed URL of a reputable fitness channel demonstrating the exercise (e.g. Jeff Nippard, Renaissance Periodization, ATHLEAN-X, Alan Thrall). Store seed data in `src/db/seed.ts`.

#### Browse View (default)

- Search bar at top: `bg-surface-alt` input with search icon, filters results in real-time as user types
- Below search: horizontal scrollable chips for category filter ("All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core")
- Results as a vertical list of cards, each showing:
  - Exercise name (bold)
  - Category badge + equipment badge (small rounded pills, `bg-surface-alt text-secondary text-xs`)
  - Primary muscles as comma-separated text
  - Chevron-right icon indicating tappable

#### Exercise Detail View (slide-in page or modal)

- YouTube video embed at top (16:9 aspect ratio, `rounded-xl overflow-hidden`)
- Exercise name as `text-xl font-bold`
- Badges: category, equipment
- "Primary Muscles" and "Secondary Muscles" listed
- "How to Perform" section: numbered step-by-step instructions
- "Add to Workout Plan" button at bottom → opens plan/day selector to insert exercise

### 5. Settings (`/settings`)

Accessed via gear icon in header (not in bottom nav).

- **AI Coach Mode**: Toggle between "Built-in" and "Custom API"
- **API Configuration** (shown only when Custom API selected):
  - API Endpoint URL input (default: `https://api.openai.com/v1/chat/completions`)
  - API Key input (password field)
  - Model name input (default: `gpt-3.5-turbo`)
- **Units**: Toggle kg/lbs (default kg). Stored globally, affects all weight inputs/displays.
- **Data Management**:
  - "Export Data" — exports all IndexedDB data as JSON file download
  - "Import Data" — file picker to import JSON
  - "Delete All Data" — red destructive button, requires typing "DELETE" to confirm

## Code Standards

- Named exports only, no default exports (exception: page components for lazy loading)
- One component per file, filename matches component name in PascalCase
- Zustand stores: one file per domain, typed with TypeScript interface for the store shape
- All async DB operations wrapped in try/catch with user-facing error toast
- No `console.log` in committed code — use a `logger` utility in dev only
- No inline styles. No `style={}` props. Tailwind utility classes exclusively.
- All interactive elements must have `aria-label` when icon-only
- Use `crypto.randomUUID()` for all IDs
