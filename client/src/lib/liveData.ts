import { useEffect, useState } from "react";

export type LiveGitHubSnapshot = {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  aiLikeRepos: number;
  languageRows: Array<{ label: string; count: number }>;
  lastUpdatedAt: string | null;
  fetchedAt: string;
};

export type RuntimeStatus = {
  online: boolean;
  visible: boolean;
  heapPercent: number | null;
};

export type LiveWeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  label: string;
  forecast: Array<{ time: string; temperature: number; weatherCode: number }>;
  fetchedAt: string;
};

const githubCache: { promise: Promise<LiveGitHubSnapshot> | null } = { promise: null };
const weatherCache: { promise: Promise<LiveWeatherSnapshot> | null } = { promise: null };

export function weatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Conditions unavailable";
}

function readHeapPercent() {
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (!memory || memory.jsHeapSizeLimit <= 0) return null;
  return Math.round(Math.min(100, (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100));
}

async function fetchGitHubSnapshot() {
  if (!githubCache.promise) {
    githubCache.promise = Promise.all([
      fetch("https://api.github.com/users/vincenzo-afk", { headers: { Accept: "application/vnd.github+json" } }).then((response) => {
        if (!response.ok) throw new Error(`GitHub profile request failed (${response.status})`);
        return response.json() as Promise<{ public_repos: number; followers: number; following: number }>;
      }),
      fetch("https://api.github.com/users/vincenzo-afk/repos?per_page=100&sort=updated", { headers: { Accept: "application/vnd.github+json" } }).then((response) => {
        if (!response.ok) throw new Error(`GitHub repository request failed (${response.status})`);
        return response.json() as Promise<Array<{ stargazers_count: number; forks_count: number; language: string | null; name: string; description: string | null; updated_at: string }>>;
      }),
    ]).then(([user, repositories]) => {
      const languages = repositories.reduce<Record<string, number>>((counts, repository) => {
        if (repository.language) counts[repository.language] = (counts[repository.language] ?? 0) + 1;
        return counts;
      }, {});
      const aiLikeRepos = repositories.filter((repository) => /ai|agent|llm|machine learning|vision|neural|gpt|model/i.test(`${repository.name} ${repository.description ?? ""}`)).length;
      const lastUpdatedAt = repositories.map((repository) => repository.updated_at).sort().at(-1) ?? null;
      return {
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        totalStars: repositories.reduce((sum, repository) => sum + repository.stargazers_count, 0),
        totalForks: repositories.reduce((sum, repository) => sum + repository.forks_count, 0),
        aiLikeRepos,
        languageRows: Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 5).map(([label, count]) => ({ label, count })),
        lastUpdatedAt,
        fetchedAt: new Date().toISOString(),
      } satisfies LiveGitHubSnapshot;
    });
  }
  return githubCache.promise;
}

export function useLiveGitHub() {
  const [state, setState] = useState<{ data: LiveGitHubSnapshot | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    fetchGitHubSnapshot().then((data) => active && setState({ data, loading: false, error: null })).catch((error: unknown) => active && setState({ data: null, loading: false, error: error instanceof Error ? error.message : "GitHub data unavailable" }));
    return () => { active = false; };
  }, []);
  return state;
}

export function useRuntimeStatus() {
  const getStatus = (): RuntimeStatus => ({ online: navigator.onLine, visible: document.visibilityState === "visible", heapPercent: readHeapPercent() });
  const [status, setStatus] = useState<RuntimeStatus>(() => getStatus());
  useEffect(() => {
    const refresh = () => setStatus(getStatus());
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 15000);
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("offline", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(timer); };
  }, []);
  return status;
}

async function fetchWeatherSnapshot() {
  if (!weatherCache.promise) {
    weatherCache.promise = fetch("https://api.open-meteo.com/v1/forecast?latitude=12.9165&longitude=79.1325&current=temperature_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto")
      .then((response) => { if (!response.ok) throw new Error(`Weather request failed (${response.status})`); return response.json() as Promise<{ current: { temperature_2m: number; apparent_temperature: number; weather_code: number }; hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] } }>; })
      .then((data) => {
        const currentHour = new Date().getHours();
        const forecast = Array.from({ length: 5 }, (_, offset) => Math.min(data.hourly.time.length - 1, currentHour + offset)).map((index) => ({ time: data.hourly.time[index]?.slice(11, 16) ?? "—", temperature: Math.round(data.hourly.temperature_2m[index] ?? data.current.temperature_2m), weatherCode: data.hourly.weather_code[index] ?? data.current.weather_code }));
        return { temperature: Math.round(data.current.temperature_2m), apparentTemperature: Math.round(data.current.apparent_temperature), weatherCode: data.current.weather_code, label: weatherLabel(data.current.weather_code), forecast, fetchedAt: new Date().toISOString() } satisfies LiveWeatherSnapshot;
      });
  }
  return weatherCache.promise;
}

export function useLiveWeather() {
  const [state, setState] = useState<{ data: LiveWeatherSnapshot | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    fetchWeatherSnapshot().then((data) => active && setState({ data, loading: false, error: null })).catch((error: unknown) => active && setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Weather data unavailable" }));
    return () => { active = false; };
  }, []);
  return state;
}
