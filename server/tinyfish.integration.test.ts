import { describe, expect, it } from "vitest";

const tinyFishKey = process.env.TINYFISH_API_KEY;
const runWithTinyFish = tinyFishKey ? it : it.skip;

describe("TinyFish credentials", () => {
  runWithTinyFish("authorize a minimal server-side search request", async () => {
    const endpoint = new URL("https://api.search.tinyfish.ai");
    endpoint.searchParams.set("query", "vincenzo-afk GitHub");
    endpoint.searchParams.set("purpose", "Validate the Developer OS Portfolio Assistant web-search integration.");

    const response = await fetch(endpoint, {
      headers: {
        "X-API-Key": tinyFishKey!,
      },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await response.text();

    expect(response.ok, text).toBe(true);
    expect(Array.isArray(JSON.parse(text).results)).toBe(true);
  }, 15_000);
});
