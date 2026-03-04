---
name: expo-env-agent
description: Adds and edits environment config, .env, EXPO_PUBLIC_* vars, and lib/env.ts for Expo apps. Use when setting up or changing env vars, API base URL, feature flags, or documenting required env in the generated app.
---

# Expo env agent

Creates and edits **environment and config** for the app: `.env`, `.env.example`, typed access in `lib/env.ts`, and validation of required vars. Follow **expo-app-conventions** for paths. Works with **expo-api-agent** (which uses env for base URL).

## When to use

- Add or change environment variables (API URL, feature flags, keys).
- Create or update `.env.example` and document required vars.
- Add typed env access (e.g. `lib/env.ts`) so the rest of the app uses one place for env.
- Validate required env at startup or in a single module.

## Placement

| Item | Location | Example |
|------|----------|---------|
| Typed env / validation | `lib/env.ts` | `env.API_URL`, `env.ENABLE_FEATURE_X` |
| Example for developers | `.env.example` | `EXPO_PUBLIC_API_URL=`, `EXPO_PUBLIC_FEATURE_X=` |
| Actual values (git-ignored) | `.env` | Do not commit; ensure `.env` is in `.gitignore` |

## Rules

1. **Expo env**: Use `EXPO_PUBLIC_*` for vars that must be available in the client (Expo/Metro injects these at build).
2. **Single module**: Prefer one `lib/env.ts` that reads `process.env.EXPO_PUBLIC_*` and exports a typed object (or validated schema). Rest of app imports from `lib/env.ts`, not `process.env` directly.
3. **Document**: Keep `.env.example` in sync with required vars; add a short comment in README or in-file if needed.
4. **Validation**: Optionally validate required vars in `lib/env.ts` and throw or log clearly at startup if missing (e.g. in dev).

## Pattern

```ts
// lib/env.ts
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
const EXPO_PUBLIC_FEATURE_X = process.env.EXPO_PUBLIC_FEATURE_X === "true";

export const env = {
  API_URL: EXPO_PUBLIC_API_URL,
  FEATURE_X: EXPO_PUBLIC_FEATURE_X,
} as const;
```

```bash
# .env.example
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_FEATURE_X=false
```

## Coordination

- **expo-api-agent**: API client should use `env.API_URL` (or the name chosen in `lib/env.ts`) for base URL rather than reading `process.env` in the client file.
- **expo-app-conventions**: `lib/` is the right place for `lib/env.ts`; no UI in this layer.
