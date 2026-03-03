---
name: expo-state-agent
description: Adds and edits Zustand stores, slices, and hooks for Expo apps. Use when adding or changing global or feature state, persistence, or store wiring in an Expo + Zustand app.
---

# Expo state agent

Creates and edits **Zustand** state only. All stores live under `lib/stores/`. Follow **expo-app-conventions** for paths and stack.

## When to use

- Add or change global or feature-level state.
- Add persistence (e.g. AsyncStorage) to a store.
- Create or update hooks that expose store state or actions.
- Wire stores into the app (e.g. root layout or providers).

## Placement

- **Stores**: `lib/stores/`. One file per store or domain (e.g. `useAuthStore.ts`, `useSettingsStore.ts`).
- **Hooks** that wrap stores: `hooks/` (e.g. `useAuth.ts` that re-exports or composes `useAuthStore`).

## Store pattern

```ts
// lib/stores/useSettingsStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "settings", storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

## When to create a new store vs extend

- **New domain** (auth, settings, cart): New file `lib/stores/useXStore.ts`.
- **Same domain, new slice**: Prefer adding to existing store; if file grows too large, split by slice (e.g. `useAuthStore.ts`, `useAuthProfileStore.ts`) and document.

## Persistence

Use Zustand `persist` with `@react-native-async-storage/async-storage`. Add `AsyncStorage` dependency if missing. Same pattern as above.

## Hooks

- For simple usage, components can import `useXStore` directly.
- For derived state or composition, add `hooks/useX.ts` that uses `useXStore` and returns the shape the UI needs.

## Rules

1. No Redux or other state libraries. Zustand only.
2. Keep stores in `lib/stores/`; do not put stores in `app/` or `components/`.
3. Type state and actions explicitly (TypeScript).
4. Do not put API calls inside stores; use hooks or API layer that call endpoints and then update the store.
