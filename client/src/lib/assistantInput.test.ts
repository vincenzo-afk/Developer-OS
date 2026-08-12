import { describe, expect, it } from "vitest";
import { ASSISTANT_USER_MESSAGE_MAX_LENGTH } from "@shared/assistant";
import { validateAssistantQuestion } from "./assistantInput";

describe("validateAssistantQuestion", () => {
  it("accepts a trimmed question at the supported limit", () => {
    const result = validateAssistantQuestion(`  ${"a".repeat(ASSISTANT_USER_MESSAGE_MAX_LENGTH)}  `);

    expect(result).toEqual({ valid: true, content: "a".repeat(ASSISTANT_USER_MESSAGE_MAX_LENGTH) });
  });

  it("rejects an oversized question before a mutation is attempted", () => {
    const result = validateAssistantQuestion("a".repeat(ASSISTANT_USER_MESSAGE_MAX_LENGTH + 1));

    expect(result).toEqual({
      valid: false,
      content: "a".repeat(ASSISTANT_USER_MESSAGE_MAX_LENGTH + 1),
      message: "Please shorten your question to 1,200 characters or fewer.",
    });
  });

  it("rejects an empty question after whitespace is removed", () => {
    expect(validateAssistantQuestion("   ")).toEqual({
      valid: false,
      content: "",
      message: "Enter a question about Bharani’s verified portfolio.",
    });
  });
});
