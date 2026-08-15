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
