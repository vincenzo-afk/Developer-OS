export const ASSISTANT_USER_MESSAGE_MAX_LENGTH = 1_200;
export const ASSISTANT_HISTORY_MESSAGE_MAX_LENGTH = 6_000;

export type AssistantSourceKind = "portfolio" | "github" | "web";

export type AssistantSource = {
  kind: AssistantSourceKind;
  title: string;
  url: string;
  excerpt: string;
  domain: string;
};

export type AssistantRetrievalStatus = "portfolio" | "github" | "web" | "degraded";
