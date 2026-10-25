import { DecompositionResult, Epic } from '../types/agile';

export interface DevpostPlanningPack {
  scopeMd: string;
  prdMd: string;
  specMd: string;
}

export function generateDevpostPlanningPack(
  result: DecompositionResult,
  featurePrompt?: string
): DevpostPlanningPack {
  const epicMap = new Map<string, Epic>();
  result.epics.forEach((e) => epicMap.set(e.id, e));

  // Determine MVP vs Later stories based on dependency depth
  const mvpStories = result.userStories.filter(s => s.dependsOn.length <= 1);
  const laterStories = result.userStories.filter(s => s.dependsOn.length > 1);

  // 1. scope.md
  const scopeMd = `---
doc: scope
status: approved
generated_by: SprintClarify
---

# ${result.epics[0]?.title || 'Sprint Feature Blueprint'}

${result.summary}

## The Unique Kernel
Decomposing complex feature requirements into strictly validated, machine-verifiable Agile artifacts with Gherkin acceptance criteria and execution dependency DAGs before writing code, preventing AI coding agents from drifting or hallucinating.

## Who It's For
Technical Project Managers, Tech Leads, and Solo Developers building with AI coding agents who need structured, ambiguity-free blueprints before entering execution.

## The Core Loop
1. Input vague business or stakeholder requirements.
2. Generate structured Epics, User Stories, and Gherkin Given-When-Then criteria.
3. Review technical risks and execution dependencies.
4. Export scoped planning artifacts and coding agent prompts.

## What "Working" Looks Like (PoC Demo)
In a 1-to-2 minute screen recording:
1. Enter feature request: "${featurePrompt ? featurePrompt.slice(0, 100) + '...' : 'Feature Request'}"
2. Review ${result.epics.length} generated milestone epics and ${result.userStories.length} granular user stories.
3. Validate Gherkin acceptance criteria and technical risks.
4. Verify execution flow diagram via visual dependency matrix.
5. Export sprint documentation and agent task slice prompts.

## The PoC Boundary
### Core MVP Slices:
${mvpStories.map(s => `- **${s.id}**: ${s.title} (Complexity: ${s.complexity})`).join('\n')}

### Later / Stretch Goals:
${laterStories.length > 0 ? laterStories.map(s => `- **${s.id}**: ${s.title}`).join('\n') : '- Multi-region high availability\n- Automated external Jira/Linear synchronization'}

## Explicitly Cut
- Manual drag-and-drop canvas restructuring (deferred to keep generation reliable and fast).
- User authentication and cloud account persistence for the PoC.
- Multi-tenant enterprise team management.
`;

  // 2. prd.md
  const storiesPrd = result.userStories.map(s => {
    const epic = epicMap.get(s.epicId);
    return `### [${s.id}] ${s.title}
- **Parent Epic:** ${epic ? `${epic.id} - ${epic.title}` : s.epicId}
- **Narrative:** As a ${s.asA}, I want ${s.iWant}, so that ${s.soThat}.
- **Complexity:** ${s.complexity}
- **Acceptance Criteria (Gherkin):**
${s.acceptanceCriteria.map(ac => `  - ${ac}`).join('\n')}
- **Dependencies:** Requires ${s.dependsOn.length > 0 ? s.dependsOn.join(', ') : 'None'} | Blocks ${s.blocks.length > 0 ? s.blocks.join(', ') : 'None'}
- **Technical Considerations:**
${s.technicalRisks.length > 0 ? s.technicalRisks.map(r => `  - ⚠️ ${r}`).join('\n') : '  - Standard implementation'}
`;
  }).join('\n');

  const prdMd = `---
doc: prd
status: approved
generated_by: SprintClarify
---

# Product Requirements Document (PRD)

## Executive Summary
${result.summary}

## Milestone Epics
${result.epics.map(e => `### ${e.id}: ${e.title}\n**Objective:** ${e.objective}\n`).join('\n')}

## User Stories & Gherkin Acceptance Criteria
${storiesPrd}

## Technical Risks & Mitigation
${Array.from(new Set(result.userStories.flatMap(s => s.technicalRisks))).map(r => `- ⚠️ ${r}`).join('\n')}

## Look and Feel & Design Standards
- **Theme:** Dark mode modern developer console (Zinc / Slate / Indigo).
- **Gherkin Highlighting:** High-contrast color-coded Given/When/Then tokens.
- **Interactions:** Expandable accordion stories, 1-click clipboard exports, and dynamic dependency flowcharts.
`;

  // 3. spec.md
  const specMd = `---
doc: spec
status: approved
generated_by: SprintClarify
---

# Technical Specification

## System Architecture
This feature plan is engineered for rapid implementation with AI coding agents (Claude Code, Cursor, Codex). Every user story is modular and includes strict boundary conditions.

## Execution Dependency Diagram
\`\`\`mermaid
${result.mermaidDiagram}
\`\`\`

## Data Models & Type Contracts
\`\`\`typescript
export interface FeatureBacklog {
  summary: string;
  epics: Array<{ id: string; title: string; objective: string }>;
  userStories: Array<{
    id: string;
    epicId: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
    acceptanceCriteria: string[];
    complexity: 'S' | 'M' | 'L';
    dependsOn: string[];
    blocks: string[];
    technicalRisks: string[];
  }>;
}
\`\`\`

## Implementation Slices & Execution Order
${result.userStories.map((s, index) => `${index + 1}. **Slice ${s.id}** (${s.title}): Requires [${s.dependsOn.join(', ') || 'None'}] → Blocks [${s.blocks.join(', ') || 'None'}]`).join('\n')}

## Failure Modes & Recovery
1. **Unmet Acceptance Criteria**: Reject task slice; re-prompt with specific failing Gherkin step.
2. **Regression in Existing Code**: Enforce negative constraint prompt rules to protect untouched files.
3. **Execution Blockers**: Respect the prerequisite graph order before initiating blocked stories.
`;

  return { scopeMd, prdMd, specMd };
}

/**
 * Triggers a download of a text file in the browser.
 */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
