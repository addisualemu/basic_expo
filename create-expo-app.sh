#!/usr/bin/env bash
set -euo pipefail

# ─── Colors & Helpers ────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}ℹ ${NC}$1"; }
success() { echo -e "${GREEN}✔ ${NC}$1"; }
warn()    { echo -e "${YELLOW}⚠ ${NC}$1"; }
error()   { echo -e "${RED}✖ ${NC}$1"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}── $1 ──${NC}\n"; }

prompt_choice() {
  local prompt="$1"
  shift
  local options=("$@")
  local count=${#options[@]}

  echo -e "${BOLD}${prompt}${NC}"
  for i in "${!options[@]}"; do
    echo -e "  ${CYAN}$((i + 1)))${NC} ${options[$i]}"
  done

  while true; do
    read -rp "$(echo -e "${YELLOW}> Choose [1-${count}]: ${NC}")" choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= count )); then
      return $((choice - 1))
    fi
    echo -e "${RED}  Invalid choice. Try again.${NC}"
  done
}

# ─── Prerequisites Check ─────────────────────────────────────────────
header "Checking prerequisites"

command -v node  >/dev/null 2>&1 || error "Node.js is not installed. Install it first: https://nodejs.org"
command -v npx   >/dev/null 2>&1 || error "npx is not available. Install Node.js >= 18."

NODE_VER=$(node -v)
info "Node.js ${NODE_VER} detected"

# ─── Project Name ─────────────────────────────────────────────────────
header "Project Setup"

read -rp "$(echo -e "${BOLD}Enter project name: ${NC}")" PROJECT_NAME

if [[ -z "$PROJECT_NAME" ]]; then
  error "Project name cannot be empty."
fi

PROJECT_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_-]/-/g')
info "Sanitized project name: ${BOLD}${PROJECT_NAME}${NC}"

if [[ -d "$PROJECT_NAME" ]]; then
  error "Directory '${PROJECT_NAME}' already exists."
fi

# ─── Navigation Choice ────────────────────────────────────────────────
header "Navigation"

prompt_choice "Which navigation setup?" \
  "None (no navigation)" \
  "Expo Router (file-based routing)" \
  "React Navigation (stack + bottom tabs)"
NAV_CHOICE=$?

# ─── State Management Choice ─────────────────────────────────────────
header "State Management"

prompt_choice "Which state management?" \
  "None (just React state/context)" \
  "Zustand (lightweight)" \
  "Redux Toolkit"
STATE_CHOICE=$?

# ─── Summary ──────────────────────────────────────────────────────────
header "Configuration Summary"

NAV_LABELS=("None" "Expo Router" "React Navigation")
STATE_LABELS=("None" "Zustand" "Redux Toolkit")

echo -e "  Project name:       ${BOLD}${PROJECT_NAME}${NC}"
echo -e "  Language:           ${BOLD}TypeScript${NC}"
echo -e "  Navigation:         ${BOLD}${NAV_LABELS[$NAV_CHOICE]}${NC}"
echo -e "  State management:   ${BOLD}${STATE_LABELS[$STATE_CHOICE]}${NC}"
echo -e "  Styling:            ${BOLD}NativeWind (Tailwind CSS)${NC}"
echo -e "  Linting:            ${BOLD}ESLint + Prettier${NC}"
echo -e "  Env variables:      ${BOLD}Yes (.env)${NC}"
echo -e "  Git:                ${BOLD}Yes${NC}"
echo -e "  Folder structure:   ${BOLD}Yes${NC}"
echo ""

read -rp "$(echo -e "${YELLOW}Proceed? (Y/n): ${NC}")" CONFIRM
if [[ "${CONFIRM,,}" == "n" ]]; then
  warn "Aborted."
  exit 0
fi

# ─── Create Expo Project ─────────────────────────────────────────────
header "Creating Expo project"

npx create-expo-app@latest "$PROJECT_NAME" --template blank-typescript
cd "$PROJECT_NAME"

success "Expo project created"

# ─── Install Essential Packages ───────────────────────────────────────
header "Installing essential packages"

npx expo install expo-status-bar expo-constants expo-splash-screen

success "Essential packages installed"

# ─── Navigation Setup ─────────────────────────────────────────────────
if [[ $NAV_CHOICE -eq 1 ]]; then
  header "Setting up Expo Router"

  npx expo install expo-router expo-linking expo-constants expo-status-bar

  # Update package.json main entry
  node -e "
    const pkg = require('./package.json');
    pkg.main = 'expo-router/entry';
    require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "

  # Create app directory for file-based routing
  mkdir -p app

  cat > app/_layout.tsx << 'LAYOUT'
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: true }} />;
}
LAYOUT

  cat > app/index.tsx << 'INDEX'
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Home Screen</Text>
      <Text className="mt-2 text-gray-500">Edit app/index.tsx to get started</Text>
    </View>
  );
}
INDEX

  # Update app.json for expo-router
  node -e "
    const appJson = require('./app.json');
    appJson.expo.scheme = '${PROJECT_NAME}';
    appJson.expo.web = appJson.expo.web || {};
    appJson.expo.web.bundler = 'metro';
    require('fs').writeFileSync('app.json', JSON.stringify(appJson, null, 2) + '\n');
  "

  # Remove default App.tsx since expo-router uses app/ directory
  rm -f App.tsx

  success "Expo Router configured"

elif [[ $NAV_CHOICE -eq 2 ]]; then
  header "Setting up React Navigation"

  npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
    react-native-screens react-native-safe-area-context

  mkdir -p src/navigation src/screens

  cat > src/screens/HomeScreen.tsx << 'HOME'
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Home Screen</Text>
      <Text className="mt-2 text-gray-500">Edit src/screens/HomeScreen.tsx</Text>
    </View>
  );
}
HOME

  cat > src/screens/SettingsScreen.tsx << 'SETTINGS'
import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Settings</Text>
    </View>
  );
}
SETTINGS

  cat > src/navigation/RootNavigator.tsx << 'NAV'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
NAV

  cat > App.tsx << 'APP'
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return <RootNavigator />;
}
APP

  success "React Navigation configured"
fi

# ─── State Management Setup ──────────────────────────────────────────
if [[ $STATE_CHOICE -eq 1 ]]; then
  header "Setting up Zustand"

  npx expo install zustand

  mkdir -p src/store

  cat > src/store/useAppStore.ts << 'STORE'
import { create } from "zustand";

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
STORE

  success "Zustand configured with example store"

elif [[ $STATE_CHOICE -eq 2 ]]; then
  header "Setting up Redux Toolkit"

  npx expo install @reduxjs/toolkit react-redux

  mkdir -p src/store src/store/slices

  cat > src/store/slices/counterSlice.ts << 'SLICE'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
SLICE

  cat > src/store/index.ts << 'STOREINDEX'
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
STOREINDEX

  cat > src/store/hooks.ts << 'HOOKS'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
HOOKS

  success "Redux Toolkit configured with example slice"
fi

# ─── NativeWind (Tailwind CSS) Setup ─────────────────────────────────
header "Setting up NativeWind"

npx expo install nativewind tailwindcss

# Ensure babel-preset-expo is installed (required by babel.config.js)
npm install --save-dev babel-preset-expo

# Create tailwind.config.js
cat > tailwind.config.js << 'TWCFG'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
TWCFG

# Create global.css
cat > global.css << 'GLOBALCSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
GLOBALCSS

# Create/update babel.config.js for NativeWind
cat > babel.config.js << 'BABEL'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
BABEL

# Create metro.config.js for NativeWind
cat > metro.config.js << 'METRO'
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
METRO

# Create nativewind-env.d.ts for type support
cat > nativewind-env.d.ts << 'NWENV'
/// <reference types="nativewind/types" />
NWENV

success "NativeWind configured"

# ─── ESLint + Prettier Setup ─────────────────────────────────────────
header "Setting up ESLint + Prettier"

npm install --save-dev eslint prettier eslint-config-expo eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

cat > .eslintrc.json << 'ESLINT'
{
  "extends": [
    "expo",
    "prettier",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["prettier", "@typescript-eslint"],
  "rules": {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
ESLINT

cat > .prettierrc << 'PRETTIER'
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true
}
PRETTIER

cat > .prettierignore << 'PIGNORE'
node_modules
.expo
dist
build
*.lock
PIGNORE

# Add lint/format scripts to package.json
node -e "
  const pkg = require('./package.json');
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.lint = 'eslint . --ext .ts,.tsx';
  pkg.scripts.format = 'prettier --write \"src/**/*.{ts,tsx}\" \"app/**/*.{ts,tsx}\" \"*.{ts,tsx,js,json}\"';
  require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

success "ESLint + Prettier configured"

# ─── Environment Variables Setup ─────────────────────────────────────
header "Setting up environment variables"

npx expo install expo-constants

cat > .env << 'ENV'
# App environment variables
# Access via expo-constants or babel plugin
API_URL=https://api.example.com
APP_ENV=development
ENV

cat > .env.example << 'ENVEX'
# Copy this file to .env and fill in values
API_URL=
APP_ENV=
ENVEX

success "Environment variables configured"

# ─── Folder Structure ────────────────────────────────────────────────
header "Creating folder structure"

FOLDERS=(
  src/components
  src/hooks
  src/utils
  src/constants
  src/types
  src/services
  assets/images
  assets/fonts
)

# Only create these if not using Expo Router (which has its own app/ dir)
if [[ $NAV_CHOICE -ne 1 ]]; then
  FOLDERS+=(src/screens)
fi

for folder in "${FOLDERS[@]}"; do
  mkdir -p "$folder"
done

# Create placeholder files so git tracks empty folders
for folder in "${FOLDERS[@]}"; do
  if [[ ! "$(ls -A "$folder" 2>/dev/null)" ]]; then
    touch "$folder"/.gitkeep
  fi
done

# Create useful utility files
cat > src/constants/colors.ts << 'COLORS'
export const Colors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
} as const;
COLORS

cat > src/types/index.ts << 'TYPES'
export type {};
TYPES

cat > src/hooks/useBoolean.ts << 'USEBOOL'
import { useCallback, useState } from "react";

export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return { value, setTrue, setFalse, toggle } as const;
}
USEBOOL

success "Folder structure created"

# ─── Git Setup ────────────────────────────────────────────────────────
header "Initializing Git"

git init

cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native builds
ios/
android/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# TypeScript
*.tsbuildinfo
GITIGNORE

git add -A
git commit -m "Initial commit: Expo TypeScript app with NativeWind"

success "Git repository initialized"

# ─── Done ─────────────────────────────────────────────────────────────
header "All done!"

echo -e "${GREEN}${BOLD}Your project '${PROJECT_NAME}' is ready!${NC}\n"
echo -e "  ${CYAN}cd ${PROJECT_NAME}${NC}"
echo -e "  ${CYAN}npx expo start${NC}\n"
echo -e "Useful commands:"
echo -e "  ${CYAN}npm run lint${NC}      - Run ESLint"
echo -e "  ${CYAN}npm run format${NC}    - Format code with Prettier"
echo -e ""
success "Happy coding!"
