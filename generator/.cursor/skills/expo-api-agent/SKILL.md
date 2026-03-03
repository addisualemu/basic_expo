---
name: expo-api-agent
description: Adds and edits API client, endpoints, types, and data-fetching hooks for Expo apps. Use when wiring REST/API calls, typed client, or env-based base URL in an Expo app.
---

# Expo API agent

Creates and edits the **API layer** in `lib/api/`. Typed client, endpoints, and hooks. Follow **expo-app-conventions** for paths. Does not implement UI; works with **expo-state-agent** and **expo-ui-agent** for screens that use data.

## When to use

- Add or change API client (base URL, auth headers, fetch wrapper).
- Add endpoints for a domain (users, posts, etc.).
- Add TypeScript types for requests/responses.
- Add hooks that fetch data (e.g. useUser, usePosts) for use in screens.

## Placement

| Item | Location | Example |
|------|----------|---------|
| Base client | `lib/api/client.ts` | createClient(), request(), base URL from env |
| Endpoints | `lib/api/endpoints/<domain>.ts` | getMe(), getPosts(), createPost() |
| Types | `lib/api/types.ts` or per-endpoint | User, Post, ApiError |
| Hooks | `hooks/` | useUser.ts, usePosts.ts (call endpoints, expose loading/error/data) |

## Client pattern

- Base URL from `process.env.EXPO_PUBLIC_API_URL` or similar (Expo env vars).
- Single client (e.g. fetch wrapper or axios instance) with interceptors for auth if needed.
- Typed request/response; handle errors consistently (e.g. throw or return Result).

```ts
// lib/api/client.ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

## Endpoints

- One file per domain under `lib/api/endpoints/` (e.g. `auth.ts`, `posts.ts`).
- Functions call `request()` or the shared client; return typed data.

## Hooks

- Data-fetching hooks in `hooks/`: call endpoint, manage loading/error/data (useState + useEffect or a small data-fetch pattern). Expose `{ data, isLoading, error, refetch }` or similar.
- Do not put raw fetch in components; keep it in hooks or client.

## Rules

1. No UI in this layer; only client, endpoints, types, and data hooks.
2. Use env for base URL; document required vars (e.g. in README or .env.example).
3. Prefer typed responses; define types next to endpoints or in lib/api/types.ts.
4. If the app uses auth, client should attach token (from store or param); coordinate with **expo-auth-flow** / **expo-state-agent** for token source.
