# SprintClarify

> AI-powered Agile decomposition engine transforming ambiguous business feature requests into strictly validated epics, user stories with Gherkin acceptance criteria, and execution dependency flowcharts.

SprintClarify is built with React, Vite, TypeScript, Tailwind CSS, Mermaid.js, and the Google Gen AI SDK (`@google/genai`) using `gemini-2.5-flash` with structured JSON output enforcement (`responseSchema`).

---

## Key Features

- **Strict Structured Outputs (`responseSchema`)**: Eliminates conversational fluff and manual reformatting. Returns strictly typed JSON containing epics, user stories, Gherkin acceptance criteria, and technical risks.
- **Gherkin Acceptance Criteria**: Generates 3–4 standard `Given / When / Then` bullet points per story for clear testability.
- **Interactive Backlog Workspace**: Scannable story cards with accordion expand/collapse, priority badges, and directional dependency pills.
- **Visual Dependency Matrix (Mermaid.js)**: Automatically renders an SVG flowchart of task prerequisites and blocking relationships with error-guarded fallback.
- **1-Click Agile Exports**: Quick-copy individual story cards for single tickets (Jira/Linear/GitHub Issues) or export the entire sprint backlog to Markdown or JSON.
- **Zero-Config Local Execution**: Client-side execution with `.env.local` support, runtime API key modal fallback, and offline mock data for instant testing.

---

## Tech Stack

- **Framework**: React 18 + Vite 6 (TypeScript)
- **Styling**: Tailwind CSS (Dark-mode first Linear/Raycast aesthetic)
- **Icons**: Lucide React
- **Diagramming**: Mermaid.js (Client-side SVG rendering)
- **AI SDK**: `@google/genai` (Gemini 2.5 Flash with typed `responseSchema`)

---

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd sprint-clarify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Gemini API key:
   Create a `.env.local` file:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no key is set, you can enter one directly in the app via the "Configure API Key" button, or use the pre-seeded offline mock data.*

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build & Verification

To verify TypeScript types and build assets:
```bash
npm run build
```

---

## Planning Documentation

The complete spec-driven planning and verification history is captured under `devpost/`:
- [devpost/scope.md](devpost/scope.md) — Unique kernel, persona, core loop, and PoC boundaries.
- [devpost/prd.md](devpost/prd.md) — Complete product requirements, user journeys, and states.
- [devpost/spec.md](devpost/spec.md) — Technical specification, schema contract, and component breakdown.
- [devpost/checklist.md](devpost/checklist.md) — Build slices, mechanical verification, and commit checkpoints.
- [devpost/app-map.html](devpost/app-map.html) — Standalone visual architecture map and reference route.
