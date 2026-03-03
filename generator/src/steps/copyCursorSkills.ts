import fs from "node:fs";
import path from "node:path";
import type { GeneratorConfig } from "../config";

/**
 * Copies generator's .cursor/skills/ into the generated project's .cursor/skills/.
 * When run from dist/, __dirname is generator/dist/steps, so generator root is ../..
 */
export function copyCursorSkills(config: GeneratorConfig) {
  const projectRoot = path.resolve(process.cwd(), config.projectName);
  const generatorRoot = path.resolve(__dirname, "..", "..");
  const sourceDir = path.join(generatorRoot, ".cursor", "skills");
  const destDir = path.join(projectRoot, ".cursor", "skills");

  if (!fs.existsSync(sourceDir)) {
    console.warn("\nSkipping Cursor skills copy: source .cursor/skills/ not found.");
    return;
  }

  console.log("\nCopying Cursor skills into project...");
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });
  console.log("  -> .cursor/skills/");
}
