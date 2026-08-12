import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  invokeLLM: vi.fn(),
  fetchGitHubSources: vi.fn(),
  fetchTinyFishSources: vi.fn(),
}));

vi.mock("./_core/llm", () => ({ invokeLLM: mocks.invokeLLM }));
vi.mock("./assistantRetrieval", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./assistantRetrieval")>();
  return {
    ...actual,
    fetchGitHubSources: mocks.fetchGitHubSources,
    fetchTinyFishSources: mocks.fetchTinyFishSources,
  };
});

import { appRouter } from "./routers";

describe("assistant.chat degraded retrieval response", () => {
  it("preserves GitHub and web evidence when the generative model fails", async () => {
    mocks.invokeLLM.mockRejectedValueOnce(new Error("model unavailable"));
    mocks.fetchGitHubSources.mockResolvedValueOnce([
      {
        kind: "github",
        title: "Bharani Kumar S on GitHub",
        url: "https://github.com/vincenzo-afk",
        excerpt: "Public developer profile",
        domain: "github.com",
      },
    ]);
    mocks.fetchTinyFishSources.mockResolvedValueOnce([
      {
        kind: "web",
        title: "Public developer article",
        url: "https://example.com/article",
        excerpt: "Publicly attributable project information.",
        domain: "example.com",
      },
    ]);

    const caller = appRouter.createCaller({} as never);
    const response = await caller.assistant.chat({
      messages: [{ role: "user", content: "Search the web for Bharani Kumar S's latest public work" }],
    });

    expect(response.retrievalStatus).toBe("web");
    expect(response.sources).toHaveLength(2);
    expect(response.answer).toContain("temporarily unavailable");
    expect(response.answer).toContain("[S1] **Bharani Kumar S on GitHub**");
    expect(response.answer).toContain("[S2] **Public developer article**");
  });
});
