---
name: expo-navigation
description: Adds and edits Expo Router routes, layouts, and tab groups. Use when adding new screens, tabs, or layout groups in an Expo app.
---

# Expo navigation

Creates and edits **Expo Router** routes and layouts only. No React Navigation. Follow **expo-app-conventions** for `app/` structure and naming.

## When to use

- Add a new screen/route.
- Add or change tab bar (e.g. (tabs) layout).
- Add a route group (e.g. (auth), (tabs)).
- Change root or group layout (_layout.tsx).

## Placement

- **Routes**: One file per route under `app/`. File path = URL path. `app/settings.tsx` → `/settings`.
- **Groups**: Use parentheses. `app/(tabs)/index.tsx` → `/` when (tabs) is the default; `app/(tabs)/settings.tsx` → `/settings`. Group name is not in the URL.
- **Layouts**: `_layout.tsx` in a directory defines layout for that segment (e.g. tab navigator in `app/(tabs)/_layout.tsx`).

## Tab layout example

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
```

## Adding a new route

- New screen: create `app/<path>.tsx` or `app/(group)/<path>.tsx`. Export default component.
- If using tabs: add `<Tabs.Screen name="..." />` in `app/(tabs)/_layout.tsx` and create the file `app/(tabs)/<name>.tsx`.

## Rules

1. Expo Router only; no `@react-navigation/*` for stack/tabs (Expo Router uses it under the hood).
2. Keep route components thin; put UI in `components/` and import.
3. Use groups to separate auth vs main app; guard in layout per **expo-auth-flow** if needed.
4. File naming: match route name (index.tsx for index, kebab or same as screen name for others).
