export type NavigationChoice = "none" | "expo-router" | "react-navigation";
export type StateManagementChoice = "none" | "zustand" | "redux-toolkit";

export interface GeneratorConfig {
  projectName: string;
  navigation: NavigationChoice;
  stateManagement: StateManagementChoice;
  useNativeWind: boolean;
  useEslintPrettier: boolean;
  useEnv: boolean;
  initGit: boolean;
}

