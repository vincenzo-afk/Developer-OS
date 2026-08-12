# Developer OS QA Notes

## 2026-08-12 — Settings personalization visual check

The desktop Settings window was captured at a 1280 × 720 viewport with the `settings` application opened directly. The accent-color options, taskbar layout selectors, desktop-density selectors, and appearance toggles were visible within the Mica-style window and did not overlap the desktop shell.

The same surface was captured at a 375 × 812 viewport. The mobile window retained usable selector controls after the accent options were condensed into a four-swatch grid. The Settings sidebar reduced to icons and the content remained scrollable inside the window.

## Outstanding verification

The remaining final QA pass must exercise and document core desktop and mobile application surfaces plus persistence-sensitive interactions before release.

## 2026-08-12 — Desktop application QA

At a 1280 × 720 viewport, direct-entry captures confirmed that the About workstation, Project Hub, browser, permission-gated Weather, Portfolio Assistant, Contact, and Settings windows each opened inside the desktop shell without clipping or visible layout errors. The Weather window correctly remained permission-gated when the preview environment did not grant browser geolocation.

The original opaque raster source artwork created intermittent low-contrast or blank-looking icon tiles. The shared glyph layer kept every desktop, taskbar, Start, and title-bar icon recognizable during remediation. This interim finding is superseded by the transparent Microsoft Fluent PNG replacement and focused pinned-fallback audit documented below.

## 2026-08-12 — Mobile application QA

At a 375 × 812 viewport, direct-entry captures confirmed usable responsive layouts for the About workstation, Project Hub, browser, Portfolio Assistant, Contact, and Settings windows. Long project lists and settings controls remain vertically scrollable inside the mobile-height window. The contact form stacks into a single column, the assistant retains its suggested prompts and message input, and the browser preserves its search field and quick-access list without horizontal clipping.

## 2026-08-12 — Build and preference validation

The full suite passed after the icon refinement: unit tests, TypeScript checking, and production build. A dedicated persistence test now confirms that the accent, icon scale, taskbar alignment, motion, and sound choices round-trip through browser storage, sanitize invalid stored values, and reset safely. The production build completed with only the existing bundle-size advisory for large optional language and diagram assets.

## 2026-08-12 — Transparent raster replacement

The prior opaque icon sources were replaced with twelve transparent RGBA PNGs from Microsoft Fluent Emoji’s MIT-licensed repository. The icon mapping, source inventory, and license provenance are recorded in `asset-sources.md`. A new desktop capture showed the transparent icons distinctly in the desktop shortcut rail, window title bars, and taskbar while retaining the Lucide fallback only for an image-load failure. Direct desktop captures also confirmed the Project Hub, browser, assistant, contact, Settings, weather-permission, and terminal surfaces render without clipping.

Interactive validation for Start, window manipulation, real location permission, contact delivery, and wallpaper persistence remains pending because those flows require a visitor/browser action and must not be simulated with a message or live external email.

The mobile raster verification captured the same asset set in direct entries for Project Hub, browser, assistant, contact, Settings, weather, and terminal. Their window-title and taskbar icon presentation remained visible at 375 × 812. The weather permission state initially placed its empty forecast text in a narrow grid cell; this was corrected by making that state span the full forecast grid, and a follow-up mobile capture verified the readable full-width callout.

## 2026-08-12 — Interactive browser QA (in progress)

The desktop shell was opened in the connected browser at the About Me workspace. A native click was issued to the visible minimize control, but the browser capture still showed the window. This needs a focused re-check before minimize behavior can be marked verified; no completion claim has been made for the remaining interaction tasks.

The cause was title-bar pointer capture being allowed to bubble through the window controls. After isolating the control group from title-bar pointer and double-click handlers, a second native browser click on Minimize hid the About Me window and exposed the desktop workspace. This confirms the corrected minimize flow; maximize and close still require separate verification.

The workspace was then reloaded through its direct About Me entry point, restoring the window with its minimize, maximize, close, Start, and taskbar controls all exposed for the next interaction checks.

Native browser clicks then confirmed that Maximize expands the About Me window across the workspace and that Close removes the maximized window, returning to the desktop. Together with the previous minimize check, all three standard title-bar controls now have direct interaction evidence after the pointer-capture fix.

On a fresh desktop load, a native click on the Start control opened the launcher. The browser exposed its search field, pinned app grid, recommended Project Hub and Terminal entries, account controls, and taskbar. The Start surface rendered over, rather than replacing, the active workspace.

The taskbar’s Portfolio Assistant control opened the assistant window and its verified-projects suggestion was submitted. The request visibly entered the conversation with the expected pending indicator; the response will be checked after it completes.

The assistant returned a detailed Markdown project list drawn from the portfolio record, including project names, descriptions, technology, and status. The taskbar’s Contact Bharani control then opened the contact window, exposing the required name, email, subject, message, privacy explanation, and send control. No external email was sent during QA.

The taskbar weather control opened the Atmosphere window. With location permission intentionally not requested from the connected browser, the app accurately showed its full-width permission explanation, the explicit “Use my location” action, an unavailable snapshot state, and its Open-Meteo and no-storage disclosures.

The Settings window exposed the documented personalization controls. Selecting Amethyst immediately changed the active accent and the Settings status readout to `#A99AD1`, confirming live preference application without a reload. The preview will be returned to its default Ember brass setting after this check.

The default Ember brass accent was restored successfully, with the Settings readout returning to `#D49A5C`.

After the title-bar event-propagation repair and interaction QA updates, the full regression command passed: unit tests, TypeScript checking, and production build. The build retains only its existing advisory about optional large chunks.

## 2026-08-12 — Explicit desktop shell icon audit

The connected-browser audit showed the transparent raster treatment on the desktop shortcut grid, Settings title bar, taskbar, and Start menu at the same time. The visible This PC, Project Hub, About Me, Tech Stack, Achievements, and Socials icons are appropriately scaled and legible across those surfaces. The Start-menu audit also identified that the `GitHub Power` and `Terminal` pinned entries remain visually empty; they require a focused mapping or fallback review before icon remediation can be closed.

## 2026-08-12 — Final pinned icon fallback verification

The focused fallback repair overlays the `Activity` and `Terminal` semantic glyphs only for the two blank raster mappings while retaining their uploaded transparent raster assets. Final desktop captures show GitHub Power and Terminal as visible, correctly centered Start-menu tiles; the terminal title bar and the taskbar also retain their compact icon treatment. The corresponding mobile Start capture shows the same two entries as visible rather than empty. The full shell now has explicit desktop and mobile evidence for the shortcut grid, Start menu, taskbar, and title-bar icon surfaces.

## 2026-08-12 — Real mobile interaction pass

A real Chromium mobile-viewport pass at **375 × 812** completed without entering contact or location data. It verified the Start launcher, opening Terminal, entering the safe `projects` command, minimizing and restoring Terminal through Start, opening Portfolio Assistant from the compact taskbar, opening the Contact form through Start search without submitting, and opening the permission-aware Atmosphere surface through Start search without invoking its location request. The compact taskbar intentionally exposes primary pinned applications while the complete app catalog remains available from Start search.

## 2026-08-12 — Real desktop window-drag verification

A separate real Chromium desktop pass at **1280 × 720** pressed, moved, and released the About Me title bar through eight pointer-move steps. The window moved from **x = 142** to **x = 242** (a **100 px** horizontal delta) and remained vertically stable at **y = 78**. This complements the deterministic boundary unit test and confirms the shipped pointer-capture, request-animation-frame update, and release path work together in the rendered desktop shell.

## 2026-08-12 — Expanded mobile interaction and window behavior pass

The expanded 375 × 812 Chromium pass completed all ten checks without sending contact email or requesting a visitor location. In addition to the initial launcher, Terminal, Assistant, Contact, and Atmosphere checks, it now verifies the Browser’s safe public-search handoff and applies a Settings accent control. It verifies that minimize and maximize state transitions remain accessible on mobile and that a minimized Settings window restores through Start search. Responsive CSS intentionally fixes mobile windows to a 10 px inset full-window workspace (`top` and `left` are constrained), so the script verifies that a title-bar drag does **not** move the window rather than treating this intentional behavior as a defect. Desktop retains full drag support, as verified separately.

### Post-repair verification record

The repaired state was re-captured in the desktop Start menu and Terminal window, and in the mobile Start-menu capture. GitHub Power and Terminal both render visible, centered icon treatments; their shell sizing aligns with the 25 px Start-menu, 22 px taskbar, and 17 px title-bar presentation rules. The regression suite was then re-run successfully: **all unit tests passed, TypeScript checking passed, and the production build completed**. The build emitted only the existing advisory about optional chunks exceeding the default size threshold.

## 2026-08-12 — Wallpaper persistence verification

The new IndexedDB-backed wallpaper test covers upload persistence, reload-style restoration, and reset cleanup for a video file. A second test covers URL wallpaper persistence and correctly infers a video URL from its extension. These run alongside the existing customization-store tests for accent, icon scale, taskbar alignment, reduced motion, and sound preferences. The complete suite passed with **six test files and twelve tests**, followed by a clean TypeScript check and production build. The build completed with the pre-existing optional-chunk size advisory only.

## 2026-08-12 — Terminal and browser interaction checks

From the Start menu, the repaired Terminal tile opened the native terminal surface. Its safe `projects` command returned the portfolio’s 65 curated entries and listed the three documented current builds. The Edge-style browser accepted `Bharani Kumar GitHub` in its search field and transformed it into a Google query URL. Because Google does not generally permit embedding, the application accurately displayed its transparent hand-off state with an `Open google.com` control rather than falsely claiming to show embedded search results.
