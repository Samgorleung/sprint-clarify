# Contributing to SprintClarify

Thank you for your interest in contributing to **SprintClarify**! This guide will help you get set up locally and understand the project's architecture, API conventions, and contribution workflows.

---

## 1. Quickstart & Collaborator Setup

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Installed and configured

### Clone and Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Samgorleung/sprint-clarify.git
   cd sprint-clarify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Gemini API Configuration & Offline Mock Fallback

SprintClarify executes the `@google/genai` SDK directly in the browser with zero backend server dependencies.

### Option A: Local Environment Variable (Recommended for Developers)
Create a `.env.local` file in the project root:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
Vite automatically exposes this to the browser client as `import.meta.env.VITE_GEMINI_API_KEY`. (Note: `.env.local` is ignored by git to protect credentials).

### Option B: Runtime In-App Key Modal
If you prefer not to create a `.env.local` file:
1. Click the **"Configure API Key"** button in the top-right navigation header.
2. Enter your Gemini API key in the secure modal.
3. The key is saved strictly in your browser's `localStorage` (`sprint_clarify_gemini_key`) and is never sent to any third-party server.

### Option C: Offline Mock Fallback (Zero-Config Testing)
If no API key is provided (or if the key is empty or set to `mock-key`):
- The application automatically falls back to the deterministic sample decomposition in `src/lib/starterPrompts.ts`.
- It simulates an authentic 800ms network delay and hydrates the full UI with realistic Epics, User Stories, Gherkin criteria, and Mermaid flow diagrams.
- **You do not need an active Google account or API key to develop and test UI features locally.**

---

## 3. Architecture & Key Conventions

- **Model Engine**: Uses `gemini-3.8-flash` via the `@google/genai` SDK.
- **Strict Structured Outputs (`responseSchema`)**:
  - Defined in `src/lib/gemini.ts` using `Type.OBJECT`, `Type.ARRAY`, and `Type.STRING`.
  - Always keep the runtime schema in `src/lib/gemini.ts` synchronized with the TypeScript interfaces in `src/types/agile.ts`.
- **Mermaid Visualizer**:
  - Dynamically rendered in `src/components/MermaidVisualizer.tsx` with dark theme variables.
  - Wrapped in a graceful error boundary fallback to prevent UI crashes if model-generated diagram syntax has quirks.
- **Markdown Export**:
  - Utility functions in `src/lib/markdownExporter.ts` format tickets specifically for Jira, Linear, and GitHub Issues markdown standards.

---

## 4. Verification & Testing

Before submitting pull requests or pushing commits, always verify:

1. **TypeScript Type Checking & Production Build**:
   ```bash
   npm run build
   ```
   Ensure `tsc -b` passes with zero type errors.

2. **Formatting & Design Standards**:
   - Adhere to Tailwind CSS utility conventions.
   - Maintain the dark-mode aesthetic (`#09090b` background, `#18181b` card surfaces, `#6366f1` indigo accents, `#10b981` emerald checks, `#f59e0b` amber risk pills).

---

## 5. Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: describe your change"
   ```
3. Push to your branch and open a Pull Request against `main`.
