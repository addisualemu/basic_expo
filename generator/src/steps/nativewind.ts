import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import type { GeneratorConfig } from "../config";

function run(command: string, cwd: string) {
  execSync(command, {
    stdio: "inherit",
    cwd,
    env: process.env,
  });
}

export function setupNativeWind(config: GeneratorConfig) {
  if (!config.useNativeWind) return;

  const projectRoot = path.resolve(process.cwd(), config.projectName);

  console.log("\nInstalling NativeWind and Tailwind CSS...");
  run("npx expo install nativewind tailwindcss", projectRoot);
  run("npm install --save-dev babel-preset-expo", projectRoot);

  console.log("Writing Tailwind / NativeWind config files...");

  fs.writeFileSync(
    path.join(projectRoot, "tailwind.config.js"),
    `/** @type {import('tailwindcss').Config} */
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
`,
  );

  fs.writeFileSync(
    path.join(projectRoot, "global.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  );

  fs.writeFileSync(
    path.join(projectRoot, "babel.config.js"),
    `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel",
    ],
    plugins: [],
  };
};
`,
  );

  fs.writeFileSync(
    path.join(projectRoot, "metro.config.js"),
    `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
`,
  );

  fs.writeFileSync(
    path.join(projectRoot, "nativewind-env.d.ts"),
    `/// <reference types="nativewind/types" />
`,
  );
}

