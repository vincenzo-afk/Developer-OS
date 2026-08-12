import { describe, expect, it } from "vitest";
import type { AssistantSource } from "@shared/assistant";
import { evidenceFallbackAnswer, formatEvidenceForPrompt, shouldSearchLiveWeb } from "./assistantRetrieval";

const sources: AssistantSource[] = [
  {
    kind: "github",
    title: "Bharani Kumar S on GitHub",
    url: "https://github.com/vincenzo-afk",
    excerpt: "Public developer profile",
    domain: "github.com",
  },
  {
    kind: "web",
    title: "Public developer article",
    url: "https://example.com/article",
    excerpt: "A cited public result.",
    domain: "example.com",
  },
];

describe("Assistant retrieval policy", () => {
  it("uses live web retrieval when a question explicitly asks for a current web search", () => {
    expect(shouldSearchLiveWeb("Search the web for Bharani Kumar S's latest work", true)).toBe(true);
  });

  it("uses live web retrieval when the portfolio corpus has no matching context", () => {
    expect(shouldSearchLiveWeb("What is Bharani's latest public announcement?", false)).toBe(true);
  });

  it("keeps a matched static portfolio question on the faster GitHub-plus-dossier path", () => {
    expect(shouldSearchLiveWeb("What skills are listed in the portfolio?", true)).toBe(false);
  });

  it("formats each public source with a stable citation label for the model", () => {
    expect(formatEvidenceForPrompt(sources)).toContain("[S1] Bharani Kumar S on GitHub");
    expect(formatEvidenceForPrompt(sources)).toContain("[S2] Public developer article");
    expect(formatEvidenceForPrompt([])).toContain("No live public sources were available");
  });

  it("uses retrieved evidence rather than discarding it when the model is unavailable", () => {
    const answer = evidenceFallbackAnswer("Portfolio-only fallback", sources);

    expect(answer).toContain("temporarily unavailable");
    expect(answer).toContain("[S1] **Bharani Kumar S on GitHub**");
    expect(answer).toContain("Public developer profile");
    expect(answer).toContain("[S2] **Public developer article**");
  });

  it("uses the portfolio-only fallback when no public sources could be retrieved", () => {
    expect(evidenceFallbackAnswer("Portfolio-only fallback", [])).toBe("Portfolio-only fallback");
  });
});
