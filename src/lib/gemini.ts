import { GoogleGenAI, Type } from "@google/genai";
import { DecompositionResult } from "../types/agile";
import { MOCK_DECOMPOSITION } from "./starterPrompts";

export const agileDecompositionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A high-level 1-2 sentence executive summary of the decomposition."
    },
    epics: {
      type: Type.ARRAY,
      description: "List of high-level milestone epics grouping the feature work.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Epic ID, e.g. EPIC-01" },
          title: { type: Type.STRING, description: "Concise title of the milestone epic" },
          objective: { type: Type.STRING, description: "Core business and technical outcome of this epic" },
        },
        required: ["id", "title", "objective"],
      },
    },
    userStories: {
      type: Type.ARRAY,
      description: "Granular user stories with Gherkin acceptance criteria and technical dependency tags.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Story ID, e.g. US-01" },
          epicId: { type: Type.STRING, description: "Parent Epic ID, e.g. EPIC-01" },
          title: { type: Type.STRING, description: "Action-oriented story title" },
          asA: { type: Type.STRING, description: "Persona role (e.g. mobile banking user)" },
          iWant: { type: Type.STRING, description: "Specific capability requested" },
          soThat: { type: Type.STRING, description: "Business or user value achieved" },
          acceptanceCriteria: {
            type: Type.ARRAY,
            description: "3 to 4 strict Gherkin criteria in 'Given [context], When [action], Then [outcome]' format",
            items: { type: Type.STRING },
          },
          complexity: {
            type: Type.STRING,
            description: "Relative complexity estimate: S, M, or L",
          },
          dependsOn: {
            type: Type.ARRAY,
            description: "Story IDs that must be completed before this story (prerequisites)",
            items: { type: Type.STRING },
          },
          blocks: {
            type: Type.ARRAY,
            description: "Story IDs that cannot start until this story is finished",
            items: { type: Type.STRING },
          },
          technicalRisks: {
            type: Type.ARRAY,
            description: "1-2 critical technical failure modes, architectural dependencies, or edge risks",
            items: { type: Type.STRING },
          },
        },
        required: [
          "id",
          "epicId",
          "title",
          "asA",
          "iWant",
          "soThat",
          "acceptanceCriteria",
          "complexity",
          "dependsOn",
          "blocks",
          "technicalRisks"
        ],
      },
    },
    mermaidDiagram: {
      type: Type.STRING,
      description: "A valid Mermaid.js flowchart string (using 'graph TD' with nodes like US01[\"US-01: Title\"] --> US02[\"US-02: Title\"]) visualizing the prerequisite execution sequence.",
    },
  },
  required: ["summary", "epics", "userStories", "mermaidDiagram"],
};

export async function decomposeFeature(
  promptText: string,
  apiKey?: string
): Promise<DecompositionResult> {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  // Offline mock fallback if no API key is configured
  if (!activeKey || activeKey.trim() === "" || activeKey === "mock-key") {
    // Simulate brief network delay for authentic UI testing
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_DECOMPOSITION;
  }

  const ai = new GoogleGenAI({ apiKey: activeKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: agileDecompositionSchema,
      systemInstruction: `You are an elite Agile Delivery Lead and Principal Software Architect.
Decompose ambiguous business feature requests into strictly structured, production-ready Agile artifacts:
1. Milestone Epics.
2. User Stories in 'As a... I want... So that...' format with 3-4 bulleted Gherkin acceptance criteria (Given/When/Then).
3. Explicit prerequisite ('dependsOn') and blocking ('blocks') story relationships.
4. Concrete technical risks and failure modes.
5. A valid Mermaid.js flowchart ('graph TD') visualizing the dependency graph with node IDs matching story IDs.
Do not include conversational fluff. Return strictly valid JSON adhering to the response schema.`,
    },
  });

  if (!response.text) {
    throw new Error("No response content received from Gemini.");
  }

  try {
    const parsed = JSON.parse(response.text) as DecompositionResult;
    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", response.text, err);
    throw new Error("Invalid JSON structure received from model decomposition.");
  }
}
