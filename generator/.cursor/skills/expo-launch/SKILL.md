---
name: expo-launch
description: Runs a discovery conversation to find out what app the user is building, then generates a project brief (phases and importance). Use when the user says "launch", "lets get started", "what are we building", "project discovery", or wants to define scope and priorities before building.
---

# Expo launch (project discovery)

Conduct a **conversation in chat** to discover what the user wants to build. When you have enough information, **write** the project brief to `.cursor/skills/project-brief/PROJECT_BRIEF.md` so other skills (and you) can use it for phases and priorities.

## When to use

- User says: "launch", "lets get started", "what are we building", "project discovery", "help me plan this app", or similar.
- Do **not** use for: adding a specific feature (use expo-feature-builder), or one-off questions.

## Question format (multiple choice)

- **Prefer multiple-choice questions** so the user can answer by selecting an option (e.g. replying "A" or "B", or using any clickable/suggested replies the interface offers).
- **First question only**: "What are we building?" can be free text (short answer).
- **All follow-up questions**: Present as **multiple choice** with clear labels. Use this format so options are easy to click or reply to:

  **Format:** One question per message, then list options on separate lines with bold letters:

  ```
  [Question?]

  **A.** [Option A]
  **B.** [Option B]
  **C.** [Option C]
  ```

  Use 2–5 options per question. Accept replies like "A", "B", "a", "1" (if you number them), or the full option text. If the user types something else that clearly matches an option, treat it as that option.

- **Optional short free text**: You may occasionally ask "Anything else to prioritize for v1?" as a final open question; keep the rest multiple choice.

## Conversation flow

1. **Start** with one free-text question: "What are we building?" (or "What app do you want to create?").
2. **Follow up with multiple-choice questions** based on their answer. Examples (always use the A/B/C format above):
   - Who are the main users? **A.** Employees / internal **B.** Students **C.** General public **D.** Other (describe)
   - Do you need authentication (login/signup)? **A.** Yes **B.** No
   - Will the app use an API or backend? **A.** Yes **B.** No / local only
   - Offline or local persistence? **A.** Yes, persist key data locally **B.** No
   - Navigation style? **A.** Tabs **B.** Stack (back/forward) **C.** Both
   - Any of these for v1? **A.** Settings screen **B.** Onboarding **C.** Dark mode **D.** None of these / skip
3. **Continue** until you have a clear picture: app purpose, main features, auth/API/persistence, and rough priorities. Prefer 4–8 multiple-choice questions total.
4. **Then say** you have enough and that you are generating the project brief. Generate the brief (see format below) and **write it** to the file path below.

## Where to write the brief

- **Path**: `.cursor/skills/project-brief/PROJECT_BRIEF.md` (in the **current workspace** root).
- Create the directory `.cursor/skills/project-brief/` if it does not exist.
- Overwrite the file if it already exists.

## PROJECT_BRIEF.md format

Generate markdown that other skills can use. Use this structure:

```markdown
# Project brief: [Short title from discovery]

## Overview
[1–3 sentences: what the app is, who it’s for, and key choices from the conversation, e.g. auth, API, persistence.]

## Phase 1: Foundation (High)
- [ ] Set up Expo Router and base layout
- [ ] Set up Zustand and base store
- [ ] Configure NativeWind and theme

## Phase 2: [Name from discovery] (High)
- [ ] [Task 1]
- [ ] [Task 2]
...

## Phase 3: [Name] (High or Medium)
...

## Phase 4: Polish (Medium)
- [ ] Settings screen
- [ ] Error and loading states
- [ ] Basic tests for critical flows
```

- **Phases**: Order by dependency (foundation first, then core features, then polish). Name phases from the conversation (e.g. "Authentication", "API & data", "Core attendance flow").
- **Importance**: Use High / Medium / Low in the phase heading. High = must-have for v1; Medium = important; Low = nice-to-have.
- **Tasks**: Concrete, actionable items. Use checkboxes `- [ ]` so progress can be tracked.
- **Stack**: Assume Expo Router, Zustand, NativeWind (per expo-app-conventions). Do not add Redux or React Navigation.

Fill phases 2–3 (and optionally more) from what the user said; keep Phase 1 and Phase 4 (Polish) as above unless the conversation suggests otherwise.

## After writing

- Confirm to the user that the brief was saved and where (`.cursor/skills/project-brief/PROJECT_BRIEF.md`).
- **Atlassian (optional):** If Atlassian MCP Jira tools are available, follow the **expo-atlassian-integration** skill: ask the user which Jira project to use, then create issues in Jira for each task. If the user declines or the Atlassian MCP is not configured, skip this and only confirm the brief.
- Tell them they can ask to implement features next; you (and expo-feature-builder) will use the brief for phases and priorities. They can also ask **"what should I work on?"** (from Jira if MCP is configured, else from the brief).
