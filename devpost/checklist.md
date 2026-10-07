---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Scaffold Vite app and implement structured Gemini decomposition engine**
  Becomes usable: A running React + Vite application with Tailwind CSS dark theme where entering a feature request (or clicking a starter prompt) calls Gemini 2.5 Flash via `@google/genai` with `responseSchema` (or uses seeded offline fallback), parses the validated JSON, and renders the raw structured data on screen.
  Why now: Risk first and kernel early. Bootstraps the project, establishes the TypeScript `DecompositionResult` contract, and proves the Gemini structured output pipeline before building out UI details.
  PRD ref: `prd.md > 1. Requirement Input & Starter Cards`, `prd.md > 2. Structured Agile Decomposition`
  Spec ref: `spec.md > Components > App.tsx`, `spec.md > Components > PromptInput.tsx`, `spec.md > External Services and Dependencies > Google Gemini API via @google/genai`
  Build: Scaffold React + Vite + TypeScript in the project root, configure Tailwind CSS dark theme and Lucide icons, implement `src/types/agile.ts`, build `src/lib/gemini.ts` with `responseSchema` and `src/lib/starterPrompts.ts`, build `PromptInput.tsx` and `LoadingSkeleton.tsx`, and wire them into `App.tsx`.
  Verify (mechanical): Run `npm run build` to verify clean TypeScript compilation and asset bundling with zero errors.
  Learner check: Run `npm run dev`, open `http://localhost:5173`, click a starter prompt pill, click "Clarify & Decompose", and confirm structured decomposition data is returned.
  Commit: `feat: scaffold app and implement structured gemini decomposition`

- [x] **2. Backlog workspace with interactive story cards, Gherkin criteria, and clipboard export**
  Becomes usable: The left column becomes a full Agile backlog dashboard with Epic groupings, User Story cards with emerald Gherkin acceptance criteria checks, amber risk pills, accordion toggles, individual story copy buttons, and global "Export All Markdown" / "Export JSON" actions.
  Why now: Delivers the core user workflow for the TPM/Tech Lead: reviewing decomposed stories with Gherkin acceptance criteria and copying clean Markdown directly into Jira or Linear.
  PRD ref: `prd.md > 3. Story Interaction & Clipboard Export`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components > BacklogView.tsx`, `spec.md > Components > StoryCard.tsx`, `spec.md > Components > ExportBar.tsx`, `spec.md > File Structure > src/lib/markdownExporter.ts`
  Build: Create `src/lib/markdownExporter.ts`, build `src/components/BacklogView.tsx`, `src/components/StoryCard.tsx`, and `src/components/ExportBar.tsx`. Add accordion expand/collapse logic and clipboard copy handlers with feedback toasts.
  Verify (mechanical): Run `npm run build` to confirm type compliance; execute a programmatic test of `markdownExporter.ts` to assert that user stories and Gherkin bullets format cleanly for Jira/Linear.
  Learner check: Toggle story accordions, click the individual "Copy" button on a story, paste into a text editor, and confirm the markdown format is clean and ticket-ready.
  Commit: `feat: add backlog workspace with interactive story cards and markdown export`

- [ ] **3. Visual dependency matrix with Mermaid sequence flow and error resilience**
  Becomes usable: The right column renders the execution sequence diagram via Mermaid.js alongside directional dependency cards ("Prerequisite for...", "Blocks..."). Includes error boundary resilience, the runtime API key modal, and retry banner.
  Why now: Completes the full dual-column experience and 1-minute demo video flow, giving visual proof of dependency ordering and graceful error handling.
  PRD ref: `prd.md > 4. Dependency Flow Visualization`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > DependencyMatrix.tsx`, `spec.md > Components > MermaidVisualizer.tsx`, `spec.md > Components > ApiKeyModal.tsx`, `spec.md > Components > ErrorBanner.tsx`
  Build: Build `MermaidVisualizer.tsx` with dynamic SVG rendering and fallback guard, `DependencyMatrix.tsx` with prerequisite/blocking badges, `ApiKeyModal.tsx` for runtime key management, and `ErrorBanner.tsx` with retry capability.
  Verify (mechanical): Run `npm run build` to confirm zero lint or TypeScript errors; test Mermaid diagram rendering with sample syntax; verify error banner displays on simulated API failure.
  Learner check: Trigger a decomposition and view the generated Mermaid flowchart and dependency cards; open the API key modal to verify runtime configuration.
  Commit: `feat: add visual dependency matrix with mermaid flow and error resilience`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 1 (scaffold and Gemini decomposition engine verified)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

