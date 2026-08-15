# Three-Cycle Expert Audit — Nautilus Bay Digital Conservation Platform V3

Date: 2026-08-13

## Scope and evidence boundary
The review targeted the public deployment URL `https://leemcq.github.io/tortoise-tracker/#/` and the exact project codebase prepared for that deployment. The remote GitHub Pages URL could not be rendered by the available web gateway during the audit (`Cache miss`), and the controlled Chromium environment blocked local/file navigation by organisation policy. Therefore the report does **not** claim a completed remote-browser click-through of the deployed URL. Verification performed on the replacement build includes static/source inspection, HTTP-served asset checks, JavaScript syntax checks and automated regression/unit tests.

## Review Cycle 1 — Functional safety, accessibility and reliability
Panel: Mobile UX/field research, accessibility, cybersecurity, offline/reliability.

Accepted and implemented:
- True sequential sighting wizard rather than simultaneous pseudo-steps.
- GPS and photograph progression gates.
- Interrupted structured draft preservation without storing precise coordinates/photos in localStorage.
- Stable client submission UUID throughout the sighting.
- Native modal focus trap/focus restoration, route focus and `aria-current` state.
- Session-scoped staff credentials, token refresh and single 401 retry.
- Bot verification tokens excluded from offline queues.

Result: accepted into baseline and regression checked.

## Review Cycle 2 — Conservation science, GIS and public experience
Panel: Conservation security, movement ecology/GIS, product design, citizen science, language/content.

Accepted and implemented:
- Public historical points remain spatially generalised and no longer receive connecting movement polylines.
- Anonymous public history no longer exposes GPS-accuracy metadata.
- Searchable animal directory.
- Taxon conservation status surfaced when supplied by the scientific registry.
- Real profile-photo slot with an offline-safe branded fallback.
- Friendly public quality band instead of exposing the internal 0–100 score.
- Public English/Afrikaans copy consolidated into the translation system.

Result: accepted into baseline and regression checked.

## Review Cycle 3 — Release engineering, localisation and PWA assurance
Panel: PWA/release engineering, supply-chain security, QA/localisation, front-end reliability.

Accepted and implemented:
- Application-specific service-worker cache prefix so other `github.io` applications are never deleted by Nautilus cache cleanup.
- Controlled update prompt; waiting worker activates only after user action and then reloads on `controllerchange`.
- Network-first navigation/configuration strategy.
- Leaflet 1.9.4 pinned with the publisher's documented SRI hashes.
- English/Afrikaans key-parity automated test.
- Remaining public navigation/status/error copy localised.
- Missing-image `/undefined` defect corrected.
- Map popup language follows application language.
- Duplicate directory-navigation regression removed and guarded.
- Public approved animal photographs now have a dedicated Edge Function so the private storage bucket remains private.

Result: accepted into baseline and regression checked.

## Final automated assurance result
- Static asset integrity: PASS
- V3 regression guards: PASS
- JavaScript syntax: PASS
- English/Afrikaans dictionary parity: PASS
- Conservation public-location generalisation test: PASS
- Observation-quality tests: PASS
- GeoJSON export test: PASS
- Movebank-style event export test: PASS
- Automated tests: 6 passed / 0 failed
- HTTP-served application shell/config/service-worker/manifest/app module/fallback asset: HTTP 200

## Release items that still require real external evidence
These cannot be closed by software implementation alone:
- wildlife/veterinary approval of the physical tagging/attachment method;
- actual Nautilus Bay reserve boundary/habitat GIS import and validation;
- formal POPIA PIIA/legal approval;
- independent penetration test;
- independent WCAG 2.2 AA accessibility audit;
- Android/iPhone field acceptance tests under actual reserve connectivity conditions;
- production Supabase credentials, staff identities/MFA and storage configuration;
- production DNS/TLS and final operational monitoring/backup restore exercise.

## Configuration status
The packaged front end intentionally remains in demo mode until legitimate Supabase project values are supplied. Do not publish fabricated credentials. After the production backend is provisioned, set `demoMode:false`, `supabaseUrl` and `supabasePublishableKey` in `config.js`, deploy the listed Edge Functions and complete the release gates.
