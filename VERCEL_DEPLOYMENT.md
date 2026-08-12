# Vercel deployment notes

This project is configured for a **Vite static frontend** plus **Express-backed Vercel Functions** under `/api`. The `api/index.ts` and `api/[...path].ts` entries export the shared Express application without calling `listen()`, so Vercel can invoke them as serverless functions while the local development server continues to run normally.

> Do not commit `.env`, `.env.local`, or any secret values. Add secrets only in **Vercel Project Settings → Environment Variables**, scoped to Production and Preview as appropriate.

| Variable | Required for | Notes |
|---|---|---|
| `TINYFISH_API_KEY` | Cited live web-search results | Server-only. The app falls back to public GitHub and the verified local dossier if unavailable. |
| `RESEND_API_KEY` | Contact form | Server-only. |
| `RESEND_FROM_EMAIL` | Contact form | Must use a verified Resend sender domain; a Gmail sender is not valid. |
| `RESEND_TO_EMAIL` | Contact form delivery | Developer inbox address. |
| `DATABASE_URL` | Database-backed platform features | Server-only, use the Vercel environment value appropriate for the deployed database. |
| `JWT_SECRET` | Authentication/session support | Generate a strong production-only value. |
| `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` | Manus OAuth integration | Add only if the OAuth callback is intended to work on the Vercel domain. |

The current Manus built-in LLM variables (`BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`) are platform-managed and should **not** be copied from this environment. On Vercel, configure an independent LLM provider before expecting generative Assistant answers; the application continues to provide verified local answers and cited retrieval fallbacks when an LLM response is unavailable.
