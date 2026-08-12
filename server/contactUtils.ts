export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function formatContactMessage(input: ContactSubmission) {
  return [
    "New message from Developer OS",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}
