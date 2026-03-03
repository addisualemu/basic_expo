#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("./prompts");
const createProject_1 = require("./steps/createProject");
const nativewind_1 = require("./steps/nativewind");
async function main() {
    console.log("Expo App Generator (TypeScript + NativeWind)");
    const config = await (0, prompts_1.runPrompts)();
    // 1. Create base Expo project
    (0, createProject_1.createExpoProject)(config);
    // 2. Setup NativeWind / Tailwind
    (0, nativewind_1.setupNativeWind)(config);
    console.log("\nDone! Next steps:");
    console.log(`  cd ${config.projectName}`);
    console.log("  npx expo start");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map