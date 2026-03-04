import fs from "node:fs";
import path from "node:path";
import type { GeneratorConfig } from "../config";

/**
 * Copies generator's .cursor/agents/ into the generated project's .cursor/agents/.
 * When run from dist/, __dirname is generator/dist/steps, so generator root is ../..
 */
export function copyCursorAgents(config: GeneratorConfig) {
  const projectRoot = path.resolve(process.cwd(), config.projectName);
  const generatorRoot = path.resolve(__dirname, "..", "..");
  const sourceDir = path.join(generatorRoot, ".cursor", "agents");
  const destDir = path.join(projectRoot, ".cursor", "agents");

  if (!fs.existsSync(sourceDir)) {
    console.warn("\nSkipping Cursor agents copy: source .cursor/agents/ not found.");
    return;
  }

  console.log("\nCopying Cursor agents into project...");
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });
  console.log("  -> .cursor/agents/");
}
