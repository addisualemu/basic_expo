---
name: expo-atlassian-integration
description: Use Atlassian (Jira) via MCP when planning and deciding what to work on. Create Jira issues after writing PROJECT_BRIEF.md; answer "what should I work on?" from Jira when MCP is configured. Use when Atlassian MCP Jira tools are available and the user wants planning or task suggestions tied to Jira.
---

# Expo Atlassian integration (optional)

When the **Atlassian MCP server** is configured in Cursor, the AI can create Jira issues from the project brief and suggest the next task from Jira. This skill describes when and how to use Atlassian MCP Jira tools. If the Atlassian MCP is not available, all behavior falls back to PROJECT_BRIEF.md only (no errors).

## When to use

- **After writing PROJECT_BRIEF.md** (during expo-launch or expo-planning-facilitator): if Atlassian MCP Jira tools are available, create Jira issues for phases and tasks.
- **When the user asks "what should I work on?" or "what's next?"**: if Atlassian MCP tools are available, prefer suggesting the next item from Jira (query open issues); optionally still report PROJECT_BRIEF.md progress.

## Creating Jira issues from the brief

After PROJECT_BRIEF.md has been written:

1. **Check** whether Atlassian MCP Jira tools exist (e.g. issue creation, search). If not, skip and confirm only the brief.
2. **Get Jira project** — ask the user which Jira project to use (by project key, e.g. `APP`). If available, use the MCP to list projects and let the user pick. If the user declines or doesn't use Jira, skip creation.
3. **Optional: discover fields** — For Story Points and custom Acceptance Criteria, call `getJiraIssueTypeMetaWithFields` (or `getJiraProjectIssueTypesMetadata`) for the chosen project to find field IDs (e.g. Story Points is often `customfield_10016` or similar). Use these in `additional_fields` when creating issues.
4. **Mapping** (required for each issue): For each **phase** (e.g. "Phase 2: Authentication (High)") and each **task** (bullet under a phase), create one Jira issue per task with **all** of the following:

   - **Summary**: Short, clear task title (from the brief bullet).
   - **Description** (required, Markdown): A meaningful description (2–4 sentences) that includes:
     - **Context**: What this task is and why it matters in the app.
     - **Scope**: What is in scope and what is out of scope for this task.
     - **Done looks like**: One sentence on what “done” means (e.g. “User can sign in with email and see a home screen.”).
   - **Acceptance criteria**: In the **description**, add a clear section:
     ```markdown
     ## Acceptance criteria
     - [ ] Criterion 1 (testable, specific)
     - [ ] Criterion 2
     - [ ] ...
     ```
     Write 2–4 testable criteria per task (e.g. “User can tap Sign in and see the email/password form”, “Invalid credentials show an error message”). If the project has a dedicated Acceptance Criteria field (from metadata), also or instead populate that via `additional_fields`.
   - **Priority**: Map from the phase importance to Jira priority. Use `additional_fields` with the project’s Priority field (often `priority: { name: "High" }` or `priority: { id: "..." }`). Mapping: **High** (phase) → High; **Medium** → Medium; **Low** → Low.
   - **Story points** (estimated): Assign an estimate (1, 2, 3, 5, or 8) based on task size—small/clear = 1–2, medium = 3–5, large = 5–8. Pass via `additional_fields` using the project’s Story Points field ID (from step 3). If the field is not available, skip story points but still set description, acceptance criteria, and priority.
   - **Labels or component**: Phase name (e.g. "Phase-2-Authentication") via labels or the project’s component field in `additional_fields` if available.
   - **Issue type**: Task (or Story, depending on project config).

5. **Create issues** by calling the Atlassian MCP `createJiraIssue` tool with `summary`, `description`, and `additional_fields` (priority, story points, labels/components as applicable). Maintain the same order as in the brief.
6. **Confirm** to the user: "Created N issues in Jira project X with descriptions, acceptance criteria, priority, and story points. You can view them in your Jira board."

If creation fails (e.g. auth or permissions), report the error and suggest checking the Atlassian MCP authentication; do not block the planning flow.

## "What to work on?" from Jira

When the user asks what to do next, what's left, or what to work on:

1. **If Atlassian MCP Jira tools are available**:
   - Get the Jira project key (ask the user if unknown, or use the one from the session).
   - Query open issues (status not "Done") ordered by priority and creation order.
   - Show a short list of open issues (summary, priority, status).
   - **Suggest the next one** (highest priority, earliest created) and optionally map it to PROJECT_BRIEF.md for context.
   - When the user completes a task: if an update/transition tool exists, transition the issue to "Done"; otherwise rely on PROJECT_BRIEF.md checkbox updates.
2. **If Atlassian MCP is not available**:
   - Use **project-brief** skill only: read PROJECT_BRIEF.md, list unchecked tasks by phase, suggest the next task by phase order and importance.

## Fallback

- Never require Atlassian. If MCP is not configured or the user says they don't use Jira, rely only on PROJECT_BRIEF.md and confirm the brief was saved.
