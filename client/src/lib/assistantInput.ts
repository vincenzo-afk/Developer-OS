import { ASSISTANT_USER_MESSAGE_MAX_LENGTH } from "@shared/assistant";

export type AssistantQuestionValidation =
  | { valid: true; content: string }
  | { valid: false; content: string; message: string };

export function validateAssistantQuestion(input: string): AssistantQuestionValidation {
  const content = input.trim();

  if (!content) {
    return { valid: false, content, message: "Enter a question about Bharani’s verified portfolio." };
  }

  if (content.length > ASSISTANT_USER_MESSAGE_MAX_LENGTH) {
    return {
      valid: false,
      content,
      message: `Please shorten your question to ${ASSISTANT_USER_MESSAGE_MAX_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  return { valid: true, content };
}
