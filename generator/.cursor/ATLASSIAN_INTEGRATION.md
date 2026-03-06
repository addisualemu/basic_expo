# Optional: Atlassian (Jira) integration via MCP

When you use the **official Atlassian MCP server** with Cursor, the planning and "what to work on" flows can integrate with Jira for task tracking:

- **After planning:** When the AI writes `PROJECT_BRIEF.md`, it can create Jira issues for each task with appropriate priority and labels.
- **What to work on:** When you ask "what should I work on?", the AI can suggest the next item from Jira (open issues) instead of only reading the brief.

This is **optional**. If you don't install the Atlassian MCP, the AI continues to use only `PROJECT_BRIEF.md`.

---

## 1. Install the Atlassian MCP server

The Atlassian MCP is installed directly from Cursor — no CLI tools or npm packages required.

### Add the server to Cursor MCP config

1. **Open Cursor Settings** → **Features** → **MCP** (or edit the config file directly).
   - Config file location: `~/.cursor/mcp.json` (user-level) or project-level `.cursor/mcp.json`.
   - Merge in the Atlassian server:

```json
{
  "mcpServers": {
    "Atlassian": {
      "url": "https://mcp.atlassian.com/v1/mcp",
      "headers": {}
    }
  }
}
```

2. **Authenticate:** After adding the server and restarting Cursor, the Atlassian MCP will prompt you to authenticate with your Atlassian account. Follow the browser-based sign-in flow to grant access to your Jira (and/or Confluence) workspace.

3. **Restart Cursor** so it loads the new MCP server.

---

## 2. How the skills use Atlassian (Jira)

- **expo-atlassian-integration** skill: Tells the AI when to create Jira issues (after writing the brief, when Jira MCP tools are available) and when to answer "what to work on?" from Jira (query open issues). See `.cursor/skills/expo-atlassian-integration/SKILL.md`.
- **expo-planning-facilitator** / **expo-launch:** After writing `PROJECT_BRIEF.md`, if Atlassian MCP Jira tools are available, the AI will create issues in your Jira project for each task. If you don't use Atlassian or the MCP isn't configured, it only saves the brief.
- **project-brief:** When you ask "what should I work on?", if Atlassian MCP is available the AI will query Jira for open issues and suggest the next item; otherwise it uses only the brief.

---

## 3. Jira project

The first time the AI creates or queries issues, it will ask which Jira project to use (e.g. by project key like `APP` or `MYAPP`). You can reply once per session. The AI will use the Atlassian MCP tools to list available projects if needed.

---

## 4. Security

- The Atlassian MCP uses OAuth-based authentication through Atlassian's official service. Your credentials are handled by Atlassian's auth flow — no tokens or secrets are stored in your project.
- Do not commit `mcp.json` if it contains any sensitive configuration. The MCP config typically lives in `~/.cursor/mcp.json` (user-level), which is outside the repo.
