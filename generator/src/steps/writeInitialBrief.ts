import fs from "node:fs";
import path from "node:path";
import type { GeneratorConfig } from "../config";

function describeNavigation(choice: GeneratorConfig["navigation"]): string {
  switch (choice) {
    case "expo-router":
      return "Expo Router";
    case "react-navigation":
      return "React Navigation";
    case "none":
    default:
      return "None";
  }
}

function describeState(choice: GeneratorConfig["stateManagement"]): string {
  switch (choice) {
    case "zustand":
      return "Zustand";
    case "redux-toolkit":
      return "Redux Toolkit";
    case "none":
    default:
      return "None";
  }
}

export function writeInitialBrief(config: GeneratorConfig) {
  const projectRoot = path.resolve(process.cwd(), config.projectName);
  const briefDir = path.join(projectRoot, ".cursor", "skills", "project-brief");
  const briefPath = path.join(briefDir, "PROJECT_BRIEF.md");

  fs.mkdirSync(briefDir, { recursive: true });

  const navigation = describeNavigation(config.navigation);
  const state = describeState(config.stateManagement);

  const content = `# Project brief: ${config.projectName}

## Overview
This app was generated with the Expo App Generator.

Configuration:
- Navigation: ${navigation}
- State management: ${state}
- NativeWind: ${config.useNativeWind ? "Enabled" : "Disabled"}
- ESLint/Prettier: ${config.useEslintPrettier ? "Enabled" : "Disabled"}
- Env support: ${config.useEnv ? "Enabled" : "Disabled"}
- Git init: ${config.initGit ? "Enabled" : "Disabled"}

## Phase 1: Foundation (High)
- [ ] Verify the app boots: \`cd ${config.projectName} && npx expo start\`
- [ ] Review folder structure and available skills under \`.cursor/skills/\`

## Phase 2: Features (High)
- [ ] In Cursor chat, say **\"Launch\"** or **\"Lets get started\"** to run the **expo-launch** discovery flow.
- [ ] Let expo-launch update this brief with phases and priorities based on what you want to build.
`;

  fs.writeFileSync(briefPath, content, "utf8");
}

