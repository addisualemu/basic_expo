---
name: expo-architecture-enforcer
description: Refactors or aligns an existing Expo app to the canonical folder structure and stack (Expo Router, Zustand, NativeWind). Use when migrating structure, enforcing conventions, or cleaning up layout/lint.
---

# Expo architecture enforcer

Aligns an **existing** Expo app with **expo-app-conventions**: folder structure, stack (Expo Router, Zustand, NativeWind), and naming. Use when the user wants to "match the standard structure", "refactor to conventions", or "clean up the project layout".

## When to use

- User asks to enforce or migrate to the standard layout.
- Moving files into the correct folders (e.g. screens into `app/`, stores into `lib/stores/`).
- Replacing Redux with Zustand or StyleSheet with NativeWind (larger refactors; do incrementally).
- Adding missing folders or fixing naming to match conventions.

## Reference

Follow the **expo-app-conventions** skill (and its reference.md) for the target layout. Summary: `app/`, `components/ui|features|layout/`, `hooks/`, `lib/stores|api|utils/`, `constants/`, `assets/`.

## Workflow

1. **Audit**: List current top-level and key files; compare to conventions (app/, components/, lib/, hooks/, constants/).
2. **Plan moves**: Decide where each file should live; avoid breaking imports (update imports when moving).
3. **Create missing dirs**: e.g. `components/ui`, `components/features`, `lib/stores`, `lib/api`, `constants` if absent.
4. **Move and fix**: Move files, update all imports (use path alias `@/` if present).
5. **Lint/format**: Run ESLint/Prettier if the project has them; fix issues.
6. **Optional**: Replace non-conforming pieces (e.g. one Redux slice → Zustand store) if user requested; otherwise just layout.

## Rules

1. Do not change behavior unnecessarily; prioritize structure and import paths.
2. Update every import that points to moved files; verify build/tests after.
3. If the app uses React Navigation or Redux, migrating is a larger task—do one slice or one navigator at a time and confirm with user.
4. Prefer incremental changes: one folder or one concern per pass.
