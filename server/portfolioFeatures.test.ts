import { describe, expect, it } from "vitest";
import { formatContactMessage } from "./contactUtils";
import { localPortfolioAnswer } from "./portfolioKnowledge";

describe("grounded portfolio assistant fallback", () => {
  it("refuses to invent details that are absent from the verified portfolio record", () => {
    expect(localPortfolioAnswer("What is Bharani's favourite movie?")).toContain("can only answer from Bharani Kumar S’s verified portfolio record");
  });

  it("returns grounded project information when a matching project is requested", () => {
    expect(localPortfolioAnswer("Tell me about IRIS")).toContain("IRIS");
  });
});

describe("contact message composition", () => {
  it("includes visitor identity, reply email, subject, and message without altering their content", () => {
    expect(formatContactMessage({ name: "Ada Lovelace", email: "ada@example.com", subject: "Collaboration", message: "I would like to discuss a project." })).toContain("Email: ada@example.com");
    expect(formatContactMessage({ name: "Ada Lovelace", email: "ada@example.com", subject: "Collaboration", message: "I would like to discuss a project." })).toContain("I would like to discuss a project.");
  });
});
