"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureProjectDirDoesNotExist = ensureProjectDirDoesNotExist;
exports.createExpoProject = createExpoProject;
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function run(command, options = {}) {
    (0, node_child_process_1.execSync)(command, {
        stdio: "inherit",
        cwd: options.cwd,
        env: process.env,
    });
}
function ensureProjectDirDoesNotExist(projectName) {
    const targetDir = node_path_1.default.resolve(process.cwd(), projectName);
    if (node_fs_1.default.existsSync(targetDir)) {
        throw new Error(`Directory '${projectName}' already exists.`);
    }
}
function createExpoProject(config) {
    ensureProjectDirDoesNotExist(config.projectName);
    console.log("\nCreating Expo project (blank TypeScript)...");
    run(`npx create-expo-app@latest ${config.projectName} --template blank-typescript`);
}
//# sourceMappingURL=createProject.js.map