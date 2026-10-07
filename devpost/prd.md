---
doc: prd
status: approved
---

# SprintClarify — Product Requirements

SprintClarify is an AI-powered Agile decomposition dashboard that transforms ambiguous business requests into strictly validated epics, user stories with Gherkin acceptance criteria, and technical task dependency graphs for Technical Project Managers, Scrum Masters, and Tech Leads.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, and `scope.md > The Core Loop`.

## The Core Journey
1. **Arrival**: The user opens the web application and lands on a dark-mode single-screen dashboard. A top input area contains an empty prompt textarea with helper text, a disabled "Clarify & Decompose" button, and three clickable starter cards. Below the input, a dashed placeholder area invites action.
2. **Input Selection**: The user either types their own ambiguous feature request into the textarea or clicks one of the three starter cards (e.g., "Mobile Biometric Auth", "CSV Export & Scheduled Reports", "Webhook Event Notifications"), which immediately populates the textarea and enables the submit button.
3. **Execution**: The user clicks "Clarify & Decompose". The input button enters a loading state, and the dashed placeholder is replaced by loading skeletons in a two-column layout.
4. **Decomposition Output**: Gemini processes the request via structured schema and returns validated JSON. The UI renders:
   - **Left Column**: Epics badge, structured User Stories (formatted as "As a... I want to... So that...") expanded by default with bulleted Gherkin acceptance criteria, prerequisite/blocking badges, and technical risk tags.
   - **Right Column**: Visual dependency cards with directional relationship pills alongside an auto-rendered visual Mermaid.js dependency/sequence flowchart.
5. **Story Review & Copying**:
   - The user can collapse/expand story cards via an accordion toggle.
   - The user can click an individual "Copy" button on any story card to copy ticket-formatted Markdown to clipboard for a single ticket.
   - The user can click "Export All Markdown" or "Export JSON" in the results header to grab the entire sprint package for Jira, Linear, or GitHub Issues.
6. **Error / Retry Path**: If the AI request fails, an inline dismissible error banner appears above the input with a "Retry" button, preserving the user's input text.

## Screens and Layout
- **Single-Screen Surface**: A unified viewport with no page navigation.
  - **Header**: Project branding ("SprintClarify"), tagline, and links/status.
  - **Prompt Bar**: Full-width card with multi-line textarea, sample starter prompt pills, character count, and the primary "Clarify & Decompose" button.
  - **Results Workspace (Appears after submission)**:
    - **Results Header**: Summary badge (Total Epics, Stories, Technical Risks identified) + Global action buttons ("Export All Markdown", "Export JSON", "Clear / New").
    - **Dual-Column Grid**:
      - **Left (60% width)**: Backlog Breakdown — Epic milestones, User Story cards with Gherkin acceptance criteria list and accordion toggles.
      - **Right (40% width)**: Dependency & Sequence Matrix — Sequence flow visualization via Mermaid.js diagram and stacked dependency cards with directional badges.

## Look and Feel
- **Theme**: Dark-mode first inspired by Linear and Raycast.
- **Color Palette**:
  - Background: Deep slate / neutral zinc (`#09090b` main, `#18181b` card surface, `#27272a` borders).
  - Primary Accent: Indigo/violet (`#6366f1`) for primary CTA buttons, active focus rings, and highlighted states.
  - Acceptance Criteria: Emerald (`#10b981`) for completed/verified Gherkin checkmarks.
  - Technical Risks & Warnings: Amber (`#f59e0b`) for risk level badges and prerequisite warnings.
  - Text: Bright white (`#f4f4f5`) for primary headings, zinc (`#a1a1aa`) for body/secondary copy.
- **Typography**: Clean modern sans-serif (Inter/Geist) for interface copy; tabular/monospaced font (JetBrains Mono / Roboto Mono) for story IDs (`US-01`, `EPIC-01`), JSON view, and code elements.

## Features and Behavior

### 1. Requirement Input & Starter Cards
Source: `scope.md > The Core Loop`.
- The textarea accepts freeform text.
- Three quick-start prompt pills are rendered directly above or below the textarea:
  - "Mobile Biometric Auth"
  - "CSV Export & Scheduled Reports"
  - "Webhook Event Notifications"
- Clicking any pill fills the textarea with an intentionally ambiguous real-world requirement prompt.
- The submit button remains disabled until at least 10 characters are entered.

### 2. Structured Agile Decomposition
Source: `scope.md > The Unique Kernel`.
- Converts ambiguous input into a strictly validated schema containing:
  - Epics: Title, business milestone objective.
  - Stories: ID (e.g. `US-01`), Title, User Story format ("As a [role], I want [feature], so that [value]"), 3-4 bulleted Gherkin acceptance criteria (`Given... When... Then...`), estimated complexity/size tag.
  - Technical Dependencies: Architectural components (frontend, backend, third-party API), prerequisites ("Depends on US-XX"), and potential risk flags.
- Displays loading skeleton cards while request is in flight.

### 3. Story Interaction & Clipboard Export
Source: `scope.md > What "Working" Looks Like`.
- Stories render expanded by default; clicking the card header collapses it into a compact single-line summary with status pills.
- Each story card has a 1-click "Copy" icon button that formats that specific story as clean Jira/Linear-ready markdown with Gherkin bullet points.
- Header toolbar has "Export All Markdown" which generates a comprehensive sprint backlog document copied to clipboard.
- "Export JSON" button downloads or copies the raw validated JSON.

### 4. Dependency Flow Visualization
Source: `scope.md > What "Working" Looks Like`.
- Generates a Mermaid.js flowchart (`graph TD` or `sequenceDiagram`) visualizing the prerequisite path between stories and technical tasks.
- Renders directional badge pills on each dependency card indicating "Prerequisite for..." or "Blocks...".

## States and Boundaries

- **First Use / Empty State**: Input textarea is empty. Below the input, a dashed zinc placeholder container explains the workflow and highlights the starter cards.
- **Active Generation / Loading State**: Primary button shows a spinning indicator and text "Decomposing requirements...". Results area shows animated shimmer skeleton cards for both columns.
- **Populated / Success State**: Full dual-column dashboard rendered with all generated Epics, Stories, Gherkin criteria, risks, and Mermaid flow.
- **Input Validation State**: If input is under 10 characters or blank, submit button is disabled with an inline tooltip ("Enter at least 10 characters to clarify").
- **API Error State**: If the AI request fails (network error, rate limit, schema validation error), a dismissible amber/red banner appears above the input with the error reason and a "Retry" button. Input text is retained.

## Product Decisions

- **Dark-mode first with Linear aesthetic**: Chosen to appeal directly to technical PMs, engineers, and developers who work in Linear, GitHub, and terminal environments.
- **Render stories expanded by default**: Allows immediate scannability of acceptance criteria without forcing multiple clicks during a fast 1-minute video demo.
- **Mermaid.js sequence flow over drag-and-drop canvas**: Minimizes implementation risk while delivering high visual value and clarity in under 2–4 hours of build time.
- **Dual-level copy actions**: Solves both single-story triage (pasting into a Slack thread or individual ticket) and entire sprint backlog export.

## What We're Building
- Single-screen responsive dashboard with dark theme.
- Input textarea with 3 preset starter prompts and validation.
- Gemini API integration enforcing agile structured schema.
- Left column with Epics, collapsible Story cards, Gherkin criteria, and risk flags.
- Right column with Mermaid diagram visualizer and dependency cards.
- Individual story copy and global Markdown/JSON export.
- Shimmer loading skeletons and error banner with retry capability.

## Deferred From the POC
- Direct webhook/OAuth sync into Jira, Linear, or GitHub Issues API (adds OAuth authentication overhead and external configuration).
- Interactive editing / re-prompting of individual story criteria in-line.
- LocalStorage history / persistence of multiple past generation sessions.

## Possible Later Enhancements
- Export directly to Jira/Linear via API key or webhook.
- AI refinement chat assistant to adjust acceptance criteria interactively.
- Multi-project sprint board organization.

## Non-Goals
- Full project management software (no drag-and-drop sprint boards, velocity metrics, or burndown charts).
- User authentication and multi-user collaboration (solo TPM utility for POC).
- Heavy graphical canvas editors (no node dragging or manual layout editing).

## Open Questions
- None blocking specification. Framework choice (Vite SPA vs. Next.js) will be formalized in `4-spec`.
