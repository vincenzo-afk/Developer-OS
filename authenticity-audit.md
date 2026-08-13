# Developer OS Control Audit

## Scope

This audit covers visible operating-system controls in the portfolio workstation. A control is treated as authentic only when it performs an observable in-app action, opens a verified external target, or honestly reports that an unavailable browser/platform capability cannot be completed.

| Surface | Control outcome | Status |
| --- | --- | --- |
| Lock screen | Enters the desktop shell and updates the local session state. | Functional |
| Desktop shortcuts and Start menu | Open the named portfolio or system application windows. | Functional |
| Window chrome | Focus, minimize, close, maximize, title-bar dragging, edge snapping, keyboard placement, and task view operate on local window state. | Functional |
| This PC Explorer | Searches, sorts, switches grid/list presentation, selects a verified repository, shows details, and opens its GitHub source or supplied live target. | Functional |
| Edge workspace | Resolves searches and direct URLs, records local session history, persists local bookmarks, and opens external content with an honest embed hand-off where a site blocks embedding. | Functional |
| System Center | Shows only local workstation events and current local browser/customization state; quick controls change actual persisted desktop preferences. | Functional |
| Settings | Accent, taskbar, density, accessibility, sound, wallpaper, reset, and section navigation control real persisted personalization. The mobile section bar is visible and touch-operable. | Functional |
| Weather and clock | Uses browser time-zone data and permission-aware geolocation/weather retrieval, with explicit fallback states rather than fabricated values. | Functional |
| Portfolio Assistant | Uses verified local portfolio facts, public GitHub evidence, and server-side cited web retrieval. It preserves retrieved evidence if generative completion is unavailable. | Functional |
| Contact Bharani | Uses the server-side Resend workflow with the visitor address as Reply-To; an unverified sender domain is reported as a configuration prerequisite. | Functional when sender domain is configured |
| Terminal | Supports documented safe local portfolio commands and returns real portfolio data; it does not emulate arbitrary operating-system command execution. | Intentionally bounded |

## Intentional boundaries

The browser cannot truthfully impersonate privileged Windows features such as arbitrary process management, device pairing, file-system writes outside user-selected wallpaper files, or embedding sites that reject iframe display. The application keeps those areas bounded or uses an explicit external hand-off rather than presenting decorative controls as completed actions.

## Verification record

- Unit and integration coverage: Explorer sorting/state, browser workspace persistence, activity feed bounds, Assistant degraded evidence, snap boundaries, wallpaper/customization persistence, and contact configuration.
- Chromium desktop workflows: window dragging, snap layouts, task view, Explorer selection/opening, Edge bookmarks/history, and Settings navigation.
- Chromium mobile workflow: seven Settings section controls plus verified Explorer selection at 375 × 812.
