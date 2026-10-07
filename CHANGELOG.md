# Changelog

All notable changes to **SprintClarify** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-10-08

### Changed
- **Gemini 3.8 Flash Engine Upgrade**: Upgraded the core decomposition model from `gemini-2.5-flash` to `gemini-3.8-flash` using the official Google Gen AI SDK (`@google/genai`).
- **Header Status Badge**: Updated the live model indicator in `Header.tsx` to reflect active Gemini 3.8 Flash connectivity.
- **Documentation**: Updated architecture map (`devpost/app-map.html`) and project `README.md` to reference Gemini 3.8 Flash.

---

## [0.1.0] - 2026-10-07

### Added

#### Slice 1: Scaffold & Structured Gemini Decomposition Engine
- Initialized React 18 + Vite 6 Single Page Application with TypeScript.
- Configured Tailwind CSS utility styling with Linear/Raycast dark theme (`#09090b` / `#18181b`).
- Integrated `@google/genai` with strict `responseSchema` enforcing typed JSON payloads:
  - Epics (`id`, `title`, `objective`).
  - User Stories (`id`, `epicId`, `title`, `asA`, `iWant`, `soThat`, `acceptanceCriteria`, `complexity`, `dependsOn`, `blocks`, `technicalRisks`).
  - Mermaid diagram syntax string.
- Created `PromptInput` with character counter and 3 preset starter pills ("Mobile Biometric Auth", "CSV Export & Scheduled Reports", "Webhook Event Notifications").
- Implemented `LoadingSkeleton` shimmer state for zero layout shift during API execution.
- Added deterministic offline mock fallback in `src/lib/starterPrompts.ts` for instant testing without an active API key.

#### Slice 2: Interactive Backlog Workspace & Jira Exports
- Implemented `StoryCard` component with collapsible accordion state.
- Rendered Gherkin acceptance criteria (`Given / When / Then`) with emerald check icons.
- Added technical risk warnings with amber alert indicators and relative complexity tags (`S`, `M`, `L`).
- Implemented 1-click single story Markdown copy formatted for direct Jira, Linear, or GitHub Issue creation.
- Implemented `ExportBar` with aggregate sprint metrics (total epics, stories, and risks) and master "Export All Markdown" / "Export JSON" clipboard actions.
- Built `src/lib/markdownExporter.ts` and verified with automated assertions.

#### Slice 3: Visual Dependency Matrix & Error Resilience
- Implemented `MermaidVisualizer` using client-side `mermaid` SVG rendering with dark theme variables.
- Added syntax fallback boundary in `MermaidVisualizer` that preserves flow text if SVG generation encounters syntax anomalies.
- Implemented `DependencyMatrix` right-column container displaying directional prerequisite badges ("Depends on:", "Blocks:").
- Added runtime `ApiKeyModal` with password visibility toggle and browser local storage persistence.
- Built `ErrorBanner` component providing non-destructive API error notifications with an instant "Retry" action.
- Generated standalone architecture map `devpost/app-map.html`.
