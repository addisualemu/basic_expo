---
name: expo-ui-agent
description: Creates and edits screens and components for Expo apps using NativeWind (Tailwind) only. Use when adding or changing UI, screens, layout components, or design tokens in an Expo + NativeWind app.
---

# Expo UI agent

Creates and edits **screens and components** in the generated app. Uses **NativeWind only** (Tailwind via `className`). Follow **expo-app-conventions** for paths and stack.

## When to use

- Add or edit screens, pages, or components.
- Style with Tailwind (colors, spacing, typography, layout).
- Add or update design tokens (constants/theme).
- Build layout shells (Screen, Container) or primitives (Button, Input, Card).

## Placement

| Type | Location | Example |
|------|----------|--------|
| Route/screen (Expo Router) | `app/**/*.tsx` | `app/(tabs)/index.tsx`, `app/settings.tsx` |
| Primitive UI | `components/ui/` | Button.tsx, Text.tsx, Input.tsx, Card.tsx |
| Feature-specific UI | `components/features/` | LoginForm.tsx, SettingsSection.tsx |
| Layout shells | `components/layout/` | Screen.tsx, Container.tsx, SafeScreen.tsx |
| Design tokens | `constants/theme.ts` | colors, spacing, radii, font sizes |

## Rules

1. **Styling**: Use `className` with Tailwind classes. Do not use `StyleSheet.create` for layout or visual styling.
2. **RN primitives**: Use React Native components: `View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, etc. Style them with `className` (NativeWind).
3. **Theme**: Prefer tokens from `constants/theme.ts` (e.g. `className="bg-primary"`) over raw Tailwind when the project defines them; otherwise use standard Tailwind classes.
4. **Components**: Export from `components/ui/` or `components/features/` and import in `app/` or other components. Keep one main component per file unless small related pieces.

## Screen pattern

Screens in `app/` should be thin: layout + composition of components.

```tsx
// app/(tabs)/settings.tsx
import { View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { SettingsForm } from "@/components/features/SettingsForm";

export default function SettingsScreen() {
  return (
    <Screen title="Settings">
      <SettingsForm />
    </Screen>
  );
}
```

## Primitive example (Button)

```tsx
// components/ui/Button.tsx
import { Pressable, Text } from "react-native";

type ButtonProps = {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary";
};

export function Button({ onPress, children, variant = "primary" }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-4 py-3 ${variant === "primary" ? "bg-primary" : "bg-secondary"}`}
    >
      <Text className="text-white font-medium">{children}</Text>
    </Pressable>
  );
}
```

## Path alias

Assume `@/` points at project root (e.g. `@/components/ui/Button`, `@/lib/stores/useAuthStore`). If the project has no alias, use relative imports; suggest adding `@/*` in tsconfig and babel/metro if missing.

## Do not

- Introduce Redux, React Navigation, or StyleSheet-based styling.
- Put business logic or API calls in `components/ui/`; keep those in hooks/stores and pass props or use hooks in `components/features/`.
