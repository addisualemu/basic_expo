# Optional: Firebase integration via MCP

When you use the **Firebase MCP server** with Cursor, the planning and "what to work on" flows can integrate with Firestore for task tracking:

- **After planning:** When the AI writes `PROJECT_BRIEF.md`, it can create task documents in a Firestore collection (e.g. `tasks`) with status `todo` or `done`.
- **What to work on:** When you ask "what should I work on?", the AI can suggest the next item from Firestore (tasks with status != done) instead of only reading the brief.

This is **optional**. If you don't configure Firebase MCP, the AI continues to use only `PROJECT_BRIEF.md`.

---

## Do I need to change anything in the generated project?

**No.** Firebase credentials are **not** stored in the generated project. The Firebase MCP server uses the same credentials that authorize the Firebase CLI (e.g. `firebase login` or Application Default Credentials). You configure the MCP server once in Cursor; it applies to any project where you use it.

**In the generated project** you have two options, both optional:

- **Nothing** — When the AI creates or queries tasks, it will ask for the Firestore collection path (e.g. `tasks`) in chat. You can reply once per session.
- **Config file** — To avoid being asked every time, create `.cursor/firebase-tasks.txt` in the project with a single line: your Firestore collection path (e.g. `tasks`). For a specific project ID you can use `projectId/collectionPath` if needed. This is not a secret.

No `.env` or other config in the generated app is required for Firebase task tracking.

---

## 1. Install and configure the Firebase MCP server

Cursor uses MCP servers defined in your config. Add the official Firebase MCP server.

### Prerequisites

- Node.js and npm installed.
- Firebase CLI authenticated (run once): `npx firebase-tools@latest login`

### Add the server to Cursor MCP config

1. **Edit Cursor MCP config**
   - Open Cursor Settings → Features → MCP (or edit the config file directly).
   - Config file location: `~/.cursor/mcp.json` (user-level) or project-level if your setup uses it.
   - Merge in the Firebase server. Example:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "mcp"]
    }
  }
}
```

2. **Optional:** To scope the server to a project directory (where `firebase.json` lives), add `--dir` and the absolute path. To limit tools to Firestore only, add `--only firestore`:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "firebase-tools@latest",
        "mcp",
        "--dir", "/absolute/path/to/your/project",
        "--only", "firestore"
      ]
    }
  }
}
```

3. **Restart Cursor** so it loads the new MCP server.

A full example snippet is in [mcp.firebase.example.json](mcp.firebase.example.json) in this folder.

---

## 2. How the skills use Firebase

- **expo-firebase-integration** skill: Tells the AI when to create task documents in Firestore (after writing the brief, when an add/create tool is available) and when to answer "what to work on?" from Firestore (query tasks with status != done). See `.cursor/skills/expo-firebase-integration/SKILL.md`.
- **expo-planning-facilitator** / **expo-launch:** After writing `PROJECT_BRIEF.md`, if Firebase MCP Firestore tools are available, the AI will ask for your collection path (or read `.cursor/firebase-tasks.txt`) and create task documents. If you don't use Firebase or don't provide a path, it only saves the brief.
- **project-brief:** When you ask "what should I work on?", if Firebase MCP is available the AI will query Firestore for open tasks and suggest the next item; otherwise it uses only the brief.

---

## 3. Collection path

The first time the AI creates or queries tasks from a brief, it will ask: *"Which Firestore collection should I use for tasks (e.g. tasks)?"* Reply with your collection path (e.g. `tasks`). You can also create a file `.cursor/firebase-tasks.txt` in your project with a single line containing the collection path so the AI can read it next time.

---

## 4. Security

- **Do not commit** `mcp.json` or any file containing secrets. Firebase MCP uses your existing Firebase CLI login or Application Default Credentials; keep those secure and out of the repo.
- Credentials live in your environment or user-level Cursor config (e.g. `~/.cursor/mcp.json`), which is typically not in the repo.
