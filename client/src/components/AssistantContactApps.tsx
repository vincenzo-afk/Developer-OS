import { AIChatBox, type Message } from "@/components/AIChatBox";
import { validateAssistantQuestion } from "@/lib/assistantInput";
import { trpc } from "@/lib/trpc";
import { ASSISTANT_USER_MESSAGE_MAX_LENGTH } from "@shared/assistant";
import { Bot, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

const suggestions = [
  "What projects has Bharani built?",
  "Which skills are listed in the portfolio?",
  "How can I contact Bharani?",
  "Tell me about the current builds.",
];

export function PortfolioAssistantApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const chat = trpc.assistant.chat.useMutation({
    onSuccess: ({ answer }) => setMessages((current) => [...current, { role: "assistant", content: answer }]),
    onError: (error) => setMessages((current) => [...current, { role: "assistant", content: error.message.includes("Too big") ? `Please shorten your question to ${ASSISTANT_USER_MESSAGE_MAX_LENGTH.toLocaleString()} characters or fewer.` : "I could not reach the portfolio assistant right now. I can only answer from Bharani Kumar S’s verified portfolio record." }]),
  });
  const send = (content: string) => {
    const question = validateAssistantQuestion(content);
    if (!question.valid) {
      setMessages((current) => [...current, { role: "assistant", content: question.message }]);
      return;
    }
    const history = [...messages, { role: "user" as const, content: question.content }];
    setMessages(history);
    chat.mutate({ messages: history.filter((message): message is { role: "user" | "assistant"; content: string } => message.role === "user" || message.role === "assistant").slice(-8) });
  };

  return <div className="assistant-app"><header className="assistant-app-header"><div><span className="eyebrow"><Bot size={13} /> PORTFOLIO INTELLIGENCE</span><h2>Ask about Bharani</h2><p>Answers are limited to the verified Developer OS profile, projects, skills, achievements, and public links.</p></div><ShieldCheck size={29} aria-hidden="true" /></header><AIChatBox messages={messages} onSendMessage={send} isLoading={chat.isPending} height="calc(100% - 109px)" className="assistant-chat" emptyStateMessage="Ask a portfolio question. Unknown details are stated as unverified." placeholder="Ask about projects, skills, achievements, or contact…" suggestedPrompts={suggestions} maxInputLength={ASSISTANT_USER_MESSAGE_MAX_LENGTH} /></div>;
}

type ContactForm = { name: string; email: string; subject: string; message: string };
const initialForm: ContactForm = { name: "", email: "", subject: "", message: "" };

export function ContactApp() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [sent, setSent] = useState(false);
  const contact = trpc.contact.send.useMutation({
    onSuccess: () => { setSent(true); setForm(initialForm); },
  });
  const update = (key: keyof ContactForm, value: string) => { setSent(false); setForm((current) => ({ ...current, [key]: value })); };
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); contact.mutate(form); };

  return <div className="contact-app"><div className="contact-copy"><span className="eyebrow"><Mail size={13} /> DIRECT MESSAGE / VERIFIED DELIVERY</span><h2>Contact Bharani</h2><p>Send a concise project, collaboration, or professional inquiry. Your email address is used only as the reply-to address for this message.</p><div className="contact-privacy"><ShieldCheck size={16} /><span>Delivery is handled server-side. The email address you provide is not published in the portfolio.</span></div></div><form className="contact-form" onSubmit={submit}><label><span>Name</span><input required maxLength={80} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" /></label><label><span>Email</span><input required type="email" maxLength={254} value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label><label><span>Subject</span><input required minLength={3} maxLength={140} value={form.subject} onChange={(event) => update("subject", event.target.value)} placeholder="How can Bharani help?" /></label><label><span>Message</span><textarea required minLength={10} maxLength={5000} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Write your message…" /></label>{contact.error && <p className="contact-error" role="alert">Message could not be sent. Please try again later.</p>}{sent && <p className="contact-success"><CheckCircle2 size={15} /> Message sent. Bharani can reply directly to your email.</p>}<button className="primary-button contact-submit" type="submit" disabled={contact.isPending}>{contact.isPending ? "Sending…" : "Send message"}</button></form></div>;
}
