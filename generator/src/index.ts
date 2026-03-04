#!/usr/bin/env node
import type { GeneratorConfig } from "./config";
import { runPrompts } from "./prompts";
import { copyCursorSkills } from "./steps/copyCursorSkills";
import { createExpoProject } from "./steps/createProject";
import { setupNativeWind } from "./steps/nativewind";
import { writeInitialBrief } from "./steps/writeInitialBrief";

async function main() {
  console.log("Expo App Generator (TypeScript + NativeWind)");

  const config: GeneratorConfig = await runPrompts();

  // 1. Create base Expo project
  createExpoProject(config);

  // 2. Setup NativeWind / Tailwind
  setupNativeWind(config);

  // 3. Copy Cursor skills into project
  copyCursorSkills(config);

  // 4. Seed initial project brief for this app
  writeInitialBrief(config);

  console.log("\nDone! Next steps:");
  console.log(`  cd ${config.projectName}`);
  console.log("  npx expo start");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

