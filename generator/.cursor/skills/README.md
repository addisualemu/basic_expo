# Cursor Skills — Expo App Generator

Overview of the **Agent Skills** in `.cursor/skills/`. These skills give the AI consistent rules for building and maintaining Expo apps that use **Expo Router**, **Zustand**, and **NativeWind**.

---

## How to use

1. **Open the generated app in Cursor** (the project where you ran the generator and where `.cursor/skills/` was copied). Skills are **project-scoped**: Cursor discovers them from that folder and uses them when your request matches their description.

2. **Ask in natural language.** You don’t have to name a skill. Phrasing like “add a settings screen” or “add login flow” will trigger the right skill (often **expo-feature-builder**, which then uses the others).

3. **Optional:** You can be explicit, e.g. “Use the Expo feature builder to add …” or “Follow expo-app-conventions and add …”.

### Example prompts (orchestrator — “add a feature”)

These tend to trigger **expo-feature-builder**, which will plan and call UI, state, API, auth, or navigation as needed:

- *“Add a settings screen with a dark mode toggle that persists.”*
- *“Add login and signup screens with an auth store and redirect to home after login.”*
- *“Add a profile screen that loads user data from an API and shows name and avatar.”*
- *“Add a tab for Settings and a tab for Profile, with a simple layout for each.”*
- *“Add onboarding: 3 screens with Next/Skip, and persist ‘onboarding done’ so we don’t show it again.”*

### Example prompts (specific skills)

- *“Where should I put the auth store?”* → **expo-app-conventions**
- *“Add a reusable Button and Card in components/ui using NativeWind.”* → **expo-ui-agent**
- *“Add a Zustand store for theme (light/dark) with AsyncStorage persistence.”* → **expo-state-agent**
- *“Add an API client and a getUser endpoint, plus a useUser hook.”* → **expo-api-agent**
- *“Add protected routes: redirect to login if not authenticated.”* → **expo-auth-flow** / **expo-navigation**
- *“Add a new route /about with a simple screen.”* → **expo-navigation**
- *“Add a test for the settings toggle.”* → **expo-testing**
- *“Refactor this app to match the standard folder structure (app/, components/, lib/).”* → **expo-architecture-enforcer**

### One full example

**You say:** *“Add a settings screen with a dark mode toggle that persists.”*

**What the AI does (following the skills):**

1. **expo-app-conventions** — Puts the screen in `app/(tabs)/settings.tsx` (or `app/settings.tsx`), store in `lib/stores/`.
2. **expo-state-agent** — Creates `lib/stores/useSettingsStore.ts` with `theme: 'light' | 'dark'` and Zustand `persist` + AsyncStorage.
3. **expo-ui-agent** — Builds the Settings screen and a toggle component with NativeWind; reads theme from the store.
4. **expo-navigation** — Ensures the route exists and, if using tabs, adds the Settings tab in `app/(tabs)/_layout.tsx`.

You get a working screen, persisted theme, and structure that matches the conventions.

---

## Stack (canonical)

| Concern   | Choice      | Notes                          |
|----------|-------------|--------------------------------|
| Routing  | Expo Router | File-based in `app/`           |
| State    | Zustand     | Stores in `lib/stores/`        |
| Styling  | NativeWind  | Tailwind via `className`      |
| Language | TypeScript  | Strict                        |

---

## Skills overview

### Foundation

| Skill | Purpose |
|-------|--------|
| **expo-app-conventions** | Single source of truth for folder structure, stack, and naming. Use when establishing or checking layout, adding files, or when any Expo skill needs structure rules. See `expo-app-conventions/reference.md` for the full tree. |
| **project-brief** | Resource: read PROJECT_BRIEF.md for this project's goals, phases, and task priorities. Use when planning or implementing so work aligns with the brief. If missing, suggest running **expo-launch** first. |

### Discovery and planning

| Skill | Purpose |
|-------|--------|
| **expo-launch** | Discovery conversation in chat: ask what the user is building, follow up with questions (no fixed list), then generate and write `.cursor/skills/project-brief/PROJECT_BRIEF.md` with phases and importance. Trigger: "launch", "lets get started", "what are we building". |

### Feature building

| Skill | Purpose |
|-------|--------|
| **expo-feature-builder** | Orchestrates features by delegating to UI, state, API, auth, and navigation. Use for “add a feature”, “build X”, new screens/flows, or auth. Applies sub-skills in dependency order (state → API → auth → UI → navigation → testing). |

### Domain skills (use directly or via feature-builder)

| Skill | Purpose |
|-------|--------|
| **expo-ui-agent** | Screens and components with **NativeWind only** (no `StyleSheet`). Primitives in `components/ui/`, feature UI in `components/features/`, layout in `components/layout/`, design tokens in `constants/theme.ts`. |
| **expo-state-agent** | Zustand stores in `lib/stores/`, persistence (e.g. AsyncStorage), and hooks in `hooks/`. No Redux; no API calls inside stores. |
| **expo-api-agent** | API client in `lib/api/client.ts`, endpoints in `lib/api/endpoints/`, types, and data-fetching hooks. Env-based base URL; no UI in this layer. |
| **expo-auth-flow** | End-to-end auth: auth store, login/signup screens, token persistence, protected routes. Uses state, API, UI, and navigation patterns; coordinates with expo-navigation for route guards. |
| **expo-navigation** | Expo Router only: routes in `app/`, groups like `(tabs)` and `(auth)`, `_layout.tsx`. No direct React Navigation stack/tabs usage. |

### Quality & alignment

| Skill | Purpose |
|-------|--------|
| **expo-testing** | Unit/integration tests with Jest + React Native Testing Library. Component, hook, and store tests; e2e only if requested. |
| **expo-architecture-enforcer** | Refactors or aligns an existing app to the canonical structure and stack. Use for “match standard structure”, moving files, or replacing Redux/StyleSheet with Zustand/NativeWind (incrementally). |

---

## When to use which skill

- **“Where does X go?” / “What’s the folder structure?”** → **expo-app-conventions**
- **“Add a feature / screen / auth / build X”** → **expo-feature-builder** (it will use the others)
- **“Add or change UI / screens / components / styling”** → **expo-ui-agent**
- **“Add or change state / stores / persistence”** → **expo-state-agent**
- **“Add or change API / endpoints / data fetching”** → **expo-api-agent**
- **“Add login, signup, protected routes”** → **expo-auth-flow**
- **“Add routes / tabs / layout groups”** → **expo-navigation**
- **“Add tests / coverage”** → **expo-testing**
- **“Refactor to conventions / fix layout / migrate structure”** → **expo-architecture-enforcer**
- **“What to do next?” / “What’s left?” / “What should I work on?” / “Priorities?”** → **project-brief** (lists remaining tasks by phase/importance and suggests the next one)

---

## Discovery (expo-launch and project-brief)

To define what you're building before coding, say **"Launch"** or **"Lets get started"** in chat. The **expo-launch** skill runs a discovery conversation (the AI asks what you're building and follow-up questions), then writes a project brief to `.cursor/skills/project-brief/PROJECT_BRIEF.md` with phases and importance. The **project-brief** skill tells the AI to read that file when planning or implementing so work aligns with your priorities.

**Task tracking:** Tasks in the brief use Markdown checkboxes (`- [ ]` = todo, `- [x]` = done). When you ask **"what to do next"**, the AI lists only unchecked tasks, grouped by phase and importance, and suggests the next one. When **expo-feature-builder** completes a feature that matches a brief task, it marks that task done in the file so the list stays accurate.

---

## Feature workflow (expo-feature-builder)

Rough order of operations when building a feature:

1. **expo-app-conventions** — Confirm target paths.
2. **expo-state-agent** — Stores and hooks if the feature has state.
3. **expo-api-agent** — Client, endpoints, hooks if it uses an API.
4. **expo-auth-flow** — Auth flow or protected routes if needed.
5. **expo-ui-agent** — Screens and components (NativeWind).
6. **expo-navigation** — Routes, tabs, layout changes.
7. **expo-testing** — Tests if requested.

---

## Folder structure (summary)

From **expo-app-conventions**:

- `app/` — Expo Router routes and layouts only.
- `components/ui/` — Primitives (Button, Text, Input, Card).
- `components/features/` — Feature components (LoginForm, SettingsForm).
- `components/layout/` — Screen shells (Screen, Container).
- `hooks/` — Custom hooks.
- `lib/stores/` — Zustand stores.
- `lib/api/` — API client and endpoints.
- `lib/utils/` — Pure helpers.
- `constants/` — theme, config, design tokens.
- `assets/` — Fonts, images.

Full reference: [expo-app-conventions/reference.md](expo-app-conventions/reference.md).
