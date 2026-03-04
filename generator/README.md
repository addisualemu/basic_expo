# Expo App Generator (TypeScript + NativeWind)

This is a **Node + TypeScript CLI** that scaffolds a new Expo project with sensible defaults and opinionated tooling.

The goal is to give you a **repeatable, configurable generator** that you can extend over time (navigation, state management, linting, env, folder structure, etc.).

---

## 1. Prerequisites

- **Node.js**: v18+ recommended (you are on Node 18.18.1, which is fine).
- **npm**: comes with Node.
- **Expo tooling**:
  - The generator itself calls `npx create-expo-app` and `npx expo install` for you.
  - You do **not** need to globally install Expo CLI; `npx` is enough.

Check your versions:

```bash
node -v
npm -v
```

---

## 2. Installation (local dev)

From the repo root (where `generator/` lives):

```bash
cd generator

# Install dependencies
npm install

# Build TypeScript -> dist
npm run build
```

You can now run the generator **locally** via:

```bash
node dist/index.js
```

For a nicer, global‑style CLI, also do:

```bash
npm link
```

After that, you can run:

```bash
create-expo-app-plus
```

from any directory.

---

## 3. What the generator does today

Current behavior (v1, minimal but structured):

1. **Asks you a few questions**
   - **Project name** (sanitized to lowercase, `a-z0-9_-`).
   - **Navigation** choice:
     - `None`
     - `Expo Router`
     - `React Navigation`
     - (The choice is captured but not yet wired to file templates.)
   - **State management** choice:
     - `None`
     - `Zustand`
     - `Redux Toolkit`
     - (Also captured in config, wiring to be added later.)

2. **Creates a base Expo app**

   Under the directory you run it from:

   - Runs:

     ```bash
     npx create-expo-app@latest <projectName> --template blank-typescript
     ```

   - This gives you a **managed Expo project** with TypeScript.

3. **Configures NativeWind (Tailwind for React Native)**

   Inside the new project folder, it:

   - Installs dependencies:

     ```bash
     npx expo install nativewind tailwindcss
     npm install --save-dev babel-preset-expo
     ```

   - Writes:
     - `tailwind.config.js` with `nativewind/preset` and content paths for `App`, `app/**`, and `src/**`.
     - `global.css` with the Tailwind layers.
     - `babel.config.js` using:

       ```js
       module.exports = function (api) {
         api.cache(true);
         return {
           presets: ["babel-preset-expo"],
           plugins: ["nativewind/babel"],
         };
       };
       ```

     - `metro.config.js` wired to NativeWind’s `withNativeWind` helper.
     - `nativewind-env.d.ts` with `/// <reference types="nativewind/types" />`.

4. **Prints next steps**

   At the end, it prints:

   ```bash
   cd <projectName>
   npx expo start
   ```

So you get a working **Expo + TypeScript + NativeWind** app in one go.

---

## 4. How to use the generator

### 4.1. Basic flow

From anywhere you want to create a new project folder:

```bash
create-expo-app-plus
```

Then:

1. Enter a **project name**.
2. Choose **navigation**.
3. Choose **state management**.

After it finishes:

```bash
cd <your-project-name>
npx expo start
```

Use `w` in the terminal to open the web UI, or scan the QR code with Expo Go.

---

## 5. Internals / Architecture

The generator is designed to be **modular and easy to extend**.

### 5.1. File layout

```text
generator/
  .cursor/
    skills/             # Cursor AI skills for generated apps (see §10)
      expo-app-conventions/
      expo-feature-builder/
      expo-ui-agent/
      expo-state-agent/
      expo-api-agent/
      expo-auth-flow/
      expo-navigation/
      expo-testing/
      expo-architecture-enforcer/
      expo-launch/
      project-brief/
  package.json          # Node package (CLI entry: create-expo-app-plus)
  tsconfig.json         # TypeScript config
  src/
    index.ts            # CLI entry, orchestrates the steps
    config.ts           # Shared Config/enum types
    prompts.ts          # All interactive questions (using prompts)
    steps/
      createProject.ts  # Creates the Expo project
      nativewind.ts     # Adds NativeWind/Tailwind config
  dist/                 # Compiled JavaScript output (after build)
```

### 5.2. Config shape

The `GeneratorConfig` is defined in `src/config.ts` and passed between steps:

- `projectName: string`
- `navigation: "none" | "expo-router" | "react-navigation"`
- `stateManagement: "none" | "zustand" | "redux-toolkit"`
- `useNativeWind: boolean`
- `useEslintPrettier: boolean`
- `useEnv: boolean`
- `initGit: boolean`

Right now, some booleans are **hardcoded to `true`** (NativeWind, ESLint/Prettier, env, git).  
In the future, you can:

- Expose them as prompts in `prompts.ts`, or
- Use CLI flags and merge them into the config.

### 5.3. Steps

Each step lives in `src/steps/` and takes `GeneratorConfig` as input.

- `createProject.ts`
  - Checks that the target directory **does not already exist**.
  - Calls `npx create-expo-app@latest <name> --template blank-typescript`.

- `nativewind.ts`
  - Installs required dependencies via `npx expo install` and `npm install`.
  - Writes Tailwind/NativeWind related config files into the project directory.

- `copyCursorSkills.ts`
  - Copies `generator/.cursor/skills/` into `<projectName>/.cursor/skills/` so the new app has the Expo skills when opened in Cursor.

The main CLI (`src/index.ts`) calls:

1. `runPrompts()` → get `config`
2. `createExpoProject(config)`
3. `setupNativeWind(config)`
4. `copyCursorSkills(config)` → copies `.cursor/skills/` into the new project

---

## 6. Extending the generator (suggested roadmap)

You plan to use this for months and keep expanding it. Here’s a practical roadmap.

### 6.1. Add navigation setup

Create `src/steps/navigation.ts`:

- Read `config.navigation`.
- If `"expo-router"`:
  - Install `expo-router`, configure `app/_layout.tsx`, `app/index.tsx`, update `package.json` main, etc.
- If `"react-navigation"`:
  - Install `@react-navigation/*`, create `src/navigation/RootNavigator.tsx`, and example screens.

Wire it in `src/index.ts` after `createExpoProject` and before/or after `setupNativeWind`.

### 6.2. Add state management

Create `src/steps/stateManagement.ts`:

- If `"zustand"`:
  - Install `zustand`.
  - Add simple store `src/store/useAppStore.ts`.
- If `"redux-toolkit"`:
  - Install `@reduxjs/toolkit` + `react-redux`.
  - Add `src/store/index.ts`, `src/store/slices/counterSlice.ts`, and hooks.

Again, call it from `src/index.ts`.

### 6.3. Add ESLint + Prettier, env, folder structure, git

For each concern, create a dedicated step module:

- `linting.ts` → installs ESLint/Prettier, writes `.eslintrc`, `.prettierrc`, scripts in `package.json`.
- `env.ts` → writes `.env` and `.env.example`.
- `folders.ts` → creates `src/components`, `src/hooks`, `src/utils`, etc., and some starter files.
- `git.ts` → initializes git repo and writes `.gitignore`.

Call them in series in `src/index.ts` so the overall flow is transparent.

---

## 7. Using templates (future improvement)

Right now, code files are written with inline strings in the step modules.  
As this grows, you’ll likely want to use **template files**:

```text
generator/
  templates/
    app/_layout.tsx.tpl
    app/index.tsx.tpl
    src/navigation/RootNavigator.tsx.tpl
    src/screens/HomeScreen.tsx.tpl
    ...
```

Then in a step:

```ts
import fs from "node:fs";
import path from "node:path";

const templatePath = path.join(__dirname, "..", "templates", "app", "index.tsx.tpl");
const template = fs.readFileSync(templatePath, "utf8");
const content = template.replace(/__APP_NAME__/g, config.projectName);
fs.writeFileSync(path.join(projectRoot, "app", "index.tsx"), content);
```

Benefits:

- Real TS/TSX files with syntax highlighting and formatting.
- No escaping hell in TypeScript strings.
- Easy to reuse across different generators or configs.

---

## 8. Troubleshooting

**Issue: `Error [ERR_REQUIRE_ESM]: require() of ES Module`**

- This can happen with some prompt libraries that are ESM‑only under Node 18.
- This generator intentionally uses **`prompts`** (with `@types/prompts`) which works fine in CommonJS.

**Issue: TypeScript compile errors about Node types**

- Make sure `tsconfig.json` includes:

  ```json
  "types": ["node"]
  ```

**Issue: Bundler complaints about `babel-preset-expo`**

- The `nativewind` step explicitly installs `babel-preset-expo` as a devDependency and configures `babel.config.js` accordingly.
- If you manually edit `babel.config.js`, keep:

  ```js
  presets: ["babel-preset-expo"],
  plugins: ["nativewind/babel"],
  ```

---

## 9. Quick command reference

From repo root:

```bash
cd generator
npm install        # install deps
npm run build     # compile TS -> dist
npm link          # (optional) make CLI global
```

From anywhere (after link):

```bash
create-expo-app-plus
```

Then:

```bash
cd <projectName>
npx expo start
```

You can now iteratively add new steps/modules to `src/steps` and wire them into `src/index.ts` to keep growing this generator over time.

---

## 10. Cursor skills (AI agents for generated apps)

The generator includes **Cursor skills** so that when you work on a **generated app** in Cursor, the AI can build features in a repeatable, opinionated way (Expo Router, Zustand, NativeWind, consistent folder structure).

### Where the skills live

- **In this repo**: `generator/.cursor/skills/`. Each skill is a folder with `SKILL.md` and optional `reference.md`.
- **In generated apps**: The generator **copies** `.cursor/skills/` into each new project (step after NativeWind). When you open the generated app in Cursor, the skills are already there. You can also copy them into `~/.cursor/skills/` for use in every project.

### Skills overview

| Skill | Purpose |
|-------|--------|
| **expo-app-conventions** | Single source of truth: folder structure (`app/`, `components/`, `lib/`, etc.), stack (Expo Router, Zustand, NativeWind), naming. Other skills follow this. |
| **expo-feature-builder** | Orchestrator. User says “add settings with dark mode” or “add auth”; it delegates to UI, state, API, auth, navigation, testing as needed. |
| **expo-ui-agent** | Screens and components with NativeWind only. `components/ui/`, `components/features/`, `components/layout/`, `constants/theme`. |
| **expo-state-agent** | Zustand stores in `lib/stores/`, persistence, hooks. No Redux. |
| **expo-api-agent** | API client in `lib/api/`, endpoints, types, data-fetching hooks. |
| **expo-auth-flow** | Login/signup screens, auth store, token persistence, protected routes with Expo Router. |
| **expo-navigation** | Expo Router: new routes, tabs, `_layout.tsx`. No React Navigation. |
| **expo-testing** | Unit/integration tests (Jest + React Native Testing Library) for components, hooks, stores. |
| **expo-architecture-enforcer** | Refactor an existing app to match the canonical folder structure and stack. |
| **expo-launch** | Discovery conversation in chat: ask what the user is building, follow up with questions, then write `.cursor/skills/project-brief/PROJECT_BRIEF.md` with phases and importance. Trigger: "launch", "lets get started", "what are we building". |
| **project-brief** | Resource: read PROJECT_BRIEF.md for this project's goals, phases, and priorities. If missing, suggest running expo-launch first. |

### How agents call other agents

- **expo-feature-builder** is the entry point for “add a feature”. It uses the delegation map in its SKILL.md to decide when to apply **expo-ui-agent**, **expo-state-agent**, **expo-api-agent**, **expo-auth-flow**, **expo-navigation**, and **expo-testing**.
- In Cursor, you can invoke the orchestrator by asking e.g. “Add a settings screen with dark mode that persists” or “Add login/signup flow”; the agent should apply **expo-feature-builder**, which in turn applies the sub-skills in order (state → API → auth → UI → navigation → testing).

### Canonical folder structure (summary)

Generated apps are expected to follow this layout (details in `expo-app-conventions/reference.md`):

```text
app/                 # Expo Router only
components/ui/       # Primitives (Button, Text, Input)
components/features/ # Feature components (LoginForm, SettingsForm)
components/layout/   # Screen shells (Screen, Container)
hooks/
lib/stores/         # Zustand
lib/api/            # API client, endpoints
lib/utils/
constants/           # theme.ts, config
assets/
```

