---
name: project-brief
description: Reads the project brief (PROJECT_BRIEF.md) for goals, phases, and task priorities. Use when implementing features, planning work, or when the user asks what to do next, what's left, or what to prioritize.
---

# Project brief (resource)

This skill points to a **resource file** that defines what the project is and what to build, in phases and by importance. Task status is tracked with Markdown checkboxes: `- [ ]` = not done, `- [x]` = done.

## When to use

- User asks what to build next, what's left, what to prioritize, or how to approach the app.
- You are about to implement a feature: check the brief for phase order and importance so you align with the user’s stated goals.
- After **expo-launch** has run, this file exists; read it to stay consistent with the discovery conversation.

## Resource file

- **Path**: [PROJECT_BRIEF.md](PROJECT_BRIEF.md) in this folder (`.cursor/skills/project-brief/PROJECT_BRIEF.md` in the workspace).
- If the file is missing, suggest the user run the **expo-launch** flow first ("Say 'launch' or 'lets get started' to define what we're building.").

## "What to do next" (priority view)

When the user asks **what to do next**, **what's left**, **what should I work on**, or **priorities**:

1. **If Firebase MCP tools are available** (e.g. firestore_query_collection, firestore_get_documents): Follow **expo-firebase-integration** skill — query Firestore for tasks with status != done, list open tasks, suggest the next one, and optionally mention PROJECT_BRIEF.md progress for context.
2. **If Firebase MCP is not available**, use the brief only:
   - **Read** PROJECT_BRIEF.md and parse **only unchecked** tasks (`- [ ]`). Ignore tasks already marked done (`- [x]`).
   - **List** remaining tasks grouped by phase, with importance in the heading (e.g. "Phase 1: Foundation (High)").
   - **Suggest** the next task to do: first by **phase order** (Phase 1 before Phase 2), then by **importance** (High before Medium before Low). Give one clear recommendation, e.g. "Next: Phase 1 — Set up Expo Router and base layout (High)."
   - If all tasks are done, say so and suggest running **expo-launch** again if they want to add more scope, or that the brief is complete.

## How to use it when implementing

- Read PROJECT_BRIEF.md when planning or implementing.
- Prefer tasks in **phase order** (Phase 1 before Phase 2, etc.) and **importance** (High before Medium before Low).
- When adding a feature, check whether it appears in the brief and at which phase/importance; use that to order work and to remind the user of scope.
- When you **complete** a feature that matches a task in the brief, **update** PROJECT_BRIEF.md: change that task's checkbox from `- [ ]` to `- [x]` so "what to do next" stays accurate.
