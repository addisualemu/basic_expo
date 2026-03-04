import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { GeneratorConfig } from "../config";

function run(command: string, options: { cwd?: string } = {}) {
  execSync(command, {
    stdio: "inherit",
    cwd: options.cwd,
    env: process.env,
  });
}

export function ensureProjectDirDoesNotExist(projectName: string) {
  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory '${projectName}' already exists.`);
  }
}

export function createExpoProject(config: GeneratorConfig) {
  ensureProjectDirDoesNotExist(config.projectName);

  console.log("\nCreating Expo project (blank TypeScript)...");
  run(`npx create-expo-app@latest ${config.projectName} --template blank-typescript`);

  const projectRoot = path.resolve(process.cwd(), config.projectName);
  console.log("\nEnsuring Expo web dependencies are installed (react-dom, react-native-web)...");
  run("npx expo install react-dom react-native-web", { cwd: projectRoot });

  addEasScripts(projectRoot);
}

function addEasScripts(projectRoot: string) {
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
    scripts?: Record<string, string>;
    [key: string]: unknown;
  };
  if (!pkg.scripts) pkg.scripts = {};
  pkg.scripts.build = "eas build --local -p ios --profile preview";
  pkg.scripts.deploy = "eas build --profile preview --platform ios";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

