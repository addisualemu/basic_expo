"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNativeWind = setupNativeWind;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_child_process_1 = require("node:child_process");
function run(command, cwd) {
    (0, node_child_process_1.execSync)(command, {
        stdio: "inherit",
        cwd,
        env: process.env,
    });
}
function setupNativeWind(config) {
    if (!config.useNativeWind)
        return;
    const projectRoot = node_path_1.default.resolve(process.cwd(), config.projectName);
    console.log("\nInstalling NativeWind and Tailwind CSS...");
    run("npx expo install nativewind tailwindcss", projectRoot);
    run("npm install --save-dev babel-preset-expo", projectRoot);
    console.log("Writing Tailwind / NativeWind config files...");
    node_fs_1.default.writeFileSync(node_path_1.default.join(projectRoot, "tailwind.config.js"), `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
`);
    node_fs_1.default.writeFileSync(node_path_1.default.join(projectRoot, "global.css"), `@tailwind base;
@tailwind components;
@tailwind utilities;
`);
    node_fs_1.default.writeFileSync(node_path_1.default.join(projectRoot, "babel.config.js"), `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel",
    ],
    plugins: [],
  };
};
`);
    node_fs_1.default.writeFileSync(node_path_1.default.join(projectRoot, "metro.config.js"), `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
`);
    node_fs_1.default.writeFileSync(node_path_1.default.join(projectRoot, "nativewind-env.d.ts"), `/// <reference types="nativewind/types" />
`);
}
//# sourceMappingURL=nativewind.js.map