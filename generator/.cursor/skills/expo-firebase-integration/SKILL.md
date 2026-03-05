---
name: expo-firebase-integration
description: Use Firebase (Firestore) via MCP when planning and deciding what to work on. Create task documents in Firestore after writing PROJECT_BRIEF.md; answer "what should I work on?" from Firestore when MCP is configured. Use when Firebase MCP Firestore tools are available and the user wants planning or task suggestions tied to Firestore.
---

# Expo Firebase integration (optional)

When the **Firebase MCP server** is configured in Cursor with Firestore tools, the AI can create task documents in Firestore from the project brief and suggest the next task from Firestore. This skill describes when and how to use Firebase MCP Firestore tools. If Firebase MCP is not available, all behavior falls back to PROJECT_BRIEF.md only (no errors).

## When to use

- **After writing PROJECT_BRIEF.md** (during expo-launch or expo-planning-facilitator): if Firebase MCP Firestore tools are available and an add/create tool exists, create task documents in Firestore for phases and tasks.
- **When the user asks "what should I work on?" or "what's next?"**: if Firebase MCP tools are available, prefer suggesting the next item from Firestore (query tasks with status != done); optionally still report PROJECT_BRIEF.md progress.

## Creating tasks in Firestore from the brief

After PROJECT_BRIEF.md has been written:

1. **Check** whether Firebase MCP Firestore create/add tools exist (e.g. `firestore_add_documents` or similar). If not, skip and confirm only the brief.
2. **Get collection path** from `.cursor/firebase-tasks.txt` (one line: collection path, e.g. `tasks`) or ask the user. Example: "Which Firestore collection should I use for tasks (e.g. tasks)?" If the user declines or doesn't use Firebase, skip creation.
3. **Mapping** (default): For each **phase** (e.g. "Phase 2: Authentication (High)") and each **task** (bullet under a phase), create one Firestore document per task with fields:
   - `title`: task text
   - `phase`: phase name (e.g. "Phase 2: Authentication (High)")
   - `importance`: High | Medium | Low (from phase heading)
   - `status`: `todo`
   - `order`: number for ordering (phase order, then task order within phase)
4. **Create documents** by calling the Firebase MCP add/create tool. Use the same order as in the brief.
5. **Confirm** to the user: "Created N task documents in Firestore collection X. You can view them in the Firebase console."

If creation fails (e.g. auth or permissions), report the error and suggest checking Firebase CLI login and MCP config; do not block the planning flow.

## "What to work on?" from Firestore

When the user asks what to do next, what's left, or what to work on:

1. **If Firebase MCP Firestore tools are available** (e.g. `firestore_query_collection`, `firestore_get_documents`):
   - Get collection path from `.cursor/firebase-tasks.txt` or ask the user if unknown.
   - Query the tasks collection for documents where `status != 'done'` (or equivalent; filter for open tasks). Order by `order` or by phase/importance.
   - Show a short list of open tasks (title, phase, importance, status if available).
   - **Suggest the next one** (e.g. lowest order, or first by phase then importance) and optionally map it to PROJECT_BRIEF.md for context.
   - Optionally: read PROJECT_BRIEF.md and mention how many tasks are done vs remaining for context.
   - When the user completes a task: if an update tool exists (e.g. update document to set `status: 'done'`), use it; otherwise rely on PROJECT_BRIEF.md checkbox updates.
2. **If Firebase MCP is not available**:
   - Use **project-brief** skill only: read PROJECT_BRIEF.md, list unchecked tasks by phase, suggest the next task by phase order and importance.

## Config

- **Collection path**: User can provide once (e.g. "Use collection tasks"); the AI can store it in memory for the session or the user can create `.cursor/firebase-tasks.txt` with a single line = collection path (e.g. `tasks`) so the AI can read it next time. Optionally use `projectId/collectionPath` if the project is not the default.
- **Document shape**: Default fields are `title`, `phase`, `importance`, `status` (`todo` | `done`), `order`. If the MCP or user uses different field names, adapt accordingly.

## Fallback

- Never require Firebase. If MCP is not configured or the user says they don't use Firebase, rely only on PROJECT_BRIEF.md and confirm the brief was saved.
