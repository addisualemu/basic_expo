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
}

