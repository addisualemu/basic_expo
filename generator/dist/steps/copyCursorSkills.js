"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyCursorSkills = copyCursorSkills;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/**
 * Copies generator's .cursor/skills/ into the generated project's .cursor/skills/.
 * When run from dist/, __dirname is generator/dist/steps, so generator root is ../..
 */
function copyCursorSkills(config) {
    const projectRoot = node_path_1.default.resolve(process.cwd(), config.projectName);
    const generatorRoot = node_path_1.default.resolve(__dirname, "..", "..");
    const sourceDir = node_path_1.default.join(generatorRoot, ".cursor", "skills");
    const destDir = node_path_1.default.join(projectRoot, ".cursor", "skills");
    if (!node_fs_1.default.existsSync(sourceDir)) {
        console.warn("\nSkipping Cursor skills copy: source .cursor/skills/ not found.");
        return;
    }
    console.log("\nCopying Cursor skills into project...");
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(destDir), { recursive: true });
    node_fs_1.default.cpSync(sourceDir, destDir, { recursive: true });
    console.log("  -> .cursor/skills/");
}
//# sourceMappingURL=copyCursorSkills.js.map