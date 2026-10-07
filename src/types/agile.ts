export interface Epic {
  id: string; // e.g. "EPIC-01"
  title: string;
  objective: string;
}

export interface UserStory {
  id: string; // e.g. "US-01"
  epicId: string; // e.g. "EPIC-01"
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[]; // 3-4 bulleted Gherkin criteria
  complexity: "S" | "M" | "L";
  dependsOn: string[]; // e.g. ["US-01"]
  blocks: string[]; // e.g. ["US-03"]
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
