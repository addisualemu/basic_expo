"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPrompts = runPrompts;
const prompts_1 = __importDefault(require("prompts"));
async function runPrompts() {
    const answers = await (0, prompts_1.default)([
        {
            type: "text",
            name: "projectName",
            message: "Project name:",
            validate: (value) => (value.trim() ? true : "Project name is required"),
            format: (value) => value
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "-"),
        },
        {
            type: "select",
            name: "navigation",
            message: "Navigation:",
            choices: [
                { title: "None", value: "none" },
                { title: "Expo Router", value: "expo-router" },
                { title: "React Navigation", value: "react-navigation" },
            ],
            initial: 1,
        },
        {
            type: "select",
            name: "stateManagement",
            message: "State management:",
            choices: [
                { title: "None", value: "none" },
                { title: "Zustand", value: "zustand" },
                { title: "Redux Toolkit", value: "redux-toolkit" },
            ],
            initial: 0,
        },
    ]);
    const staticConfig = {
        useNativeWind: true,
        useEslintPrettier: true,
        useEnv: true,
        initGit: true,
    };
    return {
        projectName: answers.projectName,
        navigation: answers.navigation,
        stateManagement: answers.stateManagement,
        ...staticConfig,
    };
}
//# sourceMappingURL=prompts.js.map