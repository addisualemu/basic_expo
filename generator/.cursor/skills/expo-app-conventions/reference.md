# Expo app structure reference

Use this layout in every generated app. All other Expo skills assume this structure.

## Root layout

```
<projectRoot>/
  app/                 # Expo Router (file-based routes only)
  components/
  hooks/
  lib/
  constants/
  assets/
  app.json
  package.json
  tailwind.config.js
  global.css
  ...
```

## Directory roles

| Path | Purpose |
|------|--------|
| `app/` | Expo Router only. One route per file. Use groups `(tabs)`, `(auth)` for layout groups. |
| `components/ui/` | Primitive UI: Button, Text, Input, Card. Reusable, no feature logic. |
| `components/features/` | Feature-specific components: LoginForm, SettingsSection. May use stores/hooks. |
| `components/layout/` | Screen shells: Screen, Container, SafeScreen. |
| `hooks/` | React hooks (useAuth, useTheme). May wrap store selectors. |
| `lib/stores/` | Zustand stores only. One file per store or domain. |
| `lib/api/` | API client, endpoint functions, request/response types. |
| `lib/utils/` | Pure helpers (formatDate, cn). |
| `constants/` | theme.ts (colors, spacing), config.ts. Design tokens for NativeWind. |

## Stack (fixed)

- **Routing**: Expo Router. No React Navigation.
- **State**: Zustand. No Redux.
- **Styling**: NativeWind (Tailwind). Use `className`; no StyleSheet for layout/styling.
- **Language**: TypeScript strict.

## Naming

- **Files**: kebab-case for utilities/config; PascalCase for components/screens (e.g. `LoginForm.tsx`, `use-auth.ts`).
- **Routes**: File name = route path. `app/settings.tsx` → `/settings`; `app/(tabs)/index.tsx` → `/` when inside (tabs).
- **Stores**: `useXStore.ts` or `xStore.ts` in `lib/stores/`.

## Key files

- `app/_layout.tsx`: Root layout; wrap with providers (stores, theme).
- `app/(tabs)/_layout.tsx`: Tab navigator layout.
- `constants/theme.ts`: Colors, spacing, radii for Tailwind and components.
- `lib/stores/`: All Zustand stores.
- `lib/api/client.ts`: Base fetch/axios client; `lib/api/endpoints/` for domain endpoints.
