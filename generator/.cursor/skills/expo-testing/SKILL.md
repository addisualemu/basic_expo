---
name: expo-testing
description: Adds unit and integration tests for Expo app components, hooks, and stores. Use when the user asks for tests, test coverage, or validating new features in an Expo app.
---

# Expo testing

Adds **tests** for the generated app: components, hooks, stores. Prefer Jest + React Native Testing Library. E2E with Detox or Maestro only if the user explicitly asks for e2e.

## When to use

- User asks to add tests, test a feature, or improve coverage.
- After adding a feature (expo-feature-builder may suggest running this skill last).
- Setting up test config if the project has no tests yet.

## Setup (if missing)

- **Jest**: `jest-expo` preset, transform for TS/TSX. Config in `package.json` or `jest.config.js`.
- **React Native Testing Library**: `@testing-library/react-native`. Render components, query by role/label, fire events.
- **Zustand**: Test stores by calling getState/setState or rendering a small component that uses the store.

## Placement

- **Component tests**: Next to component or in `__tests__/` (e.g. `components/ui/__tests__/Button.test.tsx` or `Button.test.tsx` beside `Button.tsx`).
- **Hook/store tests**: `hooks/__tests__/` or `lib/stores/__tests__/`.
- **E2E** (if requested): Separate e2e folder and config (Detox/Maestro).

## What to test

- **UI components**: Render, assert on output, simulate press/change. Mock store or props as needed.
- **Hooks**: Render a test component that uses the hook; assert behavior or state.
- **Stores**: Create store in test, dispatch actions, assert state. Mock AsyncStorage for persist if needed.

## Rules

1. Prefer Testing Library (user-centric queries); avoid testing implementation details.
2. Keep tests in the project (not in generator); follow project’s existing test layout if any.
3. Do not add e2e stack unless the user asks for it; focus on unit/integration first.
