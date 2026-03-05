---
name: expo-jira-integration
description: Use Jira via MCP when planning and deciding what to work on. Create Jira tickets after writing PROJECT_BRIEF.md; answer "what should I work on?" from Jira when MCP is configured. Use when Jira MCP tools are available and the user wants planning or task suggestions tied to Jira.
---

# Expo Jira integration (optional)

When a **Jira MCP server** is configured in Cursor, the AI can create Jira issues from the project brief and suggest the next task from Jira. This skill describes when and how to use Jira MCP tools. If Jira MCP is not available, all behavior falls back to PROJECT_BRIEF.md only (no errors).

## When to use

- **After writing PROJECT_BRIEF.md** (during expo-launch or expo-planning-facilitator): if Jira MCP tools are available, create Jira issues for phases and tasks.
- **When the user asks "what should I work on?" or "what's next?"**: if Jira MCP tools are available, prefer suggesting the next item from Jira (e.g. sprint or assignee); optionally still report PROJECT_BRIEF.md progress.

## Creating Jira tickets from the brief

After PROJECT_BRIEF.md has been written:

1. **Check** whether Jira MCP tools exist (e.g. `create_issue`, `create_jira_issue`, or similar). If not, skip and confirm only the brief.
2. **Ask for Jira project key** if not already known (e.g. from a prior message or `.cursor/jira-project.txt`). Example: "Which Jira project key should I use (e.g. MYAPP)?" If the user declines or doesn't use Jira, skip creation.
3. **Mapping** (default; user can override):
   - Each **phase** (e.g. "Phase 2: Authentication (High)") → create one **Epic** (or parent Story) with title like "[Phase 2] Authentication" and description = phase name + importance.
   - Each **task** (bullet under a phase) → create a **Story** or **Task** with summary = task text, linked to the phase's Epic/parent. Use the same order as in the brief.
4. **Create issues** by calling the Jira MCP tool(s). Link child issues to the parent Epic/Story for that phase. If the tool only creates single issues, create Epics first, then create Stories/Tasks and set the parent link if the API supports it.
5. **Confirm** to the user: "Created N Jira issues in project X (Y Epics, Z Stories/Tasks). You can view them in Jira."

If creation fails (e.g. auth or permissions), report the error and suggest checking MCP config and Jira API token; do not block the planning flow.

## "What to work on?" from Jira

When the user asks what to do next, what's left, or what to work on:

1. **If Jira MCP tools are available** (e.g. `search_jira`, `jql_search`, `list_issues`, or similar):
   - Call the tool to list relevant issues. Prefer JQL such as:
     - `assignee = currentUser() AND status != Done ORDER BY priority DESC`
     - Or `sprint in openSprints() ORDER BY rank` if the project uses sprints.
   - Show a short list of open issues (key, summary, status, priority if available).
   - **Suggest the next one** (e.g. top result or by priority) and optionally map it to a phase/task in PROJECT_BRIEF.md if you can match by title.
   - Optionally: read PROJECT_BRIEF.md and mention how many tasks are done vs remaining for context.
2. **If Jira MCP is not available**:
   - Use **project-brief** skill only: read PROJECT_BRIEF.md, list unchecked tasks by phase, suggest the next task by phase order and importance.

## Project key and config

- **Project key**: User can provide once (e.g. "Use project MYAPP"); the AI can store it in memory for the session or the user can create `.cursor/jira-project.txt` with a single line = project key (e.g. `MYAPP`) so the AI can read it next time.
- **Issue types**: Default to Epic for phases and Story (or Task) for tasks. Different Jira projects use different types; if the MCP or user specifies others, use those.

## Fallback

- Never require Jira. If MCP is not configured or the user says they don't use Jira, rely only on PROJECT_BRIEF.md and confirm the brief was saved.
