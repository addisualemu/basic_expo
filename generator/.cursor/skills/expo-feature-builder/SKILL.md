---
name: expo-feature-builder
description: Orchestrates building Expo app features by delegating to UI, state, API, auth, and navigation skills. Use when the user asks to add a feature, flow, screen, auth, or "build X" in an Expo + Zustand + NativeWind app.
---

# Expo feature builder

Breaks feature requests into tasks and applies the right **sub-skills** so the app stays consistent (Expo Router, Zustand, NativeWind). Always follow **expo-app-conventions** for layout and stack.

## When to use

- User says: "Add a settings screen", "Add auth flow", "Build a profile page with API", "Add onboarding", "Create a feature that does X".
- Do **not** use for: one-off tiny edits, pure refactors (use expo-architecture-enforcer), or only adding tests (use expo-testing).

## Workflow

1. **Clarify** the feature (screens, data, persistence, API, auth).
2. **Plan** which parts are needed (UI, state, API, auth, navigation).
3. **Apply** the corresponding skills in dependency order (e.g. state/store before screens that use it).
4. **Wire** everything: routes, layout, providers if needed.
5. **If** the feature you just built matches a task in the project brief (`.cursor/skills/project-brief/PROJECT_BRIEF.md`), **update** that file: change the task's checkbox from `- [ ]` to `- [x]` so "what to do next" stays accurate.

## Delegation map

| Need | Skill to use | What it does |
|------|--------------|--------------|
| Where to put files, structure | expo-app-conventions | Folder layout, naming, stack |
| Env vars, API URL, feature flags | expo-env-agent | `.env`, `.env.example`, `lib/env.ts` |
| Screens, components, styling | expo-ui-agent | NativeWind components and screens in `components/`, `app/` |
| Global or feature state | expo-state-agent | Zustand stores in `lib/stores/`, hooks |
| REST/API calls, typed client | expo-api-agent | `lib/api/` client, endpoints, hooks |
| Login/signup, protected routes | expo-auth-flow | Auth screens, auth store, persistence, redirects |
| New routes, tabs, layouts | expo-navigation | Expo Router routes and `_layout.tsx` |
| Tests for the feature | expo-testing | Unit/e2e for new code |

## Order of operations

- **State first** when the feature has data (store + hooks).
- **API next** when the feature fetches or sends data (client + endpoints + hooks).
- **Auth** when the feature is login/signup or protected (expo-auth-flow does UI + state + routing).
- **UI/screens** after state/API exist, so components can import hooks and stores.
- **Navigation** when adding new routes or tabs (new files in `app/`, update layouts).
- **Testing** last, for the new code.

## Checklist pattern

For each feature, mentally or explicitly:

```
- [ ] expo-app-conventions: Confirm target paths (app/, components/, lib/)
- [ ] expo-state-agent: Add/update stores and hooks if feature has state
- [ ] expo-api-agent: Add client/endpoints/hooks if feature uses API
- [ ] expo-auth-flow: Add auth flow or protected route if needed
- [ ] expo-ui-agent: Add screens and components (NativeWind)
- [ ] expo-navigation: Add routes, tabs, or layout changes
- [ ] expo-testing: Add tests if user asked for them
```

## Example

**User**: "Add a settings screen with dark mode toggle that persists."

1. **expo-app-conventions**: Settings screen → `app/(tabs)/settings.tsx` or `app/settings.tsx`; theme state → `lib/stores/`.
2. **expo-state-agent**: Create or extend a store (e.g. `useSettingsStore`) with `theme: 'light' | 'dark'` and persistence.
3. **expo-ui-agent**: Build Settings screen and a toggle component using NativeWind; read theme from store.
4. **expo-navigation**: Ensure route exists (e.g. `app/(tabs)/settings.tsx`) and tab entry if using tabs.
5. (Optional) **expo-testing**: Add a simple test for the toggle and persistence.

Implement in that order; reference each sub-skill for concrete patterns (file locations, code style).
