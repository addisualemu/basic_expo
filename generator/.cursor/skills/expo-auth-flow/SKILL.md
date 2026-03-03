---
name: expo-auth-flow
description: Implements auth flows (login, signup, logout) and protected routes in Expo apps with Zustand and Expo Router. Use when adding authentication, login/signup screens, token persistence, or guarded routes.
---

# Expo auth flow

Implements **authentication** end-to-end: auth store, login/signup screens, token persistence, and protected routes. Uses **expo-app-conventions**, **expo-state-agent** (store), **expo-ui-agent** (screens), and **expo-api-agent** (login/signup endpoints) patterns. This skill orchestrates them for auth specifically.

## When to use

- Add login, signup, or logout.
- Add protected routes (redirect unauthenticated users).
- Persist token/session (e.g. in Zustand + AsyncStorage).
- Wire auth state to API client (e.g. Bearer token).

## Pieces to implement

1. **Auth store** (`lib/stores/useAuthStore.ts`): `user`, `token`, `isAuthenticated`, `setAuth`, `logout`. Persist token (Zustand persist + AsyncStorage).
2. **API**: Login/signup endpoints in `lib/api/endpoints/auth.ts`; client attaches token from store (or auth header helper).
3. **Screens**: `app/(auth)/login.tsx`, `app/(auth)/signup.tsx` (or similar). Use **expo-ui-agent** style (NativeWind, components from `components/features/`).
4. **Protected routes**: In root `app/_layout.tsx` or a layout, check `useAuthStore.getState().isAuthenticated`; if false, redirect to login (e.g. `router.replace('/login')`). Use Expo Router groups: `(auth)` for login/signup, rest of app for authenticated screens.
5. **Redirect after login**: On success, set auth in store then `router.replace('/')` or intended destination.

## Route layout idea

- `app/(auth)/login.tsx`, `app/(auth)/signup.tsx` — no tab bar; for unauthenticated users.
- `app/(tabs)/_layout.tsx` + tabs — for authenticated users; guard in parent layout so unauthenticated users never see tabs.
- In `app/_layout.tsx`: read auth state; if not authenticated and route is not in `(auth)`, redirect to `/login`. If authenticated and route is `/login` or `/signup`, redirect to `/`.

## Rules

1. Do not introduce a different state library; use Zustand per **expo-state-agent**.
2. Keep login/signup UI in `app/(auth)/` and reuse components from `components/features/` (e.g. LoginForm).
3. Token in store + persistence; API client reads token from store for requests.
4. Use Expo Router only; no React Navigation.
