# V8.0.0 — Production Regression Repair

- Replaced the deployed demo QR placeholder with real, decodable SVG QR codes and QR open/print/download actions.
- Added CORS/OPTIONS and Admin validation to production `qr-svg`.
- Corrected Supabase publishable-key authentication headers for anonymous browser traffic.
- Added resilient individual movement maps with explicit no-data/error states and a local SVG geographic fallback when Leaflet cannot load.
- Applied latest demo reviews and cumulative corrections to effective observation state; public release now requires verified records.
- Added migration `003_production_regression_repairs.sql` so corrected lat/lng values propagate through effective/public GIS and public GPS accuracy is not returned.
- Made Scientist snapshots tolerant of Admin-only audit-log RLS.
- Expanded animal master-data correction and status editing.
- Added secure profile-photo upload/change/remove using private Supabase Storage.
- Added protected Scientist/Admin sighting-photo review.
- Added first-time Administrator TOTP MFA enrolment with QR/manual secret and AAL2 verification.
- Added Padloper production taxon, last-seen correction, GPS-field compatibility and QR site-URL hardening.
- Added function deployment script with correct JWT gateway settings.
- Bumped PWA cache and demo storage namespaces to avoid stale V7 data/behaviour.
- Added deep regression suite; 29/29 automated tests pass.

# V7.0.0 — Three Profiles + HOA Nature Integration

- Consolidated all protected operational roles into **Scientist** and **Administrator**; Public remains anonymous.
- Scientist now combines the former Ranger, Researcher and Veterinarian capabilities: field verification, GIS, health cases, clinical events, measurements, device/deployment records and research exports.
- Added compatibility normalisation for legacy V6 sessions and a SQL migration that converts existing legacy staff profiles to Scientist.
- Updated baseline Supabase RLS policies and observation provenance vocabulary for the new role model.
- Replaced Shelly's local Leopard-tortoise illustration with Nautilus Bay `Gallery_3.jpg`.
- Replaced Atlas's local Angulate-tortoise illustration with Nautilus Bay `Gallery_7.jpg`.
- Updated the image security allow-list and CSP so approved Nautilus Bay HOA images can load on GitHub Pages.
- Added explicit Google Roboto / Roboto Slab web-font loading with CSP support and resilient fallbacks.
- Expanded About with source-grounded Nautilus Bay reserve and nature information: reserve/fynbos/beach scale, Garden Route/Mossel Bay context, whales/dolphins, birdlife, small buck/other mammals, dunes and fynbos.
- Added dedicated responsive nature cards and reserve-fact presentation.
- Removed the top-level `assets/` folder to avoid the GitHub browser-upload problem; remaining local tortoise fallback artwork moved to `icons/`.
- Updated native staging so optional asset directories do not block APK staging.
- Added V7 regression tests for three-profile access, HOA imagery, nature content and no-assets-folder deployment.

# V5.0.0 — Adaptive App/Web + Native-Ready Architecture

- Added responsive app presentation through 1024 px with persistent five-tab navigation.
- Added safe-area-aware app bar, bottom sheet navigation and installed-PWA styling.
- Preserved desktop header navigation, staff sidebars, wide analytics and professional table workflows above 1024 px.
- Added sticky one-handed sighting workflow controls and mobile/tablet map sizing.
- Added native/Web Share integration and haptic feedback capability.
- Added `src/platform.js` to isolate geolocation, camera stream, haptics, sharing, display-mode detection and future native back handling.
- Added PWA shortcuts, launch handler, display override and iOS/mobile web-app metadata.
- Added Capacitor staging configuration and build script for future Android/iOS wrapping.
- Added Trusted Web Activity Digital Asset Links template as an alternative APK path.
- Added adaptive/mobile/native QA regression tests and expert review documentation.

# Changelog

## 4.0.0 — Spatial Analytics & Research Visualisation

- Added public Conservation Insights page.
- Added public thematic map modes: species, recency, density and observations.
- Added staff Spatial Analysis Lab with exact authorised coordinates.
- Added species, condition, quality, verification, recency and density thematic mapping.
- Added animal/species/condition/verification/date filtering.
- Added GPS accuracy circles, metric scale and interactive distance measurement.
- Added filtered KML, KML-with-inferred-connections, GeoJSON and CSV map exports.
- Added full observation CSV and KML research exports.
- Added sightings-over-time, species, behaviour, condition, quality and time-of-day charts.
- Added weekly activity fingerprint matrix, last-seen watchlist and conservative movement-displacement metrics.
- Added accessible tabular alternatives to charts and map views.
- Added V4 analysis and KML regression tests.

## 3.0.0 — Three-cycle expert assurance release
- Converted the public sighting form to a real sequential field wizard with draft preservation.
- Added route focus management, native modal focus control and accessible current-state semantics.
- Moved staff sessions to session storage, added token refresh and one authorised-request retry.
- Disabled public movement polylines; public history now presents generalised observation points only.
- Added searchable animal directory and conservation-status display.
- Added real profile-photo slots with a branded offline fallback illustration.
- Added friendly public quality bands while retaining numerical quality scores for staff/research use.
- Completed English/Afrikaans dictionary parity and added an automated localisation regression test.
- Restricted service-worker cache cleanup to the Nautilus app prefix for GitHub Pages origin safety.
- Added user-controlled PWA update activation with `SKIP_WAITING` and controller reload behaviour.
- Added official Leaflet 1.9.4 Subresource Integrity hashes and exact-version pinning.
- Added V3 static regression guards for service-worker/cache and navigation integrity.
- Added a controlled `public-profile-photo` Edge Function so approved profile images can be served from private storage without opening the bucket publicly.
- Extended public animal RPCs with taxon conservation status and approved profile-photo references.
- Added three formal expert review-cycle records and consolidated assurance report.

## 2.0.0 — World-class multidisciplinary redesign
- Rebuilt public UX around fast, safe field observation.
- Changed public historical map from exact to conservation-safe generalised positions.
- Added configurable recent-location delay.
- Added animal/taxon/identifier domain model.
- Added immutable observation/correction/review model.
- Added quality scoring.
- Added multi-photo compression flow and private storage architecture.
- Added health cases and clinical events.
- Added measurements/provenance.
- Added device/deployment/telemetry architecture.
- Added CSV/GeoJSON/Movebank-style exports.
- Added Supabase RLS and admin MFA/AAL2 requirement.
- Added controlled anonymous Edge Function ingestion, optional Turnstile validation and health email alerts.
- Added self-hosted QR SVG generation with QR provenance in URL.
- Added full English/Afrikaans string system.
- Added privacy-safe product telemetry and web performance metrics.
- Added CI/unit/static checks, security headers and formal release gates.

## V6 — 2026-08-18 — Nautilus Bay visual integration

- Integrated the tracker with the visual language of the Nautilus Bay HOA website.
- Adopted the Hestia-style Roboto / Roboto Slab typography system with resilient local fallbacks.
- Shifted public surfaces toward Hestia's charcoal/grey material hierarchy while retaining conservation-specific ocean/fynbos functional colours.
- Added Nautilus Bay's existing scenic imagery as the home hero and reserve-story image, with CSS fallbacks if the remote image is unavailable.
- Replaced demo emoji/placeholder presentation with three local, original tortoise illustrations for Leopard tortoise, Angulate tortoise and Padloper demonstration records.
- Added reserve landscape context and 600 ha / 400 ha fynbos / 9 km beach facts on the public home screen.
- Restyled navigation, cards, profile surfaces, statistics, forms, buttons and footer to bridge the HOA website and the installed-app experience.
- Preserved all V5 adaptive mobile/tablet navigation, desktop research UI, GIS analytics, offline-first operation and APK/native-readiness architecture.
