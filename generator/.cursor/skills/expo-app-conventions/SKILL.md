---
name: expo-app-conventions
description: Defines the canonical folder structure, stack (Expo Router, Zustand, NativeWind), and naming for generated Expo apps. Use when establishing or checking project layout, adding new files, or when any Expo-related skill needs structure rules.
---

# Expo app conventions

This skill defines the **single source of truth** for generated Expo apps. All other Expo skills (feature-builder, ui-agent, state-agent, api-agent, auth-flow, navigation, testing, architecture-enforcer) assume this structure and stack.

## When to use

- User asks for folder structure, project layout, or "where does X go?"
- Adding new files (screens, components, stores, API): place them per this layout.
- Before implementing a feature: confirm the target paths match this structure.
- When refactoring or enforcing architecture: align to this layout.

## Stack (opinionated)

| Concern | Choice | Notes |
|---------|--------|--------|
| Routing | Expo Router | File-based in `app/`. No React Navigation. |
| State | Zustand | Stores in `lib/stores/`. |
| Styling | NativeWind | Tailwind via `className`. No StyleSheet for layout. |
| Language | TypeScript | Strict. |

## Folder structure (summary)

- `app/` — Expo Router routes and layouts only.
- `components/ui/` — Primitives (Button, Text, Input, Card).
- `components/features/` — Feature components (LoginForm, SettingsForm).
- `components/layout/` — Screen shells (Screen, Container).
- `hooks/` — Custom hooks.
- `lib/stores/` — Zustand stores.
- `lib/api/` — API client and endpoints.
- `lib/utils/` — Pure helpers.
- `constants/` — theme.ts, config. Design tokens.
- `assets/` — Fonts, images.

## Naming

- Components/screens: PascalCase (`LoginForm.tsx`).
- Utilities/hooks (file): kebab-case or camelCase (`use-auth.ts` or `useAuth.ts`).
- Route file = route path; use groups: `(tabs)`, `(auth)`.

## Full reference

For the complete tree, file roles, and key file list, see [reference.md](reference.md). Other skills should reference this skill when deciding where to create or move files.
