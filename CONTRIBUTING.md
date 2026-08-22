# Contributing to Developer OS

Thank you for considering a contribution to Developer OS. The project is a public developer portfolio, so contributions should preserve factual accuracy, privacy, accessible desktop-style interactions, and the project’s existing technology choices.

## Before you begin

Please search existing issues before opening a new one. Bug reports and feature requests can be opened with the repository templates. Security-sensitive reports must follow [SECURITY.md](SECURITY.md) rather than using a public issue.

## Local setup

```bash
git clone https://github.com/vincenzo-afk/Developer-OS.git
cd Developer-OS
pnpm install
pnpm dev
```

Use Node.js 22 or newer and pnpm 10 or newer.

## Development expectations

Create a descriptive branch such as `fix/explorer-selection` or `feat/desktop-search-filter`. Keep changes focused and avoid unrelated formatting churn.

Developer OS presents verified portfolio data. Do not add fabricated metrics, reviews, awards, clients, repository information, or claims. Profile and portfolio facts belong in the reviewable data model rather than scattered component literals.

Do not commit `.env` files, API keys, access tokens, database URLs, Resend credentials, or user-uploaded wallpapers. Use local environment configuration for development and encrypted host settings for deployment.

## Validate your changes

Run the project’s real validation commands before opening a pull request:

```bash
pnpm check
pnpm test
pnpm build
```

If a change affects desktop windows, Search, Explorer, the browser workspace, Settings, wallpaper behavior, or responsive layout, include concise desktop and mobile verification notes in the pull request.

## Pull requests

Describe the user-visible change, testing performed, documentation changes, breaking-change implications, and any security or privacy impact. Keep commits readable and use an imperative subject, for example `fix: preserve Explorer selection after route hand-off`.

The maintainer may ask for scope reduction, evidence for new portfolio facts, or follow-up accessibility and responsive testing before merging.
