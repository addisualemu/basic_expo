"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeInitialBrief = writeInitialBrief;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function describeNavigation(choice) {
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
function describeState(choice) {
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
function writeInitialBrief(config) {
    const projectRoot = node_path_1.default.resolve(process.cwd(), config.projectName);
    const briefDir = node_path_1.default.join(projectRoot, ".cursor", "skills", "project-brief");
    const briefPath = node_path_1.default.join(briefDir, "PROJECT_BRIEF.md");
    node_fs_1.default.mkdirSync(briefDir, { recursive: true });
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
    node_fs_1.default.writeFileSync(briefPath, content, "utf8");
}
//# sourceMappingURL=writeInitialBrief.js.map