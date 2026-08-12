# Developer OS QA Notes

## 2026-08-12 — Settings personalization visual check

The desktop Settings window was captured at a 1280 × 720 viewport with the `settings` application opened directly. The accent-color options, taskbar layout selectors, desktop-density selectors, and appearance toggles were visible within the Mica-style window and did not overlap the desktop shell.

The same surface was captured at a 375 × 812 viewport. The mobile window retained usable selector controls after the accent options were condensed into a four-swatch grid. The Settings sidebar reduced to icons and the content remained scrollable inside the window.

## Outstanding verification

The remaining final QA pass must exercise and document core desktop and mobile application surfaces plus persistence-sensitive interactions before release.

## 2026-08-12 — Desktop application QA

At a 1280 × 720 viewport, direct-entry captures confirmed that the About workstation, Project Hub, browser, permission-gated Weather, Portfolio Assistant, Contact, and Settings windows each opened inside the desktop shell without clipping or visible layout errors. The Weather window correctly remained permission-gated when the preview environment did not grant browser geolocation.

The original opaque raster source artwork created intermittent low-contrast or blank-looking icon tiles. The shared glyph layer now keeps every desktop, taskbar, Start, and title-bar icon recognizable while retaining the source raster artwork beneath it at a low opacity. The final desktop capture showed distinct icons without blank tiles. Replacing the old opaque source PNGs with transparent raster art remains separately tracked and depends on image-generation capacity.

## 2026-08-12 — Mobile application QA

At a 375 × 812 viewport, direct-entry captures confirmed usable responsive layouts for the About workstation, Project Hub, browser, Portfolio Assistant, Contact, and Settings windows. Long project lists and settings controls remain vertically scrollable inside the mobile-height window. The contact form stacks into a single column, the assistant retains its suggested prompts and message input, and the browser preserves its search field and quick-access list without horizontal clipping.

## 2026-08-12 — Build and preference validation

The full suite passed after the icon refinement: unit tests, TypeScript checking, and production build. A dedicated persistence test now confirms that the accent, icon scale, taskbar alignment, motion, and sound choices round-trip through browser storage, sanitize invalid stored values, and reset safely. The production build completed with only the existing bundle-size advisory for large optional language and diagram assets.

## 2026-08-12 — Transparent raster replacement

The prior opaque icon sources were replaced with twelve transparent RGBA PNGs from Microsoft Fluent Emoji’s MIT-licensed repository. The icon mapping, source inventory, and license provenance are recorded in `asset-sources.md`. A new desktop capture showed the transparent icons distinctly in the desktop shortcut rail, window title bars, and taskbar while retaining the Lucide fallback only for an image-load failure. Direct desktop captures also confirmed the Project Hub, browser, assistant, contact, Settings, weather-permission, and terminal surfaces render without clipping.

Interactive validation for Start, window manipulation, real location permission, contact delivery, and wallpaper persistence remains pending because those flows require a visitor/browser action and must not be simulated with a message or live external email.

The mobile raster verification captured the same asset set in direct entries for Project Hub, browser, assistant, contact, Settings, weather, and terminal. Their window-title and taskbar icon presentation remained visible at 375 × 812. The weather permission state initially placed its empty forecast text in a narrow grid cell; this was corrected by making that state span the full forecast grid, and a follow-up mobile capture verified the readable full-width callout.
