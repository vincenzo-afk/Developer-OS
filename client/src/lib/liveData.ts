import { useCallback, useEffect, useState } from "react";

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

export type VisitorCoordinates = {
  latitude: number;
  longitude: number;
};

export type VisitorLocationState = {
  coordinates: VisitorCoordinates | null;
  label: string | null;
  timeZone: string;
  status: "idle" | "requesting" | "granted" | "denied" | "unavailable";
  error: string | null;
  requestLocation: () => void;
};

export type LiveWeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  label: string;
  forecast: Array<{ time: string; temperature: number; weatherCode: number }>;
  fetchedAt: string;
};

export type LiveWeatherState = {
  data: LiveWeatherSnapshot | null;
  loading: boolean;
  error: string | null;
};

const githubCache: { promise: Promise<LiveGitHubSnapshot> | null } = { promise: null };
const weatherCache = new Map<string, Promise<LiveWeatherSnapshot>>();

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local timezone";
}

async function reverseGeocode(coordinates: VisitorCoordinates) {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(coordinates.latitude),
      lon: String(coordinates.longitude),
      zoom: "10",
      addressdetails: "1",
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const data = await response.json() as { address?: Record<string, string | undefined> };
    const address = data.address;
    if (!address) return null;
    const place = address.city || address.town || address.village || address.county || address.state_district;
    const country = address.country;
    return [place, country].filter(Boolean).join(", ") || null;
  } catch {
    return null;
  }
}

export function useVisitorLocation(): VisitorLocationState {
  const [state, setState] = useState<Omit<VisitorLocationState, "requestLocation">>({
    coordinates: null,
    label: null,
    timeZone: browserTimeZone(),
    status: "idle",
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState((current) => ({ ...current, status: "unavailable", error: "This browser does not support location access." }));
      return;
    }
    setState((current) => ({ ...current, status: "requesting", error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setState({ coordinates, label: null, timeZone: browserTimeZone(), status: "granted", error: null });
        void reverseGeocode(coordinates).then((label) => {
          if (label) setState((current) => current.coordinates?.latitude === coordinates.latitude && current.coordinates.longitude === coordinates.longitude ? { ...current, label } : current);
        });
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState((current) => ({ ...current, status: denied ? "denied" : "unavailable", error: denied ? "Location permission was not granted." : "Your location could not be determined." }));
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }, []);

  return { ...state, requestLocation };
}

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
    const timer = window.setInterval(refresh, 15_000);
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("offline", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(timer); };
  }, []);
  return status;
}

async function fetchWeatherSnapshot(coordinates: VisitorCoordinates) {
  const cacheKey = `${coordinates.latitude.toFixed(3)},${coordinates.longitude.toFixed(3)}`;
  if (!weatherCache.has(cacheKey)) {
    const query = new URLSearchParams({
      latitude: String(coordinates.latitude),
      longitude: String(coordinates.longitude),
      current: "temperature_2m,apparent_temperature,weather_code",
      hourly: "temperature_2m,weather_code",
      forecast_days: "1",
      timezone: "auto",
    });
    weatherCache.set(cacheKey, fetch(`https://api.open-meteo.com/v1/forecast?${query}`)
      .then((response) => { if (!response.ok) throw new Error(`Weather request failed (${response.status})`); return response.json() as Promise<{ current: { time: string; temperature_2m: number; apparent_temperature: number; weather_code: number }; hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] } }>; })
      .then((data) => {
        const currentIndex = Math.max(0, data.hourly.time.indexOf(data.current.time));
        const forecast = Array.from({ length: 5 }, (_, offset) => Math.min(data.hourly.time.length - 1, currentIndex + offset)).map((index) => ({
          time: data.hourly.time[index]?.slice(11, 16) ?? "—",
          temperature: Math.round(data.hourly.temperature_2m[index] ?? data.current.temperature_2m),
          weatherCode: data.hourly.weather_code[index] ?? data.current.weather_code,
        }));
        return {
          temperature: Math.round(data.current.temperature_2m),
          apparentTemperature: Math.round(data.current.apparent_temperature),
          weatherCode: data.current.weather_code,
          label: weatherLabel(data.current.weather_code),
          forecast,
          fetchedAt: new Date().toISOString(),
        } satisfies LiveWeatherSnapshot;
      }));
  }
  return weatherCache.get(cacheKey)!;
}

export function useLiveWeather(coordinates: VisitorCoordinates | null): LiveWeatherState {
  const [state, setState] = useState<LiveWeatherState>({ data: null, loading: false, error: "Location permission is required to load local weather." });
  useEffect(() => {
    let active = true;
    if (!coordinates) {
      setState({ data: null, loading: false, error: "Location permission is required to load local weather." });
      return () => { active = false; };
    }
    setState({ data: null, loading: true, error: null });
    fetchWeatherSnapshot(coordinates).then((data) => active && setState({ data, loading: false, error: null })).catch((error: unknown) => active && setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Weather data unavailable" }));
    return () => { active = false; };
  }, [coordinates?.latitude, coordinates?.longitude]);
  return state;
}
