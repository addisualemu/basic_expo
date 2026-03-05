# Optional: Jira integration via MCP

When you use a **Jira MCP server** with Cursor, the planning and "what to work on" flows can integrate with Jira:

- **After planning:** When the AI writes `PROJECT_BRIEF.md`, it can create Jira issues (Epic per phase, Story/Task per task) in your project.
- **What to work on:** When you ask "what should I work on?", the AI can suggest the next item from Jira (e.g. your open issues or sprint backlog) instead of only reading the brief.

This is **optional**. If you don't configure Jira MCP, the AI continues to use only `PROJECT_BRIEF.md`.

---

## Do I need to change anything in the generated project?

**No.** Jira host, email, and API key are **not** stored in the generated project. They go in **Cursor’s MCP config** (e.g. `~/.cursor/mcp.json`), which is on your machine and outside the repo. You configure that once in Cursor; it applies to any project where you use the Jira MCP server.

**In the generated project** you only have two options, both optional:

- **Nothing** — When the AI creates tickets, it will ask for the Jira project key (e.g. `MYAPP`) in chat. You can reply once per session.
- **Project key file** — To avoid being asked every time, create `.cursor/jira-project.txt` in the project with a single line: your Jira project key (e.g. `MYAPP`). This is not a secret (project keys appear in Jira URLs).

No `.env` or other config in the generated app is needed for Jira.

---

## 1. Install and configure a Jira MCP server

Cursor uses MCP servers defined in your config. You need to add a Jira MCP server and provide credentials.

### Option A: Use an existing Jira MCP package

Examples (pick one and follow its README):

- **jira-mcp-server** (Node): [adam-israel/jira-mcp-server](https://github.com/adam-israel/jira-mcp-server) — run via `npx` or install globally.
- **jira-mcp-cursor** (Python): `pip install jira-mcp-cursor` — see [PyPI](https://pypi.org/project/jira-mcp-cursor/).

### Option B: Add the server to Cursor MCP config

1. **Get a Jira API token**
   - Log in to [Atlassian account security](https://id.atlassian.com/manage-profile/security/api-tokens).
   - Create an API token and copy it.

2. **Edit Cursor MCP config**
   - Open Cursor Settings → Features → MCP (or edit the config file directly).
   - Config file location: `~/.cursor/mcp.json` (user-level) or project-level if your setup uses it.
   - Merge in the Jira server. Example (adapt `command`/`args` to the server you use):

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "jira-mcp-server"],
      "env": {
        "JIRA_HOST": "yourcompany.atlassian.net",
        "JIRA_EMAIL": "your-email@example.com",
        "JIRA_API_TOKEN": "YOUR_API_TOKEN"
      }
    }
  }
}
```

- **JIRA_HOST:** Your Atlassian host, e.g. `mycompany.atlassian.net` (no `https://`).
- **JIRA_EMAIL:** Email for your Jira/Atlassian account.
- **JIRA_API_TOKEN:** The token you created.

3. **Restart Cursor** so it loads the new MCP server.

A full example snippet is in [mcp.jira.example.json](mcp.jira.example.json) in this folder.

---

## 2. How the skills use Jira

- **expo-jira-integration** skill: Tells the AI when to create Jira issues (after writing the brief) and when to answer "what to work on?" from Jira (list/suggest issues). See `.cursor/skills/expo-jira-integration/SKILL.md`.
- **expo-planning-facilitator** / **expo-launch:** After writing `PROJECT_BRIEF.md`, if Jira MCP tools are available, the AI will ask for your Jira project key (e.g. `MYAPP`) and create issues. If you don’t use Jira or don’t provide a key, it only saves the brief.
- **project-brief:** When you ask "what should I work on?", if Jira MCP is available the AI will query Jira (e.g. your open issues or sprint) and suggest the next item; otherwise it uses only the brief.

---

## 3. Project key

The first time the AI creates tickets from a brief, it will ask: *"Which Jira project key should I use?"* Reply with your project key (e.g. `MYAPP`). You can also create a file `.cursor/jira-project.txt` in your project with a single line containing the project key so the AI can read it next time.

---

## 4. Security

- **Do not commit** `mcp.json` or any file containing your `JIRA_API_TOKEN`.
- Keep the token in environment variables or in your user-level Cursor config (e.g. `~/.cursor/mcp.json`), which is typically not in the repo.
