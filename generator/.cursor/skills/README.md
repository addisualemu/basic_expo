# Cursor Skills & Agents — Expo App Generator

Overview of **Skills** (`.cursor/skills/`) and **Agents** (`.cursor/agents/`) shipped with the generator. These give the AI consistent rules for building and maintaining Expo apps that use **Expo Router**, **Zustand**, and **NativeWind**.

---

## Agents vs Skills

| | Agents (`.cursor/agents/`) | Skills (`.cursor/skills/`) |
|---|---|---|
| **Purpose** | Autonomous subagents that **run, check, or fix** things | Knowledge and patterns the main agent **follows when implementing** |
| **Examples** | Debug a crash, run tests, verify conventions, orchestrate a feature | Folder structure, how to create a store, how to wire an API |
| **Invocation** | Launched as a subagent process | Read by the main agent when a request matches the description |

**Rule of thumb**: if it *does work* (runs commands, checks files, orchestrates steps) → agent. If it *describes how to do work* (patterns, placement, rules) → skill.

---

## How to use

1. **Open the generated app in Cursor** (the project where you ran the generator and where `.cursor/skills/` and `.cursor/agents/` were copied). They are **project-scoped**: Cursor discovers them from those folders and uses them when your request matches their description.

2. **Ask in natural language.** You don't have to name a skill or agent. Phrasing like "add a settings screen" or "add login flow" will trigger the right one (often the **expo-feature-builder** agent, which then uses the skills).

3. **Optional:** You can be explicit, e.g. "Use the Expo feature builder to add …" or "Follow expo-app-conventions and add …".

### Example prompts (orchestrator — "add a feature")

These trigger the **expo-feature-builder** agent, which plans and delegates to skills:

- *"Add a settings screen with a dark mode toggle that persists."*
- *"Add login and signup screens with an auth store and redirect to home after login."*
- *"Add a profile screen that loads user data from an API and shows name and avatar."*
- *"Add a tab for Settings and a tab for Profile, with a simple layout for each."*
- *"Add onboarding: 3 screens with Next/Skip, and persist 'onboarding done' so we don't show it again."*

### Example prompts (specific skills)

- *"Where should I put the auth store?"* → **expo-app-conventions**
- *"Add a reusable Button and Card in components/ui using NativeWind."* → **expo-ui-agent**
- *"Add a Zustand store for theme (light/dark) with AsyncStorage persistence."* → **expo-state-agent**
- *"Add an API client and a getUser endpoint, plus a useUser hook."* → **expo-api-agent**
- *"Add env for API URL and feature flags."* → **expo-env-agent**
- *"Add protected routes: redirect to login if not authenticated."* → **expo-auth-flow** / **expo-navigation**
- *"Add a new route /about with a simple screen."* → **expo-navigation**
- *"Add a signup form with email/password validation."* → **expo-forms-agent**
- *"Add error boundaries and loading states."* → **expo-error-handling**
- *"Add a test for the settings toggle."* → **expo-testing**
- *"Refactor this app to match the standard folder structure."* → **expo-architecture-enforcer**

### One full example

**You say:** *"Add a settings screen with a dark mode toggle that persists."*

**What the AI does (following agents + skills):**

1. **expo-app-conventions** — Puts the screen in `app/(tabs)/settings.tsx`, store in `lib/stores/`.
2. **expo-state-agent** — Creates `lib/stores/useSettingsStore.ts` with `theme: 'light' | 'dark'` and Zustand `persist` + AsyncStorage.
3. **expo-ui-agent** — Builds the Settings screen and a toggle component with NativeWind; reads theme from the store.
4. **expo-navigation** — Ensures the route exists and, if using tabs, adds the Settings tab in `app/(tabs)/_layout.tsx`.

You get a working screen, persisted theme, and structure that matches the conventions.

---

## Stack (canonical)

| Concern  | Choice      | Notes                         |
|----------|-------------|-------------------------------|
| Routing  | Expo Router | File-based in `app/`          |
| State    | Zustand     | Stores in `lib/stores/`       |
| Styling  | NativeWind  | Tailwind via `className`      |
| Language | TypeScript  | Strict                        |

---

## Agents overview

| Agent | Purpose |
|-------|---------|
| **expo-planning-facilitator** | Discovery: asks 2–3 questions at a time, uses **expo-researcher** when needed, then writes PROJECT_BRIEF.md. Use for "launch", "lets get started", "what are we building". |
| **expo-researcher** | Researches app domains and patterns (web/docs). Used by the planning facilitator to suggest features, flows, and next questions; can be run standalone for "research booking app features". |
| **expo-feature-builder** | Orchestrates features by delegating to skills (state → API → auth → UI → navigation → testing). Use for "add a feature", "build X", new screens/flows, or auth. |
| **expo-test-runner** | Runs tests, fixes failures, adds new tests. Detailed code patterns for component, hook, and store tests with mocks. |
| **expo-debugger** | Diagnoses and fixes runtime errors, Metro issues, NativeWind problems, Zustand bugs, Expo Router issues. |
| **expo-verifier** | Read-only validator: checks folder structure, NativeWind-only styling, store placement, API layer, TypeScript types, and routing conventions. |

---

## Skills overview

### Foundation

| Skill | Purpose |
|-------|---------|
| **expo-app-conventions** | Single source of truth for folder structure, stack, and naming. Use when establishing or checking layout, adding files, or when any Expo skill needs structure rules. See `expo-app-conventions/reference.md` for the full tree. |
| **project-brief** | Resource: read PROJECT_BRIEF.md for this project's goals, phases, and task priorities. Use when planning or implementing so work aligns with the brief. If missing, suggest running **expo-launch** first. |

### Discovery and planning

| Skill | Purpose |
|-------|---------|
| **expo-launch** | Simpler discovery: scripted Q&A (one free-text question, then multiple-choice), then write PROJECT_BRIEF.md. Use when you prefer a fixed question flow without research. For research-informed, few-questions-at-a-time discovery, use the **expo-planning-facilitator** agent instead. |
| **expo-jira-integration** | Optional: when Jira MCP is configured, create Jira issues after writing the brief (Epic per phase, Story/Task per task) and answer "what to work on?" from Jira. Use when Jira MCP tools are available; otherwise fall back to PROJECT_BRIEF.md only. See [JIRA_INTEGRATION.md](../JIRA_INTEGRATION.md) for setup. |

### Domain skills (use directly or via feature-builder agent)

| Skill | Purpose |
|-------|---------|
| **expo-ui-agent** | Screens and components with **NativeWind only** (no `StyleSheet`). Primitives in `components/ui/`, feature UI in `components/features/`, layout in `components/layout/`, design tokens in `constants/theme.ts`. |
| **expo-state-agent** | Zustand stores in `lib/stores/`, persistence (e.g. AsyncStorage), and hooks in `hooks/`. No Redux; no API calls inside stores. |
| **expo-api-agent** | API client in `lib/api/client.ts`, endpoints in `lib/api/endpoints/`, types, and data-fetching hooks. Env-based base URL via `lib/env.ts`; no UI in this layer. |
| **expo-env-agent** | Env and config: `.env`, `.env.example`, `lib/env.ts`, `EXPO_PUBLIC_*`. Use when adding or changing env vars, API URL, or feature flags. |
| **expo-auth-flow** | End-to-end auth: auth store, login/signup screens, token persistence, protected routes. Uses state, API, UI, and navigation patterns; coordinates with expo-navigation for route guards. |
| **expo-navigation** | Expo Router only: routes in `app/`, groups like `(tabs)` and `(auth)`, `_layout.tsx`. No direct React Navigation stack/tabs usage. |
| **expo-forms-agent** | Forms and validation: Zod schemas in `lib/validation/`, reusable `FormField` input, inline error display. Use when adding forms with validation. |
| **expo-error-handling** | Error boundaries, loading spinners, empty states, retry logic. Use when adding error/loading/empty UI or ensuring screens handle all async states. |

### Quality & alignment

| Skill | Purpose |
|-------|---------|
| **expo-testing** | Unit/integration tests with Jest + React Native Testing Library. Setup, placement, and guidelines; for detailed code patterns, see the **expo-test-runner** agent. |
| **expo-architecture-enforcer** | Refactors or aligns an existing app to the canonical structure and stack. Use for "match standard structure", moving files, or replacing Redux/StyleSheet with Zustand/NativeWind (incrementally). |

---

## When to use which

- **"Launch" / "Lets get started" / "What are we building?"** → **expo-planning-facilitator** agent (iterative Q&A + research), or **expo-launch** skill (simpler scripted Q&A)
- **"Research [X] app features"** → **expo-researcher** agent
- **"Where does X go?" / "What's the folder structure?"** → **expo-app-conventions**
- **"Add a feature / screen / auth / build X"** → **expo-feature-builder** agent (it will use the skills)
- **"Add or change UI / screens / components / styling"** → **expo-ui-agent**
- **"Add or change state / stores / persistence"** → **expo-state-agent**
- **"Add or change API / endpoints / data fetching"** → **expo-api-agent**
- **"Add env vars / API URL / feature flags / .env.example"** → **expo-env-agent**
- **"Add login, signup, protected routes"** → **expo-auth-flow**
- **"Add routes / tabs / layout groups"** → **expo-navigation**
- **"Add a form with validation"** → **expo-forms-agent**
- **"Add error handling / loading states / empty states"** → **expo-error-handling**
- **"Add tests / coverage"** → **expo-testing** skill or **expo-test-runner** agent
- **"Refactor to conventions / fix layout / migrate structure"** → **expo-architecture-enforcer**
- **"What to do next?" / "What's left?" / "Priorities?"** → **project-brief** (or from Jira if **expo-jira-integration** and Jira MCP are configured)
- **"Debug this error" / "App is crashing"** → **expo-debugger** agent
- **"Check if this follows conventions"** → **expo-verifier** agent

---

## Discovery (planning facilitator, researcher, and project-brief)

To define what you're building before coding, say **"Launch"** or **"Lets get started"** in chat.

- **Recommended:** The **expo-planning-facilitator** agent runs discovery: it asks **2–3 questions at a time**, calls the **expo-researcher** agent when research would improve the next questions (e.g. for a booking app it may research common features and suggest cancellation, reminders, etc.), then writes `.cursor/skills/project-brief/PROJECT_BRIEF.md`. Research happens only when useful; trivial or already-clear cases skip it.
- **Alternative:** The **expo-launch** skill does a simpler, scripted Q&A (one open question, then a fixed set of multiple-choice questions) with no research. Use it if you prefer a short, predictable flow.

The **project-brief** skill tells the AI to read PROJECT_BRIEF.md when planning or implementing so work aligns with your priorities.

**Task tracking:** Tasks in the brief use Markdown checkboxes (`- [ ]` = todo, `- [x]` = done). When you ask **"what to do next"**, the AI lists only unchecked tasks, grouped by phase and importance, and suggests the next one. When the **expo-feature-builder** agent completes a feature that matches a brief task, it marks that task done in the file so the list stays accurate.

**Optional Jira:** If you configure a Jira MCP server (see [JIRA_INTEGRATION.md](../JIRA_INTEGRATION.md) in `.cursor/`), the AI can create Jira tickets when the brief is written and suggest the next task from Jira when you ask "what should I work on?". The **expo-jira-integration** skill describes when and how to use Jira MCP tools.

---

## Feature workflow (expo-feature-builder agent)

Rough order of operations when building a feature:

1. **expo-app-conventions** — Confirm target paths.
2. **expo-state-agent** — Stores and hooks if the feature has state.
3. **expo-api-agent** — Client, endpoints, hooks if it uses an API.
4. **expo-auth-flow** — Auth flow or protected routes if needed.
5. **expo-forms-agent** — Forms with validation if the feature has user input.
6. **expo-ui-agent** — Screens and components (NativeWind).
7. **expo-error-handling** — Loading, error, and empty states for async screens.
8. **expo-navigation** — Routes, tabs, layout changes.
9. **expo-testing** — Tests if requested.

---

## Folder structure (summary)

From **expo-app-conventions**:

- `app/` — Expo Router routes and layouts only.
- `components/ui/` — Primitives (Button, Text, Input, Card, FormField, Loading, EmptyState, ErrorBoundary).
- `components/features/` — Feature components (LoginForm, SettingsForm, ProfileCard).
- `components/layout/` — Screen shells (Screen, Container).
- `hooks/` — Custom hooks.
- `lib/stores/` — Zustand stores.
- `lib/api/` — API client and endpoints.
- `lib/validation/` — Zod schemas for form validation.
- `lib/utils/` — Pure helpers.
- `constants/` — theme, config, design tokens.
- `assets/` — Fonts, images.

Full reference: [expo-app-conventions/reference.md](expo-app-conventions/reference.md).

---

## Suggested additional skills (not yet included)

These fit the stack and common app needs. Add them under `.cursor/skills/` when you need them:

| Skill | Purpose | When to use |
|-------|---------|-------------|
| **expo-accessibility-agent** | Accessibility: `accessibilityLabel`, `accessibilityRole`, focus order, screen reader text. | "Make this screen accessible", "Add a11y to buttons/list". |
| **expo-offline-agent** | Offline/cache: cache API responses, queue mutations, offline indicators. | "Add offline support", "Cache API data". |
| **expo-i18n-agent** | Localization: translations, `i18n` setup, locale switching, RTL. | "Add translations", "Support multiple languages". |
| **expo-notifications-agent** | Push/local notifications: Expo Notifications, permissions, tokens. | "Add push notifications", "Notify user when X". |
| **expo-deep-linking-agent** | Deep links and universal links: scheme, path handling, navigation from links. | "Open app from link", "Deep link to screen". |

### How to add a custom skill

1. Under `generator/.cursor/skills/` add a folder (e.g. `expo-offline-agent/`) with a `SKILL.md` (YAML frontmatter `name` + `description`, then instructions).
2. Optionally add `reference.md` or `examples.md` in the same folder for extra detail.
3. Run the generator — new projects get the skill via the existing "Copy Cursor skills" step.
4. Add the skill to this README.

---

## Summary

- **6 agents**: expo-planning-facilitator, expo-researcher, expo-feature-builder, expo-test-runner, expo-debugger, expo-verifier.
- **14 skills**: expo-app-conventions, project-brief, expo-launch, expo-jira-integration, expo-ui-agent, expo-state-agent, expo-api-agent, expo-env-agent, expo-auth-flow, expo-navigation, expo-forms-agent, expo-error-handling, expo-testing, expo-architecture-enforcer.
