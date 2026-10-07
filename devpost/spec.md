---
doc: spec
status: approved
---

# SprintClarify — Technical Spec

## How This Works, In Plain Language
SprintClarify is a single-page web application running locally in the browser. When a user pastes an ambiguous business feature request (or clicks a preset starter prompt), the application packages the request with a strict Agile decomposition schema prompt and calls the Google Gemini API directly using the `@google/genai` SDK with `responseSchema` enabled.

Gemini returns a validated JSON object conforming to the schema. The client application parses this structured payload and updates React state. The user interface immediately displays a dual-column workspace:
1. **Left Column**: High-level Epic objectives, followed by User Story cards with Gherkin-formatted acceptance criteria, technical risk tags, and individual 1-click clipboard copy buttons.
2. **Right Column**: A visual execution flow rendered with Mermaid.js, alongside directional dependency cards ("Prerequisite for...", "Blocks...").
3. **Export Controls**: Global actions to export the full sprint backlog as formatted Markdown or raw JSON.

This architecture is completely serverless and self-contained: it runs with a single command (`npm run dev`), requires no database, and proves the core decomposition loop quickly and reliably.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Initial Mount**: React loads in the browser at `http://localhost:5173`. `App.tsx` checks for `import.meta.env.VITE_GEMINI_API_KEY` (or stored key in `localStorage`). If neither exists, a key entry badge/modal is available.
2. **Prompt Population**: The user types a requirement into `PromptInput.tsx` or clicks one of three starter prompt buttons. State updates `promptText`. If `promptText.length >= 10`, the submit button is enabled.
3. **Trigger Decomposition**: The user clicks "Clarify & Decompose". `App.tsx` sets `isLoading = true` and `error = null`. The empty state is replaced by `LoadingSkeleton.tsx`.
4. **Gemini Execution**: The client calls `gemini.ts`, which initializes `GoogleGenAI` and issues a `generateContent` call to `gemini-2.5-flash` with `responseMimeType: "application/json"` and the strict `responseSchema`.
5. **Data Hydration**: On response receipt, the validated JSON is parsed into the `DecompositionResult` type and stored in React state. `isLoading` is set to `false`.
6. **Dual-Column Presentation**:
   - `BacklogView.tsx` renders Epics and an accordion list of `StoryCard.tsx` items with Gherkin checks.
   - `DependencyMatrix.tsx` renders directional badge cards and triggers `MermaidVisualizer.tsx` to compile the diagram into an SVG.
7. **Copy & Export**:
   - Clicking a story card's "Copy" button formats that single story as Markdown and copies it to `navigator.clipboard`.
   - Clicking "Export All Markdown" bundles all epics, stories, Gherkin criteria, and dependency flows into a Jira/Linear-ready markdown string.

## Stack
- **Language**: TypeScript 5.6+ — provides end-to-end type safety between the Gen AI schema definition and React components.
  - [TypeScript Docs](https://www.typescriptlang.org/docs/)
- **Build Tool & Framework**: Vite 6 + React 18/19 — provides fast HMR, instant cold start, and minimal bundling overhead for local development.
  - [Vite Docs](https://vite.dev/guide/)
  - [React Docs](https://react.dev/)
- **Styling**: Tailwind CSS v3/v4 — utility-first styling for dark-mode interfaces, rapid layout assembly, and fine-grained typography.
  - [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **Icons**: `lucide-react` — lightweight, modern icon library for accordion toggles, copy icons, risks, and checkmarks.
  - [Lucide React Docs](https://lucide.dev/guide/packages/lucide-react)
- **Diagramming**: `mermaid` — converts dynamic text-based flowchart syntax into accessible SVGs without requiring heavy canvas physics or graph layout libraries.
  - [Mermaid.js Docs](https://mermaid.js.org/)
- **AI SDK**: `@google/genai` (official Google Gen AI SDK) — latest SDK with first-class support for `responseSchema`, `Type.OBJECT`, and Gemini 2.5 models.
  - [Google Gen AI SDK Docs](https://github.com/google-gemini/deprecations) / [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

## Where It Runs and How Someone Tries It
- **Runtime Environment**: Browser (Chrome/Edge/Firefox) supported by a local Node.js process (Node 18+).
- **Environment Configuration**: Create `.env.local` containing:
  ```bash
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```
- **Startup Commands**:
  ```bash
  npm install
  npm run dev
  ```
  Open `http://localhost:5173` in any modern web browser.
- **Demo Recording Verification**:
  1. Open `http://localhost:5173`.
  2. Click the starter prompt pill "Mobile Biometric Auth".
  3. Click "Clarify & Decompose".
  4. Observe shimmer loading skeleton.
  5. Inspect left column: Epics, User Stories with Gherkin ACs, and amber risk tags.
  6. Inspect right column: Directional dependency cards and rendered Mermaid flow diagram.
  7. Click "Copy" on a story card to show individual clipboard copy toast.
  8. Click "Export All Markdown" to show full sprint export.

## Look and Feel
Implements `prd.md > Look and Feel`.
- **Theme**: Dark-mode first inspired by Linear, Raycast, and GitHub Issues.
- **Palette**:
  - Main background: `#09090b` (zinc-950)
  - Card surfaces: `#18181b` (zinc-900)
  - Borders & dividers: `#27272a` (zinc-800)
  - Primary accents: `#6366f1` (indigo-500)
  - Acceptance criteria checks: `#10b981` (emerald-500)
  - Technical risk tags: `#f59e0b` (amber-500)
  - Typography: Inter/sans-serif for body, JetBrains Mono/monospace for story IDs, code, and JSON views.

## Components

### `App.tsx`
Implements `prd.md > Screens and Layout`.
The root application component. Manages top-level state: `promptText`, `result` (`DecompositionResult | null`), `isLoading` (`boolean`), `error` (`string | null`), and `apiKey` (`string`). Coordinates layout between the prompt input bar, loading skeletons, and dual-column results view.

### `Header.tsx`
Renders the SprintClarify logo, subtitle, status indicator for the Gemini API connection, and a trigger for the API key settings modal.

### `PromptInput.tsx`
Implements `prd.md > 1. Requirement Input & Starter Cards`.
Contains the multi-line textarea, character counter, three starter prompt buttons ("Mobile Biometric Auth", "CSV Export & Scheduled Reports", "Webhook Event Notifications"), and the primary "Clarify & Decompose" button. Disables submission when input is less than 10 characters.

### `LoadingSkeleton.tsx`
Implements `prd.md > States and Boundaries`.
Renders animated pulsing shimmer skeletons matching the dual-column layout during Gemini API processing.

### `BacklogView.tsx`
Implements `prd.md > 2. Structured Agile Decomposition`.
The left column container. Renders the Epics summary block and iterates over `userStories` to render `StoryCard.tsx` components.

### `StoryCard.tsx`
Implements `prd.md > 3. Story Interaction & Clipboard Export`.
Renders an individual user story card. Contains:
- Header with Story ID (e.g. `US-01`), title, complexity pill, and accordion toggle.
- Story narrative ("As a... I want to... So that...").
- Bulleted Gherkin acceptance criteria with emerald checkmark icons.
- Technical risks highlighted with amber warning badges.
- Individual "Copy" button that formats the story as Markdown for Jira/Linear and triggers a copied toast.

### `DependencyMatrix.tsx`
Implements `prd.md > 4. Dependency Flow Visualization`.
The right column container. Renders:
- `MermaidVisualizer.tsx` displaying the execution dependency graph.
- Directional dependency card list highlighting prerequisite stories and blocked tasks.

### `MermaidVisualizer.tsx`
Implements `prd.md > 4. Dependency Flow Visualization`.
Encapsulates Mermaid.js initialization and rendering. Uses `mermaid.render()` within a `useEffect` hook to dynamically render the SVG into a container ref. Includes error handling that renders a clean structured fallback view if syntax parsing fails.

### `ExportBar.tsx`
Implements `prd.md > 3. Story Interaction & Clipboard Export`.
Toolbar located above the results grid with summary counters (Total Epics, Total Stories, Total Risks), "Export All Markdown" button, and "Export JSON" button.

### `ErrorBanner.tsx`
Implements `prd.md > States and Boundaries`.
Dismissible error alert component displayed above the input if the API request fails, complete with a "Retry" button.

### `ApiKeyModal.tsx`
Modal dialog allowing the user to configure or update their Gemini API key at runtime if not provided via `.env.local`.

## Data Model

### TypeScript Schema Contract (`src/types/agile.ts`)
```typescript
export interface Epic {
  id: string; // e.g., "EPIC-01"
  title: string;
  objective: string;
}

export interface UserStory {
  id: string; // e.g., "US-01"
  epicId: string; // e.g., "EPIC-01"
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[]; // 3-4 Gherkin format strings
  complexity: "S" | "M" | "L";
  dependsOn: string[]; // e.g., ["US-01"]
  blocks: string[]; // e.g., ["US-03"]
  technicalRisks: string[];
}

export interface DependencyNode {
  id: string;
  title: string;
  prerequisites: string[];
}

export interface DecompositionResult {
  summary: string;
  epics: Epic[];
  userStories: UserStory[];
  mermaidDiagram: string;
}
```

### Application State Shape
- `prompt`: `string`
- `result`: `DecompositionResult | null`
- `isLoading`: `boolean`
- `error`: `string | null`
- `copiedId`: `string | null` (for copy toast animations)
- `apiKey`: `string` (sourced from env or localStorage)

## File Structure
```
sprint-clarify/
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.tsx
│   │   ├── BacklogView.tsx
│   │   ├── DependencyMatrix.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── ExportBar.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── MermaidVisualizer.tsx
│   │   ├── PromptInput.tsx
│   │   └── StoryCard.tsx
│   ├── lib/
│   │   ├── gemini.ts            # @google/genai client & responseSchema definition
│   │   ├── markdownExporter.ts  # Format backlog/stories to Jira/Linear Markdown
│   │   └── starterPrompts.ts    # Preset ambiguous feature prompts
│   ├── types/
│   │   └── agile.ts             # DecompositionResult and related interfaces
│   ├── App.tsx                  # Root dashboard component
│   ├── index.css                # Tailwind directives and base styles
│   └── main.tsx                 # React DOM mount point
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## External Services and Dependencies

### Google Gemini API via `@google/genai`
- **Model**: `gemini-2.5-flash`
- **SDK**: `@google/genai`
- **Configuration**:
  ```typescript
  import { GoogleGenAI, Type } from "@google/genai";

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: agileDecompositionSchema,
      systemInstruction: "You are an elite Agile Delivery Lead and Technical Architect. Decompose the feature request into structured epics, stories with Gherkin acceptance criteria, and technical dependencies.",
    },
  });
  ```
- **Cost & Limits**: Free tier / standard developer tier for Gemini 2.5 Flash (15 RPM, 1M TPM), negligible latency (<3-4s per decomposition).
- **Fallback**: Seeded mock data generator in `src/lib/starterPrompts.ts` if no API key is provided during offline development.

### Mermaid.js
- **Package**: `mermaid`
- **Usage**: Invoked dynamically via `mermaid.render(id, text)` to produce inline SVG graphs.
- **Config**: Theme set to `dark`, background transparent.

## Important Failure Modes
- **Missing or Invalid Gemini API Key**:
  - *Trigger*: API returns 401/403 or no key provided.
  - *Fallback*: The `ErrorBanner` displays "API Key Invalid or Missing" with an "Enter Key" button that opens `ApiKeyModal.tsx`.
- **Gemini Rate Limit or Network Interruption**:
  - *Trigger*: 429 status code or offline network error.
  - *Fallback*: Retains the user's prompt text in `PromptInput` and presents a "Retry" button in `ErrorBanner.tsx`.
- **Mermaid Syntax Parse Error**:
  - *Trigger*: Gemini outputs unexpected flowchart characters.
  - *Fallback*: `MermaidVisualizer` catches the render error, displays a subtle notice, and renders the structured dependency cards without crashing the page.

## What Was Simplified and Why
- **Direct Browser SDK Call** instead of Node.js backend proxy: Eliminates backend boilerplate, servers, and multi-process management. Safe for local PoC and hackathon demos.
- **Client-Side In-Memory State** instead of PostgreSQL/SQLite database: The proof of concept is focused on real-time requirement decomposition and export; persistent project management is deferred.
- **Mermaid.js Flowchart** instead of interactive canvas editor (e.g. React Flow): Provides clean, deterministic visual dependency paths in 2–4 hours without the complexity of drag-and-drop physics and coordinate math.

## Decisions and Open Issues
- **Decision 1**: Adopted `@google/genai` with `Type.OBJECT` / `Type.ARRAY` and `responseMimeType: "application/json"` to ensure strict typed output adhering to `DecompositionResult`.
- **Decision 2**: Selected Vite + React SPA for instant setup, zero backend overhead, and straightforward execution on any developer machine.
- **Decision 3**: Provided both individual-story Markdown copying and full-sprint backlog export to serve both single-ticket triage and full sprint planning.
- **Learner Uncertainty Clarified**: Addressed dynamic Mermaid rendering inside React's rendering lifecycle by isolating it in `MermaidVisualizer.tsx` with a unique ID generation per render and try/catch fallback, preventing canvas crashes.
- **Open Issues**: None. All dependencies and schemas are aligned for immediate execution in `5-build`.
