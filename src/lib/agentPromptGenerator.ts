import { UserStory, Epic } from '../types/agile';

/**
 * Generates an engineered prompt designed for AI coding agents
 * (Claude Code, Cursor Composer, GitHub Copilot, Codex, Gemini CLI).
 *
 * Includes negative constraints, boundary locks, and Gherkin verification
 * to prevent coding agents from breaking existing code or hallucinating.
 */
export function generateAgentSlicePrompt(story: UserStory, epic?: Epic): string {
  const epicContext = epic ? `Parent Epic: ${epic.id} - ${epic.title} (${epic.objective})` : `Parent Epic ID: ${story.epicId}`;
  const deps = story.dependsOn.length > 0 ? story.dependsOn.join(', ') : 'None';
  const blocks = story.blocks.length > 0 ? story.blocks.join(', ') : 'None';

  return `TASK: Implement Slice [${story.id}] — "${story.title}"

${epicContext}
Complexity Estimate: ${story.complexity}
Prerequisite Slices: ${deps}
Blocked Slices: ${blocks}

---
### User Story Narrative:
- As a: ${story.asA}
- I want: ${story.iWant}
- So that: ${story.soThat}

---
### Strict Acceptance Criteria (Gherkin Rules):
You MUST satisfy all of the following Gherkin scenarios. Do not consider this task done until all criteria pass:
${story.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n')}

---
### Technical Risks & Failure Modes:
${story.technicalRisks.length > 0
  ? story.technicalRisks.map((risk) => `- [GUARD] ${risk}`).join('\n')
  : '- Standard implementation, follow best practices'}

---
### MANDATORY AGENT CONSTRAINTS (DO NOT VIOLATE):
1. SCOPE ISOLATION: Only write or modify code required for slice [${story.id}]. Do NOT refactor or delete unrelated modules.
2. PREVENT REGRESSIONS: Do NOT break existing tests, working state, or API endpoints.
3. TEST FIRST / VERIFY: Verify every Gherkin criterion above with automated unit/integration tests or manual runtime assertions.
4. CLEAN COMMITS: Provide a concise summary of files changed and confirmation of all verified criteria.
`;
}
