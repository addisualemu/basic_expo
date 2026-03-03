import prompts from "prompts";
import type { GeneratorConfig, NavigationChoice, StateManagementChoice } from "./config";

export async function runPrompts(): Promise<GeneratorConfig> {
  const answers = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (value: string) => (value.trim() ? true : "Project name is required"),
      format: (value: string) =>
        value
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "-"),
    },
    {
      type: "select",
      name: "navigation",
      message: "Navigation:",
      choices: [
        { title: "None", value: "none" as NavigationChoice },
        { title: "Expo Router", value: "expo-router" as NavigationChoice },
        { title: "React Navigation", value: "react-navigation" as NavigationChoice },
      ],
      initial: 1,
    },
    {
      type: "select",
      name: "stateManagement",
      message: "State management:",
      choices: [
        { title: "None", value: "none" as StateManagementChoice },
        { title: "Zustand", value: "zustand" as StateManagementChoice },
        { title: "Redux Toolkit", value: "redux-toolkit" as StateManagementChoice },
      ],
      initial: 0,
    },
  ]);

  const staticConfig: Omit<
    GeneratorConfig,
    "projectName" | "navigation" | "stateManagement"
  > = {
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

