# Developer OS

Developer OS is a Windows 11-inspired interactive portfolio for **Bharani Kumar S** ([`vincenzo-afk`](https://github.com/vincenzo-afk)). It turns a verified developer profile, repositories, skills, achievements, and social accounts into a desktop-style web experience.

> It is a portfolio website that uses familiar desktop concepts such as a taskbar, windows, a Start menu, and Settings. It is not an operating system or an affiliation with Microsoft.

## Main capabilities

| Area | Included experience |
| --- | --- |
| Desktop | Unlock screen, draggable/minimizable/maximizable windows, Start menu, taskbar, system tray, context menu, keyboard affordances, and sound feedback. |
| Portfolio | Profile workstation, all verified repositories, live demos, technology stack, achievements, social accounts, and terminal-style navigation. |
| Browser | Search entry, direct URLs, project links, and supported YouTube navigation or embeds. |
| Personalization | Local image/video/URL wallpapers, reset controls, theme/accent preferences, sound settings, desktop arrangement, and more visitor-controlled settings. |
| Live information | Browser-local time, browser runtime signals, public GitHub profile/repository data, and Open-Meteo weather with honest loading and unavailable states. |
| Assistant | A fact-grounded portfolio assistant for questions about Bharani’s verified profile, projects, skills, achievements, and social accounts. |
| Contact | A secure contact form that sends through Resend after a verified sending address is configured. |

## Workspace controls

Developer OS now includes a keyboard-first **Windows Search** surface. Use **Ctrl/Cmd + K** to open it, search the installed portfolio applications or verified repository record, and open the selected target. Repository selections are handed to the in-app Edge workspace instead of inventing an embedded external page.

The dedicated File Explorer workspace keeps **recent** and **pinned** verified projects locally in the visitor’s browser. It provides an explicit **Reset workspace** control, so visitors can remove those local references without affecting the public portfolio dataset. The Edge-inspired browser preserves a small bounded set of local tabs, history, and bookmarks; it still hands sites that decline embedding to a real browser context.

The safe terminal now supports `open <verified project>` for an Edge hand-off and `explore <verified project>` for an in-app Explorer selection. These commands are navigation shortcuts over verified portfolio records, not a shell and not a way to execute code on a visitor device.

## Verified profile record

| Field | Value |
| --- | --- |
| Name | Bharani Kumar S |
| Handle | `vincenzo-afk` |
| Role | Full Stack Developer & AI Systems Builder |
| Education | B.E. CSE, 2nd Year, Kingston Engineering College |
| Profile location | Vellore, Tamil Nadu, India |
| Current builds | IRIS, NOVA, CircuitWeaver |
| Portfolio | [vincenzo-afk.vercel.app](https://vincenzo-afk.vercel.app/) |
| GitHub | [github.com/vincenzo-afk](https://github.com/vincenzo-afk) |

The canonical portfolio dataset is [`client/src/lib/portfolioData.ts`](client/src/lib/portfolioData.ts). New profile claims, projects, metrics, client names, awards, ratings, testimonials, or timelines must not be invented.

## Architecture

```text
React + TypeScript + Vite client
  ├── Desktop shell and portfolio applications
  ├── Browser APIs: time, timezone, geolocation permission, audio, image/video wallpaper
  └── tRPC client
          │
Express + tRPC server
  ├── Grounded assistant: verified portfolio corpus + optional free-chatbot adapter
  ├── Secure Resend contact delivery
  └── Full-stack template foundations for auth/database
```

## Truthful data policy

| Surface | Source | Honest fallback |
| --- | --- | --- |
| Profile, projects, skills, socials | Reviewable portfolio dataset | Displayed as a portfolio record, not a live claim. |
| GitHub values | Public GitHub API | Loading, unavailable, or rate-limited state—never a decorative number. |
| Clock and timezone | Visitor browser | Uses browser locale/timezone; does not infer location without permission. |
| Location | Explicit browser permission | Disabled until approved; location is not sent to Bharani. |
| Weather | Open-Meteo | Loading/error state if data cannot be read. |
| Runtime status | Browser APIs | Unsupported signals remain unavailable. |

## Assistant boundaries

The assistant answers questions about Bharani’s portfolio; it does not impersonate Bharani or claim facts outside the verified corpus. The server retrieves relevant profile, repository, skills, achievements, and social records first. The optional [`free-chatbot`](https://github.com/muhiris/free-chatbot) adapter runs only on the server, uses no visitor API key, and is protected by timeouts and a local fact-only fallback. Provider availability and quality are not guaranteed, so unanswered questions receive an explicit limitation message rather than a fabricated response.

## Resend contact delivery

The actual email sender is **not** the visitor. The server needs the following encrypted, server-only environment values:

| Variable | Meaning | Example |
| --- | --- | --- |
| `RESEND_API_KEY` | Server authentication for Resend | `re_...` |
| `RESEND_FROM_EMAIL` | A verified Resend sender identity | `Developer OS <hello@yourdomain.com>` |
| `RESEND_TO_EMAIL` | Bharani’s receiving inbox | `itsmebk2007@gmail.com` |

The contact form collects a visitor’s name, email, subject, and message. The visitor email becomes the email **Reply-To** address, so Bharani can respond directly to the person who submitted the form. Gmail addresses such as `os@gmail.com` cannot be a Resend `from` address because the sender must belong to a domain the project owner controls and verifies in Resend. Resend’s `onboarding@resend.dev` may be usable only for the temporary sandbox restrictions of the connected Resend account.

## Local development

### Prerequisites

- Node.js 22 or newer
- pnpm 10 or newer
- Optional: Resend account and verified domain for public email delivery

### Run

```bash
git clone https://github.com/vincenzo-afk/Developer-OS.git
cd Developer-OS
pnpm install
pnpm dev
```

### Verify

```bash
pnpm run check
pnpm run test
pnpm run build
```

## Privacy and media

Visitor personalization is stored locally where supported. User-selected wallpaper images and videos are not committed to Git. Video wallpapers are muted, looping, and inline. Runtime location is opt-in; no coordinates are saved in the portfolio data model.

## Deployment

This edition includes server-side features for the assistant provider adapter and Resend delivery. A static-only deployment can render the desktop but cannot send email securely or protect server-side provider calls. Deploy to a Node-compatible host and configure secrets only through that host’s encrypted environment-variable interface. Choose a single canonical production host; use a second host only for staging or backup.

## Repository topics

GitHub accepts a maximum of 20 repository topics. The project prioritizes `portfolio`, `developer-portfolio`, `windows11`, `desktop`, `desktop-environment`, `operating-system`, `react`, `typescript`, `tailwindcss`, `ai`, `artificial-intelligence`, `developer`, `ui`, `ux`, `glassmorphism`, `window-manager`, `interactive`, `portfolio-website`, `web-application`, and `opensource`.

## License

See the repository’s existing license file for reuse terms.
