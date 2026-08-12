import { Resend } from "resend";
import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("Resend configuration", () => {
  it("accepts the configured server-only API key", async () => {
    expect(ENV.resendApiKey).not.toBe("");
    const resend = new Resend(ENV.resendApiKey);
    const { error } = await resend.domains.list();
    expect(error).toBeNull();
  }, 30_000);
});
