#!/usr/bin/env node
import type { GeneratorConfig } from "./config";
import { runPrompts } from "./prompts";
import { createExpoProject } from "./steps/createProject";
import { setupNativeWind } from "./steps/nativewind";

async function main() {
  console.log("Expo App Generator (TypeScript + NativeWind)");

  const config: GeneratorConfig = await runPrompts();

  // 1. Create base Expo project
  createExpoProject(config);

  // 2. Setup NativeWind / Tailwind
  setupNativeWind(config);

  console.log("\nDone! Next steps:");
  console.log(`  cd ${config.projectName}`);
  console.log("  npx expo start");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

