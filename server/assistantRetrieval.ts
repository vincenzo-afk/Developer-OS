import type { AssistantSource } from "@shared/assistant";
import { ENV } from "./_core/env";

const GITHUB_USERNAME = "vincenzo-afk";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const MAX_SOURCES = 4;

type GitHubProfile = {
  name?: string | null;
  bio?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
  html_url?: string;
};

type GitHubRepo = {
  name: string;
  description?: string | null;
  html_url: string;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
  archived?: boolean;
};

type TinyFishResult = {
  title?: unknown;
  url?: unknown;
  snippet?: unknown;
  domain?: unknown;
};

type TinyFishResponse = { results?: TinyFishResult[] };

function compactText(value: unknown, limit: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, limit);
}

function safeHttpUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function sourceFromUrl(kind: AssistantSource["kind"], title: string, urlValue: unknown, excerpt: string): AssistantSource | null {
  const url = safeHttpUrl(urlValue);
  if (!url) return null;
  return {
    kind,
    title: compactText(title, 140) || url.hostname,
    url: url.toString(),
    excerpt: compactText(excerpt, 420),
    domain: url.hostname.replace(/^www\./, ""),
  };
}

async function fetchJson<T>(url: string | URL, init: RequestInit, timeoutMs = 7_500): Promise<T | null> {
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    return null;
  }
}

function queryTerms(question: string) {
  return question.toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g)?.filter((term) => !new Set([
    "about", "bharani", "github", "please", "search", "their", "there", "which", "what", "with", "from",
  ]).has(term)) ?? [];
}

export function shouldSearchLiveWeb(question: string, hasPortfolioMatch: boolean) {
  const liveSignal = /\b(latest|recent|current|today|news|online|web|search|article|blog|release|update|profile|linkedin)\b/i;
  return !hasPortfolioMatch || liveSignal.test(question);
}

export async function fetchGitHubSources(question: string): Promise<AssistantSource[]> {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "Developer-OS-Portfolio-Assistant" };
  const [profile, repositories] = await Promise.all([
    fetchJson<GitHubProfile>(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
    fetchJson<GitHubRepo[]>(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
  ]);
  const sources: AssistantSource[] = [];

  if (profile) {
    const profileExcerpt = [
      profile.name || GITHUB_USERNAME,
      profile.bio || "Public GitHub profile",
      typeof profile.public_repos === "number" ? `${profile.public_repos} public repositories` : "",
      typeof profile.followers === "number" ? `${profile.followers} followers` : "",
    ].filter(Boolean).join(" · ");
    const source = sourceFromUrl("github", "Bharani Kumar S on GitHub", profile.html_url || GITHUB_PROFILE_URL, profileExcerpt);
    if (source) sources.push(source);
  }

  if (repositories) {
    const terms = queryTerms(question);
    const candidates = [...repositories]
      .filter((repo) => !repo.archived)
      .sort((left, right) => {
        const leftHaystack = `${left.name} ${left.description ?? ""}`.toLowerCase();
        const rightHaystack = `${right.name} ${right.description ?? ""}`.toLowerCase();
        const leftScore = terms.reduce((score, term) => score + Number(leftHaystack.includes(term)), 0);
        const rightScore = terms.reduce((score, term) => score + Number(rightHaystack.includes(term)), 0);
        if (rightScore !== leftScore) return rightScore - leftScore;
        return Date.parse(right.updated_at ?? "") - Date.parse(left.updated_at ?? "");
      })
      .slice(0, MAX_SOURCES - sources.length);

    for (const repo of candidates) {
      const excerpt = [
        repo.description || "Public repository",
        repo.language ? `Language: ${repo.language}` : "",
        typeof repo.stargazers_count === "number" ? `${repo.stargazers_count} stars` : "",
        repo.updated_at ? `Updated ${new Date(repo.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}` : "",
      ].filter(Boolean).join(" · ");
      const source = sourceFromUrl("github", repo.name, repo.html_url, excerpt);
      if (source) sources.push(source);
    }
  }

  return sources.slice(0, MAX_SOURCES);
}

export async function fetchTinyFishSources(question: string): Promise<AssistantSource[]> {
  if (!ENV.tinyFishApiKey) return [];
  const endpoint = new URL("https://api.search.tinyfish.ai");
  endpoint.searchParams.set("query", `${question} Bharani Kumar S vincenzo-afk`);
  endpoint.searchParams.set("purpose", "Find public, attributable information relevant to an answer about Bharani Kumar S (vincenzo-afk). Return reputable sources only.");
  endpoint.searchParams.set("language", "en");

  const result = await fetchJson<TinyFishResponse>(endpoint, { headers: { "X-API-Key": ENV.tinyFishApiKey } }, 10_000);
  return (result?.results ?? [])
    .map((item) => sourceFromUrl("web", compactText(item.title, 140), item.url, compactText(item.snippet, 420)))
    .filter((item): item is AssistantSource => item !== null)
    .slice(0, MAX_SOURCES);
}

export function formatEvidenceForPrompt(sources: AssistantSource[]) {
  if (!sources.length) return "No live public sources were available for this question.";
  return sources.map((source, index) => `[S${index + 1}] ${source.title}\nURL: ${source.url}\nExcerpt: ${source.excerpt || "No excerpt available."}`).join("\n\n");
}

/**
 * Gives visitors an honest, useful answer when the model is unavailable. It
 * repeats retrieved excerpts verbatim rather than inferring new claims.
 */
export function evidenceFallbackAnswer(fallback: string, sources: AssistantSource[]) {
  if (!sources.length) return fallback;
  const evidence = sources.slice(0, 3).map((source, index) => {
    const excerpt = source.excerpt || "No public excerpt was available.";
    return `- [S${index + 1}] **${source.title}** — ${excerpt}`;
  }).join("\n");
  return [
    "The portfolio assistant model is temporarily unavailable, but I retrieved these relevant public sources:",
    evidence,
    "Open the source links below to review the original pages.",
  ].join("\n\n");
}
