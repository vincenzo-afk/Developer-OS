import { achievements, profile, repos, skills, socials } from "../client/src/lib/portfolioData";

export type PortfolioMatch = {
  title: string;
  body: string;
  url?: string;
  score: number;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const tokens = (value: string) => normalize(value).split(" ").filter((token) => token.length > 2 && !new Set(["about", "with", "what", "which", "tell", "have", "that", "this", "from", "bharani", "vincenzo"]).has(token));

export function buildPortfolioContext() {
  const projectRows = repos.map((repo) => `- ${repo.name}: ${repo.description} Language: ${repo.language}. Status: ${repo.status}.${repo.homepage ? ` Demo: ${repo.homepage}` : ""}`).join("\n");
  const socialRows = socials.map(([network, handle, url]) => `- ${network}: ${handle} (${url})`).join("\n");
  const skillRows = Object.entries(skills).map(([group, values]) => `- ${group}: ${values.join(", ")}`).join("\n");
  const achievementRows = achievements.map(([event, project, status, description]) => `- ${event} | ${project} | ${status}: ${description}`).join("\n");

  return [
    `Developer: ${profile.name} (${profile.handle})`,
    `Role: ${profile.role}`,
    `Base profile location: ${profile.location}; profile timezone: ${profile.timezone}.`,
    `Education: ${profile.education}.`,
    `Bio: ${profile.bio}`,
    `Current builds: ${profile.currentBuilds.join(", ")}.`,
    `Learning: ${profile.learning.join(", ")}.`,
    `Portfolio: ${profile.portfolio}; GitHub: ${profile.github}; Contact: ${profile.email}.`,
    "\nProjects:\n" + projectRows,
    "\nSkills:\n" + skillRows,
    "\nAchievements:\n" + achievementRows,
    "\nSocial accounts:\n" + socialRows,
  ].join("\n");
}

export function findPortfolioMatches(question: string, limit = 4): PortfolioMatch[] {
  const query = tokens(question);
  const matches: PortfolioMatch[] = [];

  for (const repo of repos) {
    const haystack = normalize(`${repo.name} ${repo.description} ${repo.language} ${repo.category} ${repo.status}`);
    const haystackTokens = new Set(tokens(haystack));
    const score = query.reduce((total, token) => total + (haystackTokens.has(token) ? (tokens(repo.name).includes(token) ? 4 : 1) : 0), 0);
    if (score > 0) matches.push({ title: repo.name, body: `${repo.description} (${repo.language}; ${repo.status})`, url: repo.homepage, score });
  }

  for (const [network, handle, url] of socials) {
    const haystack = normalize(`${network} ${handle} ${url}`);
    const score = query.reduce((total, token) => total + (new Set(tokens(haystack)).has(token) ? 2 : 0), 0);
    if (score > 0) matches.push({ title: network, body: handle, url, score });
  }

  if (/(who|about|bharani|vincenzo|education|location|email|contact|skills|stack)/i.test(question)) {
    matches.push({ title: profile.name, body: `${profile.role}. ${profile.education}. ${profile.bio}`, url: profile.portfolio, score: 2 });
  }

  return matches.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}

export function localPortfolioAnswer(question: string) {
  if (/(favo(?:u)?rite|birthday|date of birth|age|salary|home address|phone number|private)/i.test(question)) {
    return "I can only answer from Bharani Kumar S’s verified portfolio record. That personal detail is not verified in the portfolio; try asking about a project, skill, social account, hackathon submission, current build, education, or contact method.";
  }
  const matches = findPortfolioMatches(question);
  if (!matches.length) {
    return "I can only answer from Bharani Kumar S’s verified portfolio record. Try asking about a project, skill, social account, hackathon submission, current build, education, or contact method.";
  }

  const lines = matches.map((match) => `- **${match.title}** — ${match.body}${match.url ? `\n  ${match.url}` : ""}`);
  return `Here is what the verified portfolio record contains:\n\n${lines.join("\n")}`;
}
