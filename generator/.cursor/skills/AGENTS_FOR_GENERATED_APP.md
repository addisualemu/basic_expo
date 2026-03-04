# Agents Included in the Generated App

When you run the Expo App Generator, it copies **all** skills from this folder (`.cursor/skills/`) into the generated project. Cursor then discovers them in the new app so you can say things like “add a settings screen” or “add login flow” and get consistent, convention-following results.

---

## Currently Included (shipped with generator)

| Agent | Role |
|-------|------|
| **expo-app-conventions** | Single source of truth: folder structure, stack (Expo Router, Zustand, NativeWind), naming. Use when checking layout or adding files. |
| **project-brief** | Reads `PROJECT_BRIEF.md` for goals, phases, priorities. Use when planning or deciding “what to do next.” |
| **expo-launch** | Discovery: ask what the user is building, then write the project brief. Trigger: “launch”, “lets get started”, “what are we building”. |
| **expo-feature-builder** | Orchestrator: “add a feature” → delegates to UI, state, API, auth, navigation, testing in the right order. |
| **expo-ui-agent** | Screens and components with **NativeWind only**; primitives in `components/ui/`, feature UI in `components/features/`, layout in `components/layout/`. |
| **expo-state-agent** | Zustand stores in `lib/stores/`, persistence (e.g. AsyncStorage), hooks. No Redux; no API inside stores. |
| **expo-api-agent** | API client in `lib/api/`, endpoints, types, data-fetching hooks. Env-based base URL. |
| **expo-auth-flow** | End-to-end auth: auth store, login/signup screens, token persistence, protected routes. |
| **expo-navigation** | Expo Router only: routes in `app/`, groups like `(tabs)` and `(auth)`, `_layout.tsx`. |
| **expo-testing** | Unit/integration tests (Jest + React Native Testing Library). Component, hook, store tests. |
| **expo-architecture-enforcer** | Refactor or align an existing app to the canonical structure and stack. |

These cover: **structure**, **discovery/planning**, **feature building**, **UI**, **state**, **API**, **auth**, **navigation**, **testing**, and **migration**.

---

## Suggested Additional Agents (custom)

You can add **custom agents** under `.cursor/skills/` in the **generator** so they are copied into every generated app. Below are suggested agents that fit the Expo + Zustand + NativeWind stack and common app needs.

### Recommended to add

| Agent | Purpose | When to use |
|-------|---------|-------------|
| **expo-env-agent** | Env and config: `.env`, `EXPO_PUBLIC_*`, `lib/env.ts`, `.env.example`. Validates required vars. | “Add env for API URL”, “Add feature flags”, “Document env vars”. |
| **expo-forms-agent** | Forms and validation: form state, Zod (or similar), reusable inputs, error messages. | “Add a form with validation”, “Add signup form”, “Validate email/phone”. |
| **expo-accessibility-agent** | Accessibility: `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`, focus order, screen reader text. | “Make this screen accessible”, “Add a11y to buttons/list”, “Screen reader support”. |

### Optional (add when needed)

| Agent | Purpose | When to use |
|-------|---------|-------------|
| **expo-offline-agent** | Offline/cache: cache API responses, queue mutations, offline indicators. | “Add offline support”, “Cache API data”, “Work offline”. |
| **expo-i18n-agent** | Localization: translations, `i18n` setup, locale switching, RTL if needed. | “Add translations”, “Support multiple languages”, “Localize strings”. |
| **expo-notifications-agent** | Push/local notifications: Expo Notifications, permissions, tokens, handling in app. | “Add push notifications”, “Notify user when X”, “Local notifications”. |
| **expo-deep-linking-agent** | Deep links and universal links: scheme, path handling, navigation from links. | “Open app from link”, “Deep link to screen”, “Share link to content”. |

---

## How to add a custom agent to the generated app

1. **Create the skill in the generator**  
   Under `generator/.cursor/skills/` add a folder, e.g. `expo-env-agent/`, with at least:
   - `SKILL.md` (required): YAML frontmatter `name` and `description`, then instructions and when to use.

2. **Optional**  
   Add `reference.md` or `examples.md` in the same folder if the skill needs extra detail or examples.

3. **Run the generator**  
   New projects get the new skill via the existing “Copy Cursor skills” step (no generator code change needed).

4. **Document it**  
   Add the new agent to this file (and optionally to the main [README.md](README.md) “Skills overview” table) so users know it exists and when to use it.

---

## Summary

- **Included today:** 11 agents (conventions, brief, launch, feature-builder, UI, state, API, auth, navigation, testing, architecture-enforcer).
- **Suggested next:** **expo-env-agent**, **expo-forms-agent**, **expo-accessibility-agent**.
- **Optional later:** expo-offline-agent, expo-i18n-agent, expo-notifications-agent, expo-deep-linking-agent.

Adding **expo-env-agent** first is a good way to start making custom agents: it’s small, aligns with the API agent’s use of env, and gives a clear template for more custom skills.
