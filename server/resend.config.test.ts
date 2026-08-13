import { Resend } from "resend";
import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("Resend configuration", () => {
  it("accepts a configured server-only API key without making a network request", () => {
    expect(ENV.resendApiKey).not.toBe("");
    expect(ENV.resendApiKey).toMatch(/^re_/);
    const resend = new Resend(ENV.resendApiKey);
    expect(resend).toBeInstanceOf(Resend);
  });
});
