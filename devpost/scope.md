---
doc: scope
status: approved
---

# SprintClarify

An AI-powered Agile decomposition engine that transforms ambiguous business feature requests into strictly validated, production-ready epics, user stories with Gherkin acceptance criteria, and technical task dependencies.

## The Unique Kernel
Enforcing strict, zero-fluff structured outputs using Gemini's `responseSchema` to automatically decompose fuzzy requirements into actionable Agile artifacts—complete with Gherkin acceptance criteria, prerequisite/blocking dependency flags, and risk indicators—eliminating conversational fluff and manual ticket re-prompting.

## Who It's For
A Technical Project Manager, Scrum Master, or Tech Lead facing messy stakeholder emails, ambiguous PRDs, or executive Slack messages who normally spends hours manually deciphering and rewriting them into Jira/Linear-ready tickets.

## The Core Loop
The user pastes a messy feature request (or selects a sample prompt), clicks "Clarify & Decompose", and watches Gemini instantly return a validated dual-column breakdown: actionable stories on the left and a visual sequence flow on the right, ready to copy into issue trackers in one click.

## Inspiration & Identity
- Utilitarian, crisp single-screen developer dashboard with Tailwind CSS styling.
- Feels like modern agile developer tooling (Linear, GitHub Issues) rather than a chat assistant.
- Focused on speed, clean typography, and zero conversational chatter.

## Why This Matters to the Learner
Streamlining agile requirement refinement and turning ambiguous ideas into actionable development artifacts, while mastering clean structured outputs using `responseSchema` with the Google Gen AI SDK in a tight, agent-driven workflow.

## What "Working" Looks Like
In a 1-minute demo video:
1. Open the clean single-screen dashboard.
2. Click a sample prompt button (e.g. "Add biometric login to mobile app") or paste a vague feature request.
3. Click "Clarify & Decompose", showing an active skeleton state while Gemini processes.
4. Reveal the two-column view:
   - **Left Column**: Epics, User Stories with expandable Gherkin acceptance criteria, and technical prerequisites with risk flags.
   - **Right Column**: Structured dependency cards with directional flow badges ("Prerequisite for Story B", "Blocks Story C") and an auto-generated visual Mermaid.js sequence/flowchart.
5. Click "Copy Markdown" to grab clean, ticket-ready markdown ready for Jira or Linear.

## The POC Boundary
- Single-page dashboard in React with Tailwind CSS.
- Google Gen AI SDK integration utilizing Gemini structured JSON output (`responseSchema`).
- Pre-built sample prompts for fast demo repeatability.
- Left column: Epics, User Stories ("As a... I want to... So that..."), 3-4 bulleted Gherkin ACs, technical dependencies, and risk flags.
- Right column: Visual dependency cards with directional flow badges and rendered Mermaid.js diagram visualizing execution sequence.
- One-click "Copy Markdown" and "Export JSON" buttons.

## Later
- Direct API integration with Jira, Linear, or GitHub Issues.
- Multi-turn conversational editing or re-prompting of individual stories.
- Persistent backend/local storage for saving past clarified sessions.

## Explicitly Cut
- Physics-based interactive drag-and-drop canvas editing (e.g., React Flow with canvas manipulations) — cut to preserve dev time and keep visual generation reliable for the 2–4 hour PoC.
- User authentication and multi-user workspace management — irrelevant to proving the core decomposition loop.
- Full agile suite tooling (burndown charts, sprint capacity planning, poker estimation) — outside requirement clarification.
