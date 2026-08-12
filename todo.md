# Developer OS Expansion Checklist

- [x] Audit current README, live data, icon rendering, assistant surface, customization state, and GitHub sync status.
- [x] Inspect the official free-chatbot package documentation and decide whether its runtime model can be used safely in this frontend.
- [x] Write a comprehensive README covering architecture, features, data sources, customization, local setup, deployment, and limitations.
- [x] Create a grounded portfolio knowledge model containing only verified Bharani profile, project, social, and skills data.
- [x] Add browser geolocation permission flow, reverse-geocoded location label, timezone-aware clock, and honest fallback states.
- [x] Improve real weather loading, condition labels, forecast handling, and unavailable/error messaging.
- [x] Fix raster icon sizing, contrast, fallbacks, and rendering across desktop, Start, taskbar, title bars, and mobile.
- [x] Add the no-key grounded assistant UI with searchable portfolio answers and explicit unknown-state handling.
- [x] Add persisted customization controls for wallpaper, video wallpaper, accent, theme, icon scale, taskbar behavior, and sound.
- [x] Add a secure Resend-backed contact workflow; upgrade the project only if a server route and secret storage are required.
- [x] Run typecheck, production build, desktop/mobile visual QA, and interaction checks.
- [x] Push each completed coding milestone to vincenzo-afk/Developer-OS using the user’s Git identity.
- [x] Save a final WebDev checkpoint and deliver the updated project with concise next steps.
- [x] Replace or repair opaque raster PNG icon source assets with transparent, high-contrast versions when image-generation capacity is available.
- [x] Run and record desktop and mobile visual verification specifically for raster icons in desktop, Start, taskbar, and title bars after the source-asset repair.
- [x] Run and record a full final desktop QA pass across Start, taskbar, window management, browser, weather, assistant, contact, and settings customization.
- [x] Run and record a full final mobile QA pass across the core desktop shell and representative app windows.
- [x] Verify and document persistence-sensitive interactions for customization, wallpaper, sound, taskbar alignment, and icon scale.
- [x] Run and document a complete interaction QA pass for Start menu, taskbar, opening, minimizing, maximizing, dragging windows, browser, weather, assistant, contact, and settings on desktop and mobile.
- [x] Verify and document wallpaper upload, URL/video save, restore, and reset behavior across a reload alongside sound, taskbar alignment, and icon scale persistence.
- [x] Fix and verify window title-bar control activation so minimize, maximize, and close do not conflict with window-drag pointer capture.
- [x] Verify and document transparent raster icon appearance in the desktop shortcut grid, Start menu, taskbar, and window title bars on desktop and mobile.
- [x] Audit icon sizing across desktop shortcuts, Start entries, taskbar buttons, and title bars; correct inconsistencies and record the results in QA notes.
- [x] Repair the empty GitHub Power and Terminal pinned icon presentations, then repeat the explicit shell-icon audit.
- [x] Re-run and record the explicit desktop and mobile shell-icon audit after the GitHub Power and Terminal fallback repair.
- [x] Run regression validation after the latest Home.tsx and CSS icon-fallback changes, then record the result in the QA notes.
- [x] Independently review the persisted repaired-state QA record for desktop and mobile icons before finalizing icon-verification completion.
- [x] Independently review the persisted wallpaper and preference verification record for upload, URL/video restore, reset, sound, taskbar alignment, and icon scale before finalizing completion.
- [x] Run and document explicit desktop window-drag verification by moving at least one window.
- [x] Run and document a real mobile interaction QA pass that explicitly covers Browser and Settings interactions.
- [x] Run and document whether mobile window controls and dragging are supported; if supported, verify minimize, maximize, and drag, or record the intentional platform limitation and narrow the QA checklist wording.
- [x] Run and document a real mobile interaction QA pass for Start/taskbar/app opening plus an assistant, contact, Settings, or weather interaction.
- [x] Run and document a real mobile interaction QA pass for Start/taskbar/app opening plus an assistant, contact, Settings, or weather interaction.

- [x] Save a final WebDev checkpoint after the latest QA scripts, test coverage, documentation, and checklist changes.
- [x] Deliver the finished project summary with concise deployment and Resend sender-domain next steps.

- [x] Send the final user-facing delivery summary covering completed features, validation, GitHub synchronization, and the saved checkpoint.
- [x] Include deployment guidance and the verified Resend sender-domain requirement for `RESEND_FROM_EMAIL` in the final delivery.

- [x] Fix the Portfolio Assistant mutation failure for input messages exceeding the server validation limit, with clear client feedback and regression coverage.
